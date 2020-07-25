import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface ServiceRequest {
  transaction_id: string;
}

class DeleteTransactionService {
  public async execute({ transaction_id }: ServiceRequest): Promise<void> {
    // Check if there is transaction with the given id
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionFound = await transactionsRepository.findOne(
      transaction_id,
    );

    if (!transactionFound) {
      throw new AppError('Transaction not found.');
    }

    // delete transaction
    await transactionsRepository.delete(transaction_id);
  }
}

export default DeleteTransactionService;
