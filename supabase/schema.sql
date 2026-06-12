-- =============================================================
-- Gama Autotrónica — Galería privada de imágenes
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Requiere además: Authentication → "Confirm email" desactivado
-- (mailer_autoconfirm = true), porque el control de acceso lo da
-- la aprobación del administrador, no el correo.
-- =============================================================

-- 1) Administradores: correos autorizados a subir/gestionar imágenes
create table if not exists public.admins (
  email text primary key
);

alter table public.admins enable row level security;

-- Cualquier usuario autenticado puede comprobar si es admin (solo su propio correo)
create policy "leer su propia fila de admin"
  on public.admins for select
  to authenticated
  using (email = (auth.jwt() ->> 'email'));

-- Helper: ¿el usuario actual es admin?
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.admins where email = (select auth.jwt() ->> 'email')
  );
$$;

-- 2) Perfiles: una fila por usuario registrado, con estado de aprobación.
--    Las cuentas se crean solas al registrarse; el admin las aprueba en /admin.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "usuarios ven su propio perfil"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "admins actualizan perfiles"
  on public.profiles for update to authenticated
  using (public.is_admin());

-- Crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3) Registro de imágenes de la galería
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tags text[] not null default '{}',
  storage_path text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists gallery_images_name_idx
  on public.gallery_images using gin (to_tsvector('spanish', name));

alter table public.gallery_images enable row level security;

create policy "aprobados pueden ver la galería"
  on public.gallery_images for select to authenticated
  using (
    public.is_admin()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.approved)
  );

create policy "solo admins pueden agregar imágenes"
  on public.gallery_images for insert
  to authenticated
  with check ((auth.jwt() ->> 'email') in (select email from public.admins));

create policy "solo admins pueden editar imágenes"
  on public.gallery_images for update
  to authenticated
  using ((auth.jwt() ->> 'email') in (select email from public.admins));

create policy "solo admins pueden eliminar imágenes"
  on public.gallery_images for delete
  to authenticated
  using ((auth.jwt() ->> 'email') in (select email from public.admins));

-- 4) Bucket privado de almacenamiento
insert into storage.buckets (id, name, public)
values ('galeria', 'galeria', false)
on conflict (id) do nothing;

create policy "aprobados pueden ver archivos de la galería"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'galeria'
    and (
      public.is_admin()
      or exists (select 1 from public.profiles p where p.id = auth.uid() and p.approved)
    )
  );

create policy "admins pueden subir archivos a la galería"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'galeria'
    and (auth.jwt() ->> 'email') in (select email from public.admins)
  );

create policy "admins pueden eliminar archivos de la galería"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'galeria'
    and (auth.jwt() ->> 'email') in (select email from public.admins)
  );

-- =============================================================
-- PASOS MANUALES después de ejecutar este script:
-- 1. Agregar el correo del administrador (quien sube imágenes y
--    aprueba cuentas):
--    insert into public.admins (email) values ('correo@ejemplo.com');
-- 2. Los clientes se registran solos en /acceso; sus cuentas quedan
--    pendientes hasta aprobarlas en /admin → Usuarios.
-- =============================================================
