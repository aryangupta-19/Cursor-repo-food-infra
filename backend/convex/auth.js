import { internal } from "./_generated/api";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export const findUserByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    return users.find(
      (user) => user.email.toLowerCase() === args.email.toLowerCase(),
    ) ?? null;
  },
});

export const createUser = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    location: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateUserLocation = internalMutation({
  args: {
    userId: v.id("users"),
    location: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      location: args.location,
      latitude: args.latitude,
      longitude: args.longitude,
    });
  },
});

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

export const createSession = internalMutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const deleteSession = internalMutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db.query("sessions").collect();
    const matchingSession = sessions.find((session) => session.token === args.token);

    if (!matchingSession) {
      return null;
    }

    await ctx.db.delete(matchingSession._id);
    return matchingSession._id;
  },
});

export const findSessionByToken = internalQuery({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db.query("sessions").collect();
    return sessions.find((session) => session.token === args.token) ?? null;
  },
});

export const getUserFromSession = internalQuery({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db.query("sessions").collect();
    const session = sessions.find((entry) => entry.token === args.token);

    if (!session) {
      return null;
    }

    return await ctx.db.get(session.userId);
  },
});

export const signup = action({
  args: {
    name: v.string(),
    email: v.string(),
    location: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const location = args.location.trim();
    const { latitude, longitude } = await getCoordinatesFromLocation(location);
    const existingUser = await ctx.runQuery(internal.auth.findUserByEmail, {
      email,
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const passwordHash = await hashPassword(args.password);
    const userId = await ctx.runMutation(internal.auth.createUser, {
      name: args.name.trim(),
      email,
      location,
      latitude,
      longitude,
      passwordHash,
    });
    const sessionToken = crypto.randomUUID();
    await ctx.runMutation(internal.auth.createSession, {
      userId,
      token: sessionToken,
    });

    return {
      success: true,
      user: {
        _id: userId,
        name: args.name.trim(),
        email,
        location,
        latitude,
        longitude,
      },
      sessionToken,
    };
  },
});

export const login = action({
  args: {
    email: v.string(),
    location: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const location = args.location.trim();
    const { latitude, longitude } = await getCoordinatesFromLocation(location);
    const user = await ctx.runQuery(internal.auth.findUserByEmail, {
      email,
    });

    if (!user) {
      return {
        success: false,
        message: "No account found with this email.",
      };
    }

    const passwordHash = await hashPassword(args.password);

    if (user.passwordHash !== passwordHash) {
      return {
        success: false,
        message: "Incorrect password.",
      };
    }

    await ctx.runMutation(internal.auth.updateUserLocation, {
      userId: user._id,
      location,
      latitude,
      longitude,
    });

    const sessionToken = crypto.randomUUID();
    await ctx.runMutation(internal.auth.createSession, {
      userId: user._id,
      token: sessionToken,
    });

    return {
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        location,
        latitude,
        longitude,
      },
      sessionToken,
    };
  },
});

export const logout = action({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.auth.deleteSession, {
      token: args.sessionToken,
    });

    return { success: true };
  },
});
