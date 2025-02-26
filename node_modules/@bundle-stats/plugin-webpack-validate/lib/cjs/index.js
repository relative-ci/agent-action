'use strict';

var superstruct = require('superstruct');
var _ = require('lodash');
var i18n = require('./i18n.js');
var schemas = require('./schemas.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var ___default = /*#__PURE__*/_interopDefault(_);

function extractFailedStructure(webpackSource, failurePath) {
    if (failurePath.length === 0) {
        return null;
    }
    const source = ___default.default.get(webpackSource, failurePath);
    // Return source as if the failure paths are pointing to an object
    if (typeof source === 'object') {
        return {
            path: failurePath.join('.'),
            source,
        };
    }
    // Extract the parent object
    return extractFailedStructure(webpackSource, failurePath.slice(0, -1));
}
/**
 * Validate webpack source
 *
 * @param {Object} [webpackSource]
 * @return {String} Message, if invalid, empty string if valid
 */
var index = (webpackSource) => {
    const res = superstruct.validate(webpackSource, schemas.WebpackSourceStruct);
    if (!res?.[0]) {
        return '';
    }
    // Return only the first failure
    const failures = res[0].failures();
    const output = [`${i18n.INVALID}`];
    failures.forEach((failure) => {
        const failureOutput = ['', failure.message, `Path: ${failure.path.join('.')}`];
        const failedSource = extractFailedStructure(webpackSource, failure.path);
        if (failedSource) {
            failureOutput.push(`Failed structure(${failedSource.path}): ${JSON.stringify(failedSource.source, null, 2)}`);
        }
        output.push(failureOutput.join('\n'));
    });
    return output.join('\n');
};

module.exports = index;
//# sourceMappingURL=index.js.map
