# EcoSync Enterprise Gateway

Plataforma SaaS B2B de resiliencia digital, continuidad operativa y eficiencia energética (Green IT) para aplicaciones corporativas y sistemas ERP/CRM.

---

## Propósito y Alcance
EcoSync es una solución de arquitectura resiliente en el cliente (Edge Resilience) diseñada para proteger la captura de datos críticos frente a cortes de red o caídas de sesión, reducir la carga de peticiones innecesarias a servidores corporativos y proyectar el ahorro de huella de carbono digital (Scope 2 y Scope 3).

---

## Estructura del Proyecto
* **`index.html`**: Estructura semántica completa de la plataforma con navegación entre todas las vistas públicas y corporativas, incluyendo el nuevo módulo de Arquitectura del Sistema.
* **`styles.css`**: Sistema de diseño moderno SaaS B2B con la paleta corporativa oficial (`#FAFAFA`, `#FFFFFF`, `#2563EB`, `#E07A5F`, `#10B981`, `#1E293B`, `#0F172A`), componentes responsivos y pipeline de capas.
* **`script.js`**: Lógica de interacción en JavaScript vanilla, autenticación con perfiles demo, persistencia en `LocalStorage` con autoguardado, simulación de contingencias, cálculos de IVA 19%, optimizador reactivo y consola de diagnóstico.

---

## Módulos y Funcionalidades de la Suite

### 1. Sistema de Autenticación (Login & Registro)
* Modal interactivo de **Inicio de Sesión** y **Creación de Cuenta** con validación en cliente.
* **Acceso Rápido Demo en 1 Clic** con perfiles precargados:
  * **Ing. Roberto Silva** (*Gerente de Infraestructura TI*)
  * **Camila Soto** (*Operadora de Servicios / Finanzas*)
* Almacenamiento de sesión activa en `LocalStorage` con menú desplegable de cambio de perfil y cierre de sesión.

### 2. Dashboard Ejecutivo de Eficiencia Operativa
* **Supervisión de KPIs Clave**:
  * Tiempo Promedio de Recuperación: **4.2 s** (-89% latencia) con pulso de reanudación SVG.
  * Llamadas a Soporte Evitadas: **340 tickets este mes** (+$14,280 USD de ahorro).
  * Energía de Servidores Ahorrada: **1,840 kWh** (0.74 tCO2e mitigadas).
* **Gráfico Spline Interactivo**: Eventos de red vs. sesiones rescatadas en los últimos 30 días.
* **Conectores de Misión Crítica**: Monitoreo de estado en SAP Fiori, Salesforce CRM y Portal Interno.
* **ROI Trimestral**: Retorno neto del **+340%** ($9,080 USD en productividad).
* **Feed en Tiempo Real de Mitigaciones**: Registro criptográfico de incidentes resueltos en el cliente.

### 3. Historial de Diagnósticos Forenses y Errores Interceptados
* KPIs de incidentes mitigados, tasa de auto-recuperación (100%), datos intactos y horas ahorradas.
* **Buscador en tiempo real** por ID, usuario o código de error (ej. `504`, `NET`).
* **Filtros reactivos** por Sistema (SAP, Salesforce, Oracle) y Severidad (Alta, Media, Baja).
* **Acordeón forense detallado**:
  * Stack trace crudo interceptado y neutralizado.
  * Telemetría de recuperación milimétrica (latencia de caída, payload resguardado y tiempo de rehidratación).
  * Botones funcionales para **copiar traza** y **descargar dump HAR**.

### 4. Centro de Integración y Despliegue de SDK
* **Bóveda de Credenciales Zero-Trust**: Tenant UUID, Public Client Token y Secret Key con botón para regenerar llaves y botones de copia rápida.
* **Script de Inyección Universal**: Snippet multimarco con selector para **JavaScript / HTML Tag**, **React / Next.js**, **Angular / Vue** y **Extensión Chrome/Edge MDM**.
* **Tester Activo de Ping y Handshake**: Simulador interactivo de conexión y validación TLS 1.3 con emulación de consola en tiempo de ejecución.
* **Catálogo de Conectores Nativos**: Estado en vivo de conectores preconfigurados para SAP, Salesforce, Dynamics 365 y Oracle Cloud.

### 5. Arquitectura Simple y Optimizador del Sistema
* **Pipeline en 4 Capas Desacopladas**:
  1. **Capa 01 (Client Edge)**: Intercepción de eventos DOM y debounce adaptativo de 600 ms.
  2. **Capa 02 (Storage Enclave)**: Persistencia atómica en LocalStorage con cifrado de sesión AES-256.
  3. **Capa 03 (Adaptive Network Broker)**: Enrutamiento offline-first y descarte del 92% de peticiones repetitivas.
  4. **Capa 04 (Backend Corporativo)**: Recepción por lotes consolidados liberando 45% de vCPU en servidores.
* **Panel de Control de Optimizaciones Reactivas**: Conmutadores en tiempo real para compresión delta, debounce, caché local y eco-throttle.
* **Monitor de Rendimiento & Benchmark en Vivo**: Comparativa de latencia (1.4 ms vs 380 ms), payload (-92.5%) y botón de prueba de estrés con 100 transacciones concurrentes.

### 6. Terminal Operativa de Servicios y Facturación
* Registro operativo de servicio para clientes con expedientes validados localmente.
* **Tabla Dinámica de Líneas de Servicio**:
  * Botón **`+ Añadir Fila de Servicio`** y eliminación individual de ítems.
  * Cálculo en tiempo real de Subtotal, Descuento Convenio (5%), Base Imponible, IVA (19%) y **Total Factura**.
* Observaciones con contador de caracteres guardados en vivo y hash de integridad SHA-256.
* **Autoguardado reactivo con debounce de 600 ms** en `LocalStorage`.
* **Simulación de Caída de Red**: Activa el banner naranja de contingencia, mantiene el formulario 100% editable y protege los datos en memoria.
* **Consola Integrada de Neutralización de Fallos (#ERR-503)** con descarga de JSON de recuperación y purga de buffer.

### 7. Impacto Green IT y Calculadoras ESG
* **Calculadora Dinámica de Impacto ESG**: Sliders de puestos y transacciones con proyección en tiempo real de kWh, CO2e y árboles equivalentes.
* **Calculadora Green IT Simplificada**: Estimación directa de peticiones redundantes anuales evitadas.

### 8. Consola Técnica Global Oculta
* Apertura mediante el atajo de teclado **`Ctrl + Shift + D`** o botón flotante.
* Registro de eventos con filtrado estricto anti-PII y botón de **exportación JSON**.

---

## Cómo Ejecutar el Proyecto
Abre directamente el archivo `index.html` en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox o Safari). No requiere servidores locales, Node.js ni paquetes externos.
