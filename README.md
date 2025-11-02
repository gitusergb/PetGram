# PetGram 🐾📸

## Overview

This project is a **web application built using React, TypeScript, Vite, and Firebase** that allows users to share adorable photos and moments of their pets in a beautifully designed, Instagram-inspired feed. Users can upload pet photos with captions and hashtags, like posts, and explore a real-time, interactive pet community.

PetGram is designed to foster a positive space for pet lovers, supporting responsive layouts, dark mode, and filtering by pet type.

***

## Features

* **Pet Photo Feed:** Scrollable feed displaying all user-uploaded pet photos, captions, hashtags, and like counts, sorted by newest first.
* **Upload \& Share:** Users can upload pet photos, add captions, select categories (dog, cat, etc.), and insert hashtags.
* **Like \& Unlike:** Like button for each post, with real-time updates and persistent like counts.
* **Authentication:** Secure login and signup with Firebase Authentication (optionally with Google).
* **Comments:** (Bonus) Users can add comments under posts for more interaction.
* **Pet Category Filter:** Filter feed by pet type (such as dog, cat, bird, etc.) for personalized discovery.
* **Dark Mode:** Easily switch between light and dark themes.
* **Simple Photo Filters:** Option to apply effects (e.g. grayscale, sepia) when uploading images.
* **Responsive UI:** Looks beautiful on desktop and mobile, optimized for all devices.

***

## Screenshots

> screenshots .
>
> <img src="https://your-image-link1.com" alt="PetGram Feed" height="300" />
> <img src="https://your-image-link2.com" alt="Post Upload" height="300" />
> <img src="https://your-image-link3.com" alt="Dark Mode" height="300" />

***

## Technologies Used

* **Frontend:** React, TypeScript, Vite
* **Styling:** Material UI / Tailwind CSS
* **Backend \& Auth:** Firebase (Authentication, Firestore, Storage)
* **State Management:** React Context/Redux
* **Image Handling:** Browser APIs, custom logic or filters
* **Version Control:** Git

***

## Getting Started

### Prerequisites

* Node.js and npm installed
* A Firebase project 

***

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/gitusergb/PetGram.git
```

2. **Navigate to the project folder:**

```bash
cd petgram
```

3. **Install dependencies:**

```bash
npm install
# or
yarn install
```

4. **Create a `.env` file in the project root and add your Firebase config:**

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```


***

### Running the Application

1. **Start the development server:**

```bash
npm run dev
```

2. **Visit the local URL (e.g., [http://localhost:5173](http://localhost:5173)) to test the app.**
3. **For a production build:**

```bash
npm run build
```

Then preview with:

```bash
npm run preview
```


***

## Approach and Design

* **React + Vite + TypeScript:** Modern web stack for fast development and type safety.
* **Firebase Integration:** Handles authentication, real-time database, and image file storage.
* **Instagram-like UI:** Clean, responsive layouts inspired by Instagram for familiar user experience.
* **State \& Context:** User session, preferences (e.g., dark mode), and app state managed using React Context or Redux.
* **Dark Mode \& Theming:** Switch between light and dark themes with one click.
* **Best Practices:** Secure API keys with environment variables, modular code, and accessible design.

***

## Known Issues / Limitations

* **API limits:** Heavy usage may hit Firestore/Storage limits on free tier.
* **Unauthenticated Features:** Some advanced features require sign-in.
* **Photo Filters:** Basic effects implemented; advanced filters may need improvements.
* **Image Upload Size:** Large images may take longer to upload; consider resizing before upload.

***

## Live Demo

* **Netlify/Vercel:** [Try the PetGram App Online](https://your-petgram-deployment-link.com)

***

## Repository

* **GitHub:** [https://github.com/gitusergb/PetGram.git](https://github.com/gitusergb/PetGram.git)

***

## Contact

Questions, suggestions, or want to collaborate?
Email: [g4ur131@gmail.com](mailto:g4ur131@gmail.com)

***

