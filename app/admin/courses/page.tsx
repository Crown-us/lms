import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CoursesPage() {
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
                <h1>Here you will see all of the course</h1>

            </div>
        </div>
    );
}