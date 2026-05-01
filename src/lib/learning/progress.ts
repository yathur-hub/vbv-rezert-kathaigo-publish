/**
 * Core Logic for the Learning Engine (Sprint 2)
 */

export type MasteryStatus = 'Kritisch' | 'Unsicher' | 'Solide' | 'Prüfungsbereit' | 'Exzellent';

/**
 * Calculates the Mastery Status based on the score (0-100).
 * Table from specifications:
 * 0-40: Kritisch
 * 41-65: Unsicher
 * 66-80: Solide
 * 81-90: Prüfungsbereit
 * 91-100: Exzellent
 */
export function getMasteryStatus(score: number): MasteryStatus {
  if (score <= 40) return 'Kritisch';
  if (score <= 65) return 'Unsicher';
  if (score <= 80) return 'Solide';
  if (score <= 90) return 'Prüfungsbereit';
  return 'Exzellent';
}

/**
 * Calculates the next review date based on consecutive wrong answers (Spaced Repetition).
 * - 1x falsch -> 24h
 * - 2x falsch -> 72h
 * - 3x falsch -> 7 days
 * Note: If correct, we might reset or use a different interval (to be expanded later).
 */
export function calculateNextReviewDate(wrongStreak: number): Date {
  const now = new Date();
  if (wrongStreak === 1) {
    now.setHours(now.getHours() + 24);
  } else if (wrongStreak === 2) {
    now.setHours(now.getHours() + 72);
  } else if (wrongStreak >= 3) {
    now.setDate(now.getDate() + 7);
  }
  return now;
}

/**
 * Placeholder for readiness score calculation.
 * In a real scenario, this would aggregate mastery scores across all modules in a track
 * and weight them by difficulty and recent performance.
 */
export function calculateOverallReadiness(moduleScores: number[]): number {
  if (moduleScores.length === 0) return 0;
  const sum = moduleScores.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / moduleScores.length);
}
