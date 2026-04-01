# Frontend Components & Hooks Implementation Guide

## Overview

This guide documents the complete reusable component library, custom hooks, and utility functions created for the SellerRep frontend application.

---

## 📦 Shared Components Library

All shared components are located in `src/components/shared/` and are exported via `src/components/shared/index.js`

### 1. Modal Component

**File:** `src/components/shared/Modal.jsx`
**Purpose:** Generic modal dialog wrapper
**Props:**

- `isOpen` (boolean, required): Control visibility
- `onClose` (function, required): Close handler
- `title` (string): Modal header title
- `children` (ReactNode): Modal body content
- `footer` (ReactNode): Optional footer with actions

**Usage Example:**

```jsx
import { useState } from "react";
import { Modal, Button } from "@/components/shared";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        footer={
          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to proceed?</p>
      </Modal>
    </>
  );
}
```

---

### 2. Button Component

**File:** `src/components/shared/Button.jsx`
**Purpose:** Standardized button with variants and sizes
**Props:**

- `children` (ReactNode, required): Button text/content
- `variant` (string): 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost' (default: 'primary')
- `size` (string): 'small' | 'medium' | 'large' (default: 'medium')
- `disabled` (boolean): Disable button
- `onClick` (function): Click handler
- `type` (string): Button type (default: 'button')
- `className` (string): Additional CSS class

**Usage Example:**

```jsx
import { Button } from '@/components/shared';

<Button variant="primary" size="large" onClick={() => console.log('clicked')}>
  Submit
</Button>

<Button variant="danger" size="small" disabled={isLoading}>
  Delete
</Button>
```

---

### 3. Input Component

**File:** `src/components/shared/Input.jsx`
**Purpose:** Text input with validation support
**Props:**

- `label` (string): Field label
- `type` (string): Input type (default: 'text')
- `name` (string, required): Field name
- `value` (string): Current value
- `onChange` (function): Change handler
- `error` (string): Error message to display
- `placeholder` (string): Placeholder text
- `required` (boolean): Mark as required
- `disabled` (boolean): Disable input

**Usage Example:**

```jsx
import { Input } from "@/components/shared";

<Input
  label="Email Address"
  type="email"
  name="email"
  value={values.email}
  onChange={handleChange}
  error={errors.email}
  placeholder="user@example.com"
  required
/>;
```

---

### 4. Select Component

**File:** `src/components/shared/Select.jsx`
**Purpose:** Dropdown select with validation support
**Props:**

- `label` (string): Field label
- `name` (string, required): Field name
- `value` (string): Current value
- `onChange` (function): Change handler
- `options` (array, required): Options array [{ label, value }] or ['option1', 'option2']
- `error` (string): Error message
- `placeholder` (string): Placeholder option
- `required` (boolean): Mark as required
- `disabled` (boolean): Disable select

**Usage Example:**

```jsx
import { Select } from "@/components/shared";

<Select
  label="Department"
  name="department"
  value={values.department}
  onChange={handleChange}
  options={[
    { label: "Sales", value: "sales" },
    { label: "Marketing", value: "marketing" },
    { label: "Engineering", value: "engineering" },
  ]}
  error={errors.department}
  required
/>;
```

---

### 5. TextArea Component

**File:** `src/components/shared/TextArea.jsx`
**Purpose:** Multi-line text input with validation
**Props:**

- `label` (string): Field label
- `name` (string, required): Field name
- `value` (string): Current value
- `onChange` (function): Change handler
- `error` (string): Error message
- `placeholder` (string): Placeholder text
- `required` (boolean): Mark as required
- `rows` (number): Number of rows (default: 4)
- `disabled` (boolean): Disable textarea

**Usage Example:**

```jsx
import { TextArea } from "@/components/shared";

<TextArea
  label="Description"
  name="description"
  value={values.description}
  onChange={handleChange}
  rows={5}
  error={errors.description}
  placeholder="Enter detailed description..."
/>;
```

---

### 6. Card Component

**File:** `src/components/shared/Card.jsx`
**Purpose:** Reusable card container
**Props:**

