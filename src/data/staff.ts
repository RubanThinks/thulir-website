export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  category: "founder" | "therapy" | "education" | "support";
  fileName: string;
  image: string;
  qualifications?: string;
  isFounder?: boolean;
}

export const STAFF_MEMBERS: StaffMember[] = [
  // --- BATCH 1: Clinical Leadership & Physiotherapy ---
  {
    id: "staff-venkatesan",
    name: "Dr. S. Venkatesan",
    role: "Peadiatric Occupational Therapist",
    department: "Clinical Direction & Paediatric OT",
    category: "founder",
    fileName: "Dr S.Venkatesan.PNG",
    image: "/assets/staffs/Dr%20S.Venkatesan.PNG",
    qualifications: "BOT (KMCH, The Tamil Nadu Dr. M.G.R. Med Univ), MOT (Santosh Med College, ABVMU)",
    isFounder: true,
  },
  {
    id: "staff-prem-kumar",
    name: "Dr. Prem Kumar",
    role: "Consultant Physiotherapist",
    department: "Pediatric Physiotherapy & Rehabilitation",
    category: "therapy",
    fileName: "Dr Prem kumar.jpeg",
    image: "/assets/staffs/Dr%20Prem%20kumar.jpeg",
    qualifications: "BPT, Paediatric Physical Rehabilitation Specialist",
  },
  {
    id: "staff-manju",
    name: "Dr. Manju",
    role: "Physiotherapist",
    department: "Neuro-Developmental & Motor Rehabilitation",
    category: "therapy",
    fileName: "Manju.PNG",
    image: "/assets/staffs/Manju.PNG",
    qualifications: "BPT, Postural Stability & Gait Training Specialist",
  },
  {
    id: "staff-paed-physio",
    name: "Paediatric Physiotherapist",
    role: "Paediatric Physiotherapist",
    department: "Gross Motor Milestone Development",
    category: "therapy",
    fileName: "Peadiatric physiotherapist.PNG",
    image: "/assets/staffs/Peadiatric%20physiotherapist.PNG",
    qualifications: "Certified Pediatric Physical Therapist",
  },

  // --- BATCH 2: Autism & Special Education Specialists ---
  {
    id: "staff-sudha",
    name: "Mrs. Sudha",
    role: "Teacher - Autism Specialist",
    department: "Autism Spectrum & Behavioral Guidance",
    category: "education",
    fileName: "Mrs Sudha.PNG",
    image: "/assets/staffs/Mrs%20Sudha.PNG",
    qualifications: "Specialized Autism Educator & Behavioral Practitioner",
  },
  {
    id: "staff-shobana-mercy",
    name: "Mrs. Shobana Mercy",
    role: "Special Educator",
    department: "Individualized Education Program (IEP)",
    category: "education",
    fileName: "Mrs Shobana mercy.PNG",
    image: "/assets/staffs/Mrs%20Shobana%20mercy.PNG",
    qualifications: "M.Ed. Special Education Specialist",
  },
  {
    id: "staff-princy-angelin",
    name: "Mrs. Princy Angelin",
    role: "Special Education Teacher",
    department: "Cognitive & Literacy Development",
    category: "education",
    fileName: "Mrs Princy Angelin.PNG",
    image: "/assets/staffs/Mrs%20Princy%20Angelin.PNG",
    qualifications: "B.Ed. Special Education (Paediatric Learning Needs)",
  },
  {
    id: "staff-malathi",
    name: "Mrs. Malathi",
    role: "Assistant Teacher",
    department: "Classroom Readiness & Motor Activities",
    category: "education",
    fileName: "Mrs Malathi.PNG",
    image: "/assets/staffs/Mrs%20Malathi.PNG",
    qualifications: "Certified Inclusive Classroom Instructor",
  },

  // --- BATCH 3: Developmental Educators & Therapists ---
  {
    id: "staff-damsi-viviana",
    name: "Mrs. Damsi Viviana",
    role: "Special Educator",
    department: "Structured Learning & Sensory Support",
    category: "education",
    fileName: "Mrs Damsi Viviana.PNG",
    image: "/assets/staffs/Mrs%20Damsi%20Viviana.PNG",
    qualifications: "Diploma in Special Education (ASD & MR)",
  },
  {
    id: "staff-jayanthi",
    name: "Mrs. Jayanthi",
    role: "Special Education Educator",
    department: "Foundational Communication & Social Skills",
    category: "education",
    fileName: "Mrs Jayanthi.PNG",
    image: "/assets/staffs/Mrs%20Jayanthi.PNG",
    qualifications: "Specialized Educator in Developmental Milestones",
  },
  {
    id: "staff-pathma-priya",
    name: "Mrs. Pathma Priya",
    role: "Special Educator",
    department: "Sensory Learning & Academic Adaptation",
    category: "education",
    fileName: "Mrs Pathma priya.PNG",
    image: "/assets/staffs/Mrs%20Pathma%20priya.PNG",
    qualifications: "Bachelor of Special Education",
  },
  {
    id: "staff-anuppama",
    name: "Ms. Anuppama",
    role: "Paediatric Therapist & Educator",
    department: "Therapeutic Education & Play Integration",
    category: "therapy",
    fileName: "Ms Anuppama.PNG",
    image: "/assets/staffs/Ms%20Anuppama.PNG",
    qualifications: "Paediatric Rehabilitation Practitioner",
  },

  // --- BATCH 4: Therapy Integration, Admin & Campus Support ---
  {
    id: "staff-joice",
    name: "Ms. Joice A.",
    role: "Early Childhood Educator",
    department: "Early Childhood Stimulation",
    category: "education",
    fileName: "Ms Joice A.PNG",
    image: "/assets/staffs/Ms%20Joice%20A.PNG",
    qualifications: "Certified Early Interventionist",
  },
  {
    id: "staff-srinitha",
    name: "Ms. Srinitha",
    role: "Therapist & Developmental Trainer",
    department: "Fine Motor & Communication Training",
    category: "therapy",
    fileName: "Ms Srinitha.PNG",
    image: "/assets/staffs/Ms%20Srinitha.PNG",
    qualifications: "Developmental Therapy Specialist",
  },
  {
    id: "staff-saravanan",
    name: "Mr. Saravanan",
    role: "Administrator",
    department: "Trust Administration & Campus Operations",
    category: "support",
    fileName: "Mr Saravanan.PNG",
    image: "/assets/staffs/Mr%20Saravanan.PNG",
    qualifications: "Campus Operations & Family Coordination Lead",
  },
  {
    id: "staff-shanthi",
    name: "Mrs. Shanthi",
    role: "Care Taker & Student Care Lead",
    department: "Student Well-Being & Personal Care",
    category: "support",
    fileName: "Mrs Shanthi.PNG",
    image: "/assets/staffs/Mrs%20Shanthi.PNG",
    qualifications: "Trained Child Safety & Care Attendant",
  },

  // --- BATCH 5: Dedicated Student Care & Assisted Living ---
  {
    id: "staff-amutha",
    name: "Mrs. Amutha",
    role: "Care Taker",
    department: "Activities of Daily Living (ADL) Care",
    category: "support",
    fileName: "Mrs Amutha.PNG",
    image: "/assets/staffs/Mrs%20Amutha.PNG",
    qualifications: "Child Support & Daily Routine Assistant",
  },
  {
    id: "staff-rani",
    name: "Mrs. Rani",
    role: "Care Taker",
    department: "Classroom Assistance & Student Safety",
    category: "support",
    fileName: "rani.PNG",
    image: "/assets/staffs/rani.PNG",
    qualifications: "Student Mobility & Support Specialist",
  },
  {
    id: "staff-shanmuga-priya",
    name: "Mrs. Shanmuga Priya",
    role: "Care Taker",
    department: "Student Care & Sensory Regulation Support",
    category: "support",
    fileName: "Mrs Shanmuga priya.PNG",
    image: "/assets/staffs/Mrs%20Shanmuga%20priya.PNG",
    qualifications: "Child Care & Hygiene Support Attendant",
  },
];

