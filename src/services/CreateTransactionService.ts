import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface ServiceRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: ServiceRequest): Promise<Transaction> {
    // don't create outcome transaction if balance is not valid
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError(
        'Avoid creating outcome transactions while your balance is not valid',
      );
    }

    // look for existing tags, so that you won't create it
    const categoriesRepository = getRepository(Category);

    const categoryFound = await categoriesRepository.findOne({
      where: { title: category },
    });

    // create tag when it doesn't exist
    let categoryId = categoryFound ? categoryFound.id : '';

    if (!categoryFound) {
      const newCategory = categoriesRepository.create({ title: category });

      await categoriesRepository.save(newCategory);

      categoryId = newCategory.id;
    }

    // create new transaction
    const newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryId,
    });

    await transactionsRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
