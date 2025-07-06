"use client";

import { toast } from "sonner";
import Image from "next/image";
import { Button } from "../ui/button";
import { UploadCloud, X } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import React, { useEffect, useRef, useState, useCallback } from "react";

type Props = {
  value: File | string | null;
  setValue: (value: File | string | null) => void;
  disabled?: boolean;
};

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const MAX_FILE_SIZE_MB = 1;

const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const FileUpload = ({ value, setValue, disabled }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;

      if (!fileList) return;

      const file = fileList[0];

      if (!file) return;

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`Invalid type: ${file.name}.`);

        if (inputRef.current) inputRef.current.value = "";

        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(
          `${file.name} size >  ${formatBytes(MAX_FILE_SIZE_BYTES)}.`
        );

        if (inputRef.current) inputRef.current.value = "";

        return;
      }

      setValue(file);

      if (inputRef.current) inputRef.current.value = "";
    },
    [setValue]
  );

  const handleRemoveImage = useCallback(() => {
    setValue(null);

    if (inputRef.current) inputRef.current.value = "";
  }, [setValue]);

  const triggerInput = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  useEffect(() => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);

    if (value instanceof File) {
      setObjectUrl(URL.createObjectURL(value));
    } else if (typeof value === "string") {
      setObjectUrl(value);
    } else {
      setObjectUrl(null);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="w-full space-y-4">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        disabled={disabled || !!value}
        onChange={handleFileChange}
      />

      {!value && !disabled && (
        <button
          type="button"
          onClick={triggerInput}
          disabled={disabled}
          className="relative h-40 w-full border-2 border-dashed border-muted-foreground/50 rounded-md flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          <UploadCloud className="size-8 mb-1" />
          <span>Upload Image</span>
        </button>
      )}

      {value && !disabled && (
        <Button
          type="button"
          className="w-fit mt-2"
          variant="outline"
          size="sm"
          onClick={handleRemoveImage}
        >
          Remove Image
        </Button>
      )}

      {objectUrl && (
        <div className="relative aspect-square group w-40 h-40">
          <Image
            className="object-cover rounded-md border border-muted/20"
            src={objectUrl}
            fill
            alt="Preview"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 size-5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
              onClick={handleRemoveImage}
              aria-label="Remove image"
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
