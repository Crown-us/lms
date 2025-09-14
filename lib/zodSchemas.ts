import { z } from "zod";

// Define constant enums
export const courseLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
] as const;

export const coursesStatus = [
    "Draft",
    "Published",
    "Archived",
] as const;

export const courseCategories = [
    'Development',
    'Business',
    'Financial',
    'Artificial Intelligence',
    'Marketing',
    'Design',
] as const;

export const courseSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(100, { message: "Title must be at most 100 characters long" }),

    // --- PERUBAHAN DI SINI ---
    description: z
        .string()
        .min(15, { message: "Description cannot be empty" }), // Validasi disederhanakan untuk Tiptap JSON

    fileKey: z
        .string()
        .min(1, { message: "File is required" }),

    // --- PERUBAHAN DI SINI ---
    price: z
        .coerce.number() // <-- PASTIKAN MENGGUNAKAN .coerce
        .min(1, { message: "Price must be at least 1" }),

    duration: z
        .coerce.number() // <-- PASTIKAN MENGGUNAKAN .coerce
        .min(3, { message: "Duration must be at least 3 minutes" })
        .max(500, { message: "Duration must be at most 500 minutes" }),
    level: z.enum(courseLevels),

    category: z
        .string()
        .min(1, { message: "Category is required" }),

    smallDescription: z
        .string()
        .min(3, { message: "Small description must be at least 3 characters long" })
        .max(200, { message: "Small description must be at most 200 characters long" }),

    slug: z
        .string()
        .min(3, { message: "Slug must be at least 3 characters long" })
        .regex(/^[a-z0-9-]+$/, {
            message: "Slug can only contain lowercase letters, numbers, and hyphens",
        }),

    status: z.enum(coursesStatus),

    thumbnailUrl: z
        .string()
        .url("Please enter a valid URL")
        .optional()
        .or(z.literal("")),
});

// Export inferred type
export type CourseSchemaType = z.infer<typeof courseSchema>;