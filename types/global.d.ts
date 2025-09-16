declare module '*.json' {
  const value: any;
  export default value;
}

// Explicit module for generated atolls file path
declare module '@/data/generated/atolls.json' {
  const atolls: string[];
  export default atolls;
}
