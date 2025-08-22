"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import db, { query, getMany, getOne } from "@/lib/database";
import { WebsiteMenu, MenuTreeItem } from "@/types/website-menu";

// Create a new website menu
export async function createWebsiteMenu(formData: FormData) {
  try {
    const id = uuidv4();
    const title = formData.get("title") as string;
    const url = (formData.get("url") as string) || null;
    const order = parseInt((formData.get("order") as string) || "0");
    const isActive = formData.get("isActive") === "true" ? 1 : 0;
    const parentId = (formData.get("parentId") as string) || null;
    const isMegaMenu = formData.get("isMegaMenu") === "true" ? 1 : 0;
    const iconClass = (formData.get("iconClass") as string) || null;
    const description = (formData.get("description") as string) || null;

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // Create website menu in database
    await query(
      'INSERT INTO WebsiteMenu (id, title, url, "order", isActive, parentId, isMegaMenu, iconClass, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        title,
        url,
        order,
        isActive,
        parentId,
        isMegaMenu,
        iconClass,
        description,
        createdAt,
        updatedAt,
      ]
    );

    // Get the inserted record
    const websiteMenu = await getOne("SELECT * FROM WebsiteMenu WHERE id = ?", [
      id,
    ]);

    // Convert boolean fields
    const formattedMenu = {
      ...websiteMenu,
      isActive: websiteMenu.isActive === 1,
      isMegaMenu: websiteMenu.isMegaMenu === 1,
    };

    revalidatePath("/dashboard/website-menu");

    return { success: true, data: formattedMenu };
  } catch (error) {
    console.error("Error creating website menu:", error);
    return {
      success: false,
      message: "Database Error: Failed to Create Website Menu.",
    };
  }
}

// Get all website menus with hierarchical structure
export async function getWebsiteMenus() {
  try {
    const menus = await getMany(
      'SELECT * FROM WebsiteMenu ORDER BY "order" ASC'
    );

    // Convert boolean fields
    const formattedMenus = menus.map((menu: any) => ({
      ...menu,
      isActive: menu.isActive === 1,
      isMegaMenu: menu.isMegaMenu === 1,
    }));

    // Build hierarchical structure
    const menuTree = buildMenuTree(formattedMenus);

    return { success: true, data: menuTree };
  } catch (error) {
    console.error("Error fetching website menus:", error);
    return {
      success: false,
      message: "Database Error: Failed to Fetch Website Menus.",
    };
  }
}

// Get flat list of all menus (for parent selection)
export async function getWebsiteMenusFlat() {
  try {
    const menus = await getMany(
      'SELECT * FROM WebsiteMenu ORDER BY "order" ASC'
    );

    // Convert boolean fields
    const formattedMenus = menus.map((menu: any) => ({
      ...menu,
      isActive: menu.isActive === 1,
      isMegaMenu: menu.isMegaMenu === 1,
    }));

    return { success: true, data: formattedMenus };
  } catch (error) {
    console.error("Error fetching website menus:", error);
    return {
      success: false,
      message: "Database Error: Failed to Fetch Website Menus.",
    };
  }
}

// Get public website menus (only active ones)
export async function getPublicWebsiteMenus() {
  try {
    const menus = await getMany(
      'SELECT * FROM WebsiteMenu WHERE isActive = 1 ORDER BY "order" ASC'
    );

    // Convert boolean fields
    const formattedMenus = menus.map((menu: any) => ({
      ...menu,
      isActive: true,
      isMegaMenu: menu.isMegaMenu === 1,
    }));

    // Build hierarchical structure
    const menuTree = buildMenuTree(formattedMenus);

    return { success: true, data: menuTree };
  } catch (error) {
    console.error("Error fetching public website menus:", error);
    return {
      success: false,
      message: "Database Error: Failed to Fetch Website Menus.",
    };
  }
}

