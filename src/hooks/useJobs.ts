import { useState, useEffect } from 'react';

export interface Vacancy {
  id: string;
  title: string;
  refNumber: string;
  department: string;
  category: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
  location: string;
  workArrangement: 'On-site' | 'Hybrid' | 'Remote';
  summary: string;
  responsibilities: string[];
  minQualifications: string[];
  requiredExperience: string;
  requiredSkills: string[];
  preferredSkills: string[];
  benefits: string[];
  workingHours: string;
  positionsCount: number;
  deadline: string;
  expectedStartDate: string;
  status: 'Published' | 'Draft' | 'Scheduled' | 'Closed' | 'Archived';
  isFeatured: boolean;
  isUrgent: boolean;
  seoTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  slug: string;
  viewsCount: number;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export type Job = Vacancy;

export interface VacancyCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  vacanciesCount: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  vacanciesCount: number;
}

export interface EducationRecord {
  id: string;
  level: 'Certificate' | 'Diploma' | 'Higher Diploma' | 'Degree' | 'Masters' | 'PhD';
  institution: string;
  startYear: string;
  endYear: string;
  docName?: string;
}

export interface EmploymentRecord {
  id: string;
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string;
}

export interface MembershipRecord {
  id: string;
  bodyName: string;
  regNumber: string;
  certName?: string;
}

export interface ReferenceRecord {
  id: string;
  fullName: string;
  titleRelationship: string;
  company: string;
  yearsKnown: string;
  phone: string;
  email: string;
}

export interface JobApplication {
  id: string;
  appNumber: string;
  vacancyId: string;
  vacancyTitle: string;
  vacancyRef: string;
  department: string;
  status: 'New' | 'Shortlisted' | 'Under Review' | 'Interview Scheduled' | 'Rejected' | 'Hired' | 'Archived';
  submissionDate: string;
  submissionTimestamp: string;
  verificationStatus: 'Verified' | 'Pending';
  identity: {
    surname: string;
    firstName: string;
    middleName?: string;
    nationalId: string;
    nationalIdDocName?: string;
    kraPin: string;
    kraPinCertName?: string;
    phone: string;
    email: string;
    county: string;
  };
  education: EducationRecord[];
  employment: EmploymentRecord[];
  memberships: MembershipRecord[];
  references: ReferenceRecord[];
  cv: {
    fileName: string;
    fileSize: string;
  };
  declaration: {
    certifiedTrue: boolean;
    dataConsent: boolean;
  };
  adminNotes?: string;
}

export const KENYAN_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo/Marakwet', 'Embu', 'Garissa', 
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', "Murang'a", 
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 
  'Siaya', 'Taita/Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 
  'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

