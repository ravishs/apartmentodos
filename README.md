# 🏢 SITARA - Apartment Management System

A modern, full-featured apartment community management application built with Next.js and Supabase. Designed for **Mahaveer Sitara** apartment complex to streamline resident management, track maintenance requests, and manage community wishlists.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![Material-UI](https://img.shields.io/badge/Material--UI-5-007FFF)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E)

## ✨ Features

### 🔐 Authentication & Authorization
- **Secure Login System** with Supabase Authentication
- **Role-Based Access Control** (Admin & Resident roles)
- **User Profile Management** with password change functionality
- **Pending User Approval** system for new registrations

### 👥 Residents Management
- Complete resident directory with contact information
- Admin-only user management (Add, Edit, Delete)
- Role assignment and modification (Admin only)
- Apartment number assignment
- User status tracking (Active/Pending)

### 🏗️ Pending from Builder
- Track maintenance and construction issues
- Categorize by area (Block, Community, House Specific, Security, Housekeeping)
- Mark items as urgent
- Status tracking (Pending, Done, Invalid)
- Admin-only status updates
- Track who created and last edited each item

### ❤️ Community Wishlist
- Shared wishlist for community improvements
- Categorization by area
- Urgent item flagging
- Status management (Pending, Done, Invalid)
- Admin-controlled status updates
- Full edit history tracking

### 📞 Emergency Contacts
- Centralized emergency contact management
- Quick access to essential services:
  - Electrician
  - Plumber
  - Security
  - Project Manager
  - Association Contact
- Admin-only editing with RLS security

### 📊 Dashboard
- **Real-time Statistics**:
  - Total Residents count
  - Pending Builder Tasks
  - Pending Wishlist Items
  - Urgent Builder Tasks
  - Urgent Wishlist Items
- **Emergency Contacts Widget** with quick access
- **Clickable Cards** for easy navigation
- **Responsive Design** for all screen sizes

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: Material-UI (MUI) v5
- **Language**: JavaScript (ES6+)
- **Styling**: CSS-in-JS with MUI's `sx` prop

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage (if needed)

### Security
- **Row Level Security (RLS)** policies on all tables
- **Server-side rendering** for data fetching
- **Admin-only actions** enforced at both UI and database levels
- **Secure password hashing** via Supabase Auth

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase account and project
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apartmentodos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Run database migrations**
   
   Go to your Supabase Dashboard → SQL Editor and run the following migrations in order:
   - `supabase/migrations/20241211_pending_builder_tasks.sql`
   - `supabase/migrations/20241211_wishlist_and_tracking.sql`
   - `supabase/migrations/20241211_emergency_contacts.sql`
   - `supabase/migrations/20241211_add_status_columns.sql`
   - `supabase/migrations/20241211_restrict_status_to_admins.sql`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
apartmentodos/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── emergency-contacts/   # Emergency contacts page & actions
│   │   ├── login/                # Login page & authentication
│   │   ├── pending-builder/      # Pending builder tasks page & actions
│   │   ├── profile/              # User profile page & actions
│   │   ├── residents/            # Residents management page & actions
│   │   ├── signup/               # User registration page
│   │   ├── wishlist/             # Wishlist page & actions
│   │   ├── layout.js             # Root layout with metadata
│   │   └── page.js               # Dashboard home page
│   ├── components/               # React components
│   │   ├── Dashboard/            # Dashboard layout & home components
│   │   ├── EmergencyContacts/    # Emergency contacts form
│   │   ├── PendingBuilder/       # Pending builder table component
│   │   ├── Profile/              # Profile form component
│   │   ├── Residents/            # Residents table component
│   │   └── Wishlist/             # Wishlist table component
│   ├── theme/                    # MUI theme configuration
│   └── utils/                    # Utility functions
│       └── supabase/             # Supabase client setup
├── supabase/
│   └── migrations/               # Database migration files
├── public/                       # Static assets (logo, favicon)
├── .env.local                    # Environment variables (not in repo)
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🔑 User Roles & Permissions

### Admin Role
- ✅ Full access to all features
- ✅ Add, edit, and delete residents
- ✅ Change user roles
- ✅ Update status of builder tasks and wishlist items
- ✅ Edit emergency contacts
- ✅ Approve pending user registrations

### Resident Role
- ✅ View all residents
- ✅ Add and edit own builder tasks and wishlist items
- ✅ View emergency contacts
- ✅ Update own profile (except role and apartment number)
- ❌ Cannot change item statuses
- ❌ Cannot edit other users
- ❌ Cannot modify emergency contacts

## 🗄️ Database Schema

### Tables
- **`pending_builder_tasks`** - Construction/maintenance issues
- **`wishlist_items`** - Community improvement wishes
- **`emergency_contacts`** - Emergency contact information
- **`auth.users`** - User authentication (Supabase managed)

### Key Fields
- All tables include `created_at`, `updated_at` timestamps
- Tracking fields: `created_by`, `last_edited_by`
- Status field: `'pending' | 'done' | 'invalid'`
- User metadata: `role`, `status`, `full_name`, `mobile`, `apartment_number`

## 🎨 Design Features

- **Responsive Design** - Works on mobile, tablet, and desktop
- **Material Design** - Clean, modern UI with Material-UI
- **Dark Mode Ready** - Theme system supports dark mode
- **Accessible** - WCAG compliant components
- **Interactive Cards** - Hover effects and smooth transitions
- **Toast Notifications** - User-friendly feedback messages

## 🔒 Security Features

- **Row Level Security (RLS)** on all database tables
- **Server-side data fetching** to protect sensitive information
- **Role-based UI rendering** to hide admin features from residents
- **Secure password storage** via Supabase Auth
- **Protected routes** with authentication checks
- **Admin-only mutations** enforced at database level

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

## 👨‍💻 Author

Built with ❤️ for Mahaveer Sitara Apartment Community

## 🐛 Known Issues & Troubleshooting

### Issue: "Failed to fetch residents"
**Solution**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`

### Issue: RLS policies blocking updates
**Solution**: Run all migration files in the correct order, especially `20241211_restrict_status_to_admins.sql`

### Issue: Login not working
**Solution**: Check Supabase project URL and anon key in environment variables

## 🔮 Future Enhancements

- [ ] Email notifications for urgent items
- [ ] Document upload for builder tasks
- [ ] Voting system for wishlist items
- [ ] Monthly maintenance fee tracking
- [ ] Visitor management system
- [ ] Community announcements board
- [ ] Mobile app (React Native)

## 📞 Support

For support, please contact the apartment association or raise an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: December 2024
