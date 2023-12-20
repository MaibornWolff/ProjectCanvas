export function getImportMetaEnv() {
  // Import meta has its own function to allow testing components using the import meta, as it may not be available in
  // test environments and should be mocked anyway.
  return import.meta.env
}