# RelativeCI agent

GitHub action that sends webpack stats and CI build information to [RelativeCI](https://relative-ci.com).

- [RelativeCI Setup guide](https://relative-ci.com/documentation/setup)
- [RelativeCI GitHub action guide](https://relative-ci.com/documentation/setup/agent/github-action)

---

1. [Usage](#usage)
  - [`push`/`pull_request` events](#pushpull_request-events)
  - [`workflow_run` events](#workflow_run-events)
2. [Inputs](#inputs)
3. [Secrets](#secrets)


## Usage

[View action.yml](./action.yml)

### `push`/`pull_request` events

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
        uses: relative-ci/agent-action@v2
        with:
          key: ${{ secrets.RELATIVE_CI_KEY }}
          token: ${{ secrets.GITHUB_TOKEN }}
          webpackStatsFile: ./webpack-stats.json
```

### `workflow_run` events

[Read more about workflows triggered by forked repositories](https://relative-ci.com/documentation/setup/agent/github-action/).

#### Build and upload webpack stats artifacts using [relative-ci/agent-upload-artifact-action](https://github.com/relative-ci/agent-upload-artifact-action)

```yaml
# .github/workflows/build.yaml
name: Build

on:
  push:
    branches:
      - master
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16.x'

      # Install dependencies
      - run: npm ci

      # Build and output webpack stats to webpack-stats.json
      - run: npm run build --json webpack-stats.json

      # Upload webpack-stats.json to use on relative-ci.yaml workflow
      - name: Upload webpack stats artifact
        uses: relative-ci/agent-upload-artifact-action@v1
        with:
          webpackStatsFile: ./webpack-stats.json
```

### Send webpack stats and build information to RelativeCI 

The workflow runs securely in the default branch context(ex: `main`). `relative-ci/agent-action` uses the build information (commit, message, branch) from the depending workflow (ex: `Builds`).

```yaml
# .github/workflows/relative-ci.yaml
name: RelativeCI

on:
  workflow_run:
    workflows: ["Build"]
    types:
      - completed

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Send webpack stats to RelativeCI
        uses: relative-ci/agent-action@v2
        with:
          key: ${{ secrets.RELATIVE_CI_KEY }}
          token: ${{ secrets.GITHUB_TOKEN }}
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

The artifact webpack stats file path

## Secrets

### `RELATIVE_CI_KEY`

Your RelativeCI project key
