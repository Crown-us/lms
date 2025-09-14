import { ReactNode } from "react";
import { Navbar } from "@/app/(public)/_components/Navbar";

interface LayoutPublicProps {
    children: ReactNode;
}

export default function LayoutPublic({ children }: LayoutPublicProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}