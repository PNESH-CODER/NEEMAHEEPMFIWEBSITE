export interface BeneficiaryRecord {
  id: string;
  listId: string;
  serialNumber: number; // 1, 2, 3...
  fullName: string;
  maskedName: string;
  school: string;
  year: string;
  dateAdded: string;
  status: 'Active' | 'Draft';
}

export interface AnnualBeneficiaryList {
  id: string;
  year: string;
  title: string;
  description?: string;
  status: 'Draft' | 'Published' | 'Archived';
  yearIdentifier: string; // e.g., NH-BEN-2026
  dateCreated: string;
  createdBy: string;
  lastModified: string;
  supersededBy?: string | null;
  recordsCount?: number;
}

export interface BeneficiaryAuditLog {
  id: string;
  action: 'List Created' | 'List Updated' | 'Beneficiary Added' | 'Beneficiary Edited' | 'Beneficiary Deleted' | 'List Published' | 'List Archived' | 'Import Completed' | 'Export Completed';
  details: string;
  performedBy: string;
  timestamp: string;
}

export interface BeneficiaryNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
}

// Automatic formatting: Mask 2nd and 3rd names before publishing (Supabase DB Rule Enforcement)
export function maskBeneficiaryName(fullName: string): string {
  if (!fullName) return '';
  const clean = fullName.trim();
  const parts = clean.split(/\s+/);
  
  if (parts.length <= 1) {
    // e.g. "MARY" -> "M*****"
    return parts[0].charAt(0) + '*****';
  }
  
  // 1st name stays plain text; 2nd, 3rd, and all subsequent names are masked (e.g. "JOHN MUGENDI KARIUKI" -> "JOHN M***** K*****")
  const first = parts[0];
  const maskedSubsequent = parts.slice(1).map(p => p.charAt(0) + '*****').join(' ');
  return `${first} ${maskedSubsequent}`;
}

// Initial Data Seed
const INITIAL_LISTS: AnnualBeneficiaryList[] = [];

const INITIAL_RECORDS: BeneficiaryRecord[] = [];

const INITIAL_LOGS: BeneficiaryAuditLog[] = [];

const INITIAL_NOTIFICATIONS: BeneficiaryNotification[] = [];

class BeneficiariesStore {
  private lists: AnnualBeneficiaryList[] = INITIAL_LISTS;
  private records: BeneficiaryRecord[] = INITIAL_RECORDS;
  private logs: BeneficiaryAuditLog[] = INITIAL_LOGS;
  private notifications: BeneficiaryNotification[] = INITIAL_NOTIFICATIONS;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const storedL = localStorage.getItem('neema_beneficiary_lists');
        const storedR = localStorage.getItem('neema_beneficiary_records');
        const storedLogs = localStorage.getItem('neema_beneficiary_logs');
        const storedNotifs = localStorage.getItem('neema_beneficiary_notifs');

