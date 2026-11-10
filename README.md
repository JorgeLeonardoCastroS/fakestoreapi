# ⚡ Fakestore API - Performance & Load Testing Suite (k6)

> Proyecto de automatización de pruebas de carga para el servicio de autenticación (`/auth/login`) de FakeStore API utilizando **k6**.

---

## 📋 Descripción del Proyecto
Este proyecto ejecuta un escenario de pruebas de carga sobre el endpoint de inicio de sesión (`POST https://fakestoreapi.com/auth/login`), parametrizando credenciales dinámicas desde un archivo CSV y validando que el servicio cumpla con los SLAs definidos:
* **Throughput objetivo:** $\ge 20$ TPS (Transacciones por segundo).
* **Tiempo de respuesta máximo ($p95$):** $\le 1.5$ segundos.
* **Tasa de error admisible:** $< 3\%$.

---

## 🛠️ Stack Tecnológico y Versiones
* **Herramienta de Pruebas de Carga:** k6 v0.49.0 (o superior)
* **Lenguaje:** JavaScript ES6
* **Formato de datos:** CSV (parseado mediante Papaparse JS Library)
* **Control de versiones:** Git / GitHub

---

## ⚙️ Instalación de k6 en Windows

Si no tienes **k6** instalado en Windows, puedes instalarlo rápidamente desde PowerShell usando Chocolatey o Winget:

```powershell
winget install k6 --source winget
# o con Chocolatey:
choco install k6