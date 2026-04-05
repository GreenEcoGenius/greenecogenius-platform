'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';

import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { Textarea } from '@kit/ui/textarea';

import { CreateExternalActivitySchema } from '../_lib/external-activity.schema';
import { createExternalActivity } from '../_lib/server/server-actions';
import { DocumentUploader } from './document-uploader';

type Category =
  | 'governance'
  | 'social'
  | 'environment'
  | 'procurement'
  | 'community';

const SUBCATEGORIES: Record<Category, { value: string; label: string }[]> = {
  governance: [
    { value: 'board_composition', label: 'Composition du conseil' },
    { value: 'anti_corruption', label: 'Politique anti-corruption' },
    { value: 'code_of_conduct', label: 'Code de conduite' },
    { value: 'esg_committee', label: 'Comite RSE / ESG' },
    { value: 'remuneration', label: 'Politique de remuneration' },
  ],
  social: [
    { value: 'employee_count', label: 'Effectifs' },
    { value: 'training_rate', label: 'Taux de formation' },
    { value: 'diversity', label: 'Diversite et inclusion' },
    { value: 'working_conditions', label: 'Conditions de travail' },
    { value: 'social_dialogue', label: 'Dialogue social' },
  ],
  environment: [
    { value: 'water_consumption', label: "Consommation d'eau" },
    { value: 'renewable_energy', label: 'Energie renouvelable' },
    { value: 'biodiversity', label: 'Biodiversite' },
    { value: 'zero_waste', label: 'Politique zero dechet' },
    { value: 'mobility', label: 'Mobilite / flotte' },
  ],
  procurement: [
    { value: 'local_purchasing', label: 'Achats locaux' },
    { value: 'supplier_audit', label: 'Audit fournisseurs' },
    { value: 'responsible_procurement_policy', label: 'Politique achats responsables' },
    { value: 'esg_criteria', label: 'Criteres ESG appels d offres' },
  ],
  community: [
    { value: 'patronage', label: 'Mecenat' },
    { value: 'volunteering', label: 'Benevolat employes' },
    { value: 'ngo_partnership', label: 'Partenariats ONG' },
    { value: 'local_action', label: 'Actions locales' },
  ],
};

interface ExternalActivityFormProps {
  category: Category;
}

interface UploadedDoc {
  path: string;
  signedUrl: string;
  filename: string;
  contentType: string;
}

export function ExternalActivityForm({ category }: ExternalActivityFormProps) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<UploadedDoc | null>(null);

  const form = useForm({
    resolver: zodResolver(CreateExternalActivitySchema),
    defaultValues: {
      category,
      subcategory: SUBCATEGORIES[category]![0]!.value,
      title: '',
      description: '',
      quantitative_value: null as number | null,
      quantitative_unit: '',
      qualitative_value: '',
      document_url: '',
      document_path: '',
      date_start: null as string | null,
      date_end: null as string | null,
    },
  });

  const { execute, isPending } = useAction(createExternalActivity, {
    onSuccess: () => {
      setErrorMessage(null);
      setSuccess(true);
      setUploadedDoc(null);
      form.reset({
        category,
        subcategory: SUBCATEGORIES[category]![0]!.value,
        title: '',
        description: '',
        quantitative_value: null,
        quantitative_unit: '',
        qualitative_value: '',
        document_url: '',
        document_path: '',
        date_start: null,
        date_end: null,
      });
      router.refresh();
      setTimeout(() => setSuccess(false), 2500);
    },
    onError: ({ error }) => {
      const message =
        error.serverError ??
        error.thrownError?.message ??
        "Impossible d'enregistrer la donnee pour le moment.";
      setErrorMessage(String(message));
      setSuccess(false);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => execute(data))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="subcategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sous-categorie</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBCATEGORIES[category]!.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Code de conduite 2026" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  placeholder="Decrivez l'activite, son contexte, ses beneficiaires..."
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="quantitative_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valeur chiffree</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === '' ? null : Number(e.target.value),
                      )
                    }
                    placeholder="Ex: 42"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantitative_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unite</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="Ex: %, m³, h, ETP"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DocumentUploader
          category={category}
          path={uploadedDoc?.path ?? null}
          signedUrl={uploadedDoc?.signedUrl ?? null}
          filename={uploadedDoc?.filename ?? null}
          contentType={uploadedDoc?.contentType ?? null}
          onUploaded={(doc) => {
            setUploadedDoc(doc);
            form.setValue('document_path', doc.path);
            // Clear any previously typed external URL since the upload wins.
            form.setValue('document_url', '');
          }}
          onRemoved={() => {
            setUploadedDoc(null);
            form.setValue('document_path', '');
          }}
          onAnalyzed={(sugg) => {
            if (sugg.title && !form.getValues('title')) {
              form.setValue('title', sugg.title, { shouldValidate: true });
            }
            if (sugg.description && !form.getValues('description')) {
              form.setValue('description', sugg.description);
            }
            if (
              sugg.quantitative_value !== null &&
              form.getValues('quantitative_value') === null
            ) {
              form.setValue('quantitative_value', sugg.quantitative_value);
            }
            if (
              sugg.quantitative_unit &&
              !form.getValues('quantitative_unit')
            ) {
              form.setValue('quantitative_unit', sugg.quantitative_unit);
            }
          }}
        />

        <FormField
          control={form.control}
          name="document_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-gray-500">
                …ou un lien externe
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  type="url"
                  placeholder="https://..."
                  disabled={Boolean(uploadedDoc)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between gap-2">
          {success ? (
            <p className="text-sm text-emerald-600">Enregistre.</p>
          ) : errorMessage ? (
            <p className="text-xs text-red-500">{errorMessage}</p>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Ajouter'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
