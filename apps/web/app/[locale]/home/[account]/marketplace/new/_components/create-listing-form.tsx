'use client';

import { useCallback, useMemo, useRef, useState, useTransition } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  ImagePlus,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

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

import { buildListingPrompt } from '~/lib/config/flux-prompts';
import { useFluxImage } from '~/lib/hooks/use-flux-image';


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

interface FormErrors {
  title?: string;
  description?: string;
  category_id?: string;
  quantity?: string;
  price_per_unit?: string;
  location_city?: string;
}

export function CreateListingForm({
  account,
  accountId,
  categories,
}: CreateListingFormProps) {
  const supabase = useSupabase();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('marketplace');
  const locale =
    useTranslations()('common.languageCode' as never) === 'fr' ? 'fr' : 'en';

  // Form state
  const [listingType, setListingType] = useState('sell');
  const [titleText, setTitleText] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [transportPrice, setTransportPrice] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationCountry, setLocationCountry] = useState('FR');

  // Image state
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flux AI
  const {
    generating: fluxGenerating,
    error: fluxError,
    generate: fluxGenerate,
  } = useFluxImage({ context: 'listings', width: 768, height: 768 });

  // Validation
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {};

    if (!titleText || titleText.trim().length < 10) {
      errs.title = locale === 'fr'
        ? 'Le titre doit contenir au moins 10 caractères'
        : 'Title must be at least 10 characters';
    }
    if (!descriptionText || descriptionText.trim().length < 30) {
      errs.description = locale === 'fr'
        ? 'La description doit contenir au moins 30 caractères'
        : 'Description must be at least 30 characters';
    }
    if (!selectedCategoryId) {
      errs.category_id = locale === 'fr'
        ? 'Veuillez sélectionner une catégorie'
        : 'Please select a category';
    }
    if (!quantity || parseFloat(quantity) <= 0) {
      errs.quantity = locale === 'fr'
        ? 'La quantité doit être supérieure à 0'
        : 'Quantity must be greater than 0';
    }
    if (!pricePerUnit || parseFloat(pricePerUnit) <= 0) {
      errs.price_per_unit = locale === 'fr'
        ? 'Le prix par unité est obligatoire et doit être supérieur à 0'
        : 'Price per unit is required and must be greater than 0';
    }
    if (!locationCity || locationCity.trim().length === 0) {
      errs.location_city = locale === 'fr'
        ? 'La ville est obligatoire'
        : 'City is required';
    }

    return errs;
  }, [titleText, descriptionText, selectedCategoryId, quantity, pricePerUnit, locationCity, locale]);

  const currentErrors = useMemo(() => {
    if (!submitAttempted) return {};
    return validate();
  }, [submitAttempted, validate]);

  const isFormValid = useMemo(() => {
    return Object.keys(validate()).length === 0;
  }, [validate]);

  // Has an image (uploaded or generated)
  const hasImage = !!(uploadedImagePreview || generatedImageUrl);
  const displayImageUrl = uploadedImagePreview ?? generatedImageUrl;

  // --- Handlers ---

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) return; // 10 MB max

    setUploadedImageFile(file);
    setUploadedImagePreview(URL.createObjectURL(file));
    setGeneratedImageUrl(null);
  }

  function handleRemoveImage() {
    setUploadedImageFile(null);
    if (uploadedImagePreview) {
      URL.revokeObjectURL(uploadedImagePreview);
      setUploadedImagePreview(null);
    }
    setGeneratedImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleFluxGenerate() {
    const prompt = buildListingPrompt(
      selectedCategorySlug || 'plastics',
      descriptionText || titleText || selectedCategorySlug,
    );
    const url = await fluxGenerate(prompt);
    if (url) {
      setGeneratedImageUrl(url);
      setUploadedImageFile(null);
      if (uploadedImagePreview) {
        URL.revokeObjectURL(uploadedImagePreview);
        setUploadedImagePreview(null);
      }
    }
  }

  async function handleSubmit(formData: FormData) {
    setSubmitAttempted(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

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

    // Upload photo to Supabase Storage if user uploaded a file
    let imagePath: string | null = null;

    if (uploadedImageFile) {
      const ext = uploadedImageFile.name.split('.').pop() ?? 'jpg';
      const fileName = `${resolvedAccountId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('generated-images')
        .upload(`listings/${fileName}`, uploadedImageFile, {
          contentType: uploadedImageFile.type,
          upsert: false,
        });

      if (!uploadError) {
        const { data: publicUrl } = supabase.storage
          .from('generated-images')
          .getPublicUrl(`listings/${fileName}`);
        imagePath = publicUrl.publicUrl;
      }
    } else if (generatedImageUrl) {
      imagePath = generatedImageUrl;
    }

    const { data: inserted, error } = await supabase
      .from('listings')
      .insert({
        account_id: resolvedAccountId,
        title: titleText.trim(),
        description: descriptionText.trim() || null,
        category_id: selectedCategoryId,
        quantity: parseFloat(quantity),
        unit,
        price_per_unit: parseFloat(pricePerUnit),
        transport_price: transportPrice ? parseFloat(transportPrice) : null,
        listing_type: listingType,
        location_city: locationCity.trim(),
        location_country: locationCountry,
        status: 'active',
      })
      .select('id')
      .single();

    // Save image as listing image
    if (inserted?.id && imagePath) {
      await supabase.from('listing_images').insert({
        listing_id: inserted.id,
        storage_path: imagePath,
        position: 0,
      });
    }

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
      {/* Type d'annonce */}
      <div className="space-y-2">
        <Label htmlFor="listing_type">
          <Trans i18nKey="marketplace.listingType" />
        </Label>
        <Select
          name="listing_type"
          defaultValue="sell"
          onValueChange={(val) => val && setListingType(val)}
        >
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

      {/* Titre */}
      <div className="space-y-2">
        <Label htmlFor="title">
          <Trans i18nKey="marketplace.listingTitle" /> *
        </Label>
        <Input
          id="title"
          name="title"
          required
          minLength={10}
          value={titleText}
          onChange={(e) => setTitleText(e.target.value)}
          placeholder={t('titlePlaceholder')}
          className={currentErrors.title ? 'border-red-500' : ''}
        />
        {currentErrors.title && (
          <p className="text-xs text-red-500">{currentErrors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          <Trans i18nKey="marketplace.listingDescription" /> *
        </Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          required
          minLength={30}
          value={descriptionText}
          onChange={(e) => setDescriptionText(e.target.value)}
          placeholder={t('descriptionPlaceholder')}
          className={currentErrors.description ? 'border-red-500' : ''}
        />
        <div className="flex items-center justify-between">
          {currentErrors.description ? (
            <p className="text-xs text-red-500">{currentErrors.description}</p>
          ) : (
            <span />
          )}
          <span className="text-muted-foreground text-xs">
            {descriptionText.length}/30 min
          </span>
        </div>
      </div>

      {/* Catégorie */}
      <div className="space-y-2">
        <Label htmlFor="category_id">
          <Trans i18nKey="marketplace.category" /> *
        </Label>
        <Select
          name="category_id"
          required
          value={selectedCategoryId}
          onValueChange={(val) => {
            if (!val) return;
            setSelectedCategoryId(val);
            const cat = categories.find((c) => c.id === val);
            setSelectedCategorySlug(cat?.slug ?? '');
          }}
        >
          <SelectTrigger
            className={currentErrors.category_id ? 'border-red-500' : ''}
          >
            <SelectValue placeholder={t('selectCategory')} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {locale === 'fr' ? cat.name_fr : cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {currentErrors.category_id && (
          <p className="text-xs text-red-500">{currentErrors.category_id}</p>
        )}
      </div>

      {/* Quantité + Unité */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">
            <Trans i18nKey="marketplace.quantity" /> *
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            step="0.01"
            min="0.01"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={currentErrors.quantity ? 'border-red-500' : ''}
          />
          {currentErrors.quantity && (
            <p className="text-xs text-red-500">{currentErrors.quantity}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">
            <Trans i18nKey="marketplace.unit" />
          </Label>
          <Select
            name="unit"
            defaultValue="kg"
            onValueChange={(val) => val && setUnit(val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">{t('unitKg')}</SelectItem>
              <SelectItem value="tonnes">{t('unitTonnes')}</SelectItem>
              <SelectItem value="units">{t('unitUnits')}</SelectItem>
              <SelectItem value="liters">{t('unitLiters')}</SelectItem>
              <SelectItem value="m3">{t('unitM3')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Prix par unité */}
      <div className="space-y-2">
        <Label htmlFor="price_per_unit">
          <Trans i18nKey="marketplace.pricePerUnitCurrency" /> *
        </Label>
        <Input
          id="price_per_unit"
          name="price_per_unit"
          type="number"
          step="0.01"
          min="0.01"
          required
          value={pricePerUnit}
          onChange={(e) => setPricePerUnit(e.target.value)}
          placeholder="Ex: 0.50"
          className={currentErrors.price_per_unit ? 'border-red-500' : ''}
        />
        {currentErrors.price_per_unit && (
          <p className="text-xs text-red-500">
            {currentErrors.price_per_unit}
          </p>
        )}
      </div>

      {/* Frais de transport (collecte uniquement) */}
      {listingType === 'collect' && (
        <div className="space-y-2">
          <Label htmlFor="transport_price">
            <Trans i18nKey="marketplace.transportPrice" />
          </Label>
          <Input
            id="transport_price"
            name="transport_price"
            type="number"
            step="0.01"
            min="0"
            value={transportPrice}
            onChange={(e) => setTransportPrice(e.target.value)}
            placeholder={t('transportPricePlaceholder')}
          />
        </div>
      )}

      {/* Ville + Pays */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location_city">
            <Trans i18nKey="marketplace.city" /> *
          </Label>
          <Input
            id="location_city"
            name="location_city"
            required
            value={locationCity}
            onChange={(e) => setLocationCity(e.target.value)}
            placeholder={t('cityPlaceholder')}
            className={currentErrors.location_city ? 'border-red-500' : ''}
          />
          {currentErrors.location_city && (
            <p className="text-xs text-red-500">
              {currentErrors.location_city}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location_country">
            <Trans i18nKey="marketplace.country" /> *
          </Label>
          <Select
            name="location_country"
            defaultValue="FR"
            onValueChange={(val) => val && setLocationCountry(val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FR">{t('countryFR')}</SelectItem>
              <SelectItem value="BE">{t('countryBE')}</SelectItem>
              <SelectItem value="DE">{t('countryDE')}</SelectItem>
              <SelectItem value="NL">{t('countryNL')}</SelectItem>
              <SelectItem value="IT">{t('countryIT')}</SelectItem>
              <SelectItem value="ES">{t('countryES')}</SelectItem>
              <SelectItem value="EE">{t('countryEE')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ---- Photo / Image IA ---- */}
      <div className="space-y-2">
        <Label>
          <Trans i18nKey="marketplace.photo" />
        </Label>

        {displayImageUrl ? (
          <div className="relative overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImageUrl}
              alt={titleText || 'Listing image'}
              className="h-auto max-h-80 w-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute right-2 top-2"
              onClick={handleRemoveImage}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              <Trans i18nKey="marketplace.flux.remove" />
            </Button>
            {generatedImageUrl && !uploadedImagePreview && (
              <p className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-1.5 text-xs text-white/70">
                <Trans i18nKey="marketplace.flux.attribution" />
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-5">
            <div className="flex flex-col items-center gap-3">
              <ImagePlus className="text-muted-foreground h-8 w-8" />

              {/* Upload button */}
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-1.5 h-4 w-4" />
                  <Trans i18nKey="marketplace.uploadPhoto" />
                </Button>

                {/* Flux AI generation button */}
                <span className="text-muted-foreground text-xs">
                  <Trans i18nKey="marketplace.or" />
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleFluxGenerate}
                  disabled={fluxGenerating}
                  className="text-teal-600 hover:text-teal-700"
                >
                  {fluxGenerating ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      <Trans i18nKey="marketplace.flux.generating" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-1.5 h-4 w-4" />
                      <Trans i18nKey="marketplace.flux.generate" />
                    </>
                  )}
                </Button>
              </div>

              <p className="text-muted-foreground text-center text-xs">
                <Trans i18nKey="marketplace.photoHint" />
              </p>

              <p className="text-center text-[11px] text-gray-400">
                <Trans i18nKey="marketplace.flux.attribution" />
              </p>

              {fluxError && (
                <p className="text-xs text-red-500">{fluxError}</p>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        )}
      </div>

      {/* Publier */}
      <Button
        type="submit"
        className="w-full"
        disabled={isPending || (submitAttempted && !isFormValid)}
      >
        {isPending ? (
          <Trans i18nKey="marketplace.publishing" />
        ) : (
          <Trans i18nKey="marketplace.publishListing" />
        )}
      </Button>
    </form>
  );
}
