"use client";

import { useDropzone } from 'react-dropzone';
import { useCallback } from "react";

import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {RenderEmptyState, RenderErrorState} from "@/components/file-uploader/RenderState";

export function Uploader() {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Lakukan sesuatu dengan file
        console.log(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024,
    });

    return (
        <Card
            {...getRootProps()}
            className={cn(
                "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64", // cursor-pointer dihapus dari sini
                isDragActive
                    ? 'border-primary bg-primary/10 border-solid'
                    : 'border-border hover:border-primary'
            )}
        >
            <CardContent className="flex flex-col items-center justify-center h-full w-full text-center">
                <input {...getInputProps()} />

                <RenderEmptyState isDragActive={isDragActive} />
            </CardContent>
        </Card>
    );
}