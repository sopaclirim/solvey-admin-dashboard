# Solvey Labs Admin Dashboard

Admin dashboard për menaxhimin e Solvey Labs website.

## Features

- 🔐 Authentication me JWT
- 📊 Dashboard me statistikat
- 📝 Posts Management (Create, Edit, Delete, Publish/Unpublish)
- ✉️ Contacts Management (View, Delete)
- 💼 Applications Management (View, Update Status, Delete, Download CV)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Krijo `.env` file:
```env
VITE_API_URL=http://localhost:8080
```

3. Start development server:
```bash
npm run dev
```

## Struktura

```
src/
├── api/
│   └── Http.js              # Axios instance
├── components/
│   └── Layout/             # Sidebar, Header, Layout
├── context/
│   └── AuthContext.jsx     # Authentication context
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Dashboard.jsx       # Dashboard overview
│   ├── Posts.jsx           # Posts list
│   ├── PostForm.jsx        # Create/Edit post
│   ├── Contacts.jsx        # Contacts list
│   └── Applications.jsx    # Applications list
└── App.jsx                 # Main app component
```

## Login

Përdor credentials që i ke krijuar në backend përmes `/api/auth/register` ose direkt në MongoDB.

## Build

```bash
npm run build
```
# solvey-admin-dashboard
