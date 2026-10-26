import type { ContactData } from './schema';

/**
 * Proveedor de envío intercambiable. La web es estática: si `PUBLIC_CONTACT_ENDPOINT` está definido,
 * se envía allí (JSON); si no, modo simulado (no sale ningún dato del navegador). DECISIONES.md.
 */
export async function sendContact(data: ContactData): Promise<void> {
  const endpoint = import.meta.env.PUBLIC_CONTACT_ENDPOINT as string | undefined;
  if (!endpoint) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return;
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`contact: ${res.status}`);
}
