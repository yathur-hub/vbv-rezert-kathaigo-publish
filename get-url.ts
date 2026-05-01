import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  const track = await db.learningTrack.findFirst();
  const module = await db.learningModule.findFirst({ where: { track_id: track?.track_id }});
  const lesson = await db.moduleLesson.findFirst({ where: { module_id: module?.module_id }});

  console.log(`http://localhost:3000/learning-hub/${track?.track_id}/module/${module?.module_id}/lesson/${lesson?.lesson_id}`);
}

main().catch(console.error).finally(() => db.$disconnect());
