/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 23:
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ 385:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});
var __importStar = this && this.__importStar || function () {
  var ownKeys = function (o) {
    ownKeys = Object.getOwnPropertyNames || function (o) {
      var ar = [];
      for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
      return ar;
    };
    return ownKeys(o);
  };
  return function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    __setModuleDefault(result, mod);
    return result;
  };
}();
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getWebpackStatsFromFile = getWebpackStatsFromFile;
exports.getWebpackStatsFromArtifact = getWebpackStatsFromArtifact;
const util_1 = __webpack_require__(23);
const path = __importStar(__webpack_require__(928));
const fs = __importStar(__webpack_require__(896));
const github = __importStar(__webpack_require__(831));
const adm_zip_1 = __importDefault(__webpack_require__(650));
const utils_1 = __webpack_require__(823);
const DEFAULT_ARTIFACT_NAME = 'relative-ci-artifacts';
const DEFAULT_ARTIFACT_WEBPACK_STATS_FILE = 'webpack-stats.json';
async function getWebpackStatsFromFile(basedir, filepath) {
  const readFile = (0, util_1.promisify)(fs.readFile);
  const absoluteFilepath = path.join(basedir, filepath);
  utils_1.logger.debug(`Read webpack stats from ${absoluteFilepath}`);
  const jsonData = await readFile(absoluteFilepath, 'utf-8');
  return JSON.parse(jsonData);
}
async function getWebpackStatsFromArtifact(token, inputArtifactName, inputArtifactWebpackStatsFile) {
  const artifactName = inputArtifactName || DEFAULT_ARTIFACT_NAME;
  const artifactWebpackStatsFile = inputArtifactWebpackStatsFile || DEFAULT_ARTIFACT_WEBPACK_STATS_FILE;
  utils_1.logger.debug(`Extract webpack stats from '${artifactName}/${artifactWebpackStatsFile}' `);
  const {
    context
  } = github;
  const runId = context?.payload?.workflow_run?.id;
  if (!runId) {
    throw new Error(`Worflow 'runId' is missing! Please make sure your worklow is set up correctly.`);
  }
  const api = github.getOctokit(token);
  const workflowRunArtifactsParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    run_id: runId
  };
  utils_1.logger.debug(`Download artifacts for ${JSON.stringify(workflowRunArtifactsParams)}`);
  const artifacts = await api.rest.actions.listWorkflowRunArtifacts(workflowRunArtifactsParams);
  const matchArtifact = artifacts?.data?.artifacts.find(artifact => artifact.name === artifactName);
  if (!matchArtifact) {
    throw new Error(`Artifact '${artifactName}' could not be found! Please make sure 'artifactName' is correct.`);
  }
  utils_1.logger.debug(`Download artifact ${matchArtifact.id}`);
  const download = await api.rest.actions.downloadArtifact({
    owner: context.repo.owner,
    repo: context.repo.repo,
    artifact_id: matchArtifact.id,
    archive_format: 'zip'
  });
  if (!download) {
    throw new Error(`Artifact '${artifactName}(id: ${matchArtifact.id}) could not be downloaded. Please try again!`);
  }
  const zip = new adm_zip_1.default(Buffer.from(download.data));
  utils_1.logger.debug(`Read artifact '${artifactWebpackStatsFile}' from '${artifactName}' archive`);
  const webpackStats = zip.readAsText(artifactWebpackStatsFile, 'utf-8');
  if (!webpackStats) {
    throw new Error(`Unable to unzip '${artifactWebpackStatsFile}' from '${artifactName}' archive.
       Please make sure the value of 'webpackStatsFile' is correct.
    `);
  }
  return JSON.parse(webpackStats);
}

/***/ }),

