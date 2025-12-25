import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

//  Mutation: Create a workspace
export const createWorkspace = mutation({
  args: {
    user: v.id("users"),
    messages: v.any(),
    fileData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const workspaceId = await ctx.db.insert("workspace", {
      user: args.user,
      messages: args.messages,
      fileData: args.fileData ?? null,
    });
    return workspaceId;
  },
});

//  Query: Get a workspace by ID
export const getWorkspace = query({
  args: { workspaceId: v.id("workspace") },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.workspaceId);
    return result;
  },
});