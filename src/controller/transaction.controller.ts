import { Request, Response } from 'express';
import {
  addMonths,
  isAfter,
  isBefore,
  startOfMonth,
  endOfMonth,
  setDate
} from 'date-fns';
import * as TransactionService from '../services/transaction.service';
import { IPaginatePayload } from '../interfaces/pagination.interface';
import axios from 'axios';
import {
  BadRequest,
  NotFound,
  OK,
  ServerError
} from '../utils/response/common.response';
import dumpDataMember from '../model/dumpData.model';
import { insertDumpData, markAsExported } from '../services/dumpData.service';
import { generateRandomNoRef, getCodeProduct } from '../utils/helper.utils';
import { decryptData, encryptData } from '../utils/encrypt.utils';
import { deleteFile } from '../utils/file.utils';
import { markTransactionAsPaid } from '../services/transaction.service';
import MasterLocation from '../model/masterLocation.model';
import ExcelJS from 'exceljs';
import {
  getPaginatedResults,
  processAndInsertExcelData
} from '../services/uploadData.service';
import { getMasterLocationByCode } from '../services/location.service';
import Transaction, {
  StatusProgress,
  TransactionAttributes
} from '../model/dataTransaksi.model';
import EnvConfig from '../config/envConfig';
import { insertActivityLog } from '../services/activityLog.service';

// Define type for the file fields
export async function createTransaction(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const currentDate = new Date();

    // Start and end of the restriction period
    // const startRestriction = setDate(new Date(), 20);
    // const nextMonth = addMonths(new Date(), 1);
    // const endRestriction = setDate(startOfMonth(nextMonth), 5);

    // if (
    //   isBefore(currentDate, startRestriction) ||
    //   isAfter(currentDate, endRestriction)
    // ) {
    //   return BadRequest(
    //     res,
    //     'API access is only allowed between the 20th of this month and the 5th of the next month.'
    //   );
    // }

    // Extract and decrypt payload
    const encryptedPayload: string = req.body.encryptedPayload;
    if (!encryptedPayload) {
      return BadRequest(res, 'Missing encryptedPayload in request body.');
    }

    const decryptedPayload = decryptData(encryptedPayload);
    const {
      fullname,
      phonenumber,
      membershipStatus,
      email,
      vehicletype,
      NoCard,
      PlateNumber,
      locationCode,
      isActive,
      createdBy,
      updatedBy,
      deletedOn,
      deletedBy,
      statusProgress
    } = JSON.parse(decryptedPayload);

    // File handling
    let licensePlate: string | null = null;
    let stnk: string | null = null;
    let paymentFile: string | null = null;

    if (req.files && typeof req.files === 'object') {
      const files = req.files as { [key: string]: Express.Multer.File[] };
      licensePlate = files.licensePlate?.[0]?.filename || null;
      stnk = files.stnk?.[0]?.filename || null;
      paymentFile = files.paymentFile?.[0]?.filename || null;
    }

    // Validation based on membership status
    if (membershipStatus === 'new') {
      if (!stnk || !PlateNumber || !paymentFile) {
        return BadRequest(
          res,
          'Untuk Member Baru Silahkan Upload Foto STNK, PLAT NOMOR & Bukti Bayar.'
        );
      }
    } else if (membershipStatus === 'extend') {
      if (!paymentFile || !NoCard) {
        return BadRequest(
          res,
          'Untuk Perpanjangan Silahkan Nomor Kartu & Upload Bukti Bayar.'
        );
      }
    } else {
      return BadRequest(res, 'Invalid membership status.');
    }

    const NoRef = generateRandomNoRef();

    // Transaction data preparation
    const transactionData = {
      fullname,
      phonenumber,
      membershipStatus,
      email,
      vehicletype,
      NoCard,
      PlateNumber,
      licensePlate,
      stnk,
      paymentFile,
      locationCode,
      NoRef,
      isActive,
      createdBy,
      updatedBy,
      deletedOn,
      deletedBy,
      statusProgress
    };

    // Quota check
    const location = await getMasterLocationByCode(locationCode);
    if (!location) {
      return BadRequest(res, 'Location not found.');
    }

    const isQuotaSufficient =
      (location.QuotaMobilRemaining > 0 &&
        location.cardMobilRemaining > 0 &&
        vehicletype === 'MOBIL') ||
      (location.QuotaMotorRemaining > 0 &&
        location.cardMotorRemaining > 0 &&
        vehicletype === 'MOTOR');

    if (!isQuotaSufficient) {
      return BadRequest(
        res,
        'Quota Kartu atau Kapasitas habis Silahkan Hubungi CS'
      );
    }

    let transaction;
    if (membershipStatus === 'new') {
      transaction = await TransactionService.createTransaction(transactionData);
    } else if (membershipStatus === 'extend') {
      const updatedTransactionData = {
        ...transactionData, // Spread existing properties
        isBayar: false, // Set isBayar to false
        statusProgress: StatusProgress.NEW //Set to new again
      };

      const transaction = await TransactionService.updateTransactionData(
        NoCard,
        updatedTransactionData
      );
    }

    // Ensure transaction is not undefined
    if (!transaction) {
      return ServerError(
        req,
        res,
        'Transaction could not be created or updated.'
      );
    }

    // Update location quota
    if (vehicletype === 'MOBIL') {
      location.quotaMobil -= 1;
    } else if (vehicletype === 'MOTOR') {
      location.quotaMotor -= 1;
    }
    await location.save();

    // Calculate TGLAKHIR
    const nextMonthForTGLAKHIR = addMonths(new Date(), 1);
    const TGLAKHIR = setDate(startOfMonth(nextMonthForTGLAKHIR), 6);

    // Insert dump data
    const dumpMember = {
      nama: fullname,
      noPolisi: PlateNumber,
      idProdukPass: vehicletype,
      TGL_AKHIR: TGLAKHIR,
      idGrup: 'UPH',
      NoKartu: NoCard,
      Payment: 'BELUM BAYAR',
      FAKTIF: 1,
      FUPDATE: 1,
      CodeProduct: getCodeProduct(vehicletype),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await insertDumpData(dumpMember);

    let transactionObject: Transaction;

    if (Array.isArray(transaction)) {
      // When transaction is an array, extract the first transaction from the array
      transactionObject = transaction[1][0];
    } else if (transaction) {
      // When transaction is a single Transaction object
      transactionObject = transaction;
    } else {
      return BadRequest(res, 'Failed to create or update transaction.');
    }

    // Encrypt and return response
    const encryptedResponse = encryptData(transaction);

    return OK(res, 'Data Transaction Created Successfully', encryptedResponse);
  } catch (error: any) {
    console.error('Error in createTransaction:', error);
    return ServerError(
      req,
      res,
      error?.message || 'Failed to create transaction',
      error
    );
  }
}