export interface StaffDivision {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  members: StaffMember[];
}

export const STAFF_DIVISIONS: StaffDivision[] = [
  {
    id: "division-1",
    title: "Clinical Leadership & Physiotherapy",
    subtitle: "Pioneering evidence-based paediatric occupational & physical rehabilitation",
    badge: "Division 01 • Clinical Directors & Physical Rehabilitation",
    members: STAFF_MEMBERS.slice(0, 4),
  },
  {
    id: "division-2",
    title: "Autism Specialists & Special Educators",
    subtitle: "Individualized learning pathways, sensory integration & behavioral guidance",
    badge: "Division 02 • Autism Spectrum & IEP Faculty",
    members: STAFF_MEMBERS.slice(4, 8),
  },
  {
    id: "division-3",
    title: "Developmental Educators & Therapists",
    subtitle: "Structured cognitive development, adaptive education & milestone achievement",
    badge: "Division 03 • Developmental & Therapeutic Education",
    members: STAFF_MEMBERS.slice(8, 12),
  },
  {
    id: "division-4",
    title: "Early Stimulation & Campus Administration",
    subtitle: "Early childhood readiness, fine-motor stimulation & administrative leadership",
    badge: "Division 04 • Early Intervention & Trust Administration",
    members: STAFF_MEMBERS.slice(12, 16),
  },
  {
    id: "division-5",
    title: "Compassionate Student Care & Assistance",
    subtitle: "Warm, empathetic daily living support ensuring round-the-clock safety and nurture",
    badge: "Division 05 • Student Care & Daily Living Support",
    members: STAFF_MEMBERS.slice(16, 19),
  },
];

export function getStaffInBatches(batchSize = 4): StaffMember[][] {
  const batches: StaffMember[][] = [];
  for (let i = 0; i < STAFF_MEMBERS.length; i += batchSize) {
    batches.push(STAFF_MEMBERS.slice(i, i + batchSize));
  }
  return batches;
}

