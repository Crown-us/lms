import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import {AdminCourseType} from "@/app/data/admin/admin-get-courses";
import {useConstructUrl} from "@/hooks/use-construct-url";
import Link from "next/link";
import {ArrowRight, Eye, MoreVertical, Pencil, School, TimerIcon, Trash2} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";


interface iAppProps {
    data: AdminCourseType,
}

export function AdminCourseCard({data}: iAppProps) {
    const thumbnailUrl = useConstructUrl(data.fileKey)
    return (
        <Card className="group relative py-0 gap-0">
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon">
                            <MoreVertical className="size-4" />
                            <span className="sr-only">Course Options</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${data.id}/edit`}>
                                <Pencil className="size-4 mr-2" />
                                Edit Course
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            {/* Slug biasanya untuk preview publik, jadi ini sudah benar */}
                            <Link href={`/courses/${data.slug}`}>
                                <Eye className="size-4 mr-2" />
                                Preview
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>

                        {/* --- BAGIAN YANG DIPERBAIKI --- */}
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            asChild
                        >
                            <Link href={`/admin/courses/${data.id}/delete`}>
                                {/* Typo diperbaiki di sini, properti className ditambahkan */}
                                <Trash2 className="size-4 mr-2" />
                                Delete Course
                            </Link>
                        </DropdownMenuItem>
                        {/* --------------------------- */}

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Image src={thumbnailUrl} alt="Thumbnail" width={600} height={400}
                   className="w-full rounded-t-lg aspect-video h-full object-cover " />

            <CardContent className="p-4 " >
                <Link href={`/admin/courses/${data.id}/edit`} className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors " >
                    {data.title}
                </Link>

                <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2 ">{data.smallDescription}</p>
                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p className="text-sm text-muted-foreground">{data.duration} min</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p className="text-sm text-muted-foreground">{data.level}</p>
                    </div>

                </div>
                <Link className={buttonVariants({
                    className: 'w-full mt-4'
                })} href={`/admin/courses/${data.id}/edit`}>
                    Edit Course <ArrowRight className="size-4" />
                </Link>
            </CardContent>


        </Card>
    )
}