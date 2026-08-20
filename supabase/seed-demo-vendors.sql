-- ============================================================
-- EventLink Demo Vendors Seed
-- Run this entire script in Supabase → SQL Editor
-- ============================================================

-- Helper: create demo vendor users + profiles + vendor_profiles

DO $$
DECLARE
  v_user_id uuid;
  v_vendor_id uuid;
BEGIN

-- 1. Nova Decor Co (Mumbai - Wedding Decor + Fabrication)
v_user_id := gen_random_uuid();
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nova@eventlink.demo', crypt('demo1234', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nova Decor Co","role":"vendor"}', now(), now())
ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, role, full_name) VALUES (v_user_id, 'vendor', 'Aarav Mehta') ON CONFLICT (id) DO UPDATE SET role='vendor', full_name='Aarav Mehta';
INSERT INTO public.vendor_profiles (user_id, business_name, slug, primary_city, serviceable_cities, categories, bio, years_experience, team_size, packages, verification_status, profile_completion_score, average_rating, review_count, view_count, is_active)
VALUES (v_user_id, 'Nova Decor Co', 'nova-decor-co', 'Mumbai', ARRAY['Mumbai','Pune'], ARRAY['Wedding Decor','Fabrication'], 'Premium wedding & corporate decor studio. From intimate mandaps to large-scale stage setups — clean modern aesthetics with strong Indian roots.', 7, 18, '[{"title":"Signature Wedding Decor","price_min":85000,"price_max":250000,"currency":"INR"}]'::jsonb, 'self_claimed', 85, 4.8, 12, 340, true);

-- 2. Lumen Stage (Delhi NCR - Lights + AV + Production)
v_user_id := gen_random_uuid();
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'lumen@eventlink.demo', crypt('demo1234', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lumen Stage","role":"vendor"}', now(), now())
ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, role, full_name) VALUES (v_user_id, 'vendor', 'Kabir Singh') ON CONFLICT (id) DO UPDATE SET role='vendor', full_name='Kabir Singh';
INSERT INTO public.vendor_profiles (user_id, business_name, slug, primary_city, serviceable_cities, categories, bio, years_experience, team_size, packages, verification_status, profile_completion_score, average_rating, review_count, view_count, is_active)
VALUES (v_user_id, 'Lumen Stage', 'lumen-stage', 'Delhi NCR', ARRAY['Delhi NCR','Chandigarh','Jaipur'], ARRAY['Lights','AV','Production'], 'Full-service lighting & production house for concerts, product launches and high-end corporate events. Moving heads, LED walls, pixel mapping.', 11, 32, '[{"title":"Concert Lighting Package","price_min":150000,"price_max":600000,"currency":"INR"}]'::jsonb, 'self_claimed', 90, 4.9, 28, 890, true);

-- 3. Frame & Flash (Bangalore - Photo/Video)
v_user_id := gen_random_uuid();
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'frame@eventlink.demo', crypt('demo1234', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Frame & Flash","role":"vendor"}', now(), now())
ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, role, full_name) VALUES (v_user_id, 'vendor', 'Ananya Rao') ON CONFLICT (id) DO UPDATE SET role='vendor', full_name='Ananya Rao';
INSERT INTO public.vendor_profiles (user_id, business_name, slug, primary_city, serviceable_cities, categories, bio, years_experience, team_size, packages, verification_status, profile_completion_score, average_rating, review_count, view_count, is_active)
VALUES (v_user_id, 'Frame & Flash', 'frame-and-flash', 'Bangalore', ARRAY['Bangalore','Hyderabad','Chennai'], ARRAY['Photo/Video'], 'Candid wedding photography & cinematic films. Natural light, storytelling style. Team of 8 creatives covering South India.', 6, 8, '[{"title":"Full Wedding Coverage","price_min":55000,"price_max":120000,"currency":"INR"}]'::jsonb, 'self_claimed', 80, 4.7, 19, 512, true);

