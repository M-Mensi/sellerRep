# Frontend Organization & Synchronization Plan

## 📋 Current Frontend Status

✅ **Running**: http://localhost:3001
✅ **Backend Connection**: http://localhost:3000
✅ **Database**: Connected (sql7.freesqldatabase.com)

## 🗂️ Recommended Frontend Folder Structure

```
frontend/src/
├── auth/
│   ├── AuthContext.jsx          ← Authentication & user state
│   ├── ProtectedRoute.jsx       ← Route protection based on role
│   └── authService.js           ← Auth utilities
│
├── api/
│   ├── axios.js                 ← Axios instance with interceptors
│   ├── auth.api.js              ← Auth endpoints
│   ├── employees.api.js         ← Employee management
│   ├── achievements.api.js      ← Achievements endpoints
│   ├── attendance.api.js        ← Attendance endpoints
│   ├── dailyTracker.api.js      ← Daily tracker endpoints
│   ├── leaveRequests.api.js     ← Leave requests endpoints
│   ├── clients.api.js           ← Client management endpoints
│   ├── errors.api.js            ← Error tracking endpoints
│   └── admin.api.js             ← Admin dashboard endpoints
│
├── pages/
│   ├── public/
│   │   └── Login.jsx            ← Login page
│   │
│   ├── employee/
│   │   ├── Dashboard.jsx        ← Employee dashboard & stats
│   │   ├── Achievements.jsx     ← View/create achievements
│   │   ├── Attendance.jsx       ← Mark attendance
│   │   ├── DailyTracker.jsx     ← Log daily activities
│   │   ├── LeaveRequests.jsx    ← Submit/view leave requests
│   │   ├── Clients.jsx          ← Manage clients
│   │   └── Profile.jsx          ← View/edit profile
│   │
│   └── admin/
│       ├── Dashboard.jsx        ← Admin dashboard with metrics
│       ├── Employees.jsx        ← Employee management
│       ├── Approvals.jsx        ← Leave/request approvals
│       ├── Errors.jsx           ← Error tracking & timeline
│       ├── Reports.jsx          ← Reports & analytics
│       └── Settings.jsx         ← System settings
│
├── components/
│   ├── layout/
│   │   ├── NavBar.jsx           ← Navigation bar
│   │   ├── Sidebar.jsx          ← Sidebar navigation
│   │   ├── Header.jsx           ← Header with user info
│   │   └── Footer.jsx           ← Footer
│   │
│   ├── shared/
│   │   ├── Modal.jsx            ← Generic modal component
│   │   ├── Button.jsx           ← Button component
│   │   ├── Input.jsx            ← Input component
│   │   ├── Select.jsx           ← Select component
│   │   ├── Toast.jsx            ← Toast notifications
│   │   ├── Spinner.jsx          ← Loading spinner
│   │   ├── Card.jsx             ← Card component
│   │   └── Table.jsx            ← Table component
│   │
│   ├── forms/
│   │   ├── AchievementForm.jsx
│   │   ├── AttendanceForm.jsx
│   │   ├── DailyTrackerForm.jsx
│   │   ├── LeaveRequestForm.jsx
│   │   ├── ClientForm.jsx
│   │   ├── EmployeeForm.jsx
│   │   └── ErrorForm.jsx
│   │
│   ├── modals/
│   │   ├── AchievementModal.jsx
│   │   ├── AttendanceModal.jsx
│   │   ├── DailyTrackerModal.jsx
│   │   ├── LeaveRequestModal.jsx
│   │   ├── ClientModal.jsx
│   │   ├── EmployeeModal.jsx
│   │   └── ErrorModal.jsx
│   │
│   ├── dashboards/
│   │   ├── EmployeeDashboard.jsx ← Stats for employees
│   │   └── AdminDashboard.jsx    ← Admin overview
│   │
│   │ dashboards/
│   │   ├── StatCard.jsx
│   │   ├── Chart.jsx
│   │   └── MetricBox.jsx
│   │
│   └── common/
│       ├── EmptyState.jsx       ← Empty data display
│       ├── ErrorBoundary.jsx    ← Error handling
│       └── Loading.jsx          ← Loading state
│
├── hooks/
│   ├── useAuth.js               ← Auth hook
│   ├── useFetch.js              ← Data fetching
│   ├── useForm.js               ← Form management
│   ├── useLocalStorage.js       ← Local storage
│   └── useNotifications.js      ← Notifications
│
├── styles/
│   ├── index.css                ← Global styles
│   ├── variables.css            ← CSS variables (colors, spacing)
│   ├── utilities.css            ← Utility classes
│   └── responsive.css           ← Responsive design
│
├── utils/
│   ├── formatDate.js            ← Date formatting
│   ├── validators.js            ← Form validation
│   ├── formatters.js            ← Data formatting
│   └── constants.js             ← App constants
│
├── App.jsx                      ← Main app component with routing
├── index.jsx                    ← Entry point
└── index.css                    ← Global styles
```

---

## 📝 API Endpoints Status Check

### Authentication

- [ ] POST `/api/auth/login` - Login
- [ ] POST `/api/auth/logout` - Logout

### Employees

- [ ] GET `/api/employees` - Get all (admin only)
- [ ] POST `/api/employees` - Create (admin only)
- [ ] GET `/api/employees/profile` - Get own profile
- [ ] PATCH `/api/employees/profile` - Update profile

### Achievements

