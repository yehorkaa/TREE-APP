import { cva } from 'class-variance-authority'

export const treeVariants = cva(
    'group bg-white hover:before:opacity-100 before:absolute before:rounded-lg before:left-0 px-2 before:w-full before:opacity-0 before:bg-accent/70 before:h-[2rem] before:-z-10'
)

export const selectedTreeVariants = cva(
    'bg-gray-100 before:opacity-100 before:bg-accent/70 text-accent-foreground'
)

export const dragOverVariants = cva(
    'before:opacity-100 before:bg-primary/20 text-primary-foreground'
) 