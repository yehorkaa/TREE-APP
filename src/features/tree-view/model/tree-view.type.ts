import type { ElementType, HTMLAttributes, ReactNode } from "react";

export interface TreeDataItem {
    id: string;
    name: string;
    icon?: ElementType;
    selectedIcon?: ElementType;
    openIcon?: ElementType;
    children?: TreeDataItem[];
    actions?: React.ReactNode;
    onClick?: () => void;
    draggable?: boolean;
    droppable?: boolean;
}

export interface IconOption {
    condition: boolean;
    icon?: ElementType;
}

export type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
    data: TreeDataItem[] | TreeDataItem;
    initialSelectedItemId?: string;
    onSelectChange?: (item: TreeDataItem | undefined) => void;
    expandAll?: boolean;
    defaultNodeIcon?: ReactNode;
    defaultLeafIcon?: ReactNode;
    onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void;
};

export type TreeItemProps = TreeProps & {
    selectedItemId?: string;
    handleSelectChange: (item: TreeDataItem | undefined) => void;
    expandedItemIds: string[];
    setExpandedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
    defaultNodeIcon?: ReactNode;
    defaultLeafIcon?: ReactNode;
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
    defaultNodeIcon?: ElementType;
    defaultLeafIcon?: ElementType;
    handleDragStart?: (item: TreeDataItem) => void;
    handleDrop?: (item: TreeDataItem) => void;
    draggedItem: TreeDataItem | null;
}

export type TreeLeafProps = HTMLAttributes<HTMLDivElement> & {
    item: TreeDataItem
    selectedItemId?: string
    handleSelectChange: (item: TreeDataItem | undefined) => void
    defaultLeafIcon?: ElementType
    handleDragStart?: (item: TreeDataItem) => void
    handleDrop?: (item: TreeDataItem) => void
    draggedItem: TreeDataItem | null
}

export interface TreeIconProps {
    item: TreeDataItem
    isOpen?: boolean
    isSelected?: boolean
    default?: ElementType
}

export interface TreeActionsProps {
    children?: ReactNode
    isSelected: boolean
}
