import { createClient } from
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'ضع_رابط_مشروعك';

const SUPABASE_ANON_KEY = 'ضع_المفتاح_العام_هنا';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);