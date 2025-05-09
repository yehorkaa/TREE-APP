import React, { type ElementType } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@/lib/utils'
import type { TreeNodeProps } from '../model/tree-view.type'
import { AccordionTrigger } from './accordion-trigger'
import { AccordionContent } from './accordion-content'
import { TreeItem } from './tree-item'
import { TreeIcon } from './tree-icon'
import { TreeActions } from './tree-actions'
import { treeVariants, selectedTreeVariants, dragOverVariants } from './tree-variants'

const TreeNode = ({
    item,
    handleSelectChange,
    expandedItemIds,
    setExpandedItemIds,
    selectedItemId,
    defaultNodeIcon,
    defaultLeafIcon,
    handleDragStart,
    handleDrop,
    draggedItem,
}: TreeNodeProps) => {
    const isOpen = expandedItemIds.includes(item.id);
    const [isDragOver, setIsDragOver] = React.useState(false)

    const onDragStart = (e: React.DragEvent) => {
        if (!item.draggable) {
            e.preventDefault()
            return
        }
        e.dataTransfer.setData('text/plain', item.id)
        handleDragStart?.(item)
    }

    const onDragOver = (e: React.DragEvent) => {
        if (item.droppable !== false && draggedItem && draggedItem.id !== item.id) {
            e.preventDefault()
            setIsDragOver(true)
        }
    }

    const onDragLeave = () => {
        setIsDragOver(false)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        handleDrop?.(item)
    }

    return (
        <AccordionPrimitive.Root
            type="multiple"
            value={isOpen ? [item.id] : []}
            onValueChange={(vals) => {
                if (vals.includes(item.id)) {
                    setExpandedItemIds(prev => [...prev, item.id]);
                } else {
                    setExpandedItemIds(prev => prev.filter(id => id !== item.id));
                }
            }}
        >
            <AccordionPrimitive.Item value={item.id}>
                <AccordionTrigger
                    className={cn(
                        treeVariants(),
                        selectedItemId === item.id && selectedTreeVariants(),
                        isDragOver && dragOverVariants()
                    )}
                    onClick={() => {
                        handleSelectChange(item)
                        item.onClick?.()
                    }}
                    draggable={!!item.draggable}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    <TreeIcon
                        item={item}
                        isSelected={selectedItemId === item.id}
                        isOpen={isOpen}
                        default={defaultNodeIcon as ElementType}
                    />
                    <span className="text-sm truncate">{item.name}</span>
                    <TreeActions isSelected={selectedItemId === item.id}>
                        {item.actions}
                    </TreeActions>
                </AccordionTrigger>
                <AccordionContent className="ml-4 pl-1 border-l">
                    <TreeItem
                        data={item.children ? item.children : item}
                        selectedItemId={selectedItemId}
                        handleSelectChange={handleSelectChange}
                        expandedItemIds={expandedItemIds}
                        setExpandedItemIds={setExpandedItemIds}
                        defaultLeafIcon={defaultLeafIcon}
                        defaultNodeIcon={defaultNodeIcon}
                        handleDragStart={handleDragStart}
                        handleDrop={handleDrop}
                        draggedItem={draggedItem}
                    />
                </AccordionContent>
            </AccordionPrimitive.Item>
        </AccordionPrimitive.Root>
    )
}

export { TreeNode } 