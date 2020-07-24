import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // incomes
    const incomes = await this.find({ where: { type: 'income' } });

    // outcomes
    const outcomes = await this.find({ where: { type: 'outcome' } });

    // totals
    const incomeTotal = incomes.reduce(
      (total, income) => total + income.value,
      0,
    );

    const outcomeTotal = outcomes.reduce(
      (total, outcome) => total + outcome.value,
      0,
    );

    return {
      income: incomeTotal,
      outcome: outcomeTotal,
      total: incomeTotal - outcomeTotal,
    };
  }
}

export default TransactionsRepository;
