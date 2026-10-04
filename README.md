# 🔬 Dokove Labs: Laboratorios de Fin de Etapa con Taxonomías Centralizadas

Bienvenido al repositorio abierto de **Laboratorios de Fin de Etapa (Capstone Projects)** de Dokove.

Los laboratorios son proyectos integrales de gran envergadura para evaluación técnica, arquitectura y maestría práctica de software. Cada laboratorio está tipificado y validado contra el registro canónico de **`@dokove/taxonomies`** (`scope: labs`).

---

## 📂 Estructura del Repositorio

```text
pub.labs/
├── README.md                      # Guía del repositorio y especificación
├── package.json                   # Metadatos del paquete @dokove/pub-labs
├── dist/                          # Artefactos compilados (dist/labs.json, index.js, index.d.ts)
├── scripts/
│   ├── build-labs-data.mjs        # Compila laboratorios con taxonomías resueltas
│   └── validate-taxonomies.mjs    # Valida conformidad con @dokove/taxonomies
└── labs/                          # Catálogo de laboratorios
    ├── motor-transacciones-event-sourcing/
    │   ├── lab.json               # Manifiesto completo (hitos, rúbricas, tech stack, taxonomía)
    │   └── README.md              # Especificación y guía técnica del proyecto
    ├── microfrontends-module-federation/
    ├── k8s-resilience-operator/
    ├── api-gateway-distributed-ratelimit/
    ├── lakehouse-realtime-streaming/
    └── saas-multitenant-billing/
```

---

## 🏷️ Integración con `@dokove/taxonomies`

Cada laboratorio declara en su archivo `lab.json`:
- **`category`**: Debe ser un ID válido en `@dokove/taxonomies` con `scope: labs` (ej. `labs.distributed-systems`, `labs.cloud-kubernetes`, `labs.frontend-architecture`).
- **`tags`**: Array de etiquetas canónicas (ej. `labs.kafka`, `labs.kubernetes`, `labs.redis`).

```json
{
  "id": "motor-transacciones-event-sourcing",
  "slug": "motor-transacciones-event-sourcing",
  "title": "Motor de Transacciones & Event Sourcing Distribuido",
  "category": "labs.distributed-systems",
  "tags": [
    "labs.kafka",
    "labs.event-sourcing",
    "labs.cqrs",
    "labs.redis",
    "labs.outbox-pattern"
  ]
}
```

---

## 🛠️ Comandos y Validación

```bash
# Validar laboratorios y taxonomías canónicas
npm run validate

# Compilar datasets y declaraciones tipadas
npm run build

# Ejecutar comprobaciones completas
npm test
```
