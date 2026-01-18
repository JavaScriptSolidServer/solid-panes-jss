/**
 * Lightweight MIME type lookup
 * Replaces the heavy mime-types package (146KB)
 */

const extToMime: Record<string, string> = {
  // Web documents
  html: 'text/html',
  htm: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  json: 'application/json',
  xml: 'text/xml',
  txt: 'text/plain',
  md: 'text/markdown',

  // RDF
  ttl: 'text/turtle',
  n3: 'text/n3',
  rdf: 'application/rdf+xml',
  jsonld: 'application/ld+json',

  // Images
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',

  // Media
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  webm: 'video/webm',

  // Documents
  pdf: 'application/pdf',
}

export function lookup (filename: string): string | false {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (!ext) return false
  return extToMime[ext] || false
}

export default { lookup }
