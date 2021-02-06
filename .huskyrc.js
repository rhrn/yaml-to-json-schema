module.exports = {
  "hooks": {
    "pre-commit": "tsc",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
    "pre-push": "tsc"
  }
}
