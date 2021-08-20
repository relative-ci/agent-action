// https://docs.netlify.com/configure-builds/environment-variables/#git-metadata

module.exports = {
  detect({env}) {
    return Boolean(env.NETLIFY);
  },
  configuration({env}) {
    const isPr = Boolean(env.PULL_REQUEST);

    return {
      name: 'Netlify',
      service: 'netlify',
      commit: env.COMMIT_REF,
      build: env.BUILD_ID,
      buildUrl: env.DEPLOY_URL,
      branch: env.HEAD,
      pr: env.REVIEW_ID,
      isPr,
    };
  },
};
