import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { notFound } from "next/navigation";

// Tipe untuk params adalah objek biasa, bukan Promise
interface PageProps {
    params: {
        courseId: string;
    };
}

export default async function EditRoute({ params }: PageProps) {
    // Langsung ambil courseId dari params, tanpa await
    const { courseId } = params;

    // Panggil fungsi untuk mengambil semua courses, lalu cari berdasarkan ID
    const courses = await adminGetCourses();
    const data = courses.find(course => course.id === courseId);

    // Pengaman: Jika course dengan ID tersebut tidak ada, tampilkan halaman 404
    if (!data) {
        notFound();
    }

    return (
        <div>
            <h1>
                Edit Course: <span>{data.title}</span>
            </h1>
            {/* Di sini nanti kamu bisa tambahkan form editnya */}
        </div>
    );
}