import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy, db } from '../lib/firebase';
import { Job } from '../hooks/useJobs';

const JOBS_COLLECTION = 'jobs';

export const jobService = {
  async getJobs(): Promise<Job[]> {
    const q = query(collection(db, JOBS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Job[];
  },

  async addJob(job: Omit<Job, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
      ...job,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async removeJob(id: string): Promise<void> {
    await deleteDoc(doc(db, JOBS_COLLECTION, id));
  }
};
