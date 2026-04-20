"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = Number(process.env.CATALOG_SERVICE_PORT || 3002);
app_1.app.listen(PORT, () => {
    console.log(`catalog-service running on port ${PORT}`);
});
