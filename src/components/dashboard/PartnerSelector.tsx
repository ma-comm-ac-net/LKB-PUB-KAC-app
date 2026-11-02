import React from 'react';
import { Users } from 'lucide-react';
import { PartnerId } from '../../types';

interface PartnerSelectorProps {
  selectedPartner: PartnerId;
  onSelectPartner: (partner: PartnerId) => void;
}

export const PartnerSelector: React.FC<PartnerSelectorProps> = ({
  selectedPartner,
  onSelectPartner,
}) => {
  const partners: { id: PartnerId; label: string }[] = [
    { id: 'ALL', label: 'Keseluruhan' },
    { id: 'KA01', label: 'KA01' },
    { id: 'KA02', label: 'KA02' },
    { id: 'KA03', label: 'KA03' },
    { id: 'KA04', label: 'KA04' },
    { id: 'KA05', label: 'KA05' },
    { id: 'KA06', label: 'KA06' },
    { id: 'KA07', label: 'KA07' },
    { id: 'KA08', label: 'KA08' },
    { id: 'KA09', label: 'KA09' },
    { id: 'KA10', label: 'KA10' },
    { id: 'KA11', label: 'KA11' },
    { id: 'KA12', label: 'KA12' },
    { id: 'KA13', label: 'KA13' },
    { id: 'KA14', label: 'KA14' },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#DCE4EF] p-3 shadow-xs flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 mr-2 text-[#0B2B55] font-extrabold text-xs">
        <Users className="w-4 h-4 text-[#0B2B55]" />
        <span>Pilih Mitra :</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 flex-1">
        {partners.map((p) => {
          const isSelected = selectedPartner === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPartner(p.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                isSelected
                  ? 'bg-[#F5BB00] text-[#092754] border-[#DCA400] shadow-xs ring-1 ring-[#F5BB00]'
                  : 'bg-white text-[#172B4D] border-[#DCE4EF] hover:bg-[#F5F7FB] hover:border-[#CBD5E1]'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
