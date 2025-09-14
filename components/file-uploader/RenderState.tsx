import { cn } from "@/lib/utils";
import {CloudUpload, CloudUploadIcon, ImageIcon} from "lucide-react";
import {Button} from "@nextui-org/react";


export function RenderEmptyState({isDragActive}: {isDragActive: boolean})
{
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
                <CloudUpload className={cn(
                    'size-6 text-muted-foreground ',
                    isDragActive && "text-primary",

                )}></CloudUpload>
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
    )
}

export function RenderErrorState(){
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12
            rounded-full bg-destructive/30 mb-4">
                <ImageIcon className={cn(
                    'size-6 text-destructive ',

                )}
                />

            </div>
            <p className="text-base font-semibold">Upload Failed</p>
            <p className="text-xs mt-1 text-muted-foreground ">Something went wrong</p>
            <Button className="mt-4" type="button">Retry file selection</Button>
        </div>
    )
}