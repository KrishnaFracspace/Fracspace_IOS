module.exports = api => {
  // Release bundles (Gradle/Xcode builds and Stallion OTA) are built with
  // BABEL_ENV=production. Strip console.* there: the app logs auth tokens, FCM
  // tokens, email, bank details and payment payloads, and release logs are
  // readable on the device.
  const isProduction = api.env('production');
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      ...(isProduction ? ['transform-remove-console'] : []),
      // Must stay last.
      'react-native-reanimated/plugin',
    ],
  };
};
