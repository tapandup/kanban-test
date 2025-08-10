import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
    },
  });

  const project = await prisma.project.create({
    data: {
      name: 'Demo Project',
      description: 'This is a demo project.',
      ownerId: adminUser.id,
    },
  });

  const board = await prisma.board.create({
    data: {
      name: 'Main Board',
      projectId: project.id,
    },
  });

  const columns = ['Backlog', 'To Do', 'In Progress', 'Done'];
  for (const [index, columnName] of columns.entries()) {
    await prisma.column.create({
      data: {
        name: columnName,
        order: index,
        boardId: board.id,
      },
    });
  }

  const tasks = [
    { title: 'Task 1', description: 'Description for Task 1', status: 'To Do', priority: 'High' },
    { title: 'Task 2', description: 'Description for Task 2', status: 'In Progress', priority: 'Medium' },
    { title: 'Task 3', description: 'Description for Task 3', status: 'Done', priority: 'Low' },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        ...task,
        columnId: 1, // Assign to the first column (Backlog)
      },
    });
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
