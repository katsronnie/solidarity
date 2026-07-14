-- ============================================================
-- AFYA FUND — Supabase schema
-- Paste this whole file into Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Users' profile + fund data. Linked to Supabase's built-in auth.users
-- via id, but we also store a hashed PIN here since mobile-money-style
-- PIN login isn't Supabase's default password flow.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text unique not null,
  network text not null check (network in ('mtn', 'airtel')),
  pin_hash text not null,             -- bcrypt hash, never store raw PIN
  balance bigint not null default 0,  -- in UGX, smallest unit = 1 shilling
  ceiling bigint not null default 500000,
  deduction_rate numeric not null default 8,   -- %
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_at timestamptz not null default now()
);

-- Every airtime/data/send/withdraw/hospital-payment transaction
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('airtime', 'data', 'send', 'withdraw', 'hospital_payment')),
  amount bigint not null,             -- the transaction amount in UGX
  saved bigint not null default 0,    -- 8% fund contribution (if applicable)
  service_fee bigint not null default 0, -- 2% platform fee (withdraw/hospital_payment only)
  network text not null check (network in ('mtn', 'airtel')),
  created_at timestamptz not null default now()
);

-- Registered hospitals users can pay directly
create table hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  category text not null check (category in ('Public', 'Private')),
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- Withdrawal + hospital payment requests awaiting admin approval
create table payouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('withdrawal', 'hospital_payment')),
  target text not null,               -- reason, or hospital name
  amount bigint not null,
  service_fee bigint not null default 0,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references auth.users(id)
);

-- Admin accounts — separate from regular users entirely
create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

-- Short-lived OTP codes — used for both user phone OTP fallback
-- and admin email OTP (second factor after password)
create table otp_codes (
  id uuid primary key default gen_random_uuid(),
  destination text not null,          -- phone number or email
  code_hash text not null,            -- hashed, never store the raw code
  purpose text not null check (purpose in ('user_login', 'admin_login')),
  expires_at timestamptz not null,
  consumed boolean not null default false,
  created_at timestamptz not null default now()
);

-- System-wide settings (single row, admin-editable)
create table settings (
  id int primary key default 1,
  deduction_rate numeric not null default 8,
  service_fee_rate numeric not null default 2,
  fund_ceiling bigint not null default 500000,
  mtn_enabled boolean not null default true,
  airtel_enabled boolean not null default true,
  constraint single_row check (id = 1)
);
insert into settings (id) values (1);

-- ============================================================
-- Row Level Security — users can only see their OWN data.
-- Admins get a separate policy checked against admin_users.
-- ============================================================

alter table profiles enable row level security;
alter table transactions enable row level security;
alter table payouts enable row level security;
alter table hospitals enable row level security;
alter table admin_users enable row level security;
alter table settings enable row level security;

-- Users can read/update only their own profile
create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on profiles
  for update using (auth.uid() = id);

-- Users can read/insert only their own transactions
create policy "Users read own transactions" on transactions
  for select using (auth.uid() = user_id);
create policy "Users insert own transactions" on transactions
  for insert with check (auth.uid() = user_id);

-- Users can read/insert only their own payout requests
create policy "Users read own payouts" on payouts
  for select using (auth.uid() = user_id);
create policy "Users insert own payouts" on payouts
  for insert with check (auth.uid() = user_id);

-- Everyone logged in can read the hospital directory
create policy "Anyone can read hospitals" on hospitals
  for select using (true);

-- Admins can read/update everything (checked via admin_users table)
create policy "Admins read all profiles" on profiles
  for select using (exists (select 1 from admin_users where id = auth.uid()));
create policy "Admins update all profiles" on profiles
  for update using (exists (select 1 from admin_users where id = auth.uid()));

create policy "Admins read all transactions" on transactions
  for select using (exists (select 1 from admin_users where id = auth.uid()));

create policy "Admins read all payouts" on payouts
  for select using (exists (select 1 from admin_users where id = auth.uid()));
create policy "Admins update payouts" on payouts
  for update using (exists (select 1 from admin_users where id = auth.uid()));

create policy "Admins read settings" on settings
  for select using (exists (select 1 from admin_users where id = auth.uid()));
create policy "Admins update settings" on settings
  for update using (exists (select 1 from admin_users where id = auth.uid()));
