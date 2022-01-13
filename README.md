# RelativeCI agent

GitHub action that sends webpack stats and CI build information to [RelativeCI](https://relative-ci.com?utm_source=GitHub&utm_medium=agent-action).

---

To get started, follow [RelativeCI Setup guide](https://relative-ci.com/documentation/setup?utm_source=GitHub&utm_medium=agent-action).

## Example usage

```yaml
# .github/workflow/relative-ci.yml
name: RelativeCI GitHub action example

jobs:
  build:
    steps:
      # Install dependencies
      - run: npm ci

      # Build bundle and output webpack stats
      # see https://relative-ci.com/documentation/setup/agent/github-action/#step-1-output-webpack-stats
      - run: npm run build --if-present
      
      - name: Send webpack stats to RelativeCI
        uses: relative-ci/agent-action@v1.1.3
        with:
          webpackStatsFile: ./artifacts/webpack-stats.json
          key: ${{ secrets.RELATIVE_CI_KEY }}
          debug: false
```

## Inputs

### `webpackStatsFile`

**Required** Path to webpack stats file

### `key`

**Required** RelativeCI project key

### `slug`

Your project slug (default: [`GITHUB_REPOSITORY` evironment variable](https://docs.github.com/en/actions/reference/environment-variables#default-environment-variables))

## `includeCommitMessage` (default: `true`)

Fetch commit message from GitHub when the context commit is different that the commit that triggered the workflow (eg: `pull_request` event).

### `debug`

Enable debug output (default: `false`)

## Secrets

### `RELATIVE_CI_KEY`

Your RelativeCI project key
