export declare const WebpackSourceAssetStruct: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<{
    name: string;
    size: number;
}, {
    name: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string, null>;
    size: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<number, null>;
}>;
export declare const WebpackSourceAssetHiddenStruct: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<{
    size: number;
    type: string;
    filteredChildren: number;
}, {
    type: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string, null>;
    filteredChildren: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<number, null>;
    size: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<number, null>;
}>;
export declare const WebpackSourceModuleStruct: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<{
    name: string;
    size: number;
    chunks: (string | number | null)[];
    modules?: {
        name: string;
        size: number;
    }[] | undefined;
}, {
    name: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string, null>;
    size: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<number, null>;
    chunks: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<(string | number | null)[], import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string | number | null, null>>;
    modules: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<{
        name: string;
        size: number;
    }[] | undefined, import("superstruct", { with: { "resolution-mode": "import" } }).Struct<{
        name: string;
        size: number;
    }, {
        name: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string, null>;
        size: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<number, null>;
    }>>;
}>;
export declare const WebpackSourceModuleHiddenStruct: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<{
    size: number;
    type: string;
    filteredChildren: number;
}, {
    type: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string, null>;
    filteredChildren: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<number, null>;
    size: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<number, null>;
}>;
export declare const WebpackSourceChunkStruct: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<{
    id: string | number | null;
    entry: boolean;
    initial: boolean;
    names: string[];
    files: string[];
}, {
    id: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string | number | null, null>;
    entry: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<boolean, null>;
    initial: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<boolean, null>;
    names: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string[], import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string, null>>;
    files: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string[], import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string, null>>;
}>;
export declare const WebpackSourceStruct: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<{
    assets: ({
        name: string;
        size: number;
    } | {
        size: number;
        type: string;
        filteredChildren: number;
    })[] & unknown[];
    chunks?: {
        id: string | number | null;
        entry: boolean;
        initial: boolean;
        names: string[];
        files: string[];
    }[] | undefined;
    modules?: ({
        name: string;
        size: number;
        chunks: (string | number | null)[];
        modules?: {
            name: string;
            size: number;
        }[] | undefined;
    } | {
        size: number;
        type: string;
        filteredChildren: number;
    })[] | undefined;
    hash?: string | undefined;
    builtAt?: number | undefined;
}, {
    hash: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string | undefined, null>;
    builtAt: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<number | undefined, null>;
    assets: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<({
        name: string;
        size: number;
    } | {
        size: number;
        type: string;
        filteredChildren: number;
    })[] & unknown[], null>;
    modules: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<({
        name: string;
        size: number;
        chunks: (string | number | null)[];
        modules?: {
            name: string;
            size: number;
        }[] | undefined;
    } | {
        size: number;
        type: string;
        filteredChildren: number;
    })[] | undefined, import("superstruct", { with: { "resolution-mode": "import" } }).Struct<{
        name: string;
        size: number;
        chunks: (string | number | null)[];
        modules?: {
            name: string;
            size: number;
        }[] | undefined;
    } | {
        size: number;
        type: string;
        filteredChildren: number;
    }, null>>;
    chunks: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<{
        id: string | number | null;
        entry: boolean;
        initial: boolean;
        names: string[];
        files: string[];
    }[] | undefined, import("superstruct", { with: { "resolution-mode": "import" } }).Struct<{
        id: string | number | null;
        entry: boolean;
        initial: boolean;
        names: string[];
        files: string[];
    }, {
        id: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string | number | null, null>;
        entry: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<boolean, null>;
        initial: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<boolean, null>;
        names: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string[], import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string, null>>;
        files: import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string[], import("superstruct", { with: { "resolution-mode": "import" } }).Struct<string, null>>;
    }>>;
}>;
