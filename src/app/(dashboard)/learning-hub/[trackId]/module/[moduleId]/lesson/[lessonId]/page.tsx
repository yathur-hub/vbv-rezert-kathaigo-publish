import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import InteractiveLesson from '@/components/learning/InteractiveLesson';

export const dynamic = 'force-dynamic';

export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ trackId: string, moduleId: string, lessonId: string }> 
}) {
  const resolvedParams = await params;
  const { trackId, moduleId, lessonId } = resolvedParams;

  let lesson: any = null;
  let nextLessonUrl: string | undefined = undefined;

  try {
    // Record that the module is started for our mock user
    await db.userProgress.upsert({
      where: {
        user_id_module_id: {
          user_id: 'mock-user-1',
          module_id: moduleId
        }
      },
      update: {
        completion_status: 'IN_PROGRESS' // dummy update to prevent empty object error with PgBouncer
      },
      create: {
        user_id: 'mock-user-1',
        track_id: trackId,
        module_id: moduleId,
        completion_status: 'IN_PROGRESS'
      }
    });

    // Fetch the lesson and its exercises
    lesson = await db.moduleLesson.findUnique({
      where: { lesson_id: lessonId },
      include: {
        exercises: {
          include: {
            question: {
              include: {
                answer_options: true
              }
            }
          },
          orderBy: {
            exercise_id: 'asc' // Simplistic ordering, could add sequence_order to exercises later
          }
        }
      }
    });

    if (lesson) {
      // Find the next lesson to navigate to
      const nextLesson = await db.moduleLesson.findFirst({
        where: {
          module_id: moduleId,
          sequence_order: {
            gt: lesson.sequence_order
          }
        },
        orderBy: {
          sequence_order: 'asc'
        }
      });

      nextLessonUrl = nextLesson 
        ? `/learning-hub/${trackId}/module/${moduleId}/lesson/${nextLesson.lesson_id}`
        : undefined;
    }
  } catch (error) {
    console.warn("DB Connection failed, using mock data for lesson", error);
    lesson = {
      lesson_id: lessonId,
      title: 'Mock Lesson',
      content_body: 'This is a mock lesson content since the database is not connected.',
      lesson_type: 'READING',
      sequence_order: 1,
      xp_reward: 50,
      exercises: []
    };
    nextLessonUrl = undefined;
  }

  if (!lesson) {
    notFound();
  }
    
  const trackOverviewUrl = `/learning-hub/${trackId}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href={trackOverviewUrl} style={{ color: 'var(--color-primary-dark)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
          ← Zurück zum Pfad
        </Link>
      </div>

      <header style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--color-text)' }}>
          {lesson.title}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
          <span>Lektion {lesson.sequence_order}</span>
          <span>•</span>
          <span>{lesson.xp_reward} XP</span>
        </div>
      </header>

      {/* Interactive Client Component */}
      <InteractiveLesson 
        lesson={{
          lesson_id: lesson.lesson_id,
          title: lesson.title,
          content_body: lesson.content_body,
          lesson_type: lesson.lesson_type
        }}
        exercises={lesson.exercises.map((ex: any) => ({
          exercise_id: ex.exercise_id,
          exercise_type: ex.exercise_type,
          points: ex.points,
          question: {
            question_id: ex.question.question_id,
            question_text: ex.question.question_text,
            answer_options: ex.question.answer_options.map((opt: any) => ({
              answer_option_id: opt.answer_option_id,
              option_text: opt.option_text,
              validated_correctness: opt.validated_correctness,
              reviewer_notes: opt.reviewer_notes
            }))
          }
        }))}
        nextLessonUrl={nextLessonUrl}
        trackOverviewUrl={trackOverviewUrl}
      />
      
    </div>
  );
}
