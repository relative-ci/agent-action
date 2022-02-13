import * as github from '@actions/github';

import { getGitHubCommitMessage, logger } from './utils';
import { AgentParams, GitHubContext } from './types';

/**
  * Extract params from the current ref, env-ci will handle the rest at the agent level
  */
export function extractParams(context: GitHubContext): AgentParams {
  return {
    commitMessage: context.payload?.head_commit?.message,
  };
}

/**
  * Exctract params from the pull request event data
  */
export async function extractPullRequestParams(
  context: GitHubContext,
  token: string,
  includeCommitMessage: boolean,
): Promise<AgentParams> {
  const { payload, repo } = context;
  const { pull_request: pullRequest } = payload;

  let commitMessage;

  if (includeCommitMessage) {
    if (!token) {
      logger.error('"token" input is required when "includeCommitMessage" is true');
    } else {
      const octokit = github.getOctokit(token);

      commitMessage = await getGitHubCommitMessage({
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

  return {
    commit, branch, pr, commitMessage,
  };
}

/**
  * Extract params from workflow_run event data
  */
export async function extractWorkflowRunParams(
  context: GitHubContext
): Promise<AgentParams> {
  const { payload } = context;
  const { workflow_run: workflowRun } = payload;

  const commit = workflowRun?.head_commit?.id;
  const commitMessage = workflowRun?.head_commit?.message;
  const pr = (workflowRun.event === 'pull_request') ? workflowRun?.pull_requests?.[0]?.number : undefined;
  let branch = workflowRun.head_branch;

  // prefix branch with owner when the event is triggered by a fork
  const headOwner = workflowRun?.head_repository?.owner?.login;
  if (headOwner && headOwner !== payload?.repository?.owner?.login) {
    branch = `${headOwner}:${branch}`;
  }

  return {
    commit,
    commitMessage,
    branch,
    pr,
  };
}
