/**
 * react-native-image-picker options for photos that get uploaded (verification
 * documents, profile photos).
 *
 * iPhone/iPad camera photos are HEIC. With the default assetRepresentationMode
 * ('auto') the picker returns the HEIC bytes but names them ".jpg" /
 * "image/jpeg", and the server can't read them, so verification failed on iOS
 * for camera photos (screenshots and downloaded images worked). 'compatible'
 * makes iOS convert to a real JPEG. The size cap keeps uploads small and fast;
 * 2000 px is plenty for reading a PAN card or cheque.
 */
export const UPLOAD_PHOTO_OPTIONS = {
  mediaType: 'photo',
  includeBase64: false,
  selectionLimit: 1,
  assetRepresentationMode: 'compatible',
  maxWidth: 2000,
  maxHeight: 2000,
  quality: 0.8,
};
