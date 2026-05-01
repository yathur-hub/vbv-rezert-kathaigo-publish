import 'dotenv/config';
import { db as prisma } from '../lib/db';

const GITHUB_REPO = 'yathur-hub/VBV-Rezert';
const GITHUB_BRANCH = 'main';

/**
 * Mocks fetching questions from the GitHub repository.
 * Once the repository format is confirmed, replace this with actual fetch logic.
 */
async function fetchQuestionsFromGitHub() {
  console.log(`Fetching repository contents from ${GITHUB_REPO}...`);
  // Example dummy data returning what would theoretically be parsed from the repo
  return [
    {
      original_id: 'VBV-WIR-001',
      text: 'Was ist das Hauptziel der Versicherungswirtschaft?',
      type: 'MULTIPLE_CHOICE',
      domain: 'Versicherungswirtschaft',
      difficulty: 'Leicht',
      options: [
        { text: 'Risikoausgleich im Kollektiv', isCorrect: true },
        { text: 'Gewinnmaximierung für den Einzelnen', isCorrect: false },
        { text: 'Ausschliessliche Absicherung von Sachwerten', isCorrect: false },
      ],
      targetTrack: 'Versicherungswirtschaft',
      targetModule: 'Grundlagen Versicherungsprinzipien',
      targetLesson: 'Risikoausgleich'
    },
    {
      original_id: 'VBV-REC-001',
      text: 'Welches Gesetz regelt primär die Versicherungsverträge in der Schweiz?',
      type: 'MULTIPLE_CHOICE',
      domain: 'Recht',
      difficulty: 'Mittel',
      options: [
        { text: 'VVG', isCorrect: true },
        { text: 'VAG', isCorrect: false },
        { text: 'OR', isCorrect: false },
      ],
      targetTrack: 'Recht & Regulierung',
      targetModule: 'VVG Grundlagen',
      targetLesson: 'Vertragsabschluss'
    }
  ];
}

async function mapQuestionToLesson(questionRecord: any, targetTrackTitle: string, targetModuleTitle: string, targetLessonTitle: string) {
  // Find the learning lesson
  const lessonRecord = await prisma.moduleLesson.findFirst({
    where: {
      title: targetLessonTitle,
      module: {
        title: targetModuleTitle,
        track: {
          title: targetTrackTitle
        }
      }
    }
  });

  if (!lessonRecord) {
    console.warn(`Warning: Could not find mapping lesson '${targetLessonTitle}' in module '${targetModuleTitle}'`);
    return;
  }

  // Upsert the mapping (exercise)
  const existingMapping = await prisma.moduleExercise.findFirst({
    where: {
      lesson_id: lessonRecord.lesson_id,
      question_id: questionRecord.question_id
    }
  });

  if (!existingMapping) {
    await prisma.moduleExercise.create({
      data: {
        lesson_id: lessonRecord.lesson_id,
        question_id: questionRecord.question_id,
        difficulty: questionRecord.difficulty,
        exercise_type: questionRecord.question_type || 'MULTIPLE_CHOICE',
        points: 1
      }
    });
    console.log(`Mapped question ${questionRecord.original_question_id} to lesson ${lessonRecord.title}`);
  }
}

async function main() {
  console.log('Starting GitHub Content Sync Pipeline...');

  const questions = await fetchQuestionsFromGitHub();

  for (const q of questions) {
    // 1. Upsert Question
    const questionRecord = await prisma.question.upsert({
      where: {
        question_id: 'mock-id' // DUMMY
      },
      update: {
        question_text: q.text,
        difficulty: q.difficulty,
        insurance_domain: q.domain
      },
      create: {
        original_question_id: q.original_id,
        question_text: q.text,
        question_type: q.type,
        difficulty: q.difficulty,
        insurance_domain: q.domain,
        validation_status: 'RAW_IMPORTED'
      }
    }).catch(async () => {
        // Fallback for upsert without unique
        const existing = await prisma.question.findFirst({ where: { original_question_id: q.original_id } });
        if (existing) {
            return prisma.question.update({ where: { question_id: existing.question_id }, data: { question_text: q.text, difficulty: q.difficulty } });
        } else {
            return prisma.question.create({
                data: {
                    original_question_id: q.original_id,
                    question_text: q.text,
                    question_type: q.type,
                    difficulty: q.difficulty,
                    insurance_domain: q.domain,
                    validation_status: 'RAW_IMPORTED'
                }
            })
        }
    });

    // 2. Clear old options and recreate
    await prisma.answerOption.deleteMany({
      where: { question_id: questionRecord.question_id }
    });

    for (const opt of q.options) {
      await prisma.answerOption.create({
        data: {
          question_id: questionRecord.question_id,
          option_text: opt.text,
          validated_correctness: opt.isCorrect,
          validation_status: 'RAW_IMPORTED'
        }
      });
    }

    // 3. Map to Learning Lesson
    await mapQuestionToLesson(questionRecord, q.targetTrack, q.targetModule, q.targetLesson);
  }

  console.log('Content sync complete.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
