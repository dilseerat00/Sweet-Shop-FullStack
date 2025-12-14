# Test-Driven Development (TDD) Documentation

## Overview

This document demonstrates the Test-Driven Development approach followed in the Sweet Shop Management System backend. All tests follow the **Red-Green-Refactor** pattern with high coverage and meaningful test cases.

## Test Coverage Goals

- **Target Coverage**: 80% across all metrics
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Test Structure

### 1. Model Tests

#### User Model Tests (`tests/models/User.test.ts`)
- **User Creation**
  - ✅ Create valid user with required fields
  - ✅ Hash password before saving
  - ✅ Set default role to "user"
  - ✅ Create admin user when role specified

- **User Validation**
  - ✅ Fail when name is missing
  - ✅ Fail when email is missing
  - ✅ Fail when password is missing
  - ✅ Fail when password is too short (< 6 characters)
  - ✅ Fail when email is duplicate
  - ✅ Convert email to lowercase
  - ✅ Trim whitespace from name and email

- **Password Comparison**
  - ✅ Correctly compare valid password
  - ✅ Return false for invalid password
  - ✅ Not return password by default
  - ✅ Return password when explicitly selected

- **Role Validation**
  - ✅ Accept valid role "user"
  - ✅ Accept valid role "admin"
  - ✅ Reject invalid role

**Total User Model Tests**: 19

#### Sweet Model Tests (`tests/models/Sweet.test.ts`)
- **Sweet Creation**
  - ✅ Create valid sweet with all required fields
  - ✅ Set default values for optional fields
  - ✅ Trim whitespace from string fields

- **Sweet Validation**
  - ✅ Fail when name is missing
  - ✅ Fail when category is missing
  - ✅ Fail when price is missing
  - ✅ Fail when quantity is missing
  - ✅ Fail when description is missing
  - ✅ Fail when price is negative
  - ✅ Fail when quantity is negative
  - ✅ Fail for invalid category
  - ✅ Fail for duplicate sweet name

- **Category Validation**
  - ✅ Accept all 5 valid categories (Milk-based, Syrup-based, Dry Fruits, Seasonal, Special)

- **Sweet Update**
  - ✅ Update sweet fields correctly
  - ✅ Update timestamps on modification

- **Text Search Index**
  - ✅ Allow text search on indexed fields

**Total Sweet Model Tests**: 20

### 2. Middleware Tests

#### Authentication Middleware Tests (`tests/middleware/auth.test.ts`)
- **protect middleware**
  - ✅ Fail when no token is provided
  - ✅ Fail when token does not start with Bearer
  - ✅ Fail when token is invalid
  - ✅ Fail when user does not exist
  - ✅ Succeed with valid token and existing user
  - ✅ Attach user object to request

- **adminOnly middleware**
  - ✅ Allow access for admin users
  - ✅ Deny access for regular users
  - ✅ Deny access when user is not authenticated

- **Integration Tests**
  - ✅ Allow admin with valid token to access admin routes
  - ✅ Deny regular user access to admin routes

**Total Middleware Tests**: 11

### 3. Controller Integration Tests

#### Authentication Controller Tests (`tests/controllers/authController.test.ts`)
- **POST /api/auth/register**
  - ✅ Register new user with valid data
  - ✅ Register admin user when role is specified
  - ✅ Fail when name is missing
  - ✅ Fail when email is missing
  - ✅ Fail when password is missing
  - ✅ Fail when email is invalid
  - ✅ Fail when password is too short
  - ✅ Fail when password does not meet complexity requirements
  - ✅ Fail when user already exists
  - ✅ Normalize email to lowercase
  - ✅ Trim whitespace from inputs
  - ✅ Fail when name contains invalid characters
  - ✅ Fail when name is too short

- **POST /api/auth/login**
  - ✅ Login with valid credentials
  - ✅ Fail when email is missing
  - ✅ Fail when password is missing
  - ✅ Fail when email is invalid format
  - ✅ Fail when user does not exist
  - ✅ Fail when password is incorrect
  - ✅ Login case-insensitively for email

- **GET /api/auth/me**
  - ✅ Get current user with valid token
  - ✅ Fail when no token is provided
  - ✅ Fail when token is invalid
  - ✅ Fail when token format is incorrect

**Total Auth Controller Tests**: 24

#### Sweet Controller Tests (`tests/controllers/sweetController.test.ts`)
- **GET /api/sweets**
  - ✅ Get all sweets
  - ✅ Return sweets sorted by creation date
  - ✅ Return empty array when no sweets exist

- **GET /api/sweets/:id**
  - ✅ Get single sweet by ID
  - ✅ Return 404 for non-existent sweet
  - ✅ Return 400 for invalid MongoDB ID

- **GET /api/sweets/search**
  - ✅ Search sweets by name
  - ✅ Filter sweets by category
  - ✅ Filter by minimum price
  - ✅ Filter by maximum price
  - ✅ Filter by price range
  - ✅ Fail when maxPrice is less than minPrice
  - ✅ Fail with invalid category

