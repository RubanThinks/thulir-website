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
    title: "Paediatric Occupational Therapy & Sensory Integration",
    slug: "occupational-therapy",
    category: "therapy",
    shortDescription:
      "Sensory integration, tactile exploration, motor planning, and functional independence for children with developmental differences.",
    fullDescription:
      "Our paediatric occupational therapy department focuses on enabling children to engage meaningfully in everyday activities (occupations). Using evidence-informed Sensory Integration (Ayres SI) techniques, our certified paediatric occupational therapists create personalized sensory diets and structured play environments to help children regulate their sensory systems, develop fine motor coordination, and master daily self-care routines.",
    clinicalApproaches: [
      "Sensory Integration (Ayres SI) swinging, suspended apparatus & tactile bins",
      "Fine motor precision, bilateral coordination, and pencil grasp development",
      "Motor planning (praxis) and spatial-body awareness exercises",
      "Self-regulation strategies and transition support for school and home",
    ],
    targetAgeRange: "2 to 16 years",
    heroImageUrl: "/assets/images/therapies/occupational_sensory.jpg",
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
    heroImageUrl: "/assets/images/therapies/speech_therapy.jpg",
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
    heroImageUrl: "/assets/images/therapies/pediatric_physiotherapy.jpg",
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
    heroImageUrl: "/assets/images/therapies/special_education_iep.jpg",
    order: 4,
    isPublished: true,
  },
  {
    id: "behavior-therapy",
    title: "Behavior Therapy & Emotional Regulation",
    slug: "behavior-therapy",
    category: "therapy",
    shortDescription:
      "Positive behavioral support, emotional self-regulation, coping strategies, and adaptive social behaviors.",
    fullDescription:
      "Our Behavior Therapy program supports children facing behavioral challenges, emotional dysregulation, anxiety, or social difficulties. Using positive behavioral interventions and supportive modification strategies, our specialists work closely with children and families to reduce distress, foster emotional awareness, and build constructive coping habits.",
    clinicalApproaches: [
      "Positive Behavioral Interventions and Supports (PBIS) tailored to child triggers",
      "Emotional self-regulation techniques and visual calming schedules",
      "Social skills training, empathy development, and peer cooperation",
      "Parent coaching for consistent home behavioral reinforcement",
    ],
    targetAgeRange: "3 to 18 years",
    heroImageUrl: "/assets/images/therapies/behavior_therapy.jpg",
    order: 5,
    isPublished: true,
  },
  {
    id: "sensory-integration",
    title: "Sensory Integration Therapy (Ayres SI)",
    slug: "sensory-integration",
    category: "therapy",
    shortDescription:
      "Specialized sensory gym sessions addressing sensory processing disorders, vestibular input, and proprioception.",
    fullDescription:
      "Sensory Integration Therapy addresses sensory defensiveness, under-responsiveness, or seeking behaviors in children with Sensory Processing Disorder (SPD), Autism, and ADHD. Conducted in our fully-equipped sensory integration gym with swings, crash pads, and textured tactile media, sessions help organize the central nervous system.",
    clinicalApproaches: [
      "Vestibular stimulation via multi-directional therapy swings",
      "Proprioceptive heavy-work exercises for body positioning and calming",
      "Tactile desensitization and sensory modulation pathways",
      "Individualized sensory diet programs for classroom and home",
    ],
    targetAgeRange: "2 to 16 years",
    heroImageUrl: "/assets/images/therapies/occupational_sensory.jpg",
    order: 6,
    isPublished: true,
  },
  {
    id: "neuro-developmental-therapy",
    title: "Neuro Developmental Therapy (NDT)",
    slug: "neuro-developmental-therapy",
    category: "therapy",
    shortDescription:
      "Hands-on neuromotor facilitation for children with cerebral palsy, developmental delays, and neuromotor coordination challenges.",
    fullDescription:
      "Neuro Developmental Therapy (NDT / Bobath approach) focuses on guiding posture and movement control through specialized handling techniques. Our trained pediatric therapists assist children with cerebral palsy, low muscle tone, and developmental motor impairments to achieve more efficient, voluntary motor patterns.",
    clinicalApproaches: [
      "Facilitation of normal postural alignment and righting reactions",
      "Inhibition of abnormal reflex patterns and muscle hypertonicity",
      "Dynamic motor control during sitting, standing, and transfers",
      "Assistive positioning and adaptive seating optimization",
    ],
    targetAgeRange: "1 to 18 years",
    heroImageUrl: "/assets/images/therapies/neuro_developmental_ndt.jpg",
    order: 7,
    isPublished: true,
  },
  {
    id: "psychological-services",
    title: "Psychological Services & Developmental Assessment",
    slug: "psychological-services",
    category: "support",
    shortDescription:
      "Psycho-developmental evaluations, cognitive screenings, parent counseling, and individualized psychological guidance.",
    fullDescription:
      "Our Psychological Services provide compassionate psychological evaluations, developmental quotient screenings, and therapeutic counseling for children and parents. We help families understand developmental diagnoses including Autism Spectrum, ADHD, and Learning Difficulties, creating a clear roadmap for intervention.",
    clinicalApproaches: [
      "Developmental Quotient (DQ) and psycho-educational diagnostic profiling",
      "Parent counseling, emotional support, and acceptance guidance",
      "Individual play-based counseling for anxiety and stress reduction",
      "Behavioral and emotional management workshops for families",
    ],
    targetAgeRange: "2 to 18+ years",
    heroImageUrl: "/assets/images/therapies/psychological_services.jpg",
    order: 8,
    isPublished: true,
  },
  {
    id: "expressive-arts-therapy",
    title: "Play, Art, Music & Dance Therapy",
    slug: "play-art-music-dance-therapy",
    category: "therapy",
    shortDescription:
      "Multi-sensory creative expression using music, rhythm, painting, and movement to foster joy and communication.",
    fullDescription:
      "Children express and process emotions deeply through the arts. Our expressive arts therapy brings together therapeutic play, visual art, musical rhythm, and dance movement to stimulate sensory integration, motor coordination, and non-verbal communication in an uplifting, creative setting.",
    clinicalApproaches: [
      "Rhythm and percussion instruments for bilateral coordination and auditory tracking",
      "Tactile art and finger painting for fine motor and emotional release",
      "Creative movement and dance therapy for body awareness and balance",
      "Interactive social group play building collaborative peer connections",
    ],
    targetAgeRange: "3 to 18 years",
    heroImageUrl: "/assets/images/therapies/art_music_dance_therapy.jpg",
    order: 9,
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
      "Practical household chores and personal belonging management",
    ],
    targetAgeRange: "6 to 18+ years",
    heroImageUrl: "/assets/images/therapies/adl_life_skills.jpg",
    order: 10,
    isPublished: true,
  },
  {
    id: "vocational-training",
    title: "Pre-Vocational & Vocational Training",
    slug: "vocational-training",
    category: "education",
    shortDescription:
      "Workplace skill readiness, task endurance, craft production, and transition support for teens and young adults.",
    fullDescription:
      "Our Pre-Vocational and Vocational Training prepares adolescent and young adult students with special needs for purposeful, dignified engagement in society. Through structured repetitive tasks, craftwork, packaging, digital entry, and workplace etiquette, students build stamina, responsibility, and proud vocational capability.",
    clinicalApproaches: [
      "Handmade crafts, paper bag making, and packaging skills",
      "Assembly-line task sequencing, quality checking, and work endurance",
      "Workplace etiquette, time awareness, and cooperative peer teamwork",
      "Vocational placement exploration and sheltered workshop pathways",
    ],
    targetAgeRange: "14 to 25+ years",
    heroImageUrl: "/assets/images/life_skills_training.jpg",
    order: 11,
    isPublished: true,
  },
  {
    id: "early-intervention",
    title: "Early Intervention & Infant Stimulation",
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
    heroImageUrl: "/assets/images/therapies/early_intervention.jpg",
    order: 12,
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
