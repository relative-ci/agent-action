# RelativeCI agent

GitHub action that sends webpack stats and CI build information to [RelativeCI](https://relative-ci.com?utm_source=GitHub&utm_medium=agent-action).

---

To get started, follow [RelativeCI Setup guide](https://relative-ci.com/documentation/setup?utm_source=GitHub&utm_medium=agent-action).

## Usage

[View action.yml](./action.yml)

```yaml
# .github/workflow/node.js.yml
name: Node.js CI

on:
  push:
    branches:
      - master
  pull_request:

jobs:
  build:
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16.x'

      # Install dependencies
      - run: npm ci

      # Build bundle and output webpack stats
      # see https://relative-ci.com/documentation/setup/agent/github-action/#step-1-output-webpack-stats
      - run: npm run build -- --json webpack-stats
      
      - name: Send webpack stats to RelativeCI
        uses: relative-ci/agent-action@v1
        with:
          key: ${{ secrets.RELATIVE_CI_KEY }}
          token: ${{ secrets.GITHUB_TOKEN }}
          webpackStatsFile: ./webpack-stats.json
```

## Inputs

### `key`

**Required** RelativeCI project key

### `token`

**Required** GitHub token

### `webpackStatsFile`

**Required** (only when running during `push` or `pull_request` events) Path to webpack stats file

### Optional

#### `slug`

Default: [`GITHUB_REPOSITORY` evironment variable](https://docs.github.com/en/actions/reference/environment-variables#default-environment-variables)

Your project slug

#### `includeCommitMessage`

Default: `true`

Fetch commit message from GitHub when the context commit is different that the commit that triggered the workflow (eg: `pull_request` event).

#### `debug`

Default: `false`

Enable debug output

#### `artifactName`

Default: `relative-ci-artifacts` when running during `workflow_run` event

The name of the artifact with webpack stats uploaded by another workflow

#### `artifactWebpackStatsFile` 

Default: `webpack-stats.json` when running during `workflow_run` event


## Secrets

### `RELATIVE_CI_KEY`

Your RelativeCI project key
