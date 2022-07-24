import * as path from 'path';
import * as fs from 'fs/promises';

export const getPathToXmls = async (): Promise<string[]> => {
    const pathToXmlDir = path.resolve(process.cwd(), '../xmls');
    return (await fs.readdir(pathToXmlDir)).map((fileName: string) => path.join(pathToXmlDir, fileName));
}