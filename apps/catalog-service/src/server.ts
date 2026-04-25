import "dotenv/config";
import { app } from "./app";

const PORT = Number(process.env.CATALOG_SERVICE_PORT || 3002);

app.listen(PORT, () => {
  console.log(`catalog-service running on port ${PORT}`);
});
