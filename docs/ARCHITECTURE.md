# Arquitectura de @dokove/labs

Este documento describe la arquitectura de los proyectos de fin de etapa (*Capstone Labs*) y laboratorios de ingeniería de software avanzada en Dokove.

---

## 1. Filosofía y Propósito

El repositorio `pub.labs` aloja proyectos prácticos de gran envergadura (25h a 40h de dedicación) orientados a ingenieros Mid, Senior y Staff:

1. **Arquitectura Real de Producción**: No son ejercicios de juguete; abordan Event Sourcing, Outbox Pattern, Operadores Kubernetes, Module Federation y Pipelines Delta Lake.
2. **Hitos y Entregables Formales**: Cada laboratorio se descompone en 3 o 4 fases secuenciales (RFC de arquitectura, desarrollo del núcleo, resiliencia/caos y benchmarks).
3. **Rúbricas de Evaluación Ponderadas**: Cada laboratorio define una rúbrica objetiva con pesos porcentuales y criterios observables para los revisores.

---

## 2. Estructura de Directorios

```
pub.labs/
├── labs/
│   ├── motor-transacciones-event-sourcing/
│   │   ├── lab.json
│   │   └── README.md
│   ├── api-gateway-distributed-ratelimit/
│   ├── k8s-resilience-operator/
│   ├── lakehouse-realtime-streaming/
│   ├── microfrontends-module-federation/
│   └── saas-multitenant-billing/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── TAXONOMIES.md
│   └── STYLEGUIDE.md
├── scripts/
│   ├── build-labs-data.mjs
│   └── validate-taxonomies.mjs
├── preview/                            # Entorno interactivo Vite (puerto 3020)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.html
├── dist/
│   ├── labs.json
│   ├── index.js
│   └── index.d.ts
├── AGENTS.md
└── package.json
```
