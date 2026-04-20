"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = Number(process.env.AUTH_SERVICE_PORT || 3001);
app_1.app.listen(PORT, () => {
    console.log(`auth-service running on port ${PORT}`);
});
