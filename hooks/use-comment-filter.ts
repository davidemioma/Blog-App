import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CommentFilterType = "all" | "hot" | "top" | "controversial" | "new";

interface CommentFilterState {
  filter: CommentFilterType;
  setFilter: (filter: CommentFilterType) => void;
}

export const useCommentFilter = create<CommentFilterState>()(
  persist(
    (set) => ({
      filter: "new",
      setFilter: (filter: CommentFilterType) => set({ filter }),
    }),
    {
      name: "blog-app-comment-filter",
    }
  )
);
