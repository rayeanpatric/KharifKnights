/// <reference types="vite/client" />

declare module '*.onnx' {
  const path: string;
  export default path;
}

interface ImportMetaEnv {
  readonly VITE_GROQ_API_KEY: string;
  // Add other environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
