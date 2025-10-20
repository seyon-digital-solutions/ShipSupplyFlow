# Ship Inventory Management System - Design Guidelines

## Design Approach

**Selected Approach:** Custom Maritime-Inspired Design System
- Foundation: Material Design principles for data-dense applications
- Theme: Professional naval/maritime aesthetic with blue and white palette
- Focus: Utility-first design optimized for onboard ship environments and tablet use
- Key Principle: Information clarity and quick data access over decorative elements

## Color Palette

**Primary Colors:**
- Navy Blue (Primary): 215 85% 25% - Main brand color for headers, primary buttons, active states
- Ocean Blue (Secondary): 210 75% 45% - Links, secondary actions, accents
- Light Blue (Tertiary): 205 85% 92% - Backgrounds, hover states, subtle highlights

**Neutral Colors:**
- White: 0 0% 100% - Main background, card surfaces
- Light Gray: 210 20% 96% - Page backgrounds, subtle borders
- Medium Gray: 215 15% 65% - Secondary text, borders
- Dark Gray: 215 20% 25% - Primary text, icons

**Status Colors:**
- Success Green: 145 65% 45% - Stock received, positive actions
- Warning Amber: 35 90% 55% - Low stock alerts, caution states
- Danger Red: 355 75% 50% - Out of stock, critical alerts
- Info Blue: 205 85% 55% - Information badges, help text

**Light Mode Only:** Given bright onboard conditions, implement light mode exclusively for optimal visibility.

## Typography

**Primary Font:** Inter via Google Fonts CDN
- Headings: Inter 600 (Semibold)
- Body: Inter 400 (Regular)
- Labels/UI: Inter 500 (Medium)
- Data/Numbers: Inter 500 (tabular-nums for alignment)

**Type Scale:**
- Page Title: text-3xl (30px) - Dashboard, page headers
- Section Heading: text-xl (20px) - Card titles, section headers
- Subsection: text-lg (18px) - Modal titles, table headers
- Body Text: text-base (16px) - Default content, form labels
- Small Text: text-sm (14px) - Secondary info, table data
- Tiny Text: text-xs (12px) - Timestamps, badges

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, and 16 consistently
- Component padding: p-4 to p-6 (cards, modals)
- Section spacing: my-8 to my-12 (vertical rhythm)
- Grid gaps: gap-4 to gap-6 (card grids)
- Form spacing: space-y-4 (input fields)

**Container Strategy:**
- Max width: max-w-7xl (1280px) for main content
- Sidebar width: w-64 (256px) on desktop, collapsible on tablet
- Top bar height: h-16 (64px) fixed across all screens

**Responsive Breakpoints:**
- Mobile: Base (< 768px) - Single column, hamburger menu
- Tablet: md (768px+) - Primary target, sidebar visible
- Desktop: lg (1024px+) - Full sidebar, wider tables

## Component Library

### A. Navigation Components

**Sidebar Navigation:**
- Width: 256px on desktop/tablet, collapsible drawer on mobile
- Background: Navy Blue (215 85% 25%)
- Items: White text with Ocean Blue hover background (210 75% 45% at 20% opacity)
- Icons: Heroicons outline style, 24px, positioned left of text
- Active state: Light Blue background (205 85% 92% at 15% opacity) with border-l-4 accent
- Sections: Dashboard, Inventory, Reports, Settings with dividers between groups

**Top Navigation Bar:**
- Fixed height: 64px
- Background: White with bottom border (Light Gray)
- Left: Company logo/name (text-xl font-semibold in Navy Blue)
- Right: User avatar (circular, 40px), name, role badge, logout icon
- Mobile: Hamburger menu icon (left), logo (center), user icon (right)

### B. Dashboard Components

**Summary Cards (Grid):**
- Layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Card structure: White background, rounded-lg, shadow-sm, p-6
- Content: Large number (text-3xl, Navy Blue), label below (text-sm, Medium Gray)
- Icon: Top-right corner, 48px, Light Blue background circle, Navy Blue icon
- Border-left accent: 4px colored stripe (Success Green for total items, Warning Amber for low stock, Ocean Blue for categories)

**Store Type Cards:**
- Grid: grid-cols-1 md:grid-cols-3 with gap-6
- Structure: Card with rounded-lg, p-6, border-2 border-Light-Blue
- Header: Store name (text-lg font-semibold), count badge (bg-Ocean-Blue, text-white, rounded-full, px-3 py-1)
- Content: Mini bar chart or progress indicator showing stock levels
- Footer: "View Details" link in Ocean Blue

**Recent Transactions List:**
- Container: White card, rounded-lg, shadow-sm
- Header: "Recent Activity" with timestamp filter dropdown
- Items: Each transaction as row with icon (In/Out), item name, quantity change, timestamp (text-sm, Medium Gray)
- Dividers: border-b border-Light-Gray between items
- Max height: 400px with overflow-y-auto

### C. Data Table Component (Inventory List)

**Table Structure:**
- Container: White background, rounded-lg, shadow-sm
- Header row: bg-Light-Blue, text-Navy-Blue, font-medium, sticky top-0
- Data rows: Alternating white/Light-Gray (bg-Light-Gray at 30% opacity)
- Hover: bg-Ocean-Blue at 5% opacity
- Borders: border-b border-Light-Gray between rows
- Padding: px-4 py-3 for cells
- Responsive: Horizontal scroll on mobile, card layout option for small screens

