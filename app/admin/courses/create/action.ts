"use server";

import {ApiResponse} from "@/lib/types";
import {prisma} from "@/lib/db";
import {courseSchema, CourseSchemaType} from "@/lib/zodSchemas";
import {requireAdmin} from "@/app/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import {detectBot, fixedWindow, request} from "@arcjet/next";

const aj = arcjet.withRule(
    detectBot({
        mode: 'LIVE',
        allow: [],
    })

).withRule(
    fixedWindow({
        mode: 'LIVE',
        window: '1m',
        max: 5,
    })
)


export async function CreateCourse(formData: CourseSchemaType): Promise<ApiResponse> {

    const session = await requireAdmin();

    try {
        const req = await request()
        const decision = await aj.protect(req, {
            fingerprint: session.user.id,
        })

        if (decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return {
                    status: 'error',
                    message: "You have been blocked due to rate limit",
                }
            } else{
                return {
                    status: 'error',
                    message: "You are a bot! if this a mistake contact our support",
                }
            }
        }
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