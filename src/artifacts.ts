import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import * as github from '@actions/github';
import * as Zip from 'adm-zip';

import { logger } from './utils';

export async function getWebpackStatsFromFile(basedir: string, filepath: string): Promise<JSON> {
  const readFile = promisify(fs.readFile);
  const absoluteFilepath = path.join(basedir, filepath);

  logger.debug(`Read webpack stats from ${absoluteFilepath}`);
  const jsonData = await readFile(absoluteFilepath, 'utf-8');
  return JSON.parse(jsonData);
}

export async function getWebpackStatsFromArtifact(
  token: string,
  artifactName?: string,
  webpackStatsFile?: string
): Promise<JSON> {
  logger.debug('Extract from artifact');
  const { context } = github;

  const runId = context?.payload?.workflow_run?.id;

  if (!runId) {
    throw new Error('Complete workflow run id is missing! Add artifactName only when the action is running during workflow_run');
  }

  const api = github.getOctokit(token);

  const workflowRunArtifactsParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    run_id: runId,
  };

  logger.debug(`Download artifacts for ${JSON.stringify(workflowRunArtifactsParams)}`);
  const artifacts = await api.rest.actions.listWorkflowRunArtifacts(workflowRunArtifactsParams);

  const matchArtifact = artifacts?.data?.artifacts.find(
    (artifact) => artifact.name === artifactName,
  );

  if (!matchArtifact) {
    throw new Error('No valid artifact available');
  }

  logger.debug(`Download artifact ${matchArtifact.id}`);
  const download = await api.rest.actions.downloadArtifact({
    owner: context.repo.owner,
    repo: context.repo.repo,
    artifact_id: matchArtifact.id,
    archive_format: 'zip',
  });

  if (!download) {
    throw new Error('The artifact is missing, make sure you are passing the correct "artifactName" input!');
  }

  const zip = new Zip(Buffer.from(download.data as string));
  // @TODO webpackStatsFile needs to match exaclty, no "./" prefix
  const webpackStats = zip.readAsText(webpackStatsFile, 'utf-8');

  if (!webpackStats) {
    throw new Error('The artifact webpack stats file is missing, make sure you are passing a correct "webpackStatsFile" input!');
  }

  return JSON.parse(webpackStats);
}
