import "server-only";
import { getAdminDb } from "../firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export interface SeedProgram {
  id: string;
  title: string;
  slug: string;
  category: "therapy" | "education" | "support";
  shortDescription: string;
  fullDescription: string;
  clinicalApproaches: string[];
  targetAgeRange: string;
  heroImageUrl: string;
  order: number;
  isPublished: boolean;
}

export const BASELINE_PROGRAMS: SeedProgram[] = [
  {
    id: "occupational-therapy",
    title: "Occupational Therapy & Sensory Integration",
    slug: "occupational-therapy",
    category: "therapy",
    shortDescription:
      "Sensory integration, tactile exploration, motor planning, and functional independence for children with developmental differences.",
    fullDescription:
      "Our occupational therapy department focuses on enabling children to engage meaningfully in everyday activities (occupations). Using evidence-informed Sensory Integration (Ayres SI) techniques, our certified occupational therapists create personalized sensory diets and structured play environments to help children regulate their sensory systems, develop fine motor coordination, and master daily self-care routines.",
    clinicalApproaches: [
      "Sensory Integration (Ayres SI) swinging, suspended apparatus & tactile bins",
      "Fine motor precision, bilateral coordination, and pencil grasp development",
      "Motor planning (praxis) and spatial-body awareness exercises",
      "Self-regulation strategies and transition support for school and home",
    ],
    targetAgeRange: "2 to 16 years",
    heroImageUrl: "/assets/images/occupational_therapy.jpg",
    order: 1,
    isPublished: true,
  },
  {
    id: "speech-therapy",
    title: "Speech & Communication Therapy",
    slug: "speech-therapy",
    category: "therapy",
    shortDescription:
      "Nurturing articulation, receptive understanding, social interaction, and alternative augmentative communication.",
    fullDescription:
      "Communication is vital for self-expression, emotional well-being, and social interaction. Our pediatric speech-language therapists work with each child to nurture verbal speech, receptive understanding, or alternative and augmentative communication (AAC) tools tailored to their unique communication profile.",
    clinicalApproaches: [
      "Oral-motor stimulation and speech articulation clarity",
      "Receptive and expressive language acquisition",
      "Augmentative and Alternative Communication (AAC) cards and digital visual boards",
      "Social pragmatics, conversational turn-taking, and peer interactions",
    ],
    targetAgeRange: "2 to 18 years",
    heroImageUrl: "/assets/images/speech_language_therapy.jpg",
    order: 2,
    isPublished: true,
  },
  {
    id: "physiotherapy",
    title: "Pediatric Physiotherapy",
    slug: "physiotherapy",
    category: "therapy",
    shortDescription:
      "Gross motor milestones, postural stability, muscle tone regulation, and confident mobility.",
    fullDescription:
      "Pediatric physiotherapy supports children in gaining strength, balance, and gross motor coordination. Our therapeutic exercises are adapted to developmental milestones, helping children participate more fully in classroom movements, outdoor play, and sports.",
    clinicalApproaches: [
      "Postural control, stability, and trunk strengthening",
      "Gross motor milestones: sitting balance, crawling, standing, and gait training",
      "Muscle tone regulation and joint mobility facilitation",
      "Endurance building for active play and sports participation",
    ],
    targetAgeRange: "1 to 16 years",
    heroImageUrl: "/assets/images/pediatric_physiotherapy.jpg",
    order: 3,
    isPublished: true,
  },
  {
    id: "special-education",
    title: "Special Education & Individualized Education Programs (IEP)",
    slug: "special-education",
    category: "education",
    shortDescription:
      "Tailored academic curricula, functional literacy, cognitive milestones, and structured classroom routines.",
    fullDescription:
      "Every child learns differently. Our Special Education department provides an individualized educational environment where students progress according to a personalized Individualized Education Program (IEP). Developed collaboratively with educators, pediatric therapists, and parents, each IEP outlines measurable academic, functional, and life skill objectives.",
    clinicalApproaches: [
      "Structured TEACCH-adapted classrooms with predictable schedules and visual prompts",
      "Functional literacy, numeracy, and cognitive skill acquisition",
      "Individualized Education Programs (IEPs) reviewed quarterly with parents",
      "Pre-academic readiness for mainstream school integration where appropriate",
    ],
    targetAgeRange: "3 to 18 years",
    heroImageUrl: "/assets/images/special_education.jpg",
    order: 4,
    isPublished: true,
  },
  {
    id: "life-skills",
    title: "Activities of Daily Living (ADL) & Life Skills Training",
    slug: "life-skills",
    category: "support",
    shortDescription:
      "Fostering self-care routines, dining etiquette, household tasks, and community navigation for lifelong independence.",
    fullDescription:
      "Empowering students to achieve meaningful independence in home and community settings. Our life skills program translates clinical gains into practical daily competence, encompassing hygiene, cooking basics, money handling, and safe community outings.",
    clinicalApproaches: [
      "Self-care, dressing, buttoning, hygiene, and personal grooming routines",
      "Dining etiquette, safe utensil usage, and kitchen food-preparation basics",
      "Money concepts, shopping lists, and supervised supermarket visits",
      "Pre-vocational task completion and work-routine endurance",
    ],
    targetAgeRange: "6 to 18+ years",
    heroImageUrl: "/assets/images/life_skills_training.jpg",
    order: 5,
    isPublished: true,
  },
  {
    id: "early-intervention",
    title: "Early Intervention & Sensory Stimulation",
    slug: "early-intervention",
    category: "education",
    shortDescription:
      "Comprehensive developmental support for infants and toddlers during critical neural development windows.",
    fullDescription:
      "The earliest years are the most transformative for neurodevelopment. Our Early Intervention program partners closely with families of infants and toddlers experiencing developmental delays or neurodivergent traits to build a strong foundation of sensory, social, and motor capabilities.",
    clinicalApproaches: [
      "Multisensory stimulation and responsive caregiver-child bonding techniques",
      "Early communicative intent, eye contact, and vocalization reinforcement",
      "Tummy time, infant gross motor rolling, and milestone tracking",
      "Parent education workshops and home developmental activity toolkits",
    ],
    targetAgeRange: "6 months to 4 years",
    heroImageUrl: "/assets/images/early_intervention.jpg",
    order: 6,
    isPublished: true,
  },
];

/**
 * Safely seeds baseline programs into Firestore if the `services` collection is empty.
 * Does not overwrite existing programs or create duplicates.
 */
export async function seedProgramsIfEmpty(): Promise<{ seeded: boolean; count: number }> {
  const adminDb = getAdminDb();
  if (!adminDb) return { seeded: false, count: 0 };

  try {
    const existing = await adminDb.collection("services").limit(1).get();
    if (!existing.empty) {
      return { seeded: false, count: 0 };
    }

    const batch = adminDb.batch();
    for (const prog of BASELINE_PROGRAMS) {
      const docRef = adminDb.collection("services").doc(prog.id);
      batch.set(docRef, {
        ...prog,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
    return { seeded: true, count: BASELINE_PROGRAMS.length };
  } catch (err) {
    console.error("[Programs Seed Error]:", err);
    return { seeded: false, count: 0 };
  }
}
