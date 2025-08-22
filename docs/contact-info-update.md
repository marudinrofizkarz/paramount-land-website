# Contact Information Update Summary

Date: August 22, 2025

## Updated Contact Information

- Email: rijal.sutanto@paramount-land.com
- Phone: 081387118533
- WhatsApp: 6281387118533 (with country code)

## Files Updated

1. **Footer Component**

   - Updated phone and email in footer contact section
   - Updated structured data with new contact information

2. **Project Details Page**

   - Updated contact buttons with new phone and WhatsApp numbers
   - Updated sales person name from "Rizal" to "Rijal"

3. **Contact Page**
   - Updated contact card information with new email and phone
   - Updated direct call and WhatsApp buttons with new numbers
4. **About Page**

   - Updated phone numbers across all office locations

5. **WhatsApp Button Component**

   - Updated default WhatsApp number

6. **Unit Detail Page**

   - Updated WhatsApp button with the new number
   - Updated email link with the new email address

7. **Unit Detail Page**
   - Updated WhatsApp button with the new number
   - Updated email link with the new email address
8. **Global WhatsApp Button**

   - Added WhatsApp floating button to all pages of the website
   - Created new components: GlobalWhatsAppButton and WhatsAppLayout
   - Modified root layout to include the floating WhatsApp button on all pages
   - Set up conditional rendering to hide the button on admin/dashboard pages

9. **Database Update Script**
   - Created a script at `/scripts/update-contact-info.js` to update contact information in the database
   - This script will update the WebsiteSettings table with the new phone, WhatsApp and email values

## How to Run the Database Update

To ensure the changes are also stored in the database, run the following command:

```bash
cd /Users/macbook/Downloads/paramount-land-main
node scripts/update-contact-info.js
```

This will update the stored website settings in the database, ensuring that all dynamically loaded content also uses the new contact information.

## Verification Steps

1. Check the website frontend to ensure all contact information is displaying correctly
2. Verify that contact links (tel: and mailto:) are working properly
3. Test the WhatsApp integration to ensure it opens with the correct number and message
4. Confirm the database has been updated by checking the website settings in the admin panel
