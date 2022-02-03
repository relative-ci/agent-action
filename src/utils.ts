import * as core from '@actions/core';
import { GitHub } from '@actions/github/lib/utils';

import * as I18N from './i18n';

export const logger: Omit<typeof core, 'info | debug | warning | error'> = core;

interface GetGitHubCommitMessageParams {
  octokit: InstanceType<typeof GitHub>,
  owner: string,
  repo: string,
  ref: string
}

export async function getGitHubCommitMessage(
  params: GetGitHubCommitMessageParams,
): Promise<string | undefined> {
  const { octokit, owner, repo, ref } = params;

  logger.debug(I18N.COMMIT_MESSAGE)

  let commitMessage;

  try {
    const res = await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref,
    });

    commitMessage = res?.data?.commit?.message;
  } catch (err) {
    logger.debug(I18N.COMMIT_MESSAGE_ERROR);
    logger.warning(err);
  }

  return commitMessage;
}
