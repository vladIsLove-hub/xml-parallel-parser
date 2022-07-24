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
const worker_threads_1 = __importDefault(require("worker_threads"));
const Parser_1 = __importDefault(require("../parser/Parser"));
class XMLWorker {
    constructor(parser) {
        this.parser = parser;
        this.parser = parser;
        this.parse();
    }
    parse() {
        return __awaiter(this, void 0, void 0, function* () {
            this.parser.execute(XMLWorker.xmlsGroup);
        });
    }
}
XMLWorker.xmlsGroup = worker_threads_1.default.workerData;
new XMLWorker(Parser_1.default);
