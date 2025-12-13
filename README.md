# Sweet Delights - Sweet Shop Management System

A full-stack web application for managing an Indian sweet shop with user authentication, inventory management, and admin capabilities.

## 🍬 Features

### User Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Browse Sweets**: View all available sweets with beautiful card layouts
- **Search & Filter**: Find sweets by name, category, or price range
- **Shopping Cart**: Add items to cart, manage quantities, and checkout
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### Admin Features
- **Sweet Management**: Create, Read, Update, and Delete sweets
- **Inventory Control**: Manage stock levels and restock items
- **Admin Dashboard**: Comprehensive view of all products
- **Category Management**: Organize sweets into categories

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **UI Components**: Lucide React icons

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn package manager

### Installation Steps

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd incubyte
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file in backend directory
# Add the following environment variables:
MONGO_URI=your_mongodb_connection_string
PORT=4000
JWT_SECRET=your_jwt_secret_key

# Seed the database with sample data (Optional)
npm run seed

# Start the backend server
npm run dev
```

The backend server will run on `http://localhost:4000`

#### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend application will run on `http://localhost:5173`

#### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

You can login using the demo credentials provided below.

## 🔑 Demo Credentials

### Admin Account
- **Email**: admin@sweetshop.com
- **Password**: admin123

### User Account
- **Email**: user@example.com
- **Password**: user123

### Second User Account
- **Email**: dilseeratjassal@gmail.com
- **Password**: Dilseerat$12

## 📸 Screenshots

### Home Page
Beautiful landing page with auto-sliding hero carousel showcasing Indian sweets, search and filter functionality, and grid of sweet cards.

![Home Page](screenshots/home.png)

### Sweet Cards
Responsive product cards with images, descriptions, price, stock information, and "Add to Cart" button (disabled when out of stock).

![Sweet Cards](screenshots/sweet-cards.png)

### Shopping Cart
User cart page showing selected items, quantity controls, delivery fee calculation, and order summary with total price.

![Shopping Cart](screenshots/cart.png)

### Admin Dashboard
Admin panel for managing sweets inventory with search, filter, and CRUD operations (Create, Update, Delete, Restock).

![Admin Dashboard](screenshots/admin-dashboard.png)

### Login Page
User authentication page with email and password fields, password visibility toggle, and validation.

![Login Page](screenshots/login.png)

### Registration Page
New user registration with name, email, and password fields.

![Registration Page](screenshots/register.png)


## 🤖 My AI Usage

### Which AI Tools I Used
I used **GitHub Copilot** (VS Code extension) throughout the development process.

### How I Used AI

**Backend Development:**
- Generated TypeScript interfaces and Express route handlers
- Created JWT authentication middleware (`protect`, `adminOnly`)
- Implemented CRUD operations for sweets management
- Suggested proper error handling patterns and HTTP status codes

**Frontend Development:**
- Generated React component structures with hooks (useState, useEffect, useContext)
- Auto-completed Tailwind CSS utility classes for responsive design
- Created form validation logic for registration and login
- Implemented shopping cart context with localStorage persistence
- Suggested modern UI patterns like auto-sliding hero carousel

**Problem Solving:**
- Debugged TypeScript compilation errors
- Resolved React re-rendering issues in useEffect hooks
- Helped configure Tailwind CSS v4 with Vite

### Reflection on AI Impact

**Positive Impacts:**
- **Speed**: Accelerated development by 50-60%, especially for boilerplate code
- **Learning**: Discovered TypeScript and React best practices through Copilot suggestions
- **Consistency**: Maintained uniform coding patterns across the project
- **Problem-Solving**: Quickly resolved configuration and syntax issues

**Challenges:**
- Had to review AI suggestions carefully as some didn't match my project structure
- Some suggestions had subtle bugs requiring manual debugging
- Business logic and security configurations required manual implementation

### Example Commit with AI Attribution

```bash
git commit -m "style: Improve product card UI

Used AI to suggest Tailwind utility classes for layout and spacing,
then adjusted colors and responsiveness manually.

Co-authored-by: GitHub Copilot <copilot@github.com>"
```

---

**Built with ❤️ using modern full-stack technologies and AI assistance**

## 👨‍💻 Developer

**Dilseerat Jassal**  
📧 Email: dilseeratjassal@gmail.com  
💼 LinkedIn: [linkedin.com/in/dilseerat-kaur-9502702b0](http://linkedin.com/in/dilseerat-kaur-9502702b0/)

---

> **Disclaimer**: This project is developed for educational and demonstration purposes as part of the Incubyte assessment.


