module.exports = {
  // Disable commit message on CLI, the GitHub action is responsable for providing the correct value
  includeCommitMessage: false,

  webpack: {
    stats: './webpack-stats.json',
  },
};
