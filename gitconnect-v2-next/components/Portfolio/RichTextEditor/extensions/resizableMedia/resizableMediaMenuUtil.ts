/* @unocss-include */
// import { IconAlignCenter, IconAlignLeft, IconAlignRight, IconFloatLeft, IconFloatRight, IconDelete } from '~/assets'
import {
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconTrash,
} from '@tabler/icons-react';

interface ResizableMediaAction {
  tooltip: string;
  icon?: any;
  align?: string;
  action?: (updateAttributes: (o: Record<string, any>) => any) => void;
  isActive?: (attrs: Record<string, any>) => boolean;
  delete?: (d: () => void) => void;
}

export const resizableMediaActions: ResizableMediaAction[] = [
  {
    tooltip: "Align left",
    action: (updateAttributes) =>
      updateAttributes({
        dataAlign: "start",
        dataFloat: null,
      }),
      align: "left",
    // icon: "i-mdi-format-align-left",
    icon: IconAlignLeft,
    isActive: (attrs) => attrs.dataAlign === "start",
  },
  {
    tooltip: "Align center",
    action: (updateAttributes) =>
      updateAttributes({
        dataAlign: "center",
        dataFloat: null,
      }),
    // icon: "i-mdi-format-align-center",
    align: "center",
    icon: IconAlignCenter,
    isActive: (attrs) => attrs.dataAlign === "center",
  },
  {
    tooltip: "Align right",
    action: (updateAttributes) =>
      updateAttributes({
        dataAlign: "end",
        dataFloat: null,
      }),
    // icon: "i-mdi-format-align-right",
    align: "right",
    icon: IconAlignRight,
    isActive: (attrs) => attrs.dataAlign === "end",
  },
  {
    tooltip: "Delete",
    // icon: "i-mdi-delete",
    icon: IconTrash,
    delete: (deleteNode) => deleteNode(),
  },
];
