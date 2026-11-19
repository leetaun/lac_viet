-- Run once in the Supabase SQL Editor. Only the server service role can access rooms.
create table if not exists public.lacviet_online_rooms (
  code text primary key check (code ~ '^[A-HJ-NP-Z2-9]{6}$'),
  version bigint not null,
  payload jsonb not null,
  expires_at timestamptz not null
);
alter table public.lacviet_online_rooms enable row level security;
revoke all on table public.lacviet_online_rooms from anon, authenticated;
grant select, insert, update, delete on table public.lacviet_online_rooms to service_role;
create index if not exists lacviet_online_expiry on public.lacviet_online_rooms(expires_at);

create or replace function public.lacviet_online_cas(
  p_code text, p_before bigint, p_payload jsonb, p_expires_at timestamptz
) returns boolean language plpgsql security invoker set search_path = '' as $$
declare n integer;
begin
  if p_before is null then
    insert into public.lacviet_online_rooms(code, version, payload, expires_at)
    values (p_code, (p_payload->>'version')::bigint, p_payload, p_expires_at)
    on conflict (code) do nothing;
  else
    update public.lacviet_online_rooms
      set version = (p_payload->>'version')::bigint, payload = p_payload, expires_at = p_expires_at
      where code = p_code and version = p_before and expires_at > now();
  end if;
  get diagnostics n = row_count;
  return n = 1;
end;
$$;
revoke all on function public.lacviet_online_cas(text, bigint, jsonb, timestamptz) from public, anon, authenticated;
grant execute on function public.lacviet_online_cas(text, bigint, jsonb, timestamptz) to service_role;
