import { Folder, File } from 'lucide-react'
import type { TreeIconProps } from '../model/tree-view.type';

const TreeIcon = ({
    item,
    isOpen,
    isSelected,
    default: defaultIcon
}: TreeIconProps) => {
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

export { TreeIcon } 