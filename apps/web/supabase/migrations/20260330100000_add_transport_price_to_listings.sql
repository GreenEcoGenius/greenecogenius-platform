-- Add transport_price column for collection listings
ALTER TABLE public.listings
ADD COLUMN transport_price numeric CHECK (transport_price >= 0);

-- Update listing_type check to remove 'buy' option
ALTER TABLE public.listings
DROP CONSTRAINT IF EXISTS listings_listing_type_check;

ALTER TABLE public.listings
ADD CONSTRAINT listings_listing_type_check CHECK (listing_type IN ('sell', 'collect'));

-- Update existing 'buy' listings to 'sell'
UPDATE public.listings SET listing_type = 'sell' WHERE listing_type = 'buy';
