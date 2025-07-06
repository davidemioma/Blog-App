import { useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props<T> = {
  key: string | string[];
  queryFn: (context: { pageParam?: number }) => Promise<T>;
};

const useUnlimitedScrolling = <T>({ key, queryFn }: Props<T>) => {
  const lastPostRef = useRef<HTMLElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: typeof key === "string" ? [key] : [...key],
    queryFn: queryFn,
    initialPageParam: 0,
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialData: { pages: [], pageParams: [1] },
  });

  return {
    ref,
    entry,
    hasNextPage,
    data,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  };
};

export default useUnlimitedScrolling;
