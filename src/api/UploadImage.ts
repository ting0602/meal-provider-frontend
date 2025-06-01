// src/api/upload.ts
import { API } from './index';

export interface UploadResponse {
  url: string;
}

export async function uploadImageAPI(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const resp = await fetch(API.uploadImage, {
    method: 'POST',
    body: formData,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Upload failed: ${resp.status} / ${text}`);
  }

  // return image url { url: string }
  const data = (await resp.json()) as UploadResponse;
  return data;
}
