// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // let babel-preset-expo use nativewind's jsx import source
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      // nativewind's babel preset (v4)
      'nativewind/babel',
    ],
    plugins: [
      // expo-router plugin
      'expo-router/babel',
      // react-native-reanimated plugin (if you use Reanimated). Keep it last.
      'react-native-reanimated/plugin',
    ],
  };
};
