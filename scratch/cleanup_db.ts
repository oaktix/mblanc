
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Starting cleanup...')
  
  // Delete all orders (will cascade to OrderItems)
  const deletedOrders = await prisma.order.deleteMany({})
  console.log(`Deleted ${deletedOrders.count} orders.`)
  
  // Delete all users with CUSTOMER role
  const deletedCustomers = await prisma.user.deleteMany({
    where: {
      role: 'CUSTOMER'
    }
  })
  console.log(`Deleted ${deletedCustomers.count} customers.`)
  
  // Reset any other potential records if needed (e.g. CouponUsage)
  await prisma.couponUsage.deleteMany({})
  console.log('Cleared coupon usages.')

  console.log('Cleanup completed successfully.')
}

main()
  .catch(e => {
    console.error('Cleanup failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
