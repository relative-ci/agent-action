import * as core from '@actions/core';
import * as github from '@actions/github';
import { agent } from '@relative-ci/agent/lib/agent';

import { getWebpackStats, downloadWorkflowArtifact } from './artifacts';
import { extractParams, extractPullRequestParams, extractWorkflowRunParams } from './params';
import { logger } from './utils';

const { ACTIONS_STEP_DEBUG, GITHUB_WORKSPACE } = process.env;

async function run() {
  try {
    const token = core.getInput('token');
    const key = core.getInput('key');
    const webpackStatsFile = core.getInput('webpackStatsFile');
    const artifactName = core.getInput('artifactName');
    const slug = core.getInput('slug');
    const includeCommitMessage = core.getInput('includeCommitMessage') === 'true';
    const debug = core.getInput('debug');

    const { eventName } = github.context;

    // Extract data
    // @type {AgentParams}
    let agentParams;

    if (eventName === 'pull_request') {
      logger.debug('pull_request flow');
      agentParams = await extractPullRequestParams(github.context, token, includeCommitMessage);
    } else if (eventName === 'workflow_run') {
      logger.debug('workflow_run flow');
      agentParams = await extractWorkflowRunParams(github.context);
    } else {
      logger.debug('default flow');
      agentParams = extractParams(github.context);
    }

    // Get webpack stats json
    let webpackStats = {};

    if (artifactName && webpackStatsFile) {
      webpackStats = await downloadWorkflowArtifact(token, artifactName, webpackStatsFile);
    } else if (webpackStatsFile) {
      webpackStats = await getWebpackStats(GITHUB_WORKSPACE, webpackStatsFile);
    } else {
      throw new Error('Missing webpackStatsFile');
    }

    // Set RelativeCI service key
    // @TODO pass it as an argument to agent
    process.env.RELATIVE_CI_KEY = key;

    // Enable debugging for when debug input or ACTIONS_STEP_DEBUG is set
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