const INITIAL_VACANCIES: Vacancy[] = [
  {
    id: 'vac-1',
    title: 'Senior Micro-Finance Credit Officer',
    refNumber: 'NH-VAC-2026-001',
    department: 'Credit Operations',
    category: 'Credit & Risk',
    employmentType: 'Full-Time',
    location: 'Nyeri Main Branch',
    workArrangement: 'On-site',
    summary: 'Oversee credit underwriting, group loan appraisals, and M-PESA portfolio risk monitoring across Mount Kenya counties.',
    responsibilities: [
      'Appraise individual and group (Chama) credit applications in compliance with MFI lending policies.',
      'Conduct field risk assessments and verification visits across Nyeri and surrounding agricultural zones.',
      'Monitor loan portfolio quality and manage PAR (Portfolio at Risk) within strict benchmark thresholds.',
      'Liaise with recovery agents and legal teams for non-performing asset resolutions.'
    ],
    minQualifications: [
      'Bachelor’s Degree in Microfinance, Finance, Economics, or Business Administration.',
      'Certified Credit Professional (CCP-K) or equivalent professional accreditation.'
    ],
    requiredExperience: 'At least 4 years of hands-on credit officer experience in a licensed Kenyan MFI or SACCO.',
    requiredSkills: ['Group Lending (Chama)', 'M-PESA B2C Credit Systems', 'Financial Ratio Analysis', 'Swahili & English Fluency'],
    preferredSkills: ['Agricultural Lending Experience', 'Driving License (Motorcycle/Vehicle)'],
    benefits: ['Competitive Basic Salary + Performance Allowance', 'Comprehensive Medical Cover', 'Airtime & Field Transport Allowance'],
    workingHours: 'Monday – Friday: 8:00 AM – 5:00 PM',
    positionsCount: 3,
    deadline: '2026-08-25',
    expectedStartDate: '2026-09-15',
    status: 'Published',
    isFeatured: true,
    isUrgent: true,
    seoTitle: 'Senior Credit Officer Vacancy in Nyeri | Neema HEEP Careers',
    metaDescription: 'Apply now for Senior Micro-Finance Credit Officer role at Neema HEEP Nyeri Branch.',
    slug: 'senior-micro-finance-credit-officer',
    viewsCount: 342,
    applicationsCount: 18,
    createdAt: '2026-07-10',
    updatedAt: '2026-07-28'
  },
  {
    id: 'vac-2',
    title: 'Field Credit Agent - Chama Specialist',
    refNumber: 'NH-VAC-2026-002',
    department: 'Field Operations',
    category: 'Field Operations',
    employmentType: 'Full-Time',
    location: "Murang'a Branch",
    workArrangement: 'On-site',
    summary: 'Manage women and youth Chama loan groups, conducting financial literacy workshops and field appraisals.',
    responsibilities: [
      'Mobilize community Chama groups and register new members into Neema HEEP financial literacy programs.',
      'Conduct weekly group meeting appraisals and verify member loan repayment capacity.',
      'Train group officials on digital ledger tools and M-PESA repayment channels.'
    ],
    minQualifications: [
      'Diploma or Degree in Community Development, Social Work, or Business Studies.'
    ],
    requiredExperience: 'Minimum 2 years field engagement experience with micro-groups in Kenya.',
    requiredSkills: ['Community Mobilization', 'Group Dynamics', 'Customer Relationship Management'],
    preferredSkills: ['Local Language Proficiency (Kikuyu)', 'Basic Accounting'],
    benefits: ['Attractive Base Salary + Commission', 'Field Allowance', 'Health Insurance'],
    workingHours: 'Monday – Friday: 8:00 AM – 5:00 PM',
    positionsCount: 5,
    deadline: '2026-08-30',
    expectedStartDate: '2026-09-20',
    status: 'Published',
    isFeatured: true,
    isUrgent: false,
    seoTitle: 'Field Credit Agent Vacancy in Murang’a | Neema HEEP',
    metaDescription: 'Field credit agent position focusing on Chama micro-loans in Murang’a County.',
    slug: 'field-credit-agent-chama-specialist',
    viewsCount: 289,
    applicationsCount: 24,
    createdAt: '2026-07-15',
    updatedAt: '2026-07-29'
  },
  {
    id: 'vac-3',
    title: 'IT Systems & M-PESA Integration Specialist',
    refNumber: 'NH-VAC-2026-003',
    department: 'Technology',
    category: 'Technology & Systems',
    employmentType: 'Full-Time',
    location: 'Embu HQ',
    workArrangement: 'Hybrid',
    summary: 'Maintain Core Banking integrations, M-PESA B2C/C2B automated disbursement systems, and data reporting.',
    responsibilities: [
      'Maintain uptime for M-PESA Daraja API integrations (C2B, B2C, Express STK Push).',
      'Manage Core Banking System (CBS) database backups, user access control, and API gateway security.',
      'Develop custom reporting queries for credit analytics and financial compliance.'
    ],
    minQualifications: [
      'Bachelor’s Degree in Computer Science, Software Engineering, or Information Technology.'
    ],
    requiredExperience: '3+ years experience with fintech systems, REST APIs, and database administration.',
    requiredSkills: ['TypeScript / Node.js', 'PostgreSQL / Firestore', 'M-PESA API Integration', 'Linux Administration'],
    preferredSkills: ['Cloud Run / GCP', 'Docker', 'Cybersecurity Certification'],
    benefits: ['Competitive Tech Package', 'Flexible Hybrid Schedule', 'Professional Certifications Support'],
    workingHours: 'Monday – Friday: 8:30 AM – 5:00 PM',
    positionsCount: 1,
    deadline: '2026-09-05',
    expectedStartDate: '2026-10-01',
    status: 'Published',
    isFeatured: false,
    isUrgent: true,
    seoTitle: 'IT Systems Specialist Job in Embu | Neema HEEP Fintech',
    metaDescription: 'Lead M-PESA and core banking technology systems at Neema HEEP HQ.',
    slug: 'it-systems-mpesa-integration-specialist',
    viewsCount: 412,
    applicationsCount: 12,
    createdAt: '2026-07-20',
    updatedAt: '2026-07-30'
  },
  {
    id: 'vac-4',
    title: 'Internal Audit & Compliance Associate',
    refNumber: 'NH-VAC-2026-004',
    department: 'Finance & Legal',
    category: 'Finance & Accounting',
    employmentType: 'Full-Time',
    location: 'Nairobi Liaison Office',
    workArrangement: 'On-site',
    summary: 'Ensure compliance with Central Bank of Kenya MFI guidelines, Data Protection Act 2019, and internal control frameworks.',
    responsibilities: [
      'Perform periodic branch audits and loan file sampling across regional offices.',
      'Audit Data Protection compliance and user data privacy practices.',
      'Prepare quarterly audit reports for the Board Audit Committee.'
    ],
    minQualifications: ['Degree in Finance or Accounting', 'CPA-K or CIA Qualification'],
    requiredExperience: '3 years internal audit experience in financial institutions.',
    requiredSkills: ['CBK Regulations', 'Audit Sampling', 'Risk Assessment', 'Report Writing'],
    preferredSkills: ['Data Protection Certification'],
    benefits: ['Competitive Compensation', 'Medical & Pension', 'Career Development'],
    workingHours: 'Monday – Friday: 8:00 AM – 5:00 PM',
    positionsCount: 2,
    deadline: '2026-09-10',
    expectedStartDate: '2026-10-05',
    status: 'Published',
    isFeatured: false,
    isUrgent: false,
    seoTitle: 'Internal Audit Associate Job | Neema HEEP Nairobi',
    metaDescription: 'Join Neema HEEP Audit and Compliance team in Nairobi.',
    slug: 'internal-audit-compliance-associate',
    viewsCount: 195,
    applicationsCount: 9,
    createdAt: '2026-07-22',
    updatedAt: '2026-07-30'
  }
];

