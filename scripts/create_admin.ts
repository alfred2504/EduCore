import bcrypt from 'bcryptjs'
import 'dotenv/config'
import { Role } from '@prisma/client'
import { prisma } from '../lib/prisma'

async function main() {
  const email = 'alfredmakura6@gmail.com'.toLowerCase().trim()
  const password = '#Alfred2504'
  const name = 'Alfred Makura'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('User already exists:', existing.id)
    return
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashed,
      role: Role.SYSTEM_ADMIN,
      status: 'APPROVED',
    },
  })

  console.log('Created SYSTEM_ADMIN user with id:', user.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
