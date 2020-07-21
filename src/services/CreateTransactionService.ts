import Transaction from '../models/Transaction';
import Category from '../models/Category';
import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface createTransactionDTO extends Pick<Transaction, 'value' | 'type' | 'title'> {
  category: string
}

class CreateTransactionService {
  public async execute({ title, category, type, value }: createTransactionDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const { total: balance } = await transactionsRepository.getBalance();
    if (type == "outcome" &&  value > balance) {
      throw new Error("Unsuficient funds")
    }

    const categoryFound = await categoriesRepository.findOne({ where: { title: category } });

    if (categoryFound) {
      const transaction = await transactionsRepository.save(
        transactionsRepository.create({title, type, value, category_id: categoryFound.id})
      );

      return transaction;
    }
    else {
      const cat = categoriesRepository.create({ title: category });
      const newCategory = await categoriesRepository.save(cat);
      const transaction = await transactionsRepository.save(
        transactionsRepository.create({title, type, value, category_id: newCategory.id})
      );

      return transaction;
    }
  }
}

export default CreateTransactionService;
