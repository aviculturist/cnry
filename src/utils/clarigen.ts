

export type ClarityAbiTypeBuffer = { buffer: { length: number } };
export type ClarityAbiTypeStringAscii = { 'string-ascii': { length: number } };
export type ClarityAbiTypeStringUtf8 = { 'string-utf8': { length: number } };
export type ClarityAbiTypeResponse = {
  response: { ok: ClarityAbiType; error: ClarityAbiType };
};
export type ClarityAbiTypeOptional = { optional: ClarityAbiType };
export type ClarityAbiTypeTuple = {
  tuple: readonly { name: string; type: ClarityAbiType }[];
};
export type ClarityAbiTypeList = {
  list: { type: ClarityAbiType; length: number };
};

export type ClarityAbiTypeUInt128 = 'uint128';
export type ClarityAbiTypeInt128 = 'int128';
export type ClarityAbiTypeBool = 'bool';
export type ClarityAbiTypePrincipal = 'principal';
export type ClarityAbiTypeTraitReference = 'trait_reference';
export type ClarityAbiTypeNone = 'none';

export type ClarityAbiTypePrimitive =
  | ClarityAbiTypeUInt128
  | ClarityAbiTypeInt128
  | ClarityAbiTypeBool
  | ClarityAbiTypePrincipal
  | ClarityAbiTypeTraitReference
  | ClarityAbiTypeNone;

export type ClarityAbiType =
  | ClarityAbiTypePrimitive
  | ClarityAbiTypeBuffer
  | ClarityAbiTypeResponse
  | ClarityAbiTypeOptional
  | ClarityAbiTypeTuple
  | ClarityAbiTypeList
  | ClarityAbiTypeStringAscii
  | ClarityAbiTypeStringUtf8
  | ClarityAbiTypeTraitReference;

export interface ClarityAbiArg {
  name: string;
  type: ClarityAbiType;
}

export interface ClarityAbiFunction {
  name: string;
  access: 'private' | 'public' | 'read_only';
  args: ClarityAbiArg[];
  outputs: {
    type: ClarityAbiType;
  };
}

export type TypedAbiArg<T, N extends string> = { _t?: T; name: N };

export type TypedAbiFunction<T extends TypedAbiArg<unknown, string>[], R> =
  & ClarityAbiFunction
  & {
    _t?: T;
    _r?: R;
  };

export interface ClarityAbiVariable {
  name: string;
  access: 'variable' | 'constant';
  type: ClarityAbiType;
}

export type TypedAbiVariable<T> = ClarityAbiVariable & {
  defaultValue: T;
};

export interface ClarityAbiMap {
  name: string;
  key: ClarityAbiType;
  value: ClarityAbiType;
}

export type TypedAbiMap<K, V> = ClarityAbiMap & {
  _k?: K;
  _v?: V;
};

export interface ClarityAbiTypeFungibleToken {
  name: string;
}

export interface ClarityAbiTypeNonFungibleToken<T = unknown> {
  name: string;
  type: ClarityAbiType;
  _t?: T;
}

export interface ClarityAbi {
  functions: ClarityAbiFunction[];
  variables: ClarityAbiVariable[];
  maps: ClarityAbiMap[];
  fungible_tokens: ClarityAbiTypeFungibleToken[];
  non_fungible_tokens: readonly ClarityAbiTypeNonFungibleToken<unknown>[];
}

export type TypedAbi = Readonly<{
  functions: {
    [key: string]: TypedAbiFunction<TypedAbiArg<unknown, string>[], unknown>;
  };
  variables: {
    [key: string]: TypedAbiVariable<unknown>;
  };
  maps: {
    [key: string]: TypedAbiMap<unknown, unknown>;
  };
  constants: {
    [key: string]: unknown;
  };
  fungible_tokens: Readonly<ClarityAbiTypeFungibleToken[]>;
  non_fungible_tokens: Readonly<ClarityAbiTypeNonFungibleToken<unknown>[]>;
  contractName: string;
  contractFile?: string;
}>;

export interface ResponseOk<T, E> {
  value: T;
  isOk: true;
  _e?: E;
}

export interface ResponseErr<T, E> {
  value: E;
  isOk: false;
  _o?: T;
}

export type Response<Ok, Err> = ResponseOk<Ok, Err> | ResponseErr<Ok, Err>;

