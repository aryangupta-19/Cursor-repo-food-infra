import { internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function getCoordinatesFromLocation(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(location)}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "FoodConnect/1.0 (food redistribution hackathon project)",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return { latitude: undefined, longitude: undefined };
  }

  const results = await response.json();
  const firstResult = results[0];

  if (!firstResult) {
    return { latitude: undefined, longitude: undefined };
  }

  return {
    latitude: Number(firstResult.lat),
    longitude: Number(firstResult.lon),
  };
}

export const createFood = internalMutation({
  args: {
    foodName: v.string(),
    quantity: v.string(),
    expiryTime: v.number(),
    location: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("foods", {
      ...args,
      createdAt: Date.now(),
      claimedBy: "",
    });
  },
});

// ➕ Add Food with location geocoding
export const addFood = action({
  args: {
    foodName: v.string(),
    quantity: v.string(),
    expiryTime: v.number(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const { latitude, longitude } = await getCoordinatesFromLocation(args.location);

    return await ctx.runMutation(internal.food.createFood, {
      ...args,
      latitude,
      longitude,
    });
  },
});

// 📋 Get Foods
export const getFoods = query({
  handler: async (ctx) => {
    const foods = await ctx.db.query("foods").collect();
    return foods.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// ✅ Claim Food
export const claimFood = mutation({
  args: {
    id: v.id("foods"),
  },
  handler: async (ctx, args) => {
    const existingFood = await ctx.db.get(args.id);

    if (!existingFood || existingFood.claimedBy) {
      return { success: false };
    }

    await ctx.db.patch(args.id, {
      claimedBy: "claimed",
    });

    return { success: true };
  },
});
