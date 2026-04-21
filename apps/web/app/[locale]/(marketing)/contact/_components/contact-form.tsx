'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Send, XCircle } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { cn } from '@kit/ui/utils';

import { EnviroButton } from '~/components/enviro';

import { ContactEmailSchema } from '~/(marketing)/contact/_lib/contact-email.schema';
import { sendContactEmail } from '~/(marketing)/contact/_lib/server/server-actions';

const enviroInputClasses =
  'h-11 rounded-[--radius-enviro-md] border-[1.5px] border-[--color-enviro-cream-300] bg-white px-4 text-base text-[--color-enviro-forest-900] placeholder:text-[--color-enviro-forest-600] focus:border-[--color-enviro-forest-700] focus:outline-none focus:ring-2 focus:ring-[--color-enviro-lime-300]/40 font-[family-name:var(--font-enviro-sans)]';

const enviroTextareaClasses =
  'min-h-[160px] rounded-[--radius-enviro-md] border-[1.5px] border-[--color-enviro-cream-300] bg-white px-4 py-3 text-base text-[--color-enviro-forest-900] placeholder:text-[--color-enviro-forest-600] focus:border-[--color-enviro-forest-700] focus:outline-none focus:ring-2 focus:ring-[--color-enviro-lime-300]/40 font-[family-name:var(--font-enviro-sans)]';

const enviroLabelClasses =
  'text-xs uppercase tracking-[0.08em] font-medium text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]';

export function ContactForm({ defaultMessage }: { defaultMessage?: string }) {
  const tMarketing = useTranslations('marketing');
  const tContact = useTranslations('contact');

  const [state, setState] = useState<{
    success: boolean;
    error: boolean;
  }>({
    success: false,
    error: false,
  });

  const { execute, isPending } = useAction(sendContactEmail, {
    onSuccess: () => {
      setState({ success: true, error: false });
    },
    onError: () => {
      setState({ error: true, success: false });
    },
  });

  const form = useForm({
    resolver: zodResolver(ContactEmailSchema),
    defaultValues: {
      name: '',
      email: '',
      message: defaultMessage ?? '',
    },
  });

  if (state.success) {
    return (
      <FormStatus
        tone="success"
        icon={CheckCircle2}
        title={tMarketing('contactSuccess')}
        description={tMarketing('contactSuccessDescription')}
      />
    );
  }

  if (state.error) {
    return (
      <FormStatus
        tone="error"
        icon={XCircle}
        title={tMarketing('contactError')}
        description={tMarketing('contactErrorDescription')}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit((data) => {
          execute(data);
        })}
      >
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={enviroLabelClasses}>
                <span aria-hidden="true">[ </span>
                {tMarketing('contactName')}
                <span aria-hidden="true"> ]</span>
              </FormLabel>
              <FormControl>
                <Input
                  maxLength={200}
                  placeholder={tContact('fieldNamePlaceholder')}
                  className={enviroInputClasses}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={enviroLabelClasses}>
                <span aria-hidden="true">[ </span>
                {tMarketing('contactEmail')}
                <span aria-hidden="true"> ]</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={tContact('fieldEmailPlaceholder')}
                  className={enviroInputClasses}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={enviroLabelClasses}>
                <span aria-hidden="true">[ </span>
                {tMarketing('contactMessage')}
                <span aria-hidden="true"> ]</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  maxLength={5000}
                  placeholder={tContact('fieldMessagePlaceholder')}
                  className={enviroTextareaClasses}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <EnviroButton
            type="submit"
            variant="primary"
            size="lg"
            magnetic
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            <Send className="h-4 w-4" strokeWidth={1.5} />
            {isPending ? tContact('submitting') : tMarketing('sendMessage')}
          </EnviroButton>
        </div>
      </form>
    </Form>
  );
}

interface FormStatusProps {
  tone: 'success' | 'error';
  icon: typeof CheckCircle2;
  title: string;
  description: string;
}

function FormStatus({ tone, icon: Icon, title, description }: FormStatusProps) {
  const surface =
    tone === 'success'
      ? 'border-[--color-enviro-lime-400] bg-[--color-enviro-lime-300]/20'
      : 'border-[--color-enviro-ember-500] bg-[--color-enviro-ember-50]';
  const iconColor =
    tone === 'success'
      ? 'text-[--color-enviro-forest-900]'
      : 'text-[--color-enviro-ember-700]';

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-4 rounded-[--radius-enviro-xl] border p-6',
        surface,
      )}
    >
      <Icon
        className={cn('mt-0.5 h-6 w-6 shrink-0', iconColor)}
        strokeWidth={1.5}
      />
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
          {title}
        </p>
        <p className="text-sm leading-relaxed text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
          {description}
        </p>
      </div>
    </div>
  );
}
