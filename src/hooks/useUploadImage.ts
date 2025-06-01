// src/hooks/useUploadImage.ts
import { useState, useCallback } from 'react';
import { uploadImageAPI, UploadResponse } from 'api/UploadImage';

export function useUploadImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const data: UploadResponse = await uploadImageAPI(file);
      setUploadedUrl(data.url);
      return data.url;
    } catch (err) {
      const message = (err as Error).message || 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    upload,
    loading,
    error,
    uploadedUrl,
  };
}
