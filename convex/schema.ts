import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    habits: defineTable({
        userId: v.string(),
        title: v.string(),
        notes: v.optional(v.string()),
        startDate: v.optional(v.number()),
        streak: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),

    }).index("by_user", ["userId"]),


    messages: defineTable({
        userId: v.string(),
        title: v.optional(v.string()),
        body: v.optional(v.string()),
        preview: v.optional(v.string()),
        createdAt: v.number(),
  }).index("by_user", ["userId"]),
});