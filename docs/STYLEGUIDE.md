# Guía de Estilo y Autoría de Laboratorios en @dokove/labs

Este documento describe las pautas para diseñar proyectos de fin de etapa (*Capstone Labs*).

---

## 1. Estructura de `lab.json`

Cada laboratorio debe contener:

- `id`: Slug identificador unívoco.
- `title`: Nombre formal del proyecto.
- `shortDescription`: Resumen de una línea para tarjetas del catálogo.
- `description`: Visión técnica completa.
- `difficulty`: Nivel de seniority (ej. "Senior", "Experto / Staff").
- `estimatedHours`: Carga estimada (20h - 50h).
- `techStack`: Lista de tecnologías y su rol funcional en el proyecto.
- `milestones`: Desglose por fases con entregables verificables (`keyDeliverables`).
- `rubric`: Criterios con pesos porcentuales (`weight`).
- `category` y `tags`: Identificadores válidos de `@dokove/taxonomies` (`scope: labs`).

---

## 2. Criterios de Aceptación

1. **Plantilla de Repositorio**: Debe existir una plantilla base con Docker Compose o Dev Container funcional.
2. **Pruebas de Carga y Resiliencia**: Los proyectos de sistemas distribuidos deben incluir pruebas con Toxiproxy o k6.
3. **Claridad de Entregables**: Cada hito debe especificar exactamente qué Pull Request o RFC debe presentar el alumno.
