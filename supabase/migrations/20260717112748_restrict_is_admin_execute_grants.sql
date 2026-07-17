begin;

revoke execute on function public.is_admin() from anon;
revoke execute on function public.is_admin() from service_role;
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

commit;