// Update a website menu
export async function updateWebsiteMenu(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const url = (formData.get("url") as string) || null;
    const order = parseInt((formData.get("order") as string) || "0");
    const isActive = formData.get("isActive") === "true" ? 1 : 0;
    const parentId = (formData.get("parentId") as string) || null;
    const isMegaMenu = formData.get("isMegaMenu") === "true" ? 1 : 0;
    const iconClass = (formData.get("iconClass") as string) || null;
    const description = (formData.get("description") as string) || null;

    // Get existing menu
    const existingMenu = await getOne(
      "SELECT * FROM WebsiteMenu WHERE id = ?",
      [id]
    );

    if (!existingMenu) {
      return {
        success: false,
        message: "Website Menu not found.",
      };
    }

    // Prevent setting parent to self or creating circular references
    if (parentId === id) {
      return {
        success: false,
        message: "Menu cannot be its own parent.",
      };
    }

    // Check for circular reference
    if (parentId && (await hasCircularReference(id, parentId))) {
      return {
        success: false,
        message: "This would create a circular reference.",
      };
    }

    // After checking for circular references, add this:
    if (parentId && parentId !== "none") {
      const parentExists = await getOne(
        "SELECT id FROM WebsiteMenu WHERE id = ?",
        [parentId]
      );
      
      if (!parentExists) {
        return {
          success: false,
          message: "The selected parent menu does not exist.",
        };
      }
    }

    const updatedAt = new Date().toISOString();

    // Update website menu
    await query(
      'UPDATE WebsiteMenu SET title = ?, url = ?, "order" = ?, isActive = ?, parentId = ?, isMegaMenu = ?, iconClass = ?, description = ?, updatedAt = ? WHERE id = ?',
      [
        title,
        url,
        order,
        isActive,
        parentId === "" ? null : parentId, // Ensure empty strings are converted to null
        isMegaMenu,
        iconClass,
        description,
        updatedAt,
        id,
      ]
    );

    // Get updated record
    const updatedMenu = await getOne("SELECT * FROM WebsiteMenu WHERE id = ?", [
      id,
    ]);

    // Convert boolean fields
    const formattedMenu = {
      ...updatedMenu,
      isActive: updatedMenu.isActive === 1,
      isMegaMenu: updatedMenu.isMegaMenu === 1,
    };

    revalidatePath("/dashboard/website-menu");

    return { success: true, data: formattedMenu };
  } catch (error) {
    console.error("Error updating website menu:", error);
    return {
      success: false,
      message: "Database Error: Failed to Update Website Menu.",
    };
  }
}

// Delete a website menu
export async function deleteWebsiteMenu(id: string) {
  try {
    // Check if menu has children
    const children = await getMany(
      "SELECT id FROM WebsiteMenu WHERE parentId = ?",
      [id]
    );

    if (children.length > 0) {
      return {
        success: false,
        message:
          "Cannot delete menu with sub-menus. Please delete sub-menus first.",
      };
    }

    await query("DELETE FROM WebsiteMenu WHERE id = ?", [id]);

    revalidatePath("/dashboard/website-menu");

    return { success: true };
  } catch (error) {
    console.error("Error deleting website menu:", error);
    return {
      success: false,
      message: "Database Error: Failed to Delete Website Menu.",
    };
  }
}

// Update the order of website menus
export async function updateWebsiteMenusOrder(menuIds: string[]) {
  try {
    // Update each menu's order
    for (let i = 0; i < menuIds.length; i++) {
      await query('UPDATE WebsiteMenu SET "order" = ? WHERE id = ?', [
        i,
        menuIds[i],
      ]);
    }

    revalidatePath("/dashboard/website-menu");

    return { success: true };
  } catch (error) {
    console.error("Error updating website menu order:", error);
    return {
      success: false,
      message: "Database Error: Failed to Update Website Menu Order.",
    };
  }
}

// Helper function to build menu tree structure
function buildMenuTree(menus: any[]): MenuTreeItem[] {
  const menuMap = new Map();
  const rootMenus: MenuTreeItem[] = [];

  // Create a map of all menus
  menus.forEach((menu) => {
    menuMap.set(menu.id, {
      ...menu,
      children: [],
    });
  });

  // Build the tree structure
  menus.forEach((menu) => {
    const menuItem = menuMap.get(menu.id);

    if (menu.parentId && menuMap.has(menu.parentId)) {
      // Add to parent's children
      const parent = menuMap.get(menu.parentId);
      parent.children.push(menuItem);
    } else {
      // This is a root menu
      rootMenus.push(menuItem);
    }
  });

  // Sort children by order
  const sortByOrder = (items: MenuTreeItem[]) => {
    items.sort((a, b) => a.order - b.order);
    items.forEach((item) => {
      if (item.children.length > 0) {
        sortByOrder(item.children);
      }
    });
  };

  sortByOrder(rootMenus);

  return rootMenus;
}

// Helper function to check for circular references
async function hasCircularReference(
  menuId: string,
  parentId: string
): Promise<boolean> {
  let currentParentId: string | null = parentId;
  const visited = new Set([menuId]);

  while (currentParentId) {
    if (visited.has(currentParentId)) {
      return true; // Circular reference found
    }

    visited.add(currentParentId);

    const parent = await getOne(
      "SELECT parentId FROM WebsiteMenu WHERE id = ?",
      [currentParentId]
    );
    currentParentId = (parent?.parentId as string) || null;
  }

  return false;
}

// Get a single website menu by ID
export async function getWebsiteMenu(id: string) {
  try {
    // Get menu from database
    const menu = await getOne("SELECT * FROM WebsiteMenu WHERE id = ?", [id]);

    if (!menu) {
      return {
        success: false,
        message: "Website Menu not found.",
      };
    }

    // Convert boolean fields
    const formattedMenu = {
      ...menu,
      isActive: menu.isActive === 1,
      isMegaMenu: menu.isMegaMenu === 1,
    };

    return { success: true, data: formattedMenu };
  } catch (error) {
    console.error("Error getting website menu:", error);
    return {
      success: false,
      message: "Database Error: Failed to Get Website Menu.",
    };
  }
}
