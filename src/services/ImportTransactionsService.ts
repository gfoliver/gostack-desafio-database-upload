import { Parser } from 'csv-parse'
import CreateTransactionService from './CreateTransactionService';

interface ImportTransactionsDTO {
  file: Express.Multer.File
}

class ImportTransactionsService {
  async execute({ file }: ImportTransactionsDTO): Promise<void> {
    const createTransaction = new CreateTransactionService()
    let output: string[] = [];

    const parser = new Parser({
      delimiter: ', '
    });

    await new Promise(resolve => {
      parser.on('readable', () => {
        let record;
        while (record = parser.read()) {
          output.push(record);
        }
      });

      parser.on('end', async () => {
        for (const item of output) {
          const title = item[0]
          const type = item[1]
          const value = Number(item[2])
          const category = item[3]
  
          if (type == "income" || type == "outcome" && value != NaN)
            await createTransaction.execute({ title, type, value, category });
        }

        resolve();
      });

      parser.write(file.buffer, file.encoding);

      parser.end();
    });

    return;
  }
}

export default ImportTransactionsService;
