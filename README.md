# Viking Virtual Coach - React Application

> AI-Powered Training Platform for Viking Cruises Call Center

![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to the app directory
cd app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Mentor** | mentor@viking.com | demo123 |
| **BC Agent** | agent@viking.com | demo123 |

---

## 📱 Features

### For Mentors (主管端)
- **Dashboard** - KPI overview, team activity, performance trends
- **Quiz Bank** - Create and manage training questions
- **Performance** - Track individual agent progress with radar charts
- **Role Play Management** - Review sessions and scenario library

### For BC Agents (坐席端)
- **Dashboard** - Daily tasks, quick actions, achievements
- **Quiz Center** - Take quizzes with instant feedback
- **Skill Matrix** - Visualize competency levels across 6 dimensions
- **Role Play** - Practice conversations with AI personas
- **Knowledge Book** - Review materials and wrong answers

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool |
| **Tailwind CSS** | Styling |
| **Zustand** | State Management |
| **React Router** | Routing |
| **Recharts** | Data Visualization |
| **Lucide React** | Icons |

---

## 📁 Project Structure

```
app/
├── public/
│   └── viking-logo.svg
├── src/
│   ├── components/
│   │   └── Layout.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── mentor/
│   │   │   ├── MentorDashboard.tsx
│   │   │   ├── MentorQuizBank.tsx
│   │   │   ├── MentorPerformance.tsx
│   │   │   └── MentorRolePlay.tsx
│   │   └── bc/
│   │       ├── BCDashboard.tsx
│   │       ├── BCQuizCenter.tsx
│   │       ├── BCSkillMatrix.tsx
│   │       ├── BCRolePlay.tsx
│   │       └── BCKnowledgeBook.tsx
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── quizStore.ts
│   │   ├── rolePlayStore.ts
│   │   └── skillStore.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Configure build settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy!

### Deploy to Netlify

```bash
# Build the project
npm run build

# The dist folder is ready to deploy
```

---

## 🎨 Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Viking Red | `#D4145A` | Primary actions, highlights |
| Viking Blue | `#00518F` | Secondary, navigation |
| Viking Gold | `#C5A572` | Accents, achievements |
| Viking Navy | `#1A2B4A` | Text, dark backgrounds |

---

## 📊 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🔮 Future Enhancements

- [ ] Real AI integration (OpenAI/Claude API)
- [ ] Voice mode for Role Play
- [ ] Backend API with database
- [ ] Real-time notifications
- [ ] Mobile app version
- [ ] Multi-language support (EN/ZH)

---

## 📄 License

This project is proprietary software for Viking Cruises.

---

*Built with ❤️ for Viking Virtual Coach*

