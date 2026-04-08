'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useTranslations } from 'next-intl';
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

// Only the subcategory keys per category — labels come from i18n.
const SUBCATEGORIES: Record<Category, string[]> = {
  governance: [
    'board_composition',
    'anti_corruption',
    'code_of_conduct',
    'esg_committee',
    'remuneration',
  ],
  social: [
    'employee_count',
    'training_rate',
    'diversity',
    'working_conditions',
    'social_dialogue',
  ],
  environment: [
    'water_consumption',
    'renewable_energy',
    'biodiversity',
    'zero_waste',
    'mobility',
  ],
  procurement: [
    'local_purchasing',
    'supplier_audit',
    'responsible_procurement_policy',
    'esg_criteria',
  ],
  community: [
    'patronage',
    'volunteering',
    'ngo_partnership',
    'local_action',
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
  const t = useTranslations('externalActivities');
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<UploadedDoc | null>(null);

  const form = useForm({
    resolver: zodResolver(CreateExternalActivitySchema),
    defaultValues: {
      category,
      subcategory: SUBCATEGORIES[category]![0]!,
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
        subcategory: SUBCATEGORIES[category]![0]!,
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
        t('form.genericError');
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
              <FormLabel>{t('form.subcategory')}</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBCATEGORIES[category]!.map((key) => (
                      <SelectItem key={key} value={key}>
                        {t(
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          `subcategories.${key}` as any,
                        )}
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
              <FormLabel>{t('form.title')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t('form.titlePlaceholder')}
                />
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
              <FormLabel>{t('form.description')}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  placeholder={t('form.descriptionPlaceholder')}
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
                <FormLabel>{t('form.quantitativeValue')}</FormLabel>
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
                    placeholder={t('form.quantitativeValuePlaceholder')}
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
                <FormLabel>{t('form.quantitativeUnit')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder={t('form.quantitativeUnitPlaceholder')}
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
                {t('form.externalUrlLabel')}
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
            <p className="text-sm text-[#1BAF6A]">{t('form.saved')}</p>
          ) : errorMessage ? (
            <p className="text-xs text-red-500">{errorMessage}</p>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('form.submitting')}
              </>
            ) : (
              t('form.submit')
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
