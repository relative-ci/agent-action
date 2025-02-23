/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/

;// external "@actions/core"
const core_namespaceObject = require("@actions/core");
;// external "@actions/github"
const github_namespaceObject = require("@actions/github");
;// external "@relative-ci/agent/ingest"
const ingest_namespaceObject = require("@relative-ci/agent/ingest");
var ingest_default = /*#__PURE__*/__webpack_require__.n(ingest_namespaceObject);
;// external "@relative-ci/agent/artifacts"
const artifacts_namespaceObject = require("@relative-ci/agent/artifacts");
;// external "@relative-ci/agent/utils"
const utils_namespaceObject = require("@relative-ci/agent/utils");
;// external "util"
const external_util_namespaceObject = require("util");
;// external "path"
const external_path_namespaceObject = require("path");
;// external "fs"
const external_fs_namespaceObject = require("fs");
;// external "adm-zip"
const external_adm_zip_namespaceObject = require("adm-zip");
;// ./utils.ts

const logger = {
  log: core_namespaceObject.info,
  debug: core_namespaceObject.debug,
  info: core_namespaceObject.info,
  warn: core_namespaceObject.warning,
  error: core_namespaceObject.error
};
async function getGitHubCommitMessage(params) {
  const {
    octokit,
    owner,
    repo,
    ref
  } = params;
  logger.debug(`Fetching commit message`);
  let commitMessage;
  try {
    const res = await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref
    });
    commitMessage = res?.data?.commit?.message;
  } catch (err) {
    logger.debug(`Error fetching commit message: ${err.message}`);
    logger.warn(err);
  }
  return commitMessage;
}
;// ./artifacts.ts






const DEFAULT_ARTIFACT_NAME = 'relative-ci-artifacts';
const DEFAULT_ARTIFACT_WEBPACK_STATS_FILE = 'webpack-stats.json';
async function getWebpackStatsFromFile(basedir, filepath) {
  const readFile = (0,external_util_namespaceObject.promisify)(external_fs_namespaceObject.readFile);
  const absoluteFilepath = external_path_namespaceObject.join(basedir, filepath);
  logger.debug(`Read webpack stats from ${absoluteFilepath}`);
  const jsonData = await readFile(absoluteFilepath, 'utf-8');
  return JSON.parse(jsonData);
}
async function getWebpackStatsFromArtifact(token, inputArtifactName, inputArtifactWebpackStatsFile) {
  const artifactName = inputArtifactName || DEFAULT_ARTIFACT_NAME;
  const artifactWebpackStatsFile = inputArtifactWebpackStatsFile || DEFAULT_ARTIFACT_WEBPACK_STATS_FILE;
  logger.debug(`Extract webpack stats from '${artifactName}/${artifactWebpackStatsFile}' `);
  const {
    context
  } = github_namespaceObject;
  const runId = context?.payload?.workflow_run?.id;
  if (!runId) {
    throw new Error(`Worflow 'runId' is missing! Please make sure your worklow is set up correctly.`);
  }
  const api = github_namespaceObject.getOctokit(token);
  const workflowRunArtifactsParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    run_id: runId
  };
  logger.debug(`Download artifacts for ${JSON.stringify(workflowRunArtifactsParams)}`);
  const artifacts = await api.rest.actions.listWorkflowRunArtifacts(workflowRunArtifactsParams);
  const matchArtifact = artifacts?.data?.artifacts.find(artifact => artifact.name === artifactName);
  if (!matchArtifact) {
    throw new Error(`Artifact '${artifactName}' could not be found! Please make sure 'artifactName' is correct.`);
  }
  logger.debug(`Download artifact ${matchArtifact.id}`);
  const download = await api.rest.actions.downloadArtifact({
    owner: context.repo.owner,
    repo: context.repo.repo,
    artifact_id: matchArtifact.id,
    archive_format: 'zip'
  });
  if (!download) {
    throw new Error(`Artifact '${artifactName}(id: ${matchArtifact.id}) could not be downloaded. Please try again!`);
  }
  const zip = new external_adm_zip_namespaceObject(Buffer.from(download.data));
  logger.debug(`Read artifact '${artifactWebpackStatsFile}' from '${artifactName}' archive`);
  const webpackStats = zip.readAsText(artifactWebpackStatsFile, 'utf-8');
  if (!webpackStats) {
    throw new Error(`Unable to unzip '${artifactWebpackStatsFile}' from '${artifactName}' archive.
       Please make sure the value of 'webpackStatsFile' is correct.
    `);
  }
  return JSON.parse(webpackStats);
}
;// ./params.ts


