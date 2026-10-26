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
const res = await fetch(url, { headers: { Referer: 'https://mariabelenprieto.com/' } });
if (!res.ok) { console.error(res.status, await res.text()); process.exit(1); }
const doc = await res.json();
const data = Object.fromEntries(Object.entries(doc.fields || {}).map(([k, v]) => [k, dec(v)]));
// Solo contenido público de la web; nada de datos personales de pacientes vive aquí.
fs.writeFileSync('data/sitedata-export.json', JSON.stringify(data, null, 2) + '\n');
console.log('Secciones exportadas:', Object.keys(data).join(', '));
console.log('Áreas:', (data.areas || []).length);
