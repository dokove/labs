import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveResourceTaxonomy } from '@dokove/taxonomies';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const labsDir = path.join(rootDir, 'labs');

console.log('🔍 Validando laboratorios de fin de etapa y taxonomías en pub.labs...\n');

if (!fs.existsSync(labsDir)) {
  console.error('❌ Directorio labs no encontrado:', labsDir);
  process.exit(1);
}

const labFolders = fs.readdirSync(labsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

let totalLabs = 0;
let hasErrors = false;

for (const slug of labFolders) {
  const labJsonPath = path.join(labsDir, slug, 'lab.json');
  if (!fs.existsSync(labJsonPath)) {
    console.error(`❌ Falta lab.json en: ${slug}`);
    hasErrors = true;
    continue;
  }

  let lab;
  try {
    lab = JSON.parse(fs.readFileSync(labJsonPath, 'utf8'));
    if (!lab.title || !lab.slug || !lab.milestones) {
      throw new Error('Faltan campos obligatorios en lab.json (title, slug, milestones)');
    }
  } catch (err) {
    console.error(`❌ Error en lab.json de ${slug}:`, err.message);
    hasErrors = true;
    continue;
  }

  try {
    const resolvedTaxonomy = resolveResourceTaxonomy({
      category: lab.category,
      tags: lab.tags,
    }, `${slug}/lab.json`, 'labs');

    totalLabs++;
    console.log(`🔬 Lab: [${slug}] ${lab.title}`);
    console.log(`   🏷️  Categoría: ${resolvedTaxonomy.category} (${resolvedTaxonomy.categoryId})`);
    console.log(`   🔖 Tags: [${resolvedTaxonomy.tags.join(', ')}]`);
    console.log(`   📌 Fases/Hitos: ${lab.milestones.length} | Horas estimadas: ${lab.estimatedHours}h\n`);
  } catch (err) {
    console.error(`❌ Error de taxonomía en ${slug}:`, err.message);
    hasErrors = true;
  }
}

console.log('-----------------------------------------------------------');
if (hasErrors) {
  console.error('❌ Se encontraron errores de validación en los laboratorios.');
  process.exit(1);
} else {
  console.log(`✅ Validación exitosa: ${totalLabs} laboratorios conformes con @dokove/taxonomies (scope: labs).`);
}
