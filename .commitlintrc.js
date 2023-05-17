const Configuration = {
  extends: ["@commitlint/config-conventional"],

  ignores: [(message) => /^Bumps \[.+]\(.+\) from .+ to .+\.$/m.test(message)],
};

module.exports = Configuration;
