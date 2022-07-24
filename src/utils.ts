import * as path from 'path';
import * as fs from 'fs/promises';

export const getPathToXmls = async (): Promise<string[]> => {
    const pathToXmlDir = path.resolve(process.cwd(), '../xmls');
    if (!(await fs.readdir(pathToXmlDir)).length) {
        throw new Error('xml folder does not have any xml files');
    }
    return (await fs.readdir(pathToXmlDir)).map((fileName: string) => path.join(pathToXmlDir, fileName));
}