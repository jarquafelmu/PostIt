import { PrismaClient } from "@prisma/client";

// instantiate a client once, no matter where it's used
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
