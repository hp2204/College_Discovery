# 🎓 College Discovery Platform

A modern full-stack college discovery web application built using **Next.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

This platform allows students to explore colleges, search institutions dynamically, and view detailed information about each college through a responsive and scalable interface.

---

## 🚀 Features

* 🔍 Real-time college search
* 🏫 Dynamic college detail pages
* ⚡ Fast API routes using Next.js App Router
* 🗄️ PostgreSQL database integration
* 🔄 Prisma ORM for database management
* 🎨 Responsive UI with Tailwind CSS
* 📡 Full-stack architecture using Next.js 16
* 🔥 Dynamic routing support

---

## 🛠️ Tech Stack

### Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* Prisma ORM
* PostgreSQL (Neon Database)

### Deployment

* Vercel

---

## 📂 Project Structure

```bash
college-discovery/
│
├── app/
│   ├── api/
│   │   └── colleges/
│   │       └── route.ts
│   │
│   ├── college/
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── page.tsx
│   └── layout.tsx
│
├── lib/
│   └── prisma.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/college-discovery.git
cd college-discovery
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your_postgresql_database_url"
JWT_SECRET="your_secret_key"
```

---

### 4️⃣ Generate Prisma Client

```bash
npx prisma generate
```

---

### 5️⃣ Push Database Schema

```bash
npx prisma db push
```

---

### 6️⃣ Seed Database

```bash
npx ts-node prisma/seed.ts
```

---

### 7️⃣ Start Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## 🧠 API Endpoint

### Get All Colleges

```http
GET /api/colleges
```

Returns all colleges stored in the database.

---

## 📸 Screenshots

### Homepage

* College listing
* Search functionality
* Responsive cards

### Dynamic College Page

* Detailed college information
* Dynamic route rendering

---

## 🌟 Future Improvements

* 🔐 Authentication system
* ❤️ Save/Favorite colleges
* 📊 College comparison feature
* 🧠 AI-powered recommendation system
* 📝 Student reviews and ratings
* 📈 Advanced filtering and sorting

---

## 👩‍💻 Author

**Harshita Pandey**

* LinkedIn: https://linkedin.com
* GitHub: https://github.com
* Working Project: college-discovery-gold.vercel.app

---

## 📜 License

This project is licensed under the MIT License.
