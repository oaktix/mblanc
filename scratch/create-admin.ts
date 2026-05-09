import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function createSuperAdmin() {
  const email = "admin@mblancfits.com";
  const password = "MblancMaster2026!";
  const name = "Master Admin";

  console.log(`>>> Creating Super Admin: ${email}...`);

  const hashedPassword = await hash(password, 12);

  try {
    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: {
        password: hashedPassword,
        role: "ADMIN",
        name: name
      },
      create: {
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "ADMIN",
        name: name
      },
    });

    console.log(">>> Super Admin created/updated successfully!");
    console.log(`>>> Email: ${user.email}`);
    console.log(`>>> Password: ${password}`);
    console.log(`>>> Role: ${user.role}`);
  } catch (error) {
    console.error(">>> Error creating Super Admin:", error);
  }
}

createSuperAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
