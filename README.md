# EcoSync

> Sistema de Mensajería de Error Asistida y Recuperación Guiada

Demo funcional de resiliencia de formularios ante interrupciones de red.

## Arquitectura

```
EcoSync/
├── index.html          # Landing page principal
├── pages/              # Páginas internas
│   ├── solucion.html   # Solución tecnológica
│   ├── green-it.html   # Calculadora Green IT
│   ├── precios.html    # Planes y precios
│   ├── dashboard.html  # Dashboard ejecutivo
│   ├── integracion.html# Centro de integración SDK
│   ├── historial.html  # Historial forense
│   └── terminal.html   # Terminal transaccional
├── css/
│   └── styles.css      # Hoja de estilos unificada
├── js/
│   ├── main.js         # Orquestador principal, Auth, Nav, Green IT
│   ├── terminal.js     # Formulario, autoguardado, simulación de conexión
│   ├── storage.js      # Utilidades LocalStorage
│   └── diagnostics.js  # Consola técnica (Ctrl+Shift+D)
├── assets/
│   ├── images/         # Imágenes
│   └── icons/          # Iconos SVG
└── README.md
```

## Tecnologías

- HTML5, CSS3, JavaScript vanilla
- LocalStorage para persistencia local
- Sin frameworks ni dependencias externas
- Google Fonts (Inter)

## Ejecución

Abre `index.html` directamente en un navegador moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).

## Páginas

| Página | Ruta | Descripción |
|--------|------|-------------|
| Landing | `index.html` | Hero, features, metrics, Green IT preview |
| Solución | `pages/solucion.html` | Arquitectura, pilares tecnológicos, specs |
| Green IT | `pages/green-it.html` | Calculadora de impacto ambiental, SCI |
| Precios | `pages/precios.html` | Planes Starter/Business/Enterprise, FAQ |
| Dashboard | `pages/dashboard.html` | KPIs ejecutivos, gráfico SVG, eventos |
| Integración | `pages/integracion.html` | SDK, snippets JS/Python/cURL, conectores |
| Historial | `pages/historial.html` | Tabla forense con trazas expandibles, export HAR |
| Terminal | `pages/terminal.html` | Formulario completo, autoguardado, simulación de red |

## Atajo de Teclado

| Atajo | Función |
|-------|---------|
| `Ctrl + Shift + D` | Abrir/cerrar consola técnica de diagnóstico |

## Módulos JavaScript

### `js/storage.js`
Utilidades para LocalStorage. Maneja drafts, usuario y logs con serialización JSON automática.

### `js/diagnostics.js`
Consola técnica deslizable. Log con tipos info/warn/error/success, sanitización de PII (email y RUT), exportación JSON.

### `js/terminal.js`
Motor del formulario de cotización: autoguardado cada 600ms, cálculos en tiempo real (IVA 19%, descuentos), simulación de caída/restauración de red, sincronización simulada.

### `js/main.js`
Orquestador principal: sistema de autenticación demo (2 usuarios predefinidos + registro), navegación activa, calculadora Green IT, bootstrap de todos los módulos.

## Namespace Global

```javascript
window.EcoSync = {
  storage:     { save, load, remove, saveDraft, loadDraft, clearDraft, ... },
  logger:      { init, log, clear, exportJSON, toggle },
  terminal:    { init, saveDraft, recoverDraft, clearForm, goOffline, goOnline, syncSimulate },
  auth:        { init, login, logout, showModal },
  greenIT:     { init, calculate },
  nav:         { init }
};
```

## Privacidad y Seguridad

- **Sin servidor real**: toda la sincronización es simulada localmente
- **PII sanitizado**: RUT y emails nunca aparecen en los logs de la consola
- **Token demo**: prefijo `ecosync_pub_demo_` — no autentica contra ningún servidor
- **LocalStorage only**: los datos nunca salen del navegador del usuario

## Aviso

Esta es una prueba de concepto académica. La sincronización es simulada — ningún dato es enviado a servidores externos.
