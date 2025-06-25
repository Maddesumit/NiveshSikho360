# NiveshSikho360: AI-Powered Stock Market Simulator

NiveshSikho360 is a comprehensive, hyper-realistic stock market simulation platform designed for the Indian market. It provides a safe, zero-risk environment for aspiring investors to learn, practice, and build confidence in their trading skills. The platform is powered by a modern tech stack including Next.js, React, and Genkit for AI features, offering an immersive and educational experience.

![NiveshSikho360 Dashboard](https://placehold.co/800x400.png?text=NiveshSikho360+App+Screenshot)

## ✨ Key Features

- **Hyper-Realistic Trading:** Trade stocks listed on the NSE/BSE with simulated real-time price updates. Users start with ₹1,00,000 in virtual cash.
- **AI-Powered Insights (Genkit):**
    - **Personalized Recommendations:** Get AI-driven trade recommendations based on your portfolio and market trends.
    - **News Sentiment Analysis:** Understand the potential market impact of the latest news with AI-powered sentiment analysis.
    - **Risk Identification:** The AI analyzes financial data and news to highlight key risks for specific stocks.
    - **Stock Q&A:** Ask the AI questions about a company's financials and get concise, context-aware answers.
- **Structured Learning Academy:**
    - A full curriculum with modules for Beginner, Intermediate, and Advanced learners.
    - Each module includes explanations, real-world examples, interactive flashcards, and a quiz.
    - Pass a final exam to earn a certificate and a virtual cash bonus.
- **In-Depth Portfolio Analysis:**
    - A detailed dashboard to track your portfolio value, holdings, and overall profit & loss.
    - An asset allocation pie chart to visualize your diversification.
- **Comprehensive Market News:** Stay updated with a feed of the latest market news, enhanced with AI sentiment analysis.
- **Financial Glossary:** A searchable dictionary of common financial terms to help you understand market jargon.
- **Secure Authentication:** User accounts are managed securely using Firebase Authentication.
- **Persistent Data:** All user data, including portfolio and academy progress, is saved using Firebase Firestore.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **UI Library:** [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI:** [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
- **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Database:** [Firebase Firestore](https://firebase.google.com/docs/firestore)

---

## 🚀 Getting Started Locally

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A [Firebase Project](https://console.firebase.google.com/)
- A [Google Cloud Project](https://console.cloud.google.com/) with the AI Platform API enabled.

### 1. Clone the Repository

First, clone the project to your local machine.

```bash
git clone https://github.com/your-username/niveshsikho360.git
cd niveshsikho360
```

### 2. Install Dependencies

Install all the required npm packages.

```bash
npm install
```

### 3. Set Up Environment Variables

Create a new file named `.env` in the root of your project directory. Copy the following content into it and fill in the values from your Firebase and Google Cloud projects.

```env
# Firebase Configuration - copy from your Firebase project settings
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Genkit (Google AI) Configuration
# This is typically managed by `gcloud auth application-default login`
# but can be set explicitly if needed.
# GOOGLE_API_KEY=
```
- You can get your Firebase config keys from your Project Settings in the Firebase Console.
- For the `GOOGLE_API_KEY`, it is often easier to authenticate via the gcloud CLI by running `gcloud auth application-default login` in your terminal.

### 4. Configure Firebase

1.  **Authentication:** In the Firebase Console, go to **Authentication** > **Sign-in method** and enable the **Email/Password** provider.
2.  **Firestore Database:**
    - Go to **Firestore Database** and click **Create database**.
    - Start in **Production mode**.
    - Choose a location (e.g., `asia-south1` for Mumbai).
    - Go to the **Rules** tab and replace the default rules with the following to allow users to access their own data:
      ```
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /userPortfolios/{userId} {
            allow read, write: if request.auth != null && request.auth.uid == userId;
          }
        }
      }
      ```
    - Click **Publish**.

### 5. Run the Application

You need to run two processes in separate terminal windows.

**Terminal 1: Run the Next.js Development Server**
```bash
npm run dev
```
This will start the main application, usually on `http://localhost:9002`.

**Terminal 2: Run the Genkit Development Server**
```bash
npm run genkit:dev
```
This starts the local Genkit server that handles all the AI-related API calls.

Your application should now be up and running! Open your browser to `http://localhost:9002` to see it in action.
