# 🌹 AuraRose Boutique

A premium, modern e-commerce boutique experience crafted for elegance and ease of use. AuraRose is a high-end fashion platform featuring a curation of luxury goods, designed with a focus on aesthetic excellence and seamless user interaction.

![AuraRose Hero View](https://via.placeholder.com/1200x500/000000/FFFFFF?text=AuraRose+Boutique+Experience)

## ✨ Key Features

- **🛍️ Premium Shopping Experience**: High-fidelity UI with smooth transitions and curated layouts.
- **🔍 Intelligent Search**: Advanced search functionality with relevance scoring for quick product discovery.
- **❤️ Personalized Wishlist**: Floating heart interactions to save your favorite pieces effortlessly.
- **📱 Responsive by Design**: Optimized for desktops, tablets, and mobile devices.
- **🔐 Secure Authentication**: Integrated Google Sign-In via Firebase for a safe and quick checkout experience.
- **📦 Dynamic Cart Management**: Intuitive cart system with real-time updates.
- **📸 Detailed Product Display**: Rich product pages with immersive image galleries and nested carousels.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Styling** | Vanilla CSS (Modern Design System) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Authentication** | [Firebase Auth](https://firebase.google.com/products/auth) |
| **Data/Backend** | [JSON Server](https://github.com/typicode/json-server) (Mock REST API) |
| **Navigation** | React Router DOM v7 |

---

## 🚀 Getting Started

Follow these steps to set up AuraRose Boutique locally:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/aurarose-boutique.git
cd aurarose-boutique
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start the Mock Server
AuraRose uses `json-server` to manage product data. Start it in a separate terminal:
```bash
npm run server
```
*The server will run on [http://localhost:3000](http://localhost:3000)*

### 5. Launch the Application
```bash
npm run dev
```
*Open [http://localhost:5173](http://localhost:5173) to view the site.*

---

## 📂 Project Structure

```text
src/
├── components/   # Reusable UI components (ProductRow, Navbar, etc.)
├── pages/        # Main application views (Home, ProductDetails, Wishlist)
├── hooks/        # Custom React hooks for business logic
├── context/      # State management using React Context API
├── services/     # API and search indexing services
├── firebase.js   # Firebase configuration and initialization
└── index.css     # Global styles and design system tokens
```

---

## 💅 Design Philosophy

AuraRose is built on the principle of **"Aesthetic Utility."** We believe that a high-end shop should feel as good as the products it sells.
- **Glassmorphism**: Subtle backgrounds and frosted glass effects.
- **Vibrant Palettes**: Elegant color schemes that speak to premium branding.
- **Micro-interactions**: Hover effects and animations that make the UI feel alive.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Crafted with ❤️ by the AuraRose Development Team.*
