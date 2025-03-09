import { type, number, string, optional, array, nullable, union, boolean, intersection, nonempty } from 'superstruct';

const WebpackSourceAssetStruct = type({
    name: string(),
    size: number(),
});
const WebpackSourceAssetHiddenStruct = type({
    type: string(),
    filteredChildren: number(),
    size: number(),
});
const WebpackSourceModuleStruct = type({
    name: string(),
    size: number(),
    chunks: array(nullable(union([number(), string()]))),
    modules: optional(array(type({ name: string(), size: number() }))),
});
const WebpackSourceModuleHiddenStruct = type({
    type: string(),
    filteredChildren: number(),
    size: number(),
});
const WebpackSourceChunkStruct = type({
    id: nullable(union([number(), string()])),
    entry: boolean(),
    initial: boolean(),
    names: array(string()),
    files: array(string()),
});
const WebpackSourceStruct = type({
    hash: optional(string()),
    builtAt: optional(number()),
    assets: intersection([
        array(union([WebpackSourceAssetStruct, WebpackSourceAssetHiddenStruct])),
        nonempty(array()),
    ]),
    modules: optional(array(union([WebpackSourceModuleStruct, WebpackSourceModuleHiddenStruct]))),
    chunks: optional(array(WebpackSourceChunkStruct)),
});

export { WebpackSourceAssetHiddenStruct, WebpackSourceAssetStruct, WebpackSourceChunkStruct, WebpackSourceModuleHiddenStruct, WebpackSourceModuleStruct, WebpackSourceStruct };
//# sourceMappingURL=schemas.js.map
