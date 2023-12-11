import { config as dotenvConfig } from "dotenv";
import app from "./app";

const PORT = process.env.PORT as unknown as number || 3000;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, HOST, () => console.log(`Backend server listening on port ${PORT}`));