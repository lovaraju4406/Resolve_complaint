# 🚀 3D Developer Portfolio

A modern, responsive **3D Developer Portfolio** built with **React**, **Vite**, **Three.js**, and **Tailwind CSS**, showcasing skills, projects, and experience with smooth animations and interactive 3D elements.

🔗 **Live Demo:** [https://3-d-developer-portfolio-eizl4fhu1.vercel.app/](https://3-d-developer-portfolio-eizl4fhu1.vercel.app/)

---

## 👋 About Me

Hi, I'm **Lovaraju Dungala**, a Software Developer passionate about building scalable web applications, interactive user interfaces, and intelligent systems. I enjoy turning ideas into clean, maintainable, and high-performance software solutions.

---

## ✨ Features

- ⚛️ **React 18 + Vite** for fast development and builds
- 🎮 **Three.js & React Three Fiber** for interactive 3D visuals
- 🎨 **Tailwind CSS** for modern, responsive UI
- 🌀 **Framer Motion** for smooth animations
- ☀️ **Light theme** with warm cream + purple accent design
- 🔗 **Social profile links** — GitHub, LinkedIn, LeetCode, GeeksForGeeks
- 🧭 Interactive sections: About, Experience, Projects, Testimonials, Contact
- 📱 Fully responsive — desktop, tablet, and mobile
- 📧 **EmailJS** contact form — sends messages directly to inbox
- 🚀 Deployed on **Vercel** with CI/CD from GitHub

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| JavaScript ES6+ | Core language |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations & transitions |

### 3D & Animation
| Technology | Purpose |
|---|---|
| Three.js | 3D rendering engine |
| @react-three/fiber | React renderer for Three.js |
| @react-three/drei | Three.js helpers & utilities |
| react-parallax-tilt | Tilt hover effect on cards |

### Services
| Service | Purpose |
|---|---|
| EmailJS | Contact form email delivery |
| Vercel | Hosting & CI/CD deployment |
| GitHub | Version control & source |

---

## 📂 Project Structure

```
project_3D_developer_portfolio/
├── public/
│   ├── desktop_pc/          # 3D desktop PC model (GLTF)
│   ├── planet/              # 3D Earth model (GLTF)
│   └── lovaraju_resume.pdf  # Downloadable resume
├── src/
│   ├── assets/              # Images, icons, company logos
│   │   ├── tech/            # Technology icons for 3D balls
│   │   └── company/         # Company logos for experience
│   ├── components/
│   │   ├── canvas/          # Three.js 3D canvas components
│   │   │   ├── Ball.jsx     # Floating tech skill balls
│   │   │   ├── Computers.jsx# Hero 3D desktop model
│   │   │   ├── Earth.jsx    # Contact section Earth model
│   │   │   └── Stars.jsx    # Animated star background
│   │   ├── Navbar.jsx       # Fixed top navigation
│   │   ├── Hero.jsx         # Landing section with social links
│   │   ├── About.jsx        # Bio + service cards
│   │   ├── Experience.jsx   # Internship timeline
│   │   ├── Tech.jsx         # Technology skill balls grid
│   │   ├── Works.jsx        # Project cards
│   │   ├── Feedbacks.jsx    # Testimonials
│   │   ├── Contact.jsx      # Contact form + Earth canvas
│   │   └── Loader.jsx       # 3D canvas loading spinner
│   ├── constants/
│   │   └── index.js         # All site content & data
│   ├── hoc/
│   │   └── SectionWrapper.jsx # Animation HOC for sections
│   ├── utils/
│   │   └── motion.js        # Framer Motion animation variants
│   ├── styles.js            # Reusable Tailwind class strings
│   ├── index.css            # Global styles & custom classes
│   ├── App.jsx              # Root component & routing
│   └── main.jsx             # React entry point
├── .env                     # Environment variables (EmailJS keys)
├── tailwind.config.cjs      # Tailwind theme configuration
├── vite.config.js           # Vite build configuration
├── package.json
└── README.md
```

---

## ⚙️ Getting Started (Local Setup)

### Prerequisites
- Node.js v16 or higher
- npm v7 or higher

### 1️⃣ Clone the repository
```bash
git clone https://github.com/lovaraju4406/3D-developer-portfolio.git
cd 3D-developer-portfolio
```

### 2️⃣ Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3️⃣ Set up environment variables
Create a `.env` file in the root directory:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_RECEIVER_EMAIL=your_email@example.com
```
> Get these values from [https://www.emailjs.com](https://www.emailjs.com)

### 4️⃣ Run the development server
```bash
npm run dev
```
Open 👉 [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Build for Production

```bash
npm run build
```
Generates an optimized `dist/` folder ready for deployment.

---


## 🚀 Deployment

The project is deployed on **Vercel** with automatic CI/CD.

- Every push to `main` triggers a new deployment
- Build command: `npm install --legacy-peer-deps && npm run build`
- Output directory: `dist`

🔗 **Live URL:** [https://3-d-developer-portfolio-eizl4fhu1.vercel.app/](https://3-d-developer-portfolio-eizl4fhu1.vercel.app/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ by <strong>Lovaraju Dungala</strong></p>
