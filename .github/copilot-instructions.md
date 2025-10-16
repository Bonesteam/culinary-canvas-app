# Copilot Instructions for AI Agents

## Project Overview
- This is a Next.js 14 app (App Router) for meal planning, using TypeScript and React.
- The main business logic is in `src/ai/flows/`, with user-facing pages in `src/app/` and UI components in `src/components/`.
- Firebase is used for authentication and Firestore for data storage. Integration code is in `src/firebase/`.

## Key Architectural Patterns
- **AI Meal Plan Generation:**
  - AI meal plans are generated via flows in `src/ai/flows/meal-plan-flow.ts`.
  - User requests trigger Firestore mutations (see `src/firebase/firestore/mutations.ts`).
  - Token-based access: users spend tokens (see `TOKEN_COSTS` in `src/lib/constants.ts`).
- **Component Structure:**
  - UI is modularized: shared UI in `src/components/ui/`, meal plan forms in `src/components/meal-plans/`.
  - Page-level logic is in `src/app/` (e.g., `src/app/meal-plans/page.tsx`).
- **Context & State:**
  - Currency and user context in `src/context/`.
  - Toast notifications via `src/hooks/use-toast.ts`.

## Developer Workflows
- **Start Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Format:** `npm run format` (if configured)
- **Firebase Emulation:** Use the Firebase CLI for local testing if needed.

## Project-Specific Conventions
- **Token Costs:**
  - Use `TOKEN_COSTS` from `src/lib/constants.ts` for all token logic. There is no `AI_PLAN_COST` export—use `TOKEN_COSTS.AI_PLAN_BASE` and related fields.
- **Firestore Mutations:**
  - `recordMealPlanOrder` requires 6 arguments: `(db, userId, type, cost, details, content)`.
  - Always provide all required arguments when calling Firestore mutation functions.
- **Imports:**
  - Use `@/` alias for imports from `src/`.
- **Error Handling:**
  - Use toast notifications for user-facing errors.

## Integration Points
- **AI Flows:** `src/ai/flows/`
- **Firebase:** `src/firebase/`
- **UI Components:** `src/components/ui/`
- **Constants:** `src/lib/constants.ts`

## Examples
- To deduct tokens for an AI plan, use:
  ```ts
  const cost = TOKEN_COSTS.AI_PLAN_BASE;
  await recordMealPlanOrder(db, userId, 'AI Plan', cost, details, content);
  ```
- For new UI, follow the structure in `src/components/ui/` and use existing primitives.

---

For more, see `README.md` and explore the `src/` directory for patterns.
