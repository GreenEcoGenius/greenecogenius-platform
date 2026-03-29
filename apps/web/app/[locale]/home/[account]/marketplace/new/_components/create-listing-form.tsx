'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { Textarea } from '@kit/ui/textarea';
import { Trans } from '@kit/ui/trans';

interface CreateListingFormProps {
  account: string;
  accountId?: string;
  categories: {
    id: string;
    name: string;
    name_fr: string;
    slug: string;
  }[];
}

export function CreateListingForm({
  account,
  accountId,
  categories,
}: CreateListingFormProps) {
  const supabase = useSupabase();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('category_id') as string;
    const quantity = parseFloat(formData.get('quantity') as string);
    const unit = formData.get('unit') as string;
    const pricePerUnit = formData.get('price_per_unit') as string;
    const listingType = formData.get('listing_type') as string;
    const locationCity = formData.get('location_city') as string;
    const locationCountry = formData.get('location_country') as string;

    let resolvedAccountId = accountId;

    if (!resolvedAccountId && account) {
      const { data: accountData } = await supabase
        .from('accounts')
        .select('id')
        .eq('slug', account)
        .single();

      if (!accountData) return;
      resolvedAccountId = accountData.id;
    }

    if (!resolvedAccountId) return;

    const { error } = await supabase.from('listings').insert({
      account_id: resolvedAccountId,
      title,
      description: description || null,
      category_id: categoryId,
      quantity,
      unit,
      price_per_unit: pricePerUnit ? parseFloat(pricePerUnit) : null,
      listing_type: listingType,
      location_city: locationCity || null,
      location_country: locationCountry || 'FR',
      status: 'active',
    });

    const redirectPath = account
      ? `/home/${account}/marketplace`
      : '/home/marketplace';

    if (!error) {
      startTransition(() => {
        router.push(redirectPath);
        router.refresh();
      });
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="listing_type">
          <Trans i18nKey="marketplace.listingType" />
        </Label>
        <Select name="listing_type" defaultValue="sell">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sell">
              <Trans i18nKey="marketplace.typeSell" />
            </SelectItem>
            <SelectItem value="buy">
              <Trans i18nKey="marketplace.typeBuy" />
            </SelectItem>
            <SelectItem value="collect">
              <Trans i18nKey="marketplace.typeCollect" />
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">
          <Trans i18nKey="marketplace.listingTitle" />
        </Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Ex: Lot de 500kg d'aluminium recyclé"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          <Trans i18nKey="marketplace.listingDescription" />
        </Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Décrivez la matière, son état, ses caractéristiques..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">
          <Trans i18nKey="marketplace.category" />
        </Label>
        <Select name="category_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name_fr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">
            <Trans i18nKey="marketplace.quantity" />
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">
            <Trans i18nKey="marketplace.unit" />
          </Label>
          <Select name="unit" defaultValue="kg">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="tonnes">tonnes</SelectItem>
              <SelectItem value="units">unités</SelectItem>
              <SelectItem value="liters">litres</SelectItem>
              <SelectItem value="m3">m³</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price_per_unit">
          <Trans i18nKey="marketplace.pricePerUnit" /> (EUR)
        </Label>
        <Input
          id="price_per_unit"
          name="price_per_unit"
          type="number"
          step="0.01"
          min="0"
          placeholder="Laisser vide pour 'prix à négocier'"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location_city">
            <Trans i18nKey="marketplace.city" />
          </Label>
          <Input id="location_city" name="location_city" placeholder="Paris" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location_country">
            <Trans i18nKey="marketplace.country" />
          </Label>
          <Select name="location_country" defaultValue="FR">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FR">France</SelectItem>
              <SelectItem value="BE">Belgique</SelectItem>
              <SelectItem value="DE">Allemagne</SelectItem>
              <SelectItem value="NL">Pays-Bas</SelectItem>
              <SelectItem value="IT">Italie</SelectItem>
              <SelectItem value="ES">Espagne</SelectItem>
              <SelectItem value="EE">Estonie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Trans i18nKey="marketplace.publishing" />
        ) : (
          <Trans i18nKey="marketplace.publishListing" />
        )}
      </Button>
    </form>
  );
}