// Get all transactions with pagination and search
export async function getAllTransactions(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    // Convert query parameters to the IPaginatePayload type
    const payload: IPaginatePayload = {
      page: parseInt(req.query.page as string, 10) || 1,
      limit: parseInt(req.query.limit as string, 10) || 10,
      search: (req.query.search as string) || '',
      isDropdown: req.query.isDropdown === 'true'
    };

    // Call the service to get transactions
    const { rows, count } =
      await TransactionService.getAllTransactions(payload);

    // Calculate currentPage
    const currentPage = payload.page;

    // Return response with transactions, totalCount, and currentPage
    return OK(res, 'Data Transactions Fetched Successfully', {
      transactions: rows,
      totalPages: Math.ceil(count / (payload.limit ?? 10)),
      totalCount: count,
      currentPage
    });
  } catch (error: any) {
    // Return server error if something goes wrong
    return ServerError(req, res, error?.message, error);
  }
}
// Get a transaction by ID
export async function getTransactionById(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const id = parseInt(req.params.id, 10); // Convert ID to number
    const transaction = await TransactionService.getTransactionById(id);
    if (!transaction) {
      return NotFound(res, 'Transaction not found');
    }
    return OK(res, 'Data Transaction Fetched Successfully', transaction);
  } catch (error: any) {
    return ServerError(req, res, error?.message, error);
  }
}

