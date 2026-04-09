-- Fix: setup_new_user must also create the accounts_membership
create or replace function kit.setup_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    user_name text;
    picture_url text;
    owner_role varchar(50);
begin
    if new.raw_user_meta_data ->> 'name' is not null then
        user_name := new.raw_user_meta_data ->> 'name';
    end if;

    if user_name is null and new.email is not null then
        user_name := split_part(new.email, '@', 1);
    end if;

    if user_name is null then
        user_name := '';
    end if;

    if new.raw_user_meta_data ->> 'avatar_url' is not null then
        picture_url := new.raw_user_meta_data ->> 'avatar_url';
    else
        picture_url := null;
    end if;

    insert into public.accounts(
        id,
        primary_owner_user_id,
        name,
        is_personal_account,
        picture_url,
        email)
    values (
        new.id,
        new.id,
        user_name,
        true,
        picture_url,
        new.email);

    -- Create owner membership for the personal account
    select public.get_upper_system_role() into owner_role;

    insert into public.accounts_memberships(
        account_id,
        user_id,
        account_role,
        created_at,
        updated_at)
    values (
        new.id,
        new.id,
        owner_role,
        now(),
        now());

    return new;
end;
$$;
