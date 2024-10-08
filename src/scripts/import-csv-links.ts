import { URL } from 'node:url';
import { parse } from 'csv-parse';
import fs from 'fs';
import dbConnect from '../utils/dbConnect.ts';
import Link from '../models/Link.ts';
import { TelegramService } from '../utils/telegram.ts';

(async () => {
  await dbConnect();
  const __dirname = new URL('.', import.meta.url).pathname;
  console.log(__dirname);
  const records: Array<any> = [];
  // Initialize the parser
  fs.createReadStream(`${__dirname}/data/links.csv`)
    .pipe(parse({ from: 2, delimiter: ';' }))
    .on('data', function (csvRow) {
      records.push(csvRow);
    })
    .on('end', function () {
      //do something with csvData
      (async () => {
        await Link.insertMany(
          records.map((record) => {
            return {
              link: TelegramService.extractUsername(record[0]),
              title: TelegramService.extractUsername(record[0]),
              category: record[1],
              country: record[2],
              city: record[3],
              language: record[4],
              status: 'APPROVED',
              featuredType: 'NONE',
              submittedById: 1253120502,
            };
          }),
          { ordered: false }
        );
      })();
    });
})();
