import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
// import { getCustomRepository, getRepository } from 'typeorm';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
// import Category from '../models/Category';
// import TransactionsRepository from '../repositories/TransactionsRepository';
// import transactionsRouter from '../routes/transactions.routes';
import CreateTransactionService from './CreateTransactionService';

interface ServiceRequest {
  fileName: string;
}

class ImportTransactionsService {
  public async execute({ fileName }: ServiceRequest): Promise<Transaction[]> {
    // Read and Parse CSV Stream
    const csvFile = path.join(uploadConfig.directory, fileName);

    const readCsvStream = fs.createReadStream(csvFile);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCsv = readCsvStream.pipe(parseStream);

    const transactions: Transaction[] = [];

    parseCsv.on('data', ([title, type, value, category]) => {
      // TODO Create transaction
      const createTransaction = new CreateTransactionService();

      createTransaction
        .execute({ title, value, type, category })
        .then(transaction => {
          transactions.push(transaction);
        });
    });

    await new Promise(resolve => {
      parseCsv.on('end', () => {
        fs.unlinkSync(csvFile);
        resolve();
      });
    });

    return transactions;
  }
}

export default ImportTransactionsService;