export type OkType<R> = R extends ResponseOk<infer V, unknown> ? V : never;
export type ErrType<R> = R extends ResponseErr<unknown, infer V> ? V : never;



export const contracts = {
  cnry: {
  "functions": {
    getTime: {"name":"get-time","access":"private","args":[],"outputs":{"type":"uint128"}} as TypedAbiFunction<[], bigint>,
    isOwner: {"name":"is-owner","access":"private","args":[{"name":"tokenId","type":"uint128"}],"outputs":{"type":"bool"}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">], boolean>,
    isValidKeepaliveExpiry: {"name":"is-valid-keepaliveExpiry","access":"private","args":[{"name":"keepaliveExpiry","type":"uint128"}],"outputs":{"type":"bool"}} as TypedAbiFunction<[keepaliveExpiry: TypedAbiArg<number | bigint, "keepaliveExpiry">], boolean>,
    isWithinKeepaliveExpiry: {"name":"is-within-keepaliveExpiry","access":"private","args":[{"name":"keepaliveTimestamp","type":"uint128"},{"name":"keepaliveExpiry","type":"uint128"},{"name":"tokenId","type":"uint128"}],"outputs":{"type":"bool"}} as TypedAbiFunction<[keepaliveTimestamp: TypedAbiArg<number | bigint, "keepaliveTimestamp">, keepaliveExpiry: TypedAbiArg<number | bigint, "keepaliveExpiry">, tokenId: TypedAbiArg<number | bigint, "tokenId">], boolean>,
    hatch: {"name":"hatch","access":"public","args":[{"name":"cnryName","type":{"string-utf8":{"length":32}}},{"name":"cnryStatement","type":{"string-utf8":{"length":280}}}],"outputs":{"type":{"response":{"ok":"uint128","error":"uint128"}}}} as TypedAbiFunction<[cnryName: TypedAbiArg<string, "cnryName">, cnryStatement: TypedAbiArg<string, "cnryStatement">], Response<bigint, bigint>>,
    keepalive: {"name":"keepalive","access":"public","args":[{"name":"tokenId","type":"uint128"}],"outputs":{"type":{"response":{"ok":"uint128","error":"uint128"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">], Response<bigint, bigint>>,
    setBaseUri: {"name":"set-base-uri","access":"public","args":[{"name":"new-base-uri","type":{"string-ascii":{"length":210}}}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[newBaseUri: TypedAbiArg<string, "newBaseUri">], Response<boolean, bigint>>,
    setHatchPrice: {"name":"set-hatchPrice","access":"public","args":[{"name":"new-hatchPrice","type":"uint128"}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[newHatchPrice: TypedAbiArg<number | bigint, "newHatchPrice">], Response<boolean, bigint>>,
    setKeepaliveExpiry: {"name":"set-keepaliveExpiry","access":"public","args":[{"name":"tokenId","type":"uint128"},{"name":"keepaliveExpiry","type":"uint128"}],"outputs":{"type":{"response":{"ok":"uint128","error":"uint128"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">, keepaliveExpiry: TypedAbiArg<number | bigint, "keepaliveExpiry">], Response<bigint, bigint>>,
    setKeepalivePrice: {"name":"set-keepalivePrice","access":"public","args":[{"name":"new-keepalivePrice","type":"uint128"}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[newKeepalivePrice: TypedAbiArg<number | bigint, "newKeepalivePrice">], Response<boolean, bigint>>,
    setName: {"name":"set-name","access":"public","args":[{"name":"tokenId","type":"uint128"},{"name":"cnryName","type":{"string-utf8":{"length":32}}}],"outputs":{"type":{"response":{"ok":"uint128","error":"uint128"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">, cnryName: TypedAbiArg<string, "cnryName">], Response<bigint, bigint>>,
    setProof: {"name":"set-proof","access":"public","args":[{"name":"tokenId","type":"uint128"},{"name":"cnryProof","type":{"string-ascii":{"length":210}}}],"outputs":{"type":{"response":{"ok":"uint128","error":"uint128"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">, cnryProof: TypedAbiArg<string, "cnryProof">], Response<bigint, bigint>>,
    setStatement: {"name":"set-statement","access":"public","args":[{"name":"tokenId","type":"uint128"},{"name":"cnryStatement","type":{"string-utf8":{"length":280}}}],"outputs":{"type":{"response":{"ok":"uint128","error":"uint128"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">, cnryStatement: TypedAbiArg<string, "cnryStatement">], Response<bigint, bigint>>,
    setUri: {"name":"set-uri","access":"public","args":[{"name":"tokenId","type":"uint128"},{"name":"cnryUri","type":{"string-ascii":{"length":210}}}],"outputs":{"type":{"response":{"ok":"uint128","error":"uint128"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">, cnryUri: TypedAbiArg<string, "cnryUri">], Response<bigint, bigint>>,
    setWatchPrice: {"name":"set-watchPrice","access":"public","args":[{"name":"new-watchPrice","type":"uint128"}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[newWatchPrice: TypedAbiArg<number | bigint, "newWatchPrice">], Response<boolean, bigint>>,
    transfer: {"name":"transfer","access":"public","args":[{"name":"tokenId","type":"uint128"},{"name":"sender","type":"principal"},{"name":"recipient","type":"principal"}],"outputs":{"type":{"response":{"ok":"none","error":"uint128"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">, sender: TypedAbiArg<string, "sender">, recipient: TypedAbiArg<string, "recipient">], Response<null, bigint>>,
    watch: {"name":"watch","access":"public","args":[{"name":"tokenId","type":"uint128"}],"outputs":{"type":{"response":{"ok":"uint128","error":"uint128"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">], Response<bigint, bigint>>,
    getBaseUri: {"name":"get-base-uri","access":"read_only","args":[{"name":"id","type":"uint128"}],"outputs":{"type":{"string-ascii":{"length":210}}}} as TypedAbiFunction<[id: TypedAbiArg<number | bigint, "id">], string>,
    getHatchPrice: {"name":"get-hatchPrice","access":"read_only","args":[],"outputs":{"type":"uint128"}} as TypedAbiFunction<[], bigint>,
    getKeepaliveExpiry: {"name":"get-keepaliveExpiry","access":"read_only","args":[{"name":"tokenId","type":"uint128"}],"outputs":{"type":{"response":{"ok":"uint128","error":"uint128"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">], Response<bigint, bigint>>,
    getKeepalivePrice: {"name":"get-keepalivePrice","access":"read_only","args":[],"outputs":{"type":"uint128"}} as TypedAbiFunction<[], bigint>,
    getKeepaliveTimestamp: {"name":"get-keepaliveTimestamp","access":"read_only","args":[{"name":"tokenId","type":"uint128"}],"outputs":{"type":{"response":{"ok":"uint128","error":"uint128"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">], Response<bigint, bigint>>,
    getLastTokenId: {"name":"get-last-token-id","access":"read_only","args":[],"outputs":{"type":{"response":{"ok":"uint128","error":"none"}}}} as TypedAbiFunction<[], Response<bigint, null>>,
    getMetadata: {"name":"get-metadata","access":"read_only","args":[{"name":"tokenId","type":"uint128"}],"outputs":{"type":{"optional":{"tuple":[{"name":"cnryKeeper","type":"principal"},{"name":"cnryName","type":{"string-utf8":{"length":32}}},{"name":"cnryProof","type":{"optional":{"string-ascii":{"length":210}}}},{"name":"cnryStatement","type":{"string-utf8":{"length":280}}},{"name":"cnryUri","type":{"optional":{"string-ascii":{"length":210}}}},{"name":"hatchedTimestamp","type":"uint128"},{"name":"index","type":"uint128"},{"name":"keepaliveExpiry","type":"uint128"},{"name":"keepaliveTimestamp","type":"uint128"}]}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">], {
  "cnryKeeper": string;
  "cnryName": string;
  "cnryProof": string | null;
  "cnryStatement": string;
  "cnryUri": string | null;
  "hatchedTimestamp": bigint;
  "index": bigint;
  "keepaliveExpiry": bigint;
  "keepaliveTimestamp": bigint;
} | null>,
    getOwner: {"name":"get-owner","access":"read_only","args":[{"name":"tokenId","type":"uint128"}],"outputs":{"type":{"response":{"ok":{"optional":"principal"},"error":"none"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">], Response<string | null, null>>,
    getTokenUri: {"name":"get-token-uri","access":"read_only","args":[{"name":"tokenId","type":"uint128"}],"outputs":{"type":{"response":{"ok":{"optional":{"string-ascii":{"length":210}}},"error":"uint128"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">], Response<string | null, bigint>>,
    getWatchPrice: {"name":"get-watchPrice","access":"read_only","args":[],"outputs":{"type":"uint128"}} as TypedAbiFunction<[], bigint>,
    getWatcherCount: {"name":"get-watcher-count","access":"read_only","args":[{"name":"tokenId","type":"uint128"}],"outputs":{"type":{"response":{"ok":{"tuple":[{"name":"count","type":"uint128"}]},"error":"none"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">], Response<{
  "count": bigint;
}, null>>,
    isAlive: {"name":"is-alive","access":"read_only","args":[{"name":"tokenId","type":"uint128"}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">], Response<boolean, bigint>>
  },
  "maps": {
    cnrys: {"name":"cnrys","key":{"tuple":[{"name":"tokenId","type":"uint128"}]},"value":{"tuple":[{"name":"cnryKeeper","type":"principal"},{"name":"cnryName","type":{"string-utf8":{"length":32}}},{"name":"cnryProof","type":{"optional":{"string-ascii":{"length":210}}}},{"name":"cnryStatement","type":{"string-utf8":{"length":280}}},{"name":"cnryUri","type":{"optional":{"string-ascii":{"length":210}}}},{"name":"hatchedTimestamp","type":"uint128"},{"name":"index","type":"uint128"},{"name":"keepaliveExpiry","type":"uint128"},{"name":"keepaliveTimestamp","type":"uint128"}]}} as TypedAbiMap<{
  "tokenId": number | bigint;
}, {
  "cnryKeeper": string;
  "cnryName": string;
  "cnryProof": string | null;
  "cnryStatement": string;
  "cnryUri": string | null;
  "hatchedTimestamp": bigint;
  "index": bigint;
  "keepaliveExpiry": bigint;
  "keepaliveTimestamp": bigint;
}>,
    watcherCount: {"name":"watcher-count","key":{"tuple":[{"name":"tokenId","type":"uint128"}]},"value":{"tuple":[{"name":"count","type":"uint128"}]}} as TypedAbiMap<{
  "tokenId": number | bigint;
}, {
  "count": bigint;
}>
  },
  "variables": {
    AVICULTURIST: {
  name: "AVICULTURIST",
  type: "principal",
  access: "constant",
} as TypedAbiVariable<string>,
    DEFAULT_KEEPALIVE_EXPIRY: {
  name: "DEFAULT_KEEPALIVE_EXPIRY",
  type: "uint128",
  access: "constant",
} as TypedAbiVariable<bigint>,
    ERR_CNRY_EXISTS: {
  name: "ERR_CNRY_EXISTS",
  type: {
    response: {
      ok: "none",
      error: "uint128",
    },
  },
  access: "constant",
} as TypedAbiVariable<Response<null, bigint>>,
    ERR_CNRY_EXPIRED: {
  name: "ERR_CNRY_EXPIRED",
  type: {
    response: {
      ok: "none",
      error: "uint128",
    },
  },
  access: "constant",
} as TypedAbiVariable<Response<null, bigint>>,
    ERR_CONTRACT_CALL: {
  name: "ERR_CONTRACT_CALL",
  type: {
    response: {
      ok: "none",
      error: "uint128",
    },
  },
  access: "constant",
} as TypedAbiVariable<Response<null, bigint>>,
    ERR_COUNT: {
  name: "ERR_COUNT",
  type: {
    response: {
      ok: "none",
      error: "uint128",
    },
  },
  access: "constant",
} as TypedAbiVariable<Response<null, bigint>>,
    ERR_FAILED_TO_TRANSFER: {
  name: "ERR_FAILED_TO_TRANSFER",
  type: {
    response: {
      ok: "none",
      error: "uint128",
    },
  },
  access: "constant",
} as TypedAbiVariable<Response<null, bigint>>,
    ERR_INSUFFICIENT_BALANCE: {
  name: "ERR_INSUFFICIENT_BALANCE",
  type: {
    response: {
      ok: "none",
      error: "uint128",
    },
  },
  access: "constant",
} as TypedAbiVariable<Response<null, bigint>>,
    ERR_INVALID_KEEPALIVE_EXPIRY: {
  name: "ERR_INVALID_KEEPALIVE_EXPIRY",
  type: {
    response: {
      ok: "none",
      error: "uint128",
    },
  },
  access: "constant",
} as TypedAbiVariable<Response<null, bigint>>,
    ERR_NOT_AUTHORIZED: {
  name: "ERR_NOT_AUTHORIZED",
  type: {
    response: {
      ok: "none",
      error: "uint128",
    },
  },
  access: "constant",
} as TypedAbiVariable<Response<null, bigint>>,
    ERR_NOT_FOUND: {
  name: "ERR_NOT_FOUND",
  type: {
    response: {
      ok: "none",
      error: "uint128",
    },
  },
  access: "constant",
} as TypedAbiVariable<Response<null, bigint>>,
    baseUri: {
  name: "base-uri",
  type: {
    "string-ascii": {
      length: 210,
    },
  },
  access: "variable",
} as TypedAbiVariable<string>,
    hatchPrice: {
  name: "hatchPrice",
  type: "uint128",
  access: "variable",
} as TypedAbiVariable<bigint>,
    keepalivePrice: {
  name: "keepalivePrice",
  type: "uint128",
  access: "variable",
} as TypedAbiVariable<bigint>,
    lastId: {
  name: "lastId",
  type: "uint128",
  access: "variable",
} as TypedAbiVariable<bigint>,
    watchPrice: {
  name: "watchPrice",
  type: "uint128",
  access: "variable",
} as TypedAbiVariable<bigint>
  },
  constants: {
  AVICULTURIST: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  DEFAULT_KEEPALIVE_EXPIRY: 86400n,
  ERR_CNRY_EXISTS: {
    isOk: false,
    value: 409n,
  },
  ERR_CNRY_EXPIRED: {
    isOk: false,
    value: 501n,
  },
  ERR_CONTRACT_CALL: {
    isOk: false,
    value: 503n,
  },
  ERR_COUNT: {
    isOk: false,
    value: 502n,
  },
  ERR_FAILED_TO_TRANSFER: {
    isOk: false,
    value: 504n,
  },
  ERR_INSUFFICIENT_BALANCE: {
    isOk: false,
    value: 505n,
  },
  ERR_INVALID_KEEPALIVE_EXPIRY: {
    isOk: false,
    value: 506n,
  },
  ERR_NOT_AUTHORIZED: {
    isOk: false,
    value: 401n,
  },
  ERR_NOT_FOUND: {
    isOk: false,
    value: 404n,
  },
  baseUri: "https://cnry.org/?id={id}",
  hatchPrice: 1000000n,
  keepalivePrice: 1000000n,
  lastId: 0n,
  watchPrice: 1000000n,
},
  "non_fungible_tokens": [
    {"name":"CNRY","type":"uint128"}
  ],
  "fungible_tokens":[],"epoch":"Epoch2_05","clarity_version":"Clarity1",
  contractName: 'cnry',
  },
maintenance: {
  "functions": {
    addMaintenanceMode: {"name":"addMaintenanceMode","access":"public","args":[{"name":"commitHash","type":{"string-ascii":{"length":7}}},{"name":"maintenance","type":"bool"},{"name":"wall","type":{"string-ascii":{"length":280}}}],"outputs":{"type":{"response":{"ok":"uint128","error":{"response":{"ok":"none","error":"uint128"}}}}}} as TypedAbiFunction<[commitHash: TypedAbiArg<string, "commitHash">, maintenance: TypedAbiArg<boolean, "maintenance">, wall: TypedAbiArg<string, "wall">], Response<bigint, Response<null, bigint>>>,
    setMaintenance: {"name":"setMaintenance","access":"public","args":[{"name":"commitHash","type":{"string-ascii":{"length":7}}},{"name":"maintenance","type":"bool"}],"outputs":{"type":{"response":{"ok":"uint128","error":{"response":{"ok":"none","error":"uint128"}}}}}} as TypedAbiFunction<[commitHash: TypedAbiArg<string, "commitHash">, maintenance: TypedAbiArg<boolean, "maintenance">], Response<bigint, Response<null, bigint>>>,
    setWall: {"name":"setWall","access":"public","args":[{"name":"commitHash","type":{"string-ascii":{"length":7}}},{"name":"wall","type":{"string-ascii":{"length":280}}}],"outputs":{"type":{"response":{"ok":"uint128","error":{"response":{"ok":"none","error":"uint128"}}}}}} as TypedAbiFunction<[commitHash: TypedAbiArg<string, "commitHash">, wall: TypedAbiArg<string, "wall">], Response<bigint, Response<null, bigint>>>,
    getMaintenanceMode: {"name":"getMaintenanceMode","access":"read_only","args":[{"name":"commitHash","type":{"string-ascii":{"length":7}}}],"outputs":{"type":{"optional":{"tuple":[{"name":"maintenance","type":"bool"},{"name":"wall","type":{"string-ascii":{"length":280}}}]}}}} as TypedAbiFunction<[commitHash: TypedAbiArg<string, "commitHash">], {
  "maintenance": boolean;
  "wall": string;
} | null>
  },
  "maps": {
    maintenanceMode: {"name":"maintenanceMode","key":{"tuple":[{"name":"commitHash","type":{"string-ascii":{"length":7}}}]},"value":{"tuple":[{"name":"maintenance","type":"bool"},{"name":"wall","type":{"string-ascii":{"length":280}}}]}} as TypedAbiMap<{
  "commitHash": string;
}, {
  "maintenance": boolean;
  "wall": string;
}>
  },
  "variables": {
    AVICULTURIST: {
  name: "AVICULTURIST",
  type: "principal",
  access: "constant",
} as TypedAbiVariable<string>,
    ERR_FOUND: {
  name: "ERR_FOUND",
  type: {
    response: {
      ok: "none",
      error: "uint128",
    },
  },
  access: "constant",
} as TypedAbiVariable<Response<null, bigint>>,
    ERR_NOT_AUTHORIZED: {
  name: "ERR_NOT_AUTHORIZED",
  type: {
    response: {
      ok: "none",
      error: "uint128",
    },
  },
  access: "constant",
} as TypedAbiVariable<Response<null, bigint>>,
    ERR_NOT_FOUND: {
  name: "ERR_NOT_FOUND",
  type: {
    response: {
      ok: "none",
      error: "uint128",
    },
  },
  access: "constant",
} as TypedAbiVariable<Response<null, bigint>>
  },
  constants: {
  AVICULTURIST: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  ERR_FOUND: {
    isOk: false,
    value: 500n,
  },
  ERR_NOT_AUTHORIZED: {
    isOk: false,
    value: 401n,
  },
  ERR_NOT_FOUND: {
    isOk: false,
    value: 404n,
  },
},
  "non_fungible_tokens": [
    
  ],
  "fungible_tokens":[],"epoch":"Epoch2_05","clarity_version":"Clarity1",
  contractName: 'maintenance',
  },
nftTrait: {
  "functions": {
    
  },
  "maps": {
    
  },
  "variables": {
    
  },
  constants: {},
  "non_fungible_tokens": [
    
  ],
  "fungible_tokens":[],"epoch":"Epoch2_05","clarity_version":"Clarity1",
  contractName: 'nft-trait',
  },
watcher: {
  "functions": {
    calledFromWatched: {"name":"called-from-watched","access":"private","args":[],"outputs":{"type":"bool"}} as TypedAbiFunction<[], boolean>,
    addWatchedContract: {"name":"add-watched-contract","access":"public","args":[],"outputs":{"type":{"response":{"ok":"principal","error":"uint128"}}}} as TypedAbiFunction<[], Response<string, bigint>>,
    getWatchedContract: {"name":"get-watched-contract","access":"public","args":[],"outputs":{"type":{"response":{"ok":{"optional":"principal"},"error":"none"}}}} as TypedAbiFunction<[], Response<string | null, null>>,
    transfer: {"name":"transfer","access":"public","args":[{"name":"tokenId","type":"uint128"},{"name":"sender","type":"principal"},{"name":"recipient","type":"principal"}],"outputs":{"type":{"response":{"ok":"none","error":"uint128"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">, sender: TypedAbiArg<string, "sender">, recipient: TypedAbiArg<string, "recipient">], Response<null, bigint>>,
    watchToken: {"name":"watch-token","access":"public","args":[{"name":"contract-name","type":{"string-ascii":{"length":80}}},{"name":"tokenId","type":"uint128"},{"name":"watcherAddress","type":"principal"}],"outputs":{"type":{"response":{"ok":"uint128","error":"uint128"}}}} as TypedAbiFunction<[contractName: TypedAbiArg<string, "contractName">, tokenId: TypedAbiArg<number | bigint, "tokenId">, watcherAddress: TypedAbiArg<string, "watcherAddress">], Response<bigint, bigint>>,
    getLastTokenId: {"name":"get-last-token-id","access":"read_only","args":[],"outputs":{"type":{"response":{"ok":"uint128","error":"none"}}}} as TypedAbiFunction<[], Response<bigint, null>>,
    getMetadata: {"name":"get-metadata","access":"read_only","args":[{"name":"tokenId","type":"uint128"}],"outputs":{"type":{"optional":{"tuple":[{"name":"contractTokenId","type":"uint128"},{"name":"watcherAddress","type":"principal"}]}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">], {
  "contractTokenId": bigint;
  "watcherAddress": string;
} | null>,
    getOwner: {"name":"get-owner","access":"read_only","args":[{"name":"tokenId","type":"uint128"}],"outputs":{"type":{"response":{"ok":{"optional":"principal"},"error":"none"}}}} as TypedAbiFunction<[tokenId: TypedAbiArg<number | bigint, "tokenId">], Response<string | null, null>>,
    getTokenUri: {"name":"get-token-uri","access":"read_only","args":[{"name":"id","type":"uint128"}],"outputs":{"type":{"response":{"ok":{"optional":{"string-ascii":{"length":210}}},"error":"none"}}}} as TypedAbiFunction<[id: TypedAbiArg<number | bigint, "id">], Response<string | null, null>>
  },
  "maps": {
    watchedContract: {"name":"watched-contract","key":"bool","value":"principal"} as TypedAbiMap<boolean, string>,
    watchers: {"name":"watchers","key":{"tuple":[{"name":"tokenId","type":"uint128"}]},"value":{"tuple":[{"name":"contractTokenId","type":"uint128"},{"name":"watcherAddress","type":"principal"}]}} as TypedAbiMap<{
  "tokenId": number | bigint;
}, {
  "contractTokenId": bigint;
  "watcherAddress": string;
}>
  },
  "variables": {
    AVICULTURIST: {
  name: "AVICULTURIST",
  type: "principal",
  access: "constant",
} as TypedAbiVariable<string>,
    ERR_NOT_CALLED_FROM_CONTRACT: {
  name: "ERR_NOT_CALLED_FROM_CONTRACT",
  type: {
    response: {
      ok: "none",
      error: "uint128",
    },
  },
  access: "constant",
} as TypedAbiVariable<Response<null, bigint>>,
    ERR_WATCHED_CONTRACT_SET: {
  name: "ERR_WATCHED_CONTRACT_SET",
  type: {
    response: {
      ok: "none",
      error: "uint128",
    },
  },
  access: "constant",
} as TypedAbiVariable<Response<null, bigint>>,
    baseUri: {
  name: "baseUri",
  type: {
    "string-ascii": {
      length: 210,
    },
  },
  access: "variable",
} as TypedAbiVariable<string>,
    lastId: {
  name: "lastId",
  type: "uint128",
  access: "variable",
} as TypedAbiVariable<bigint>
  },
  constants: {
  AVICULTURIST: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  ERR_NOT_CALLED_FROM_CONTRACT: {
    isOk: false,
    value: 405n,
  },
  ERR_WATCHED_CONTRACT_SET: {
    isOk: false,
    value: 406n,
  },
  baseUri: "ipfs://Qm/{id}",
  lastId: 0n,
},
  "non_fungible_tokens": [
    {"name":"WATCHER","type":"uint128"}
  ],
  "fungible_tokens":[],"epoch":"Epoch2_05","clarity_version":"Clarity1",
  contractName: 'watcher',
  }
} as const;



export const accounts = {"deployer":{"address":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM","balance":100000000000000},"wallet_1":{"address":"ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5","balance":100000000000000},"wallet_2":{"address":"ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG","balance":100000000000000},"wallet_3":{"address":"ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC","balance":100000000000000},"wallet_4":{"address":"ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND","balance":100000000000000},"wallet_5":{"address":"ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB","balance":100000000000000},"wallet_6":{"address":"ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0","balance":100000000000000},"wallet_7":{"address":"ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ","balance":100000000000000},"wallet_8":{"address":"ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP","balance":100000000000000},"wallet_9":{"address":"STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6","balance":100000000000000}} as const;

export const simnet = {
  accounts,
  contracts
} as const;
