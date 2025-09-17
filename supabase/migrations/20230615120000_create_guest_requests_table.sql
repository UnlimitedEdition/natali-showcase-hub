-- Create guest_requests table
create table if not exists guest_requests (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  reason text not null,
  message text not null,
  language_code text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for better query performance
create index if not exists guest_requests_email_idx on guest_requests (email);
create index if not exists guest_requests_language_code_idx on guest_requests (language_code);
create index if not exists guest_requests_created_at_idx on guest_requests (created_at);

-- Set up Row Level Security (RLS)
alter table guest_requests enable row level security;

-- Create policies
create policy "Enable read access for admins"
on guest_requests for select
to authenticated
using ( exists (select 1 from profiles where profiles.user_id = auth.uid() and profiles.role = 'admin') );

create policy "Enable insert access for everyone"
on guest_requests for insert
to anon, authenticated
with check (true);

-- Create trigger for updating updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
   NEW.updated_at = timezone('utc'::text, now());
   return NEW;
end;
$$ language 'plpgsql';

create trigger update_guest_requests_updated_at
before update on guest_requests
for each row
execute procedure update_updated_at_column();