# Motor de Transacciones & Event Sourcing Distribuido

> **Laboratorio de Fin de Etapa (Capstone Project)**
> Categoría: `labs.distributed-systems`
> Dificultad: `Experto / Staff` | Horas estimadas: `35h`

## Descripción General
Diseño e implementación de un motor bancario y de liquidación transaccional con arquitectura hexagonal, garantía Exactly-Once en deduplicación de eventos, consistencia eventual y snapshots en Redis.

## Arquitectura y Alcance Técnico
Este laboratorio final evalúa la capacidad de construir un sistema de alta concurrencia con tolerancia a particiones de red. El núcleo utiliza Event Sourcing donde el estado actual de las cuentas se proyecta a partir de un log inmutable de eventos de débito y crédito. El Transaction Coordinator garantiza idempotencia mediante claves de reconciliación y un Outbox Worker asíncrono.

## Requisitos No Funcionales
- Throughput sostenido >= 4,500 transacciones/segundo por nodo.
- Latencia p99 en operaciones de saldo <= 25ms.
- Idempotencia estricta: transacciones duplicadas deben retornar el mismo resultado sin doble cargo.
- Recuperación automática de réplicas de lectura ante desconexiones de red.

## Fases y Entregables
### Fase 1: RFC Técnico y Modelado Hexagonal de Dominio
Redacción del RFC de arquitectura, delimitación de agregados DDD (Account, LedgerEntry, Transaction) y pruebas unitarias puras del dominio sin dependencias de infraestructura.

**Entregables Clave:**
- RFC en Markdown con diagramas de secuencia Mermaid.
- Modelos de dominio inmutables y eventos versionados (v1, v2).
- Cobertura unitaria del 100% sobre las reglas de balance contable.

### Fase 2: Transactional Outbox & Broker Ingestion
Implementación del patrón Transactional Outbox en PostgreSQL para evitar Dual-Write Hazards y pipeline de publicación fiable hacia Kafka con serialización Protobuf.

**Entregables Clave:**
- Worker de Outbox con sondeo eficiente y bloqueo de filas SKIP LOCKED.
- Productor Kafka con reintentos exponenciales y clave de partición por AccountID.
- Tests de integración con Testcontainers.

### Fase 3: Proyección CQRS & Snapshots en Redis
Construcción de los consumidores de eventos para alimentar vistas materializadas de lectura en Redis con soporte para replay de eventos históricos y snapshots periódicos cada 500 eventos.

**Entregables Clave:**
- Consumer Group escalable horizontalmente con gestión manual de offsets.
- Mecanismo de Snapshot en Redis con TTL y reconciliación reactiva.
- API de lectura de saldos e historial auditado con tiempo de respuesta < 20ms.

### Fase 4: Caos Engineering, Benchmarks y Entrega Final
Inyección de fallos de red con Toxiproxy durante ráfagas de 5,000 req/s, verificación de consistencia matemática entre Ledger y Vistas y preparación del repositorio para revisión.

**Entregables Clave:**
- Suite de pruebas de carga con k6 y reporte de latencias p95/p99.
- Prueba de caos documentada demostrando cero discrepancias de saldo.
- Pull Request final con pipeline CI/CD de GitHub Actions / GitLab CI.

