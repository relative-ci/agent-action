import * as core from '@actions/core';
import * as github from '@actions/github';
import ingest from '@relative-ci/agent/ingest';
import { filterArtifacts, validateWebpackStats } from '@relative-ci/agent/artifacts';
import { logResponse, normalizeParams } from '@relative-ci/agent/utils';

import { getWebpackStatsFromFile, getWebpackStatsFromArtifact } from './artifacts';
import { extractParams, extractPullRequestParams, extractWorkflowRunParams } from './params';
import { logger } from './utils';
import { AgentParams } from './types';

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

    // Extract env data
    let agentParams: AgentParams;

    if (eventName === 'pull_request') {
      logger.debug('Extract params for pull_request flow');
      agentParams = await extractPullRequestParams(github.context, token, includeCommitMessage);
    } else if (eventName === 'workflow_run') {
      logger.debug('Extract params for workflow_run flow');
      agentParams = await extractWorkflowRunParams(github.context);
    } else {
      logger.debug('Extract params for default flow');
      agentParams = extractParams(github.context);
    }

    logger.debug(`Agent params: ${JSON.stringify(agentParams)}`);

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

    // Extract params
    process.env.RELATIVE_CI_KEY = key;
    process.env.RELATIVE_CI_SLUG = slug;
    process.env.RELATIVE_CI_ENDPOINT = endpoint;

    const params = normalizeParams(agentParams, { includeCommitMessage });

    // Filter artifacts
    const data = filterArtifacts([{ key: 'webpack.stats', data: webpackStats }]);

    // Send data to RelativeCI
    const response = await ingest(data, params, undefined, logger);

    logResponse(response, logger);
  } catch (error) {
    core.setFailed(error);
  }
}

run();
