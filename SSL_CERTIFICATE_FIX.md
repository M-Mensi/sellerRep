# SSL Certificate Troubleshooting Guide

## 🔧 The Issue

You're getting: **"Error: self-signed certificate in certificate chain"**

This happens because Aiven's PostgreSQL uses self-signed SSL certificates. The updated `db.js` now handles this automatically.

---

## ✅ Fix Applied

**File:** `src/config/db.js`

The configuration now:

- ✅ **Development Mode:** Disables strict certificate validation
- ✅ **Production Mode:** Uses provided certificate
- ✅ **Auto-detect:** Based on `NODE_ENV` environment variable

**Your .env already has:**

```
NODE_ENV=development
```

So SSL validation is automatically disabled for development/testing.

---

## 🚀 Try Again Now

```bash
cd c:\Cognizant\sellerRep\backend
node src/server.js
```

**Expected Output:**

```
[dotenv@17.3.1] injecting env (11) from .env
✓ PostgreSQL connection established
Server running on port 3000
```

---

## 🧪 If Still Getting Error

Try these troubleshooting steps in order:

### Step 1: Test Direct Connection

```bash
cd c:\Cognizant\sellerRep\backend
node
```

In Node REPL:

```javascript
// Test the database connection
const db = require("./src/config/db");
db.execute("SELECT VERSION()")
  .then((result) => {
    console.log("✓ Connection successful!");
    console.log("PostgreSQL version:", result.rows[0].version);
    process.exit(0);
  })
  .catch((err) => {
    console.log("✗ Connection failed:", err.message);
    process.exit(1);
  });
```

### Step 2: Verify .env Variables

```bash
# Check .env file has correct values
type .env
```

**Must have:**

```
DB_HOST=pg-d0deaeb-mensimohamed.h.aivencloud.com
DB_USER=avnadmin
DB_PASSWORD=AivenDBPasswordHere
DB_NAME=defaultdb
DB_PORT=10738
NODE_ENV=development
```

### Step 3: Clear Node Modules Cache

```bash
# Kill any running Node processes
taskkill /F /IM node.exe

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
cd c:\Cognizant\sellerRep\backend
npm install

# Try again
node src/server.js
```

### Step 4: Test with psql (if installed)

```bash
# Direct PostgreSQL connection test
psql -h pg-d0deaeb-mensimohamed.h.aivencloud.com \
     -U avnadmin \
     -d defaultdb \
     -c "SELECT VERSION();"

```

---

## 🔒 Security Notes

### Development Mode ✅

- `rejectUnauthorized: false` allows self-signed certificates
- Safe for development/testing
- Your `.env` sets `NODE_ENV=development`

### Production Mode ⚠️

- Change `NODE_ENV=production` to enforce certificate validation
- Must provide valid certificate in `DB_SSL_CERT`
- Never use `rejectUnauthorized: false` in production

---

## 🔍 Updated db.js Logic

```javascript
// Development: Allow self-signed certificates
if (process.env.NODE_ENV === "production") {
  // Strict SSL validation (production)
  sslConfig = { rejectUnauthorized: true, ca: cert };
} else {
  // Allow self-signed (development)
  sslConfig = { rejectUnauthorized: false };
}
```

---

## 📊 Connection Status Check

After starting backend, try one of these:

### Check 1: Health Endpoint

```bash
curl http://localhost:3000/api/auth/login \
  -X POST \
  -H "Content-Type: application/json"
```

Should return error about missing credentials (not connection error):

```json
{"errors": [...]}
```

### Check 2: Test with Valid Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"Admin@12345"}'
```

Should return token (after database is set up):

```json
{"token":"...", "user":{...}}
```

---

## 📋 Verification Checklist

- [ ] Node.js updated to latest: `node --version`
- [ ] `.env` has `NODE_ENV=development`
- [ ] Database credentials correct in `.env`
- [ ] PostgreSQL tables created (ran DATABASE_SCHEMA_POSTGRESQL.sql)
- [ ] No other Node processes running on port 3000
- [ ] `node src/server.js` shows "✓ PostgreSQL connection established"

---

## 🆘 Still Not Working?

Try complete fresh start:

```bash
# 1. Kill all Node processes
taskkill /F /IM node.exe

# 2. Go to backend
cd c:\Cognizant\sellerRep\backend

# 3. Clean install
rmdir /s /q node_modules
npm cache clean --force
npm install

# 4. Verify .env
type .env

# 5. Start backend with verbose logging
NODE_DEBUG=pg node src/server.js
```

The `NODE_DEBUG=pg` will show detailed PostgreSQL connection logs to help diagnose issues.

---

## 📞 Common Issues & Solutions

| Issue                    | Solution                            |
| ------------------------ | ----------------------------------- |
| Connection timeout       | Check firewall allows port 10738    |
| Wrong password           | Verify DB_PASSWORD in .env          |
| Database not found       | Check DB_NAME=defaultdb in .env     |
| SSL error still appears  | Ensure NODE_ENV=development in .env |
| Port 3000 already in use | `taskkill /F /IM node.exe`          |
| Tables not found         | Run DATABASE_SCHEMA_POSTGRESQL.sql  |

---

## ✨ Summary

The SSL certificate issue is **fixed** by allowing self-signed certificates in development mode. Your `.env` is already configured correctly with `NODE_ENV=development`.

**Just run:**

```bash
cd c:\Cognizant\sellerRep\backend
node src/server.js
```

If you still get errors, follow the troubleshooting steps above! 🚀