- **POST /api/sweets**
  - ✅ Create sweet with admin token
  - ✅ Fail without authentication
  - ✅ Fail with regular user token
  - ✅ Fail with missing required fields
  - ✅ Fail with invalid price
  - ✅ Fail with invalid category
  - ✅ Fail with short description

- **PUT /api/sweets/:id**
  - ✅ Update sweet with admin token
  - ✅ Fail without authentication
  - ✅ Fail with regular user token
  - ✅ Fail for non-existent sweet
  - ✅ Fail with invalid MongoDB ID

- **DELETE /api/sweets/:id**
  - ✅ Delete sweet with admin token
  - ✅ Fail without authentication
  - ✅ Fail with regular user token
  - ✅ Fail for non-existent sweet

- **POST /api/sweets/:id/purchase**
  - ✅ Purchase sweet with valid quantity
  - ✅ Fail without authentication
  - ✅ Fail with insufficient stock
  - ✅ Fail with invalid quantity

- **POST /api/sweets/:id/restock**
  - ✅ Restock sweet with admin token
  - ✅ Fail with regular user token
  - ✅ Fail without authentication
  - ✅ Fail with invalid quantity

**Total Sweet Controller Tests**: 40

## Total Test Count

- **Model Tests**: 39
- **Middleware Tests**: 11
- **Controller Tests**: 64
- **Grand Total**: **114 comprehensive tests**

## Running Tests

### Run all tests
```bash
cd backend
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm test
# Coverage report will be generated in coverage/ directory
```

## Test Infrastructure

### Technologies Used
- **Jest**: Testing framework
- **Supertest**: HTTP assertions
- **MongoDB Memory Server**: In-memory database for testing
- **TypeScript**: Type-safe tests

### Test Setup
- In-memory MongoDB instance created before all tests
- Database cleared after each test
- Proper teardown after all tests complete

## Validation Implementation

### Input Validation
All endpoints use `express-validator` for input validation:

1. **Authentication Validation**
   - Name: 2-50 characters, letters and spaces only
   - Email: Valid email format, normalized to lowercase
   - Password: Minimum 6 characters, must contain uppercase, lowercase, and number

2. **Sweet Validation**
   - Name: 2-100 characters
   - Category: One of 5 valid categories
   - Price: Must be greater than 0
   - Quantity: Non-negative integer
   - Description: 10-500 characters
   - Weight: Valid format (e.g., 250g, 1kg)

3. **Search Validation**
   - Price range validation (maxPrice >= minPrice)
   - Category must be valid
   - Proper query parameter sanitization

### Error Handling
- Consistent error response format
- Meaningful error messages
- Field-level validation errors
- HTTP status codes following REST conventions

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
- **Controllers**: Only handle HTTP requests/responses
- **Models**: Only define data structure and validation
- **Middleware**: Each middleware has one specific purpose
  - `auth.ts`: Authentication and authorization
  - `validators.ts`: Input validation rules
  - `errorHandler.ts`: Validation error handling

### Open/Closed Principle (OCP)
- Validation rules are defined separately and can be extended
- Middleware can be composed for different routes
- Models use Mongoose plugins for extensibility

### Liskov Substitution Principle (LSP)
- All route handlers follow consistent interface (Request, Response)
- Middleware functions are interchangeable

### Interface Segregation Principle (ISP)
- Separate validation rules for different operations
- Different middleware for different authorization levels

### Dependency Inversion Principle (DIP)
- Controllers depend on model interfaces, not implementations
- Middleware depends on abstractions (JWT utils, not specific implementation)

## Clean Code Practices

1. **Meaningful Naming**
   - Clear function names (e.g., `registerValidation`, `handleValidationErrors`)
   - Descriptive variable names
   - Consistent naming conventions

2. **Documentation**
   - JSDoc comments for complex functions
   - Route descriptions with @desc, @route, @access tags
   - Test descriptions clearly state expected behavior

3. **DRY (Don't Repeat Yourself)**
   - Reusable validation rules
   - Shared test setup in `setup.ts`
   - Common error handling middleware

4. **Small Functions**
   - Each function does one thing well
   - Easy to test and maintain
   - Clear separation of concerns

5. **Error Handling**
   - Proper try-catch blocks
   - Meaningful error messages
   - Consistent error response format

## TDD Red-Green-Refactor Pattern

### Red Phase
- Write failing tests first
- Define expected behavior
- Tests fail because functionality doesn't exist yet

### Green Phase
- Write minimal code to make tests pass
- Focus on functionality, not optimization
- All tests pass

### Refactor Phase
- Improve code quality
- Apply SOLID principles
- Add validation
- Maintain passing tests

## Continuous Integration Ready

Tests are configured to run in CI/CD pipelines:
- Fast execution with in-memory database
- No external dependencies
- Deterministic results
- Comprehensive coverage reporting

## Next Steps

- [ ] Add integration tests for frontend
- [ ] Add E2E tests for complete user flows
- [ ] Add performance tests
- [ ] Add load testing
- [ ] Set up CI/CD pipeline with automated testing