- `children` (ReactNode): Card content
- `title` (string): Optional card header
- `footer` (ReactNode): Optional card footer
- `className` (string): Additional CSS class
- `onClick` (function): Click handler

**Usage Example:**

```jsx
import { Card, Button } from "@/components/shared";

<Card
  title="User Profile"
  footer={<Button variant="primary">Edit Profile</Button>}
>
  <p>Name: John Doe</p>
  <p>Email: john@example.com</p>
</Card>;
```

---

### 7. Spinner Component

**File:** `src/components/shared/Spinner.jsx`
**Purpose:** Loading indicator
**Props:**

- `size` (string): 'small' | 'medium' | 'large' (default: 'medium')
- `className` (string): Additional CSS class

**Usage Example:**

```jsx
import { Spinner } from "@/components/shared";

{
  isLoading && <Spinner size="large" />;
}
```

---

### 8. Toast Component

**File:** `src/components/shared/Toast.jsx`
**Purpose:** Toast notification for user feedback
**Props (Toast):**

- `message` (string): Notification message
- `type` (string): 'info' | 'success' | 'error' | 'warning'
- `duration` (number): Auto-close duration in ms (0 for no auto-close)
- `onClose` (function): Close handler

**Props (ToastContainer):**

- `toasts` (array): Array of toast objects
- `onRemove` (function): Function to remove toast by id

**Usage Example:**

```jsx
import { ToastContainer, useNotifications } from "@/hooks";

function MyComponent() {
  const { notifications, removeNotification, success, error } =
    useNotifications();

  const handleSuccess = () => {
    success("Operation completed successfully!");
  };

  const handleError = () => {
    error("Something went wrong!");
  };

  return (
    <>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>

      <ToastContainer toasts={notifications} onRemove={removeNotification} />
    </>
  );
}
```

---

### 9. Table Component

**File:** `src/components/shared/Table.jsx`
**Purpose:** Data table with sorting/filtering support
**Props:**

- `columns` (array, required): Column definitions [{ key, label, width, render }]
- `data` (array, required): Table data
- `onRowClick` (function): Row click handler
- `striped` (boolean): Alternate row colors (default: true)
- `hover` (boolean): Hover effect (default: true)
- `className` (string): Additional CSS class

**Usage Example:**

```jsx
import { Table } from "@/components/shared";

const columns = [
  { key: "id", label: "ID", width: "80px" },
  { key: "name", label: "Name", width: "200px" },
  { key: "email", label: "Email" },
  {
    key: "status",
    label: "Status",
    render: (value) => <span className={`badge badge-${value}`}>{value}</span>,
  },
];

<Table
  columns={columns}
  data={employees}
  onRowClick={(row) => console.log("Selected:", row)}
/>;
```

---

## 🎣 Custom Hooks

All hooks are located in `src/hooks/` and exported via `src/hooks/index.js`

### 1. useForm Hook

**File:** `src/hooks/useForm.js`
**Purpose:** Form state management with validation
**Returns:**

- `values`: Current form values
- `errors`: Form errors object
- `touched`: Touched fields object
- `isSubmitting`: Submission state
- `handleChange`: Change event handler
- `handleBlur`: Blur event handler
- `handleSubmit`: Form submit handler
- `reset`: Reset form to initial values
- `setFieldValue`: Set specific field value
- `setFieldError`: Set specific field error

**Usage Example:**

```jsx
import { useForm } from "@/hooks";

const handleSubmit = async (values) => {
  const response = await api.createUser(values);
  console.log("User created:", response);
};

const validate = (values) => {
  const errors = {};
  if (!values.email) errors.email = "Email is required";
  if (!values.password) errors.password = "Password is required";
  return errors;
};

const { values, errors, handleChange, handleBlur, handleSubmit } = useForm(
  { email: "", password: "" },
  handleSubmit,
  validate,
);

<form onSubmit={handleSubmit}>
  <Input
    name="email"
    value={values.email}
    onChange={handleChange}
    onBlur={handleBlur}
    error={errors.email}
  />
  <Input
    name="password"
    type="password"
    value={values.password}
    onChange={handleChange}
    onBlur={handleBlur}
    error={errors.password}
  />
  <Button type="submit">Submit</Button>
</form>;
```

