import * as z from "zod";

export const PostSchema = z.object({
  title: z.string().min(3, "Title is required"),
  content: z.string(),
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => (value === "" ? "" : value)),
  ]),
});

export type PostFormValues = z.infer<typeof PostSchema>;
