import React, { useState, useEffect, useMemo } from 'react';
import { LabWorkspace, type LabDetail, type LabSummary } from 'dokove-labs';
import 'dokove-ui/styles.css';
import { CatalogFilterBar, type SelectOption } from 'dokove-ui';
import {
  WrenchIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SunIcon,
  MoonIcon,
  CoffeeIcon,
  SearchIcon,
  FlameIcon,
  ZapIcon,
  StarIcon,
  ClockIcon,
  LayersIcon,
  CloudIcon,
  ServerIcon,
  ActivityIcon,
  BuildingIcon,
  CheckCircleIcon,
} from 'dokove-icons';
import labsData from '../dist/labs.json';
import 'dokove-labs/styles.css';

type ThemeMode = 'dark' | 'light' | 'sepia';

function getTrackIcon(track: string) {
  switch (track) {
    case 'Distributed Systems':
      return <ZapIcon className="w-4 h-4 text-indigo-500" />;
    case 'Frontend & Architecture':
      return <LayersIcon className="w-4 h-4 text-indigo-500" />;
    case 'Cloud & Kubernetes':
      return <CloudIcon className="w-4 h-4 text-indigo-500" />;
    case 'Backend & Systems':
      return <ServerIcon className="w-4 h-4 text-indigo-500" />;
    case 'Data & ML Engineering':
      return <ActivityIcon className="w-4 h-4 text-indigo-500" />;
    case 'Fullstack Enterprise':
    default:
      return <BuildingIcon className="w-4 h-4 text-indigo-500" />;
  }
}

function getStatusBadge(status: string, percentage: number) {
  switch (status) {
    case 'APPROVED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Aprobado
        </span>
      );
    case 'IN_REVIEW':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          En Revisión
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          Progreso ({percentage}%)
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Disponible
        </span>
      );
  }
}

