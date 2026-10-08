/**
 * Cloudinary upload service
 * 1. Create a free account at https://cloudinary.com
 * 2. Go to Settings → Upload → Add upload preset (unsigned) named "brendava_itineraries"
 * 3. Replace CLOUD_NAME and UPLOAD_PRESET below
 */

const CLOUD_NAME = 'YOUR_CLOUDINARY_CLOUD_NAME';
const UPLOAD_PRESET = 'brendava_itineraries'; // unsigned preset

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

export const uploadImageToCloudinary = async (
  uri: string,
  folder = 'itineraries'
): Promise<CloudinaryUploadResult> => {
  const formData = new FormData();

  // React Native FormData expects this shape
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: `itinerary_${Date.now()}.jpg`,
  } as any);

  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Cloudinary upload failed');
  }

  return response.json();
};

export const uploadMultipleImages = async (
  uris: string[],
  folder = 'itineraries'
): Promise<string[]> => {
  const results = await Promise.all(
    uris.map((uri) => uploadImageToCloudinary(uri, folder))
  );
  return results.map((r) => r.secure_url);
};
