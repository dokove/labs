# Plataforma Enterprise Microfrontends con Module Federation y SSR

> **Laboratorio de Fin de Etapa (Capstone Project)**
> Categoría: `labs.frontend-architecture`
> Dificultad: `Avanzado` | Horas estimadas: `28h`

## Descripción General
Construcción de un ecosistema empresarial multi-equipo compuesto por un App Shell Next.js con SSR y micro-apps federadas independientes (Catálogo, Checkout, Panel de Cuenta) desplegables de forma no bloqueante.

## Arquitectura y Alcance Técnico
El proyecto resuelve el problema del desacoplamiento de equipos en grandes organizaciones frontend. El Host (App Shell) gestiona la autenticación global, navegación, layouts y telemetría de Core Web Vitals, mientras que las micro-apps federadas se cargan bajo demanda con fallback de resiliencia ante caídas de red de un remoto.

## Requisitos No Funcionales
- Largest Contentful Paint (LCP) <= 1.8s en conexiones 4G estándar.
- Aislamiento estricto de estilos CSS para evitar contaminación cruzada entre micro-apps.
- Degradación elegante: si un remoto federado falla, el resto de la aplicación opera con un widget de error aislado.
- Compartición eficiente de dependencias singleton (React, React-DOM, UI tokens) sin duplicar bundles en memoria.

## Fases y Entregables
### Fase 1: Configuración del Host y Shared Dependencies Matrix
Configuración del App Shell con soporte SSR para módulos federados remotos y configuración de dependencias singleton para evitar descargas duplicadas.

**Entregables Clave:**
- Webpack / Rspack config con module federation manifest.
- Matriz de dependencias compartidas documentada y verificada en bundle analyzer.

### Fase 2: Remotos Autónomos (Catalog & Checkout)
Desarrollo de las aplicaciones remotas con sus propios pipelines CI/CD y despliegue independiente con versionado semántico.

**Entregables Clave:**
- Dos aplicaciones remotas compilando sus manifests remoteEntry.js.
- Manejo de rutas internas anidadas sin conflictos en el browser history.

### Fase 3: Contratos de Comunicación & EventBus Type-Safe
Canal de comunicación entre micro-apps para eventos de carrito, autenticación y notificaciones con contratos TypeScript compartidos.

**Entregables Clave:**
- Paquete npm interno con tipos de eventos compartidos.
- Error Boundaries granulares por cada módulo remoto federado.

### Fase 4: Auditoría Web Vitals y Pipeline de Release
Pruebas E2E de navegación cruzada con Playwright y validación de Core Web Vitals en Lighthouse CI.

**Entregables Clave:**
- Puntuación Lighthouse Performance > 90 en todas las vistas integradas.
- Tests E2E simulando fallo de carga de un remoto con fallback visible.

