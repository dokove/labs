# Plataforma Fullstack SaaS Multi-Tenant con Facturación Idempotente

> **Laboratorio de Fin de Etapa (Capstone Project)**
> Categoría: `labs.fullstack-enterprise`
> Dificultad: `Avanzado` | Horas estimadas: `30h`

## Descripción General
Desarrollo de una solución completa de plataforma multi-tenant con separación de datos (schema-per-tenant y row-level security), suscripciones recurrentes con reconciliación de eventos de pago y registro inmutable de auditoría.

## Arquitectura y Alcance Técnico
La arquitectura garantiza aislamiento criptográfico y lógico de cada cliente empresarial. Las consultas a base de datos aplican Row Level Security (RLS) condicionadas al TenantID del token JWT verificado. Los webhooks de facturación se registran en una tabla de idempotencia para prevenir suscripciones duplicadas ante reintentos de red.

## Requisitos No Funcionales
- Garantía total de cero fuga de datos entre empresas (Zero Data Leakage guarantee).
- Idempotencia estricta en el procesamiento de eventos de cobro de Stripe.
- Log de auditoría append-only para operaciones críticas de administración.
- Soporte para dominios personalizados (custom domains) y subdominios por tenant.

## Fases y Entregables
### Fase 1: Tenant Resolution & Row-Level Security
Detección automática del tenant mediante subdominio o header, establecimiento del contexto de sesión en la conexión PostgreSQL y políticas RLS activas.

**Entregables Clave:**
- Middleware de resolución de inquilino (subdominio.dokove.com).
- Políticas PostgreSQL RLS verificadas con tests automatizados.

### Fase 2: Motor de Facturación Idempotente con Stripe
Gestión de planes de suscripción, portal de cliente para auto-gestión de facturación y webhook handler protegido con verificación de firma e idempotencia.

**Entregables Clave:**
- Manejo de eventos invoice.paid, customer.subscription.updated y deleted.
- Tabla de idempotencia que previene reprocesamiento de eventos pasados.

### Fase 3: Auditoría Inmutable y Panel de Administración
Registro de auditoría forense append-only para acciones sensibles (cambio de roles, invitaciones, modificación de planes) y panel de supervisión.

**Entregables Clave:**
- Tabla de auditoría con actor, acción, diff de cambios e IP de origen.
- Suite E2E con Playwright validando flujo completo de suscripción y aislamiento.

