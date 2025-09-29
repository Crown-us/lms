"use client";
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    rectIntersection,
    useSensors,
    useSensor,
    DragEndEvent,
    DraggableSyntheticListeners
} from "@dnd-kit/core";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
    arrayMove
} from "@dnd-kit/sortable";
import {ReactNode, useState} from "react";
import {CSS} from '@dnd-kit/utilities';
import {AdminCourseSingularType} from "@/app/data/admin/admin-get-course";
import {cn} from "@/lib/utils";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {ChevronDown, GripVertical, FileText, PlusCircle} from "lucide-react";

// Tipe data ini untuk kejelasan. Ganti dengan tipe data Anda jika berbeda.
interface Lesson {
    id: string;
    title: string;
    position: number;
}

interface Chapter {
    id: string;
    title: string;
    position: number;
    isOpen: boolean;
    lessons: Lesson[];
}

interface iAppProps {
    data: AdminCourseSingularType
}

interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners, isDragging: boolean) => ReactNode;
    className?: string;
    data?: {
        type: 'chapter' | 'lesson';
        chapterId?: string;
    }
}

function SortableItem({ id, children, className, data: itemData }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: id, data: itemData});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={cn("touch-none", className)}
        >
            {children(listeners, isDragging)}
        </div>
    );
}

export function CourseStructure({ data }: iAppProps) {
    const initialItems: Chapter[] = data?.chapter?.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        position: chapter.position,
        isOpen: true,
        lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            position: lesson.position,
        })).sort((a, b) => a.position - b.position)
    })).sort((a, b) => a.position - b.position) || [];

    const [items, setItems] = useState<Chapter[]>(initialItems);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAddLesson = (chapterId: string) => {
        setItems(currentItems =>
            currentItems.map(chapter => {
                if (chapter.id === chapterId) {
                    const newLesson: Lesson = {
                        id: `lesson-${Date.now()}`, // ID unik sederhana
                        title: `Pelajaran Baru #${chapter.lessons.length + 1}`,
                        position: chapter.lessons.length,
                    };
                    return {
                        ...chapter,
                        lessons: [...chapter.lessons, newLesson],
                    };
                }
                return chapter;
            })
        );
    };

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const { type: activeType } = active.data.current || {};
        const { type: overType } = over.data.current || {};

        setItems((prevItems) => {
            if (activeType === 'chapter' && overType === 'chapter') {
                const oldIndex = prevItems.findIndex(item => item.id === active.id);
                const newIndex = prevItems.findIndex(item => item.id === over.id);
                if (oldIndex !== -1 && newIndex !== -1) {
                    return arrayMove(prevItems, oldIndex, newIndex);
                }
            }

            if (activeType === 'lesson' && overType === 'lesson') {
                const { chapterId: activeChapterId } = active.data.current || {};
                const { chapterId: overChapterId } = over.data.current || {};

                if (activeChapterId === overChapterId) {
                    const chapterIndex = prevItems.findIndex(c => c.id === activeChapterId);
                    if (chapterIndex !== -1) {
                        const chapter = prevItems[chapterIndex];
                        const oldLessonIndex = chapter.lessons.findIndex(l => l.id === active.id);
                        const newLessonIndex = chapter.lessons.findIndex(l => l.id === over.id);

                        if (oldLessonIndex !== -1 && newLessonIndex !== -1) {
                            const reorderedLessons = arrayMove(chapter.lessons, oldLessonIndex, newLessonIndex);
                            const newItems = [...prevItems];
                            newItems[chapterIndex] = {
                                ...chapter,
                                lessons: reorderedLessons,
                            };
                            return newItems;
                        }
                    }
                }
            }

            return prevItems;
        });
    }

    const toggleChapter = (chapterId: string) => {
        setItems(currentItems =>
            currentItems.map(item =>
                item.id === chapterId ? { ...item, isOpen: !item.isOpen } : item
            )
        );
    };

    return (
        <DndContext
            collisionDetection={rectIntersection}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                    <CardTitle>Struktur Kurikulum</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <SortableContext
                        items={items.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map((item) => (
                            <SortableItem
                                id={item.id}
                                data={{type: "chapter"}}
                                key={item.id}
                                className="mb-2"
                            >
                                {(listeners, isDragging) => (
                                    <div className={cn(
                                        "bg-background border rounded-md overflow-hidden transition-all",
                                        isDragging && "shadow-xl ring-2 ring-indigo-500"
                                    )}>
                                        <Collapsible
                                            open={item.isOpen}
                                            onOpenChange={() => toggleChapter(item.id)}
                                        >
                                            <CollapsibleTrigger className="w-full">
                                                <div className="flex items-center gap-2 p-4 hover:bg-muted/50 transition-colors">
                                                    <div {...listeners} className="cursor-grab active:cursor-grabbing p-1">
                                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <ChevronDown
                                                        className={cn("h-4 w-4 transition-transform", item.isOpen ? "rotate-0" : "-rotate-90")}
                                                    />
                                                    <span className="font-medium flex-grow text-left">{item.title}</span>
                                                    <span className="ml-auto text-sm text-muted-foreground">
                                                        {item.lessons.length} pelajaran
                                                    </span>
                                                </div>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <div className="border-t bg-muted/30 dark:bg-muted/20">
                                                    <div className="p-4 pl-11">
                                                        <div className="space-y-1">
                                                            <SortableContext
                                                                items={item.lessons.map(lesson => lesson.id)}
                                                                strategy={verticalListSortingStrategy}
                                                            >
                                                                {item.lessons.map((lesson) => (
                                                                    <SortableItem
                                                                        key={lesson.id}
                                                                        id={lesson.id}
                                                                        data={{ type: "lesson", chapterId: item.id }}
                                                                    >
                                                                        {(lessonListeners, isLessonDragging) => (
                                                                            <div
                                                                                className={cn(
                                                                                    "flex items-center gap-3 p-2 rounded-md transition-all",
                                                                                    isLessonDragging ? "bg-indigo-100 dark:bg-indigo-900/50 shadow-md" : "hover:bg-muted/70 dark:hover:bg-muted/40"
                                                                                )}
                                                                            >
                                                                                <div {...lessonListeners} className="cursor-grab active:cursor-grabbing p-1">
                                                                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                                                </div>
                                                                                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                                                <a href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`} className="flex-grow text-sm truncate hover:underline">
                                                                                    {lesson.title}
                                                                                </a>
                                                                            </div>
                                                                        )}
                                                                    </SortableItem>
                                                                ))}
                                                            </SortableContext>
                                                            {item.lessons.length === 0 && (
                                                                <div className="py-2 text-sm text-center text-muted-foreground">
                                                                    Belum ada pelajaran
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleAddLesson(item.id)}
                                                            className="flex items-center justify-center gap-2 w-full text-sm p-2 rounded-md text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-foreground transition-colors mt-4"
                                                        >
                                                            <PlusCircle className="h-4 w-4" />
                                                            Buat Pelajaran Baru
                                                        </button>
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>
                                )}
                            </SortableItem>
                        ))}
                    </SortableContext>
                </CardContent>
            </Card>
        </DndContext>
    );
}

