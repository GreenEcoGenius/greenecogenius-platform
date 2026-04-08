'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Truck,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';

import { CertificateIssuer } from '~/home/(user)/traceability/_components/certificate-issuer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActionType =
  | 'corriger'
  | 'signaler'
  | 'contacter_transporteur'
  | 'marquer_retarde'
  | 'emettre_certificats';

interface AlertActionModalProps {
  actionType: ActionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lotId?: string;
  alertMessage?: string;
}

// ---------------------------------------------------------------------------
// Sub-forms
// ---------------------------------------------------------------------------

function CorrigerForm({
  lotId,
  onSuccess,
}: {
  lotId?: string;
  onSuccess: () => void;
}) {
  const [currentWeight] = useState('2500');
  const [newWeight, setNewWeight] = useState('2100');
  const [reason, setReason] = useState('erreur_pesee');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    alert(
      `Correction enregistree pour ${lotId ?? 'lot'}: ${currentWeight} kg -> ${newWeight} kg`,
    );
    onSuccess();
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-muted-foreground mb-1 block text-xs font-medium">
            Poids actuel (kg)
          </label>
          <input
            type="text"
            value={currentWeight}
            readOnly
            className="bg-muted text-muted-foreground w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-muted-foreground mb-1 block text-xs font-medium">
            Nouveau poids (kg)
          </label>
          <input
            type="text"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="bg-background w-full rounded-md border px-3 py-2 text-sm"
            data-test="corriger-new-weight"
          />
        </div>
      </div>
      <div>
        <label className="text-muted-foreground mb-1 block text-xs font-medium">
          Raison de la correction
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="bg-background w-full rounded-md border px-3 py-2 text-sm"
          data-test="corriger-reason"
        >
          <option value="erreur_pesee">Erreur de pesee</option>
          <option value="erreur_saisie">Erreur de saisie</option>
          <option value="perte_transport">Perte durant le transport</option>
          <option value="humidite">Variation due a l&apos;humidite</option>
          <option value="autre">Autre</option>
        </select>
      </div>
      <div>
        <label className="text-muted-foreground mb-1 block text-xs font-medium">
          Commentaire (optionnel)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          placeholder="Precision supplementaire..."
          className="bg-background w-full rounded-md border px-3 py-2 text-sm"
          data-test="corriger-comment"
        />
      </div>
      <DialogFooter>
        <Button
          size="sm"
          disabled={isSubmitting || !newWeight}
          onClick={handleSubmit}
          data-test="corriger-confirm"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Pencil className="mr-2 h-4 w-4" />
          )}
          Confirmer la correction
        </Button>
      </DialogFooter>
    </div>
  );
}

function SignalerForm({
  lotId,
  alertMessage,
  onSuccess,
}: {
  lotId?: string;
  alertMessage?: string;
  onSuccess: () => void;
}) {
  const [recipient] = useState('vendeur@ecorecycle.fr');
  const [subject] = useState(`Ecart de poids - ${lotId ?? 'Lot'}`);
  const [message, setMessage] = useState(
    `Bonjour,\n\nNous avons constate un ecart de poids concernant le lot ${lotId ?? 'N/A'}.\n\nDetail: ${alertMessage ?? 'Ecart detecte'}\n\nMerci de bien vouloir verifier et nous recontacter.\n\nCordialement,\nEquipe GreenEcoGenius`,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    alert(`Signalement envoye a ${recipient} concernant ${lotId ?? 'lot'}`);
    onSuccess();
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-muted-foreground mb-1 block text-xs font-medium">
          Destinataire
        </label>
        <input
          type="text"
          value={recipient}
          readOnly
          className="bg-muted text-muted-foreground w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-muted-foreground mb-1 block text-xs font-medium">
          Objet
        </label>
        <input
          type="text"
          value={subject}
          readOnly
          className="bg-muted text-muted-foreground w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-muted-foreground mb-1 block text-xs font-medium">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="bg-background w-full rounded-md border px-3 py-2 text-sm"
          data-test="signaler-message"
        />
      </div>
      <DialogFooter>
        <Button
          size="sm"
          disabled={isSubmitting}
          onClick={handleSubmit}
          data-test="signaler-confirm"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Envoyer le signalement
        </Button>
      </DialogFooter>
    </div>
  );
}

