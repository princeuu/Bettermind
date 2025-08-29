import {mutation, query} from "./_generated/server";
import { v } from "convex/values";

export const createHabit = mutation({
  args: {
    title: v.string(),
    notes: v.string(),
    startdate: v.number(),
  },
  handler: async (ctx, { title, notes, startdate }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const now = Date.now();
    await ctx.db.insert("habits", {
      userId: identity.subject,
      title,
      notes,
      startDate: startdate ?? now,
      streak: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const deleteHabit = mutation({
  args: { habitId: v.id("habits") },
  handler: async (ctx, { habitId }) => { 
    await ctx.db.delete(habitId);
    return"Deleted";
  },
});   

export const getHabitsForCurrentUser = query({
  args: {}, 
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const rows = await ctx.db
    .query("habits")
    .withIndex("by_user", (q) => q.eq(("userId"), identity.subject))
    .collect();
    return rows
    .sort((a, b) => b.createdAt - a.createdAt);
  },
});