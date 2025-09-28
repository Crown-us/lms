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

export function CourseStructure() {
    const [items, setItems] = useState(['1', '2', '3']);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(String(active.id));
                const newIndex = items.indexOf(String(over.id));

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
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map(id => <SortableItem key={id} id={id} />)}
                    </SortableContext>
                </CardContent>
            </Card>
        </DndContext>
    );
}