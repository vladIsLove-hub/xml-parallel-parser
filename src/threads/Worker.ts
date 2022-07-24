import threads from 'worker_threads'
import { IParser } from '../parser/typings';
import { IXMLWorker } from './typings';
import parser from '../parser/Parser';

class XMLWorker implements IXMLWorker {
  private static xmlsGroup = threads.workerData;

  constructor(private readonly parser: IParser) {
    this.parser = parser;
    this.parse();
  }

  private async parse(): Promise<void> {
    this.parser.execute(XMLWorker.xmlsGroup);
  }
}

new XMLWorker(parser);
