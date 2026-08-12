export interface ExtendedUserProfile {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName: string;
  username: string;
  email: string;
  phone: string;
  whatsApp?: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  dateOfBirth?: string;
  jobTitle: string;
  department: string;
  employeeId: string;
  departmentExtension: string;
  canCreateArticles: boolean;
  physicalAddress?: string;
  role: 'Super Admin' | 'Site Administrator' | 'Editor' | 'Author' | 'Loan Officer' | 'Webmaster' | 'Auditor' | string;
  status: 'Active' | 'Inactive' | 'Suspended';
  verificationStatus: 'Verified' | 'Pending' | 'Unverified' | 'Rejected';
  profilePhoto: string;
  coverPhoto: string;
  bio: string;
  shortBio: string;
  levelOfEducation: string;
  yearsOfExperience: string;
  workExperience: string[];
  preferredLanguage: string;
  timezone: string;
  expertise: string[];
  certifications: string[];
  education: string[];
  memberships: string[];
  publicHeadline?: string;
  publicBio?: string;
  publicPagePublished?: boolean;
  showPublicContact?: boolean;
  // Super Admin Management Metadata
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  stats: {
    articlesPublished: number;
    draftArticles: number;
    mediaUploaded: number;
    commentsModerated: number;
    communityImpactScore: number;
    readingCount: number;
    guidedLoansCount: number;
    lastLogin: string;
    memberSince: string;
  };
  achievements: string[];
}

const STORAGE_KEY = 'neema_user_profiles_v1';
const EVENT_NAME = 'neema_profiles_updated';

// Initial default profile seed
export const INITIAL_PROFILES_SEED: ExtendedUserProfile[] = [
  {
    id: 'usr-1',
    firstName: 'Patrick',
    middleName: 'Munene',
    lastName: 'Kinyua',
    displayName: 'Patrick Munene',
    username: 'pmunene',
    email: 'ptrckmunene@gmail.com',
    phone: '+254 712 345 678',
    whatsApp: '+254 712 345 678',
    gender: 'Male',
    dateOfBirth: '1992-05-14',
    jobTitle: 'Managing Director & Founder',
    department: 'Executive Leadership',
    employeeId: 'NH-EMP-2022-001',
    departmentExtension: 'Ext. 101 (Executive)',
    canCreateArticles: true,
    physicalAddress: 'Neema Heep Plaza, Kimathi Way, Nyeri',
    role: 'Super Admin',
    status: 'Active',
    verificationStatus: 'Verified',
    profilePhoto: '/developer_teaching_coding.jpg',
    coverPhoto: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    bio: 'Passionate about micro-financing innovation, financial inclusion, and community economic empowerment across Mt. Kenya region.',
    shortBio: 'Founder & CEO at Neema HEEP Microfinance.',
    levelOfEducation: 'Master of Science in Finance (M.Sc. Finance)',
    yearsOfExperience: '14+ Years Experience in Microfinance & SME Credit',
    workExperience: [
      'Managing Director & Founder - Neema HEEP Microfinance (2022-Present)',
      'Senior Microfinance & Risk Specialist - Equity Bank Kenya (2016-2022)',
      'SME Credit Analyst - KCB Bank Group (2012-2016)'
    ],
    publicHeadline: 'Managing Director & Microfinance Innovator',
    publicBio: 'Leading micro-lending transformations and agricultural credit accessibility across Mount Kenya. Dedicated to empowering SMEs, female entrepreneurs, and smallholder farming groups.',
    publicPagePublished: true,
    showPublicContact: true,
    preferredLanguage: 'English (UK)',
    timezone: 'Africa/Nairobi (UTC+3)',
    expertise: ['Mt. Kenya Microfinance', 'WASH Sanitation Loans', 'Imara Business Credit', 'Community Healthcare Pairing', 'SME Financial Advisory'],
    certifications: ['Chartered Microfinance Executive (CME)', 'Certified Agribusiness Consultant'],
    education: ['B.Sc. Financial Engineering - Strathmore University', 'M.Sc. Finance - University of Nairobi'],
    memberships: ['Kenya Association of Microfinance Institutions (AMFI)', 'Association of Agribusiness Professionals'],
    createdAt: '2022-01-15 08:30 AM',
    createdBy: 'System Initialization (Super Admin)',
    stats: {
      articlesPublished: 24,
      draftArticles: 3,
      mediaUploaded: 86,
      commentsModerated: 142,
      communityImpactScore: 98,
      readingCount: 48920,
      guidedLoansCount: 1240,
      lastLogin: '2026-08-04 08:30 AM',
      memberSince: 'January 2022'
    },
    achievements: ['First Article', '100 Articles', 'Impact Champion', 'Verified Author', 'Featured Writer', 'Top Editor']
  },
  {
    id: 'usr-2',
    firstName: 'Jane',
    middleName: 'Wanjiku',
    lastName: 'Muturi',
    displayName: 'Dr. Jane Muturi',
    username: 'jmuturi',
    email: 'jane@neemaheep.co.ke',
    phone: '+254 722 987 654',
    whatsApp: '+254 722 987 654',
    gender: 'Female',
    dateOfBirth: '1988-11-20',
    jobTitle: 'Head of Community Health & Welfare',
    department: 'Social Impact & Healthcare',
    employeeId: 'NH-EMP-2023-014',
    departmentExtension: 'Ext. 204 (Community Health)',
    canCreateArticles: true,
    physicalAddress: 'Neema Heep Hub, Nanyuki Town',
    role: 'Editor',
    status: 'Active',
    verificationStatus: 'Verified',
    profilePhoto: '/Grace Wanjiku.jpeg',
    coverPhoto: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    bio: 'Medical doctor dedicated to pairing preventive healthcare initiatives with micro-loans for rural women entrepreneurs.',
    shortBio: 'Community Health Lead & Preventive Medicine Specialist.',
    levelOfEducation: 'Bachelor of Medicine & Surgery (MBChB), Master of Public Health (MPH)',
    yearsOfExperience: '10+ Years in Community Health & Rural Health Finance',
    workExperience: [
      'Head of Community Health & Welfare - Neema HEEP (2023-Present)',
      'Medical Officer & Public Health Coordinator - Nyeri County Referral Hospital (2018-2023)'
    ],
    publicHeadline: 'Head of Community Health & Preventive Care',
    publicBio: 'Promoting healthcare accessibility and health finance solutions for rural farming families in Laikipia and Nyeri counties.',
    publicPagePublished: true,
    showPublicContact: true,
    preferredLanguage: 'English (UK)',
    timezone: 'Africa/Nairobi (UTC+3)',
    expertise: ['Community Healthcare Pairing', 'WASH Sanitation Loans', 'Preventive Health Advisory'],
    certifications: ['Medical Practitioner License (KMPDC)', 'Public Health Leadership'],
    education: ['MBChB Medicine - University of Nairobi', 'MPH Public Health - Moi University'],
    memberships: ['Kenya Medical Association (KMA)', 'Global Rural Health Council'],
    createdAt: '2023-06-10 10:15 AM',
    createdBy: 'Patrick Munene (Super Admin)',
    stats: {
      articlesPublished: 14,
      draftArticles: 1,
      mediaUploaded: 42,
      commentsModerated: 89,
      communityImpactScore: 94,
      readingCount: 22100,
      guidedLoansCount: 680,
      lastLogin: '2026-08-03 11:00 AM',
      memberSince: 'June 2023'
    },
    achievements: ['First Article', 'Verified Author', 'Top Editor']
  }
];