// Update a transaction by ID
export async function updateTransaction(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const id = parseInt(req.params.id, 10); // Convert ID to number

    // Extract data from request body
    const {
      fullname,
      phonenumber,
      membershipStatus,
      email,
      vehicletype,
      NoCard,
      PlateNumber,
      locationCode,
      isActive,
      createdBy,
      updatedBy,
      deletedOn,
      deletedBy,
      statusProgress
    } = req.body;

    // Extract files from req.files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Fetch the existing transaction to get old file paths
    const existingTransaction = await TransactionService.getTransactionById(id);
    if (!existingTransaction) {
      return NotFound(res, 'Transaction not found');
    }

    // Delete old files if they exist
    if (existingTransaction.licensePlate)
      deleteFile(existingTransaction.licensePlate);
    if (existingTransaction.stnk) deleteFile(existingTransaction.stnk);
    if (existingTransaction.paymentFile)
      deleteFile(existingTransaction.paymentFile);

    // Get new file paths
    const licensePlate = files['licensePlate']
      ? files['licensePlate'][0].path
      : existingTransaction.licensePlate;
    const stnk = files['stnk']
      ? files['stnk'][0].path
      : existingTransaction.stnk;
    const paymentFile = files['paymentFile']
      ? files['paymentFile'][0].path
      : existingTransaction.paymentFile;

    const updatedData = {
      fullname,
      phonenumber,
      membershipStatus,
      email,
      vehicletype,
      NoCard,
      PlateNumber,
      licensePlate,
      stnk,
      paymentFile,
      locationCode,
      isActive,
      createdBy,
      updatedBy,
      deletedOn,
      deletedBy,
      statusProgress
    };

    // Update the transaction
    const [updatedCount, updatedRows] =
      await TransactionService.updateTransaction(id, updatedData);

    if (updatedCount === 0) {
      return NotFound(res, 'Transaction not found');
    }

    return OK(res, 'Data Transaction Updated Successfully', updatedRows[0]);
  } catch (error: any) {
    console.error('Error updating transaction:', error);
    return ServerError(req, res, error?.message, error);
  }
}

// Delete a transaction by ID
export async function deleteTransaction(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const id = parseInt(req.params.id, 10); // Convert ID to number
    const deletedCount = await TransactionService.deleteTransaction(id);
    if (deletedCount === 0) {
      return NotFound(res, 'Transaction not found');
    }
    return OK(res, 'Data Transaction Deleted Successfully');
  } catch (error: any) {
    return ServerError(req, res, error?.message, error);
  }
}

// Fetch membership status
export async function fetchMembershipStatus(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { email, phoneNumber } = req.query as {
      email: string;
      phoneNumber: string;
    };
    const status = await TransactionService.fetchMembershipStatus(
      email,
      phoneNumber
    );
    if (!status) {
      return NotFound(res, 'Membership status not found');
    }
    return OK(res, 'Membership Status Fetched Successfully', {
      membershipStatus: status
    });
  } catch (error: any) {
    return ServerError(req, res, error?.message, error);
  }
}

export async function getTransactionMetrics(req: Request, res: Response) {
  try {
    const [
      newMembersCount,
      takeCount,
      doneCount,
      progressCount,
      countStatusMembership,
      countAllTransactions,
      addDataLastMonthCount,
      countExtendMember
    ] = await Promise.all([
      TransactionService.countNewMembers(),
      TransactionService.countStatusProgressTake(),
      TransactionService.countStatusProgressDone(),
      TransactionService.countStatusProgressProgress(),
      TransactionService.countStatusMembership(),
      TransactionService.countAllTransactions(),
      TransactionService.countStatusProgressAddDataLastMonth(),
      TransactionService.countExtendMember()
    ]);

    res.status(200).json({
      newMembersCount,
      takeCount,
      doneCount,
      countStatusMembership,
      progressCount,
      countAllTransactions,
      addDataLastMonthCount,
      countExtendMember
    });
  } catch (error: any) {
    return ServerError(req, res, error?.message, error);
  }
}

