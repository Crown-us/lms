import "server-only";

// s3-client.ts
import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file dari path yang spesifik
dotenv.config({ path: path.join('D:', 'lms', 'lms', '.env') });

// Atau jika file ini ada di dalam project folder yang sama dengan .env
// dotenv.config(); // ini akan otomatis cari .env di root project

export const S3 = new S3Client({
    region: process.env.AWS_REGION || 'auto',
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    forcePathStyle: false,

});

