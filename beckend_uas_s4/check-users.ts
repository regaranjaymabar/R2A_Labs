import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true } });
  console.log('--- USERS IN NEON DB ---');
  console.log(users);
  
  if (users.length === 0) {
    console.log('No users found! Creating default admin...');
    // We need a store to create a user
    let store = await prisma.store.findFirst();
    if (!store) {
      store = await prisma.store.create({
        data: {
          name: 'Default Store',
          address: '-',
          city: '-',
          phone: '0000',
          isActive: 1,
        }
      });
    }
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const newAdmin = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'admin',
        storeId: store.id
      }
    });
    console.log('Created default admin: admin@admin.com / admin123');
  } else {
    console.log('\nIf you want to login, use one of the emails above.');
    console.log('If you forgot the password, you can run a script to reset it.');
  }
}

main().finally(() => prisma.$disconnect());
