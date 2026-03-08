<p align="center">
  <img src="public/icon.svg" alt="SheLedger Logo" width="80" />
</p>

<h1 align="center">SheLedger</h1>

<p align="center">
  <strong>Empoderamiento financiero para mujeres emprendedoras de Latinoamérica 💜</strong>
</p>

<p align="center">
  <a href="https://v0-she-ledger-mvp.vercel.app/">🌐 Demo en vivo</a> ·
  <a href="https://wa.me/14155238886?text=join%20early-building">💬 Probar en WhatsApp</a>
</p>

---

## 🔥 El Problema 

En Latinoamérica, **más de 30 millones de mujeres** lideran micro y pequeños negocios. 
Sin embargo:

| El dato | La realidad |
|---------|------------|
| 📓 **70%** registra sus finanzas en cuadernos o no registra nada | No saben si ganan o pierden al final del mes |
| 📱 **85%** no usa apps financieras | Las herramientas existentes son complicadas, en inglés o requieren conocimientos contables |
| 🏦 **60%** no tiene acceso a crédito formal | Sin historial financiero digital, los bancos las ignoran |
| 💸 **40%** mezcla dinero personal con el del negocio | Decisiones financieras basadas en intuición, no en datos |

**La brecha digital financiera no es un problema de tecnología — es un problema de diseño.** Las soluciones existentes no hablan el idioma de las emprendedoras, no se integran en su flujo diario y requieren demasiado esfuerzo.

---

## 💡 Nuestra Solución

**SheLedger** es una asistente financiera inteligente por **WhatsApp** que permite a mujeres emprendedoras registrar ventas, gastos y ahorros con solo enviar un mensaje — como si hablaran con una amiga.

```
👩 "Vendí 200 soles hoy"
🤖 "✅ Registrado: +S/ 200. Llevas S/ 680 esta semana. ¡Excelente ritmo! 🚀"

👩 "Gasté 45 en insumos"  
🤖 "📝 Tu margen de hoy es del 77%. Tu puntaje SheLedger: ⭐ 82/100"
```

### ¿Por qué WhatsApp?

> En Perú y Latinoamérica, **WhatsApp tiene 95%+ de penetración**. No hay app que descargar, no hay cuenta que crear. Solo un mensaje — en el canal que ya usan todos los días.

---

## ✨ Funcionalidades Clave

### 🗣️ Registro en Lenguaje Natural
Escribe como hablas: *"Hoy vendí 3 tortas a 25 cada una"*. SheLedger parsea, calcula y registra automáticamente — sin formularios ni categorías complicadas.

### ⭐ Puntaje Financiero SheLedger (0-100)
Un score gamificado que refleja la salud del negocio. Premia la constancia, el ahorro y el control de gastos. Transforma hábitos financieros en un juego motivacional.

### 🎙️ Asesora Financiera con Voz IA
Consejos personalizados con síntesis de voz natural. La emprendedora puede **escuchar** recomendaciones concretas mientras trabaja en su negocio.

### 📊 Dashboard Inteligente
Panel visual con gráficos de ventas, gastos, margen de ganancia, calendario de actividad y tendencias — todo generado automáticamente desde los registros por chat.

### 📅 Reportes Automáticos
Resúmenes semanales y mensuales con los mejores días de venta, gastos más frecuentes y oportunidades de mejora.

### 🎯 Metas y Seguimiento
Define objetivos de ventas mensuales y recibe seguimiento diario de progreso.

### 🔐 Privacidad y Seguridad
Datos encriptados, nunca compartidos con terceros. La confianza de la emprendedora es prioridad.

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Landing  │  │   Chat   │  │  Dashboard   │  │
│  │  Page    │→ │ Assistant│  │  Financiero  │  │
│  └──────────┘  └────┬─────┘  └──────┬───────┘  │
│                     │               │           │
│         ┌───────────┴───────────────┘           │
│         ▼                                       │
│  ┌─────────────────────────┐                    │
│  │    Voice Features       │                    │
│  │  (Speech-to-Text/TTS)   │                    │
│  └─────────────────────────┘                    │
└──────────────────┬──────────────────────────────┘
                   │ API Routes
