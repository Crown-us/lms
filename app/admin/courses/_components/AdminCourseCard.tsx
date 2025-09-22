import {Card} from "@/components/ui/card";
import Image from "next/image";
import {AdminCourseType} from "@/app/data/admin/admin-get-courses";

interface iAppProps {
    data: AdminCourseType,
}

export function AdminCourseCard({data}: iAppProps) {
    return (
        <Card className="group relative">
            <div></div>
            <Image src={data.fileKey} alt="Thumbnail" />
        </Card>
    )
}