---

### 2. useFetch Hook

**File:** `src/hooks/useFetch.js`
**Purpose:** Data fetching with loading/error states
**Params:**

- `fetchFn`: Function or URL to fetch
- `dependencies`: Re-fetch dependencies array
- `options`: { skip, delay }

**Returns:**

- `data`: Fetched data
- `loading`: Loading state
- `error`: Error message
- `refetch`: Function to re-fetch data

**Usage Example:**

```jsx
import { useFetch } from "@/hooks";
import { getAllEmployees } from "@/api/employees.api";

function EmployeeList() {
  const {
    data: employees,
    loading,
    error,
    refetch,
  } = useFetch(getAllEmployees, []);

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <Table columns={columns} data={employees} />
    </div>
  );
}
```

---

### 3. useLocalStorage Hook

**File:** `src/hooks/useLocalStorage.js`
**Purpose:** Persistent storage with localStorage
**Params:**

- `key`: Storage key
- `initialValue`: Initial value if key doesn't exist

**Returns:**

- `[value, setValue]`: Like useState but persisted

**Usage Example:**

```jsx
import { useLocalStorage } from "@/hooks";

function UserPreferences() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [sidebarOpen, setSidebarOpen] = useLocalStorage("sidebarOpen", true);

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
```

---

### 4. useNotifications Hook

**File:** `src/hooks/useNotifications.js`
**Purpose:** Toast notification management
**Returns:**

- `notifications`: Array of current notifications
- `addNotification(message, type, duration)`: Add custom notification
- `success(message, duration)`: Add success notification
- `error(message, duration)`: Add error notification
- `warning(message, duration)`: Add warning notification
- `info(message, duration)`: Add info notification
- `removeNotification(id)`: Remove notification by id

**Usage Example:**

```jsx
import { useNotifications } from "@/hooks";
import { ToastContainer } from "@/components/shared";

function MyComponent() {
  const { notifications, removeNotification, success, error } =
    useNotifications();

  const handleSubmit = async (data) => {
    try {
      await api.createUser(data);
      success("User created successfully!");
    } catch (err) {
      error("Failed to create user");
    }
  };

  return (
    <>
      {/* Component content */}
      <ToastContainer toasts={notifications} onRemove={removeNotification} />
    </>
  );
}
```

---

## 🛠️ Utility Functions

All utilities are located in `src/utils/` and exported via `src/utils/index.js`

### Validation Utilities (`src/utils/validation.js`)

```jsx
import { validators, validateForm } from "@/utils/validation";

// Single field validation
const emailError = validators.email("test@example.com");
const passwordError = validators.password("pass123");

// Batch form validation
const errors = validateForm(
  { email: "test@example.com", password: "Pass123!" },
  {
    email: [validators.required, validators.email],
    password: [validators.required, validators.password],
  },
);

// Available validators:
// - required(value, fieldName)
// - email(value)
// - minLength(value, length, fieldName)
// - maxLength(value, length, fieldName)
// - number(value)
// - phone(value)
// - url(value)
// - password(value)
```

---

### Error Handling Utilities (`src/utils/errorHandling.js`)

```jsx
import {
  getErrorMessage,
  getFieldErrors,
  isAuthError,
} from "@/utils/errorHandling";

try {
  await api.createUser(data);
} catch (error) {
  // Get user-friendly message
  const message = getErrorMessage(error);

  // Get field-level errors from validation error
  const fieldErrors = getFieldErrors(error);

  // Check error type
  if (isAuthError(error)) {
    // User not authenticated, redirect to login
  }
}
```

---

### Helper Functions (`src/utils/helpers.js`)

