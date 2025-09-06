import {mutation, query} from "./_generated/server";
import { v } from "convex/values";

export const createHabit = mutation({
  args: {
    title: v.string(),
    startdate: v.number(),
  },
  handler: async (ctx, { title, startdate }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const now = Date.now();
    await ctx.db.insert("habits", {
      userId: identity.subject,
      title,
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

export const numOfHabits = query({
  args: {userId: v.string()},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    } 

    const cursor = ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject));
    const count = await cursor.collect();
    return count.length;

  }});

  export const incrementStreak = mutation({
    args: { habitId: v.id("habits") },
    handler: async (ctx, { habitId }) => {
      const habit = await ctx.db.get(habitId);  
      if (!habit) {
        throw new Error("Habit not found");
      }   
    
      const newStreak = (habit.streak ?? 0) + 1;
      await ctx.db.patch(habitId, {                          
      streak: newStreak,
      updatedAt: Date.now(),
    });
      return newStreak;
    } 
  });

  export const decrementStreak = mutation({
    args: { habitId: v.id("habits") },
    handler: async (ctx, { habitId }) => {
      const habit = await ctx.db.get(habitId);  
      if (!habit) {
        throw new Error("Habit not found");
      }   
    
      const newStreak = (habit.streak ?? 0) - 1;
      await ctx.db.patch(habitId, {
      streak: newStreak,
      updatedAt: Date.now(),
    });
      return newStreak;
    } 
  });

 