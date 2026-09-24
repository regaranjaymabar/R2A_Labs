import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.criteria.findMany().then(c => console.log(c)).finally(() => prisma.$disconnect());
