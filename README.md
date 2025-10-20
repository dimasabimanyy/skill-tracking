# 🎯 Skill Tracking App

A personal web app to track learning progress and manage skill development.

## 🚀 Features

- **Learning Dashboard**: Clean overview of all your skills
- **Progress Tracking**: Visual progress indicators and status management
- **Search & Filter**: Find skills by name or filter by status
- **Notes**: Personal notes for each skill
- **Target Dates**: Set and track learning deadlines
- **Dark Theme**: Professional, easy-on-eyes interface

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and interactions
- **Supabase** - Database and real-time backend
- **Lucide React** - Beautiful icons
- **date-fns** - Date manipulation utilities

## 🏃‍♂️ Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup Supabase** (optional - app works with mock data):
   - Create a new Supabase project
   - Copy your project URL and anon key to `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 📊 Database Schema

```sql
-- Create skills table in Supabase
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'done')),
  target_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 Design Philosophy

- **Personal SaaS feel**: Professional but not overwhelming
- **Dark-first design**: Easy on the eyes for long sessions
- **Minimal cognitive load**: Clear visual hierarchy and status indicators
- **Responsive**: Works great on desktop and tablet

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── SkillCard.js    # Individual skill display
│   └── SkillList.js    # Skills grid layout
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
└── styles/             # Global styles and animations
```

## 🚀 Development

The app works out of the box with mock data. Supabase integration is optional and will automatically fall back to mock data if not configured.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Next Steps

See `notes/next_features.md` for planned enhancements and feature ideas.