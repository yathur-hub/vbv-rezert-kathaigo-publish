import 'dotenv/config';
import { db as prisma } from '../src/lib/db';

async function main() {
  console.log('Seeding Phase 1 MVP Learning Engine Data...');

  await prisma.moduleExercise.deleteMany();
  await prisma.moduleLesson.deleteMany();
  await prisma.moduleAssessment.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.practiceSession.deleteMany();
  await prisma.learningModule.deleteMany();
  await prisma.learningTrack.deleteMany();
  await prisma.user.deleteMany({ where: { user_id: 'mock-user-1' } });

  console.log('Creating Mock User...');
  await prisma.user.create({
    data: {
      user_id: 'mock-user-1',
      email: 'mock@example.com',
      name: 'Mock User',
      role: 'LEARNER'
    }
  });

  
  // Track 1: Versicherungswirtschaft
  const track1 = await prisma.learningTrack.create({
    data: {
      title: 'Versicherungswirtschaft',
      category: 'Wirtschaft',
      certification_profile: 'Vermittler VBV',
      difficulty: 'Einsteiger',
      estimated_duration: 180,
      xp_reward: 500,
      readiness_weight: 15,
      description: 'Grundlegende Konzepte der Versicherungswirtschaft, Risiko, und Underwriting.',
      modules: {
        create: [
          { 
            title: 'Grundlagen Versicherungsprinzipien', topic: 'Prinzipien', module_order: 1, difficulty: 'Leicht', content_type: 'Wissensfragen', xp_reward: 100, readiness_weight: 5,
            lessons: {
              create: [
                { title: 'Wesen der Versicherung', lesson_type: 'THEORY', sequence_order: 1, xp_reward: 20 },
                { title: 'Risikoausgleich', lesson_type: 'THEORY', sequence_order: 2, xp_reward: 20 },
                { title: 'Gesetz der grossen Zahl', lesson_type: 'THEORY', sequence_order: 3, xp_reward: 20 },
                { title: 'Risikotransfer', lesson_type: 'THEORY', sequence_order: 4, xp_reward: 20 },
                { title: 'Versicherungsnehmer vs Versicherer', lesson_type: 'THEORY', sequence_order: 5, xp_reward: 20 },
                { title: 'Marktrollen Schweiz', lesson_type: 'THEORY', sequence_order: 6, xp_reward: 20 }
              ]
            },
            assessments: { create: [{ passing_score: 80, readiness_weight: 10, certificate_relevance: true }] }
          },
          { 
            title: 'Risiko & Risikomanagement', topic: 'Risiko', module_order: 2, difficulty: 'Mittel', content_type: 'Szenarien', xp_reward: 120, readiness_weight: 5,
            lessons: {
              create: [
                { title: 'Risikobegriff', lesson_type: 'THEORY', sequence_order: 1, xp_reward: 20 },
                { title: 'Risikokategorien', lesson_type: 'THEORY', sequence_order: 2, xp_reward: 20 },
                { title: 'Underwriting Grundlagen', lesson_type: 'THEORY', sequence_order: 3, xp_reward: 20 },
                { title: 'Prävention', lesson_type: 'THEORY', sequence_order: 4, xp_reward: 20 },
                { title: 'Selbstbehalt', lesson_type: 'THEORY', sequence_order: 5, xp_reward: 20 },
                { title: 'Moral Hazard', lesson_type: 'THEORY', sequence_order: 6, xp_reward: 20 }
              ]
            },
            assessments: { create: [{ passing_score: 80, readiness_weight: 10, certificate_relevance: true }] }
          }
        ]
      }
    }
  });

  // Track 2: Recht & Regulierung
  const track2 = await prisma.learningTrack.create({
    data: {
      title: 'Recht & Regulierung',
      category: 'Recht',
      certification_profile: 'Vermittler VBV',
      difficulty: 'Schwer',
      estimated_duration: 240,
      xp_reward: 700,
      readiness_weight: 20,
      description: 'Gesetzliche Grundlagen für Versicherungsvermittler (VVG, VAG, OR, Datenschutz).',
      modules: {
        create: [
          { 
            title: 'VVG Grundlagen', topic: 'Versicherungsvertragsgesetz', module_order: 1, difficulty: 'Schwer', content_type: 'Fallanalysen', xp_reward: 150, readiness_weight: 10,
            lessons: {
              create: [
                { title: 'Vertragsabschluss', lesson_type: 'THEORY', sequence_order: 1, xp_reward: 25 },
                { title: 'Obliegenheiten', lesson_type: 'THEORY', sequence_order: 2, xp_reward: 25 },
                { title: 'Anzeigepflichten', lesson_type: 'THEORY', sequence_order: 3, xp_reward: 25 },
                { title: 'Kündigung', lesson_type: 'THEORY', sequence_order: 4, xp_reward: 25 },
                { title: 'Leistungsanspruch', lesson_type: 'THEORY', sequence_order: 5, xp_reward: 25 },
                { title: 'Vertragsverletzung', lesson_type: 'CASE_STUDY', sequence_order: 6, xp_reward: 50 }
              ]
            },
            assessments: { create: [{ passing_score: 80, readiness_weight: 20, certificate_relevance: true }] }
          },
          { 
            title: 'VAG / Vermittlerrecht', topic: 'Versicherungsaufsichtsgesetz', module_order: 2, difficulty: 'Mittel', content_type: 'Wissensfragen', xp_reward: 120, readiness_weight: 10,
            lessons: {
              create: [
                { title: 'Versicherungsvermittlerregister', lesson_type: 'THEORY', sequence_order: 1, xp_reward: 20 },
                { title: 'Zulassung', lesson_type: 'THEORY', sequence_order: 2, xp_reward: 20 },
                { title: 'Weiterbildung', lesson_type: 'THEORY', sequence_order: 3, xp_reward: 20 },
                { title: 'Aufsicht', lesson_type: 'THEORY', sequence_order: 4, xp_reward: 20 },
                { title: 'Haftung', lesson_type: 'CASE_STUDY', sequence_order: 5, xp_reward: 30 },
                { title: 'Compliance', lesson_type: 'CASE_STUDY', sequence_order: 6, xp_reward: 30 }
              ]
            },
            assessments: { create: [{ passing_score: 80, readiness_weight: 20, certificate_relevance: true }] }
          }
        ]
      }
    }
  });

  // Track 3: Personenversicherung / Vorsorge
  const track3 = await prisma.learningTrack.create({
    data: {
      title: 'Personenversicherung / Vorsorge',
      category: 'Vorsorge',
      certification_profile: 'Vermittler VBV',
      difficulty: 'Mittel',
      estimated_duration: 200,
      xp_reward: 600,
      readiness_weight: 25,
      description: 'Sozialversicherungen, KVG, UVG, und 3. Säule.',
      modules: {
        create: [
          { title: 'AHV', topic: '1. Säule', module_order: 1, difficulty: 'Leicht', content_type: 'Wissensfragen', xp_reward: 100 },
          { title: 'IV', topic: '1. Säule', module_order: 2, difficulty: 'Leicht', content_type: 'Wissensfragen', xp_reward: 100 },
          { title: 'BVG', topic: '2. Säule', module_order: 3, difficulty: 'Mittel', content_type: 'Fallanalysen', xp_reward: 150 },
          { title: 'UVG', topic: 'Unfall', module_order: 4, difficulty: 'Mittel', content_type: 'Wissensfragen', xp_reward: 120 },
          { title: 'KVG', topic: 'Krankheit', module_order: 5, difficulty: 'Mittel', content_type: 'Szenarien', xp_reward: 130 },
          { title: 'Krankentaggeld', topic: 'KTG', module_order: 6, difficulty: 'Mittel', content_type: 'Fallanalysen', xp_reward: 120 },
          { title: 'Lebensversicherung', topic: '3. Säule', module_order: 7, difficulty: 'Schwer', content_type: 'Szenarien', xp_reward: 150 }
        ]
      }
    }
  });

  // Track 4: Sachversicherungen
  const track4 = await prisma.learningTrack.create({
    data: {
      title: 'Sachversicherungen',
      category: 'Sach',
      certification_profile: 'Vermittler VBV',
      difficulty: 'Mittel',
      estimated_duration: 180,
      xp_reward: 550,
      readiness_weight: 20,
      description: 'Deckungen, Leistungen und Bedingungen in den klassischen Sachversicherungen.',
      modules: {
        create: [
          { title: 'Hausrat', topic: 'Hausrat', module_order: 1, difficulty: 'Leicht', content_type: 'Wissensfragen', xp_reward: 100 },
          { title: 'Gebäude', topic: 'Gebäude', module_order: 2, difficulty: 'Mittel', content_type: 'Szenarien', xp_reward: 120 },
          { title: 'Haftpflicht', topic: 'Haftpflicht', module_order: 3, difficulty: 'Mittel', content_type: 'Fallanalysen', xp_reward: 140 },
          { title: 'Motorfahrzeug', topic: 'MFZ', module_order: 4, difficulty: 'Mittel', content_type: 'Szenarien', xp_reward: 140 },
          { title: 'Rechtsschutz', topic: 'Rechtsschutz', module_order: 5, difficulty: 'Mittel', content_type: 'Wissensfragen', xp_reward: 100 },
          { title: 'Reiseversicherung', topic: 'Reise', module_order: 6, difficulty: 'Leicht', content_type: 'Wissensfragen', xp_reward: 80 }
        ]
      }
    }
  });

  // Track 5: Beratung & Compliance
  const track5 = await prisma.learningTrack.create({
    data: {
      title: 'Beratung & Compliance',
      category: 'Beratung',
      certification_profile: 'Vermittler VBV',
      difficulty: 'Schwer',
      estimated_duration: 150,
      xp_reward: 500,
      readiness_weight: 20,
      description: 'Methodik für die mündliche Prüfung und erfolgreiche Kundenberatung.',
      modules: {
        create: [
          { title: 'Kundengespräch', topic: 'Kommunikation', module_order: 1, difficulty: 'Leicht', content_type: 'Wissensfragen', xp_reward: 100 },
          { title: 'Bedarfsermittlung', topic: 'Beratung', module_order: 2, difficulty: 'Mittel', content_type: 'Szenarien', xp_reward: 120 },
          { title: 'Cross-Selling Ethik', topic: 'Ethik', module_order: 3, difficulty: 'Leicht', content_type: 'Wissensfragen', xp_reward: 80 },
          { title: 'Risikoanalyse', topic: 'Risiko', module_order: 4, difficulty: 'Schwer', content_type: 'Fallanalysen', xp_reward: 150 },
          { title: 'Dokumentation', topic: 'Doku', module_order: 5, difficulty: 'Mittel', content_type: 'Wissensfragen', xp_reward: 110 },
          { title: 'Compliance', topic: 'Compliance', module_order: 6, difficulty: 'Mittel', content_type: 'Wissensfragen', xp_reward: 110 },
          { title: 'Mündliche Prüfungssimulation', topic: 'Mündlich', module_order: 7, difficulty: 'Schwer', content_type: 'Fallanalysen', xp_reward: 200 }
        ]
      }
    }
  });

  console.log(`Created Track 1: ${track1.title}`);
  console.log(`Created Track 2: ${track2.title}`);
  console.log(`Created Track 3: ${track3.title}`);
  console.log(`Created Track 4: ${track4.title}`);
  console.log(`Created Track 5: ${track5.title}`);
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
