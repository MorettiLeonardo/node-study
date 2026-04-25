import "dotenv/config";
import { app } from "./app";

const PORT = Number(process.env.AUTH_SERVICE_PORT || 3001);

app.listen(PORT, () => {
  console.log(`auth-service running on port ${PORT}`);
});
