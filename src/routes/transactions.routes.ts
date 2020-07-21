import { Router } from 'express';
import { getCustomRepository, TransactionRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import createTransactionService from '../services/CreateTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import multer from 'multer'

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return response.json({
    transactions,
    balance
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransaction = new createTransactionService();

  try {
    const transaction = await createTransaction.execute({ title, category, type, value });

    return response.json(transaction);
  }
  catch({ message }) {
    return response.status(400).json({ status: "error", message });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  await transactionsRepository.delete({ id });

  return response.status(202).json({});
});

const upload = multer({ storage: multer.memoryStorage() })

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const importTransactions = new ImportTransactionsService()
  const file = request.file

  await importTransactions.execute({ file });
  return response.json({});
});

export default transactionsRouter;
