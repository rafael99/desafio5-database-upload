import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
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
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError(
        'The outcome value is higher than the total value',
        400,
      );
    }

    let transactionsCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!transactionsCategory) {
      transactionsCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionsCategory);
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category: transactionsCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
