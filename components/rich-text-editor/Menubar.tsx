import {type Editor} from "@tiptap/react";
import {TooltipProvider, TooltipTrigger, Tooltip, TooltipContent} from "@/components/ui/tooltip";
import {Toggle} from "@/components/ui/toggle";
import {Button} from "@/components/ui/button";
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Undo2,
    Redo2,
} from "lucide-react";
import {cn} from "@/lib/utils";

interface iAppProps {
    editor: Editor | null;
}

export function Menubar({editor}: iAppProps) {
    if (!editor) {
        return null;
    }

    return (
        <div className="border border-input rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
            <TooltipProvider>
                <div className="flex flex-wrap gap-1">
                    {/* Bold */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("bold")}
                                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                                className={cn({"bg-muted text-muted-foreground": editor.isActive("bold")})}
                            >
                                <Bold className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Bold</p></TooltipContent>
                    </Tooltip>

                    {/* Italic */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("italic")}
                                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                                className={cn({"bg-muted text-muted-foreground": editor.isActive("italic")})}
                            >
                                <Italic className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Italic</p></TooltipContent>
                    </Tooltip>

                    {/* Strikethrough */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("strike")}
                                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                                className={cn({"bg-muted text-muted-foreground": editor.isActive("strike")})}
                            >
                                <Strikethrough className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Strikethrough</p></TooltipContent>
                    </Tooltip>

                    {/* Heading 1 */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", {level: 1})}
                                onPressedChange={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                                className={cn({"bg-muted text-muted-foreground": editor.isActive("heading", {level: 1})})}
                            >
                                <Heading1 className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Heading 1</p></TooltipContent>
                    </Tooltip>

                    {/* Heading 2 */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", {level: 2})}
                                onPressedChange={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                                className={cn({"bg-muted text-muted-foreground": editor.isActive("heading", {level: 2})})}
                            >
                                <Heading2 className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Heading 2</p></TooltipContent>
                    </Tooltip>

                    {/* Heading 3 */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", {level: 3})}
                                onPressedChange={() => editor.chain().focus().toggleHeading({level: 3}).run()}
                                className={cn({"bg-muted text-muted-foreground": editor.isActive("heading", {level: 3})})}
                            >
                                <Heading3 className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Heading 3</p></TooltipContent>
                    </Tooltip>

                    {/* Bullet List */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("bulletList")}
                                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                                className={cn({"bg-muted text-muted-foreground": editor.isActive("bulletList")})}
                            >
                                <List className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Bullet List</p></TooltipContent>
                    </Tooltip>

                    {/* Ordered List */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("orderedList")}
                                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                                className={cn({"bg-muted text-muted-foreground": editor.isActive("orderedList")})}
                            >
                                <ListOrdered className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Ordered List</p></TooltipContent>
                    </Tooltip>
                </div>

                {/* --- Pemisah visual --- */}
                <div className="w-px h-6 bg-border mx-2"></div>

                {/* --- Grup Tombol Perataan --- */}
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive({textAlign: "left"})}
                                onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                                className={cn({"bg-muted text-muted-foreground": editor.isActive({textAlign: "left"})})}
                            >
                                <AlignLeft className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Align Left</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive({textAlign: "center"})}
                                onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                                className={cn({"bg-muted text-muted-foreground": editor.isActive({textAlign: "center"})})}
                            >
                                <AlignCenter className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Align Center</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive({textAlign: "right"})}
                                onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                                className={cn({"bg-muted text-muted-foreground": editor.isActive({textAlign: "right"})})}
                            >
                                <AlignRight className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Align Right</p></TooltipContent>
                    </Tooltip>
                </div>

                {/* --- Pemisah visual --- */}
                <div className="w-px h-6 bg-border mx-2"></div>

                {/* --- Undo / Redo pakai Button --- */}
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                type="button"
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editor.can().undo()}
                            >
                                <Undo2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Undo</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                type="button"
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.can().redo()}
                            >
                                <Redo2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Redo</p></TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    );
}
