import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkStaff() {
  console.log(">>> Checking for STAFF users...");
  const users = await prisma.user.findMany({
    where: {
      role: "STAFF"
    }
  });

  if (users.length === 0) {
    console.log(">>> No STAFF users found.");
    
    // Check all users to see what's there
    const allUsers = await prisma.user.findMany({
        take: 5
    });
    console.log(">>> First 5 users in DB:");
    allUsers.forEach(u => console.log(`- ${u.email}: ${u.role}`));
  } else {
    console.log(`>>> Found ${users.length} STAFF users:`);
    users.forEach(u => console.log(`- ${u.email}: ${u.role}`));
  }
}

checkStaff()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
