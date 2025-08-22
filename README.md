# EstateLink: Property Development Web Portal

EstateLink is a modern, full-stack web application designed for property developers to showcase their projects, manage property units, and leverage AI to generate optimal layout suggestions. It features a sleek public-facing website and a comprehensive admin dashboard for easy management.

## Tech Stack

This project is built with a modern, robust, and scalable technology stack:

- **Framework:** [Next.js](https://nextjs.org/) (v15) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN/UI](https://ui.shadcn.com/)
- **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit) for generative AI features
- **Deployment:** Firebase App Hosting

## Key Features

- **Public-Facing Website:**
  - Responsive home page with a hero slider and project listings.
  - Individual project pages with detailed descriptions and available units.
  - Dark/Light mode support for a comfortable user experience.
- **Admin Dashboard:**
  - Secure area to manage property projects and units.
  - Create new projects and add various unit types with descriptions.
  - Fully responsive design with a collapsible sidebar.
- **AI-Powered Layout Suggestions:**
  - Integrated Genkit flow to generate intelligent layout descriptions and images based on unit dimensions and user requirements.
  - Helps visualize and optimize space for potential buyers.

## Project Structure

The project follows a standard Next.js App Router structure:

```
/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js routes, including API routes and pages
│   │   ├── (public)/       # Route group for public pages
│   │   └── admin/          # Route group for the admin dashboard
│   ├── components/         # Reusable React components (UI and domain-specific)
│   ├── lib/                # Shared utilities, data access, and action handlers
│   ├── ai/                 # Genkit flows and AI-related logic
│   └── ...
├── .env                    # Environment variables (create this file)
├── next.config.ts          # Next.js configuration
└── package.json            # Project dependencies and scripts
```

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [npm](https://www.npmjs.com/) or a compatible package manager

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Add your Firebase and Genkit API keys to this file.
    ```env
    GEMINI_API_KEY=your_google_ai_api_key_here
    ```

### Running the Application

To start the development server, run the following command:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

## Admin Panel

The admin dashboard is the central hub for managing your property portfolio.

- **Access:** Navigate to `/dashboard` to access the dashboard.
- **Functionality:** From here, you can add new projects and manage the units within each project.

## AI Layout Suggestions

This application uses Genkit to provide AI-driven layout suggestions.

- **Usage:** In the admin dashboard, you can select a unit and use the "Suggest Layout" feature.
- **Process:** The AI takes the unit's dimensions and your specified requirements (e.g., number of rooms, style) to generate a detailed description and a visual floor plan.

# paramount-land
