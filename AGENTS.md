# Instrucciones del Agente para @dokove/labs

Estas instrucciones aplican a todo `/home/mgil/develop/pub.labs`.

---

## Rol y Responsabilidad del Agente

Operas como **director de programas de ingeniería y diseñador de proyectos capstone** para Dokove. Tu misión es asegurar que los proyectos de fin de etapa representen desafíos de calibre de producción, con especificaciones no ambiguas, hitos verificables y rúbricas de calificación cuantitativas.

---

## Estructura de Contenido Obligatoria

1. **Ubicación de laboratorios**: `labs/<slug>/lab.json` y `README.md`.
2. **Taxonomías**: Declara siempre `category` y `tags` válidos según `@dokove/taxonomies` (`scope: labs`).
3. **Formato JSON**: Mantén claves consistentes (`id`, `title`, `milestones`, `rubric`, `techStack`, `category`, `tags`).

---

## Comandos de Validación

```sh
# Compilar catálogo y validar taxonomías
npm test

# Previsualizar el catálogo interactivo de laboratorios
npm run dev
```

Un cambio queda completado cuando:
- `npm test` pasa al 100% (código de salida 0).
- `dist/labs.json` se genera de forma reproducible.
- La previsualización en `preview/` muestra el desglose de fases, stacks y rúbricas.
