
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  console.log('Users:', JSON.stringify(users, null, 2))
  
  const orders = await prisma.order.count()
  console.log('Order count:', orders)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
