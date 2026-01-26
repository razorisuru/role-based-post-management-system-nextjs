# NextBlog

A modern, full-featured blogging platform built with Next.js 16, featuring role-based access control (RBAC), user authentication, and a beautiful responsive UI.

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-6.19.2-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** - Secure session management using Jose
- **Password Hashing** - bcrypt encryption for secure password storage
- **Role-Based Access Control (RBAC)** - Four predefined roles:
  - **Admin** - Full system access (all permissions)
  - **Moderator** - Can manage users and posts
  - **User** - Can create and manage own posts
  - **Guest** - Read-only access to published posts
- **Dynamic Permissions** - Resource-based permission system (create, read, update, delete)

### 📝 Blog/Posts System
- **Full CRUD Operations** - Create, read, update, delete posts
- **Post Status Management** - Draft, Published, Archived states
- **Rich Content** - Title, excerpt, and full content support
- **Author Attribution** - Posts linked to user accounts
- **Public Post Viewing** - Published posts visible to everyone
- **Permission-Based Actions** - Edit/delete based on ownership or permissions

### 👥 User Management
- **User Registration & Login** - Complete authentication flow
- **Profile Management** - Update personal information
- **User Status** - Active, Inactive, Suspended states
- **Role Assignment** - Admins can assign roles to users
- **User Listing** - View and manage all users (admin/moderator)

### 🎨 UI/UX Features
- **Dark/Light Mode** - Theme toggle with system preference support
- **Responsive Design** - Mobile-first approach
- **Shadcn UI Components** - Beautiful, accessible components
- **Toast Notifications** - User feedback with Sonner
- **Confirmation Dialogs** - AlertDialog for destructive actions
- **Modern Color Palette** - Navy, Steel, Blush, Silver theme

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.4 (App Router, Turbopack) |
| **Frontend** | React 19.2.3 |
| **Database** | PostgreSQL with Prisma ORM 6.19.2 |
| **Authentication** | Jose (JWT), bcryptjs |
| **Styling** | Tailwind CSS 4, CSS Variables |
| **UI Components** | Shadcn UI (Radix UI primitives) |
| **Validation** | Zod |
| **Theme** | next-themes |
| **Notifications** | Sonner |

## 📁 Project Structure

```
nextblog/
├── app/
│   ├── actions/           # Server Actions
│   │   ├── auth.js        # Authentication actions
│   │   ├── posts.js       # Post CRUD actions
│   │   └── users.js       # User management actions
│   ├── dashboard/         # Protected dashboard routes
│   │   ├── layout.js      # Dashboard layout with sidebar
│   │   ├── page.js        # Dashboard home
│   │   ├── posts/         # Post management pages
│   │   │   ├── page.js    # Posts list
│   │   │   ├── new/       # Create post
│   │   │   └── [id]/      # View/Edit post
│   │   ├── users/         # User management
│   │   ├── settings/      # System settings
│   │   └── profile/       # User profile
│   ├── login/             # Login page
│   ├── signup/            # Registration page
│   ├── posts/[id]/        # Public post view
│   ├── layout.js          # Root layout
│   ├── page.js            # Homepage (blog listing)
│   └── globals.css        # Global styles & theme
├── components/
│   ├── auth/              # Auth forms
│   ├── dashboard/         # Dashboard components
│   │   ├── header.jsx     # Top navigation
│   │   └── sidebar.jsx    # Side navigation
│   ├── ui/                # Shadcn UI components
│   ├── theme-provider.jsx # Theme context
│   └── theme-toggle.jsx   # Dark/light mode toggle
├── lib/
│   ├── dal.js             # Data Access Layer
│   ├── db.js              # Prisma client
│   ├── definitions.js     # Zod schemas
│   ├── session.js         # Session management
│   └── utils.js           # Utility functions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Database seeding
└── proxy.js               # Middleware for auth
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/razorisuru/role-based-post-management-system-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/nextblog_db"
   
   # Session Secret (generate a secure random string)
   SESSION_SECRET="your-super-secret-key-at-least-32-characters"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:reset` | Reset database and re-seed |

## 👤 Test Accounts

After seeding the database, you can use these accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@nextblog.com | Admin@123 |
| **Moderator** | moderator@nextblog.com | Test@123 |
| **User** | user@nextblog.com | Test@123 |
| **Guest** | guest@nextblog.com | Test@123 |

## 🔑 Permissions Matrix

| Permission | Admin | Moderator | User | Guest |
|------------|:-----:|:---------:|:----:|:-----:|
| `dashboard:access` | ✅ | ✅ | ✅ | ❌ |
| `users:read` | ✅ | ✅ | ❌ | ❌ |
| `users:create` | ✅ | ✅ | ❌ | ❌ |
| `users:update` | ✅ | ✅ | ❌ | ❌ |
| `users:delete` | ✅ | ❌ | ❌ | ❌ |
| `posts:read` | ✅ | ✅ | ❌ | ✅ |
| `posts:create` | ✅ | ✅ | ✅ | ❌ |
| `posts:update` | ✅ | ✅ | ❌ | ❌ |
| `posts:delete` | ✅ | ❌ | ❌ | ❌ |
| `settings:manage` | ✅ | ❌ | ❌ | ❌ |

> **Note:** Users can always edit/delete their own posts regardless of permissions.

## 🎨 Theme Customization

The app uses CSS variables for theming. Colors are defined in `app/globals.css`:

```css
:root {
  --primary: 213 51% 22%;        /* Navy #213C51 */
  --secondary: 204 30% 55%;      /* Steel #6594B1 */
  --accent: 310 42% 76%;         /* Blush #DDAED3 */
  --background: 0 0% 93%;        /* Silver #EEEEEE */
}

.dark {
  --background: 213 51% 12%;     /* Dark navy */
  --foreground: 0 0% 93%;        /* Silver text */
}
```

## 📊 Database Schema

### Models

- **User** - User accounts with role assignment
- **Post** - Blog posts with status management
- **Role** - User roles (admin, moderator, user, guest)
- **Permission** - Granular permissions (resource:action)
- **RolePermission** - Many-to-many role-permission mapping
- **Session** - JWT session management

### Relationships

```
User ─────┬───── Role ─────── RolePermission ─────── Permission
          │
          └───── Post
          │
          └───── Session
```

## 🔒 Security Features

- **Password Hashing** - bcrypt with 12 salt rounds
- **JWT Sessions** - Secure token-based authentication
- **HTTP-Only Cookies** - Session tokens stored securely
- **CSRF Protection** - Server actions with validation
- **Input Validation** - Zod schemas for all inputs
- **Permission Checks** - Server-side authorization

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly UI elements
- Optimized layouts for all screen sizes

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Docker

```dockerfile
# Dockerfile example coming soon
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [Prisma](https://prisma.io) - Next-generation ORM
- [Shadcn UI](https://ui.shadcn.com) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Vercel](https://vercel.com) - Deployment platform

---

<p align="center">
  Built with ❤️ using Next.js, Prisma, and Shadcn UI
</p>
