<a href="https://relative-ci.com">
<img alt="RelativeCI" src="https://raw.githubusercontent.com/relative-ci/agent-action/master/assets/relative-ci--logo.svg?sanitize=true" width="96" />
</a>

# RelativeCI agent Github Action

> Send webpack stats and CI build information to [RelativeCI](https://relative-ci.com?utm_source=GitHub&utm_medium=agent-action).

To get started, follow [RelativeCI Setup guide](https://relative-ci.com/documentation/setup?utm_source=GitHub&utm_medium=agent-action).

## Inputs

### `webpackStatsFile`

**Required** Path to webpack stats file

### `key`

**Required** RelativeCI project key

### `slug`

**Optional** Your project slug (default: [`GITHUB_REPOSITORY` evironment variable](https://docs.github.com/en/actions/reference/environment-variables#default-environment-variables))

### `debug`

**Optional** Enable debug output (default: `false`)
