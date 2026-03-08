

## Plan: Enhance Create Invoice Section UX

### Current State
The form is a single long scrollable card with all fields in sequence. It works but lacks visual hierarchy, step organization, and modern UX patterns.

### Proposed Enhancements

**1. Stepper / Sectioned Layout with Collapsible Accordion**
Replace the single long form with clearly grouped, visually distinct sections using accordions or numbered steps:
- **Step 1 - Client & Basics**: Client name, sender, invoice prefix, dates, status
- **Step 2 - Line Items**: Items table with inline editing, drag handle feel
- **Step 3 - Currency & Rates**: Currency selector, conversion rate, total summary
- **Step 4 - Branding & Notes**: Company branding, notes/templates
- Each section gets a numbered badge, completion indicator (checkmark when filled), and smooth open/close animation

**2. Improved Line Items Table**
- Replace stacked cards with a compact table-style layout on desktop (card layout preserved on mobile)
- Add a running subtotal row at the bottom of items
- Empty state with illustration text when no items
- Subtle row hover effect and better spacing

**3. Sticky Total Summary Bar**
- Add a floating/sticky summary bar at the bottom of the form showing: total amount, converted amount, and the submit button
- This keeps the CTA always visible without scrolling to the bottom

**4. Quick Due Date Shortcuts**
- Add preset buttons: "7 days", "14 days", "30 days", "60 days" next to the due date picker
- Clicking sets the due date relative to invoice date instantly

**5. Visual Polish**
- Add section icons and subtle gradient headers for each group
- Progress indicator showing form completion percentage
- Better empty/default states with placeholder illustrations
- Animate the total amount change with a subtle pulse
- Add a "Reset Form" button in the header

### Files to Modify
- `src/components/dashboard/CreateInvoiceForm.tsx` — Full restructure with sectioned layout, sticky total bar, due date shortcuts, improved items UI

### No New Dependencies
All enhancements use existing Radix UI components (Accordion, Tooltip, etc.) and Tailwind utilities.

