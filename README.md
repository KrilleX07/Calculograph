# ⏳ CALCULOGRAPH — Official Allowlist Intake & Pass Portal

Official Allowlist intake portal for **Calculograph (3,333 calculating machines on Robinhood Chain)** in antique Calctrons physical mechanical ledger style.

---

## 🌟 Key Features

- **Antique Paper & Sepia Mechanical Style**: Inspired by mechanical calculators, 19th-century chronometers, and physical ledgers (`#efe7d6`, `#3c2c1c`, `#c05810`, `#46e35f`).
- **3-Step Linear Intake Protocol**:
  - `01 IDENTITY`: X (Twitter) verification with duplicate checking and live avatar resolution.
  - `02 MISSIONS`: 3 interactive X clearance tasks (Follow, Repost, Tag 2 Operators) with 5-second countdown verifier.
  - `03 WALLET`: EVM address submission on Robinhood Chain with strict duplicate checking in Supabase.
- **Permanent Chrono Pass Certificate**:
  - Automatically generated high-contrast operator pass.
  - One-click PNG image download with `html-to-image`.
  - Native referral link generation and share-to-X intents.
- **Acoustic Mechanical Sound Effects**: Procedural Web Audio API sound synthesizer with clicks, typewriter snaps, and confirmation chimes.

---

## 🚀 Quick Start

### 1. Install dependencies:
```bash
npm install
```

### 2. Run local development server:
```bash
npm run dev
```

### 3. Build for production:
```bash
npm run build
```

---

## ☁️ Deployment on Vercel

1. Import repository `KrilleX07/Calculograph` into [Vercel](https://vercel.com/new).
2. Framework Preset: **Vite** (detected automatically).
3. Environment Variables (optional, defaults are embedded):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**.

---

## 📁 Project Structure

```
Calculograph/
├── api/
│   ├── avatar.js            # Serverless X profile avatar metadata fetcher
│   └── avatar-proxy.js      # Serverless binary image CORS proxy
├── public/
│   ├── favicon.png
│   └── audio/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Vintage ledger header with operational status
│   │   ├── AllowlistIntake.jsx # 3-step linear verification form
│   │   ├── AllowlistPass.jsx   # Printable mechanical Chrono Pass
│   │   └── Footer.jsx       # Minimalist footer
│   ├── utils/
│   │   ├── avatar.js        # Multi-fallback avatar resolver
│   │   ├── supabase.js      # Supabase client & duplicate protection
│   │   └── sound.js         # Web Audio procedural sound engine
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vercel.json
├── package.json
├── tailwind.config.js
└── vite.config.js
```
