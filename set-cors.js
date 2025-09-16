import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
dotenv.config();
const client = new S3Client({
    region: "auto",
    endpoint: "https://fly.storage.tigris.dev",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const corsConfig = {
    Bucket: process.env.edukt-lms,
    CORSConfiguration: {
        CORSRules: [
            {
                AllowedOrigins: ["*"],
                AllowedHeaders: ["*"],
                AllowedMethods: ["PUT", "POST", "GET", "HEAD"],
                MaxAgeSeconds: 3600,
                ExposeHeaders: ["ETag"]
            }
        ]
    }
};

try {
    await client.send(new PutBucketCorsCommand(corsConfig));
    console.log("CORS berhasil di-set!");
} catch (error) {
    console.error("Error:", error);
}