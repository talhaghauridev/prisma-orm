import { configDotenv } from "dotenv";

configDotenv({
  path: "./.env",
});

const DATABASE_URL = process.env.DATABASE_URL!;

const PORT = Number(process.env.PORT || 5000);

export { DATABASE_URL, PORT };
