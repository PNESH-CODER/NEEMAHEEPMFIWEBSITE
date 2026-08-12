import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  limit,
  serverTimestamp,
  Timestamp,
  db
} from '../lib/firebase';

export type LeadType = 'Registration' | 'Pre-Qualification' | 'Contact' | 'Resource' | 'Career' | 'Partnership' | 'Callback' | 'Volunteer' | 'Member Activation' | 'Sponsorship';

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone?: string;
  details?: any;
  status: 'New' | 'Followed-up' | 'Qualified' | 'Closed';
  timestamp: number;
  consentGiven?: string | boolean;
  signupSource?: string;
}

class LeadService {
  private static instance: LeadService;
  private leads: Lead[] = [];
  private listeners: ((leads: Lead[]) => void)[] = [];

  private constructor() {
    // Sync is now triggered explicitly to avoid permission errors for non-admins
  }

  public static getInstance(): LeadService {
    if (!LeadService.instance) {
      LeadService.instance = new LeadService();
    }
    return LeadService.instance;
  }

  private unsubscribe: (() => void) | null = null;

  public startSync() {
    if (this.unsubscribe) return;

    // Combine all relevant lead-like collections into one view for the admin dashboard
    const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'), limit(100));
    this.unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreLeads: Lead[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toMillis() || Date.now()
      } as Lead));
      
      this.leads = firestoreLeads;
      this.notify();
    }, (error) => {
      console.error("Lead Sync Error:", error);
      // We don't throw here to avoid crashing the whole app, 
      // but the permission error will be logged.
    });
  }

  public stopSync() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  public async syncPartialLead(partialData: { name?: string; email: string; phone?: string; type: string; step?: number }) {
    try {
      console.log('[Real-time API Sync - Partial Contact Step 1]', partialData);
      await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...partialData,
          name: partialData.name || 'Incomplete Lead',
          signupSource: (typeof window !== 'undefined' ? window.location.href : '') + ' (Partial Step 1 Sync)',
          details: { partialSync: true, stepCompleted: partialData.step || 1 }
        })
      });
    } catch (err) {
      console.warn('Partial Lead Sync Warning:', err);
    }
  }

  public async submitLead(leadData: Omit<Lead, 'id' | 'status' | 'timestamp'>) {
    try {
      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      
      const result = await response.json();

      // We still update local firestore for those specific collections for now
      // but the centralized 'leads' collection is handled by the server endpoint
      const typeMap: Record<string, string> = {
        'Career': 'career_applications',
        'Contact': 'contact_messages',
        'Volunteer': 'volunteer_applications',
        'Partnership': 'partnership_applications',
        'Callback': 'callback_requests'
      };

      const targetCollection = typeMap[leadData.type] || 'leads';
      
      const docRef = await addDoc(collection(db, targetCollection), {
        ...leadData,
        status: 'New',
        timestamp: serverTimestamp(),
        audit: result.audit
      });

      return { id: docRef.id, ...leadData };
    } catch (error) {
      console.error("Error submitting lead: ", error);
      return { id: 'temp-' + Date.now(), ...leadData };
    }
  }

  public getLeads() {
    return this.leads;
  }

  public async updateLeadStatus(id: string, status: Lead['status']) {
    try {
      const leadRef = doc(db, 'leads', id);
      await updateDoc(leadRef, { status });
    } catch (error) {
      console.error("Error updating lead status: ", error);
    }
  }

  public subscribe(callback: (leads: Lead[]) => void) {
    this.listeners.push(callback);
    callback(this.leads);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.leads));
  }
}

export const leadService = LeadService.getInstance();