function ContacterTransporteurForm({
  lotId,
  onSuccess,
}: {
  lotId?: string;
  onSuccess: () => void;
}) {
  const [transporteur] = useState('TransExpress Logistique');
  const [telephone] = useState('+33 1 23 45 67 89');
  const [message, setMessage] = useState(
    `Bonjour,\n\nNous souhaiterions obtenir des informations sur le lot ${lotId ?? 'N/A'} actuellement en transit depuis 5 jours.\n\nPouvez-vous nous communiquer un suivi de localisation ?\n\nMerci.`,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    alert(`Message envoye a ${transporteur} concernant ${lotId ?? 'lot'}`);
    onSuccess();
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 flex items-center gap-3 rounded-lg border p-3">
        <Truck className="text-muted-foreground h-8 w-8" />
        <div>
          <p className="text-sm font-medium">{transporteur}</p>
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <Phone className="h-3 w-3" /> {telephone}
          </p>
        </div>
      </div>
      <div>
        <label className="text-muted-foreground mb-1 block text-xs font-medium">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="bg-background w-full rounded-md border px-3 py-2 text-sm"
          data-test="contacter-message"
        />
      </div>
      <DialogFooter>
        <Button
          size="sm"
          disabled={isSubmitting}
          onClick={handleSubmit}
          data-test="contacter-confirm"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Envoyer le message
        </Button>
      </DialogFooter>
    </div>
  );
}

function EmettreForm({ onClose }: { onClose: () => void }) {
  const eligibleLots = [
    { lotId: 'LOT-0015', material: 'plastique', weight: 8500 },
    { lotId: 'LOT-0018', material: 'metal', weight: 12300 },
    { lotId: 'LOT-0022', material: 'aluminium', weight: 5700 },
  ];

  return <CertificateIssuer eligibleLots={eligibleLots} onClose={onClose} />;
}

// ---------------------------------------------------------------------------
// Modal config
// ---------------------------------------------------------------------------

const modalConfig: Record<
  ActionType,
  { title: string; description: string; icon: React.ReactNode }
> = {
  corriger: {
    title: 'Corriger le poids',
    description: 'Modifier le poids enregistre pour ce lot.',
    icon: <Pencil className="h-5 w-5 text-emerald-700" />,
  },
  signaler: {
    title: 'Signaler un ecart',
    description: 'Envoyer un signalement au vendeur concernant cet ecart.',
    icon: <AlertTriangle className="h-5 w-5 text-emerald-700" />,
  },
  contacter_transporteur: {
    title: 'Contacter le transporteur',
    description: 'Envoyer un message au transporteur pour obtenir un suivi.',
    icon: <Truck className="h-5 w-5 text-[#1ED760]" />,
  },
  marquer_retarde: {
    title: 'Marquer comme retarde',
    description: 'Le lot sera marque comme retarde dans le systeme.',
    icon: <AlertTriangle className="h-5 w-5 text-[#1ED760]" />,
  },
  emettre_certificats: {
    title: 'Emettre des certificats',
    description:
      'Selectionnez et emettez des certificats de tracabilite pour les lots eligibles.',
    icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  },
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function AlertActionModal({
  actionType,
  open,
  onOpenChange,
  lotId,
  alertMessage,
}: AlertActionModalProps) {
  const [success, setSuccess] = useState(false);
  const config = modalConfig[actionType];

  function handleSuccess() {
    setSuccess(true);
    setTimeout(() => {
      onOpenChange(false);
      setSuccess(false);
    }, 1500);
  }

  function handleClose() {
    onOpenChange(false);
    setSuccess(false);
  }

  // "Marquer retarde" is instant, no modal content needed
  if (actionType === 'marquer_retarde' && open) {
    alert(`Lot ${lotId ?? ''} marque comme retarde.`);
    onOpenChange(false);

    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          actionType === 'emettre_certificats' ? 'sm:max-w-lg' : 'sm:max-w-md'
        }
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {config.icon}
            {config.title}
            {lotId && (
              <Badge variant="outline" className="ml-1 text-[10px]">
                {lotId}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
            <p className="text-sm font-medium">Action effectuee avec succes</p>
          </div>
        ) : (
          <>
            {actionType === 'corriger' && (
              <CorrigerForm lotId={lotId} onSuccess={handleSuccess} />
            )}
            {actionType === 'signaler' && (
              <SignalerForm
                lotId={lotId}
                alertMessage={alertMessage}
                onSuccess={handleSuccess}
              />
            )}
            {actionType === 'contacter_transporteur' && (
              <ContacterTransporteurForm
                lotId={lotId}
                onSuccess={handleSuccess}
              />
            )}
            {actionType === 'emettre_certificats' && (
              <EmettreForm onClose={handleClose} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
