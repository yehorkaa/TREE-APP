import type { HTMLAttributes, ReactNode } from "react";

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

export type TreeNodeProps = {
    item: TreeDataItem;
    handleSelectChange: (item: TreeDataItem | undefined) => void;
    expandedItemIds: string[];
    setExpandedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
    selectedItemId?: string;
    defaultNodeIcon?: any;
    defaultLeafIcon?: any;
    handleDragStart?: (item: TreeDataItem) => void;
    handleDrop?: (item: TreeDataItem) => void;
    draggedItem: TreeDataItem | null;
}

export type TreeLeafProps = HTMLAttributes<HTMLDivElement> & {
    item: TreeDataItem
    selectedItemId?: string
    handleSelectChange: (item: TreeDataItem | undefined) => void
    defaultLeafIcon?: any
    handleDragStart?: (item: TreeDataItem) => void
    handleDrop?: (item: TreeDataItem) => void
    draggedItem: TreeDataItem | null
}

export interface TreeIconProps {
    item: TreeDataItem
    isOpen?: boolean
    isSelected?: boolean
    default?: any
}

export interface TreeActionsProps {
    children?: ReactNode
    isSelected: boolean
}