export default function App() {
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Sincronización del tema en el elemento raíz HTML
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'sepia-theme');
    document.documentElement.removeAttribute('data-theme');

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'sepia') {
      document.documentElement.classList.add('sepia-theme');
      document.documentElement.setAttribute('data-theme', 'sepia');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  const selectedLab = labsData.find((l) => l.id === selectedLabId) as LabDetail | undefined;

  // Lista única de tracks
  const availableTracks = useMemo(() => {
    return Array.from(new Set(labsData.map((l) => l.track))).sort();
  }, []);

  // Lista única de tags
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    labsData.forEach((l) => {
      (l.tags || []).forEach((t: string) => {
        set.add(t.replace(/^labs\./, ''));
      });
    });
    return Array.from(set).sort();
  }, []);

  const trackOptions: SelectOption[] = useMemo(() => [
    { value: 'all', label: 'Todas las especialidades' },
    ...availableTracks.map((tr) => ({ value: tr, label: tr })),
  ], [availableTracks]);

  const difficultyOptions: SelectOption[] = useMemo(() => [
    { value: 'all', label: 'Todas las dificultades' },
    { value: 'Intermedio', label: 'Intermedio' },
    { value: 'Avanzado', label: 'Avanzado' },
    { value: 'Experto / Staff', label: 'Experto / Staff' },
  ], []);

  const tagOptions: SelectOption[] = useMemo(() => [
    ...availableTags.map((tag) => ({ value: tag, label: `#${tag}` })),
  ], [availableTags]);

  // Filtrado reactivo de laboratorios
  const filteredLabs = useMemo(() => {
    return (labsData as LabSummary[]).filter((l) => {
      const cleanTags = (l.tags || []).map((t: string) => t.replace(/^labs\./, ''));
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = l.title.toLowerCase().includes(q);
        const matchDesc = (l.shortDescription || l.description || '').toLowerCase().includes(q);
        const matchTags = cleanTags.some((t: string) => t.toLowerCase().includes(q));
        const matchTrack = l.track.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchTags && !matchTrack) return false;
      }
      if (selectedTrack !== 'all' && l.track !== selectedTrack) return false;
      if (selectedDifficulty !== 'all' && l.difficulty !== selectedDifficulty) return false;
      if (selectedTags.length > 0 && !selectedTags.some((t: string) => cleanTags.includes(t))) return false;
      return true;
    });
  }, [searchQuery, selectedTrack, selectedDifficulty, selectedTags]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      {/* Top Navbar unificada con Selector de Tema */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedLabId(null)}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform inline-flex items-center justify-center">
                <WrenchIcon className="w-5 h-5" />
              </span>
              <div>
                <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Dokove Labs
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
                    pub.labs
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block -mt-0.5">
                  Proyectos de ingeniería de producción con rúbricas y milestones
                </span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {selectedLab && (
              <button
                type="button"
                onClick={() => setSelectedLabId(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors cursor-pointer"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5" />
                <span>Volver al Catálogo</span>
              </button>
            )}

            {/* Selector de Tema: Light, Dark, Sepia */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                title="Modo Claro"
                aria-label="Modo Claro"
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg text-xs transition-colors inline-flex items-center justify-center cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-amber-600 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <SunIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Modo Oscuro"
                aria-label="Modo Oscuro"
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg text-xs transition-colors inline-flex items-center justify-center cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-indigo-400 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <MoonIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Modo Sepia"
                aria-label="Modo Sepia"
                onClick={() => setTheme('sepia')}
                className={`p-1.5 rounded-lg text-xs transition-colors inline-flex items-center justify-center cursor-pointer ${
                  theme === 'sepia'
                    ? 'bg-amber-100 text-amber-800 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <CoffeeIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1">
        {selectedLab ? (
          <LabWorkspace
            lab={selectedLab}
            onBack={() => setSelectedLabId(null)}
            onToggleMilestone={(milestoneId, completed) => {
              console.log(`Milestone ${milestoneId} toggled: ${completed}`);
            }}
            onSubmitForReview={(sub) => {
              alert(`Entrega enviada para revisión: ${sub.repositoryUrl}`);
            }}
          />
        ) : (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header Compacto con Badges y Métricas */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/60">
                    Ingeniería & Arquitectura
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    Catálogo por Cards
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Catálogo de Laboratorios de Ingeniería
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-0.5">
                  Proyectos a gran escala con arquitectura de producción, rúbricas de staff y entregables técnicos verificables.
                </p>
              </div>

              {/* Badges de Gamificación */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                  <FlameIcon className="w-3.5 h-3.5 text-amber-500" />
                  <span>4 Días Racha</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                  <ZapIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>305 XP</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <StarIcon className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Nivel 3</span>
                </div>
              </div>
            </div>

            {/* Fila Armoniosa de Filtros Unificados con react-select */}
            <CatalogFilterBar
              theme={theme}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Buscar en taxonomías: conceptos, temas, tracks..."
              categoryLabel="Especialidad"
              selectedCategory={selectedTrack}
              categoryOptions={trackOptions}
              onCategoryChange={setSelectedTrack}
              secondaryLabel="Dificultad"
              selectedSecondary={selectedDifficulty}
              secondaryOptions={difficultyOptions}
              onSecondaryChange={setSelectedDifficulty}
              tagLabel="Etiquetas"
              selectedTags={selectedTags}
              tagOptions={tagOptions}
              onTagsChange={setSelectedTags}
              totalFiltered={filteredLabs.length}
              itemNounSingle="laboratorio"
              itemNounPlural="laboratorios"
              onClearFilters={() => {
                setSelectedTrack('all');
                setSelectedDifficulty('all');
                setSelectedTags([]);
                setSearchQuery('');
              }}
            />

            {/* Título de Sección con Contador */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Laboratorios Disponibles
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800/60">
                  {filteredLabs.length}
                </span>
              </div>
            </div>

            {/* Grid de Cards */}
            {filteredLabs.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <SearchIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No se encontraron laboratorios
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Intenta cambiar los filtros de búsqueda, especialidad o dificultad.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLabs.map((lab) => {
                  const cleanTags = (lab.tags || []).map((t: string) => t.replace(/^labs\./, ''));
                  return (
                    <div
                      key={lab.id}
                      onClick={() => setSelectedLabId(lab.id)}
                      className="group relative rounded-lg p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 flex flex-col justify-between cursor-pointer hover:shadow-md"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                            {getTrackIcon(lab.track)}
                            <span>{lab.track}</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {lab.difficulty}
                            </span>
                            {getStatusBadge(lab.status, lab.progressPercentage)}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {lab.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5">
                            {lab.shortDescription || lab.description}
                          </p>
                        </div>

                        {/* Progreso de hitos */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            <span>Hitos de revisión final</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {lab.completedMilestones} de {lab.milestonesCount} ({lab.progressPercentage}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all"
                              style={{ width: `${lab.progressPercentage}%` }}
                            />
                          </div>
                        </div>

                        {cleanTags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {cleanTags.slice(0, 3).map((tag: string) => (
                              <span
                                key={tag}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2.5 font-medium text-[11px]">
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                            {lab.estimatedHours}h ({lab.recommendedWeeks} sem)
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                            <ZapIcon className="w-3.5 h-3.5" />
                            +250 XP
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform text-xs">
                          Abrir Laboratorio
                          <ArrowRightIcon className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