/**
  * Extract params from the current ref, env-ci will handle the rest at the agent level
  */
function extractParams(context) {
  return {
    commitMessage: context.payload?.head_commit?.message
  };
}
/**
  * Extract params from the pull request event data
  */
async function extractPullRequestParams(context, token, includeCommitMessage) {
  const {
    payload,
    repo
  } = context;
  const {
    pull_request: pullRequest
  } = payload;
  let commitMessage;
  if (includeCommitMessage) {
    logger.debug(`Fetching commit message for '${repo.owner}/${repo.repo}#${pullRequest?.head?.sha}'`);
    if (!token) {
      logger.error('"token" input is required when "includeCommitMessage" is true');
    } else {
      const octokit = github_namespaceObject.getOctokit(token);
      try {
        commitMessage = await getGitHubCommitMessage({
          octokit,
          owner: repo.owner,
          repo: repo.repo,
          ref: pullRequest?.head?.sha
        });
      } catch (err) {
        logger.error(`Error fetching commit data: ${err.message}`);
      }
    }
  }
  const commit = pullRequest?.head?.sha;
  const branch = pullRequest?.head?.ref;
  const pr = pullRequest?.number?.toString();
  return {
    commit,
    branch,
    pr,
    commitMessage
  };
}
/**
  * Extract params from workflow_run event data
  */
async function extractWorkflowRunParams(context) {
  const {
    payload
  } = context;
  const {
    workflow_run: workflowRun
  } = payload;
  const commit = workflowRun?.head_commit?.id;
  const commitMessage = workflowRun?.head_commit?.message;
  const pr = workflowRun.event === 'pull_request' ? workflowRun?.pull_requests?.[0]?.number : undefined;
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
    pr
  };
}
;// ./index.ts








const {
  ACTIONS_STEP_DEBUG,
  GITHUB_WORKSPACE
} = process.env;
async function run() {
  try {
    const token = core_namespaceObject.getInput('token');
    const key = core_namespaceObject.getInput('key');
    const slug = core_namespaceObject.getInput('slug');
    const endpoint = core_namespaceObject.getInput('endpoint');
    const includeCommitMessage = core_namespaceObject.getInput('includeCommitMessage') === 'true';
    const webpackStatsFile = core_namespaceObject.getInput('webpackStatsFile');
    const artifactName = core_namespaceObject.getInput('artifactName');
    const debug = core_namespaceObject.getInput('debug') === 'true';
    const {
      eventName
    } = github_namespaceObject.context;
    // Enable debugging for debug input or ACTIONS_STEP_DEBUG is set
    if (debug || ACTIONS_STEP_DEBUG) {
      process.env.DEBUG = 'relative-ci:agent';
    }
    // Extract env data
    let agentParams;
    if (eventName === 'pull_request') {
      logger.debug('Extract params for pull_request flow');
      agentParams = await extractPullRequestParams(github_namespaceObject.context, token, includeCommitMessage);
    } else if (eventName === 'workflow_run') {
      logger.debug('Extract params for workflow_run flow');
      agentParams = await extractWorkflowRunParams(github_namespaceObject.context);
    } else {
      logger.debug('Extract params for default flow');
      agentParams = extractParams(github_namespaceObject.context);
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
    (0,artifacts_namespaceObject.validateWebpackStats)(webpackStats);
    // Extract params
    process.env.RELATIVE_CI_KEY = key;
    process.env.RELATIVE_CI_SLUG = slug;
    process.env.RELATIVE_CI_ENDPOINT = endpoint;
    const params = (0,utils_namespaceObject.normalizeParams)(agentParams, {
      includeCommitMessage
    });
    // Filter artifacts
    const data = (0,artifacts_namespaceObject.filterArtifacts)([{
      key: 'webpack.stats',
      data: webpackStats
    }]);
    // Send data to RelativeCI
    const response = await ingest_default()(data, params, undefined, logger);
    (0,utils_namespaceObject.logResponse)(response, logger);
  } catch (error) {
    core_namespaceObject.setFailed(error);
  }
}
run();
/******/ })()
;