# Pipeline de Streaming Analítico en Tiempo Real con Delta Lake y PySpark

> **Laboratorio de Fin de Etapa (Capstone Project)**
> Categoría: `labs.data-engineering`
> Dificultad: `Experto / Staff` | Horas estimadas: `32h`

## Descripción General
Desarrollo de un pipeline end-to-end de datos con arquitectura Medallion (Bronze, Silver, Gold), deduplicación de streams en ventana de agua (watermarking), control de esquema (schema enforcement) y pruebas de calidad de datos.

## Arquitectura y Alcance Técnico
El pipeline consume telemetría de dispositivos IoT y eventos de usuario en Kafka, los almacena en capa Bronze con formato Delta Lake crudo, ejecuta transformaciones y validación de calidad en capa Silver aplicando deduplicación y reglas de negocio, y finalmente agrega métricas en tiempo real en la capa Gold para analítica de negocio.

## Requisitos No Funcionales
- Garantía de procesamiento End-to-End Exactly-Once utilizando checkpoints de Spark y transacciones ACID de Delta.
- Soporte para eventos tardíos (late-arriving data) de hasta 15 minutos mediante watermarking.
- Rechazo automático de datos corruptos con desvío a tabla Dead Letter Queue (DLQ).

## Fases y Entregables
### Fase 1: Capa Bronze & Ingestión Cruda Streaming
Consumo continuo desde Kafka y escritura append-only en tablas Delta Bronze con metadatos de ingestión (timestamp, offset, partición).

**Entregables Clave:**
- Job PySpark Structured Streaming con Checkpointing persistente.
- Particionado temporal por fecha de ingestión.

### Fase 2: Capa Silver & Deduplicación con Watermark
Limpieza de esquemas, desenrollado de payloads JSON, deduplicación de IDs con watermarking de 15 minutos y enrutamiento a DLQ.

**Entregables Clave:**
- Transformación Silver con manejo de tipos nulos y saneamiento.
- Manejo de DLQ para registros que no cumplen el contrato de esquema.

### Fase 3: Capa Gold & Agregaciones Temporales
Construcción de tablas agregadas Gold con ventanas deslizantes de 5 minutos, optimización con Z-Order y suite de tests Great Expectations.

**Entregables Clave:**
- Vistas Gold optimizadas para consultas BI de baja latencia.
- Suite de calidad Great Expectations ejecutada en cada micro-batch.

