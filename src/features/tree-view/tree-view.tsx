import React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronRight, Folder, File } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { TreeDataItem, TreeProps } from './model/tree-view.type'
import { KEY } from './model/tree-view.const'


const treeVariants = cva(
    'group bg-white hover:before:opacity-100 before:absolute before:rounded-lg before:left-0 px-2 before:w-full before:opacity-0 before:bg-accent/70 before:h-[2rem] before:-z-10'
)

const selectedTreeVariants = cva(
    'bg-gray-100 before:opacity-100 before:bg-accent/70 text-accent-foreground'
)

const dragOverVariants = cva(
    'before:opacity-100 before:bg-primary/20 text-primary-foreground'
)


const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
    (
        {
            data,
            initialSelectedItemId,
            onSelectChange,
            expandAll,
            defaultLeafIcon,
            defaultNodeIcon,
            className,
            onDocumentDrag,
            ...props
        },
        ref
    ) => {
        const [selectedItemId, setSelectedItemId] = React.useState<
            string | undefined
        >(initialSelectedItemId)
        
        const [draggedItem, setDraggedItem] = React.useState<TreeDataItem | null>(null)

        const handleSelectChange = React.useCallback(
            (item: TreeDataItem | undefined) => {
                setSelectedItemId(item?.id)
                if (onSelectChange) {
                    onSelectChange(item)
                }
            },
            [onSelectChange]
        )

        const handleDragStart = React.useCallback((item: TreeDataItem) => {
            setDraggedItem(item)
        }, [])

        const handleDrop = React.useCallback((targetItem: TreeDataItem) => {
            if (draggedItem && onDocumentDrag && draggedItem.id !== targetItem.id) {
                onDocumentDrag(draggedItem, targetItem)
            }
            setDraggedItem(null)
        }, [draggedItem, onDocumentDrag])

        const [expandedItemIds, setExpandedItemIds] = React.useState<string[]>(() => {
            if (!initialSelectedItemId) return [];
            const ids: string[] = [];
            function walkTreeItemsTreeItems(items: TreeDataItem[] | TreeDataItem, targetId: string): boolean {
                if (Array.isArray(items)) {
                    for (const node of items) {
                        ids.push(node.id);
                        if (walkTreeItemsTreeItems(node, targetId)) return true;
                        ids.pop();
                    }
                } else if (items.id === targetId) {
                    return true;
                } else if (items.children) {
                    return walkTreeItemsTreeItems(items.children, targetId);
                }
                return false;
            }
            walkTreeItemsTreeItems(data, initialSelectedItemId);
            return ids;
        });

        const flattenVisibleItems = React.useCallback((items: TreeDataItem[] | TreeDataItem): TreeDataItem[] => {
            const result: TreeDataItem[] = [];
            const traverse = (node: TreeDataItem) => {
                result.push(node);
                if (node.children && expandedItemIds.includes(node.id)) {
                    node.children.forEach(child => traverse(child));
                }
            };
            if (Array.isArray(items)) {
                items.forEach(item => traverse(item));
            } else {
                traverse(items);
            }
            return result;
        }, [expandedItemIds]);

        const visibleItems = React.useMemo(() => flattenVisibleItems(data), [data, expandedItemIds]);

        const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
            e.preventDefault();
            const eventKey = e.key;
            if (visibleItems.length === 0 || !(eventKey in KEY)) return;
            const currentIndex = visibleItems.findIndex(item => item.id === selectedItemId);
            let newIndex = currentIndex;

            switch (eventKey) {
                case KEY.ArrowDown:
                    newIndex = currentIndex < visibleItems.length - 1 ? currentIndex + 1 : 0;
                    break;
                case KEY.ArrowUp:
                    newIndex = currentIndex > 0 ? currentIndex - 1 : visibleItems.length - 1;
                    break;
                case KEY.ArrowRight:
                    const currentItem = visibleItems[currentIndex];
                    if (currentItem?.children && !expandedItemIds.includes(currentItem.id)) {
                        setExpandedItemIds(prev => [...prev, currentItem.id]);
                    }
                    break;
                case KEY.ArrowLeft:
                    const selectedItem = visibleItems[currentIndex];
                    if (selectedItem?.children && expandedItemIds.includes(selectedItem.id)) {
                        setExpandedItemIds(prev => prev.filter(id => id !== selectedItem.id));
                    }
                    break;
                case KEY.Enter:
                    const focusedItem = visibleItems[currentIndex];
                    if (focusedItem?.children) {
                        if (expandedItemIds.includes(focusedItem.id)) {
                            setExpandedItemIds(prev => prev.filter(id => id !== focusedItem.id));
                        } else {
                            setExpandedItemIds(prev => [...prev, focusedItem.id]);
                        }
                    }
                    break;
            }
            
            if (newIndex !== currentIndex) {
                handleSelectChange(visibleItems[newIndex]);
            }
        }, [data, selectedItemId, expandedItemIds, flattenVisibleItems, visibleItems, handleSelectChange, setExpandedItemIds]);

        return (
            <div
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className={cn('overflow-hidden relative p-2', className)}
            >
                <TreeItem
                    data={data}
                    ref={ref}
                    selectedItemId={selectedItemId}
                    handleSelectChange={handleSelectChange}
                    expandedItemIds={expandedItemIds}
                    setExpandedItemIds={setExpandedItemIds}
                    defaultLeafIcon={defaultLeafIcon}
                    defaultNodeIcon={defaultNodeIcon}
                    handleDragStart={handleDragStart}
                    handleDrop={handleDrop}
                    draggedItem={draggedItem}
                    {...props}
                />
                <div
                    className='w-full h-[48px]'
                    onDrop={() => { handleDrop({id: '', name: 'parent_div'})}}>

                </div>
            </div>
        )
    }
)
TreeView.displayName = 'TreeView'

