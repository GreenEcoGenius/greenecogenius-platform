import { CheckCircle2, Clock, User } from 'lucide-react';

export interface SignatureStatusRowProps {
  role: 'Vendeur' | 'Acheteur';
  name: string;
  signed: boolean;
  signedAt: string | null;
}

export function SignatureStatusRow({
  role,
  name,
  signed,
  signedAt,
}: SignatureStatusRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#D5E8DD] bg-card p-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6F7EF]">
          <User className="h-4 w-4 text-[#00A86B]" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {role}
          </p>
          <p className="truncate text-sm font-medium text-gray-900">{name}</p>
        </div>
      </div>
      {signed ? (
        <div className="flex items-center gap-1.5 rounded-full bg-[#E6F7EF] px-2.5 py-1 text-xs font-medium text-[#008F5A]">
          <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
          Signe
          {signedAt ? (
            <span className="text-[10px] text-[#E6F7EF]0">
              · {new Date(signedAt).toLocaleDateString('fr-FR')}
            </span>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
          <Clock className="h-3.5 w-3.5" strokeWidth={2} />
          En attente
        </div>
      )}
    </div>
  );
}
