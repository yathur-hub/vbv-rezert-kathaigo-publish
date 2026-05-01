import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  const track = await db.learningTrack.findFirst();
  const learningModule = await db.learningModule.findFirst({ where: { track_id: track?.track_id }});
  const lesson = await db.moduleLesson.findFirst({ where: { module_id: learningModule?.module_id }});

  console.log(`http://localhost:3000/learning-hub/${track?.track_id}/module/${learningModule?.module_id}/lesson/${lesson?.lesson_id}`);
}

main().catch(console.error).finally(() => db.$disconnect());
