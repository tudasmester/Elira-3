# Elira - Hungarian Online Education Platform

A comprehensive Hungarian online education platform that connects students with courses from various Hungarian universities. Built with modern web technologies and designed for scalable, personalized learning experiences.

## 🚀 Features

### For Students
- **Course Marketplace** - Browse courses from top Hungarian universities
- **Personalized Learning** - Adaptive learning paths based on your goals and experience
- **Interactive Content** - Video lessons, quizzes, and hands-on projects
- **Progress Tracking** - Monitor your learning journey with detailed analytics
- **Mobile Responsive** - Learn anywhere, on any device

### For Universities & Instructors
- **Content Management** - Comprehensive admin panel for course creation
- **Real-time Analytics** - Track student engagement and performance
- **Flexible Publishing** - Draft, preview, and publish courses seamlessly
- **Student Management** - Monitor enrollments and progress

### Platform Features
- **Multi-authentication** - Email, phone, and social login options
- **Premium Subscriptions** - Stripe integration for paid content
- **Real-time Sync** - Live updates across admin and user interfaces
- **Hungarian Localization** - Full Hungarian language support

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **JWT** authentication
- **WebSocket** for real-time features

### Infrastructure
- **Replit** for development and deployment
- **Stripe** for payment processing
- **OpenAI** for AI-powered features
- **Vite** for fast development builds

## 🏗️ Project Structure

```
elira/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── routes/             # API route handlers
│   ├── auth/               # Authentication logic
│   └── db/                 # Database configuration
├── shared/                 # Shared types and schemas
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/elira.git
   cd elira
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=your_postgresql_connection_string
   
   # Authentication
   SESSION_SECRET=your_session_secret
   
   # Stripe (for payments)
   STRIPE_SECRET_KEY=sk_...
   VITE_STRIPE_PUBLIC_KEY=pk_...
   
   # OpenAI (for AI features)
   OPENAI_API_KEY=sk-...
   
   # Admin Setup
   ADMIN_SETUP_SECRET=your_admin_secret
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 📊 Database Schema

The platform uses PostgreSQL with the following main entities:

- **Users** - Student and admin accounts
- **Universities** - Partner institutions
- **Courses** - Educational content
- **Enrollments** - Student-course relationships
- **Lessons** - Individual learning units
- **Quizzes** - Assessment components

For detailed schema information, see [database-constraints-guide.md](database-constraints-guide.md)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate database migrations

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits for version control

## 🚀 Deployment

### Replit Deployment
The application is optimized for Replit deployment:

1. Import your repository to Replit
2. Set up environment variables in the Secrets tab
3. The app will automatically build and deploy

### Manual Deployment
For other platforms:

1. Build the application: `npm run build`
2. Set up environment variables
3. Ensure PostgreSQL database is accessible
4. Start the server: `npm start`

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Session encryption key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | For payments |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key | For payments |
| `OPENAI_API_KEY` | OpenAI API key | For AI features |
| `ADMIN_SETUP_SECRET` | Admin account setup secret | Yes |

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - User logout

### Course Endpoints
- `GET /api/courses` - List all published courses
- `GET /api/courses/:id` - Get course details
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments` - Get user enrollments

### Admin Endpoints
- `GET /api/admin/courses` - List all courses (admin)
- `POST /api/admin/courses` - Create new course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team** - Full-stack development and design
- **Content Team** - Course creation and university partnerships
- **QA Team** - Testing and quality assurance

## 📞 Support

For support, email support@elira.hu or join our community Discord.

## 🙏 Acknowledgments

- Thanks to all Hungarian universities for their partnership
- Shadcn for the excellent UI components
- Replit for the amazing development platform
- All our beta testers and early adopters

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release
- Core learning management system
- University marketplace
- User authentication and profiles
- Payment integration
- Admin dashboard
- Real-time synchronization

---

**Built with ❤️ for Hungarian education**