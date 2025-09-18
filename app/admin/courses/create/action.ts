"use server";

import {ApiResponse} from "@/lib/types";
import {prisma} from "@/lib/db";
import {courseSchema, CourseSchemaType} from "@/lib/zodSchemas";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";

export async function CreateCourse(formData: CourseSchemaType): Promise<ApiResponse> {

    try {

        const session = await auth.api.getSession({
            headers: await headers(),
        })
        const validation = courseSchema.safeParse(formData);

        if(!validation.success) {
            return{
                status: "error",
                message: "Invalid Form Data"
            }
        }

        const course = await prisma.course.create({
            data: {
                ...validation.data,
                userId: session?.user.id as string,
            }
        })

        return {
            status: "success",
            message: "Course Created Successfully",
        }

    } catch  {

        return {
            status: 'error',
            message: "Failed to Create Course",
        }
    }
}