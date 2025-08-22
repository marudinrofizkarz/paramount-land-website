// Example menu structure for reference
// This shows how to structure your website menu in the dashboard

export const exampleMenuStructure = [
  {
    title: "About",
    url: "/about",
    order: 1,
    isActive: true,
    isMegaMenu: false,
    children: [],
  },
  {
    title: "Services",
    url: "#",
    order: 2,
    isActive: true,
    isMegaMenu: true,
    children: [
      {
        title: "Residential",
        url: "/services/residential",
        order: 1,
        isActive: true,
        description: "Premium residential properties",
      },
      {
        title: "Commercial",
        url: "/services/commercial",
        order: 2,
        isActive: true,
        description: "Modern commercial spaces",
      },
      {
        title: "Investment",
        url: "/services/investment",
        order: 3,
        isActive: true,
        description: "Smart property investments",
      },
    ],
  },
  {
    title: "News",
    url: "/news",
    order: 3,
    isActive: true,
    isMegaMenu: false,
    children: [],
  },
  {
    title: "Contact",
    url: "/contact",
    order: 4,
    isActive: true,
    isMegaMenu: false,
    children: [],
  },
];

/*
How to use the Website Menu System:

1. Go to /dashboard/website-menu in your admin panel
2. Click "Add New Menu" to create menu items
3. For parent menus:
   - Set "Parent Menu" to empty/root level
   - Enable "Mega Menu" if you want a dropdown with multiple columns
   - Set order number for positioning
4. For child menus:
   - Select the parent menu in "Parent Menu" dropdown
   - Set appropriate order for positioning within parent
   - Add descriptions for mega menu items
5. Toggle "Active" status to show/hide menu items
6. Save and the menu will automatically appear in:
   - Header navigation (desktop and mobile)
   - Footer menu section

Features:
- Hierarchical menu structure (parent -> child -> grandchild)
- Mega menu support for complex dropdowns
- Active/inactive status control
- Custom ordering
- Mobile-responsive design
- Database-driven (Turso)
- Real-time updates without code changes

Database Table: WebsiteMenu
- id: Unique identifier
- title: Menu display text
- url: Link destination (optional for parent menus)
- order: Sort position
- isActive: Show/hide toggle
- parentId: Parent menu reference (null for root items)
- isMegaMenu: Enable mega menu dropdown
- iconClass: CSS icon class (optional)
- description: Menu item description (shows in mega menus)
- createdAt/updatedAt: Timestamps
*/
