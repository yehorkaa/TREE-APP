import { cn } from '@/lib/utils'
import type { TreeActionsProps } from '../model/tree-view.type';

const TreeActions = ({
    children,
    isSelected
}: TreeActionsProps) => {
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

export { TreeActions } 