class ProfilesStore {
  private profiles: ExtendedUserProfile[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.profiles = JSON.parse(stored);
      } else {
        this.profiles = [...INITIAL_PROFILES_SEED];
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('Error reading profiles from storage:', e);
      this.profiles = [...INITIAL_PROFILES_SEED];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profiles));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: this.profiles }));
    } catch (e) {
      console.warn('Error saving profiles to storage:', e);
    }
  }

  public getProfiles(): ExtendedUserProfile[] {
    return this.profiles.filter(p => p.status !== 'Archived' as any);
  }

  public getAllProfilesIncludingArchived(): ExtendedUserProfile[] {
    return [...this.profiles];
  }

  public getProfileById(id: string): ExtendedUserProfile | undefined {
    return this.profiles.find(p => p.id === id);
  }

  public createProfile(data: Partial<ExtendedUserProfile>, creatorName: string = 'Super Admin'): ExtendedUserProfile {
    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newId = `usr-${Date.now()}`;
    const fn = data.firstName?.trim() || 'New';
    const mn = data.middleName?.trim() ? ` ${data.middleName.trim()}` : '';
    const ln = data.lastName?.trim() || 'User';
    const fullName = `${fn}${mn} ${ln}`;
    const displayName = data.displayName?.trim() || fullName;
    const username = data.username?.trim().toLowerCase() || `usr_${Math.random().toString(36).substring(2, 7)}`;

    const newProfile: ExtendedUserProfile = {
      id: newId,
      firstName: fn,
      middleName: data.middleName?.trim() || '',
      lastName: ln,
      displayName: displayName,
      username: username,
      email: data.email?.trim() || `${username}@neemaheep.org`,
      phone: data.phone?.trim() || '+254 700 000 000',
      whatsApp: data.whatsApp?.trim() || data.phone?.trim() || '+254 700 000 000',
      gender: data.gender || 'Prefer not to say',
      dateOfBirth: data.dateOfBirth || '',
      jobTitle: data.jobTitle?.trim() || 'Staff Officer',
      department: data.department?.trim() || 'Operations',
      employeeId: data.employeeId?.trim() || `NH-EMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      departmentExtension: data.departmentExtension?.trim() || 'Ext. 300',
      canCreateArticles: data.canCreateArticles ?? true,
      physicalAddress: data.physicalAddress?.trim() || 'Neema HEEP HQ, Nyeri',
      role: data.role || 'Author',
      status: data.status || 'Active',
      verificationStatus: data.verificationStatus || 'Verified',
      profilePhoto: data.profilePhoto || '/developer_teaching_coding.jpg',
      coverPhoto: data.coverPhoto || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      bio: data.bio?.trim() || 'Neema HEEP enterprise team member.',
      shortBio: data.shortBio?.trim() || `${data.jobTitle || 'Staff Member'} at Neema HEEP.`,
      levelOfEducation: data.levelOfEducation?.trim() || 'Bachelor Degree',
      yearsOfExperience: data.yearsOfExperience?.trim() || '3+ Years Experience',
      workExperience: data.workExperience && data.workExperience.length > 0 ? data.workExperience : [`${data.jobTitle || 'Staff Member'} - Neema HEEP (2026-Present)`],
      preferredLanguage: data.preferredLanguage || 'English (UK)',
      timezone: data.timezone || 'Africa/Nairobi (UTC+3)',
      expertise: data.expertise || ['Microfinance', 'Community Relations'],
      certifications: data.certifications || ['Neema HEEP Certified Staff'],
      education: data.education || ['B.Sc. Business Administration'],
      memberships: data.memberships || ['Neema HEEP Staff Association'],
      publicHeadline: data.publicHeadline || data.jobTitle || 'Neema HEEP Officer',
      publicBio: data.publicBio || data.bio || 'Neema HEEP enterprise staff profile.',
      publicPagePublished: data.publicPagePublished ?? true,
      showPublicContact: data.showPublicContact ?? true,
      createdAt: formattedTimestamp,
      createdBy: creatorName,
      updatedAt: formattedTimestamp,
      updatedBy: creatorName,
      stats: data.stats || {
        articlesPublished: 0,
        draftArticles: 0,
        mediaUploaded: 0,
        commentsModerated: 0,
        communityImpactScore: 50,
        readingCount: 0,
        guidedLoansCount: 0,
        lastLogin: 'Never',
        memberSince: now.toLocaleString('en-US', { month: 'long', year: 'numeric' })
      },
      achievements: data.achievements || ['New Profile Created']
    };

    this.profiles = [newProfile, ...this.profiles];
    this.saveToStorage();
    return newProfile;
  }

  public updateProfile(id: string, updates: Partial<ExtendedUserProfile>, updaterName: string = 'Super Admin'): ExtendedUserProfile | null {
    const idx = this.profiles.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const current = this.profiles[idx];
    const updated: ExtendedUserProfile = {
      ...current,
      ...updates,
      updatedAt: formattedTimestamp,
      updatedBy: updaterName
    };

    // Re-calculate full name if names were changed
    if (updates.firstName || updates.lastName || updates.middleName) {
      const fn = updated.firstName.trim();
      const mn = updated.middleName?.trim() ? ` ${updated.middleName.trim()}` : '';
      const ln = updated.lastName.trim();
      updated.displayName = updates.displayName || `${fn}${mn} ${ln}`;
    }

    this.profiles[idx] = updated;
    this.saveToStorage();
    return updated;
  }

  public deleteProfile(id: string): boolean {
    const initialLen = this.profiles.length;
    this.profiles = this.profiles.filter(p => p.id !== id);
    if (this.profiles.length < initialLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public deleteOrArchiveProfile(id: string, operatorName: string = 'Super Admin'): { action: 'deleted' | 'archived', profile: ExtendedUserProfile | null } {
    const profile = this.profiles.find(p => p.id === id);
    if (!profile) return { action: 'deleted', profile: null };

    const articlesPublished = profile.stats?.articlesPublished || 0;
    if (articlesPublished > 0) {
      const archived = this.updateProfile(id, {
        status: 'Archived' as any,
        canCreateArticles: false,
        publicPagePublished: false,
        shortBio: `[Archived Author] Content preserved (${articlesPublished} articles published).`
      }, operatorName);
      return { action: 'archived', profile: archived };
    } else {
      this.deleteProfile(id);
      return { action: 'deleted', profile };
    }
  }

  public subscribe(callback: (profiles: ExtendedUserProfile[]) => void): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<ExtendedUserProfile[]>;
      callback(customEvent.detail || this.getProfiles());
    };

    window.addEventListener(EVENT_NAME, handler);
    // Initial call
    callback(this.getProfiles());

    return () => {
      window.removeEventListener(EVENT_NAME, handler);
    };
  }
}

export const profilesStore = new ProfilesStore();
