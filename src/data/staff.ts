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
  // 1. Dr S.Venkatesan - Peadiatric occupational therapist
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

  // 2. Dr E.Premkumar - Consultant Physiotherapist 
  {
    id: "staff-prem-kumar",
    name: "Dr. E. Premkumar",
    role: "Consultant Physiotherapist",
    department: "Pediatric Physiotherapy & Rehabilitation",
    category: "therapy",
    fileName: "Dr Prem kumar.jpeg",
    image: "/assets/staffs/Dr%20Prem%20kumar.jpeg",
    qualifications: "BPT, Paediatric Physical Rehabilitation Specialist",
  },

  // 3. Mr M.Saravanan - Administrator 
  {
    id: "staff-saravanan",
    name: "Mr. M. Saravanan",
    role: "Administrator",
    department: "Trust Administration & Campus Operations",
    category: "support",
    fileName: "Mr Saravanan.PNG",
    image: "/assets/staffs/Mr%20Saravanan.PNG",
    qualifications: "Campus Operations & Family Coordination Lead",
  },

  // 4. Dr S.Akila - Peadiatric Physiotherapist
  {
    id: "staff-akila",
    name: "Dr. S. Akila",
    role: "Peadiatric Physiotherapist",
    department: "Gross Motor Milestone Development",
    category: "therapy",
    fileName: "Peadiatric physiotherapist.PNG",
    image: "/assets/staffs/Peadiatric%20physiotherapist.PNG",
    qualifications: "Certified Pediatric Physical Therapist",
  },

  // 5. Dr A.Manju - Consaltant Physiotherapist
  {
    id: "staff-manju",
    name: "Dr. A. Manju",
    role: "Consultant Physiotherapist",
    department: "Neuro-Developmental & Motor Rehabilitation",
    category: "therapy",
    fileName: "Manju.PNG",
    image: "/assets/staffs/Manju.PNG",
    qualifications: "BPT, Postural Stability & Gait Training Specialist",
  },

  // 6. Mrs Shobana mercy - Special Educator
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

  // 7. A.Sudha - Teacher-Autism Specialist
  {
    id: "staff-sudha",
    name: "Mrs. A. Sudha",
    role: "Teacher - Autism Specialist",
    department: "Autism Spectrum & Behavioral Guidance",
    category: "education",
    fileName: "Mrs Sudha.PNG",
    image: "/assets/staffs/Mrs%20Sudha.PNG",
    qualifications: "Specialized Autism Educator & Behavioral Practitioner",
  },

  // 8. Ms A.Joice - Psychologist
  {
    id: "staff-joice",
    name: "Ms. A. Joice",
    role: "Psychologist",
    department: "Child & Developmental Psychology",
    category: "therapy",
    fileName: "Ms Joice A.PNG",
    image: "/assets/staffs/Ms%20Joice%20A.PNG",
    qualifications: "Child Psychologist & Behavioral Guidance Specialist",
  },

  // 9. Mrs M.Malathi - Teacher
  {
    id: "staff-malathi",
    name: "Mrs. M. Malathi",
    role: "Teacher",
    department: "Classroom Readiness & Motor Activities",
    category: "education",
    fileName: "Mrs Malathi.PNG",
    image: "/assets/staffs/Mrs%20Malathi.PNG",
    qualifications: "Certified Inclusive Classroom Instructor",
  },

  // 10. Mrs P.Damsi Viviana - Special Educator
  {
    id: "staff-damsi-viviana",
    name: "Mrs. P. Damsi Viviana",
    role: "Special Educator",
    department: "Structured Learning & Sensory Support",
    category: "education",
    fileName: "Mrs Damsi Viviana.PNG",
    image: "/assets/staffs/Mrs%20Damsi%20Viviana.PNG",
    qualifications: "Diploma in Special Education (ASD & MR)",
  },

  // 11. Ms Anupama.P - Special Educator 
  {
    id: "staff-anuppama",
    name: "Ms. Anupama P.",
    role: "Special Educator",
    department: "Special Education & Individualized Learning",
    category: "education",
    fileName: "Ms Anuppama.PNG",
    image: "/assets/staffs/Ms%20Anuppama.PNG",
    qualifications: "Special Educator",
  },

  // 12. Mrs J.Princy Angelin - Teacher
  {
    id: "staff-princy-angelin",
    name: "Mrs. J. Princy Angelin",
    role: "Teacher",
    department: "Cognitive & Literacy Development",
    category: "education",
    fileName: "Mrs Princy Angelin.PNG",
    image: "/assets/staffs/Mrs%20Princy%20Angelin.PNG",
    qualifications: "B.Ed. Special Education (Paediatric Learning Needs)",
  },

  // 13. Mrs Jayanthi - Special Educator
  {
    id: "staff-jayanthi",
    name: "Mrs. Jayanthi",
    role: "Special Educator",
    department: "Foundational Communication & Social Skills",
    category: "education",
    fileName: "Mrs Jayanthi.PNG",
    image: "/assets/staffs/Mrs%20Jayanthi.PNG",
    qualifications: "Specialized Educator in Developmental Milestones",
  },

  // 14. Ms S.K.Srinitha - Psychologist
  {
    id: "staff-srinitha",
    name: "Ms. S.K. Srinitha",
    role: "Psychologist",
    department: "Psychological Services & Behavioral Therapy",
    category: "therapy",
    fileName: "Ms Srinitha.PNG",
    image: "/assets/staffs/Ms%20Srinitha.PNG",
    qualifications: "Psychological Services & Developmental Specialist",
  },

  // 15. Mrs Amutha - Care taker
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

  // 16. Mrs Shanmuga priya - Care taker
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

  // 17. Mrs Pathma priya - Care taker
  {
    id: "staff-pathma-priya",
    name: "Mrs. Pathma Priya",
    role: "Care Taker",
    department: "Student Care & Campus Support",
    category: "support",
    fileName: "Mrs Pathma priya.PNG",
    image: "/assets/staffs/Mrs%20Pathma%20priya.PNG",
    qualifications: "Child Support & Daily Routine Assistant",
  },

  // 18. Mrs Rani - Care taker
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

  // 19. Mrs Shanthi - Care taker
  {
    id: "staff-shanthi",
    name: "Mrs. Shanthi",
    role: "Care Taker",
    department: "Student Well-Being & Personal Care",
    category: "support",
    fileName: "Mrs Shanthi.PNG",
    image: "/assets/staffs/Mrs%20Shanthi.PNG",
    qualifications: "Trained Child Safety & Care Attendant",
  },

  // 20. Mrs Mariyamma.K - Care taker
  {
    id: "staff-mariyamma",
    name: "Mrs. Mariyamma K.",
    role: "Care Taker",
    department: "Student Well-Being & Care Assistance",
    category: "support",
    fileName: "Mrs Mariyamma K.PNG",
    image: "/assets/staffs/Mrs%20Mariyamma%20K.PNG",
    qualifications: "Child Care & Daily Living Support Attendant",
  },

  // 21. Master C.Jashper - Smart Assist 
  {
    id: "staff-jashper",
    name: "Master C. Jashper",
    role: "Smart Assist",
    department: "Digital Learning & Assistive Student Operations",
    category: "support",
    fileName: "Jashper.PNG",
    image: "/assets/staffs/Jashper.PNG",
    qualifications: "Smart Learning & Assistive Student Operations",
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
    title: "Clinical Leadership & Rehabilitation",
    subtitle: "Pioneering clinical direction, institutional governance and paediatric physiotherapy",
    badge: "Division 01 • Clinical Directors & Physiotherapy",
    members: STAFF_MEMBERS.slice(0, 4),
  },
  {
    id: "division-2",
    title: "Therapies, Special Education & Psychology",
    subtitle: "Evidence-based paediatric physical therapy, autism education & psychological guidance",
    badge: "Division 02 • Specialized Therapies & Psychology",
    members: STAFF_MEMBERS.slice(4, 8),
  },
  {
    id: "division-3",
    title: "Special Education & Cognitive Development",
    subtitle: "Structured cognitive development, adaptive literacy & sensory integration",
    badge: "Division 03 • Developmental & Therapeutic Education",
    members: STAFF_MEMBERS.slice(8, 12),
  },
  {
    id: "division-4",
    title: "Special Education, Psychology & Student Care",
    subtitle: "Child psychology, individualized learning & foundational student care",
    badge: "Division 04 • Education & Care Supervision",
    members: STAFF_MEMBERS.slice(12, 16),
  },
  {
    id: "division-5",
    title: "Compassionate Student Care & Assistance",
    subtitle: "Warm, empathetic daily living support ensuring round-the-clock safety and nurture",
    badge: "Division 05 • Student Care & Daily Living Support",
    members: STAFF_MEMBERS.slice(16, 20),
  },
  {
    id: "division-6",
    title: "Smart Learning & Assistive Support",
    subtitle: "Digital learning tools and classroom assistive technology",
    badge: "Division 06 • Digital & Assistive Learning",
    members: STAFF_MEMBERS.slice(20, 21),
  },
];

export function getStaffInBatches(batchSize = 4): StaffMember[][] {
  const batches: StaffMember[][] = [];
  for (let i = 0; i < STAFF_MEMBERS.length; i += batchSize) {
    batches.push(STAFF_MEMBERS.slice(i, i + batchSize));
  }
  return batches;
}
