# EcoSync

Plataforma SaaS B2B de resiliencia digital, continuidad operativa y eficiencia energética (Green IT) para aplicaciones corporativas y sistemas ERP/CRM.

---

## Propósito y Alcance
EcoSync es una solución de arquitectura resiliente en el cliente (Edge Resilience) diseñada para proteger la captura de datos críticos frente a cortes de red o caídas de sesión, reducir la carga de peticiones innecesarias a servidores corporativos y proyectar el ahorro de huella de carbono digital (Scope 2 y Scope 3).

---

## Estructura del Proyecto
* **`index.html`**: Estructura semántica completa de la plataforma con navegación entre vistas (Inicio, Solución Tecnológica, Impacto Green IT, Planes y Precios, y Terminal Transaccional).
* **`styles.css`**: Sistema de diseño moderno SaaS B2B con la paleta corporativa oficial, componentes responsivos y estados visuales de contingencia.
* **`script.js`**: Lógica de interacción en JavaScript vanilla, persistencia en LocalStorage con autoguardado, simulación de contingencias, cálculos financieros/ESG y consola de diagnóstico.

---

## Funcionalidades Principales

### 1. Terminal Transaccional y Recuperación Guiada
* Formulario corporativo de cotización (RUT, Razón social, Contacto, Correo, Servicio, Cantidad, Precio, Descuento, IVA 19% y Total automático).
* Autoguardado con retardo (debounce) en `LocalStorage` e indicadores visuales de estado y marca temporal.
* Mecanismo de recuperación de borradores con validación y confirmación.
* Simulación controlada de caída y restauración de conectividad de red.
* Sincronización simulada con validación de estado de contingencia.

### 2. Dashboard de Demostración con Métricas en Vivo
* Indicador de estado de conexión (En línea / Contingencia).
* Estado del formulario (Sin cambios / Borrador guardado / Editando).
* Marca temporal del último autoguardado.
* Contador de intentos de sincronización y eventos de contingencia detectados.

### 3. Consola Técnica de Diagnóstico Oculta
* Apertura mediante el atajo de teclado **`Ctrl + Shift + D`** o botón de acceso directo en pantalla.
* Registro cronológico de eventos operativos (sin datos personales sensibles).
* Descarga del historial en formato `.json` y botón de limpieza de registros.

### 4. Calculadora Dinámica Green IT & Impacto ESG
* Estimación en tiempo real de solicitudes evitadas, ahorro de energía (kWh/año), reducción de toneladas de CO2e, árboles equivalentes y ahorro económico en nube.

### 5. Prueba Guiada de Resiliencia
* Guía interactiva paso a paso para verificar el ciclo completo de protección de datos ante fallos.

---

## Cómo Ejecutar el Proyecto
Abre directamente el archivo `index.html` en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox o Safari). No requiere servidores locales, Node.js ni paquetes externos.
