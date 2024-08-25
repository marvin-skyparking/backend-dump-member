import { Router } from 'express';
import * as TransactionController from '../controller/transaction.controller';
import { handleFileUploads } from '../middleware/upload.middleware';
import { upload } from '../middleware/excel.middleware';

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

Transactionrouter.post(
  '/insertDataMutation',
  upload.single('file'),
  TransactionController.uploadExcelFile
);

Transactionrouter.get(
  '/getDataMutation',
  TransactionController.getMutationData
);

export default Transactionrouter;
