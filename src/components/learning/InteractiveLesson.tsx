'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './InteractiveLesson.module.css';

interface AnswerOption {
  answer_option_id: string;
  option_text: string;
  validated_correctness: boolean;
  reviewer_notes?: string | null;
}

interface Question {
  question_id: string;
  question_text: string;
  image_url?: string | null;
  answer_options: AnswerOption[];
}

interface Exercise {
  exercise_id: string;
  exercise_type: string;
  points: number;
  question: Question;
}

interface Lesson {
  lesson_id: string;
  title: string;
  content_body: string | null;
  lesson_type: string;
}

interface Props {
  lesson: Lesson;
  exercises: Exercise[];
  nextLessonUrl?: string;
  trackOverviewUrl: string;
}

type Mode = 'THEORY' | 'EXERCISE' | 'COMPLETED';

export default function InteractiveLesson({ lesson, exercises, nextLessonUrl, trackOverviewUrl }: Props) {
  const [mode, setMode] = useState<Mode>(
    lesson.content_body ? 'THEORY' : (exercises.length > 0 ? 'EXERCISE' : 'COMPLETED')
  );
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentExercise = exercises[currentExerciseIndex];

  const handleStartExercises = () => {
    if (exercises.length > 0) {
      setMode('EXERCISE');
    } else {
      setMode('COMPLETED');
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setIsSubmitted(true);
    // In a real app, we would send this to /api/progress to record XP
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setSelectedOptionId(null);
      setIsSubmitted(false);
    } else {
      setMode('COMPLETED');
    }
  };

  const handleFinish = () => {
    if (nextLessonUrl) {
      window.location.href = nextLessonUrl;
    } else {
      window.location.href = trackOverviewUrl;
    }
  };

  const totalXP = exercises.reduce((sum, ex) => sum + ex.points, 0);

  return (
    <div className={styles.container}>
      
      {/* THEORY MODE */}
      {mode === 'THEORY' && (
        <div className={styles.contentCard}>
          <div className={styles.markdown}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lesson.content_body || ''}
            </ReactMarkdown>
          </div>
          
          <div className={styles.actionContainer}>
            {exercises.length > 0 ? (
              <button className="btn btn-primary" onClick={handleStartExercises} style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                Theorie verstanden – Wissen prüfen ({exercises.length} {exercises.length === 1 ? 'Frage' : 'Fragen'})
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleFinish} style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                Lektion abschliessen
              </button>
            )}
          </div>
        </div>
      )}

      {/* EXERCISE MODE */}
      {mode === 'EXERCISE' && currentExercise && (
        <div className={styles.exerciseCard}>
          <div className={styles.exerciseHeader}>
            <span className={styles.exerciseBadge}>
              {currentExercise.exercise_type === 'CASE_STUDY' ? 'Fallstudie' : 'Wissenscheck'}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', fontWeight: 500 }}>
              Frage {currentExerciseIndex + 1} von {exercises.length} • {currentExercise.points} XP
            </span>
          </div>

          <div className={styles.questionText}>
            {currentExercise.question.question_text}
          </div>

          {currentExercise.question.image_url && (
            <div className={styles.questionImageContainer}>
              <img 
                src={currentExercise.question.image_url} 
                alt="Fragen-Grafik" 
                className={styles.questionImage} 
              />
            </div>
          )}

          <div className={styles.optionsList}>
            {currentExercise.question.answer_options.map((option) => {
              const isSelected = selectedOptionId === option.answer_option_id;
              const isCorrect = option.validated_correctness;
              
              let optionClass = styles.optionButton;
              if (isSelected) optionClass += ` ${styles.optionSelected}`;
              
              if (isSubmitted) {
                if (isCorrect) optionClass += ` ${styles.optionCorrect}`;
                else if (isSelected && !isCorrect) optionClass += ` ${styles.optionIncorrect}`;
              }

              return (
                <button
                  key={option.answer_option_id}
                  className={optionClass}
                  onClick={() => handleOptionSelect(option.answer_option_id)}
                  disabled={isSubmitted}
                >
                  <div className={styles.radioCircle}>
                    {isSelected && <div className={styles.radioInner} />}
                  </div>
                  {option.option_text}
                </button>
              );
            })}
          </div>

          {/* Feedback Section */}
          {isSubmitted && selectedOptionId && (
            <div className={`${styles.feedbackContainer} ${
              currentExercise.question.answer_options.find(o => o.answer_option_id === selectedOptionId)?.validated_correctness
                ? styles.feedbackCorrect
                : styles.feedbackIncorrect
            }`}>
              {currentExercise.question.answer_options.find(o => o.answer_option_id === selectedOptionId)?.validated_correctness ? (
                <>
                  <div className={styles.feedbackTitle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    Korrekt!
                  </div>
                  {currentExercise.question.answer_options.find(o => o.answer_option_id === selectedOptionId)?.reviewer_notes && (
                    <div className={styles.feedbackNotes}>
                      {currentExercise.question.answer_options.find(o => o.answer_option_id === selectedOptionId)?.reviewer_notes}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className={styles.feedbackTitle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    Nicht ganz richtig.
                  </div>
                  <div className={styles.feedbackNotes}>
                    {currentExercise.question.answer_options.find(o => o.answer_option_id === selectedOptionId)?.reviewer_notes && (
                       <span style={{ display: 'block', marginTop: '8px' }}>
                         <strong>Hinweis:</strong> {currentExercise.question.answer_options.find(o => o.answer_option_id === selectedOptionId)?.reviewer_notes}
                       </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          <div className={styles.actionContainer} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              className="btn" 
              onClick={() => setMode('THEORY')}
              style={{ backgroundColor: 'transparent', color: 'var(--color-text-light)', border: '1px solid var(--color-border)', padding: '10px 20px' }}
            >
              Theorie nachlesen
            </button>
            
            {!isSubmitted ? (
              <button 
                className="btn btn-primary" 
                onClick={handleSubmit}
                disabled={!selectedOptionId}
                style={{ padding: '12px 32px', opacity: selectedOptionId ? 1 : 0.5 }}
              >
                Prüfen
              </button>
            ) : (
              <button 
                className="btn btn-primary" 
                onClick={handleNextExercise}
                style={{ padding: '12px 32px' }}
              >
                {currentExerciseIndex < exercises.length - 1 ? 'Nächste Frage' : 'Abschliessen'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* COMPLETED MODE */}
      {mode === 'COMPLETED' && (
        <div className={styles.completionCard}>
          <div className={styles.completionIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h2 className={styles.completionTitle}>Lektion abgeschlossen!</h2>
          <p className={styles.completionText}>
            Du hast diese Lektion erfolgreich gemeistert. 
            {exercises.length > 0 && <span> Du erhältst <strong>{totalXP} XP</strong> für deine Leistung.</span>}
          </p>
          <div className={styles.actionContainer} style={{ justifyContent: 'center', marginTop: '32px' }}>
            <button className="btn btn-primary" onClick={handleFinish} style={{ padding: '16px 48px', fontSize: '1.1rem' }}>
              Nächste Lektion
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
