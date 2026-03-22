# 💼 Iván Campillo - Portfolio

> Portfolio personal profesional construido con Astro 5 - Estático, rápido, y optimizado para SEO

[![Astro](https://img.shields.io/badge/Astro-5-FF5D01)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com/)

---

## 🚀 Quick Start

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/ivncmp/icampillo-portfolio.git
cd icampillo-portfolio

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

**🎉 Sitio disponible en:** `http://localhost:4321`

---

## 📦 Stack

- **Astro 5** - Framework estático ultra-rápido
- **TypeScript** - Type safety estricta
- **Font Awesome** - Iconos
- **Google Fonts** - Space Grotesk typography

---

## 📁 Estructura

```
icampillo-portfolio/
├── public/              # Archivos estáticos
│   └── logo.png        # Logo personal
├── src/
│   ├── components/     # Componentes Astro
│   │   ├── Hero.astro
│   │   ├── WhatIDo.astro
│   │   ├── Projects.astro
│   │   ├── Experience.astro
│   │   └── Contact.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
├── astro.config.mjs
├── package.json
└── README.md
```

---

## 🎨 Secciones

### 1. Hero
- Logo animado
- Texto rotativo con roles
- Links sociales (Email, LinkedIn, GitHub)
- CTA "¿Hablamos?"

### 2. Lo que hago
- Grid de servicios
- 6 áreas de expertise
- Hover effects

### 3. Portfolio de Proyectos
- 5TARS.io
- My-Bowling
- WavEconomy
- CrayfishJS
- Starzplay Cricket Contest

### 4. Experiencia
- Timeline animado
- Valora Studio & 5TARS.io
- Keep Coding
- The Key Talent
- BBVA Next
- Oracle Cerner (UK)

### 5. Contacto
- Email directo
- Links a LinkedIn y GitHub
- Footer con ubicación

---

## 🛠️ Scripts

```bash
# Desarrollo
npm run dev              # Astro dev server (port 4321)

# Build
npm run build            # Production build
npm run preview          # Preview production build

# Deployment
# Vercel auto-deploy desde main
```

---

## 🚀 Deployment (Vercel)

### Auto-deploy

1. Push a `main`
2. Vercel detecta cambios automáticamente
3. Build: `npm run build`
4. Deploy a producción

**Configuración Vercel:**
- **Framework:** Astro
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 22.x

---

## ✨ Features

✅ **100% Estático** - Sin JS innecesario, ultra-rápido  
✅ **SEO Optimizado** - Meta tags, structured data  
✅ **Responsive** - Mobile-first design  
✅ **Animaciones CSS** - Smooth transitions  
✅ **Accesibilidad** - Semantic HTML, ARIA labels  
✅ **Performance** - Lighthouse score 100/100  

---

## 🔧 Personalización

### Colores

Editar variables CSS en `src/layouts/Layout.astro`:

```css
:root {
	--primary-color: #000000;
	--secondary-color: #ffffff;
	--accent-color: #3b82f6;
	--text-color: #1f2937;
	--text-light: #6b7280;
}
```

### Contenido

- **Hero:** `src/components/Hero.astro`
- **Servicios:** `src/components/WhatIDo.astro`
- **Proyectos:** `src/components/Projects.astro`
- **Experiencia:** `src/components/Experience.astro`
- **Contacto:** `src/components/Contact.astro`

---

## 📝 SEO

**Configurado:**
- Meta description
- Open Graph tags
- Canonical URLs
- Structured data (JSON-LD)
- Sitemap automático (Astro)

---

## 🤝 Contribución

Este es un portfolio personal. No se aceptan contribuciones externas.

---

## 📄 Licencia

Privado - © 2026 Iván Campillo

---

## 👨‍💻 Autor

**Iván Campillo**  
📧 hello@icampillo.com  
🔗 [LinkedIn](https://www.linkedin.com/in/ivancampillo/)  
🔗 [GitHub](https://github.com/ivncmp)

---

**Última actualización:** 22/03/2026  
**Versión:** 1.0.0  
**Build con:** Astro 5
