"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import { Menubar } from "@/components/rich-text-editor/Menubar";
import { useEffect } from "react";
import { ControllerRenderProps } from "react-hook-form";

export function RichTextEditor({ field }: { field: ControllerRenderProps<any, any> }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Heading.configure({
                levels: [1, 2, 3],
            }),
        ],
        content: field.value && typeof field.value === 'string' ? JSON.parse(field.value) : "",

        immediatelyRender: false, // <-- PENYESUAIAN DI SINI

        editable: true,
        editorProps: {
            attributes: {
                class: "min-h-[300px] w-full max-w-none rounded-b-lg border-input bg-background p-4 focus:outline-none prose prose-sm dark:prose-invert sm:prose lg:prose-lg xl:prose-xl",
            },
        },
        onUpdate: ({ editor }) => {
            field.onChange(JSON.stringify(editor.getJSON()));
        },
    });

    useEffect(() => {
        if (!editor) {
            return;
        }

        const currentContentString = JSON.stringify(editor.getJSON());
        const formValue = typeof field.value === 'string' && field.value ? field.value : null;

        if (formValue !== currentContentString) {
            const newContent = formValue ? JSON.parse(formValue) : '';
            editor.commands.setContent(newContent, { emitUpdate: false });
        }
    }, [field.value, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="w-full rounded-lg border border-input bg-transparent focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <Menubar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}