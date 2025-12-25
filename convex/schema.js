import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
  }),
  workspace: defineTable({
    messages: v.any(),
    fileData: v.optional(v.any()),
    user: v.id("users"), //  expects Convex _id
  }),
  leetcodeRevisions: defineTable({
    link: v.string(),         // Leetcode problem link
    title: v.string(),        // Problem title (e.g. "Two Sum")
    difficulty: v.string(),   // Easy / Medium / Hard
    topic: v.string(),        // Arrays / Trees / DP etc.
    explanation: v.string(),  // AI-generated simplified explanation
    user: v.id("users"),      // Link to the user who saved it
  }),

});
