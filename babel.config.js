module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        targets: {
          node: 'current',
        },
        corejs: '3',
      },
    ],
  ],
};