**Table Toolbar:**
- Position: Above table, mb-4
- Left side: Search input (w-64, rounded-md, border-Medium-Gray, focus ring in Ocean Blue)
- Right side: Filter dropdowns (Category, Location), Action buttons group
- Spacing: justify-between with gap-4

**Action Buttons:**
- Primary: "Add Item" - bg-Ocean-Blue, text-white, rounded-md, px-4 py-2, shadow-sm
- Secondary: "Issue Item", "Receive Item" - border-2 border-Ocean-Blue, text-Ocean-Blue, rounded-md, px-4 py-2
- Icons: Heroicons mini, 20px, positioned left of text

### D. Modal Components (Add/Edit Item)

**Modal Structure:**
- Overlay: bg-Dark-Gray at 50% opacity, backdrop-blur-sm
- Container: White, rounded-lg, shadow-2xl, max-w-2xl, p-8
- Header: text-2xl font-semibold, Navy Blue, mb-6, with close icon (top-right)
- Form layout: space-y-6 (vertical stacking of fields)

**Form Fields:**
- Label: text-sm font-medium, Navy Blue, mb-1
- Input: w-full, rounded-md, border-Medium-Gray, px-3 py-2, focus ring Ocean Blue
- Dropdown: Same styling as input with chevron icon
- Textarea: Same styling, min-h-24 for Description field
- Helper text: text-xs, Medium Gray, mt-1

**Modal Footer:**
- Layout: flex justify-end gap-3, pt-6, border-t border-Light-Gray
- Cancel: border-2 border-Medium-Gray, text-Dark-Gray, rounded-md, px-6 py-2
- Save: bg-Ocean-Blue, text-white, rounded-md, px-6 py-2, shadow-sm

### E. Form Components (Stock In/Out)

**Form Container:**
- White card, rounded-lg, shadow-sm, p-8, max-w-3xl
- Layout: Two-column grid on desktop (grid-cols-2 gap-6), single column on mobile

**Field Groups:**
- Item dropdown: Searchable select with autocomplete
- Quantity: Number input with +/- stepper buttons
- Date picker: Input with calendar icon, defaults to today
- Movement type: Radio button group (Stock In/Stock Out) with colored indicators
- Remarks: Full-width textarea spanning both columns

**Submit Button:**
- Full-width on mobile, right-aligned on desktop
- bg-Success-Green for Stock In, bg-Ocean-Blue for Stock Out
- Large sizing: px-8 py-3, text-lg

### F. Report Components (Low Stock)

**Report Header:**
- Title: "Low Stock Alert" with warning icon (Warning Amber)
- Subtitle: Count of items below minimum stock
- Export button: "Export CSV" with download icon, outlined style

**Alert List:**
- Items displayed as warning cards (border-l-4 border-Warning-Amber)
- Each card: Item name (font-semibold), current vs. minimum stock, last updated
- Action: "Reorder" button (small, Ocean Blue)
- Sort options: Alphabetical, by deficit, by category

### G. Settings/Users Page

**User List Table:**
- Columns: Name, Email, Role, Status, Actions
- Role badges: Admin (Navy Blue bg), Staff (Ocean Blue bg), white text, rounded-full, px-3 py-1
- Actions: Edit icon, Delete icon (hover to show, Medium Gray, hover Dark Gray)

**Add User Form:**
- Side panel or modal pattern
- Fields: Name, Email, Password, Role (dropdown), Active toggle switch
- Toggle styling: bg-Light-Gray inactive, bg-Success-Green active

## Icons

**Icon Library:** Heroicons (outline style for navigation, solid for actions)
- CDN: Use Heroicons via CDN link
- Size: 20px for UI elements, 24px for navigation, 16px for inline icons
- Color: Inherit from parent or Navy Blue default

**Key Icons:**
- Dashboard: chart-bar
- Inventory: archive-box
- Reports: document-text
- Settings: cog-6-tooth
- Stock In: arrow-down-circle
- Stock Out: arrow-up-circle
- Low Stock: exclamation-triangle
- Add: plus-circle
- Edit: pencil-square
- Delete: trash

## Responsive Behavior

**Tablet (768px - 1024px):** Primary optimization target
- Sidebar visible and persistent
- Tables: All columns visible with comfortable spacing
- Forms: Two-column layout for better space utilization
- Cards: 2-3 column grids

**Mobile (<768px):**
- Sidebar: Collapsible drawer with overlay
- Tables: Transform to card layout or horizontal scroll
- Forms: Single column stacking
- Summary cards: Full-width stacking

**Desktop (>1024px):**
- Full-width sidebar (256px)
- Tables: Maximum columns with optimal spacing
- Dashboard: 4-column grid for summary cards

## Visual Enhancements

**Shadows:**
- Cards: shadow-sm (subtle)
- Modals: shadow-2xl (prominent)
- Buttons: shadow-sm on hover
- Dropdowns: shadow-lg

**Borders:**
- Corner radius: rounded-md (6px) for buttons/inputs, rounded-lg (8px) for cards
- Border width: border (1px) default, border-2 for emphasis, border-l-4 for accents

**Transitions:**
- All interactive elements: transition-all duration-200
- Hover states: Subtle color shifts, no dramatic animations
- Focus states: Ring visible (ring-2 ring-Ocean-Blue ring-offset-2)

## No Images Required

This is a utility application focused on data management. No hero images or decorative photography needed. Visual interest comes from:
- Maritime color palette
- Clean iconography
- Data visualizations (charts, progress bars)
- Status indicators and badges