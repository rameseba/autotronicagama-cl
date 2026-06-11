-- =============================================================
-- Gama Autotrónica — Galería privada de imágenes
-- Ejecutar en: Supabase Dashboard → SQL Editor
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

-- 2) Registro de imágenes de la galería
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

create policy "usuarios autenticados pueden ver la galería"
  on public.gallery_images for select
  to authenticated
  using (true);

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

-- 3) Bucket privado de almacenamiento
insert into storage.buckets (id, name, public)
values ('galeria', 'galeria', false)
on conflict (id) do nothing;

create policy "autenticados pueden ver archivos de la galería"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'galeria');

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
-- 1. Authentication → Users → "Add user": crear los usuarios
--    (correo + contraseña) que podrán ver la galería.
-- 2. Agregar el correo del administrador (quien sube imágenes):
--    insert into public.admins (email) values ('correo@ejemplo.com');
-- =============================================================
