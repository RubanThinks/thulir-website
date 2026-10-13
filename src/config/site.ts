/**
 * Master Site Configuration and Verified Brand Data
 * Primary Source: Thulir - Profile Feb 2026.pdf & Official Brand Assets
 */

export const siteConfig = {
  brand: {
    primaryName: "Thulir Special School",
    secondaryName: "Thulir Therapy Centre and Special School",
    taglineTamil: "பயிற்சியும், பயிற்றுவித்தல் சார்ந்த இடமும்",
    taglineEnglish: "A Place of Training, Therapy and Specialized Education",
    parentOrganization: "Thulir Educational Trust for Special Needs",
    foundedYear: 2017, // Started as Thulir Therapy Centre
    transitionedYear: 2022, // Developed into Thulir Special School with 2 branches
    officialWebsite: "https://thulirtherapycentre.com",
    instagram: "@thulir_special_school",
    instagramUrl: "https://instagram.com/thulir_special_school",
    youtubeChannelId: "UCVeaMkPHspDN7z_0GF1hlMg",
    youtubeUrl: "https://www.youtube.com/channel/UCVeaMkPHspDN7z_0GF1hlMg",
    googleReviewsUrl: "https://www.google.com/maps/search/?api=1&query=Thulir+Therapy+Centre+and+Special+School+Coimbatore", // Verified destination link
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125313.70496769146!2d76.81117454335937!3d11.0346295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85bbc9c175f23%3A0x29f7783bb34a50f0!2sThulir%20therapy%20centre%20and%20special%20school!5e0!3m2!1sen!2sin!4v1791743886919!5m2!1sen!2sin",
    branches: [
      {
        id: "rathinapuri",
        name: "Rathinapuri Campus (Main Center)",
        shortName: "Rathinapuri",
        locality: "Rathinapuri",
        address: "No. 42, Gandhiji Road, Thayirriteri Road, Rathinapuri, Coimbatore, Tamil Nadu 641027",
        city: "Coimbatore",
        state: "Tamil Nadu",
        pincode: "641027",
        country: "India",
        description: "Equipped with dedicated sensory integration facilities, speech cabins, and foundational life skills rooms.",
        isMain: true,
      },
      {
        id: "kuniyamuthur",
        name: "Kuniyamuthur Campus",
        shortName: "Kuniyamuthur",
        locality: "Kuniyamuthur",
        address: "No. 54, Anamanaicker Street (6th Cross), Park Avenue, Kuniyamuthur, Coimbatore, Tamil Nadu 641008",
        city: "Coimbatore",
        state: "Tamil Nadu",
        pincode: "641008",
        country: "India",
        description: "Specialized education and developmental therapy wing serving South Coimbatore families.",
        isMain: false,
      },
    ],
  },

  founder: {
    name: "Dr. S. Venkatesan",
    credentials: "BOT, CSIT, CAS, MOT (Pediatric Specialization)",
    role: "Founder and Managing Director",
    bioSummary:
      "A compassionate occupational therapist and first-generation graduate from Kallakurichi district. Dr. Venkatesan completed his Bachelor of Occupational Therapy (BOT) at Kovai Medical Center and Hospital (KMCH), Coimbatore, and his Master of Occupational Therapy with Pediatric Specialization from Santosh College of Occupational Therapy, Ghaziabad. He founded Thulir with an unwavering commitment to making evidence-based, compassionate pediatric therapy and special education accessible to every family.",
  },

  leadership: [
    {
      name: "Dr. S. Venkatesan",
      role: "Founder & Managing Director",
    },
    {
      name: "Dr. E. Premkumar",
      role: "Treasurer",
    },
    {
      name: "Gokila S.",
      role: "Secretary",
    },
    {
      name: "Karunakaran K.",
      role: "Trustee",
    },
  ],

  // Reported in February 2026 Profile
  verifiedMetrics: {
    yearsOfService: "8+",
    studentsHandled: "100+",
    inclusiveTransitions: "30+", // Students transitioning toward mainstream schooling
    branches: "2",
    walkathonParticipants: "1,000", // April 6 Race Course Walkathon
    communityMedicalAssistanceINR: "1.5 Lakhs", // Emergency surgery support for K. Sharvin
    sourceNote: "Figures reported in the organization's official profile",
  },

  vision:
    "To provide specialized services that support children's growth and development, empowering them to lead independent, fulfilling lives and contribute to society.",

  mission:
    "To nurture each student's individual skills through personalized training, helping them develop and lead a more independent and meaningful life.",

  contact: {
    // Kept empty until confirmed to avoid inventing phone numbers
    phone: "",
    // WhatsApp feature will remain disabled or link to contact form until verified phone number is set
    whatsappNumber: "", 
    email: "info@thulirtherapycentre.com",
    timings: "Monday - Saturday: 9:00 AM - 5:30 PM (Sessions by prior appointment)",
  },

  programsAndTherapies: [
    {
      id: "occupational-therapy",
      title: "Occupational Therapy",
      shortDesc:
        "Sensory integration, fine & gross motor coordination, postural balance, and Activities of Daily Living (ADL) tailored to each child's pace.",
      badge: "Pediatric Specialized",
      image: "/assets/images/sensory_occupational_room.jpg",
    },
    {
      id: "speech-therapy",
      title: "Speech & Communication Therapy",
      shortDesc:
        "Oral-motor stimulation, expressive vocabulary, articulation, social interactions, and functional language acquisition.",
      badge: "Clinical Intervention",
      image: "/assets/images/speech_language_therapy.jpg",
    },
    {
      id: "physiotherapy",
      title: "Pediatric Physiotherapy",
      shortDesc:
        "Strengthening musculoskeletal development, coordination, functional mobility, and balance support through gentle physical exercises.",
      badge: "Movement & Mobility",
      image: "/assets/images/pediatric_physiotherapy.jpg",
    },
    {
      id: "special-education",
      title: "Special Education & Early Intervention",
      shortDesc:
        "Individualized Education Programs (IEP), cognitive readiness, structured routines, and developmental milestone tracking for inclusive transition.",
      badge: "Individualized IEP",
      image: "/assets/images/special_education_classroom.jpg",
    },
  ],

  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Programs & Therapies", href: "/programs" },
    { label: "Our Impact", href: "/impact" },
    { label: "Gallery & Events", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
};
