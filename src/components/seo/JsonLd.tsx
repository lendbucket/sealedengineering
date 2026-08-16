/**
 * Renders a JSON-LD graph. The string arrives already serialized from
 * lib/schema.ts, so nothing here interpolates user input into a script tag.
 */
export function JsonLd({ json }: { json: string }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own constants and page data, never from a
      // request. dangerouslySetInnerHTML is the only way to emit JSON-LD without
      // React escaping the quotes into entities, which breaks the parser.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
