import * as core from '@actions/core';
import * as github from '@actions/github';
import { agent } from '@relative-ci/agent/lib/agent';

import { getWebpackStatsFromFile, getWebpackStatsFromArtifact } from './artifacts';
import { extractParams, extractPullRequestParams, extractWorkflowRunParams } from './params';
import { logger } from './utils';

const { ACTIONS_STEP_DEBUG, GITHUB_WORKSPACE } = process.env;

async function run() {
  try {
    const token = core.getInput('token');
    const key = core.getInput('key');
    const slug = core.getInput('slug');
    const webpackStatsFile = core.getInput('webpackStatsFile');
    const artifactName = core.getInput('artifactName');
    const includeCommitMessage = core.getInput('includeCommitMessage') === 'true';
    const debug = core.getInput('debug') === 'true';

    const { eventName } = github.context;

    // Extract data
    // @type {AgentParams}
    let agentParams;

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

    logger.debug(`Agent params: ${JSON.stringify(agentParams)}`)

    // Get webpack stats json
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

    // Set RelativeCI service key
    // @TODO pass it as an argument to agent
    process.env.RELATIVE_CI_KEY = key;

    // Enable debugging for debug input or ACTIONS_STEP_DEBUG is set
    if (debug || ACTIONS_STEP_DEBUG) {
      process.env.DEBUG = 'relative-ci:agent';
    }

    await agent(
      [
        {
          key: 'webpack.stats',
          data: webpackStats,
        },
      ],
      { includeCommitMessage },
      {
        slug,
        ...agentParams,
      },
    );
  } catch (err) {
    core.setFailed(err);
  }
}

run();
