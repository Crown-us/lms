import { adminGetCourse } from "@/app/data/admin/admin-get-course"; // Ganti import
import { notFound } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {EditCourseForm} from "@/app/admin/courses/[courseId]/edit/_components/EditCourseForm";
import {CourseStructure} from "@/app/admin/courses/[courseId]/edit/_components/CourseStructure";

interface PageProps {
    params: Promise<{
        courseId: string;
    }>;
}

export default async function EditRoute({ params }: PageProps) {
    // Await params terlebih dahulu
    const { courseId } = await params;

    try {
        // Ganti pakai adminGetCourse untuk single course dengan chapters
        const data = await adminGetCourse(courseId);

        // Debug: Log data untuk memastikan struktur benar
        console.log('Course data:', data);


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
                                <EditCourseForm data={data}/>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="course-structure">
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Structure</CardTitle>
                                <CardDescription>Manage lessons, modules, and course content</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CourseStructure data={data}/>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        );
    } catch (error) {
        console.error('Error fetching course:', error);
        notFound();
    }
}