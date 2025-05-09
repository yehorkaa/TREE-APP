import React from 'react'
import { cn } from '@/lib/utils'
import type { TreeDataItem, TreeProps } from './model/tree-view.type'
import { KEY } from './model/tree-view.const'
import { TreeItem } from './ui/tree-item'

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
    (
        {
            data,
            initialSelectedItemId,
            onSelectChange,
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

        const flattenVisibleItems = (items: TreeDataItem[] | TreeDataItem): TreeDataItem[] => {
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
        };

        const visibleItems = React.useMemo(() => flattenVisibleItems(data), [data, expandedItemIds]);

        const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            e.preventDefault();
            const eventKey = e.key;
            if (visibleItems.length === 0 || !(eventKey in KEY)) return;
            const currentIndex = visibleItems.findIndex(item => item.id === selectedItemId);
            let newIndex = currentIndex;
            const currentItem = visibleItems[currentIndex];
            switch (eventKey) {
                case KEY.ArrowDown: {
                    newIndex = currentIndex < visibleItems.length - 1 ? currentIndex + 1 : 0;
                    break;
                }
                case KEY.ArrowUp: {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : visibleItems.length - 1;
                    break;
                }
                case KEY.ArrowRight: {
                    if (currentItem?.children && !expandedItemIds.includes(currentItem.id)) {
                        setExpandedItemIds(prev => [...prev, currentItem.id]);
                    }
                    break;
                }
                case KEY.ArrowLeft: {
                    if (currentItem?.children && expandedItemIds.includes(currentItem.id)) {
                        setExpandedItemIds(prev => prev.filter(id => id !== currentItem.id));
                    }
                    break;
                }
                case KEY.Enter: {
                    if (currentItem?.children) {
                        if (expandedItemIds.includes(currentItem.id)) {
                            setExpandedItemIds(prev => prev.filter(id => id !== currentItem.id));
                        } else {
                            setExpandedItemIds(prev => [...prev, currentItem.id]);
                        }
                    }
                    break;
                }
            }
            
            if (newIndex !== currentIndex) {
                const newItem = visibleItems[newIndex];
                handleSelectChange(newItem);
            }
        }

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

export { TreeView, type TreeDataItem }
