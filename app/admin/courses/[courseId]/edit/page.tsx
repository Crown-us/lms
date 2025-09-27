import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { notFound } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {EditCourseForm} from "@/app/admin/courses/[courseId]/edit/_components/EditCourseForm";

interface PageProps {
    params: Promise<{
        courseId: string;
    }>;
}

export default async function EditRoute({ params }: PageProps) {
    // Await params terlebih dahulu
    const { courseId } = await params;

    const courses = await adminGetCourses();
    const data = courses.find(course => course.id === courseId);

    if (!data) {
        notFound();
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Edit Course: {" "}
                <span className="text-primary underline">{data.title}</span>
            </h1>

            <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                    <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
                </TabsList>
                <TabsContent value="basic-info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Info</CardTitle>
                            <CardDescription>Edit basic information about the course</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditCourseForm/>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}