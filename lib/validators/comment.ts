import * as z from "zod";

export const CommentSchema = z.object({
  message: z.string().min(1, "Meassage is required"),
});

export type CommentFormValues = z.infer<typeof CommentSchema>;
