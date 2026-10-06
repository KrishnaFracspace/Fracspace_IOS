// Video sources for react-native-video with smaller Android buffers.
//
// ExoPlayer's defaults buffer up to ~50 s per player; our clips are short promos
// and testimonials, so a few seconds ahead is plenty and cuts memory per player.
// The returned object is cached per URL: react-native-video reloads the player
// when `source` changes identity, so a new object on every render would restart it.
import { Platform } from 'react-native';

const ANDROID_BUFFER_CONFIG = {
  minBufferMs: 5000,
  maxBufferMs: 15000,
  bufferForPlaybackMs: 1500,
  bufferForPlaybackAfterRebufferMs: 2500,
  backBufferDurationMs: 0,
};

const cache = new Map();

export function videoSource(uri) {
  if (!uri) return undefined;
  let source = cache.get(uri);
  if (!source) {
    source =
      Platform.OS === 'android'
        ? { uri, bufferConfig: ANDROID_BUFFER_CONFIG }
        : { uri };
    cache.set(uri, source);
  }
  return source;
}
