declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL?: string;
      EXPO_PUBLIC_API_KEY?: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};