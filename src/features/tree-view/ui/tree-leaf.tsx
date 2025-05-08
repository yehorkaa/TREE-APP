import React from 'react'
import { cn } from '@/lib/utils'
import type { TreeLeafProps } from '../model/tree-view.type'
import { TreeIcon } from './tree-icon'
import { TreeActions } from './tree-actions'
import { treeVariants, selectedTreeVariants, dragOverVariants } from './tree-variants'

const TreeLeaf = React.forwardRef<HTMLDivElement, TreeLeafProps>(
    (
        {
            className,
            item,
            selectedItemId,
            handleSelectChange,
            defaultLeafIcon,
            handleDragStart,
            handleDrop,
            draggedItem,
            ...props
        },
        ref
    ) => {
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
            <div
                ref={ref}
                className={cn(
                    'ml-5 flex text-left items-center py-2 cursor-pointer before:right-1',
                    'rounded-lg relative group',
                    'hover:bg-gray-100 focus:bg-gray-100',
                    selectedItemId === item.id && 'bg-gray-100',
                    treeVariants(),
                    className,
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
                {...props}
            >
                <TreeIcon
                    item={item}
                    isSelected={selectedItemId === item.id}
                    default={defaultLeafIcon}
                />
                <span className="flex-grow text-sm truncate">{item.name}</span>
                <TreeActions isSelected={selectedItemId === item.id} />
            </div>
        )
    }
)
TreeLeaf.displayName = 'TreeLeaf'

export { TreeLeaf } 