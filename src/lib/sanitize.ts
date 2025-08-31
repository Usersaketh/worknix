// Basic client-side sanitization to strip potentially dangerous HTML.
// This is a defensive layer; server-side sanitization is still recommended.
export function sanitize(input: string): string {
  if (!input) return '';
  // Remove script/style tags and their content
  let out = input.replace(/<\/(script|style)>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');
  // Remove event handler attributes (on*) and javascript: urls
  out = out.replace(/ on[a-z]+="[^"]*"/gi, '')
           .replace(/ on[a-z]+='[^']*'/gi, '')
           .replace(/javascript:/gi, '');
  // Allow only a safe subset of tags; strip others.
  const allowed = ['b','strong','i','em','u','p','br','ul','ol','li'];
  out = out.replace(/<([^>]+)>/g, (match, tag) => {
    const name = tag.split(/\s+/)[0].toLowerCase();
    if (allowed.includes(name) || (name.startsWith('/') && allowed.includes(name.slice(1)))) return match; 
    return '';
  });
  return out;
}
