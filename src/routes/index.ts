import express from 'express'
import Transactionrouter from './transaction.routes';

const router = express.Router();


router.use('/transaction', Transactionrouter);

export default router; 