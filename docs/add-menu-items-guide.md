# How to Add Menu Items to Replace Static Links

Since we removed the static menu items (About, News, Contact, Komersial), you need to add them through the dashboard to make them appear again.

## Steps to Add Menu Items:

### 1. Go to Dashboard

Navigate to: `http://localhost:9004/dashboard/website-menu`

### 2. Add Each Menu Item

#### Add "About" Menu:

- Click "Add New Menu"
- Title: `About`
- URL: `/about`
- Order: `1`
- Parent Menu: (leave empty)
- Active: ✓ checked
- Mega Menu: ☐ unchecked
- Save

#### Add "News" Menu:

- Click "Add New Menu"
- Title: `News`
- URL: `/news`
- Order: `2`
- Parent Menu: (leave empty)
- Active: ✓ checked
- Mega Menu: ☐ unchecked
- Save

#### Add "Contact" Menu:

- Click "Add New Menu"
- Title: `Contact`
- URL: `/contact`
- Order: `3`
- Parent Menu: (leave empty)
- Active: ✓ checked
- Mega Menu: ☐ unchecked
- Save

#### Add "Komersial" Menu:

- Click "Add New Menu"
- Title: `Komersial`
- URL: `/komersial`
- Order: `4`
- Parent Menu: (leave empty)
- Active: ✓ checked
- Mega Menu: ☐ unchecked
- Save

### 3. Result

After adding these menu items, your header navigation will show:

```
Home | About | News | Contact | Komersial | Projects
```

### 4. Current Header Structure

Now the header only shows:

- **Home** (hardcoded)
- **Dynamic menu items** (from database)
- **Projects** (special dropdown with project list)

This eliminates the duplicate menu issue and makes all navigation dynamic and manageable through the admin dashboard.

### 5. Benefits

- No more duplicate menus
- All navigation is database-driven
- Easy to add/remove/reorder menu items
- Consistent across desktop and mobile
- No code changes needed for menu updates

## Notes:

- The "Projects" dropdown is kept separate because it dynamically lists actual projects from the database
- The "Home" link is kept as a hardcoded default
- All other navigation should be managed through the dashboard
