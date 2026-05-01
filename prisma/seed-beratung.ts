import 'dotenv/config';
import { db as prisma } from '../src/lib/db';

async function main() {
  console.log('Seeding specific content for Beratung & Compliance Track...');

  // Find track
  const track = await prisma.learningTrack.findFirst({
    where: { title: 'Beratung & Compliance' }
  });

  if (!track) {
    console.error('Track not found. Did you run the main seed script?');
    process.exit(1);
  }

  // Find Module "Kundengespräch"
  const moduleKundengespraech = await prisma.learningModule.findFirst({
    where: { title: 'Kundengespräch', track_id: track.track_id }
  });

  if (moduleKundengespraech) {
    const existingLessons = await prisma.moduleLesson.findMany({
      where: { module_id: moduleKundengespraech.module_id }
    });
    for (const l of existingLessons) {
      await prisma.moduleExercise.deleteMany({ where: { lesson_id: l.lesson_id } });
    }
    await prisma.moduleLesson.deleteMany({
      where: { module_id: moduleKundengespraech.module_id }
    });

    const lesson1 = await prisma.moduleLesson.create({
      data: {
        module_id: moduleKundengespraech.module_id,
        title: 'Grundlagen des Kundengesprächs',
        lesson_type: 'THEORY',
        sequence_order: 1,
        xp_reward: 50,
        content_body: `
# Das erfolgreiche Kundengespräch

Ein erfolgreiches Kundengespräch im Versicherungsbereich basiert auf Vertrauen, Fachkompetenz und einer strukturierten Gesprächsführung.

## Phasen des Gesprächs

1. **Begrüssung und Kontaktphase:** Eis brechen, Beziehungsebene aufbauen.
2. **Informationsphase:** Bedarf ermitteln, Wünsche des Kunden verstehen.
3. **Angebots- und Beratungsphase:** Passende Lösungen präsentieren.
4. **Abschlussphase:** Entscheidung herbeiführen.

> **Merksatz:** "Man kann nicht *nicht* kommunizieren." (Paul Watzlawick)

Achten Sie immer auf nonverbale Signale und passen Sie Ihr Gesprächstempo dem Kunden an.
        `
      }
    });

    // Add Exercise to Lesson 1
    const q1 = await prisma.question.create({
      data: {
        question_text: 'In welcher Phase des Kundengesprächs findet die Bedarfsermittlung hauptsächlich statt?',
        question_type: 'MULTIPLE_CHOICE',
        difficulty: 'Leicht',
        insurance_domain: 'Beratung',
        validation_status: 'VALIDATED',
        answer_options: {
          create: [
            { option_text: 'Begrüssung und Kontaktphase', validated_correctness: false, validation_status: 'VALIDATED' },
            { option_text: 'Informationsphase', validated_correctness: true, validation_status: 'VALIDATED', reviewer_notes: 'Richtig, hier werden die wesentlichen Infos abgeholt.' },
            { option_text: 'Angebots- und Beratungsphase', validated_correctness: false, validation_status: 'VALIDATED' },
            { option_text: 'Abschlussphase', validated_correctness: false, validation_status: 'VALIDATED' }
          ]
        }
      }
    });

    await prisma.moduleExercise.create({
      data: {
        lesson_id: lesson1.lesson_id,
        question_id: q1.question_id,
        exercise_type: 'MULTIPLE_CHOICE',
        difficulty: 'Leicht',
        points: 10,
        repetition_priority: 1
      }
    });

    const q1b = await prisma.question.create({
      data: {
        question_text: 'Sie bemerken, dass der Kunde während der Angebotsphase immer wieder auf die Uhr schaut und verschränkte Arme hat. Was tun Sie?',
        question_type: 'MULTIPLE_CHOICE',
        difficulty: 'Mittel',
        insurance_domain: 'Beratung',
        validation_status: 'VALIDATED',
        answer_options: {
          create: [
            { option_text: 'Ich rede schneller, um schneller zum Abschluss zu kommen.', validated_correctness: false, validation_status: 'VALIDATED' },
            { option_text: 'Ich spreche ihn auf die nonverbalen Signale an und frage, ob wir abkürzen oder einen neuen Termin vereinbaren sollen.', validated_correctness: true, validation_status: 'VALIDATED', reviewer_notes: 'Richtig, Metakommunikation hilft Missverständnisse zu klären.' },
            { option_text: 'Ich ignoriere es, da es nur ein Detail ist.', validated_correctness: false, validation_status: 'VALIDATED' },
            { option_text: 'Ich breche das Gespräch sofort ab.', validated_correctness: false, validation_status: 'VALIDATED' }
          ]
        }
      }
    });

    await prisma.moduleExercise.create({
      data: {
        lesson_id: lesson1.lesson_id,
        question_id: q1b.question_id,
        exercise_type: 'MULTIPLE_CHOICE',
        difficulty: 'Mittel',
        points: 20,
        repetition_priority: 2
      }
    });

    console.log(`Created Lesson 1 of Kundengespräch: ${lesson1.title}`);
  }

  // Find Module "Compliance"
  const moduleCompliance = await prisma.learningModule.findFirst({
    where: { title: 'Compliance', track_id: track.track_id }
  });

  if (moduleCompliance) {
    const existingLessons = await prisma.moduleLesson.findMany({
      where: { module_id: moduleCompliance.module_id }
    });
    for (const l of existingLessons) {
      await prisma.moduleExercise.deleteMany({ where: { lesson_id: l.lesson_id } });
    }
    await prisma.moduleLesson.deleteMany({
      where: { module_id: moduleCompliance.module_id }
    });

    const lesson1 = await prisma.moduleLesson.create({
      data: {
        module_id: moduleCompliance.module_id,
        title: 'Informationspflicht nach VAG',
        lesson_type: 'CASE_STUDY',
        sequence_order: 1,
        xp_reward: 100,
        content_body: `
# Compliance im Versicherungsvertrieb

Als Versicherungsvermittler unterliegen Sie strengen regulatorischen Auflagen, um den Kundenschutz sicherzustellen.

## Kernpflichten nach VAG

- **Informationspflicht (Art. 45 VAG):** Identität, Bindungen, Haftung.
- **Dokumentationspflicht:** Die Beratung muss nachvollziehbar dokumentiert werden.

### Fallstudie: Informationspflicht

Ein Kunde fragt, ob Sie an eine bestimmte Versicherungsgesellschaft gebunden sind. Sie müssen diese Frage wahrheitsgemäss beantworten und idealerweise bereits vorab unaufgefordert diese Information schriftlich übergeben.
        `
      }
    });

    const q2 = await prisma.question.create({
      data: {
        question_text: 'Fallstudie: Ein Kunde schliesst bei Ihnen eine komplexe Lebensversicherung ab. Sie haben ihn ausführlich mündlich beraten, aber aus Zeitmangel kein Beratungsprotokoll erstellt. Wie ist die rechtliche Lage?',
        question_type: 'CASE_STUDY',
        difficulty: 'Schwer',
        insurance_domain: 'Compliance',
        validation_status: 'VALIDATED',
        answer_options: {
          create: [
            { option_text: 'Korrekt, da mündliche Beratungen bei Bestandskunden ausreichen.', validated_correctness: false, validation_status: 'VALIDATED' },
            { option_text: 'Verstoss gegen die gesetzliche Dokumentationspflicht. Die Beratung muss zwingend protokolliert und dem Kunden übergeben werden.', validated_correctness: true, validation_status: 'VALIDATED', reviewer_notes: 'Gemäss revidiertem VAG ist die Dokumentation zwingend.' },
            { option_text: 'Zulässig, wenn der Kunde auf das Protokoll verzichtet hat.', validated_correctness: false, validation_status: 'VALIDATED' }
          ]
        }
      }
    });

    await prisma.moduleExercise.create({
      data: {
        lesson_id: lesson1.lesson_id,
        question_id: q2.question_id,
        exercise_type: 'CASE_STUDY',
        difficulty: 'Schwer',
        points: 50,
        repetition_priority: 1
      }
    });

    const q2b = await prisma.question.create({
      data: {
        question_text: 'Welche Information müssen Sie dem Kunden gemäss Art. 45 VAG NICHT zwingend unaufgefordert beim Erstkontakt mitteilen?',
        question_type: 'MULTIPLE_CHOICE',
        difficulty: 'Mittel',
        insurance_domain: 'Compliance',
        validation_status: 'VALIDATED',
        answer_options: {
          create: [
            { option_text: 'Ihre Identität und Adresse', validated_correctness: false, validation_status: 'VALIDATED' },
            { option_text: 'Die genaue Höhe Ihrer Provision in Franken', validated_correctness: true, validation_status: 'VALIDATED', reviewer_notes: 'Richtig. Provisionen müssen nur auf ausdrückliches Verlangen offengelegt werden.' },
            { option_text: 'Ob Sie gebundener oder ungebundener Vermittler sind', validated_correctness: false, validation_status: 'VALIDATED' },
            { option_text: 'Angaben zur Haftung für Nachlässigkeiten', validated_correctness: false, validation_status: 'VALIDATED' }
          ]
        }
      }
    });

    await prisma.moduleExercise.create({
      data: {
        lesson_id: lesson1.lesson_id,
        question_id: q2b.question_id,
        exercise_type: 'MULTIPLE_CHOICE',
        difficulty: 'Mittel',
        points: 20,
        repetition_priority: 2
      }
    });

    console.log(`Created Lesson 1 of Compliance: ${lesson1.title}`);
  }

  console.log('Beratung & Compliance Seeding complete.');
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
