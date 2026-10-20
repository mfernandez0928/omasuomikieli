/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL, e.g. https://abcdefgh.supabase.co. Optional. */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon key. Public by design; the table's RLS is what protects it. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
