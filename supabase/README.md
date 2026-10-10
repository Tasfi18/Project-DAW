# Supabase Database Setup

## File Structure

```
supabase/
├── schema.sql              # Base table structure (CREATE TABLES)
├── seed.sql               # Initial data (INSERT statements)
├── migrations/            # Schema changes for existing databases
│   └── 001_add_team_contacts.sql
└── README.md             # This file
```

## Setup Instructions

### For New Database (First Time Setup)

1. Go to your Supabase Dashboard → SQL Editor
2. Run files in this order:

```sql
-- Step 1: Create tables
-- Copy and run: schema.sql

-- Step 2: Insert initial data
-- Copy and run: seed.sql
```

### For Existing Database (Updates)

If your database is already set up, only run migration files:

```sql
-- Run latest migration
-- Copy and run: migrations/001_add_team_contacts.sql
```

## Tables Created

- **content_sections** - Website content (hero, intro, leader message, etc.)
- **team_members** - Team member information with contact details
- **sdg_goals** - SDG goals with progress tracking
- **performance_indicators** - Performance metrics
- **contact_info** - Company contact information

## Migration History

| File | Date | Description |
|------|------|-------------|
| 001_add_team_contacts.sql | 2025-01-17 | Added phone, email, linkedin_url to team_members |

## Best Practices

✅ Always backup before running migrations
✅ Run migrations in order (001, 002, 003...)
✅ Test on staging before production
✅ Keep migrations idempotent (use IF NOT EXISTS)
