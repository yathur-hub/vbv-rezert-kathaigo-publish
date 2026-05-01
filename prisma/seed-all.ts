import 'dotenv/config';
import { db as prisma } from '../src/lib/db';
import { wirtschaftRechtContent } from '../src/data/wirtschaft-recht-content';
import { personenVorsorgeContent } from '../src/data/personen-vorsorge-content';
import { sachContent } from '../src/data/sach-content';

const allContent = [
  ...wirtschaftRechtContent,
  ...personenVorsorgeContent,
  ...sachContent
];

async function main() {
  console.log(`Seeding FULL content for ALL Tracks (${allContent.length} Modules, ${allContent.length * 10} Questions)...`);

  for (const moduleData of allContent) {
    console.log(`Processing Module: ${moduleData.moduleTitle} (Track: ${moduleData.trackTitle})...`);
    
    // Find track
    const track = await prisma.learningTrack.findFirst({
      where: { title: moduleData.trackTitle }
    });

    if (!track) {
      console.warn(`Track ${moduleData.trackTitle} not found. Skipping module ${moduleData.moduleTitle}.`);
      continue;
    }

    const dbModule = await prisma.learningModule.findFirst({
      where: { title: moduleData.moduleTitle, track_id: track.track_id }
    });

    if (!dbModule) {
      console.warn(`Module ${moduleData.moduleTitle} not found in DB. Skipping.`);
      continue;
    }

    // Delete existing lessons and exercises for this module
    const existingLessons = await prisma.moduleLesson.findMany({
      where: { module_id: dbModule.module_id }
    });
    for (const l of existingLessons) {
      await prisma.moduleExercise.deleteMany({ where: { lesson_id: l.lesson_id } });
    }
    await prisma.moduleLesson.deleteMany({
      where: { module_id: dbModule.module_id }
    });

    // Create the Lesson
    const lesson = await prisma.moduleLesson.create({
      data: {
        module_id: dbModule.module_id,
        title: moduleData.lessonTitle,
        lesson_type: 'THEORY',
        sequence_order: 1,
        xp_reward: 50,
        content_body: moduleData.lessonContent
      }
    });

    // Create the 10 Questions and Exercises
    for (let i = 0; i < moduleData.questions.length; i++) {
      const qData = moduleData.questions[i];
      
      const question = await prisma.question.create({
        data: {
          question_text: qData.text,
          question_type: 'MULTIPLE_CHOICE',
          difficulty: 'Mittel',
          insurance_domain: moduleData.moduleTitle,
          validation_status: 'VALIDATED',
          image_url: (qData as any).imageUrl || null,
          answer_options: {
            create: qData.options.map((optText, index) => ({
              option_text: optText,
              validated_correctness: index === qData.correctIdx,
              validation_status: 'VALIDATED',
              reviewer_notes: index === qData.correctIdx ? qData.notes : null
            }))
          }
        }
      });

      await prisma.moduleExercise.create({
        data: {
          lesson_id: lesson.lesson_id,
          question_id: question.question_id,
          exercise_type: 'MULTIPLE_CHOICE',
          difficulty: 'Mittel',
          points: 10,
          repetition_priority: i + 1
        }
      });
    }

    console.log(`✅ Module ${moduleData.moduleTitle}: Added Lesson + ${moduleData.questions.length} Exercises.`);
  }

  console.log('🎉 Full Content Seeding Complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seeding successful.');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