        if (storedL) this.lists = JSON.parse(storedL);
        if (storedR) this.records = JSON.parse(storedR);
        if (storedLogs) this.logs = JSON.parse(storedLogs);
        if (storedNotifs) this.notifications = JSON.parse(storedNotifs);
      } catch (e) {
        console.error('Failed to parse beneficiaries store from local storage', e);
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('neema_beneficiary_lists', JSON.stringify(this.lists));
        localStorage.setItem('neema_beneficiary_records', JSON.stringify(this.records));
        localStorage.setItem('neema_beneficiary_logs', JSON.stringify(this.logs));
        localStorage.setItem('neema_beneficiary_notifs', JSON.stringify(this.notifications));
        window.dispatchEvent(new CustomEvent('neema_cms_beneficiaries_lists_updated'));
      } catch (e) {
        console.error('Failed to save beneficiaries store to local storage', e);
      }
    }
  }

  public getLists(): AnnualBeneficiaryList[] {
    return this.lists.map(l => ({
      ...l,
      recordsCount: this.records.filter(r => r.listId === l.id).length
    }));
  }

  public getPublishedLists(): { year: string; title: string; students: { id: string; name: string; school: string }[] }[] {
    const published = this.lists.filter(l => l.status === 'Published' || l.status === 'Archived');
    
    // Sort by year descending
    published.sort((a, b) => b.year.localeCompare(a.year));

    return published.map(l => {
      const listRecs = this.records
        .filter(r => r.listId === l.id)
        .sort((a, b) => a.serialNumber - b.serialNumber);

      return {
        year: l.year,
        title: l.title,
        students: listRecs.map(r => ({
          id: String(r.serialNumber).padStart(3, '0'),
          name: r.fullName, // Will be masked on public display via maskBeneficiaryName or pre-masked name
          school: r.school
        }))
      };
    });
  }

  public getRecordsByList(listId: string): BeneficiaryRecord[] {
    return this.records
      .filter(r => r.listId === listId)
      .sort((a, b) => a.serialNumber - b.serialNumber);
  }

  public getAllRecords(): BeneficiaryRecord[] {
    return [...this.records];
  }

  public getLogs(): BeneficiaryAuditLog[] {
    return [...this.logs];
  }

  public getNotifications(): BeneficiaryNotification[] {
    return [...this.notifications];
  }

  // Create Annual Beneficiary List
  public createList(data: { year: string; title: string; description?: string; status: 'Draft' | 'Published' | 'Archived'; createdBy: string }): AnnualBeneficiaryList {
    const now = new Date().toISOString().split('T')[0];
    const newList: AnnualBeneficiaryList = {
      id: `list_${data.year.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}`,
      year: data.year,
      title: data.title,
      description: data.description || '',
      status: data.status,
      yearIdentifier: `NH-BEN-${data.year}`,
      dateCreated: now,
      createdBy: data.createdBy,
      lastModified: now,
      recordsCount: 0
    };

    this.lists.unshift(newList);
    this.addLog('List Created', `Created annual list "${newList.title}" (${newList.yearIdentifier}).`, data.createdBy);
    this.addNotification('New Beneficiary List Created', `Annual list ${newList.yearIdentifier} was created as ${newList.status}.`, 'info');
    this.saveToStorage();
    return newList;
  }

  // Update List Metadata & Publication Status
  public updateList(id: string, updates: Partial<AnnualBeneficiaryList>, updatedBy: string): AnnualBeneficiaryList | null {
    const index = this.lists.findIndex(l => l.id === id);
    if (index === -1) return null;

    const oldStatus = this.lists[index].status;
    this.lists[index] = {
      ...this.lists[index],
      ...updates,
      lastModified: new Date().toISOString().split('T')[0]
    };

    const list = this.lists[index];

    if (updates.status && updates.status !== oldStatus) {
      if (updates.status === 'Published') {
        this.addLog('List Published', `Published annual beneficiary list "${list.title}" to public website.`, updatedBy);
        this.addNotification('Beneficiary List Published', `Annual list "${list.title}" is now published live on the public website.`, 'success');
      } else if (updates.status === 'Archived') {
        this.addLog('List Archived', `Archived annual beneficiary list "${list.title}".`, updatedBy);
        this.addNotification('Beneficiary List Archived', `Annual list "${list.title}" was archived.`, 'warning');
      }
    } else {
      this.addLog('List Updated', `Updated metadata for annual list "${list.title}".`, updatedBy);
    }

    this.saveToStorage();
    return list;
  }

  public deleteList(id: string, deletedBy: string) {
    const list = this.lists.find(l => l.id === id);
    if (!list) return;

    this.lists = this.lists.filter(l => l.id !== id);
    this.records = this.records.filter(r => r.listId !== id);

    this.addLog('List Updated', `Deleted beneficiary list "${list.title}" and associated records.`, deletedBy);
    this.saveToStorage();
  }

  // Recalculate Sequential Serial Numbers (1..N) for a list
  private resequence(listId: string) {
    const listRecs = this.records
      .filter(r => r.listId === listId)
      .sort((a, b) => a.serialNumber - b.serialNumber);

    listRecs.forEach((r, idx) => {
      r.serialNumber = idx + 1;
    });
  }

  // Add Beneficiary Record
  public addBeneficiary(listId: string, fullName: string, school: string, addedBy: string): BeneficiaryRecord | null {
    const list = this.lists.find(l => l.id === listId);
    if (!list) return null;

    const listRecs = this.getRecordsByList(listId);
    const newSeq = listRecs.length + 1;
    const now = new Date().toISOString().split('T')[0];

    const newRecord: BeneficiaryRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      listId,
      serialNumber: newSeq,
      fullName: fullName.toUpperCase(),
      maskedName: maskBeneficiaryName(fullName.toUpperCase()),
      school: school.toUpperCase(),
      year: list.year,
      dateAdded: now,
      status: 'Active'
    };

    this.records.push(newRecord);
    this.resequence(listId);
    this.addLog('Beneficiary Added', `Added beneficiary "${fullName}" to list ${list.yearIdentifier}.`, addedBy);
    this.saveToStorage();
    return newRecord;
  }

  // Edit Beneficiary Record
  public updateBeneficiary(id: string, fullName: string, school: string, updatedBy: string): BeneficiaryRecord | null {
    const rec = this.records.find(r => r.id === id);
    if (!rec) return null;

    rec.fullName = fullName.toUpperCase();
    rec.maskedName = maskBeneficiaryName(fullName.toUpperCase());
    rec.school = school.toUpperCase();

    this.addLog('Beneficiary Edited', `Updated beneficiary record No. ${rec.serialNumber} ("${fullName}").`, updatedBy);
    this.saveToStorage();
    return rec;
  }

  // Delete Beneficiary Record
  public deleteBeneficiary(id: string, deletedBy: string) {
    const rec = this.records.find(r => r.id === id);
    if (!rec) return;

    const listId = rec.listId;
    this.records = this.records.filter(r => r.id !== id);
    this.resequence(listId);

    this.addLog('Beneficiary Deleted', `Deleted beneficiary record No. ${rec.serialNumber} ("${rec.fullName}") from list.`, deletedBy);
    this.saveToStorage();
  }

  // Rearrange / Move record up or down
  public moveBeneficiary(id: string, direction: 'up' | 'down', movedBy: string) {
    const rec = this.records.find(r => r.id === id);
    if (!rec) return;

    const listRecs = this.getRecordsByList(rec.listId);
    const idx = listRecs.findIndex(r => r.id === id);
    if (idx === -1) return;

    if (direction === 'up' && idx > 0) {
      const prev = listRecs[idx - 1];
      const tempSeq = rec.serialNumber;
      rec.serialNumber = prev.serialNumber;
      prev.serialNumber = tempSeq;
    } else if (direction === 'down' && idx < listRecs.length - 1) {
      const next = listRecs[idx + 1];
      const tempSeq = rec.serialNumber;
      rec.serialNumber = next.serialNumber;
      next.serialNumber = tempSeq;
    }

    this.resequence(rec.listId);
    this.addLog('Beneficiary Edited', `Rearranged sequence position for "${rec.fullName}".`, movedBy);
    this.saveToStorage();
  }

  // Bulk Import
  public bulkImport(listId: string, items: { fullName: string; school: string }[], importedBy: string): { imported: number; duplicates: number } {
    const list = this.lists.find(l => l.id === listId);
    if (!list) return { imported: 0, duplicates: 0 };

    const existingRecs = this.getRecordsByList(listId);
    const existingNames = new Set(existingRecs.map(r => r.fullName.toUpperCase()));

    let importedCount = 0;
    let duplicateCount = 0;
    const now = new Date().toISOString().split('T')[0];

    items.forEach(item => {
      const cleanName = item.fullName.trim().toUpperCase();
      const cleanSchool = item.school.trim().toUpperCase();

      if (!cleanName) return;

      if (existingNames.has(cleanName)) {
        duplicateCount++;
      } else {
        existingNames.add(cleanName);
        importedCount++;
        this.records.push({
          id: `rec_imp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          listId,
          serialNumber: this.records.filter(r => r.listId === listId).length + 1,
          fullName: cleanName,
          maskedName: maskBeneficiaryName(cleanName),
          school: cleanSchool,
          year: list.year,
          dateAdded: now,
          status: 'Active'
        });
      }
    });

    this.resequence(listId);
    this.addLog('Import Completed', `Imported ${importedCount} records into ${list.yearIdentifier} (${duplicateCount} duplicates skipped).`, importedBy);
    this.addNotification('Import Completed', `Successfully added ${importedCount} beneficiaries to list ${list.yearIdentifier}.`, 'success');
    this.saveToStorage();

    return { imported: importedCount, duplicates: duplicateCount };
  }

  // Audit Logs
  public addLog(action: BeneficiaryAuditLog['action'], details: string, performedBy: string) {
    this.logs.unshift({
      id: `log_${Date.now()}`,
      action,
      details,
      performedBy,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
  }

  // Notifications
  public addNotification(title: string, message: string, type: 'info' | 'success' | 'warning') {
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      read: false
    });
  }

  public markNotificationRead(id: string) {
    const n = this.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.saveToStorage();
    }
  }
}

export const beneficiariesStore = new BeneficiariesStore();