/***/ 618:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});
var __importStar = this && this.__importStar || function () {
  var ownKeys = function (o) {
    ownKeys = Object.getOwnPropertyNames || function (o) {
      var ar = [];
      for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
      return ar;
    };
    return ownKeys(o);
  };
  return function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    __setModuleDefault(result, mod);
    return result;
  };
}();
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
const core = __importStar(__webpack_require__(659));
const github = __importStar(__webpack_require__(831));
const ingest_1 = __importDefault(__webpack_require__(956));
const artifacts_1 = __webpack_require__(923);
const env_1 = __importDefault(__webpack_require__(743));
const utils_1 = __webpack_require__(885);
const artifacts_2 = __webpack_require__(385);
const utils_2 = __webpack_require__(823);
const {
  ACTIONS_STEP_DEBUG,
  GITHUB_WORKSPACE
} = process.env;
async function run() {
  try {
    const token = core.getInput('token');
    const key = core.getInput('key');
    const slug = core.getInput('slug');
    const endpoint = core.getInput('endpoint');
    const includeCommitMessage = core.getInput('includeCommitMessage') === 'true';
    const webpackStatsFile = core.getInput('webpackStatsFile');
    const artifactName = core.getInput('artifactName');
    const showDebug = core.getInput('debug') === 'true';
    const {
      eventName
    } = github.context;
    // Enable debugging when debug input or ACTIONS_STEP_DEBUG is set
    if (showDebug || ACTIONS_STEP_DEBUG) {
      process.env.DEBUG = utils_1.AGENT_DEBUG_NAME;
    }
    // Add inputs to process env
    process.env.RELATIVE_CI_KEY = key;
    process.env.RELATIVE_CI_SLUG = slug;
    process.env.RELATIVE_CI_ENDPOINT = endpoint;
    process.env.GITHUB_TOKEN = token;
    const params = await (0, env_1.default)({
      agentType: 'github-action'
    }, {
      includeCommitMessage
    });
    (0, utils_1.debug)(`Agent params: ${JSON.stringify(params)}`);
    /**
     * Read JSON from the current job or download it from another job's artifact
     */
    let webpackStats = {};
    // Get webpack stats file from an artifact
    if (eventName === 'workflow_run') {
      webpackStats = await (0, artifacts_2.getWebpackStatsFromArtifact)(token, artifactName, webpackStatsFile);
      // Get webpack stats from a file
    } else {
      if (!webpackStatsFile) {
        throw new Error('`webpackStatsFile` input is required!');
      }
      if (!GITHUB_WORKSPACE) {
        throw new Error('GITHUB_WORKSPACE environment variable is missing!');
      }
      webpackStats = await (0, artifacts_2.getWebpackStatsFromFile)(GITHUB_WORKSPACE, webpackStatsFile);
    }
    (0, artifacts_1.validateWebpackStats)(webpackStats);
    // Filter artifacts
    const data = (0, artifacts_1.filterArtifacts)([{
      key: 'webpack.stats',
      data: webpackStats
    }]);
    // Send data to RelativeCI
    const response = await (0, ingest_1.default)(data, params, undefined, utils_2.logger);
    // Output summary
    const summary = (0, utils_2.getSummary)({
      title: response?.info?.message?.txt || '',
      url: response.reportUrl || ''
    });
    await core.summary.addRaw(summary).write();
    (0, utils_1.logResponse)(response, utils_2.logger);
  } catch (error) {
    core.setFailed(error);
  }
}
run();

/***/ }),

/***/ 650:
/***/ ((module) => {

module.exports = require("adm-zip");

/***/ }),

/***/ 659:
/***/ ((module) => {

module.exports = require("@actions/core");

/***/ }),

/***/ 743:
/***/ ((module) => {

module.exports = require("@relative-ci/core/env");

/***/ }),

/***/ 823:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});
var __importStar = this && this.__importStar || function () {
  var ownKeys = function (o) {
    ownKeys = Object.getOwnPropertyNames || function (o) {
      var ar = [];
      for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
      return ar;
    };
    return ownKeys(o);
  };
  return function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    __setModuleDefault(result, mod);
    return result;
  };
}();
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.logger = void 0;
exports.getSummary = getSummary;
const core = __importStar(__webpack_require__(659));
exports.logger = {
  log: core.info,
  debug: core.debug,
  info: core.info,
  warn: core.warning,
  error: core.error
};
function getSummary({
  title,
  url
}) {
  const output = [`## ${title}`, `[View bundle analysis report](${url}?utm_source=github&utm_campaign=github-action-summary)`, '---', `<sup>Generated by [RelativeCI](https://relative-ci.com/?utm_source=github&utm_campaign=github-action-summary)</sup>`];
  return output.join('\n\n');
}

/***/ }),

/***/ 831:
/***/ ((module) => {

module.exports = require("@actions/github");

/***/ }),

/***/ 885:
/***/ ((module) => {

module.exports = require("@relative-ci/core/utils");

/***/ }),

/***/ 896:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 923:
/***/ ((module) => {

module.exports = require("@relative-ci/core/artifacts");

/***/ }),

/***/ 928:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 956:
/***/ ((module) => {

module.exports = require("@relative-ci/core/ingest");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(618);
/******/ 	
/******/ })()
;