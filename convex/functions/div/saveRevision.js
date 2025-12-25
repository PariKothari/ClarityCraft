import { mutation } from "@/convex/_generated/server";

export const saveRevision = mutation(async ({ db, auth }, args) => {
  const userId = await auth.getUserIdentity();
  if (!userId) throw new Error("Not authenticated");

  await db.insert("leetcodeRevisions", {
    userId: userId.subject,
    link: args.link,
    title: args.title,
    difficulty: args.difficulty,
    topic: args.topic,
    explanation: args.explanation,
    createdAt: Date.now(),
  });
});