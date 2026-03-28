import { internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

function getFallbackEstimatedPeopleServed(quantity) {
  const match = quantity.match(/\d+/);
  const amount = match ? Number(match[0]) : 1;

  if (amount <= 5) return 5;
  if (amount <= 15) return 12;
  if (amount <= 30) return 25;
  if (amount <= 60) return 45;

  return 80;
}

function getFallbackUrgency(expiryTime) {
  if (expiryTime <= 2) return "high";
  if (expiryTime <= 6) return "medium";
  return "low";
}

function getFallbackSuggestedAction(urgencyLevel) {
  if (urgencyLevel === "high") {
    return "Dispatch the nearest volunteer immediately and notify nearby NGOs.";
  }

  if (urgencyLevel === "medium") {
    return "Bundle this with the next nearby pickup and share it with local partners.";
  }

  return "Keep this listed for local organizations and plan a coordinated pickup.";
}

function getFallbackPriorityScore(expiryTime, quantity) {
  const quantityMatch = quantity.match(/\d+/);
  const amount = quantityMatch ? Number(quantityMatch[0]) : 1;
  const expiryWeight =
    expiryTime <= 2 ? 0.95 : expiryTime <= 6 ? 0.7 : expiryTime <= 12 ? 0.5 : 0.3;
  const quantityWeight = Math.min(amount / 50, 1);

  return Math.round((expiryWeight * 0.7 + quantityWeight * 0.3) * 100);
}

function getFallbackEstimatedDeliverable(expiryTime) {
  return expiryTime * 60 >= 120;
}

function getFallbackRecommendedNGOs(foodName, urgencyLevel) {
  const normalizedFoodName = foodName.toLowerCase();

  if (normalizedFoodName.includes("bread") || normalizedFoodName.includes("bakery")) {
    return urgencyLevel === "high"
      ? ["Community Fridge", "Night Shelter", "Street Outreach Kitchen"]
      : ["Community Pantry", "Neighborhood Shelter", "Youth Center"];
  }

  if (
    normalizedFoodName.includes("rice") ||
    normalizedFoodName.includes("meal") ||
    normalizedFoodName.includes("lunch")
  ) {
    return urgencyLevel === "high"
      ? ["Homeless Shelter", "Community Kitchen", "Disaster Relief Van"]
      : ["School Meal NGO", "Community Kitchen", "Family Support Center"];
  }

  return urgencyLevel === "high"
    ? ["Community Kitchen", "Night Shelter", "Emergency Food Van"]
    : ["Community Pantry", "NGO Food Bank", "Local Shelter"];
}

async function generateAIInsights(food) {
  const fallbackUrgencyLevel = getFallbackUrgency(food.expiryTime);
  const fallbackEstimatedPeopleServed = getFallbackEstimatedPeopleServed(
    food.quantity,
  );
  const fallbackSuggestedAction = getFallbackSuggestedAction(
    fallbackUrgencyLevel,
  );
  const fallbackPriorityScore = getFallbackPriorityScore(
    food.expiryTime,
    food.quantity,
  );
  const fallbackEstimatedDeliverable = getFallbackEstimatedDeliverable(
    food.expiryTime,
  );
  const fallbackRecommendedNGOs = getFallbackRecommendedNGOs(
    food.foodName,
    fallbackUrgencyLevel,
  );
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      aiUrgencyLevel: fallbackUrgencyLevel,
      aiEstimatedPeopleServed: fallbackEstimatedPeopleServed,
      aiSuggestedAction: fallbackSuggestedAction,
      priorityScore: fallbackPriorityScore,
      estimatedDeliverable: fallbackEstimatedDeliverable,
      recommendedNGOs: fallbackRecommendedNGOs,
    };
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are ranking food redistribution opportunities for NGOs. " +
                "Use expiry time, quantity, and simple delivery urgency rules to enrich the food item. " +
                "Assume same-city delivery can happen in 30 minutes and nearby-city delivery in 120 minutes. " +
                "Return strict JSON with keys: urgencyLevel, estimatedPeopleServed, suggestedAction, priorityScore, estimatedDeliverable, recommendedNGOs. " +
                "urgencyLevel must be one of: high, medium, low. " +
                "estimatedPeopleServed must be an integer. " +
                "suggestedAction must be one short sentence. " +
                "priorityScore must be an integer from 0 to 100. " +
                "estimatedDeliverable must be true or false. " +
                "recommendedNGOs must be an array of 3 short NGO categories or recipient suggestions.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify({
                foodName: food.foodName,
                quantity: food.quantity,
                expiryTimeHours: food.expiryTime,
                location: food.location,
              }),
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    return {
      aiUrgencyLevel: fallbackUrgencyLevel,
      aiEstimatedPeopleServed: fallbackEstimatedPeopleServed,
      aiSuggestedAction: fallbackSuggestedAction,
      priorityScore: fallbackPriorityScore,
      estimatedDeliverable: fallbackEstimatedDeliverable,
      recommendedNGOs: fallbackRecommendedNGOs,
    };
  }

  const data = await response.json();
  const rawOutput = data.output_text;

  if (!rawOutput) {
    return {
      aiUrgencyLevel: fallbackUrgencyLevel,
      aiEstimatedPeopleServed: fallbackEstimatedPeopleServed,
      aiSuggestedAction: fallbackSuggestedAction,
      priorityScore: fallbackPriorityScore,
      estimatedDeliverable: fallbackEstimatedDeliverable,
      recommendedNGOs: fallbackRecommendedNGOs,
    };
  }

  try {
    const parsed = JSON.parse(rawOutput);

    return {
      aiUrgencyLevel:
        parsed.urgencyLevel === "high" ||
        parsed.urgencyLevel === "medium" ||
        parsed.urgencyLevel === "low"
          ? parsed.urgencyLevel
          : fallbackUrgencyLevel,
      aiEstimatedPeopleServed: Number.isFinite(parsed.estimatedPeopleServed)
        ? parsed.estimatedPeopleServed
        : fallbackEstimatedPeopleServed,
      aiSuggestedAction:
        typeof parsed.suggestedAction === "string" &&
        parsed.suggestedAction.trim()
          ? parsed.suggestedAction.trim()
          : fallbackSuggestedAction,
      priorityScore:
        Number.isFinite(parsed.priorityScore) &&
        parsed.priorityScore >= 0 &&
        parsed.priorityScore <= 100
          ? Math.round(parsed.priorityScore)
          : fallbackPriorityScore,
      estimatedDeliverable:
        typeof parsed.estimatedDeliverable === "boolean"
          ? parsed.estimatedDeliverable
          : fallbackEstimatedDeliverable,
      recommendedNGOs:
        Array.isArray(parsed.recommendedNGOs) &&
        parsed.recommendedNGOs.length > 0
          ? parsed.recommendedNGOs
              .filter((item) => typeof item === "string" && item.trim())
              .slice(0, 3)
          : fallbackRecommendedNGOs,
    };
  } catch {
    return {
      aiUrgencyLevel: fallbackUrgencyLevel,
      aiEstimatedPeopleServed: fallbackEstimatedPeopleServed,
      aiSuggestedAction: fallbackSuggestedAction,
      priorityScore: fallbackPriorityScore,
      estimatedDeliverable: fallbackEstimatedDeliverable,
      recommendedNGOs: fallbackRecommendedNGOs,
    };
  }
}

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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("foods", {
      ...args,
      createdAt: Date.now(),
      claimedBy: "",
    });
  },
});

