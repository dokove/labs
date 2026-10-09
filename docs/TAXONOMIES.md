# Taxonomías de @dokove/labs

Este documento define la relación ontológica de los laboratorios de `pub.labs` con el paquete canónico `@dokove/taxonomies`.

---

## 1. Categorías del Ámbito `labs`

| Categoría ID | Etiqueta | Descripción |
| :--- | :--- | :--- |
| `labs.distributed-systems` | Distributed Systems | Event Sourcing, CQRS, Outbox Pattern, Apache Kafka y consistencia eventual. |
| `labs.backend-architecture` | Backend & Systems | API Gateways, Rate Limiting distribuido, tracing OpenTelemetry y gRPC. |
| `labs.cloud-kubernetes` | Cloud & Kubernetes | Operadores Custom Resource Definition (CRD), Auto-Healing e infraestructura inmutable. |
| `labs.data-engineering` | Data & ML Engineering | Streaming analítico, Delta Lake, PySpark y lakehouses en tiempo real. |
| `labs.frontend-architecture` | Frontend & Architecture | Microfrontends enterprise, Webpack Module Federation y SSR distribuido. |
| `labs.fullstack-enterprise` | Fullstack Enterprise | SaaS multi-tenant con esquemas aislados y facturación idempotente. |

---

## 2. Validación de Conformidad

Ejecuta el chequeo taxonómico con:

```sh
npm run validate:taxonomies
```
