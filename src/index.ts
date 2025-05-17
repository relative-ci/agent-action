import * as core from '@actions/core';
import * as github from '@actions/github';
import ingest from '@relative-ci/core/ingest';
import { filterArtifacts, validateWebpackStats } from '@relative-ci/core/artifacts';
import loadEnv from '@relative-ci/core/env';
import { logResponse } from '@relative-ci/core/utils';

import { getWebpackStatsFromFile, getWebpackStatsFromArtifact } from './artifacts';
import { getSummary, logger } from './utils';

const { ACTIONS_STEP_DEBUG, GITHUB_WORKSPACE } = process.env;

async function run() {
  try {
    const token = core.getInput('token');

    const key = core.getInput('key');
    const slug = core.getInput('slug');
    const endpoint = core.getInput('endpoint');
    const includeCommitMessage = core.getInput('includeCommitMessage') === 'true';

    const webpackStatsFile = core.getInput('webpackStatsFile');
    const artifactName = core.getInput('artifactName');
    const debug = core.getInput('debug') === 'true';

    const { eventName } = github.context;

    // Enable debugging for debug input or ACTIONS_STEP_DEBUG is set
    if (debug || ACTIONS_STEP_DEBUG) {
      process.env.DEBUG = 'relative-ci:agent';
    }

    // Add inputs to process env
    process.env.RELATIVE_CI_KEY = key;
    process.env.RELATIVE_CI_SLUG = slug;
    process.env.RELATIVE_CI_ENDPOINT = endpoint;
    process.env.GITHUB_TOKEN = token;

    const params = await loadEnv({ agentType: 'github-action' }, { includeCommitMessage });

    logger.debug(`Agent params: ${JSON.stringify(params)}`);

    /**
     * Read JSON from the current job or download it from another job's artifact
     */
    let webpackStats = {};

    // Get webpack stats file from an artifact
    if (eventName === 'workflow_run') {
      webpackStats = await getWebpackStatsFromArtifact(token, artifactName, webpackStatsFile);

      // Get webpack stats from a file
    } else {
      if (!webpackStatsFile) {
        throw new Error('`webpackStatsFile` input is required!');
      }

      webpackStats = await getWebpackStatsFromFile(GITHUB_WORKSPACE, webpackStatsFile);
    }

    validateWebpackStats(webpackStats);

    // Filter artifacts
    const data = filterArtifacts([{ key: 'webpack.stats', data: webpackStats }]);

    // Send data to RelativeCI
    const response = await ingest(data, params, undefined, logger);

    // Output summary
    const summary = getSummary({
      title: response.info.message.txt,
      url: response.reportUrl,
    });

    await core.summary.addRaw(summary).write();

    logResponse(response, logger);
  } catch (error) {
    core.setFailed(error);
  }
}

run();
