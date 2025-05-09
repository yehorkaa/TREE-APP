import { Folder, File } from 'lucide-react'
import type { TreeIconProps, IconOption } from '../model/tree-view.type';

const TreeIcon = ({
    item,
    isOpen,
    isSelected,
    default: defaultIcon = File
}: TreeIconProps) => {
    const options: IconOption[] = [
        { condition: Boolean(isSelected && item.selectedIcon), icon: item.selectedIcon },
        { condition: Boolean(isOpen && item.openIcon), icon: item.openIcon },
        { condition: Boolean(item.icon), icon: item.icon },
        { condition: Boolean(item.children), icon: Folder },
        { condition: true, icon: File }
    ];

    const Icon = options.find(opt => opt.condition)?.icon || defaultIcon;

    return <Icon className="h-4 w-4 shrink-0 mr-2" />;
};

export { TreeIcon } 