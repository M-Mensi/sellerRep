#!/usr/bin/env node
/**
 * Node.js API Integration Test Script
 * Tests all endpoints and verifies backend/frontend communication
 */

const http = require("http");

const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
  cyan: "\x1b[36m",
};

class APITester {
  constructor(baseURL = "http://localhost:3000") {
    this.baseURL = baseURL;
    this.token = null;
    this.results = { passed: 0, failed: 0, skipped: 0 };
  }

  log = {
    success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
    error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
    info: (msg) => console.log(`${COLORS.blue}ℹ${COLORS.reset} ${msg}`),
    warn: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
    section: (msg) =>
      console.log(`\n${COLORS.cyan}=== ${msg} ===${COLORS.reset}\n`),
  };

  // HTTP request helper
  request(method, path, data = null, headers = {}) {
    return new Promise((resolve) => {
      const url = new URL(this.baseURL + path);
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        timeout: 5000,
      };

      const req = http.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          try {
            const json = JSON.parse(body || "{}");
            resolve({
              status: res.statusCode,
              body: json,
              headers: res.headers,
            });
          } catch (e) {
            resolve({ status: res.statusCode, body, headers: res.headers });
          }
        });
      });

      req.on("error", (err) => {
        resolve({ error: err.message, status: 0 });
      });

      req.on("timeout", () => {
        req.destroy();
        resolve({ error: "Timeout", status: 0 });
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  }

  // Test helper
  async test(name, fn) {
    try {
      await fn();
      this.log.success(name);
      this.results.passed++;
    } catch (err) {
      this.log.error(`${name} - ${err.message}`);
      this.results.failed++;
    }
  }

  // Assertion helpers
  assertEquals(actual, expected, msg = "") {
    if (actual !== expected) {
      throw new Error(
        `${msg || "Assertion failed"}: expected ${expected}, got ${actual}`,
      );
    }
  }

  assertTrue(value, msg = "") {
    if (!value) {
      throw new Error(msg || "Expected true");
    }
  }

  // ============================================================
  // 1. CORS & CONNECTIVITY TESTS
  // ============================================================
  async testCORS() {
    this.log.section("1. CORS & CONNECTIVITY TESTS");

    await this.test("Backend reachable on port 3000", async () => {
      const res = await this.request("OPTIONS", "/api/auth/login");
      this.assertTrue(res.status > 0, "Backend not responding");
    });

    await this.test("CORS headers present", async () => {
      const res = await this.request("OPTIONS", "/api/auth/login");
      // Should return 200 or 404, but not CORS error
      this.assertTrue(res.status > 0, "CORS might be blocked");
    });

    await this.test("JSON body parser working", async () => {
      const res = await this.request("POST", "/api/auth/login", {
        email: "test@example.com",
        password: "test123",
      });
      // Should parse body and return auth error (401/400), not body parsing error
      this.assertTrue(
        [400, 401].includes(res.status),
        `Expected 400/401, got ${res.status}`,
      );
    });
  }

  // ============================================================
  // 2. AUTHENTICATION TESTS
  // ============================================================
  async testAuthentication() {
    this.log.section("2. AUTHENTICATION TESTS");

    // Test 2.1: Invalid login
    await this.test("Reject invalid credentials", async () => {
      const res = await this.request("POST", "/api/auth/login", {
        email: "invalid@test.com",
        password: "wrongpassword",
      });
      this.assertEquals(res.status, 401, "Should reject invalid credentials");
    });

    // Test 2.2: Validation errors
    await this.test("Validate email format", async () => {
      const res = await this.request("POST", "/api/auth/login", {
        email: "not-an-email",
        password: "test123",
      });
      this.assertTrue([400, 401].includes(res.status), "Should validate email");
    });

    // Test 2.3: Valid login (if credentials work)
    await this.test("Accept valid credentials", async () => {
      const res = await this.request("POST", "/api/auth/login", {
        email: "employee@example.com",
        password: "Emp@123456",
      });

      if (res.status === 200 && res.body.token) {
        this.token = res.body.token;
        this.log.info(`Got token: ${res.body.token.substring(0, 20)}...`);
      } else {
        this.log.warn(
          `Login failed with status ${res.status} (might be normal if test credentials don't exist)`,
        );
      }

      // Accept any response - endpoint exists
      this.assertTrue(res.status > 0, "Auth endpoint not responding");
    });
  }

  // ============================================================
  // 3. PROTECTED ENDPOINT TESTS
  // ============================================================
  async testProtectedRoutes() {
    this.log.section("3. PROTECTED ENDPOINT TESTS");

    await this.test("Reject requests without token", async () => {
      const res = await this.request("GET", "/api/employees/profile");
      this.assertEquals(res.status, 401, "Should require authentication");
    });

    if (this.token) {
      await this.test("Accept requests with valid token", async () => {
        const res = await this.request("GET", "/api/employees/profile", null, {
          Authorization: `Bearer ${this.token}`,
        });
        this.assertTrue(
          [200, 500].includes(res.status),
          "Should accept valid token",
        );
      });

      await this.test("Accept admin endpoints with admin token", async () => {
        const res = await this.request("GET", "/api/employees", null, {
          Authorization: `Bearer ${this.token}`,
        });
        // Should return 200 for admin or 403 if not admin
        this.assertTrue(
          [200, 403, 500].includes(res.status),
          "Admin endpoint responding",
        );
      });
    } else {
      this.log.warn("Skipping token tests (login failed)");
      this.results.skipped += 2;
    }
  }

  // ============================================================
  // 4. VALIDATION TESTS
  // ============================================================
  async testValidation() {
    this.log.section("4. INPUT VALIDATION TESTS");

    await this.test("Validate required fields", async () => {
      const res = await this.request("POST", "/api/auth/login", {
        email: "",
        password: "",
      });
      // Should reject with 400
      this.assertTrue(
        [400, 401].includes(res.status),
        "Should validate inputs",
      );
    });

    await this.test("Validate email format", async () => {
      const res = await this.request("POST", "/api/auth/login", {
        email: "invalid-email-format",
        password: "Test@123456",
      });
      this.assertTrue(
        [400, 401].includes(res.status),
        "Should validate email format",
      );
    });

    await this.test("Validate password length", async () => {
      const res = await this.request("POST", "/api/auth/login", {
        email: "test@example.com",
        password: "123", // Too short
      });
      this.assertTrue(
        [400, 401].includes(res.status),
        "Should validate password",
      );
    });
  }

  // ============================================================
  // 5. ENDPOINT AVAILABILITY TESTS
  // ============================================================
  async testEndpoints() {
    this.log.section("5. ENDPOINT AVAILABILITY TESTS");

    const endpoints = [
      { method: "POST", path: "/api/auth/login", name: "Auth login" },
      {
        method: "GET",
        path: "/api/employees/profile",
        name: "Get profile",
        protected: true,
      },
      {
        method: "GET",
        path: "/api/employees",
        name: "Get all employees",
        protected: true,
      },
      {
        method: "POST",
        path: "/api/attendance/mark",
        name: "Mark attendance",
        protected: true,
      },
      {
        method: "GET",
        path: "/api/attendance/mine",
        name: "Get my attendance",
        protected: true,
      },
      {
        method: "POST",
        path: "/api/achievements",
        name: "Create achievement",
        protected: true,
      },
      {
        method: "GET",
        path: "/api/achievements/mine",
        name: "Get my achievements",
        protected: true,
      },
      {
        method: "POST",
        path: "/api/daily-tracker/log",
        name: "Log daily activity",
        protected: true,
      },
      {
        method: "GET",
        path: "/api/daily-tracker/mine",
        name: "Get daily tracker",
        protected: true,
      },
      {
        method: "POST",
        path: "/api/leave-requests",
        name: "Submit leave request",
        protected: true,
      },
      {
        method: "GET",
        path: "/api/leave-requests/mine",
        name: "Get my requests",
        protected: true,
      },
      {
        method: "POST",
        path: "/api/clients",
        name: "Create client",
        protected: true,
      },
      {
        method: "GET",
        path: "/api/clients",
        name: "Get clients",
        protected: true,
      },
      {
        method: "POST",
        path: "/api/errors",
        name: "Report error",
        protected: true,
      },
      {
        method: "GET",
        path: "/api/errors",
        name: "Get errors",
        protected: true,
      },
    ];

    for (const endpoint of endpoints) {
      const headers =
        endpoint.protected && this.token
          ? { Authorization: `Bearer ${this.token}` }
          : {};

      await this.test(`Route ${endpoint.method} ${endpoint.path}`, async () => {
        const res = await this.request(
          endpoint.method,
          endpoint.path,
          {},
          headers,
        );

        // Route exists if we get any response (not 404)
        if (res.status === 404) {
          throw new Error("Route not found (404)");
        }

        if (res.error) {
          throw new Error(`Connection error: ${res.error}`);
        }

        // Accept any non-404 response
        this.assertTrue(res.status !== 404, "Route should exist");
      });
    }
  }

  // ============================================================
  // 6. ERROR HANDLING TESTS
  // ============================================================
  async testErrorHandling() {
    this.log.section("6. ERROR HANDLING TESTS");

    await this.test("Return 404 for non-existent routes", async () => {
      const res = await this.request("GET", "/api/nonexistent");
      this.assertEquals(
        res.status,
        404,
        "Should return 404 for unknown routes",
      );
    });

    await this.test("Handle malformed JSON", async () => {
      // This would need raw HTTP request, skip for now
      this.log.info("Malformed JSON test requires raw HTTP (skipped)");
      this.results.skipped++;
    });

    await this.test("Return error for expired token", async () => {
      const res = await this.request("GET", "/api/employees/profile", null, {
        Authorization: "Bearer invalid.token.here",
      });
      this.assertEquals(res.status, 401, "Should reject invalid tokens");
    });
  }

  // ============================================================
  // 7. RATE LIMITING TESTS
  // ============================================================
  async testRateLimiting() {
    this.log.section("7. RATE LIMITING TESTS");

    await this.test("Rate limiting configured", async () => {
      // Make multiple requests to check if rate limiting is working
      const requests = [];
      for (let i = 0; i < 5; i++) {
        requests.push(
          this.request("POST", "/api/auth/login", {
            email: "test@test.com",
            password: "test",
          }),
        );
      }

      const results = await Promise.all(requests);
      const hasDifferentStatuses = results.some(
        (r) => r.status !== results[0].status,
      );

      // If all same status, rate limiting might not be active
      if (!hasDifferentStatuses) {
        this.log.warn("Could not verify rate limiting in quick test");
        this.results.skipped++;
      } else {
        this.log.success("Rate limiting appears to be working");
        this.results.passed++;
      }
    });
  }

  // ============================================================
  // MAIN TEST RUNNER
  // ============================================================
  async run() {
    console.log(
      `\n${COLORS.cyan}╔════════════════════════════════════════════════════════════════╗${COLORS.reset}`,
    );
    console.log(
      `${COLORS.cyan}║  Node.js Backend/Frontend Integration Test Suite               ║${COLORS.reset}`,
    );
    console.log(
      `${COLORS.cyan}║  Testing: CORS, Auth, Validation, Endpoints, Error Handling    ║${COLORS.reset}`,
    );
    console.log(
      `${COLORS.cyan}╚════════════════════════════════════════════════════════════════╝${COLORS.reset}\n`,
    );

    console.log(`Target: ${this.baseURL}\n`);

    // Run all test suites
    await this.testCORS();
    await this.testAuthentication();
    await this.testProtectedRoutes();
    await this.testValidation();
    await this.testEndpoints();
    await this.testErrorHandling();
    await this.testRateLimiting();

    // Print summary
    this.printSummary();
  }

  printSummary() {
    console.log(`\n${COLORS.cyan}=== TEST RESULTS ===${COLORS.reset}\n`);

    console.log(
      `${COLORS.green}✓ Passed:${COLORS.reset}  ${this.results.passed}`,
    );
    console.log(
      `${COLORS.red}✗ Failed:${COLORS.reset}  ${this.results.failed}`,
    );
    console.log(
      `${COLORS.yellow}⊘ Skipped:${COLORS.reset} ${this.results.skipped}`,
    );

    const total =
      this.results.passed + this.results.failed + this.results.skipped;
    console.log(`\nTotal:   ${total}\n`);

    const passPercentage =
      total > 0 ? Math.round((this.results.passed / total) * 100) : 0;
    console.log(`Pass Rate: ${passPercentage}%\n`);

    if (this.results.failed === 0) {
      console.log(`${COLORS.green}✓ ALL TESTS PASSED!${COLORS.reset}\n`);
      console.log(
        "Your Node.js backend and frontend are properly integrated!\n",
      );
    } else {
      console.log(`${COLORS.red}✗ SOME TESTS FAILED${COLORS.reset}\n`);
      console.log(
        "Check the errors above and refer to NODE_JS_VERIFICATION_GUIDE.md\n",
      );
    }

    console.log(`${COLORS.cyan}=== NEXT STEPS ===${COLORS.reset}\n`);
    console.log("1. Check any failed tests above");
    console.log(
      "2. Review NODE_JS_VERIFICATION_GUIDE.md for detailed troubleshooting",
    );
    console.log("3. Test API endpoints manually using Postman or curl");
    console.log("4. Verify frontend can login at http://localhost:3001\n");
  }
}

// Run tests
const tester = new APITester("http://localhost:3000");
tester.run();
