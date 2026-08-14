import { supabase } from '../lib/supabase';
import { beneficiariesStore, AnnualBeneficiaryList, BeneficiaryRecord } from '../lib/beneficiariesStore';

export const beneficiaryService = {
  /**
   * Fetch published beneficiary lists from Supabase or fallback to local store
   */
  async getPublishedBeneficiaries(): Promise<{ year: string; title: string; students: { id: string; name: string; school: string }[] }[]> {
    try {
      const { data, error } = await supabase
        .from('beneficiaries')
        .select('*')
        .eq('status', 'Active')
        .order('serial_number', { ascending: true });

      if (error || !data || data.length === 0) {
        return beneficiariesStore.getPublishedLists();
      }

      // Group by year
      const grouped: { [year: string]: { id: string; name: string; school: string }[] } = {};
      data.forEach(item => {
        const yr = item.year || '2026';
        if (!grouped[yr]) grouped[yr] = [];
        grouped[yr].push({
          id: String(item.serial_number || 1).padStart(3, '0'),
          name: item.masked_name || item.full_name || '',
          school: item.school || ''
        });
      });

      const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
      return years.map(yr => ({
        year: yr,
        title: `Arise & Shine Beneficiaries - ${yr} Cohort`,
        students: grouped[yr]
      }));
    } catch {
      return beneficiariesStore.getPublishedLists();
    }
  },

  /**
   * Sync local beneficiary records to Supabase if accessible
   */
  async syncBeneficiaryToSupabase(record: BeneficiaryRecord): Promise<void> {
    try {
      const payload = {
        list_id: record.listId,
        serial_number: record.serialNumber,
        full_name: record.fullName,
        masked_name: record.maskedName,
        school: record.school,
        year: record.year,
        status: record.status
      };

      const { error } = await supabase
        .from('beneficiaries')
        .upsert([payload]);

      if (error) {
        console.warn('[beneficiaryService] Supabase sync notice:', error.message);
      }
    } catch (err) {
      console.warn('[beneficiaryService] Supabase sync exception:', err);
    }
  }
};
