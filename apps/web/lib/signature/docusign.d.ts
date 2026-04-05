// Minimal ambient declaration for docusign-esign. The SDK ships no types; we
// only declare the surface we actually use, as `any`, so the rest of the
// codebase can stay strict.
declare module 'docusign-esign' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _default: any;
  export = _default;
}
