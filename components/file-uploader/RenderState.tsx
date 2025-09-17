"use client";

import { cn } from "@/lib/utils";
import {CloudUpload, ImageIcon, Loader2, XIcon} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
                <CloudUpload
                    className={cn(
                        "size-6 text-muted-foreground",
                        isDragActive && "text-primary"
                    )}
                />
            </div>
            <p className="text-base font-semibold text-foreground">
                Drop your files here or{" "}
                <span className="text-primary font-bold cursor-pointer">
                    click to upload
                </span>
            </p>
            <Button type="button" className="mt-4">
                Select a file
            </Button>
        </div>
    );
}

export function RenderErrorState() {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
                <ImageIcon className="size-6 text-destructive" />
            </div>
            <p className="text-base font-semibold">Upload Failed</p>
            <p className="text-xs mt-1 text-muted-foreground">
                Something went wrong
            </p>
            <Button className="mt-4" type="button">
                Retry file selection
            </Button>
        </div>
    );
}

export function RenderUploadedState({
                                        previewUrl,
                                        onRemove,
                                    }: {
    previewUrl: string;
    onRemove: () => void;
}) {
    return (
        <div className="relative w-full h-full">
            <Image
                src={previewUrl}
                alt="Uploaded File"
                fill
                className="object-contain p-2"
            />
            <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 rounded-full h-6 w-6 p-0"
                onClick={onRemove}
            >
                <XIcon className="size-4"/>
            </Button>
        </div>
    );
}

export function RenderUploadingState({
                                         progress,
                                         file,
                                     }: {
    progress: number;
    file: File;
}) {
    return (
        <div className="w-full max-w-xs text-center flex justify-center items-center flex-col">
            <p className="text-sm font-medium text-foreground">Uploading file...</p>
            <p className="mt-1 text-xs text-muted-foreground truncate w-full px-4">{file.name}</p>

            <div className="w-full mt-4">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{`${progress}%`}</p>
            </div>
        </div>
    );
}