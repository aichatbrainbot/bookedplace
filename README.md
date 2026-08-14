# BookPlace - Project Deployment Guide

Welcome to the BookPlace project deployment guide. This file provides step-by-step instructions on how to comfortably deploy this Next.js (version 15) application with Prisma ORM to a production server environment like a VPS or CloudPanel instance.

## Technical Stack Overview
- **Framework**: Next.js (App Router)
- **Database**: MySQL
- **ORM**: Prisma
- **Environment**: Node.js (v18 or v20+)

---

## 🚀 Deployment Steps

### Step 1: Prepare the Source Files
After moving the project files to your server (e.g., `~/htdocs/yourdomain.com`), double check that the `node_modules` and `.next` folders are **not** uploaded. These directories need to be generated locally on the server for optimal performance and compatibility.

### Step 2: Configure the Environment Variables
Duplicate `.env.example` or simply create a new `.env` file in the root directory containing your specific credentials:

```env
# Database Connection URL
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@127.0.0.1:3306/DB_NAME"

# Initial Admin Credentials
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="YourSecurePassword"

# Public Site Configuration
NEXT_PUBLIC_SITE_URL="https://yourdomain.com/"
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY="YOUR_API_KEY_HERE"
```

### Step 3: Install Packages
Access your project dashboard via SSH or terminal and run:
```bash
npm install
```

### Step 4: Provision & Prepare the Database
This application uses Prisma to structure database tables. Run the following commands strictly in this order:

```bash
# 1. Prepare and generate local Prisma Client
npx prisma generate

# 2. Push Prisma Schema definitions into your Database instance
npx prisma db push

# 3. Insert the default Admin User record into the Database (Reads from .env)
npx prisma db seed
```

### Step 5: Build for Production Environment
Compile the Next.js framework into optimized static sites and isolated server bundles:
```bash
npm run build
```

### Step 6: Maintain Process with PM2
If PM2 process manager is not installed, install it globally:
```bash
npm install -g pm2
```

Run your Next.js application continuously using PM2. You can optionally bind the application to a specific port (e.g., `3003`):
```bash
pm2 start npm --name "bookplace-web" -- start -- -p 3003
```

Make sure PM2 restores your services across server reboots:
```bash
pm2 save
pm2 startup
```

### Step 7: Configure Reverse Proxy
Map your domain names to `http://127.0.0.1:3003` (or the port defined above) using tools directly from your control panel, Node.js App settings, or manual `Nginx` Reverse Proxy blocks.

---
*Created automatically to help deploy BookPlace!*
