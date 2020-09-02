import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const transactionExist = await transactionsRepository.findOne(id);

    if (!transactionExist) {
      throw new AppError('Transaction does not exist', 404);
    }

    // await transactionsRepository.delete(id);

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
