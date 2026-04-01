# Role-Based Dashboard System Implementation

## Overview

Your React application now has a complete role-based dashboard system with separate interfaces for employees and administrators, styled with the modern theme system.

## New Components Created

### 1. **NavBar.jsx** (`src/components/NavBar.jsx`)

- Dynamic navigation bar that adapts based on user role
- Shows different menu items for admins vs employees
- Displays user information and logout button
- Sticky positioning at top of page
- **Styled by:** `src/styles/NavBar.css`

### 2. **EmployeeDashboard.jsx** (`src/components/EmployeeDashboard.jsx`)

- Card-based interface showing available forms
- Sample forms included:
  - Daily Tracker
  - Achievements
  - Leave Request
  - Client Feedback
- Cards display with custom badges, descriptions, and "Open Form" links
- Clicking cards opens modal or navigates to form
- **Styled by:** `src/styles/EmployeeDashboard.css`

### 3. **AdminDashboard.jsx** (`src/components/AdminDashboard.jsx`)

- Quick access cards for admin functions:
  - Manage Employees
  - Handle Issues
  - View Reports
  - Manage Forms
- Icon-based design for easy visual distinction
- **Styled by:** `src/styles/AdminDashboard.css`

### 4. **FormModal.jsx** (`src/components/FormModal.jsx`)

- Reusable modal component for form submission
- Accessible modal with backdrop, close button, and keyboard support
- Prevents body scroll when open
- Fully theme-aware with dark/light mode support
- **Styled by:** `src/styles/FormModal.css`

## Updated Components

### **App.jsx**

- Replaced old hardcoded navigation with new dynamic NavBar
- Implemented role-based Dashboard component that routes to:
  - **Admin:** AdminDashboard
  - **Employee:** EmployeeDashboard
- Added routes for admin pages:
  - `/admin/employees`
  - `/admin/errors`
  - `/admin/reports`
- All admin routes protected with `ProtectedRoute roles={["admin"]}`

### **Theme System (index.css)**

- Added `--shadow-float` variable for modal shadows
- Updated light theme `--muted` color to `#4e5566` (better contrast)
- Consistent shadow definitions for both themes

## Styling Features

### Card-Based UI

```css
.guide-card {
  - Rounded corners with subtle border
  - Hover animation: scale up + border color change
  - Focus state for keyboard accessibility
  - Smooth transitions
}
```

### Badge System

```css
.badge {
  - Color-coded badges: meeting, technical, strategy, optimization
  - Light/dark theme aware
  - Rounded pill shape
  - Uppercase labels with letter spacing
}
```

### Modal System

```css
.modal {
  - Fixed positioning with backdrop
  - Centered panel with max-width
  - Close button (×) in top-right
  - Prevents body scrolling when open
  - Keyboard accessible (Escape to close)
}
```

## File Structure

```
frontend/src/
├── components/
│   ├── NavBar.jsx              (NEW)
│   ├── EmployeeDashboard.jsx   (NEW)
│   ├── AdminDashboard.jsx      (NEW)
│   ├── FormModal.jsx           (NEW)
│   └── ThemeToggle.jsx
├── styles/                      (NEW DIRECTORY)
│   ├── NavBar.css              (NEW)
│   ├── EmployeeDashboard.css   (NEW)
│   ├── AdminDashboard.css      (NEW)
│   └── FormModal.css           (NEW)
├── App.jsx                      (UPDATED)
├── App.css                      (UPDATED)
├── index.css                    (UPDATED)
└── ...
```

## Role-Based Access

### Employee View

- Dashboard shows available forms as cards
- Can access:
  - Daily Tracker (`/daily-tracker`)
  - Form submissions
- NavBar shows: Dashboard, Daily Tracker, Logout

### Admin View

- Dashboard shows admin management panels
- Can access:
  - Employee Management (`/admin/employees`)
  - Issue Management (`/admin/errors`)
  - Reporting (`/admin/reports`)
- NavBar shows: Admin Dashboard, Employees, Issues, Reports, Logout

## How to Use

### For Employees

1. Login as an employee (role: "employee")
2. Dashboard loads with available form cards
3. Click any card to submit a form or navigate to form page
4. Form appears in modal dialog

### For Admins

1. Login as an admin (role: "admin")
2. Dashboard loads with admin management options
3. Click any card to navigate to admin page
4. Manage system from admin pages

### Adding New Forms

Edit `AVAILABLE_FORMS` in `EmployeeDashboard.jsx`:

```jsx
const AVAILABLE_FORMS = [
  {
    id: "unique-id",
    title: "Form Title",
    description: "Form description",
    badges: ["Badge1", "Badge2"],
    link: "/path-to-form", // optional: direct link
  },
];
```

Add badge color in `BADGE_COLORS` mapping:

```jsx
const BADGE_COLORS = {
  Badge1: "meeting", // color: strategy, technical, optimization, etc.
  Badge2: "technical",
};
```

## Styling Customization

### Change Badge Colors

Update `src/styles/EmployeeDashboard.css`:

```css
.badge.strategy {
  color: #39d98a;
  border-color: rgba(57, 217, 138, 0.3);
  background: rgba(57, 217, 138, 0.05);
}
```

### Update NavBar Colors

Edit `src/styles/NavBar.css` and change CSS variable references

### Modify Card Styling

Update `.guide-card` and `.guide-card:hover` in `EmployeeDashboard.css`

## Theme Support

All components use CSS variables for automatic light/dark mode support:

- Dark theme (default): `#0f1115` background
- Light theme: `#f8f9fc` background
- Smooth transitions when theme changes
- Badges automatically adjust colors
- Forms adapt colors based on theme

## Accessibility Features

✅ **NavBar**

- Semantic navigation with links
- User role clearly labeled

✅ **EmployeeDashboard**

- Cards are keyboard accessible (Enter/Space to activate)
- ARIA labels on cards
- Proper heading hierarchy

✅ **FormModal**

- `role="dialog"` and `aria-modal="true"`
- Focus management
- Keyboard support (Escape to close)
- Backdrop also closes modal
- Accessible form controls

## Browser Support

- Modern browsers with CSS custom properties support
- Flexbox and Grid for layout
- Focus-visible for keyboard accessibility

## Troubleshooting

### NavBar not showing

- Ensure user is authenticated (check AuthContext)
- Make sure user object has required fields

### Forms not displaying

- Check that `AVAILABLE_FORMS` array is populated
- Verify badge color is defined in `BADGE_COLORS`

### Modal not opening

- Ensure FormModal is rendered when form has no direct link
- Check browser console for errors

### Styles not applying

- Clear browser cache
- Verify CSS files are imported in components
- Check that theme variables are defined in `index.css`

## Future Enhancements

- Add form validation
- Integrate with backend API for form submission
- Add loading states and error handling
- Create user profile menu
- Add notification system
- Implement form templates/builder
- Add analytics tracking
