import csvParse from 'csv-parse';
import fs from 'fs';

import { In, getRepository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  public async execute(filePath: string): Promise<Transaction[]> {
    // First, read CSV file contents
    const contactsReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parsers);

    const categories: string[] = [];
    const transactions: CSVTransaction[] = [];

    const categoryRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // CSV 'data' Event: While line is being read from stream
    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);

      transactions.push({ title, type, value, category });
    });

    // CSV 'end' Event: Promise hack -> resolve promise after file is read
    await new Promise(resolve => parseCSV.on('end', resolve));

    // Find out available categories
    const availableCategories = await categoryRepository.find({
      where: In(categories),
    });

    const availableCategoryTitles = availableCategories.map(
      (category: Category) => category.title,
    );

    // Find out (possible) new categories
    const newCategoryTitles = categories
      .filter(category => !availableCategoryTitles.includes(category))
      .filter((category, index, self) => self.indexOf(category) === index);

    // Insert new categories
    const newCategories = categoryRepository.create(
      newCategoryTitles.map(title => ({ title })),
    );

    await categoryRepository.save(newCategories);

    // All categories here
    const finalCategories = [...availableCategories, ...newCategories];

    // Insert new transactions
    const newTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(newTransactions);

    // Delete CSV file
    await fs.promises.unlink(filePath);

    // Get all transactions created
    return newTransactions;
  }
}

export default ImportTransactionsService;
