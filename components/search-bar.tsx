"use client";

import React, { useState, useEffect } from "react";
import qs from "query-string";
import { XIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();

  const pathname = usePathname();

  const [value, setValue] = useState("");

  const [query, setQuery] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(value);

      const url = qs.stringifyUrl(
        {
          url: pathname,
          query: {
            query,
          },
        },
        { skipNull: true, skipEmptyString: true }
      );

      router.push(url);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, query, pathname, router]);

  return (
    <div className="w-full max-w-lg px-3 py-2 mx-auto flex items-center gap-3 border rounded-lg">
      <input
        className="w-full flex-1 outline-none border-transparent"
        value={value}
        placeholder="Search..."
        onChange={(e) => setValue(e.target.value)}
      />

      {value.length > 0 && (
        <button type="button" onClick={() => setValue("")}>
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