export async function exportDumpDataMembersToExcel(
  req: Request,
  res: Response
): Promise<any> {
  const { admin_user } = req.body;

  try {
    // Fetch dump data members that have not been exported yet and have Payment as 'BELUM BAYAR'
    const dumpDataMembers = await dumpDataMember.findAll({
      where: {
        isExported: false,
        Payment: 'BAYAR' // Only fetch records where Payment is 'BAYAR'
      }
    });

    if (dumpDataMembers.length === 0) {
      return NotFound(res, 'No data available for export.');
    }

    const activityLogData = {
      module_name: 'EXPORT_STAGE',
      finance_approval: '', // Save ApprovedBy to finance_approval
      admin_user: admin_user, // You can adjust this if necessary
      admin_stage: 'EXPORT_DATA_TO_POST', // Adjust as needed
      status: JSON.stringify(dumpDataMembers), // Adjust status based on your requirements
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const addActivityLogs = await insertActivityLog(activityLogData);

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Dump Data Members');

    // Define columns
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'nama', width: 30 },
      { header: 'Plate Number', key: 'noPolisi', width: 20 },
      { header: 'Product ID', key: 'idProdukPass', width: 20 },
      { header: 'Payment', key: 'Payment', width: 15 },
      { header: 'Product Code', key: 'CodeProduct', width: 15 },
      { header: 'End Date', key: 'TGL_AKHIR', width: 20 },
      { header: 'Group ID', key: 'idGrup', width: 15 },
      { header: 'Active', key: 'FAKTIF', width: 10 },
      { header: 'Updated', key: 'FUPDATE', width: 10 },
      { header: 'Card Number', key: 'NoKartu', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 }
    ];

    // Add rows
    const memberIds: number[] = [];
    dumpDataMembers.forEach((member) => {
      worksheet.addRow({
        id: member.id,
        nama: member.nama,
        noPolisi: member.noPolisi,
        idProdukPass: member.idProdukPass,
        Payment: member.Payment,
        CodeProduct: member.CodeProduct,
        TGL_AKHIR: member.TGL_AKHIR,
        idGrup: member.idGrup,
        FAKTIF: member.FAKTIF,
        FUPDATE: member.FUPDATE,
        NoKartu: member.NoKartu,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt
      });

      // Collect member IDs to mark them as exported later
      memberIds.push(member.id);
    });

    // Set response headers to indicate the file type
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=dumpDataMembers.xlsx'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

    // Mark members as exported
    await markAsExported(memberIds);
  } catch (error: any) {
    return ServerError(req, res, error?.message, error);
  }
}
//Update Transaction
export async function updateTransactionPaymentStatus(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const id = parseInt(req.params.id, 10);

    // Validate that id is a number
    if (isNaN(id)) {
      return BadRequest(res, 'Invalid transaction ID.');
    }

    // Fetch transaction details
    const records = await TransactionService.findTransactionById(id);

    // Check if records are found
    if (!records) {
      return NotFound(res, 'No records found.');
    }

    // Extract data from records
    const noCard = records.NoCard; // Adjust if necessary
    const plateNumber = records.PlateNumber; // Adjust if necessary

    if (records.isBayar === true) {
      return BadRequest(res, 'Transaksi Sudah Dibayar');
    }
    // Extract ApprovedBy from request body
    const { ApprovedBy } = req.body; // Assuming ApprovedBy is sent in the request body
    // Mark transaction as paid
    const { affectedRows, updatedTransactions } = await markTransactionAsPaid(
      id,
      ApprovedBy
    );

    // Update payment status in dump data
    const updateDump = await TransactionService.updatePaymentStatusByFields(
      noCard,
      plateNumber
    );

    const activityLogData = {
      module_name: 'FINANCE_APPROVAL',
      finance_approval: ApprovedBy, // Save ApprovedBy to finance_approval
      admin_user: '', // You can adjust this if necessary
      admin_stage: '', // Adjust as needed
      status: JSON.stringify(records), // Adjust status based on your requirements
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const addActivityLogs = await insertActivityLog(activityLogData);
    // Check if the transaction was updated
    if (affectedRows === 0) {
      return BadRequest(res, `Transaction with ID ${id} not found.`);
    }

    // Return success response
    return OK(res, 'Transaction marked as paid successfully.', updateDump);
  } catch (error: any) {
    // Return error response
    return ServerError(
      req,
      error.message || 'Failed to update transaction payment status',
      error
    );
  }
}

export const uploadExcelFile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    if (!req.file) {
      return BadRequest(res, 'No File Uploaded');
    }

    // Process and insert data from the uploaded file's buffer
    await processAndInsertExcelData(req.file.buffer);

    // Respond with success
    return OK(res, 'File processed and data inserted successfully');
  } catch (error: any) {
    // Return error response
    return ServerError(req, error.message || 'Failed to upload file', error);
  }
};

export async function getMutationData(req: Request, res: Response) {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const paginationPayload: IPaginatePayload = {
      page: Number(page),
      limit: Number(limit),
      search: String(search)
    };

    const currentPage = paginationPayload.page;
    // Use the service to get paginated results
    const paginatedResults = await getPaginatedResults(
      paginationPayload.page || 1,
      paginationPayload.limit || 10,
      paginationPayload.search || ''
    );

    const responsePayload = {
      currentPage,
      ...paginatedResults
    };

    return OK(res, 'Data Transaction Updated Successfully', responsePayload);
  } catch (error: any) {
    return ServerError(req, res, error?.message, error);
  }
}

