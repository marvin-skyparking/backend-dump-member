import { Router } from 'express';
import * as TransactionController from '../controller/transaction.controller';
import { handleFileUploads } from '../middleware/upload.middleware';

const Transactionrouter = Router();

Transactionrouter.post(
  '/createTransactions',
  handleFileUploads,
  TransactionController.createTransaction
);
Transactionrouter.get(
  '/getTransactions',
  TransactionController.getAllTransactions
);
Transactionrouter.get(
  '/getTransactions/:id',
  TransactionController.getTransactionById
);
Transactionrouter.put(
  '/updateTransactions/:id',
  handleFileUploads,
  TransactionController.updateTransaction
);
Transactionrouter.delete(
  '/deleteTransactions/:id',
  TransactionController.deleteTransaction
);
Transactionrouter.get(
  '/transactions/membership-status',
  TransactionController.fetchMembershipStatus
);
Transactionrouter.get('/metrics', TransactionController.getTransactionMetrics);
Transactionrouter.put(
  '/pay/:id',
  TransactionController.updateTransactionPaymentStatus
);
Transactionrouter.get(
  '/export-dump-data',
  TransactionController.exportDumpDataMembersToExcel
);

export default Transactionrouter;
