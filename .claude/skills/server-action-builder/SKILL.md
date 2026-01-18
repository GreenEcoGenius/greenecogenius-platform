---
name: server-action-builder
description: Create Next.js Server Actions with enhanceAction, Zod validation, and service patterns. Use when implementing mutations, form submissions, or API operations that need authentication and validation. Invoke with /server-action-builder.
---

# Server Action Builder

You are an expert at creating type-safe server actions for Makerkit following established patterns.

## Workflow

When asked to create a server action, follow these steps:

### Step 1: Create Zod Schema

Create validation schema in `_lib/schemas/`:

```typescript
// _lib/schemas/feature.schema.ts
import { z } from 'zod';

export const CreateFeatureSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  accountId: z.string().uuid('Invalid account ID'),
});

export type CreateFeatureInput = z.infer<typeof CreateFeatureSchema>;
```

### Step 2: Create Service Layer

Create service in `_lib/server/`:

```typescript
// _lib/server/feature.service.ts
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { CreateFeatureInput } from '../schemas/feature.schema';

export function createFeatureService() {
  return new FeatureService();
}

class FeatureService {
  async create(data: CreateFeatureInput) {
    const client = getSupabaseServerClient();

    const { data: result, error } = await client
      .from('features')
      .insert({
        name: data.name,
        account_id: data.accountId,
      })
      .select()
      .single();

    if (error) throw error;

    return result;
  }
}
```

### Step 3: Create Server Action

Create action in `_lib/server/server-actions.ts`:

```typescript
'use server';

import { enhanceAction } from '@kit/next/actions';
import { getLogger } from '@kit/shared/logger';
import { revalidatePath } from 'next/cache';

import { CreateFeatureSchema } from '../schemas/feature.schema';
import { createFeatureService } from './feature.service';

export const createFeatureAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const ctx = { name: 'create-feature', userId: user.id };

    logger.info(ctx, 'Creating feature');

    const service = createFeatureService();
    const result = await service.create(data);

    logger.info({ ...ctx, featureId: result.id }, 'Feature created');

    revalidatePath('/home/[account]/features');

    return { success: true, data: result };
  },
  {
    auth: true,
    schema: CreateFeatureSchema,
  },
);
```

## Key Patterns

1. **Schema in separate file** - Reusable between client and server
2. **Service layer** - Business logic isolated from action
3. **Logging** - Always log before and after operations
4. **Revalidation** - Use `revalidatePath` after mutations
5. **Trust RLS** - Don't add manual auth checks (RLS handles it)

## File Structure

```
feature/
├── _lib/
│   ├── schemas/
│   │   └── feature.schema.ts
│   └── server/
│       ├── feature.service.ts
│       └── server-actions.ts
└── _components/
    └── feature-form.tsx
```

## Reference Files

See examples in:
- `[Examples](examples.md)`
- `[Reference](reference.md)`
