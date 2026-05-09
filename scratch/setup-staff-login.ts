import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function setupStaff() {
  const email = "gahdejtheprince@gmail.com";
  const password = "MblancStaff2026!";
  const name = "Staff Member";

  console.log(`>>> Setting up Staff: ${email}...`);

  const hashedPassword = await hash(password, 12);

  try {
    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: {
        password: hashedPassword,
        role: "STAFF",
        name: name
      },
      create: {
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "STAFF",
        name: name
      },
    });

    console.log(">>> Staff account set up successfully!");
    console.log(`>>> Email: ${user.email}`);
    console.log(`>>> Password: ${password}`);
    console.log(`>>> Role: ${user.role}`);
  } catch (error) {
    console.error(">>> Error setting up staff:", error);
  }
}

setupStaff()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