const INITIAL_CATEGORIES: VacancyCategory[] = [
  { id: 'cat-1', name: 'Credit & Risk', code: 'CRD', description: 'Underwriting, portfolio risk management, and credit appraisals.', vacanciesCount: 1 },
  { id: 'cat-2', name: 'Field Operations', code: 'FLD', description: 'Community mobilization, Chama group lending, and field collections.', vacanciesCount: 1 },
  { id: 'cat-3', name: 'Technology & Systems', code: 'TECH', description: 'Core banking systems, M-PESA APIs, database and cloud infrastructure.', vacanciesCount: 1 },
  { id: 'cat-4', name: 'Finance & Accounting', code: 'FIN', description: 'Financial management, internal audit, tax compliance, and reporting.', vacanciesCount: 1 },
  { id: 'cat-5', name: 'HR & Administration', code: 'HRA', description: 'Talent acquisition, staff welfare, corporate governance, and facilities.', vacanciesCount: 0 },
];

const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Credit Operations', code: 'CO', head: 'David K. Maina', vacanciesCount: 1 },
  { id: 'dept-2', name: 'Field Operations', code: 'FO', head: 'Mary W. Njuguna', vacanciesCount: 1 },
  { id: 'dept-3', name: 'Technology', code: 'IT', head: 'Eng. Patrick Munene', vacanciesCount: 1 },
  { id: 'dept-4', name: 'Finance & Legal', code: 'FL', head: 'Sarah C. Korir', vacanciesCount: 1 },
  { id: 'dept-5', name: 'Human Resources', code: 'HR', head: 'Eunice K. Mutua', vacanciesCount: 0 },
];

