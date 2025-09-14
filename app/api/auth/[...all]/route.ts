import ip from "@arcjet/ip";
import arcjet, {
    type ArcjetDecision,
    type BotOptions,
    type EmailOptions,
    type ProtectSignupOptions,
    type SlidingWindowRateLimitOptions,
    detectBot,
    protectSignup,
    slidingWindow,
} from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Inisialisasi Arcjet instance dengan rules kosong (rules akan ditambahkan via withRule)
const aj = arcjet({
    key: process.env.ARCJET_KEY!, // Pastikan env variable ini ada
    rules: [], // Rules kosong, akan ditambahkan dengan withRule
    characteristics: ["fingerprint"],
});

// Konfigurasi proteksi email
const emailOptions: EmailOptions = {
    mode: "LIVE",
    block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
};

// Proteksi bot
const botOptions: BotOptions = {
    mode: "LIVE",
    allow: [],
};

// Rate limiting
const rateLimitOptions: SlidingWindowRateLimitOptions<[]> = {
    mode: "LIVE",
    interval: "2m",
    max: 5,
};

// Proteksi signup
const signupOptions: ProtectSignupOptions<[]> = {
    email: emailOptions,
    bots: botOptions,
    rateLimit: rateLimitOptions,
};

// Fungsi perlindungan
async function protect(req: NextRequest): Promise<ArcjetDecision> {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id || ip(req) || "127.0.0.1";

        if (req.nextUrl.pathname.startsWith("/api/auth/sign-up")) {
            // Clone request untuk membaca body tanpa mengkonsumsi stream
            const clonedReq = req.clone();
            let body: any = {};

            try {
                const text = await clonedReq.text();
                if (text) {
                    body = JSON.parse(text);
                }
            } catch (error) {
                console.warn("Failed to parse request body:", error);
            }

            if (typeof body.email === "string") {
                return aj
                    .withRule(protectSignup(signupOptions))
                    .protect(req, { email: body.email, fingerprint: userId });
            } else {
                return aj
                    .withRule(detectBot(botOptions))
                    .withRule(slidingWindow(rateLimitOptions))
                    .protect(req, { fingerprint: userId });
            }
        } else {
            return aj
                .withRule(detectBot(botOptions))
                .protect(req, { fingerprint: userId });
        }
    } catch (error) {
        console.error("Error in protect function:", error);
        // Re-throw error to be handled by the POST handler
        throw error;
    }
}

// Handler default dari better-auth
const authHandlers = toNextJsHandler(auth.handler);

// Export GET langsung
export const GET = authHandlers.GET;

// POST dengan Arcjet protection
export const POST = async (req: NextRequest) => {
    try {
        const decision = await protect(req);

        console.log("Arcjet Decision:", {
            id: decision.id,
            conclusion: decision.conclusion,
            reason: decision.reason,
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return Response.json(
                    {
                        message: "Too many requests. Please try again later.",
                        error: "RATE_LIMITED"
                    },
                    { status: 429 }
                );
            } else if (decision.reason.isEmail()) {
                let message: string;

                if (decision.reason.emailTypes.includes("INVALID")) {
                    message = "Email address format is invalid. Is there a typo?";
                } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
                    message = "We do not allow disposable email addresses.";
                } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
                    message = "Your email domain does not have an MX record. Is there a typo?";
                } else {
                    message = "Invalid email.";
                }

                return Response.json(
                    {
                        message,
                        error: "INVALID_EMAIL",
                        emailTypes: decision.reason.emailTypes
                    },
                    { status: 400 }
                );
            } else if (decision.reason.isBot()) {
                return Response.json(
                    {
                        message: "Bot detected. Access denied.",
                        error: "BOT_DETECTED"
                    },
                    { status: 403 }
                );
            } else {
                return Response.json(
                    {
                        message: "Access denied.",
                        error: "FORBIDDEN"
                    },
                    { status: 403 }
                );
            }
        }

        return authHandlers.POST(req);
    } catch (error) {
        console.error("Error in POST handler:", error);

        // Jika error terjadi saat protection, bypass Arcjet dan lanjutkan ke auth handler
        // untuk menghindari blocking complete authentication
        try {
            return authHandlers.POST(req);
        } catch (authError) {
            console.error("Error in auth handler:", authError);
            return Response.json(
                {
                    message: "Internal server error.",
                    error: "INTERNAL_ERROR"
                },
                { status: 500 }
            );
        }
    }
};