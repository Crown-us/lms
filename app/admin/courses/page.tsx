import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {adminGetCourses} from "@/app/data/admin/admin-get-courses";
import {AdminCourseCard} from "@/app/admin/courses/_components/AdminCourseCard";

export default async function CoursesPage() {
    const data = await adminGetCourses();
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Courses</h1>
                    <p className="text-muted-foreground">
                        Manage and create your courses
                    </p>
                </div>

                <Link
                    className={buttonVariants({ variant: "default", size: "default" })}
                    href="/admin/courses/create"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                </Link>
            </div>

            {/* Placeholder for courses content */}
            <div>
                {data?.map((course) => (
                    <AdminCourseCard key={course.id} data={course} />
                ))}

            </div>
        </div>
    );
}