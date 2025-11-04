module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins:[
      'react-native-reanimated/plugin', // necessário
      'react-native-worklets/plugin',   // garante que o plugin seja resolvido
    ]
  };
};