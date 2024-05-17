/// <reference types="astro/client" />

/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly NEYNAR_API_KEY: string;
    readonly OPENAI_API_KEY: string;
    // add other environment variables here if needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  