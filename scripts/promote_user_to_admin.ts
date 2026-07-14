import 'dotenv/config'
import { prisma } from '../lib/prisma'
import { Role } from '@prisma/client'

async function main() {
  const email = 'alfredmakura6@gmail.com'.toLowerCase().trim()
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error('User not found:', email)
    process.exit(1)
  }
  if (user.role === Role.SYSTEM_ADMIN) {
    console.log('User already SYSTEM_ADMIN:', user.id)
    return
  }
  const updated = await prisma.user.update({ where: { id: user.id }, data: { role: Role.SYSTEM_ADMIN } })
  console.log('Promoted user to SYSTEM_ADMIN:', updated.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
