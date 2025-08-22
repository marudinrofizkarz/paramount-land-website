import { z } from "zod";

// Website Menu Schema
export const websiteMenuSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  url: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
  parentId: z.string().optional(),
  isMegaMenu: z.boolean().default(false),
  iconClass: z.string().optional(),
  description: z.string().optional(),
});

export type WebsiteMenuFormValues = z.infer<typeof websiteMenuSchema>;

// Type for the Website Menu with ID and timestamps
export type WebsiteMenu = WebsiteMenuFormValues & {
  id: string;
  createdAt: string;
  updatedAt: string;
  children?: WebsiteMenu[]; // For nested menu structure
};

// Type for menu tree structure
export type MenuTreeItem = {
  id: string;
  title: string;
  url?: string;
  order: number;
  isActive: boolean;
  isMegaMenu: boolean;
  iconClass?: string;
  description?: string;
  children: MenuTreeItem[];
};
