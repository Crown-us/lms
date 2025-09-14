"use client";

import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureProps {
    title: string;
    description: string;
    icon: string;
}

const features: FeatureProps[] = [
    {
        title: "Comprehensive Courses",
        description: "Access a wide range of carefully crafted courses designed by industry experts.",
        icon: "📚",
    },
    {
        title: "Interactive Learning",
        description: "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
        icon: "🎮",
    },
    {
        title: "Progress Tracking",
        description: "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
        icon: "📊",
    },
    {
        title: "Community Support",
        description: "Join a vibrant community of learners and instructors to collaborate and share knowledge.",
        icon: "👥",
    },
];

export default function Home() {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    async function handleLogout() {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/");
                        toast.success("Sign Out!");
                    },
                },
            });
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Failed to sign out");
        }
    }

    return (
        <>
            {/* Hero Section */}
            <section className="relative py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <Badge variant="outline">The Future of Online Courses</Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            Elevate your Learning Experience
                        </h1>
                        <p className="max-w-[700px] text-muted-foreground md:text-xl">
                            Discover a new way to learn with our modern, interactive learning management system. Access high-quality courses anytime, anywhere.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            {session ? (
                                <>
                                    <Link
                                        className={buttonVariants({
                                            size: "lg",
                                        })}
                                        href="/courses"
                                    >
                                        Explore Courses
                                    </Link>
                                    <Button size="lg" variant="outline" onClick={handleLogout}>
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        className={buttonVariants({
                                            size: "lg",
                                        })}
                                        href="/courses"
                                    >
                                        Explore Courses
                                    </Link>
                                    <Link
                                        className={buttonVariants({
                                            size: "lg",
                                            variant: "outline",
                                        })}
                                        href="/login"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>

                        {session && (
                            <div className="mt-4 text-sm text-muted-foreground">
                                Welcome back, {session.user.name || session.user.email}!
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-secondary/10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="group p-6 rounded-2xl shadow-sm border hover:shadow-xl transition duration-300 bg-white dark:bg-muted"
                            >
                                <CardHeader className="flex flex-col items-center text-center space-y-4">
                                    <div className="text-5xl group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-xl font-semibold">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-center text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
