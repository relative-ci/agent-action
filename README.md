# RelativeCI agent

GitHub action that sends bundle stats and CI build information to [RelativeCI](https://relative-ci.com).

- [RelativeCI Setup guide](https://relative-ci.com/documentation/setup)
- [RelativeCI GitHub action guide](https://relative-ci.com/documentation/setup/agent/github-action)

## Other agents

- [CLI and webpack-plugin](https://github.com/relative-ci/agent)
- [CircleCI orbit (soon)](https://github.com/relative-ci/roadmap/issues/46)

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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'latest'

      # Install dependencies
      - run: npm ci

      # Build and output bundle stats
      # Learn more: https://relative-ci.com/documentation/setup/agent/github-action#step-1-output-bundle-stats-json-file
      - run: npm run build -- --json webpack-stats.json
      
      - name: Send bundle stats to RelativeCI
        uses: relative-ci/agent-action@v2
        with:
          key: ${{ secrets.RELATIVE_CI_KEY }}
          token: ${{ secrets.GITHUB_TOKEN }}
          webpackStatsFile: ./webpack-stats.json
```

### `workflow_run` events

[Read more about workflows triggered by forked repositories](https://relative-ci.com/documentation/setup/agent/github-action/#workflow_run-event).

#### Build and upload bundle stats artifacts using [relative-ci/agent-upload-artifact-action](https://github.com/relative-ci/agent-upload-artifact-action)

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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'latest'

      # Install dependencies
      - run: npm ci

      # Build and output bundle stats to webpack-stats.json
      # Learn more: https://relative-ci.com/documentation/setup/agent/github-action#step-1-output-bundle-stats-json-file
      - run: npm run build -- --json webpack-stats.json

      # Upload webpack-stats.json to use on relative-ci.yaml workflow
      - name: Upload bundle stats artifact
        uses: relative-ci/agent-upload-artifact-action@v2
        with:
          webpackStatsFile: ./webpack-stats.json
```

### Send bundle stats and build information to RelativeCI 

The workflow runs securely in the default branch context(ex: `main`). `relative-ci/agent-action` uses the build information (commit, message, branch) corresponding to the commit that triggerd the `Build` workflow.

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
      - name: Send bundle stats and build information to RelativeCI
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

**Required** (only when running during `push` or `pull_request` events) Path to the bundle stats file

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

The name of the artifact that containts the bundle stats uploaded by the triggering workflow

## Secrets

### `RELATIVE_CI_KEY`

Your RelativeCI project key
