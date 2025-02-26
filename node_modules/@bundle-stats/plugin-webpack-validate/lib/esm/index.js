import { validate } from 'superstruct';
import _ from 'lodash';
import { INVALID } from './i18n.js';
import { WebpackSourceStruct } from './schemas.js';

function extractFailedStructure(webpackSource, failurePath) {
    if (failurePath.length === 0) {
        return null;
    }
    const source = _.get(webpackSource, failurePath);
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
    const res = validate(webpackSource, WebpackSourceStruct);
    if (!res?.[0]) {
        return '';
    }
    // Return only the first failure
    const failures = res[0].failures();
    const output = [`${INVALID}`];
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

export { index as default };
//# sourceMappingURL=index.js.map
