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
import {
  BadRequest,
  NotFound,
  OK,
  ServerError
} from '../utils/response/common.response';
import dumpDataMember from '../model/dumpData.model';
import { insertDumpData, markAsExported } from '../services/dumpData.service';
import { getCodeProduct } from '../utils/helper.utils';
import { decryptData, encryptData } from '../utils/encrypt.utils';
import { deleteFile } from '../utils/file.utils';
import { markTransactionAsPaid } from '../services/transaction.service';
import MasterLocation from '../model/masterLocation.model';
import ExcelJS from 'exceljs';

// Define type for the file fields
export async function createTransaction(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    // Get the current date
    const currentDate = new Date();

    // Start of the restriction period: 20th of the current month
    const startRestriction = setDate(new Date(), 20);

    // End of the restriction period: 5th of the next month
    const nextMonth = addMonths(new Date(), 1);
    const endRestriction = setDate(startOfMonth(nextMonth), 5);

    // Check if the current date falls within the restricted period
    if (
      isBefore(currentDate, startRestriction) ||
      isAfter(currentDate, endRestriction)
    ) {
      return BadRequest(
        res,
        'API access is only allowed between the 20th of this month and the 5th of the next month.'
      );
    }

    // Extract encryptedPayload from request body
    const encryptedPayload: string = req.body.encryptedPayload;

    if (!encryptedPayload) {
      return BadRequest(res, 'Missing encryptedPayload in request body.');
    }

    // Decrypt the payload
    const decryptedPayload = decryptData(encryptedPayload);

    // Parse the decrypted payload into JSON
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

    // Initialize file variables
    let licensePlate: string | null = null;
    let stnk: string | null = null;
    let paymentFile: string | null = null;

    // Check if req.files is defined and is an object
    if (req.files && typeof req.files === 'object') {
      const files = req.files as { [key: string]: Express.Multer.File[] };

      // Extract file names if they exist
      licensePlate = files.licensePlate
        ? files.licensePlate[0]?.filename || null
        : null;
      stnk = files.stnk ? files.stnk[0]?.filename || null : null;
      paymentFile = files.paymentFile
        ? files.paymentFile[0]?.filename || null
        : null;
    }

    // Prepare transaction data
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
      isActive,
      createdBy,
      updatedBy,
      deletedOn,
      deletedBy,
      statusProgress
    };

    // Check if there is enough quota available for the vehicle type
    const location = await MasterLocation.findOne({ where: { locationCode } });

    if (!location) {
      return BadRequest(res, 'Location not found.');
    }

    const isQuotaSufficient =
      (location.quotaMobil > 0 && vehicletype === 'MOBIL') ||
      (location.quotaMotor > 0 && vehicletype === 'MOTOR');

    if (!isQuotaSufficient) {
      return BadRequest(res, 'Quota habis.');
    }

    // Create transaction
    const transaction =
      await TransactionService.createTransaction(transactionData);

    // Update quota remaining
    if (vehicletype === 'MOBIL') {
      location.cardMobilRemaining -= 1;
      location.QuotaMobilRemaining = (location.QuotaMobilRemaining || 0) - 1;
    } else if (vehicletype === 'MOTOR') {
      location.cardMotorRemaining -= 1;
      location.QuotaMotorRemaining = (location.QuotaMotorRemaining || 0) - 1;
    }

    await location.save();

    // Calculate TGLAKHIR
    const nextMonthForTGLAKHIR = addMonths(new Date(), 1);
    const TGLAKHIR = setDate(startOfMonth(nextMonthForTGLAKHIR), 6);

    // Prepare dumpData payload
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

    // Insert dump data
    const dumpData = await insertDumpData(dumpMember);
    // Encrypt response data
    const encryptedResponse = encryptData(transaction);

    // Return success response with encrypted data
    return OK(res, 'Data Transaction Created Successfully', encryptedResponse);
  } catch (error: any) {
    // Return error response
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
      countAllTransactions,
      addDataLastMonthCount,
      countExtendMember
    ] = await Promise.all([
      TransactionService.countNewMembers(),
      TransactionService.countStatusProgressTake(),
      TransactionService.countStatusProgressDone(),
      TransactionService.countStatusProgressProgress(),
      TransactionService.countAllTransactions(),
      TransactionService.countStatusProgressAddDataLastMonth(),
      TransactionService.countExtendMember()
    ]);

    res.status(200).json({
      newMembersCount,
      takeCount,
      doneCount,
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
  try {
    // Fetch dump data members that have not been exported yet and have Payment as 'BELUM BAYAR'
    const dumpDataMembers = await dumpDataMember.findAll({
      where: {
        isExported: false,
        Payment: 'BAYAR' // Only fetch records where Payment is 'BAYAR'
      }
    });

    if (dumpDataMembers.length === 0) {
      return res.status(404).send('No data available for export.');
    }

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
      return res.status(404).json({ message: 'No records found.' });
    }

    // Extract data from records
    const noCard = records.NoCard; // Adjust if necessary
    const plateNumber = records.PlateNumber; // Adjust if necessary

    // Mark transaction as paid
    const { affectedRows, updatedTransactions } =
      await markTransactionAsPaid(id);

    // Update payment status in dump data
    const updateDump = await TransactionService.updatePaymentStatusByFields(
      noCard,
      plateNumber
    );

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
