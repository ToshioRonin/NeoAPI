import { PrismaClient } from "../generated/prisma/client.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Opcional: puedes ajustar pool.size, idleTimeoutMillis, etc.
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
