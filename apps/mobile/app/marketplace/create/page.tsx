'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  Camera,
  X,
  ChevronDown,
  MapPin,
  Package,
  Euro,
  Scale,
  FileText,
  ImagePlus,
  Trash2,
  Truck,
} from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { supabase } from '~/lib/supabase-client';
import { fetchMaterialCategories, type MaterialCategory } from '~/lib/queries/listings';

const UNITS = ['tonnes', 'kg', 'unités', 'litres', 'm³'] as const;
type UnitType = (typeof UNITS)[number];

const UNIT_LABELS: Record<UnitType, { fr: string; en: string }> = {
  tonnes: { fr: 'Tonnes', en: 'Tonnes' },
  kg: { fr: 'Kilogrammes', en: 'Kilograms' },
  'unités': { fr: 'Unités', en: 'Units' },
  litres: { fr: 'Litres', en: 'Liters' },
  'm³': { fr: 'Mètres cubes', en: 'Cubic meters' },
};

function CreateListingContent() {
  const router = useRouter();
  const t = useTranslations('marketplace');
  const locale = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [listingType, setListingType] = useState<'sell' | 'collect'>('sell');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<UnitType>('tonnes');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [transportPrice, setTransportPrice] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationCountry, setLocationCountry] = useState('FR');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  // Image state
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    fetchMaterialCategories().then(setCategories).catch(console.error);
  }, []);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - imageFiles.length);
    const updatedFiles = [...imageFiles, ...newFiles];
    setImageFiles(updatedFiles);
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function removeImage(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadImages(listingId: string, userId: string): Promise<void> {
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const ext = file.name.split('.').pop() || 'jpg';
      const storagePath = `listings/${userId}/${Date.now()}_${i}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('generated-images')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from('generated-images')
        .getPublicUrl(storagePath);
      const imagePublicUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase
        .from('listing_images')
        .insert({
          listing_id: listingId,
          storage_path: imagePublicUrl,
          position: i,
        });

      if (insertError) {
        console.error('Insert image record error:', insertError);
      }
    }
  }

  async function handleSubmit() {
    if (!title.trim() || !categoryId) return;
    setError(null);

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError(locale === 'fr' ? 'Vous devez être connecté' : 'You must be logged in');
        return;
      }

      // Get user's account
      const { data: memberships } = await supabase
        .from('accounts_memberships')
        .select('account_id')
        .eq('user_id', user.id)
        .limit(1);

      if (!memberships || memberships.length === 0) {
        setError(locale === 'fr' ? 'Aucun compte trouvé' : 'No account found');
        return;
      }

      const accountId = memberships[0].account_id;

      // Insert listing with correct column names (matching web app)
      const { data: listing, error: insertError } = await supabase
        .from('listings')
        .insert({
          account_id: accountId,
          title: title.trim(),
          description: description.trim() || null,
          category_id: categoryId,
          listing_type: listingType,
          quantity: quantity ? parseFloat(quantity) : null,
          unit: unit,
          price_per_unit: pricePerUnit ? parseFloat(pricePerUnit) : null,
          transport_price: transportPrice ? parseFloat(transportPrice) : null,
          location_city: locationCity.trim() || null,
          location_country: locationCountry,
          status: 'active',
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        setError(insertError.message);
        return;
      }

      // Upload images if any
      if (listing && imageFiles.length > 0) {
        await uploadImages(listing.id, user.id);
      }

      router.back();
    } catch (err: any) {
      console.error('Failed to create listing:', err);
      setError(err?.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  const priceLabel = locale === 'fr'
    ? `Prix/${unit === 'unités' ? 'unité' : unit === 'm³' ? 'm³' : unit} (€)`
    : `Price/${unit === 'unités' ? 'unit' : unit} (€)`;

  const quantityLabel = locale === 'fr'
    ? `Quantité (${UNIT_LABELS[unit].fr.toLowerCase()})`
    : `Quantity (${UNIT_LABELS[unit].en.toLowerCase()})`;

  return (
    <AppShell title={t('createListing')} showBack hideTabBar>
      <div className="space-y-5 pb-6">
        {/* Error banner */}
        {error && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-[12px] text-red-300">
            {error}
          </div>
        )}

        {/* Listing Type Toggle */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#F5F5F0]/60">
            {t('type')}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setListingType('sell')}
              className={`flex-1 rounded-xl py-2.5 text-[13px] font-medium transition-all ${
                listingType === 'sell'
                  ? 'bg-[#B8D4E3]/20 text-[#B8D4E3] border border-[#B8D4E3]/30'
                  : 'bg-[#F5F5F0]/[0.04] text-[#F5F5F0]/50 border border-[#F5F5F0]/[0.08]'
              }`}
            >
              {t('typeSell')}
            </button>
            <button
              onClick={() => setListingType('collect')}
              className={`flex-1 rounded-xl py-2.5 text-[13px] font-medium transition-all ${
                listingType === 'collect'
                  ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
                  : 'bg-[#F5F5F0]/[0.04] text-[#F5F5F0]/50 border border-[#F5F5F0]/[0.08]'
              }`}
            >
              {t('typeCollect')}
            </button>
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#F5F5F0]/60">
            {t('photos')}
          </label>
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {imagePreviews.map((preview, idx) => (
              <div
                key={idx}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[#F5F5F0]/[0.08]"
              >
                <img
                  src={preview}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
            {imageFiles.length < 5 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#F5F5F0]/[0.12] text-[#F5F5F0]/30 active:bg-[#F5F5F0]/[0.02]"
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-[10px]">{t('addPhoto')}</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
          <p className="mt-1 text-[10px] text-[#F5F5F0]/30">{t('photoHint')}</p>
        </div>

        {/* Title */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#F5F5F0]/60">
            {t('listingTitle')}
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F5F5F0]/25" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('titlePlaceholder')}
              className="w-full rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] py-3 pl-10 pr-4 text-[14px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/25 focus:border-[#B8D4E3]/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Picker */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#F5F5F0]/60">
            {t('category')}
          </label>
          <button
            onClick={() => setShowCategoryPicker(!showCategoryPicker)}
            className="flex w-full items-center justify-between rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] px-4 py-3 text-[14px]"
          >
            <span className={selectedCategory ? 'text-[#F5F5F0]' : 'text-[#F5F5F0]/25'}>
              {(locale === 'fr' ? selectedCategory?.name_fr : null) || selectedCategory?.name || t('selectCategory')}
            </span>
            <ChevronDown className={`h-4 w-4 text-[#F5F5F0]/30 transition-transform ${showCategoryPicker ? 'rotate-180' : ''}`} />
          </button>
          {showCategoryPicker && (
            <div className="mt-1.5 max-h-48 overflow-y-auto rounded-xl border border-[#F5F5F0]/[0.06] bg-[#0f3d28]">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategoryId(cat.id);
                    setShowCategoryPicker(false);
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] transition-colors ${
                    categoryId === cat.id
                      ? 'bg-[#B8D4E3]/10 text-[#B8D4E3]'
                      : 'text-[#F5F5F0]/70 active:bg-[#F5F5F0]/[0.04]'
                  }`}
                >
                  {cat.icon && <span className="text-[16px]">{cat.icon}</span>}
                  <span>{(locale === 'fr' ? cat.name_fr : null) || cat.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Unit Selector */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#F5F5F0]/60">
            {locale === 'fr' ? "Unité de mesure" : "Unit of measure"}
          </label>
          <button
            onClick={() => setShowUnitPicker(!showUnitPicker)}
            className="flex w-full items-center justify-between rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] px-4 py-3 text-[14px]"
          >
            <span className="text-[#F5F5F0]">
              {UNIT_LABELS[unit][locale === 'fr' ? 'fr' : 'en']}
            </span>
            <ChevronDown className={`h-4 w-4 text-[#F5F5F0]/30 transition-transform ${showUnitPicker ? 'rotate-180' : ''}`} />
          </button>
          {showUnitPicker && (
            <div className="mt-1.5 overflow-hidden rounded-xl border border-[#F5F5F0]/[0.06] bg-[#0f3d28]">
              {UNITS.map((u) => (
                <button
                  key={u}
                  onClick={() => {
                    setUnit(u);
                    setShowUnitPicker(false);
                  }}
                  className={`flex w-full items-center px-4 py-2.5 text-left text-[13px] transition-colors ${
                    unit === u
                      ? 'bg-[#B8D4E3]/10 text-[#B8D4E3]'
                      : 'text-[#F5F5F0]/70 active:bg-[#F5F5F0]/[0.04]'
                  }`}
                >
                  {UNIT_LABELS[u][locale === 'fr' ? 'fr' : 'en']}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quantity & Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-[#F5F5F0]/60">
              {quantityLabel}
            </label>
            <div className="relative">
              <Scale className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F5F5F0]/25" />
              <input
                type="number"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] py-3 pl-10 pr-3 text-[14px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/25 focus:border-[#B8D4E3]/30 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-[#F5F5F0]/60">
              {priceLabel}
            </label>
            <div className="relative">
              <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F5F5F0]/25" />
              <input
                type="number"
                step="0.01"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] py-3 pl-10 pr-3 text-[14px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/25 focus:border-[#B8D4E3]/30 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Transport Price (optional) */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#F5F5F0]/60">
            {locale === 'fr' ? 'Prix du transport (€) — optionnel' : 'Transport price (€) — optional'}
          </label>
          <div className="relative">
            <Truck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F5F5F0]/25" />
            <input
              type="number"
              step="0.01"
              value={transportPrice}
              onChange={(e) => setTransportPrice(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] py-3 pl-10 pr-4 text-[14px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/25 focus:border-[#B8D4E3]/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#F5F5F0]/60">
            {t('location')}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F5F5F0]/25" />
            <input
              type="text"
              value={locationCity}
              onChange={(e) => setLocationCity(e.target.value)}
              placeholder={t('locationPlaceholder')}
              className="w-full rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] py-3 pl-10 pr-4 text-[14px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/25 focus:border-[#B8D4E3]/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#F5F5F0]/60">
            {t('description')}
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-[#F5F5F0]/25" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              rows={4}
              className="w-full resize-none rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] py-3 pl-10 pr-4 text-[14px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/25 focus:border-[#B8D4E3]/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !title.trim() || !categoryId}
          className="w-full rounded-xl bg-[#B8D4E3] py-3.5 text-[14px] font-semibold text-[#0A2F1F] transition-all active:opacity-80 disabled:opacity-40"
        >
          {loading ? t('publishing') : t('publish')}
        </button>
      </div>
    </AppShell>
  );
}

export default function CreateListingPage() {
  return (
    <AuthGuard>
      <CreateListingContent />
    </AuthGuard>
  );
}
