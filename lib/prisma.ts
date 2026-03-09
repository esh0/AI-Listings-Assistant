import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function buildDatasourceUrl(): string {
  const url = process.env.DATABASE_URL ?? '';
  // Ensure pgbouncer compatibility and limit connections for serverless
  const separator = url.includes('?') ? '&' : '?';
  const params: string[] = [];
  if (!url.includes('pgbouncer=')) params.push('pgbouncer=true');
  if (!url.includes('connection_limit=')) params.push('connection_limit=5');
  return params.length > 0 ? `${url}${separator}${params.join('&')}` : url;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasourceUrl: buildDatasourceUrl(),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