const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-101',
    appNumber: 'NH-APP-2026-8942',
    vacancyId: 'vac-1',
    vacancyTitle: 'Senior Micro-Finance Credit Officer',
    vacancyRef: 'NH-VAC-2026-001',
    department: 'Credit Operations',
    status: 'Under Review',
    submissionDate: '2026-07-28',
    submissionTimestamp: '2026-07-28T10:14:22Z',
    verificationStatus: 'Verified',
    identity: {
      surname: 'Mwangi',
      firstName: 'James',
      middleName: 'Kariuki',
      nationalId: '32145879',
      nationalIdDocName: 'ID_Copy_James_Mwangi.pdf',
      kraPin: 'A012345678B',
      kraPinCertName: 'KRA_PIN_Certificate_Mwangi.pdf',
      phone: '+254712345678',
      email: 'james.mwangi@example.com',
      county: 'Nyeri'
    },
    education: [
      { id: 'edu-1', level: 'Degree', institution: 'Kenyatta University', startYear: '2016', endYear: '2020', docName: 'BCom_Degree_KU.pdf' },
      { id: 'edu-2', level: 'Diploma', institution: 'Kenya Institute of Management', startYear: '2014', endYear: '2016', docName: 'Diploma_Microfinance.pdf' }
    ],
    employment: [
      { id: 'emp-1', company: 'Faulu Microfinance Bank', jobTitle: 'Credit Officer', startDate: '2021-02', endDate: '2026-06', isCurrent: false, responsibilities: 'Managed group loans and individual business appraisals across Nyeri sub-counties.' }
    ],
    memberships: [
      { id: 'mem-1', bodyName: 'KIM (Kenya Institute of Management)', regNumber: 'KIM-MEM-8842', certName: 'KIM_Certificate.pdf' }
    ],
    references: [
      { id: 'ref-1', fullName: 'Peter Nderitu', titleRelationship: 'Branch Manager / Supervisor', company: 'Faulu Microfinance Bank', yearsKnown: '4 Years', phone: '+254722111222', email: 'p.nderitu@faulu.co.ke' },
      { id: 'ref-2', fullName: 'Dr. Agnes Wambui', titleRelationship: 'Senior Lecturer', company: 'Kenyatta University', yearsKnown: '6 Years', phone: '+254733222333', email: 'a.wambui@ku.ac.ke' },
      { id: 'ref-3', fullName: 'Francis Kimani', titleRelationship: 'Chama Group Chairman', company: 'Nyeri Farmers Co-op', yearsKnown: '5 Years', phone: '+254711333444', email: 'f.kimani@nyerifarmers.co.ke' },
      { id: 'ref-4', fullName: 'Lucy Wanjiku', titleRelationship: 'Senior Accountant', company: 'Mount Kenya Credit Union', yearsKnown: '3 Years', phone: '+254700444555', email: 'l.wanjiku@mtkenya.co.ke' }
    ],
    cv: { fileName: 'CV_James_Mwangi_Credit_Officer.pdf', fileSize: '1.4 MB' },
    declaration: { certifiedTrue: true, dataConsent: true },
    adminNotes: 'Strong candidate with 5 years Faulu MFI experience in Nyeri region.'
  },
  {
    id: 'app-102',
    appNumber: 'NH-APP-2026-8943',
    vacancyId: 'vac-2',
    vacancyTitle: 'Field Credit Agent - Chama Specialist',
    vacancyRef: 'NH-VAC-2026-002',
    department: 'Field Operations',
    status: 'Shortlisted',
    submissionDate: '2026-07-29',
    submissionTimestamp: '2026-07-29T14:30:10Z',
    verificationStatus: 'Verified',
    identity: {
      surname: 'Wambui',
      firstName: 'Grace',
      middleName: 'Nyambura',
      nationalId: '34892104',
      nationalIdDocName: 'National_ID_Grace_Wambui.pdf',
      kraPin: 'A098765432Z',
      kraPinCertName: 'KRA_PIN_Grace_Wambui.pdf',
      phone: '+254723456789',
      email: 'grace.wambui@example.com',
      county: "Murang'a"
    },
    education: [
      { id: 'edu-3', level: 'Diploma', institution: 'Murang’a University of Technology', startYear: '2019', endYear: '2022', docName: 'Diploma_Community_Dev.pdf' }
    ],
    employment: [
      { id: 'emp-2', company: 'KWFT Microfinance', jobTitle: 'Assistant Field Officer', startDate: '2022-08', endDate: 'Present', isCurrent: true, responsibilities: 'Mobilized 30+ Chama groups and achieved 98% repayment rate.' }
    ],
    memberships: [],
    references: [
      { id: 'ref-5', fullName: 'Samuel Kamau', titleRelationship: 'Area Manager', company: 'KWFT Microfinance', yearsKnown: '3 Years', phone: '+254722555666', email: 'skamau@kwft.co.ke' },
      { id: 'ref-6', fullName: 'Eunice Mutua', titleRelationship: 'Community Coordinator', company: "Murang'a Women Trust", yearsKnown: '4 Years', phone: '+254712666777', email: 'eunice@muranagawomen.org' },
      { id: 'ref-7', fullName: 'David Macharia', titleRelationship: 'Church Secretary', company: 'ACK Muranga Diocese', yearsKnown: '8 Years', phone: '+254733777888', email: 'dmacharia@ack.or.ke' },
      { id: 'ref-8', fullName: 'Beatrice Njeri', titleRelationship: 'Chama Chairlady', company: 'Koinange Women Group', yearsKnown: '2 Years', phone: '+254700888999', email: 'b.njeri@koinangewomen.co.ke' }
    ],
    cv: { fileName: 'CV_Grace_Wambui_Field_Agent.pdf', fileSize: '1.1 MB' },
    declaration: { certifiedTrue: true, dataConsent: true },
    adminNotes: 'Excellent field Chama experience in Muranga.'
  }
];