- [ ] POST `/api/achievements` - Create achievement
- [ ] GET `/api/achievements` - Get all (admin)
- [ ] GET `/api/achievements/mine` - Get own
- [ ] PATCH `/api/achievements/:id/endorse` - Endorse (admin)
- [ ] DELETE `/api/achievements/:id` - Delete

### Attendance

- [ ] POST `/api/attendance/mark` - Mark attendance
- [ ] GET `/api/attendance/mine` - Get own attendance
- [ ] GET `/api/attendance` - Get all (admin)
- [ ] PATCH `/api/attendance/:id/approve` - Approve (admin)

### Daily Tracker

- [ ] POST `/api/daily-tracker` - Log daily activity
- [ ] GET `/api/daily-tracker/mine` - Get own logs
- [ ] GET `/api/daily-tracker` - Get all (admin)

### Leave Requests

- [ ] POST `/api/leave-requests` - Submit request
- [ ] GET `/api/leave-requests/mine` - Get own requests
- [ ] GET `/api/leave-requests` - Get all (admin)
- [ ] PATCH `/api/leave-requests/:id/review` - Review (admin)

### Clients

- [ ] POST `/api/clients` - Create client
- [ ] GET `/api/clients/employee/:id` - Get employee's clients
- [ ] GET `/api/clients` - Get all (admin)
- [ ] PATCH `/api/clients/:id` - Update client
- [ ] DELETE `/api/clients/:id` - Delete client

### Errors

- [ ] POST `/api/errors` - Report error
- [ ] GET `/api/errors` - Get all (admin)
- [ ] GET `/api/errors/:id/timeline` - Get error timeline
- [ ] POST `/api/errors/:id/actions` - Add error action (admin)

---

## 🔄 Frontend-Backend Synchronization Checklist

### Pages to Create/Update

- [ ] Login page (with proper error handling)
- [ ] Employee Dashboard (with statistics)
- [ ] Admin Dashboard (with all metrics)
- [ ] Attendance page
- [ ] Errors page
- [ ] All missing modals and forms

### Components to Create

- [ ] Reusable form components (Input, Select, TextArea)
- [ ] Modal wrapper
- [ ] Toast notification system
- [ ] Loading spinner
- [ ] Error boundary
- [ ] Table component for data display
- [ ] Chart/statistics components

### Hooks to Create

- [ ] useForm - Form state management
- [ ] useFetch - Data fetching with loading/error states
- [ ] useLocalStorage - Persistent storage
- [ ] useNotifications - Toast notifications

### API Integration

- [ ] Create admin.api.js for dashboard endpoints
- [ ] Update all API calls to use new database schema
- [ ] Add error handling and validation
- [ ] Add request/response interceptors
- [ ] Handle 401/403 errors properly

---

## 🧪 Testing Checklist

### Auth Flow

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token storage and retrieval
- [ ] Login redirect
- [ ] Logout and session cleanup

### Employee Features

- [ ] View profile
- [ ] Create achievement
- [ ] Mark attendance
- [ ] Log daily activity
- [ ] Submit leave request
- [ ] Add client
- [ ] Report error

### Admin Features

- [ ] View all employees
- [ ] Create new employee
- [ ] Approve leave requests
- [ ] Endorse achievements
- [ ] View all submissions
- [ ] Access admin dashboard

### Dashboard Metrics

- [ ] Total employees count
- [ ] Today's attendance rate
- [ ] Pending requests count
- [ ] Average calls/emails
- [ ] New clients count
- [ ] Open errors count

---

## 🚀 Implementation Phases

### Phase 1: Core Structure (Today)

1. Update AuthContext with token persistence
2. Create reusable form components
3. Create modal wrapper
4. Implement toast notifications
5. Create custom hooks (useForm, useFetch)

### Phase 2: Pages (Today)

1. Create Attendance page
2. Create Errors page
3. Update Admin Dashboard
4. Create Employee Dashboard
5. Add Profile page

### Phase 3: Admin Features (Next)

1. Employee management page
2. Approval queue page
3. Reports page
4. Settings page

### Phase 4: Polish & Testing (Next)

1. Add proper error handling
2. Add loading states
3. Add form validation
4. Test all API endpoints
5. Responsive design

---

## 📱 Key Features to Implement

### For Employees

- ✅ View dashboard with personal stats
- ✅ Create and view achievements
- ✅ Mark daily attendance
- ✅ Log daily activities
- ✅ Submit leave/equipment/training requests
- ✅ Manage client contacts
- ✅ Report errors/issues
- ✅ View approval status on submitted items

### For Admins

- ✅ Dashboard with system-wide metrics
- ✅ Manage employee accounts
- ✅ Approve/reject requests
- ✅ Endorse achievements
- ✅ View all employee submissions
- ✅ Track and manage errors
- ✅ View performance reports
- ✅ Department-wise analytics

---

## 🔗 API Response Format Expected

### Success Response (200, 201)

```json
{
  "message": "Action completed successfully",
  "data": {
    /* actual data */
  }
}
```

### Error Response (400, 401, 403, 500)

```json
{
  "message": "Error message",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

---

## 🎯 Next Steps

1. **Create missing pages** (Attendance, Errors, etc.)
2. **Create reusable components** (Modal, Form, etc.)
3. **Implement custom hooks** (useForm, useFetch, etc.)
4. **Update API calls** to match new schema
5. **Add proper error handling** throughout
6. **Test all endpoints** and fix issues
7. **Implement real-time notifications** (optional)
8. **Add responsive design**
9. **Deploy and monitor**
