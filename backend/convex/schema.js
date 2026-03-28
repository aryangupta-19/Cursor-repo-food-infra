import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  foods: defineTable({
    foodName: v.string(),
    quantity: v.string(),
    expiryTime: v.union(v.number(), v.string()),
    location: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    createdAt: v.number(),
    claimedBy: v.string(),
  }),
});