export const getTransactionData = async (req: Request, res: Response) => {
  const { NoCardOrEmail } = req.body; // Assuming you're sending these in the request body

  try {
    // Call the service to find the transaction
    const transaction =
      await TransactionService.findTransactionData(NoCardOrEmail);

    if (!transaction) {
      return NotFound(res, 'Transaction not found');
    }

    // Return the found transaction
    return OK(res, 'Get Data Transaction Successfully', transaction);
  } catch (error: any) {
    return ServerError(req, res, error?.message, error);
  }
};

const allowedTransitions: { [key in StatusProgress]: StatusProgress[] } = {
  [StatusProgress.NEW]: [StatusProgress.PROGRESS],
  [StatusProgress.PROGRESS]: [StatusProgress.DONE, StatusProgress.TAKE],
  [StatusProgress.DONE]: [], // Cannot go back to TAKE
  [StatusProgress.TAKE]: [StatusProgress.DONE, StatusProgress.PROGRESS]
};

export async function handleUpdateStatus(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = req.params;
  const { status, admin_user } = req.body;

  if (!status || !Object.values(StatusProgress).includes(status)) {
    return BadRequest(res, 'Invalid status Provided');
  }

  try {
    const currentTransaction = await Transaction.findByPk(id);

    if (!currentTransaction) {
      return NotFound(res, 'Transaction Not Found');
    }

    const currentStatus = currentTransaction.statusProgress;
    if (!allowedTransitions[currentStatus].includes(status as StatusProgress)) {
      return BadRequest(
        res,
        `Invalid transition from ${currentStatus} to ${status}`
      );
    }

    const updatedTransaction = await TransactionService.updateStatusProgress(
      Number(id),
      status as StatusProgress
    );

    if (status === 'take' && updatedTransaction?.membershipStatus === 'new') {
      const fullname = updatedTransaction?.fullname;
      const phoneNumber = updatedTransaction?.phonenumber;
      const noRef = updatedTransaction?.NoRef;

      const fonteAPI =
        EnvConfig.FONTE_ENDPOINT +
        '?token=' +
        EnvConfig.FONTE_TOKEN +
        '&target=' +
        phoneNumber +
        '&message=' +
        `Hi ${fullname}, Silahkan Ambil Kartu dengan Antrian ${noRef}`;

      try {
        const response = await axios.get(fonteAPI);
        //console.log('API response:', response.data);
      } catch (apiError) {
        //console.error('Error calling Fonte API:', apiError);
      }
    } else if (
      status === 'take' &&
      updatedTransaction?.membershipStatus === 'extend'
    ) {
      const id = updatedTransaction?.id;
      const fullname = updatedTransaction?.fullname;
      const phoneNumber = updatedTransaction?.phonenumber;
      const noRef = updatedTransaction?.NoRef;
      const noCard = updatedTransaction?.NoCard;

      const fonteAPI =
        EnvConfig.FONTE_ENDPOINT +
        '?token=' +
        EnvConfig.FONTE_TOKEN +
        '&target=' +
        phoneNumber +
        '&message=' +
        `Hi ${fullname}, Member anda sudah di perpanjang masa aktifnya terimakasih dengan Nomor Kartu ${noCard} dengan Nomor Antrian ${noRef}`;

      try {
        const response = await axios.get(fonteAPI);
        if (response) {
          await TransactionService.updateStatusProgress(
            id,
            StatusProgress.DONE
          );
        }
        //console.log('API response:', response.data);
      } catch (apiError) {
        //console.error('Error calling Fonte API:', apiError);
      }
    }

    const activityLogData = {
      module_name: 'ADMIN_STAGE',
      finance_approval: '', // Save ApprovedBy to finance_approval
      admin_user: admin_user, // You can adjust this if necessary
      admin_stage: status, // Adjust as needed
      status: JSON.stringify(updatedTransaction), // Adjust status based on your requirements
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const addActivityLogs = await insertActivityLog(activityLogData);

    return res.status(200).json(updatedTransaction);
  } catch (error: any) {
    //console.error('Error updating transaction status:', error);
    return ServerError(
      req,
      res,
      error?.message || 'Failed to Update Transaction Status',
      error
    );
  }
}
