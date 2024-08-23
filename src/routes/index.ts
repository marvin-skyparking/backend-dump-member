import express from 'express';
import Transactionrouter from './transaction.routes';
import locationRoute from './location.routes';
import priceLocation from './priceLocation.routes';

const router = express.Router();

router.use('/transaction', Transactionrouter);
router.use('/price', priceLocation);
router.use('/location', locationRoute);

export default router;