┌──────────────────▼──────────────────────────────┐
│                   BACKEND                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ /api/    │  │ /api/    │  │  /api/       │  │
│  │ records  │  │ voice/*  │  │  whatsapp/*  │  │
│  └────┬─────┘  └──────────┘  └──────┬───────┘  │
│       │                             │           │
│       ▼                             ▼           │
│  ┌──────────┐              ┌──────────────┐     │
│  │ Neon DB  │              │   Twilio      │     │
│  │(Postgres)│              │  WhatsApp API │     │
│  └──────────┘              └──────────────┘     │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend** | Next.js 16 + React 19 | SSR, routing moderno, rendimiento |
| **UI** | Tailwind CSS + Radix UI + shadcn/ui | Componentes accesibles y diseño premium |
| **Charts** | Recharts | Visualización de datos financieros interactiva |
| **Base de datos** | Neon (PostgreSQL Serverless) | Escalable, sin servidor, ideal para MVP |
| **WhatsApp** | Twilio API | Integración confiable con WhatsApp Business |
| **Voz IA** | ElevenLabs + Web Speech API | Síntesis de voz ultra-realista en español para coaching financiero |
| **NLP** | Parsing de lenguaje natural custom | Extracción de datos financieros del español coloquial |
| **Deploy** | Vercel | Deploy continuo, edge functions, analytics |

---

## 🚀 Quick Start

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/sheledger.git
cd sheledger

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus claves de Neon DB y Twilio

# 4. Ejecutar en desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver el landing page, o navega a [http://localhost:3000/demo](http://localhost:3000/demo) para el demo interactivo.

---

## 📱 Estructura del Proyecto

```
sheledger/
├── app/
│   ├── page.tsx              # Landing page
│   ├── demo/page.tsx         # Demo interactivo (dashboard)
│   ├── layout.tsx            # Layout global
│   └── api/
│       ├── records/          # CRUD de registros financieros
│       ├── voice/            # Síntesis de voz y coaching IA
│       ├── speak/            # Text-to-speech API
│       └── whatsapp/         # Webhook de Twilio/WhatsApp
├── components/
│   └── sheledger/
│       ├── chat-assistant.tsx    # Chat con NLP financiero
│       ├── score-widget.tsx      # Puntaje financiero animado
│       ├── financial-coach.tsx   # Asesora IA con voz
│       ├── financial-charts.tsx  # Gráficos de rendimiento
│       ├── voice-features.tsx    # Resúmenes por voz
│       ├── activity-tracker.tsx  # Calendario de constancia
│       ├── record-form.tsx       # Formulario de registro
│       ├── onboarding.tsx        # Tutorial de bienvenida
│       └── whatsapp-connect.tsx  # Conexión WhatsApp
├── lib/                      # Utilidades y datos
└── hooks/                    # Custom React hooks
```

---

## 🌍 Impacto Social

### Visión a 12 meses

| Métrica | Objetivo |
|---------|---------|
| 👩‍💼 Emprendedoras activas | 10,000+ |
| 📊 Registros financieros | 500,000+ |
| 💳 Historiales financieros creados | 5,000+ |
| 🏦 Acceso a microcréditos facilitado | 1,000+ |

### El ciclo virtuoso de SheLedger

```
    Registra ventas y gastos diarios
              ↓
    Construye historial financiero digital
              ↓
    Mejora su puntaje SheLedger
              ↓
    Accede a microcréditos y oportunidades
              ↓
    Hace crecer su negocio
              ↓
    Inspira a otras emprendedoras ♻️
```

---

## 🎯 Modelo de Negocio

| Tier | Precio | Incluye |
|------|--------|---------|
| **Gratis** | S/ 0 | Registro ilimitado, puntaje, resúmenes básicos |
| **Pro** | S/ 9.90/mes | Coaching IA por voz, reportes avanzados, metas |
| **Alianzas** | B2B | API para microfinancieras y bancos (historial crediticio alternativo) |

> **La monetización real**: vender historiales financieros alternativos (con consentimiento) a instituciones financieras que buscan bancarizar a las no bancarizadas.

---

## 👩‍💻 Equipo — She Ships

Somos un equipo comprometido con cerrar la brecha financiera de género en Latinoamérica a través de tecnología accesible y humana.

---

## 📄 Licencia

MIT © 2025 SheLedger — She Ships

---

<p align="center">
  <strong>Hecho con 💜 para las emprendedoras de Latinoamérica</strong>
  <br/>
  <sub>SheLedger — Porque cada sol cuenta.</sub>
</p>
