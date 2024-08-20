import express from 'express';
import Transactionrouter from './transaction.routes';
import locationRoute from './location.routes';

const router = express.Router();

router.use('/transaction', Transactionrouter);
router.use('/location', locationRoute);

export default router;
