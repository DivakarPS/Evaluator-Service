"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serverConfig_1 = __importDefault(require("./config/serverConfig"));
const routes_1 = __importDefault(require("./routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const bullmqUiConfig_1 = __importDefault(require("./config/bullmqUiConfig"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.text());
app.use("/api", routes_1.default);
app.use('/ui', bullmqUiConfig_1.default.getRouter());
app.listen(serverConfig_1.default.PORT, () => {
    console.log(`Server is running on port ${serverConfig_1.default.PORT}`);
});