-- 4. Pulse Audio (Hyderabad - Sound)
v_user_id := gen_random_uuid();
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pulse@eventlink.demo', crypt('demo1234', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Pulse Audio","role":"vendor"}', now(), now())
ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, role, full_name) VALUES (v_user_id, 'vendor', 'Rohan Reddy') ON CONFLICT (id) DO UPDATE SET role='vendor', full_name='Rohan Reddy';
INSERT INTO public.vendor_profiles (user_id, business_name, slug, primary_city, serviceable_cities, categories, bio, years_experience, team_size, packages, verification_status, profile_completion_score, average_rating, review_count, view_count, is_active)
VALUES (v_user_id, 'Pulse Audio', 'pulse-audio', 'Hyderabad', ARRAY['Hyderabad','Bangalore'], ARRAY['Sound','AV'], 'Line-array systems, monitor mixes and FOH for live music, conferences and outdoor festivals. Clean power + experienced engineers.', 9, 14, '[{"title":"Festival Sound Rig","price_min":90000,"price_max":350000,"currency":"INR"}]'::jsonb, 'self_claimed', 78, 4.6, 15, 278, true);

-- 5. Craft & Form (Pune - Fabrication + Furniture)
v_user_id := gen_random_uuid();
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'craft@eventlink.demo', crypt('demo1234', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Craft & Form","role":"vendor"}', now(), now())
ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, role, full_name) VALUES (v_user_id, 'vendor', 'Vikram Desai') ON CONFLICT (id) DO UPDATE SET role='vendor', full_name='Vikram Desai';
INSERT INTO public.vendor_profiles (user_id, business_name, slug, primary_city, serviceable_cities, categories, bio, years_experience, team_size, packages, verification_status, profile_completion_score, average_rating, review_count, view_count, is_active)
VALUES (v_user_id, 'Craft & Form', 'craft-and-form', 'Pune', ARRAY['Pune','Mumbai'], ARRAY['Fabrication','Furniture'], 'Custom stage sets, brand activations and modular furniture for exhibitions & product launches. In-house workshop + design team.', 8, 22, '[{"title":"Custom Stage Build","price_min":120000,"price_max":500000,"currency":"INR"}]'::jsonb, 'self_claimed', 82, 4.5, 9, 195, true);

-- 6. Echo Anchors (Chennai - Anchors)
v_user_id := gen_random_uuid();
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'echo@eventlink.demo', crypt('demo1234', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Echo Anchors","role":"vendor"}', now(), now())
ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, role, full_name) VALUES (v_user_id, 'vendor', 'Meera Iyer') ON CONFLICT (id) DO UPDATE SET role='vendor', full_name='Meera Iyer';
INSERT INTO public.vendor_profiles (user_id, business_name, slug, primary_city, serviceable_cities, categories, bio, years_experience, team_size, packages, verification_status, profile_completion_score, average_rating, review_count, view_count, is_active)
VALUES (v_user_id, 'Echo Anchors', 'echo-anchors', 'Chennai', ARRAY['Chennai','Bangalore','Hyderabad'], ARRAY['Anchors'], 'Bilingual emcees for corporate, weddings and award nights. Fluent in English, Hindi & Tamil. High-energy hosts with strong stage presence.', 5, 6, '[{"title":"Full Day Emcee","price_min":25000,"price_max":75000,"currency":"INR"}]'::jsonb, 'self_claimed', 75, 4.8, 22, 410, true);

-- 7. Stellar Events (Jaipur - Event Management Agency)
v_user_id := gen_random_uuid();
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'stellar@eventlink.demo', crypt('demo1234', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Stellar Events","role":"vendor"}', now(), now())
ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, role, full_name) VALUES (v_user_id, 'vendor', 'Ishaan Kapoor') ON CONFLICT (id) DO UPDATE SET role='vendor', full_name='Ishaan Kapoor';
INSERT INTO public.vendor_profiles (user_id, business_name, slug, primary_city, serviceable_cities, categories, bio, years_experience, team_size, packages, verification_status, profile_completion_score, average_rating, review_count, view_count, is_active)
VALUES (v_user_id, 'Stellar Events', 'stellar-events', 'Jaipur', ARRAY['Jaipur','Delhi NCR','Ahmedabad'], ARRAY['Event Management Agency','Production'], 'End-to-end event management for destination weddings, brand experiences and large-scale corporate gatherings across North & West India.', 10, 25, '[{"title":"Destination Wedding Planning","price_min":200000,"price_max":800000,"currency":"INR"}]'::jsonb, 'self_claimed', 88, 4.7, 14, 620, true);

