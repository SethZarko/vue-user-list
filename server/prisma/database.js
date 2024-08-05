import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function connectToDatabase() {
    try {
      await prisma.$connect();
      console.log('Connected to MYSQL with Prisma');
    } catch (error) {
      console.error('Failed to connect to the database', error);
    }
}
  
connectToDatabase();

export default prisma;