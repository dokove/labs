# Operador Kubernetes Cloud-Native & Auto-Healing de Cargas Críticas

> **Laboratorio de Fin de Etapa (Capstone Project)**
> Categoría: `labs.cloud-kubernetes`
> Dificultad: `Experto / Staff` | Horas estimadas: `40h`

## Descripción General
Creación de un Operador Kubernetes personalizado en Go para gestionar el ciclo de vida de microservicios con requisitos estrictos de alta disponibilidad, failover automático entre zonas de disponibilidad y observabilidad nativa.

## Arquitectura y Alcance Técnico
El operador introduce la Custom Resource Definition (CRD) "ResilientService" que unifica Deployment, Service, HPA, NetworkPolicy y PodDisruptionBudget bajo una única política de resiliencia. El reconciliador de Go supervisa la salud de los pods y ejecuta drenados predictivos cuando los nodos experimentan degradación térmica o latencia excesiva.

## Requisitos No Funcionales
- Tiempo de reconciliación promedio < 150ms tras un cambio en la especificación CRD.
- Cero pérdida de paquetes durante el drenado de réplicas en actualizaciones rolling.
- Soporte multi-arquitectura (amd64 y arm64).
- Métricas Prometheus expuestas en el endpoint /metrics del controller-manager.

## Fases y Entregables
### Fase 1: Definición de la CRD y Validating Webhook
Modelado del esquema OpenAPI v3 de ResilientService con validaciones de rangos y Admission Webhook de validación en tiempo de admisión.

**Entregables Clave:**
- CRD manifest YAML generado con controller-gen.
- Webhook de validación con TLS auto-generado.

### Fase 2: Controller Reconcile Loop & Idempotencia
Bucle de reconciliación idempotente con gestión de OwnerReferences para garbage collection automática de recursos hijos.

**Entregables Clave:**
- Reconciliador en Go gestionando Deployments, PDBs y Services.
- Tests unitarios de controlador con envtest de Kubernetes.

### Fase 3: Auto-Healing & Status Subresource
Detección proactiva de pods no saludables y actualización del subrecurso Status con condiciones estándar de Kubernetes.

**Entregables Clave:**
- Gestión de Status.Conditions según las guías oficiales de Kubernetes API.
- Lógica de auto-healing y drenado ordenado.

### Fase 4: Helm Chart, Pruebas de Caos y Despliegue
Empaquetado en Helm Chart con RBAC de mínimo privilegio y verificación con Chaos Mesh en clúster local Kind/K3s.

**Entregables Clave:**
- Helm Chart con valores configurables de producción.
- Reporte de pruebas de caos verificando recuperación automática.

