import * as Sentry from '@sentry/node';
import EnvConfig from '../config/envConfig';

const SENTRY_DSN = EnvConfig.SENTRY_URI; // Ensure SENTRY_URI is defined in your env config

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development', // Optional: Set environment
});

// Function to send errors to Sentry
const send = async (error: any) => {
  Sentry.captureException(error);
};

export default {
  send: send,
  // errorHandler: Sentry.Handlers.errorHandler(),
  // requestHandler: Sentry.Handlers.requestHandler(),
};