-- 8. Pixel Print Co (Ahmedabad - Printing)
v_user_id := gen_random_uuid();
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pixel@eventlink.demo', crypt('demo1234', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Pixel Print Co","role":"vendor"}', now(), now())
ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, role, full_name) VALUES (v_user_id, 'vendor', 'Neha Shah') ON CONFLICT (id) DO UPDATE SET role='vendor', full_name='Neha Shah';
INSERT INTO public.vendor_profiles (user_id, business_name, slug, primary_city, serviceable_cities, categories, bio, years_experience, team_size, packages, verification_status, profile_completion_score, average_rating, review_count, view_count, is_active)
VALUES (v_user_id, 'Pixel Print Co', 'pixel-print-co', 'Ahmedabad', ARRAY['Ahmedabad','Mumbai','Pune'], ARRAY['Printing'], 'Large-format printing, backdrops, stage branding, vinyl, fabric prints and installation. Fast turnaround for exhibitions & launches.', 12, 16, '[{"title":"Exhibition Branding Kit","price_min":35000,"price_max":150000,"currency":"INR"}]'::jsonb, 'self_claimed', 70, 4.4, 8, 156, true);

-- 9. Volt Power (Kolkata - Power Management)
v_user_id := gen_random_uuid();
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'volt@eventlink.demo', crypt('demo1234', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Volt Power","role":"vendor"}', now(), now())
ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, role, full_name) VALUES (v_user_id, 'vendor', 'Arjun Banerjee') ON CONFLICT (id) DO UPDATE SET role='vendor', full_name='Arjun Banerjee';
INSERT INTO public.vendor_profiles (user_id, business_name, slug, primary_city, serviceable_cities, categories, bio, years_experience, team_size, packages, verification_status, profile_completion_score, average_rating, review_count, view_count, is_active)
VALUES (v_user_id, 'Volt Power', 'volt-power', 'Kolkata', ARRAY['Kolkata','All India'], ARRAY['Power Management'], 'Silent generators, distribution boards, UPS and on-site power management for outdoor concerts, exhibitions and film shoots.', 15, 20, '[{"title":"Outdoor Event Power","price_min":45000,"price_max":200000,"currency":"INR"}]'::jsonb, 'self_claimed', 72, 4.6, 11, 230, true);

-- 10. Aura Security (Chandigarh - Security)
v_user_id := gen_random_uuid();
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'aura@eventlink.demo', crypt('demo1234', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Aura Security","role":"vendor"}', now(), now())
ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, role, full_name) VALUES (v_user_id, 'vendor', 'Siddharth Malhotra') ON CONFLICT (id) DO UPDATE SET role='vendor', full_name='Siddharth Malhotra';
INSERT INTO public.vendor_profiles (user_id, business_name, slug, primary_city, serviceable_cities, categories, bio, years_experience, team_size, packages, verification_status, profile_completion_score, average_rating, review_count, view_count, is_active)
VALUES (v_user_id, 'Aura Security', 'aura-security', 'Chandigarh', ARRAY['Chandigarh','Delhi NCR'], ARRAY['Security','Security Equipment'], 'Trained event security, crowd management, bag checks and equipment (HHMD, DFMD, CCTV). Corporate, concerts and private parties.', 8, 45, '[{"title":"Full Event Security Team","price_min":30000,"price_max":180000,"currency":"INR"}]'::jsonb, 'self_claimed', 76, 4.5, 7, 142, true);

END $$;
