import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  foods: defineTable({
    foodName: v.string(),
    quantity: v.string(),
    expiryTime: v.union(v.number(), v.string()),
    location: v.string(),
    coordinates: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      }),
    ),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    aiUrgencyLevel: v.optional(v.string()),
    aiEstimatedPeopleServed: v.optional(v.number()),
    aiSuggestedAction: v.optional(v.string()),
    priorityScore: v.optional(v.number()),
    estimatedDeliverable: v.optional(v.boolean()),
    recommendedNGOs: v.optional(v.array(v.string())),
    createdAt: v.number(),
    claimedBy: v.string(),
  }),
  alerts: defineTable({
    foodId: v.id("foods"),
    message: v.string(),
    priorityScore: v.number(),
    channels: v.array(v.string()),
    status: v.string(),
    createdAt: v.number(),
  }),
});
