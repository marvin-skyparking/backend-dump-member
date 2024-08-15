import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import indexRoutes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import cors from 'cors';
import 'reflect-metadata';


// Initialize express app and disable 'x-powered-by' header for security
const app = express().disable('x-powered-by');

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for parsing JSON bodies in requests
app.use(express.json());

// Enable CORS with default settings (you can customize this based on your needs)
app.use(cors());

// Middleware for parsing application/x-www-form-urlencoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
