import {NextResponse} from "next/server";
import {env} from "@/lib/env";
import {S3} from "@/lib/S3Client";
import {DeleteObjectCommand} from "@aws-sdk/client-s3";
import {requireAdmin} from "@/app/data/admin/require-admin";

export async function DELETE(request: Request) {
    const session = await requireAdmin();
    try {
        const body = await request.json();

        const key = body.key;

        if(!key) {
            return NextResponse.json(
                {error: "Missing or invalid Key"},
                { status: 400 }
            );
        }

        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: key,
        })

        await S3.send(command);

        return NextResponse.json(
            { message: "File deleted successfully." },
            { status: 200}
        )

    } catch {
        return NextResponse.json(
            {error: "Internal server error"},
            { status: 500 }
        );
    }
}