import prisma from '../lib/prismaClient.js';

export async function createRepository(data) {
  return prisma.repository.create({
    data,
  });
}

export async function findRepositoryByGithubId(githubId) {
  return prisma.repository.findUnique({
    where: {
      githubId,
    },
  });
}

export async function findRepositoryById(id) {
  return prisma.repository.findUnique({
    where: {
      id,
    },
  });
}

export async function findAllRepositories() {
  return prisma.repository.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}
