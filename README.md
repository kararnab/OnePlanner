# One Planner Frontend

A fully client-side, video conferencing UI built using:

- **Next.js App Router (Static Export Mode)**
- **TypeScript**
- **Tailwind CSS v4**
- **Zustand (persistent auth store)**
- **Mock API layer (login + refresh) — toggleable via env var**
- **Production-style access/refresh token authentication**
- **Fully Modular Client Components**
- **Type-safe i18n with Static Key Generation** (i18next + react-i18next, `en` / `hi`)
- **Framer Motion** for animations, **lucide-react** for icons

This project compiles into **pure static HTML/CSS/JS** and does **NOT** require a Node server at runtime.

---

## 🚀 Project Creation

This app was created using:

```bash
npx create-next-app@latest one-conference --typescript --app --tailwind
```

## 💻 Local Development

### Recommended VSCode Extensions

1. **Tailwind CSS IntelliSense**
2. **ESLint**

### Run the Dev Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 🔐 Mock API Mode & Demo Login

The app ships with a built-in mock API so it can run with **no backend**. To enable it, create a `.env.local` file in the project root:

```
NEXT_PUBLIC_USE_MOCK=true
```

Then log in at `/login` using the demo credentials:

| Field    | Value               |
| -------- | ------------------- |
| Email    | `test@example.com`  |
| Password | `123456`            |

When `NEXT_PUBLIC_USE_MOCK` is unset or `false`, the app talks to a real backend via `fetchAdapter` instead.

### 🚀 Static Export (Final Build)

Generate a pure HTML/CSS/JS build:
```bash
npm run build
npm run static:start
```

### Other Scripts

| Script              | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `npm run lint`      | Run ESLint                                               |
| `npm run gen:i18n`  | Regenerate type-safe i18n keys from `src/locales/`       |
| `npm run analyze`   | Build with `@next/bundle-analyzer` enabled               |
| `npm run lighthouse`| Run Lighthouse against `http://localhost:3000`           |
| `npm run scan:sonar`| Run SonarQube scanner (requires a running Sonar server)  |
| `npm run sonar:server` | Start a local SonarQube server in Docker              |

## Hosting
You can host your site in multiple cloud providers like
1. [Vercel Static](https://vercel.com/)
2. [Render](https://render.com/)
3. [Heroku](https://www.heroku.com/)
4. [Google App Engine](https://cloud.google.com/appengine)
5. [AWS ElasticBeanStack](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html)
6. Cloudflare Pages
7. GitHub Pages
8. Netlify
9. Any static hosting provider
