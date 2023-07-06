module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': __dirname,
        },
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        root: ['.'],
      },
    ],
  ],
};
