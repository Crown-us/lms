"use client";
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    rectIntersection,
    useSensors,
    useSensor,
    closestCenter,
    DragEndEvent
} from "@dnd-kit/core";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
    arrayMove
} from "@dnd-kit/sortable";
import {useState} from "react";
import {CSS} from '@dnd-kit/utilities';
import {AdminCourseSingularType} from "@/app/data/admin/admin-get-course";

interface iAppProps {
    data: AdminCourseSingularType
}

interface SortableItemProps {
    id: string;
    chil
}

function SortableItem(props: { id: string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            Chapter {props.id}
        </div>
    );
}

export function CourseStructure({ data }: iAppProps) {
    const initialItems = data?.chapter?.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: true,
        lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
        }))
    })) || [];

    const [items, setItems] = useState(initialItems);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        if (over && active.id !== over.id) {
            setItems((items: any) => {
                const oldIndex = items.findIndex((item: any) => item.id === active.id);
                const newIndex = items.findIndex((item: any) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    return (
        <DndContext
            collisionDetection={rectIntersection}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                    <CardTitle>Chapters</CardTitle>
                </CardHeader>
                <CardContent>
                    <SortableContext
                        items={items.map((item: any) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map((item: any) => <SortableItem key={item.id} id={item.id} />)}
                    </SortableContext>
                </CardContent>
            </Card>
        </DndContext>
    );
}