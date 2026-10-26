// Exporta una copia de siteData/main (Firestore) a data/sitedata-export.json.
// Uso puntual para migrar contenido a HTML fijo. Solo lectura.
import fs from 'node:fs';
const KEY = process.env.FIREBASE_API_KEY || 'AIzaSyAXO7GpF5cMkVBF_9QV8w7S-4MKzKD2rEI';
const url = `https://firestore.googleapis.com/v1/projects/maria-belen-prieto-web/databases/(default)/documents/siteData/main?key=${KEY}`;
const dec = (v) => v == null ? null
  : 'stringValue' in v ? v.stringValue : 'booleanValue' in v ? v.booleanValue
  : 'integerValue' in v ? Number(v.integerValue) : 'doubleValue' in v ? v.doubleValue
  : 'arrayValue' in v ? (v.arrayValue.values || []).map(dec)
  : 'mapValue' in v ? Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, dec(x)]))
  : 'timestampValue' in v ? v.timestampValue : null;
let doc;
try {
  const res = await fetch(url, { headers: { Referer: 'https://mariabelenprieto.com/' } });
  const body = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${body.slice(0, 800)}`);
  doc = JSON.parse(body);
} catch (e) {
  fs.writeFileSync('data/export-error.txt', String(e.stack || e) + '\n');
  console.error(e);
  process.exit(0);
}
const data = Object.fromEntries(Object.entries(doc.fields || {}).map(([k, v]) => [k, dec(v)]));
// Solo contenido público de la web; nada de datos personales de pacientes vive aquí.
fs.writeFileSync('data/sitedata-export.json', JSON.stringify(data, null, 2) + '\n');
console.log('Secciones exportadas:', Object.keys(data).join(', '));
console.log('Áreas:', (data.areas || []).length);
