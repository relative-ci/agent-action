import core from '@actions/core';
import github from '@actions/github';
import { exec } from '@actions/exec';

/**
 * @typedef {Object} AgentParams
 * @param {string} [AgentParams.commit]
 * @param {string} [AgentParams.build]
 */

async function agent({ commit, branch, pr, commitMessage }) {
  const args = {
    ...commit && { commit },
    ...branch && { branch },
    ...pr && { pr },
    ...commitMessage && { commitMessage },
  };

  core.debug(`Agent arguments: ${JSON.stringify(args)}`);

  return exec('node', [
    `${github.action_path}/node_modules/@relative-ci/agent/bin/index.js`,
    ...Object.entries(args).map(([key, value]) => `${key}=${value}`),
  ]);
}

async function getCommitMessage({ octokit, owner, repo, ref }) {
  let commitMessage;

  try {
    const res = await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref,
    });

    commitMessage = res?.data?.commit?.message;
  } catch (err) {
    // noop
  }

  return commitMessage;
}

/**
 * @param {import('@actions/github/lib/context').Context} context
 * @param {string} token
 * @returns {AgentParams}
 */
async function extractPullRequestParams (context, token) {
  const { payload, repo } = context;
  const { pull_request: pullRequest } = payload;

  let commitMessage;

  if (includeCommitMessage) {
    if (!token) {
      core.error('"token" input is required when "includeCommitMessage" is true')
    } else {
      const octokit = github.getOctokit(token);

      commitMessage = await getCommitMessage({
        octokit,
        owner: repo.owner,
        repo: repo.repo,
        ref: pullRequest?.head?.sha,
      });
    }
  }

  const commit = pullRequest?.head?.sha;
  const branch = pullRequest?.head?.ref;
  const pr = pullRequest?.number;

  return { commit, branch, pr, commitMessage };
}

/**
 * @param {import('@actions/github/lib/context').Context} context
 * @param {string} token
 * @returns {AgentParams}
 */
async function extractWorkflowRunParams(context, token) {
  const { payload } = context;
  const { workflow_run: workflowRun } = payload;

  const commit = workflowRun?.head_commit?.id;
  const commitMessage = workflowRun?.head_commit?.message;
  let branch = workflowRun.head_branch;
  const pr = (workflowRun.event === 'pull_request')
    && workflowRun?.pull_requests?.[0]?.number;

  // prefix branch with owner when the event is triggered by a fork
  const headOwner = workflowRun?.head_repository?.owner?.login;
  if (headOwner && headOwner !== payload?.repository?.owner?.login) {
    branch = headOwner  + ':' + branch;
  }

  return {
    commit,
    commitMessage,
    branch,
    pr,
  };
}

async function run() {
  try {
    const token = core.getInput('token');
    const webpackStatsFile = core.getInput('webpackStatsFile');
    const key = core.getInput('key');
    const artifactName = core.getInput('artifactName');
    const slug = core.getInput('slug');
    const includeCommitMessage = core.getInput('includeCommitMessage');
    const debug = core.getInput('debug');

    const inputs = {
      webpackStatsFile,
      key,
      artifactName,
      slug,
      includeCommitMessage,
      debug
    };

    core.debug(`Inputs: ${JSON.stringify(inputs)}`);

    const { eventName, payload } = github.context;

    // Extract data
    // @type {AgentParams}
    let agentParams = {};

    if (eventName === 'pull_request') {
      core.debug('pull_request flow');
      agentParams = await extractPullRequestParams(github.context, token);
    } else if (eventName === 'workflow_run') {
      core.debug('workflow_run flow');
      agentParams = await extractWorkflowRunParams(github.context, token);
    } else {
      core.debug('default flow');
      agentParams = {
        commitMessage: payload?.head_commit?.message
      };
    }

    return agent(agentParams);
  } catch (err) {
    core.setFailed(err);
  }
};

run();