```jsx
import {
  formatDate,
  formatTime,
  formatCurrency,
  truncate,
  capitalize,
  deepClone,
  debounce,
  groupBy,
} from "@/utils/helpers";

// Date/time formatting
formatDate(new Date(), "short"); // "Jan 15, 2024"
formatDate(new Date(), "long"); // "January 15, 2024"
formatTime(new Date()); // "02:30 PM"
formatCurrency(1000, "USD"); // "$1,000.00"

// String manipulation
truncate("Long text...", 20); // "Long text......"
capitalize("hello"); // "Hello"

// Object utilities
const clone = deepClone(complexObj);
const grouped = groupBy(employees, "department");
```

---

## 📚 Complete Implementation Example

Here's a complete example using all components and hooks together:

**File: `src/pages/Employees.jsx`**

```jsx
import { useState } from "react";
import { useForm, useFetch, useNotifications } from "@/hooks";
import {
  Modal,
  Button,
  Input,
  Select,
  Table,
  Spinner,
  ToastContainer,
} from "@/components/shared";
import { validateForm, validators, getErrorMessage } from "@/utils";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
} from "@/api/employees.api";

export default function Employees() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const {
    data: employees,
    loading,
    error,
    refetch,
  } = useFetch(getAllEmployees, []);
  const {
    notifications,
    removeNotification,
    success,
    error: showError,
  } = useNotifications();

  const validationSchema = {
    firstName: [
      validators.required,
      (v) => validators.minLength(v, 3, "First name"),
    ],
    lastName: [validators.required],
    email: [validators.required, validators.email],
    department: [validators.required],
  };

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await updateEmployee(editingId, values);
        success("Employee updated successfully");
      } else {
        await createEmployee(values);
        success("Employee created successfully");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit: onSubmit,
  } = useForm(
    { firstName: "", lastName: "", email: "", department: "" },
    handleSubmit,
    (vals) => validateForm(vals, validationSchema),
  );

  const columns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <Button
          size="small"
          onClick={() => {
            setEditingId(row.id);
            setIsModalOpen(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  if (loading) return <Spinner size="large" />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="employees-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Employees</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add Employee</Button>
      </div>

      <Table columns={columns} data={employees} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Employee" : "Add Employee"}
        footer={
          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onSubmit}>
              {editingId ? "Update" : "Create"}
            </Button>
          </div>
        }
      >
        <form style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Input
            label="First Name"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <Select
            label="Department"
            name="department"
            value={values.department}
            onChange={handleChange}
            options={["Sales", "Marketing", "Engineering"]}
            error={errors.department}
            required
          />
        </form>
      </Modal>

      <ToastContainer toasts={notifications} onRemove={removeNotification} />
    </div>
  );
}
```

---

## 🚀 Quick Start Checklist

- [ ] Import components from `@/components/shared`
- [ ] Import hooks from `@/hooks`
- [ ] Import utilities from `@/utils`
- [ ] Use `useForm` for all form state management
- [ ] Use `useFetch` for all data fetching
- [ ] Use `Toast/ToastContainer` with `useNotifications` for feedback
- [ ] Use `validators` from utils for form validation
- [ ] Use `getErrorMessage` from utils for API error handling
- [ ] Style components using provided CSS classes
- [ ] Test components in Browser DevTools

---

## 🎨 CSS Classes Available

All components use CSS classes defined in `src/styles/components.css`. Key classes include:

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-warning`, `.btn-ghost`
- `.btn-small`, `.btn-medium`, `.btn-large`
- `.modal-overlay`, `.modal-content`, `.modal-header`, `.modal-body`, `.modal-footer`
- `.input-wrapper`, `.select-wrapper`, `.textarea-wrapper`, `.error-message`
- `.card`, `.card-header`, `.card-content`, `.card-footer`
- `.spinner`, `.spinner-small`, `.spinner-medium`, `.spinner-large`
- `.toast`, `.toast-success`, `.toast-error`, `.toast-warning`, `.toast-info`
- `.table`, `.table-striped`, `.table-hover`

---

## 📝 Notes

- All components follow React best practices
- Hooks are memory-leak safe with cleanup
- Utilities are pure functions with no side effects
- CSS is mobile-responsive
- All components are TypeScript-ready (can add .ts/.tsx extensions)
- Components support custom className for styling
- Validation functions are composable and reusable
