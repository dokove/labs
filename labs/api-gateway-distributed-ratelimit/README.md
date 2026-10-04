# API Gateway Asíncrono con Rate Limiting y Tracing Distribuido

> **Laboratorio de Fin de Etapa (Capstone Project)**
> Categoría: `labs.backend-architecture`
> Dificultad: `Avanzado` | Horas estimadas: `25h`

## Descripción General
Implementación de un Gateway perimetral de servicios capaz de procesar miles de peticiones concurrentes por segundo, aplicando limitación de tasa multi-nivel (por IP, usuario y clave de API), balanceo dinámico y trazabilidad OpenTelemetry.

## Arquitectura y Alcance Técnico
El Gateway intercepta todas las solicitudes entrantes antes de enrutarlas a los microservicios aguas abajo. Las reglas de cuota se calculan de manera atómica mediante scripts Lua precompilados en Redis para evitar race conditions. Si un servicio dependiente comienza a fallar, el Circuit Breaker corta el tráfico para protegerlo de saturación.

## Requisitos No Funcionales
- Overhead añadido por el Gateway <= 3ms al p95.
- Soporte para 10,000 conexiones concurrentes sostenidas.
- Encabezados estándar IETF RateLimit (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset).
- Propagación estricta de encabezados W3C TraceContext (traceparent).

## Fases y Entregables
### Fase 1: Motor Reverse Proxy y Enrutamiento Dinámico
Implementación del proxy inverso con soporte HTTP/2, gestión de streaming de bodies sin buffering excesivo en memoria y enrutamiento por prefijos.

**Entregables Clave:**
- Enrutador dinámico configurable por archivo YAML o endpoint de control.
- Manejo de streaming seguro con contrapresión (backpressure).

### Fase 2: Algoritmos Atómicos de Rate Limiting en Lua
Escritura de scripts Lua atómicos en Redis para Sliding Window Log y Token Bucket con respuesta HTTP 429 Too Many Requests y cabeceras IETF.

**Entregables Clave:**
- Script Lua validado contra race conditions en Redis.
- Middleware de autenticación por API Key con caché local TTL breve.

### Fase 3: Circuit Breaker y Tracing OpenTelemetry
Integración del patrón Circuit Breaker con estados CLOSED, OPEN y HALF_OPEN, inyección de spans OTel y pruebas de carga.

**Entregables Clave:**
- Circuit Breaker con umbrales configurables de porcentaje de error.
- Exportación de trazas a Jaeger o OTLP Collector.
- Reporte de carga con k6 demostrando < 3ms de overhead.

