import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveResourceTaxonomy } from '@dokove/taxonomies';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const labsDir = path.join(rootDir, 'labs');
const distDir = path.join(rootDir, 'dist');

console.log(' Construyendo datos y artefactos de @dokove/pub-labs...\n');

if (!fs.existsSync(distDir)) {
 fs.mkdirSync(distDir, { recursive: true });
}

const labFolders = fs.readdirSync(labsDir, { withFileTypes: true })
 .filter(d => d.isDirectory())
 .map(d => d.name)
 .sort();

const compiledLabs = [];

for (const slug of labFolders) {
 const labJsonPath = path.join(labsDir, slug, 'lab.json');
 if (!fs.existsSync(labJsonPath)) continue;

 const lab = JSON.parse(fs.readFileSync(labJsonPath, 'utf8'));
 const resolvedTax = resolveResourceTaxonomy({
 category: lab.category,
 tags: lab.tags,
 }, `${slug}/lab.json`, 'labs');

 compiledLabs.push({
 ...lab,
 taxonomy: {
 categoryId: resolvedTax.categoryId,
 category: resolvedTax.category,
 categoryOrder: resolvedTax.categoryOrder,
 tagIds: resolvedTax.tagIds,
 tags: resolvedTax.tags,
 },
 });
}

// 1. Guardar labs.json
fs.writeFileSync(path.join(distDir, 'labs.json'), JSON.stringify(compiledLabs, null, 2) + '\n');

// 2. Guardar index.js
const indexJsContent = `import labsData from './labs.json' with { type: 'json' };

export const labs = labsData;

export function getLabBySlug(slug) {
 return labs.find(l => l.slug === slug) || null;
}

export function getLabById(id) {
 return labs.find(l => l.id === id) || null;
}

export function getLabsByCategory(categoryId) {
 return labs.filter(l => l.taxonomy.categoryId === categoryId);
}

export function getLabsByTag(tagId) {
 return labs.filter(l => l.taxonomy.tagIds.includes(tagId));
}

export default {
 labs,
 getLabBySlug,
 getLabById,
 getLabsByCategory,
 getLabsByTag,
};
`;

fs.writeFileSync(path.join(distDir, 'index.js'), indexJsContent);

// 3. Guardar index.d.ts
const indexDtsContent = `export interface LabTaxonomy {
 categoryId: string;
 category: string;
 categoryOrder: number;
 tagIds: string[];
 tags: string[];
}

export interface LabMilestone {
 id: string;
 order: number;
 title: string;
 description: string;
 keyDeliverables: string[];
 isCompleted: boolean;
 completedAt?: string;
}

export interface LabRubricCriterion {
 title: string;
 points: number;
 description: string;
}

export interface LabRubricCategory {
 id: string;
 name: string;
 weight: number;
 criteria: LabRubricCriterion[];
}

export interface LabSubmissionReview {
 reviewerName: string;
 reviewerRole: string;
 reviewedAt: string;
 score: number;
 summary: string;
 strengths: string[];
 improvements: string[];
}

export interface LabSubmission {
 id: string;
 labId: string;
 repositoryUrl: string;
 pullRequestUrl?: string;
 demoUrl?: string;
 notes: string;
 status: 'PENDING_REVIEW' | 'IN_REVIEW' | 'APPROVED' | 'CHANGES_REQUESTED';
 submittedAt: string;
 review?: LabSubmissionReview;
}

export interface LabTechItem {
 name: string;
 role: string;
 icon?: string;
}

export interface LabDetail {
 id: string;
 slug: string;
 title: string;
 shortDescription: string;
 description: string;
 category: string;
 tags: string[];
 track: string;
 difficulty: 'Intermedio' | 'Avanzado' | 'Experto / Staff';
 estimatedHours: number;
 recommendedWeeks: number;
 icon: string;
 badgeColor: string;
 prerequisites: string[];
 status: 'NOT_STARTED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'APPROVED';
 progressPercentage: number;
 completedMilestones: number;
 milestonesCount: number;
 githubTemplateUrl?: string;
 architectureOverview: string;
 nonFunctionalRequirements: string[];
 techStack: LabTechItem[];
 milestones: LabMilestone[];
 rubric: LabRubricCategory[];
 submissions: LabSubmission[];
 taxonomy: LabTaxonomy;
}

export declare const labs: readonly LabDetail[];
export declare function getLabBySlug(slug: string): LabDetail | null;
export declare function getLabById(id: string): LabDetail | null;
export declare function getLabsByCategory(categoryId: string): LabDetail[];
export declare function getLabsByTag(tagId: string): LabDetail[];

declare const _default: {
 labs: readonly LabDetail[];
 getLabBySlug: typeof getLabBySlug;
 getLabById: typeof getLabById;
 getLabsByCategory: typeof getLabsByCategory;
 getLabsByTag: typeof getLabsByTag;
};

export default _default;
`;

fs.writeFileSync(path.join(distDir, 'index.d.ts'), indexDtsContent);

console.log(`[OK] Build completado exitosamente: ${compiledLabs.length} laboratorios procesados en dist/.`);
