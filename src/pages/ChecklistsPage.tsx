import React from 'react';
import { CheckSquare, FileText, Download } from 'lucide-react';

export default function ChecklistsPage() {
  const checklists = [
    { title: 'Individual Micro-Loan Checklist', items: ['National ID Copy', 'KRA PIN Certificate', '6 Months M-PESA/Bank Statement', '2 Passport Photos'] },
    { title: 'Group Loan (Chama) Requirements', items: ['Group Constitution', 'Registration Certificate', 'List of Active Members', 'Minutes approving loan request'] },
    { title: 'Agribusiness & Asset Finance', items: ['Land Ownership / Lease Agreement', 'Farm photos & harvest logs', 'Guarantor National IDs', 'Business registration'] },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="bg-[#074504] text-white p-8 rounded-3xl space-y-2">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-[#C0991B]" /> Loan Application Checklists
        </h1>
        <p className="text-xs text-[#C0991B] font-bold">Ensure you have all necessary documentation before visiting our branch or submitting online.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {checklists.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900 border-b pb-2">{c.title}</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              {c.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#074504] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
