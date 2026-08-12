import { supabase } from '../lib/supabase';
import { Job } from '../hooks/useJobs';

export const jobService = {
  async getJobs(): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data.map(item => ({
        id: item.id,
        title: item.title,
        department: item.department,
        type: item.type,
        location: item.location,
        description: item.description,
        requirements: item.requirements || [],
        responsibilities: item.responsibilities || [],
        deadline: item.deadline,
        status: item.status || 'Active'
      })) as unknown as Job[];
    } catch {
      return [];
    }
  },

  async addJob(job: Omit<Job, 'id'>): Promise<string> {
    const { data, error } = await supabase
      .from('jobs')
      .insert([job])
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  },

  async removeJob(id: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
