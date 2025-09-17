"use client";

import {FileRejection, useDropzone} from 'react-dropzone';
import {useCallback, useState, useEffect} from "react";

import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {RenderEmptyState, RenderErrorState, RenderUploadingState, RenderUploadedState} from "@/components/file-uploader/RenderState";
import {toast} from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType: "image" | "video";
}

interface iAppProps{
    value?: string;
    onChange?: (value: string) => void;
}

export function Uploader({onChange, value  }: iAppProps) {

    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: "image",
    });

    // Cleanup object URL untuk mencegah memory leak
    useEffect(() => {
        return () => {
            if (fileState.objectUrl) {
                URL.revokeObjectURL(fileState.objectUrl);
            }
        };
    }, [fileState.objectUrl]);

    async function removeFile() {
        if (fileState.objectUrl) {
            URL.revokeObjectURL(fileState.objectUrl);
        }

        // Delete from S3 if key exists
        if (fileState.key) {
            try {
                const response = await fetch('/api/s3/delete', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        key: fileState.key,
                    }),
                });

                if (!response.ok) {
                    toast.error("Failed to remove file from storage");

                    setFileState((prev)=> ({
                        ...prev,
                        isDeleting: true,
                        error: true,
                    }))

                    return;
                }

                if (fileState.objectUrl && !fileState.objectUrl?.startsWith("http")) {
                    URL.revokeObjectURL(fileState.objectUrl);
                }

                setFileState(()=> ({
                    file: null,
                    uploading: false,
                    progress: 0,
                    objectUrl: undefined,
                    error: false,
                    fileType: "image",
                    id: null,
                    isDeleting: true,
                }))

                toast.success("File removed successfully.");

            } catch (error) {
                toast.error("Error removing file. please try again later.");

                setFileState((prev)=> ({
                    ...prev,
                    isDeleting: true,
                    error: true,
                }))
            }
        }

        setFileState({
            error: false,
            file: null,
            id: null,
            uploading: false,
            progress: 0,
            isDeleting: false,
            fileType: "image",
        });
    }

    async function uploadFile(file: File) {
        setFileState((prev)=> ({
            ...prev,
            uploading: true,
            progress: 0,
        }))

        try {
            //1. get presigned url
            const presignedResponse = await fetch("/api/s3/upload", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: true,
                }),
            })

            if(!presignedResponse.ok) {
                toast.error("Failed to get presigned URL");
                setFileState((prev)=> ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true,
                }))
                return;
            }

            const {presignedUrl, key} = await presignedResponse.json();

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest()

                xhr.upload.onprogress = (event) => {
                    if(event.lengthComputable) {
                        const percentComplete = (event.loaded / event.total) * 100;
                        setFileState((prev)=> ({
                            ...prev,
                            progress: Math.round(percentComplete)
                        }))
                    }
                }

                xhr.onload = () => {
                    if(xhr.status === 200 || xhr.status === 204) {
                        setFileState((prev)=> ({
                            ...prev,
                            progress: 100,
                            uploading: false,
                            key: key,
                        }))

                        onChange?.(key);

                        toast.success("File uploaded successfully.");
                        resolve()
                    } else{
                        reject(new Error('Upload failed...'));
                    }
                }

                xhr.onerror = () => {
                    reject(new Error('Upload failed...'));
                }

                xhr.open('PUT', presignedUrl);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.send(file)
            })
        } catch {
            toast.error("Something went wrong");

            setFileState((prev)=> ({
                ...prev,
                progress: 0,
                error: true,
                uploading: false,
            }))
        }
    }

    const onDropAccepted = useCallback((acceptedFiles: File[]) => {
        if(acceptedFiles.length > 0) {
            const file = acceptedFiles[0]

            // Cleanup previous object URL jika ada
            if (fileState.objectUrl && !fileState.objectUrl?.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }

            // Set file state dengan benar
            setFileState({
                file: file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv4(),
                isDeleting: false,
                fileType: "image",
            });

            uploadFile(file);
        }
    }, [fileState.objectUrl]); // Tambahkan dependency

    const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
        // Kita hanya perlu cek error dari file pertama yang ditolak.
        const firstRejection = fileRejections[0];
        const firstError = firstRejection.errors[0];

        // Cek kode error yang benar (singkat, bukan kalimat panjang)
        if (firstError.code === 'file-too-large') {
            toast.error('Ukuran file terlalu besar, maksimal 5MB.');
        } else if (firstError.code === 'too-many-files') {
            toast.error('Hanya bisa memilih 1 file saja.');
        } else if (firstError.code === 'file-invalid-type') {
            toast.error('Tipe file tidak valid, harap pilih gambar.');
        } else {
            // Untuk error lainnya, tampilkan pesan default
            toast.error(firstError.message);
        }
    }, []);

    function renderContent(){
        if(fileState.uploading){
            return <RenderUploadingState progress={fileState.progress} file={fileState.file!} />
        }
        if(fileState.error){
            return <RenderErrorState/>
        }

        if(fileState.objectUrl){
            return (
                <RenderUploadedState
                    onRemove={removeFile}
                    previewUrl={fileState.objectUrl}
                />
            )
        }

        return <RenderEmptyState isDragActive={isDragActive}/>
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDropAccepted: onDropAccepted,
        onDropRejected: onDropRejected,
        accept: { "image/*": [] },
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024, // 5MB
        disabled: fileState.isDeleting || !!fileState.objectUrl,
    });

    return (
        <Card
            {...getRootProps()}
            className={cn(
                "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64 cursor-pointer",
                isDragActive
                    ? 'border-primary bg-primary/10 border-solid'
                    : 'border-border hover:border-primary'
            )}
        >
            <CardContent className="flex flex-col items-center justify-center h-full w-full text-center">
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    );
}