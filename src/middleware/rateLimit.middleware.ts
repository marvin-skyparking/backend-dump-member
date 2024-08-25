import rateLimit from 'express-rate-limit';
import EnvConfig from '../config/envConfig';

export const limiterSpecific = rateLimit({
  windowMs: EnvConfig.WMS_F * 60 * 1000,
  max: EnvConfig.MAX_F,
  message: 'Too Many Request'
});

export const limiterGlobal = rateLimit({
  windowMs: EnvConfig.WMS_S * 60 * 1000,
  max: EnvConfig.MAX_S,
  message: 'Too Many Request'
});