type TreeItemProps = TreeProps & {
    selectedItemId?: string
    handleSelectChange: (item: TreeDataItem | undefined) => void
    expandedItemIds: string[]
    setExpandedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
    defaultNodeIcon?: any
    defaultLeafIcon?: any
    handleDragStart?: (item: TreeDataItem) => void
    handleDrop?: (item: TreeDataItem) => void
    draggedItem: TreeDataItem | null
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
    (
        {
            className,
            data,
            selectedItemId,
            handleSelectChange,
            expandedItemIds,
            setExpandedItemIds,
            defaultNodeIcon,
            defaultLeafIcon,
            handleDragStart,
            handleDrop,
            draggedItem,
            ...props
        },
        ref
    ) => {
        if (!(data instanceof Array)) {
            data = [data]
        }
        return (
            <div ref={ref} role="tree" className={className} {...props}>
                <ul>
                    {data.map((item) => (
                        <li key={item.id}>
                            {item.children ? (
                                <TreeNode
                                    item={item}
                                    selectedItemId={selectedItemId}
                                    expandedItemIds={expandedItemIds}
                                    setExpandedItemIds={setExpandedItemIds}
                                    handleSelectChange={handleSelectChange}
                                    defaultNodeIcon={defaultNodeIcon}
                                    defaultLeafIcon={defaultLeafIcon}
                                    handleDragStart={handleDragStart}
                                    handleDrop={handleDrop}
                                    draggedItem={draggedItem}
                                />
                            ) : (
                                <TreeLeaf
                                    item={item}
                                    selectedItemId={selectedItemId}
                                    handleSelectChange={handleSelectChange}
                                    defaultLeafIcon={defaultLeafIcon}
                                    handleDragStart={handleDragStart}
                                    handleDrop={handleDrop}
                                    draggedItem={draggedItem}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
)
TreeItem.displayName = 'TreeItem'

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
}: {
    item: TreeDataItem
    handleSelectChange: (item: TreeDataItem | undefined) => void
    expandedItemIds: string[]
    setExpandedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
    selectedItemId?: string
    defaultNodeIcon?: any
    defaultLeafIcon?: any
    handleDragStart?: (item: TreeDataItem) => void
    handleDrop?: (item: TreeDataItem) => void
    draggedItem: TreeDataItem | null
}) => {
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
                        default={defaultNodeIcon}
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

const TreeLeaf = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        item: TreeDataItem
        selectedItemId?: string
        handleSelectChange: (item: TreeDataItem | undefined) => void
        defaultLeafIcon?: any
        handleDragStart?: (item: TreeDataItem) => void
        handleDrop?: (item: TreeDataItem) => void
        draggedItem: TreeDataItem | null
    }
>(
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

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                'flex flex-1 w-full items-center py-2 transition-all first:[&[data-state=open]>svg]:rotate-90',
                'rounded-lg relative cursor-pointer group',
                'hover:bg-gray-100 focus:bg-gray-100',
                className
            )}
            {...props}
        >
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 text-accent-foreground/50 mr-1" />
            {children}
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
            className
        )}
        {...props}
    >
        <div className="pb-1 pt-0">{children}</div>
    </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

const TreeIcon = ({
    item,
    isOpen,
    isSelected,
    default: defaultIcon
}: {
    item: TreeDataItem
    isOpen?: boolean
    isSelected?: boolean
    default?: any
}) => {
    let Icon = defaultIcon;
    if (isSelected && item.selectedIcon) {
        Icon = item.selectedIcon;
    } else if (isOpen && item.openIcon) {
        Icon = item.openIcon;
    } else if (item.icon) {
        Icon = item.icon;
    } else if (item.children) {
        Icon = Folder;
    } else {
        Icon = File;
    }
    return <Icon className="h-4 w-4 shrink-0 mr-2" />;
};

const TreeActions = ({
    children,
    isSelected
}: {
    children?: React.ReactNode
    isSelected: boolean
}) => {
    return (
        <div
            className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                (isSelected ? 'block' : 'hidden group-hover:block')
            )}
        >
            {children}
        </div>
    );
};

export { TreeView, type TreeDataItem }
