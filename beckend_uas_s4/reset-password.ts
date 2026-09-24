import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const emailToReset = 'superadmin@superadmin.com';
  const newPassword = 'password123';
  
  const user = await prisma.user.findUnique({ where: { email: emailToReset } });
  
  if (!user) {
    console.log(`User ${emailToReset} not found!`);
    return;
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { email: emailToReset },
    data: { password: hashedPassword }
  });
  
  console.log(`Successfully reset password for ${emailToReset}`);
  console.log(`New password is: ${newPassword}`);
}

main().finally(() => prisma.$disconnect());
