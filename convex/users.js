import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase();
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), normalizedEmail))
      .collect();

    if (existingUser.length === 0) {
      const result = await ctx.db.insert("users", {
        name: args.name,
        picture: args.picture,
        email: normalizedEmail,
        uid: args.uid,
      });
      return result;
    } else {
      return existingUser[0]._id;
    }
  },
});

export const getUserByUID = query({
  args: { uid: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("uid"), args.uid))
      .unique();
    return user;
  },
});