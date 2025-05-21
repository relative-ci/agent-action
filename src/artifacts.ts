import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import * as github from '@actions/github';
import Zip from 'adm-zip';

import { logger } from './utils';

const DEFAULT_ARTIFACT_NAME = 'relative-ci-artifacts';
const DEFAULT_ARTIFACT_WEBPACK_STATS_FILE = 'webpack-stats.json';

export async function getWebpackStatsFromFile(basedir: string, filepath: string): Promise<JSON> {
  const readFile = promisify(fs.readFile);
  const absoluteFilepath = path.join(basedir, filepath);

  logger.debug(`Read webpack stats from ${absoluteFilepath}`);

  const jsonData = await readFile(absoluteFilepath, 'utf-8');
  return JSON.parse(jsonData);
}

export async function getWebpackStatsFromArtifact(
  token: string,
  inputArtifactName: string,
  inputArtifactWebpackStatsFile: string
): Promise<JSON> {
  const artifactName = inputArtifactName || DEFAULT_ARTIFACT_NAME;
  const artifactWebpackStatsFile = inputArtifactWebpackStatsFile || DEFAULT_ARTIFACT_WEBPACK_STATS_FILE;

  logger.debug(`Extract webpack stats from '${artifactName}/${artifactWebpackStatsFile}' `);
  const { context } = github;

  const runId = context?.payload?.workflow_run?.id;

  if (!runId) {
    throw new Error(`Worflow 'runId' is missing! Please make sure your worklow is set up correctly.`);
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
    throw new Error(`Artifact '${artifactName}' could not be found! Please make sure 'artifactName' is correct.`);
  }

  logger.debug(`Download artifact ${matchArtifact.id}`);
  const download = await api.rest.actions.downloadArtifact({
    owner: context.repo.owner,
    repo: context.repo.repo,
    artifact_id: matchArtifact.id,
    archive_format: 'zip',
  });

  if (!download) {
    throw new Error(`Artifact '${artifactName}(id: ${matchArtifact.id}) could not be downloaded. Please try again!`);
  }

  const zip = new Zip(Buffer.from(download.data as string));

  logger.debug(`Read artifact '${artifactWebpackStatsFile}' from '${artifactName}' archive`);
  const webpackStats = zip.readAsText(artifactWebpackStatsFile, 'utf-8');

  if (!webpackStats) {
    throw new Error(
      `Unable to unzip '${artifactWebpackStatsFile}' from '${artifactName}' archive.
       Please make sure the value of 'webpackStatsFile' is correct.
    `);
  }

  return JSON.parse(webpackStats);
}
