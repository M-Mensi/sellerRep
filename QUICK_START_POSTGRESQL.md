# PostgreSQL Migration Quick Start Guide

**Last Updated:** 2026-04-01  
**Status:** ✅ Ready to Use

---

## 🚀 3-Step Quick Start

### Step 1: Fix Installed & Ready

```bash
cd c:\Cognizant\sellerRep\backend
npm install
```

### Step 2: Test Database Connection

```bash
node test-connection.js
```

**Expected Output:**

```
============================================================
PostgreSQL Connection Test
============================================================

📋 Connection Details:
   Host: pg-d0deaeb-mensimohamed.h.aivencloud.com
   Port: 10738
   User: avnadmin
   Database: defaultdb
   SSL Enabled: Yes
   NODE_ENV: development

Test 1: Connecting to PostgreSQL...
   ✓ Connected successfully!

Test 2: Fetching PostgreSQL version...
   ✓ Version query successful!

============================================================
✓ Status: All tests passed! Backend is ready to start
============================================================
```

### Step 3: Start Your Backend

```bash
node src/server.js
```

**Expected Output:**

```
[dotenv@17.3.1] injecting env (11) from .env
✓ PostgreSQL connection established
Server running on port 3000
```

---

## ⏭️ If You Haven't Created Tables Yet

### Setup Database Tables (One-time only)

**Option A - Using pgAdmin (Easier):**

1. Open pgAdmin Dashboard
2. Log in to your Aiven PostgreSQL
3. Right-click `defaultdb` → select "Query Tool"
4. Open file: `DATABASE_SCHEMA_POSTGRESQL.sql`
5. Copy all contents and paste into pgAdmin
6. Click **Execute** button

**Option B - Using Terminal:**

```bash
psql -h pg-d0deaeb-mensimohamed.h.aivencloud.com \
     -U avnadmin \
     -d defaultdb \
     -f DATABASE_SCHEMA_POSTGRESQL.sql
```

Password: `AVNS_rm1HUeJV0lyCQyBfmbt`

---

## ✅ Verify Everything Works

### Test 1: Basic API Call

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"Admin@12345"}'
```

**Should return:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "admin@company.com",
    "role": "admin"
  }
}
```

### Test 2: Save Token & Test Protected Route

```bash
# Save token in variable
$token = "eyJhbGciOiJIUzI1NiIs..." # Use token from above

# Test protected endpoint
curl -X GET http://localhost:3000/api/employees \
  -H "Authorization: Bearer $token"
```

**Should return employee data:**

```json
{
  "success": true,
  "data": [...]
}
```

### Test 3: Frontend Integration

```bash
# In another terminal
cd c:\Cognizant\sellerRep\frontend
npm start
```

Then navigate to: **http://localhost:3001**

---

## 📋 What Was Changed

### Backend Files Updated

1. **src/config/db.js** ✅
   - Now uses PostgreSQL `pg` driver
   - Automatically converts MySQL `?` placeholders to PostgreSQL `$1, $2, $3`
   - Handles SSL certificates properly
   - Allows self-signed certs in development mode

2. **.env** ✅
   - Updated database credentials
   - Set to use Aiven PostgreSQL
   - NODE_ENV=development (disables strict SSL validation)

3. **package.json** ✅
   - Removed `mysql2` dependency
   - Uses `pg` for PostgreSQL

### New Files Created

1. **DATABASE_SCHEMA_POSTGRESQL.sql** - Complete database schema
2. **POSTGRESQL_MIGRATION_GUIDE.md** - Detailed migration guide
3. **SSL_CERTIFICATE_FIX.md** - SSL troubleshooting guide
4. **MIGRATION_SUMMARY.md** - Quick reference
5. **test-connection.js** - Connection testing script

### Model Files - NO CHANGES NEEDED ✅

All 9 model files work as-is:

- auth.model.js
- employee.model.js
- attendance.model.js
- achievement.model.js
- dailyTracker.model.js
- leaveRequest.model.js
- client.model.js
- error.model.js
- errorAction.model.js

---

## 🔒 SSL Certificate Fix

**Problem:** `Error: self-signed certificate in certificate chain`

**Solution Applied:**

- Development mode (`NODE_ENV=development`) automatically disables strict SSL validation
- Production mode (`NODE_ENV=production`) uses provided certificate
- Your `.env` is set to `development` by default

---

## 🧪 Troubleshooting

### Connection Test Failed?

```bash
# Run the connection test
cd c:\Cognizant\sellerRep\backend
node test-connection.js
```

**Check these in order:**

1. **Is .env configured correctly?**

   ```bash
   type .env
   ```

2. **Delete node_modules and reinstall**

   ```bash
   rmdir /s /q node_modules
   npm install
   ```

3. **Test with verbose logging**

   ```bash
   NODE_DEBUG=pg node src/server.js
   ```

4. **Direct connection test**
   ```bash
   psql -h pg-d0deaeb-mensimohamed.h.aivencloud.com \
        -U avnadmin -d defaultdb \
        -c "SELECT VERSION();"
   ```

### Tables Not Found?

**You need to run the schema:**

```bash
# Option 1: pgAdmin Query Tool (easiest)
# Copy DATABASE_SCHEMA_POSTGRESQL.sql and paste in pgAdmin

# Option 2: Terminal
psql -h pg-d0deaeb-mensimohamed.h.aivencloud.com \
     -U avnadmin -d defaultdb \
     -f DATABASE_SCHEMA_POSTGRESQL.sql
```

### Still Getting Errors?

See detailed troubleshooting in:

- `SSL_CERTIFICATE_FIX.md`
- `POSTGRESQL_MIGRATION_GUIDE.md`

---

## 📊 Database Info

**Connection Details:**

- Host: pg-d0deaeb-mensimohamed.h.aivencloud.com
- Port: 10738
- User: avnadmin
- Database: defaultdb
- SSL: Required (automatically handled)

**Tables (11):**
Users, Employees, Achievements, Attendance, DailyTracker, LeaveRequests, Clients, Errors, ErrorActions, Notifications, AuditLog

**Sample Data:**

- User: `admin@company.com` / `Admin@12345`
- User: `employee1@company.com` / `Emp@123456`

---

## ✨ Summary

Everything is configured and ready to go:

✅ Backend configured for PostgreSQL
✅ SSL certificate handling fixed
✅ Database schema ready to deploy
✅ Connection test script available
✅ All models remain compatible

**Next Steps:**

1. Run: `npm install`
2. Test: `node test-connection.js`
3. Create schema in pgAdmin (if not done)
4. Start: `node src/server.js`
5. Login: http://localhost:3001

---

## 🎯 Full Commands Cheatsheet

```bash
# Install dependencies
cd c:\Cognizant\sellerRep\backend
npm install

# Test connection
node test-connection.js

# Start backend
node src/server.js

# Start frontend (in another terminal)
cd c:\Cognizant\sellerRep\frontend
npm start

# Test API (in another terminal)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"Admin@12345"}'
```

**Ready to go! 🚀**
