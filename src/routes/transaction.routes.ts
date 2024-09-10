import { Router } from 'express';
import * as TransactionController from '../controller/transaction.controller';
import { handleFileUploads } from '../middleware/upload.middleware';
import { upload } from '../middleware/excel.middleware';
import { limiterSpecific } from '../middleware/rateLimit.middleware';

const Transactionrouter = Router();

Transactionrouter.post(
  '/createTransactions',
  limiterSpecific,
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
Transactionrouter.put(
  '/updateStage/:id',
  TransactionController.handleUpdateStatus
);
Transactionrouter.post(
  '/export-dump-data',
  TransactionController.exportDumpDataMembersToExcel
);

Transactionrouter.post(
  '/insertDataMutation',
  upload.single('file'),
  TransactionController.uploadExcelFile
);

Transactionrouter.get(
  '/getDataMutation',
  TransactionController.getMutationData
);
Transactionrouter.post(
  '/findTransactionData',
  TransactionController.getTransactionData
);

Transactionrouter.get(
  '/transactionStatus',
  TransactionController.getTransactionsByStatus
);

export default Transactionrouter;
