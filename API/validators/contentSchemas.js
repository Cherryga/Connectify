import { z } from "zod";

export const addPostSchema = z.object({
  desc: z.string().max(600).optional().default(""),
  img: z.string().max(255).optional().default(""),
});

export const addCommentSchema = z.object({
  desc: z.string().trim().min(1, "cannot be empty").max(300),
  postId: z.coerce.number().int().positive(),
});

export const addMessageSchema = z
  .object({
    receiverId: z.coerce.number().int().positive(),
    text: z.string().trim().max(2000).optional(),
    message: z.string().trim().max(2000).optional(),
  })
  .refine((data) => (data.text || data.message || "").trim().length > 0, {
    message: "message text is required",
    path: ["text"],
  });
