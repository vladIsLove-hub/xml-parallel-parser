import { IParser } from "./typings";
import fs from 'fs';
import { Transform } from 'stream'
import path from "path";
import { parseStringPromise } from 'xml2js';

class Parser implements IParser {
  public async execute(xmlsGroup: string[]): Promise<void> {
    for (const xml of xmlsGroup) {
      this.writeAsync(xml);
    }
  }

  private async writeAsync(xmlPath: string): Promise<void> {
    const readStream = fs.createReadStream(xmlPath, 'utf-8');
    const writeStream = fs.createWriteStream(path.resolve(__dirname, `../../../json/${path.basename(xmlPath)}.json`));

    const transformXmlToJson = new Transform({
      async transform(chunk, encoding = 'utf-8', callback) {
        try {
          const jsonFromXml = await parseStringPromise(chunk.toString(), { async: true });
          callback(null, JSON.stringify(jsonFromXml, null, 4));
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw error;
        }
      }
    });

    readStream.pipe(transformXmlToJson).pipe(writeStream);
  }
}

export default new Parser();