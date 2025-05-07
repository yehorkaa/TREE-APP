export interface TreeDataItem {
    id: string;
    name: string;
    icon?: any;
    selectedIcon?: any;
    openIcon?: any;
    children?: TreeDataItem[];
    actions?: React.ReactNode;
    onClick?: () => void;
    draggable?: boolean;
    droppable?: boolean;
}

export type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
    data: TreeDataItem[] | TreeDataItem;
    initialSelectedItemId?: string;
    onSelectChange?: (item: TreeDataItem | undefined) => void;
    expandAll?: boolean;
    defaultNodeIcon?: any;
    defaultLeafIcon?: any;
    onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void;
};

export type TreeItemProps = TreeProps & {
    selectedItemId?: string;
    handleSelectChange: (item: TreeDataItem | undefined) => void;
    expandedItemIds: string[];
    setExpandedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
    defaultNodeIcon?: any;
    defaultLeafIcon?: any;
    handleDragStart?: (item: TreeDataItem) => void;
    handleDrop?: (item: TreeDataItem) => void;
    draggedItem: TreeDataItem | null;
}; 