export function useJobs() {
  const [vacancies, setVacancies] = useState<Vacancy[]>(() => {
    const saved = localStorage.getItem('neema_vacancies_data');
    let loaded: Vacancy[] = INITIAL_VACANCIES;
    if (saved) {
      try { loaded = JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Auto archive expired vacancies on initial load
    const todayStr = new Date().toISOString().split('T')[0];
    return loaded.map(v => {
      if (v.deadline && v.deadline < todayStr && v.status === 'Published') {
        return { ...v, status: 'Archived' as const };
      }
      return v;
    });
  });

  const [categories, setCategories] = useState<VacancyCategory[]>(() => {
    const saved = localStorage.getItem('neema_vacancy_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CATEGORIES;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('neema_vacancy_departments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_DEPARTMENTS;
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('neema_job_applications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_APPLICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('neema_vacancies_data', JSON.stringify(vacancies));
  }, [vacancies]);

  useEffect(() => {
    localStorage.setItem('neema_vacancy_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('neema_vacancy_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('neema_job_applications', JSON.stringify(applications));
  }, [applications]);

  // Listen to cross-tab storage changes and window custom events
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('neema_vacancies_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const todayStr = new Date().toISOString().split('T')[0];
          const autoArchived = parsed.map((v: Vacancy) => {
            if (v.deadline && v.deadline < todayStr && v.status === 'Published') {
              return { ...v, status: 'Archived' as const };
            }
            return v;
          });
          setVacancies(autoArchived);
        } catch (e) {
          console.error(e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('neema_vacancies_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('neema_vacancies_updated', handleStorageChange);
    };
  }, []);

  const notifyVacanciesUpdated = () => {
    window.dispatchEvent(new Event('neema_vacancies_updated'));
  };

  // Actions
  const addVacancy = (newVac: Omit<Vacancy, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'applicationsCount'>) => {
    const created: Vacancy = {
      ...newVac,
      id: `vac-${Date.now()}`,
      viewsCount: 0,
      applicationsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setVacancies(prev => [created, ...prev]);
    setTimeout(notifyVacanciesUpdated, 50);
    return created;
  };

  const updateVacancy = (id: string, updates: Partial<Vacancy>) => {
    setVacancies(prev => prev.map(v => v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : v));
    setTimeout(notifyVacanciesUpdated, 50);
  };

  const deleteVacancy = (id: string) => {
    setVacancies(prev => prev.filter(v => v.id !== id));
    setTimeout(notifyVacanciesUpdated, 50);
  };

  const submitJobApplication = (appData: Omit<JobApplication, 'id' | 'appNumber' | 'submissionDate' | 'submissionTimestamp' | 'verificationStatus'>) => {
    const appNum = `NH-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: JobApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      appNumber: appNum,
      submissionDate: new Date().toISOString().split('T')[0],
      submissionTimestamp: new Date().toISOString(),
      verificationStatus: 'Verified'
    };
    setApplications(prev => [newApp, ...prev]);

    // Update vacancy applicationsCount
    setVacancies(prev => prev.map(v => v.id === appData.vacancyId ? { ...v, applicationsCount: v.applicationsCount + 1 } : v));

    return newApp;
  };

  const updateApplicationStatus = (appId: string, status: JobApplication['status'], notes?: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status, adminNotes: notes !== undefined ? notes : a.adminNotes } : a));
  };

  return {
    jobs: vacancies, // backward compatible
    vacancies,
    categories,
    departments,
    applications,
    addVacancy,
    updateVacancy,
    deleteVacancy,
    setCategories,
    setDepartments,
    submitJobApplication,
    updateApplicationStatus
  };
}
