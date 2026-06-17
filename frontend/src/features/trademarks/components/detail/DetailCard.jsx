import { Switch } from '@/shared';
import { Pencil } from 'lucide-react';

export default function DetailCard({ title }) {
  return (
    <div
      className="grid grid-cols-2 gap-1
         p-4 rounded-[var(--radius-2xl)] border border-border bg-surface-hover justify-items items-end"
    >
      <h3 className="text-small font-heading ">{title}</h3>

      <div className="flex gap-4 justify-self-end">  
        <Pencil size={18} />
        <Switch className="inline-flex" />
      </div>
    </div>
  );
}
