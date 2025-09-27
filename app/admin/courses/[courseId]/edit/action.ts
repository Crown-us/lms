"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {ApiResponse} from "@/lib/types";
import {courseSchema, CourseSchemaType} from "@/lib/zodSchemas";
import {prisma} from "@/lib/db";

export async function editCourse(data: CourseSchemaType, courseId: string): Promise<ApiResponse> {
    const user = await requireAdmin()

    try {
        const result = courseSchema.safeParse(data);

        if(!result.success) {
            return {
                status: "error",
                message:"Invalid data"
            }
        }

        await prisma.course.update({
            where: {
                id: courseId,
                userId: user.user.id
            },
            data: {
                ...result.data,
            }
        })

        return {
            status: "success",
            message:"Successfully edited course"
        }
    } catch {
        return {
            status: "error",
            message:"Could not edit course"
        }
    }
}