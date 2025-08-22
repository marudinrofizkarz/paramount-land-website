# 🏢 Paramount Land - Modern Property Developer Website

Paramount Land is a comprehensive property development website built with modern technologies, featuring a public showcase website and a complete admin management system for property developers.

## 🚀 Live Demo

**Production:** https://paramount-land-website.vercel.app (coming soon)
**GitHub:** https://github.com/marudinrofizkarz/paramount-land-website

## ✨ Tech Stack

This project is built with a cutting-edge technology stack:

- **Framework:** [Next.js 15.3.3](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [ShadCN/UI](https://ui.shadcn.com/)
- **Database:** [Turso](https://turso.tech/) (LibSQL)
- **Authentication:** [Clerk](https://clerk.com/)
- **File Storage:** [Cloudinary](https://cloudinary.com/)
- **AI Integration:** [Google Genkit](https://firebase.google.com/docs/genkit)
- **Deployment:** [Vercel](https://vercel.com/)

## 🌟 Features

### **Public Website:**

- 📱 **Responsive Design** - Mobile-first approach
- 🎨 **Hero Slider** - Dynamic content management
- 🏘️ **Project Showcase** - Detailed property listings
- 📰 **News System** - Latest updates and announcements
- 🌓 **Dark/Light Mode** - User preference support
- 🔍 **SEO Optimized** - Search engine friendly
- 📞 **WhatsApp Integration** - Direct contact system
- 📧 **Contact Forms** - Lead generation system

### **Admin Dashboard:**

- 🔐 **Secure Authentication** - Clerk integration
- 🏗️ **Project Management** - Complete CRUD operations
- 🏠 **Unit Management** - Individual property units
- 📝 **Content Management** - News, hero sliders, settings
- 📊 **Dashboard Analytics** - Overview and statistics
- 🗂️ **File Management** - Image uploads and galleries
- 🎯 **SEO Tools** - Meta tags and sitemap management
- 📱 **Mobile Admin** - Responsive dashboard

### **Technical Features:**

- ⚡ **Performance Optimized** - Next.js optimizations
- 🔒 **Security Headers** - OWASP compliance
- 📱 **Progressive Web App** - PWA ready
- 🗄️ **Database Integration** - Turso LibSQL
- 🖼️ **Image Optimization** - Cloudinary CDN
- 🤖 **AI Integration** - Genkit for content generation

## 🏗️ Project Structure

```
/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (home)/         # Public pages
│   │   ├── dashboard/      # Admin dashboard
│   │   ├── api/           # API endpoints
│   │   └── auth/          # Authentication pages
│   ├── components/         # Reusable React components
│   ├── lib/               # Utilities and actions
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript definitions
│   └── styles/            # Global styles
├── docs/                  # Documentation
├── scripts/               # Database scripts
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/marudinrofizkarz/paramount-land-website.git
   cd paramount-land-website
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   **Option 1: Interactive Setup (Recommended)**

   ```bash
   npm run setup:env
   ```

   **Option 2: Manual Setup**

   ```bash
   cp .env.example .env.local
   ```

   **Validate your configuration:**

   ```bash
   npm run validate:env
   ```

4. **Configure your `.env.local`:**

   ```env
   # Database
   TURSO_DATABASE_URL=your_turso_database_url
   TURSO_AUTH_TOKEN=your_turso_auth_token

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Google AI
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

Visit [http://localhost:9003](http://localhost:9003) to view the application.

## 📦 Deployment

### 🚨 **CRITICAL: Environment Variables Required**

**Before deploying, you MUST set up environment variables!** See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

The deployment will fail with `URL_INVALID: The URL 'undefined'` error if environment variables are not properly configured.

### Quick Setup:

1. **Set up your services:**

   - [Turso Database](https://turso.tech) - Get database URL and auth token
   - [Clerk Auth](https://clerk.com) - Get publishable key and secret key
   - [Cloudinary](https://cloudinary.com) - Get cloud name and API credentials

2. **Deploy to Vercel:**

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/marudinrofizkarz/paramount-land-website)

   Or manually:

   ```bash
   # Push to GitHub (if not done already)
   git push origin main

   # Deploy via Vercel CLI
   npx vercel
   ```

3. **Configure Environment Variables in Vercel:**
   - Go to your Vercel project → Settings → Environment Variables
   - Add all required variables (see [DEPLOYMENT.md](./DEPLOYMENT.md))
   - Redeploy the project

### 🔧 **Required Environment Variables:**

```env
# Database (CRITICAL - deployment will fail without this)
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_turso_token

# Authentication (CRITICAL)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_secret

# File Storage (CRITICAL)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**📋 Complete list:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for all environment variables and setup instructions.

## 🛡️ Security Features

- **Authentication:** Clerk integration with session management
- **Authorization:** Role-based access control
- **Security Headers:** OWASP compliant headers
- **Input Validation:** Zod schema validation
- **CORS Protection:** API route protection
- **XSS Protection:** Content security policies

## 📊 SEO Features

- **Dynamic Metadata:** Page-specific SEO tags
- **Sitemap Generation:** Automatic XML sitemap
- **Structured Data:** Schema.org markup
- **Open Graph:** Social media optimization
- **Performance:** Core Web Vitals optimized
- **Mobile-First:** Responsive design

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support, email support@paramount-land.com or join our Slack channel.

---

**Built with ❤️ by Paramount Land Team**
