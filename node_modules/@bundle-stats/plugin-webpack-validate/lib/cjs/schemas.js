'use strict';

var superstruct = require('superstruct');

const WebpackSourceAssetStruct = superstruct.type({
    name: superstruct.string(),
    size: superstruct.number(),
});
const WebpackSourceAssetHiddenStruct = superstruct.type({
    type: superstruct.string(),
    filteredChildren: superstruct.number(),
    size: superstruct.number(),
});
const WebpackSourceModuleStruct = superstruct.type({
    name: superstruct.string(),
    size: superstruct.number(),
    chunks: superstruct.array(superstruct.nullable(superstruct.union([superstruct.number(), superstruct.string()]))),
    modules: superstruct.optional(superstruct.array(superstruct.type({ name: superstruct.string(), size: superstruct.number() }))),
});
const WebpackSourceModuleHiddenStruct = superstruct.type({
    type: superstruct.string(),
    filteredChildren: superstruct.number(),
    size: superstruct.number(),
});
const WebpackSourceChunkStruct = superstruct.type({
    id: superstruct.nullable(superstruct.union([superstruct.number(), superstruct.string()])),
    entry: superstruct.boolean(),
    initial: superstruct.boolean(),
    names: superstruct.array(superstruct.string()),
    files: superstruct.array(superstruct.string()),
});
const WebpackSourceStruct = superstruct.type({
    hash: superstruct.optional(superstruct.string()),
    builtAt: superstruct.optional(superstruct.number()),
    assets: superstruct.intersection([
        superstruct.array(superstruct.union([WebpackSourceAssetStruct, WebpackSourceAssetHiddenStruct])),
        superstruct.nonempty(superstruct.array()),
    ]),
    modules: superstruct.optional(superstruct.array(superstruct.union([WebpackSourceModuleStruct, WebpackSourceModuleHiddenStruct]))),
    chunks: superstruct.optional(superstruct.array(WebpackSourceChunkStruct)),
});

exports.WebpackSourceAssetHiddenStruct = WebpackSourceAssetHiddenStruct;
exports.WebpackSourceAssetStruct = WebpackSourceAssetStruct;
exports.WebpackSourceChunkStruct = WebpackSourceChunkStruct;
exports.WebpackSourceModuleHiddenStruct = WebpackSourceModuleHiddenStruct;
exports.WebpackSourceModuleStruct = WebpackSourceModuleStruct;
exports.WebpackSourceStruct = WebpackSourceStruct;
//# sourceMappingURL=schemas.js.map
