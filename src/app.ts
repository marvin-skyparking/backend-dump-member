import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import indexRoutes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import cors from 'cors';
import 'reflect-metadata';
import path from 'path';

// Initialize express app and disable 'x-powered-by' header for security
const app = express().disable('x-powered-by');

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for parsing JSON bodies in requests
app.use(express.json());
app.set('trust proxy', 1);

//Otigin
const corsOptions = {
  origin: ['http://localhost:3000', 'https://inject.skyparking.online'], // Replace with your specific allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Enable this if you need to allow cookies or authentication headers
};

// Enable CORS with default settings (you can customize this based on your needs)
app.use(cors(corsOptions));

// Middleware for parsing application/x-www-form-urlencoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger setup for API documentation (enabled based on environment variable)
const enableSwagger = process.env.ENABLE_SWAGGER === 'true';
if (enableSwagger) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Example route prefix for your application (e.g., /v1)
app.use('/v1', indexRoutes);

// Handle 404 errors for any unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

export default app;
