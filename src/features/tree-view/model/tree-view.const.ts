import type { TreeDataItem } from "./tree-view.type";

export const KEY = {
    ArrowDown: 'ArrowDown',
    ArrowUp: 'ArrowUp',
    ArrowRight: 'ArrowRight',
    ArrowLeft: 'ArrowLeft',
    Enter: 'Enter',
} as const; 

export const treeData: TreeDataItem[] = [
    {
      id: "1",
      name: "Item 1",
      children: [
        {
          id: "2",
          name: "Item 1.1",
          children: [
            {
              id: "3",
              name: "Item 1.1.1",
            },
            {
              id: "4",
              name: "Item 1.1.2",
            },
            {
              id: "7",
              name: "Item 1.1.3",
              children: [
                {
                  id: "8",
                  name: "Item 1.1.3.1",
                },
                {
                  id: "9",
                  name: "Item 1.1.3.2",
                },
              ],
            },
          ],
        },
        {
          id: "5",
          name: "Item 1.2",
          children: [
            {
              id: "10",
              name: "Item 1.2.1",
            },
          ],
        },
        {
          id: "11",
          name: "Item 1.3",
        },
      ],
    },
    {
      id: "6",
      name: "Item 2",
      draggable: true,
      droppable: true,
      children: [
        {
          id: "12",
          name: "Item 2.1",
        },
        {
          id: "13",
          name: "Item 2.2",
          children: [
            {
              id: "14",
              name: "Item 2.2.1",
            },
          ],
        },
      ],
    },
    {
      id: "15",
      name: "Item 3",
    },
    {
      id: "16",
      name: "Item 4",
      children: [
        {
          id: "17",
          name: "Item 4.1",
        },
        {
          id: "18",
          name: "Item 4.2",
        },
        {
          id: "19",
          name: "Item 4.3",
          children: [
            {
              id: "20",
              name: "Item 4.3.1",
            },
          ],
        },
      ],
    },
  ];