/**
 * Frontend-local copy of Convex's generated `api` utility.
 *
 * This keeps the Vercel build self-contained when the project root is `frontend`.
 * Regenerate from backend/convex/_generated/api.js if your Convex function names change.
 */

import { anyApi, componentsGeneric } from "convex/server";

export const api = anyApi;
export const internal = anyApi;
export const components = componentsGeneric();
