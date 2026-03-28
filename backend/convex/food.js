import { internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

function getFallbackEstimatedPeopleServed(quantity) {
  const amount = getQuantityKgValue(quantity);

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
  const amount = getQuantityKgValue(quantity);
  const expiryWeight =
    expiryTime <= 2 ? 0.95 : expiryTime <= 6 ? 0.7 : expiryTime <= 12 ? 0.5 : 0.3;
  const quantityWeight = Math.min(amount / 25, 1);

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

function getExpiryHours(expiryTime) {
  if (typeof expiryTime === "number") {
    return expiryTime;
  }

  const match = String(expiryTime).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function getQuantityKgValue(quantity) {
  if (typeof quantity === "number") {
    return quantity > 0 ? quantity : 1;
  }

  const match = String(quantity).match(/(\d+(\.\d+)?)/);
  const amount = match ? Number(match[0]) : 1;
  return amount > 0 ? amount : 1;
}

function getTravelTime(ngoRegion, foodLocation) {
  if (
    ngoRegion &&
    ngoRegion.trim().toLowerCase() === foodLocation.trim().toLowerCase()
  ) {
    return 30;
  }

  return 120;
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(start, end) {
  if (
    !start ||
    !end ||
    typeof start.lat !== "number" ||
    typeof start.lng !== "number" ||
    typeof end.lat !== "number" ||
    typeof end.lng !== "number"
  ) {
    return null;
  }

  const earthRadiusKm = 6371;
  const dLat = toRadians(end.lat - start.lat);
  const dLng = toRadians(end.lng - start.lng);
  const lat1 = toRadians(start.lat);
  const lat2 = toRadians(end.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function getEstimatedTravelTime({
  viewerRegion,
  foodLocation,
  viewerCoordinates,
  foodCoordinates,
}) {
  const distanceKm = getDistanceKm(viewerCoordinates, foodCoordinates);

  if (distanceKm !== null) {
    const assumedCitySpeedKmPerHour = 22;
    const travelMinutes = Math.round((distanceKm / assumedCitySpeedKmPerHour) * 60);
    return Math.max(travelMinutes, 10);
  }

  if (viewerRegion) {
    return getTravelTime(viewerRegion, foodLocation);
  }

  return undefined;
}

const SAMPLE_DEMO_FOODS = [
  { foodName: "Cooked Rice Packs", quantity: 8, expiryTime: 3, location: "Delhi", coordinates: { lat: 28.6139, lng: 77.209 } },
  { foodName: "Chapati Meal Boxes", quantity: 12, expiryTime: 5, location: "Delhi", coordinates: { lat: 28.6139, lng: 77.209 } },
  { foodName: "Vegetable Pulao", quantity: 6, expiryTime: 2, location: "Delhi", coordinates: { lat: 28.6139, lng: 77.209 } },
  { foodName: "Bread and Curry Trays", quantity: 10, expiryTime: 4, location: "Delhi", coordinates: { lat: 28.6139, lng: 77.209 } },
  { foodName: "Fruit Donation Crates", quantity: 14, expiryTime: 8, location: "Delhi", coordinates: { lat: 28.6139, lng: 77.209 } },
  { foodName: "Masala Khichdi", quantity: 7, expiryTime: 3, location: "Mumbai", coordinates: { lat: 19.076, lng: 72.8777 } },
  { foodName: "Bakery Bread Loaves", quantity: 5, expiryTime: 2, location: "Mumbai", coordinates: { lat: 19.076, lng: 72.8777 } },
  { foodName: "Veg Biryani Pots", quantity: 11, expiryTime: 6, location: "Mumbai", coordinates: { lat: 19.076, lng: 72.8777 } },
  { foodName: "Mixed Vegetable Curry", quantity: 9, expiryTime: 4, location: "Mumbai", coordinates: { lat: 19.076, lng: 72.8777 } },
  { foodName: "Banana and Apple Boxes", quantity: 13, expiryTime: 7, location: "Mumbai", coordinates: { lat: 19.076, lng: 72.8777 } },
  { foodName: "Lemon Rice Containers", quantity: 6, expiryTime: 3, location: "Bengaluru", coordinates: { lat: 12.9716, lng: 77.5946 } },
  { foodName: "Idli Batter Meals", quantity: 8, expiryTime: 5, location: "Bengaluru", coordinates: { lat: 12.9716, lng: 77.5946 } },
  { foodName: "Sambar Rice Buckets", quantity: 10, expiryTime: 4, location: "Bengaluru", coordinates: { lat: 12.9716, lng: 77.5946 } },
  { foodName: "Curd Rice Tubs", quantity: 7, expiryTime: 2, location: "Bengaluru", coordinates: { lat: 12.9716, lng: 77.5946 } },
  { foodName: "Breakfast Snack Packs", quantity: 4, expiryTime: 1, location: "Bengaluru", coordinates: { lat: 12.9716, lng: 77.5946 } },
  { foodName: "Dal Khichdi Buckets", quantity: 9, expiryTime: 4, location: "Hyderabad", coordinates: { lat: 17.385, lng: 78.4867 } },
  { foodName: "Veg Fried Rice", quantity: 11, expiryTime: 5, location: "Hyderabad", coordinates: { lat: 17.385, lng: 78.4867 } },
  { foodName: "Thepla and Sabzi Packs", quantity: 6, expiryTime: 3, location: "Hyderabad", coordinates: { lat: 17.385, lng: 78.4867 } },
  { foodName: "Mini Meal Trays", quantity: 12, expiryTime: 6, location: "Hyderabad", coordinates: { lat: 17.385, lng: 78.4867 } },
  { foodName: "Fresh Bakery Buns", quantity: 5, expiryTime: 2, location: "Hyderabad", coordinates: { lat: 17.385, lng: 78.4867 } },
  { foodName: "Pongal Pots", quantity: 8, expiryTime: 3, location: "Chennai", coordinates: { lat: 13.0827, lng: 80.2707 } },
  { foodName: "Curd Rice Meal Boxes", quantity: 9, expiryTime: 5, location: "Chennai", coordinates: { lat: 13.0827, lng: 80.2707 } },
  { foodName: "Upma Breakfast Batches", quantity: 6, expiryTime: 2, location: "Chennai", coordinates: { lat: 13.0827, lng: 80.2707 } },
  { foodName: "Vegetable Kurma Trays", quantity: 10, expiryTime: 4, location: "Chennai", coordinates: { lat: 13.0827, lng: 80.2707 } },
  { foodName: "Seasonal Fruit Baskets", quantity: 15, expiryTime: 9, location: "Chennai", coordinates: { lat: 13.0827, lng: 80.2707 } },
  { foodName: "Poha Donation Packs", quantity: 7, expiryTime: 2, location: "Pune", coordinates: { lat: 18.5204, lng: 73.8567 } },
  { foodName: "Veg Pulao Trays", quantity: 10, expiryTime: 4, location: "Pune", coordinates: { lat: 18.5204, lng: 73.8567 } },
  { foodName: "Roti and Dal Combo", quantity: 11, expiryTime: 5, location: "Pune", coordinates: { lat: 18.5204, lng: 73.8567 } },
  { foodName: "Sandwich Snack Packs", quantity: 5, expiryTime: 1, location: "Pune", coordinates: { lat: 18.5204, lng: 73.8567 } },
  { foodName: "Cooked Sabzi Containers", quantity: 8, expiryTime: 3, location: "Pune", coordinates: { lat: 18.5204, lng: 73.8567 } },
  { foodName: "Veg Chowmein Boxes", quantity: 9, expiryTime: 4, location: "Kolkata", coordinates: { lat: 22.5726, lng: 88.3639 } },
  { foodName: "Rice and Dal Pots", quantity: 12, expiryTime: 6, location: "Kolkata", coordinates: { lat: 22.5726, lng: 88.3639 } },
  { foodName: "Bread Butter Packs", quantity: 4, expiryTime: 1, location: "Kolkata", coordinates: { lat: 22.5726, lng: 88.3639 } },
  { foodName: "Mixed Veg Meal Kits", quantity: 10, expiryTime: 5, location: "Kolkata", coordinates: { lat: 22.5726, lng: 88.3639 } },
  { foodName: "Festival Sweets Boxes", quantity: 6, expiryTime: 7, location: "Kolkata", coordinates: { lat: 22.5726, lng: 88.3639 } },
];

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
    quantity: v.number(),
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

export const seedSampleFoods = mutation({
  handler: async (ctx) => {
    const existingFoods = await ctx.db.query("foods").collect();
    const existingKeys = new Set(
      existingFoods.map((food) => `${food.foodName.toLowerCase()}|${food.location.toLowerCase()}`),
    );
    const now = Date.now();
    let inserted = 0;

    for (let index = 0; index < SAMPLE_DEMO_FOODS.length; index += 1) {
      const item = SAMPLE_DEMO_FOODS[index];
      const key = `${item.foodName.toLowerCase()}|${item.location.toLowerCase()}`;

      if (existingKeys.has(key)) {
        continue;
      }

      const aiUrgencyLevel = getFallbackUrgency(item.expiryTime);

      await ctx.db.insert("foods", {
        foodName: item.foodName,
        quantity: item.quantity,
        expiryTime: item.expiryTime,
        location: item.location,
        coordinates: item.coordinates,
        latitude: item.coordinates.lat,
        longitude: item.coordinates.lng,
        aiUrgencyLevel,
        aiEstimatedPeopleServed: getFallbackEstimatedPeopleServed(item.quantity),
        aiSuggestedAction: getFallbackSuggestedAction(aiUrgencyLevel),
        priorityScore: getFallbackPriorityScore(item.expiryTime, item.quantity),
        estimatedDeliverable: getFallbackEstimatedDeliverable(item.expiryTime),
        recommendedNGOs: getFallbackRecommendedNGOs(item.foodName, aiUrgencyLevel),
        claimedBy: "",
        createdAt: now - index * 7 * 60 * 1000,
      });

      existingKeys.add(key);
      inserted += 1;
    }

    return {
      inserted,
      totalSeedItems: SAMPLE_DEMO_FOODS.length,
    };
  },
});

// ➕ Add Food with location geocoding
export const addFood = action({
  args: {
    sessionToken: v.string(),
    foodName: v.string(),
    quantity: v.number(),
    expiryTime: v.number(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.auth.getUserFromSession, {
      token: args.sessionToken,
    });

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { latitude, longitude } = await getCoordinatesFromLocation(args.location);
    const aiInsights = await generateAIInsights({
      foodName: args.foodName,
      quantity: args.quantity,
      expiryTime: args.expiryTime,
      location: args.location,
    });
    const coordinates =
      latitude !== undefined && longitude !== undefined
        ? { lat: latitude, lng: longitude }
        : undefined;

    const foodId = await ctx.runMutation(internal.food.createFood, {
      foodName: args.foodName,
      quantity: args.quantity,
      expiryTime: args.expiryTime,
      location: args.location,
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

export const getFoodById = query({
  args: {
    id: v.id("foods"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getAIOptimizedFoods = query({
  args: {
    viewerRegion: v.optional(v.string()),
    viewerLatitude: v.optional(v.number()),
    viewerLongitude: v.optional(v.number()),
    filterRegion: v.optional(v.string()),
    ngoType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const normalizedViewerRegion = args.viewerRegion?.trim().toLowerCase();
    const normalizedFilterRegion = args.filterRegion?.trim().toLowerCase();
    const normalizedNgoType = args.ngoType?.trim().toLowerCase();
    const foods = await ctx.db.query("foods").collect();

    return foods
      .filter((food) => {
        const matchesRegion =
          !normalizedFilterRegion ||
          food.location.toLowerCase().includes(normalizedFilterRegion);
        const matchesNgoType =
          !normalizedNgoType ||
          (food.recommendedNGOs ?? []).some((ngo) =>
            ngo.toLowerCase().includes(normalizedNgoType),
          );

        return matchesRegion && matchesNgoType;
      })
      .map((food) => {
        const expiryHours = getExpiryHours(food.expiryTime);
        const travelTime = getEstimatedTravelTime({
          viewerRegion: args.viewerRegion,
          foodLocation: food.location,
          viewerCoordinates:
            typeof args.viewerLatitude === "number" &&
            typeof args.viewerLongitude === "number"
              ? { lat: args.viewerLatitude, lng: args.viewerLongitude }
              : null,
          foodCoordinates:
            typeof food.coordinates?.lat === "number" &&
            typeof food.coordinates?.lng === "number"
              ? food.coordinates
              : typeof food.latitude === "number" && typeof food.longitude === "number"
                ? { lat: food.latitude, lng: food.longitude }
                : null,
        });
        const canReachInTime = travelTime <= expiryHours * 60;
        const hasCloseNgo = travelTime === 30;
        const hasLongExpiry = expiryHours >= 6;

        return {
          ...food,
          estimatedDeliverable:
            travelTime === undefined ? food.estimatedDeliverable : canReachInTime,
          recommendedNGOs:
            travelTime === undefined
              ? food.recommendedNGOs ?? []
              : canReachInTime
                ? food.recommendedNGOs ?? []
                : [],
          aiUrgencyLevel:
            canReachInTime && hasCloseNgo && hasLongExpiry
              ? "high"
              : food.aiUrgencyLevel,
          priorityScore:
            canReachInTime && hasCloseNgo && hasLongExpiry
              ? Math.max(food.priorityScore ?? 0, 85)
              : food.priorityScore,
        };
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

export const searchNearbyOrganizations = action({
  args: {
    sessionToken: v.string(),
    foodName: v.string(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.auth.getUserFromSession, {
      token: args.sessionToken,
    });

    if (!user) {
      throw new Error("Unauthorized");
    }

    const exaApiKey = process.env.EXA_API_KEY;

    if (!exaApiKey) {
      return {
        success: false,
        message: "EXA_API_KEY is not configured.",
        organizations: [],
      };
    }

    const queryText =
      `${args.location} NGOs, food banks, shelters, community kitchens, hunger relief organizations ` +
      `that could accept surplus ${args.foodName}`;

    const response = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": exaApiKey,
      },
      body: JSON.stringify({
        query: queryText,
        type: "auto",
        numResults: 5,
        contents: {
          highlights: {
            maxCharacters: 400,
          },
        },
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Could not fetch nearby organizations right now.",
        organizations: [],
      };
    }

    const data = await response.json();
    const organizations = Array.isArray(data.results)
      ? data.results.map((result) => ({
          title: result.title ?? "Untitled organization",
          url: result.url ?? "",
          snippet:
            Array.isArray(result.highlights) && result.highlights.length
              ? result.highlights[0]
              : "Relevant organization found for this location.",
        }))
      : [];

    return {
      success: true,
      organizations,
    };
  },
});

// ✅ Claim Food
export const claimFood = mutation({
  args: {
    id: v.id("foods"),
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.auth.getUserFromSession, {
      token: args.sessionToken,
    });

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const existingFood = await ctx.db.get(args.id);

    if (!existingFood || existingFood.claimedBy) {
      return { success: false, message: "Food already claimed or missing" };
    }

    await ctx.db.patch(args.id, {
      claimedBy: user.email,
    });

    return { success: true, message: "Food claimed successfully" };
  },
});
