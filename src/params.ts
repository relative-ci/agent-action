import * as github from '@actions/github';

import { getGitHubCommitMessage, logger } from './utils';
import { AgentParams, GitHubContext } from './types';

/**
  * Extract params from the pull request event data
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
    logger.debug(`Fetching commit message for '${repo.owner}/${repo.repo}#${pullRequest?.head?.sha}'`);

    if (!token) {
      logger.error('"token" input is required when "includeCommitMessage" is true');
    } else {
      const octokit = github.getOctokit(token);
      try {
        commitMessage = await getGitHubCommitMessage({
          octokit,
          owner: repo.owner,
          repo: repo.repo,
          ref: pullRequest?.head?.sha,
        });
      } catch (err) {
        logger.error(`Error fetching commit data: ${err.message}`);
      }
    }
  }

  return {
    commitMessage,
  };
}
