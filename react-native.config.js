module.exports = {
  project: {
    ios: {},
    android: {},
  },
  dependencies: {
    // Android OTA only (iOS uses react-native-stallion). Removed in Phase 2.
    'react-native-code-push': {platforms: {ios: null}},
  },
  assets: ['./Screen/assets/fonts'],
};
