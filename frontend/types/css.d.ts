// Declaraciones de tipo para importaciones de CSS en Next.js
declare module '*.css' {
  const content: Record<string, string>
  export default content
}
