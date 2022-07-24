"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const stream_1 = require("stream");
const path_1 = __importDefault(require("path"));
const xml2js_1 = require("xml2js");
class Parser {
    execute(xmlsGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExistsOutFolder = fs_1.default.existsSync(path_1.default.resolve(__dirname, '../../../json'));
            if (!isExistsOutFolder) {
                fs_1.default.mkdir(path_1.default.resolve(__dirname, '../../../json'), (err) => {
                    if (err) {
                        throw new Error(err.message);
                    }
                });
            }
            for (const xml of xmlsGroup) {
                this.writeAsync(xml);
            }
        });
    }
    writeAsync(xmlPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const readStream = fs_1.default.createReadStream(xmlPath, 'utf-8');
            const writeStream = fs_1.default.createWriteStream(path_1.default.resolve(__dirname, `../../../json/${path_1.default.basename(xmlPath)}.json`));
            const transformXmlToJson = new stream_1.Transform({
                transform(chunk, encoding = 'utf-8', callback) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const jsonFromXml = yield (0, xml2js_1.parseStringPromise)(chunk.toString(), { async: true });
                            callback(null, JSON.stringify(jsonFromXml, null, 4));
                        }
                        catch (error) {
                            if (error instanceof Error) {
                                throw new Error(error.message);
                            }
                            throw error;
                        }
                    });
                }
            });
            readStream.pipe(transformXmlToJson).pipe(writeStream);
        });
    }
}
exports.default = new Parser();