export const createAlert = internalMutation({
  args: {
    foodId: v.id("foods"),
    message: v.string(),
    priorityScore: v.number(),
    channels: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("alerts", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
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
    const aiInsights = await generateAIInsights(args);
    const coordinates =
      latitude !== undefined && longitude !== undefined
        ? { lat: latitude, lng: longitude }
        : undefined;

    const foodId = await ctx.runMutation(internal.food.createFood, {
      ...args,
      coordinates,
      latitude,
      longitude,
      ...aiInsights,
    });

    if ((aiInsights.priorityScore ?? 0) > 80) {
      await ctx.runMutation(internal.food.createAlert, {
        foodId,
        message: `Urgent food available: ${args.foodName} in ${args.location}`,
        priorityScore: aiInsights.priorityScore ?? 0,
        channels: ["email", "sms", "push"],
      });
    }

    return foodId;
  },
});

// 📋 Get Foods
export const getFoods = query({
  handler: async (ctx) => {
    const foods = await ctx.db.query("foods").collect();
    return foods.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getAIOptimizedFoods = query({
  args: {
    region: v.optional(v.string()),
    ngoType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const normalizedRegion = args.region?.trim().toLowerCase();
    const normalizedNgoType = args.ngoType?.trim().toLowerCase();
    const foods = await ctx.db.query("foods").collect();

    return foods
      .filter((food) => {
        if (food.claimedBy) {
          return false;
        }

        const matchesRegion =
          !normalizedRegion ||
          food.location.toLowerCase().includes(normalizedRegion);
        const matchesNgoType =
          !normalizedNgoType ||
          (food.recommendedNGOs ?? []).some((ngo) =>
            ngo.toLowerCase().includes(normalizedNgoType),
          );

        return matchesRegion && matchesNgoType;
      })
      .sort((a, b) => {
        const scoreA = a.priorityScore ?? 0;
        const scoreB = b.priorityScore ?? 0;

        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }

        return b.createdAt - a.createdAt;
      });
  },
});

export const getUrgentAlerts = query({
  handler: async (ctx) => {
    const alerts = await ctx.db.query("alerts").collect();

    return alerts
      .filter((alert) => alert.priorityScore > 80)
      .sort((a, b) => b.createdAt - a.createdAt);
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
