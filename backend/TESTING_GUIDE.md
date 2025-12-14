# Testing Quick Reference Guide

## Running Tests

### Basic Commands
```bash
# Install dependencies first
npm install

# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run specific test file
npm test -- User.test.ts

# Run tests with coverage
npm test -- --coverage
```

### Coverage Reports
After running tests with coverage, open:
- **HTML Report**: `backend/coverage/index.html`
- **Terminal**: Shows summary in console

## Test Files Location
```
backend/tests/
├── setup.ts                           # Test configuration
├── models/
│   ├── User.test.ts                  # User model tests (19 tests)
│   └── Sweet.test.ts                 # Sweet model tests (20 tests)
├── middleware/
│   └── auth.test.ts                  # Auth middleware tests (11 tests)
└── controllers/
    ├── authController.test.ts        # Auth endpoints tests (24 tests)
    └── sweetController.test.ts       # Sweet endpoints tests (40 tests)
```

## Test Categories

### 1. Unit Tests
- **Models**: User, Sweet
- **Middleware**: protect, adminOnly
- **Total**: 50 tests

### 2. Integration Tests
- **Auth API**: Register, Login, GetMe
- **Sweet API**: CRUD operations, Search, Purchase, Restock
- **Total**: 64 tests

### Grand Total: **114 tests**

## Common Test Patterns

### Testing a Model
```typescript
it('should create a valid user', async () => {
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123',
  });
  
  expect(user.name).toBe('Test User');
  expect(user.email).toBe('test@example.com');
});
```

### Testing an API Endpoint
```typescript
it('should register a new user', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
    })
    .expect(201);

  expect(response.body.success).toBe(true);
  expect(response.body.token).toBeDefined();
});
```

### Testing with Authentication
```typescript
it('should create sweet with admin token', async () => {
  const admin = await User.create({...});
  const token = generateToken(admin._id);
  
  const response = await request(app)
    .post('/api/sweets')
    .set('Authorization', `Bearer ${token}`)
    .send(sweetData)
    .expect(201);
});
```

## Validation Rules

### User Registration
- **Name**: 2-50 chars, letters & spaces only
- **Email**: Valid email format
- **Password**: Min 6 chars, must have uppercase, lowercase, number

### Sweet Creation
- **Name**: 2-100 chars
- **Category**: Milk-based | Syrup-based | Dry Fruits | Seasonal | Special
- **Price**: > 0
- **Quantity**: >= 0
- **Description**: 10-500 chars

## Troubleshooting

### Tests Failing
1. Ensure MongoDB Memory Server is installed
2. Check Node.js version (should be >= 16)
3. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Coverage Not Generating
1. Make sure Jest is properly configured
2. Check `jest.config.js` exists
3. Run: `npm test -- --coverage --verbose`

### Timeout Errors
- Increase timeout in `jest.config.js`: `testTimeout: 30000`
- Check database connection in `tests/setup.ts`

## Best Practices

1. **Write tests first (TDD)**
   - Define expected behavior
   - Write failing test
   - Implement feature
   - See test pass
   - Refactor

2. **Keep tests isolated**
   - Each test should be independent
   - Clean database after each test
   - Don't rely on test execution order

3. **Use descriptive names**
   - Test names should explain what they test
   - Use "should..." pattern
   - Example: "should fail when email is missing"

4. **Test edge cases**
   - Valid inputs
   - Invalid inputs
   - Boundary conditions
   - Error scenarios

5. **Maintain high coverage**
   - Aim for 80%+ coverage
   - Test all critical paths
   - Don't just chase numbers

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install
      - run: cd backend && npm test
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Express Validator](https://express-validator.github.io/docs/)
