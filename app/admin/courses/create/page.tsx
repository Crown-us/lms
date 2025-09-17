"use client";

import Link from "next/link";
import { ArrowLeft, Clock, FileText, BarChart3, Image } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dynamic from 'next/dynamic';

// Shadcn UI Form Components
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

// Import schema dan types - PASTIKAN INI SESUAI
import {
    courseSchema,
    courseLevels,
    coursesStatus,
    CourseSchemaType,
} from "@/lib/zodSchemas";
import {Uploader} from "@/components/file-uploader/Uploader";

// Data Kategori
const courseCategories = [
    "Web Development", "Mobile Development", "Data Science", "Machine Learning",
    "Artificial Intelligence", "DevOps", "Cybersecurity", "Cloud Computing",
    "Database Management", "UI/UX Design", "Digital Marketing", "Business Analytics",
    "Project Management", "Software Testing", "Game Development", "Blockchain",
    "IoT (Internet of Things)", "Network Administration", "Programming Languages", "Other"
];

// Dynamic import untuk RichTextEditor
const RichTextEditor = dynamic(() => import('@/components/rich-text-editor/Editor').then(mod => mod.RichTextEditor), {
    ssr: false,
    loading: () => <div className="w-full p-4 border rounded-lg min-h-[200px] animate-pulse bg-muted" />,
});

export default function CourseCreationPage() {
    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: "",
            description: "",
            fileKey: "",
            price: undefined, // Ubah dari 0 ke undefined
            duration: undefined, // Ubah dari 0 ke undefined
            level: "Beginner",
            category: "",
            status: "Draft",
            smallDescription: "",
            slug: "",
            thumbnailUrl: "",
        },
    });

    // Auto-generate slug dari title
    const watchTitle = form.watch("title");
    const generateSlug = () => {
        if (watchTitle) {
            const slug = watchTitle
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .trim();
            form.setValue("slug", slug);
        }
    };

    const onSubmit = async (data: CourseSchemaType) => {
        try {
            // Transform data menggunakan courseSchema untuk validasi final
            const transformedData = courseSchema.parse({
                ...data,
                price: Number(data.price),
                duration: Number(data.duration),
            });

            console.log("Submitted Data:", transformedData);
            // Tambahkan API call di sini dengan transformedData
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/courses"
                        className={buttonVariants({ variant: "outline", size: "icon" })}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Course</h1>
                        <p className="text-muted-foreground">
                            Add a new course to your platform
                        </p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>
                                    Provide the essential details about your course.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter course title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL Slug</FormLabel>
                                            <div className="flex gap-2">
                                                <FormControl>
                                                    <Input placeholder="course-url-slug" className="font-mono" {...field} />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={generateSlug}
                                                    disabled={!watchTitle}
                                                >
                                                    Generate
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {courseCategories.map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="fileKey"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thumbnail Image</FormLabel>
                                            <FormControl>
                                                <Uploader onChange={field.onChange} value={field.value} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="smallDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Brief description for course listings"
                                                    className="min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Description</FormLabel>
                                            <FormControl>
                                                <RichTextEditor field={field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* File Upload - Tambahan untuk fileKey */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Course Materials
                                </CardTitle>
                                <CardDescription>
                                    Upload course files and materials.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="fileKey"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course File Key</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter file key or upload identifier"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Course Settings
                                </CardTitle>
                                <CardDescription>
                                    Configure pricing, duration, and difficulty level.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price (Rp)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="299000"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        field.onChange(value === "" ? undefined : Number(value));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration (Minutes)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="120"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        field.onChange(value === "" ? undefined : Number(value));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Level</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {courseLevels.map((level) => (
                                                        <SelectItem key={level} value={level}>
                                                            {level}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Status Field - Tambahan jika diperlukan */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Publication Settings
                                </CardTitle>
                                <CardDescription>
                                    Set course status and publication options.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {coursesStatus.map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <div className="flex items-center gap-4 justify-end">
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/courses">Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Creating..." : "Create Course"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}