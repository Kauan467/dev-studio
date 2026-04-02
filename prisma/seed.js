const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "kauan@teste.com" },
    update: {},
    create: {
      name: "Kauan",
      email: "kauan@teste.com",
      password: "temporario123",
    },
  });

  console.log("Usuário criado:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });