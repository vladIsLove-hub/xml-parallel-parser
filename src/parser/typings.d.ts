export interface IParser {
  execute: (xmlsGroup: string[]) => Promise<void>;
}