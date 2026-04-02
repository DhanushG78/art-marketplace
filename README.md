# 🎨 ArtVault — Art & Handmade Marketplace

ArtVault is a premium e-commerce platform designed for independent artists and art enthusiasts. It serves as a visual playground where artists can list their creations and buyers can discover and collect unique masterpieces.

![ArtVault Banner](https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1200&auto=format&fit=crop)

---

## 🚀 Features

### For Artists
- **Role-Based Onboarding**: Register as an artist and get instant access to your specialized dashboard.
- **Artwork Management**: Full CRUD operations for listings—upload titles, descriptions, dimensions, mediums, and styles.
- **Sales Tracking**: Real-time status updates on sold artworks (WIP).
- **Profile Customization**: Showcase your portfolio to potential buyers.

### For Buyers
- **Visual Discovery**: Explore a masonry-style marketplace with categories spanning Paintings, Sculptures, Digital Art, and more.
- **Wishlist**: Save your favorite pieces for later with a persistent visual heart system.
- **Cart & Checkout**: Manage multiple items in your basket with automatic price calculation.
- **Order Tracking**: View your past orders and purchase history in a dedicated "My Orders" section.

### Core Enhancements
- **Firebase Auth**: Secure login/signup system integrated with Firebase Authentication.
- **Firebase Firestore**: Dynamic real-time database for persistent artwork and user data.
- **Zustand State Management**: Lightweight, fast, and persistent global state for the cart, wishlist, and user sessions.
- **Modern Aesthetics**: Built with Tailwind CSS, featuring subtle micro-animations, glassmorphism, and a responsive layout.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Backend-as-a-Service**: [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

---

## 📂 Project Structure

```text
src/
├── app/               # Next.js App Router (Pages & API)
├── components/        # Reusable UI components
├── services/          # Firebase integration (Auth, Firestore)
├── store/             # Zustand state definitions
├── types/             # TypeScript interfaces
├── modules/           # Domain-specific logic (Items, Artists)
└── lib/               # Utility functions and Firebase config
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm / yarn / pnpm
- A Firebase Project (for Auth and Firestore)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/art-marketplace.git
   cd art-marketplace
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment variables:**
   Create a `.env.local` file and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see your marketplace in action!

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Developed with ❤️ for the Art Community.
