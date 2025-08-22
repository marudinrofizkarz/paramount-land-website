# WhatsApp Button Implementation

## Overview

This document outlines how the global floating WhatsApp button is implemented across the Paramount Land website.

## Components

1. **WhatsAppButton Component** (`/src/components/whatsapp-button.tsx`)

   - The base component that renders the floating WhatsApp button
   - Features:
     - Animated entrance with spring effect
     - Pulse animation to attract attention
     - Tooltip on hover
     - Direct link to WhatsApp chat with pre-filled message

2. **GlobalWhatsAppButton Component** (`/src/components/global-whatsapp-button.tsx`)

   - Wrapper for WhatsAppButton with conditional rendering logic
   - Hides the button on admin/dashboard pages
   - Uses client-side detection of current path

3. **WhatsAppLayout Component** (`/src/components/whatsapp-layout.tsx`)
   - Layout wrapper that adds the WhatsApp button to any content
   - Integrated into the root layout for site-wide presence

## Implementation

The WhatsApp button is integrated at the root layout level, making it appear on all pages across the site except admin/dashboard pages. This ensures users can reach out easily from anywhere on the website.

## Contact Information

The button is configured with:

- Phone Number: 6281387118533 (Rijal Sutanto)
- Default Message: "Halo, saya tertarik dengan properti Paramount Land. Boleh saya tahu informasi lebih lanjut?"

## Customization

To change the appearance or behavior of the WhatsApp button:

1. Modify the `WhatsAppButton` component for visual changes
2. Update the `GlobalWhatsAppButton` component to change visibility rules
3. Configure different messages for specific pages by passing props through the layout
