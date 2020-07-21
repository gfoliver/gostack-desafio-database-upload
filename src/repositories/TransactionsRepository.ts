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
    const transactions = await this.find();
    const income = transactions.filter(t => t.type === "income").map(t => t.value).reduce((a, b) => Number(a) + Number(b), 0);
    const outcome = transactions.filter(t => t.type === "outcome").map(t => t.value).reduce((a, b) => Number(a) + Number(b), 0);
    const total = income - outcome;

    return {
      income,
      outcome,
      total
    }
  }
}

export default TransactionsRepository;
