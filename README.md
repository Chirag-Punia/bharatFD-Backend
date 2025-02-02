# ADMIN CREDENTIALS 
EMAIL - admin@example.com
PASSWORD - admin123

# Multilingual FAQ System

A production-ready FAQ management system with automatic translation capabilities, built with React, Express, MongoDB, and Redis.

## 🌟 Features

- 🌐 Multilingual support with automatic translation
- 📝 Rich text editor for FAQ content (TinyMCE)
- 🔍 Real-time search with fuzzy matching
- 🚀 Redis caching for improved performance
- 🔒 Secure admin panel with JWT authentication
- 💾 MongoDB for data persistence
- 🎨 Modern, responsive UI with Tailwind CSS
- 🐳 Docker and Kubernetes ready
- 🔄 Auto-scaling support
- 📊 Analytics dashboard

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, TinyMCE
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Caching**: Redis
- **Translation**: Google Cloud Translation API
- **Containerization**: Docker, Kubernetes
- **Testing**: Jest, React Testing Library

## ⚙️ Prerequisites

- Node.js 16+
- MongoDB 5+
- Redis 6+
- Docker (optional)
- Kubernetes (optional)
- Google Cloud account with Translation API enabled

## 🚀 Quick Start

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/Chirag-Punia/bharatFD-Backend
   cd bharatFD-Backend
   ```

2. Install dependencies:

   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd frontend && npm install
   ```

3. Start development servers:

   ```bash
   # Backend (http://localhost:5003)
   cd backend && npm run dev

   # Frontend (http://localhost:5173)
   cd frontend && npm start
   ```

### 🐳 Docker Development

```bash
# Start all services
docker-compose up --build

# Start specific service
docker-compose up frontend --build
```

## 🔐 Environment Variables

### Backend (.env)

```bash
MONGODB_URI=mongodb://localhost:27017/faq_system
REDIS_URL=redis://localhost:6379
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
JWT_SECRET=your-secret-key
PORT=5003
NODE_ENV=development
```

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:5003/api
VITE_TINYMCE_API_KEY=your-tinymce-key
```

## 📚 API Documentation

### Authentication

| Method | Endpoint          | Description |
| ------ | ----------------- | ----------- |
| POST   | `/api/auth/login` | Admin login |

### FAQ Management

| Method | Endpoint                  | Description    |
| ------ | ------------------------- | -------------- |
| GET    | `/api/faqs`               | List all FAQs  |
| GET    | `/api/faqs/:id`           | Get single FAQ |
| POST   | `/api/faqs`               | Create FAQ     |
| PUT    | `/api/faqs/:id`           | Update FAQ     |
| DELETE | `/api/faqs/:id`           | Delete FAQ     |
| POST   | `/api/faqs/:id/translate` | Translate FAQ  |

## 🚀 Deployment

This application is currently deployed using:

- Frontend: Vercel
- Backend: Google Cloud Run
- Redis: Render Redis Service

### Kubernetes Deployment

#### Prerequisites

- Docker
- Kubernetes (Kind cluster)
- kubectl CLI

#### Quick Start with Kubernetes

1. Create and configure your Kind cluster:

   ```bash
   kind create cluster
   ```

2. Build and deploy the application:

   ```bash
   chmod +x k8s/build.sh k8s/build-and-deploy.sh
   ./k8s/build-and-deploy.sh
   ```

3. Verify the deployment:

   ```bash
   kubectl get all -n faq-system
   ```

4. Access the services:
   ```bash
   # Get service details
   kubectl get services -n faq-system
   ```

**Note**: For production environments, consider using:

- Ingress controllers
- NodePort services
- Cloud load balancers
- Service mesh solutions

#### Useful Kubernetes Commands

```bash
# View pods
kubectl get pods -n faq-system

# View logs
kubectl logs -f -l app=frontend -n faq-system
kubectl logs -f -l app=backend -n faq-system

# SSH into containers
kubectl exec -it <pod-name> -n faq-system -- /bin/sh

# Delete deployment
kubectl delete -f k8s/
```

## ⚡ Performance Optimization

- Redis caching with automatic invalidation
- Response compression (gzip)
- Static asset optimization
- Image optimization

## 🔒 Security Features

- JWT authentication
- CORS configuration
- Input validation and sanitization
- XSS protection
- Security headers (Helmet)
- Password hashing (bcrypt)

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Run e2e tests
npm run test:e2e
```

## 📈 Monitoring

- Health check endpoints
- Error tracking
- Performance monitoring
- Usage analytics
- Audit logging

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TinyMCE](https://www.tiny.cloud/) for the rich text editor
- [Google Cloud](https://cloud.google.com/) for translation services
- [TailwindCSS](https://tailwindcss.com/) for the UI framework

## 📧 Support

For support, email support@yourdomain.com or open an issue in the repository.
