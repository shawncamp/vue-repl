import { C as CancellationTokenSource, E as Emitter, K as KeyCode, a as KeyMod, M as MarkerSeverity, b as MarkerTag, P as Position, R as Range, S as Selection, c as SelectionDirection, T as Token, U as Uri, e as editor, l as languages } from './MonacoEditor-Cn2ixN1w.js';

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const monaco = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  CancellationTokenSource,
  Emitter,
  KeyCode,
  KeyMod,
  MarkerSeverity,
  MarkerTag,
  Position,
  Range,
  Selection,
  SelectionDirection,
  Token,
  Uri,
  editor,
  languages
}, Symbol.toStringTag, { value: 'Module' }));

let ShikiError$2 = class ShikiError extends Error {
  constructor(message) {
    super(message);
    this.name = "ShikiError";
  }
};

let ShikiError$1 = class ShikiError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ShikiError';
    }
};

function getHeapMax() {
    return 2147483648;
}
function _emscripten_get_now() {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
}
const alignUp = (x, multiple) => x + ((multiple - (x % multiple)) % multiple);
async function main(init) {
    let wasmMemory;
    let buffer;
    const binding = {};
    function updateGlobalBufferAndViews(buf) {
        buffer = buf;
        binding.HEAPU8 = new Uint8Array(buf);
        binding.HEAPU32 = new Uint32Array(buf);
    }
    function _emscripten_memcpy_big(dest, src, num) {
        binding.HEAPU8.copyWithin(dest, src, src + num);
    }
    function emscripten_realloc_buffer(size) {
        try {
            wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
            updateGlobalBufferAndViews(wasmMemory.buffer);
            return 1;
        }
        catch { }
    }
    function _emscripten_resize_heap(requestedSize) {
        const oldSize = binding.HEAPU8.length;
        requestedSize = requestedSize >>> 0;
        const maxHeapSize = getHeapMax();
        if (requestedSize > maxHeapSize)
            return false;
        for (let cutDown = 1; cutDown <= 4; cutDown *= 2) {
            let overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
            const newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
            const replacement = emscripten_realloc_buffer(newSize);
            if (replacement)
                return true;
        }
        return false;
    }
    const UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;
    function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead = 1024) {
        const endIdx = idx + maxBytesToRead;
        let endPtr = idx;
        while (heapOrArray[endPtr] && !(endPtr >= endIdx))
            ++endPtr;
        if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
            return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
        }
        let str = '';
        while (idx < endPtr) {
            let u0 = heapOrArray[idx++];
            if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue;
            }
            const u1 = heapOrArray[idx++] & 63;
            if ((u0 & 224) === 192) {
                str += String.fromCharCode(((u0 & 31) << 6) | u1);
                continue;
            }
            const u2 = heapOrArray[idx++] & 63;
            if ((u0 & 240) === 224) {
                u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
            }
            else {
                u0 = ((u0 & 7) << 18)
                    | (u1 << 12)
                    | (u2 << 6)
                    | (heapOrArray[idx++] & 63);
            }
            if (u0 < 65536) {
                str += String.fromCharCode(u0);
            }
            else {
                const ch = u0 - 65536;
                str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
            }
        }
        return str;
    }
    function UTF8ToString(ptr, maxBytesToRead) {
        return ptr ? UTF8ArrayToString(binding.HEAPU8, ptr, maxBytesToRead) : '';
    }
    const asmLibraryArg = {
        emscripten_get_now: _emscripten_get_now,
        emscripten_memcpy_big: _emscripten_memcpy_big,
        emscripten_resize_heap: _emscripten_resize_heap,
        fd_write: () => 0,
    };
    async function createWasm() {
        const info = {
            env: asmLibraryArg,
            wasi_snapshot_preview1: asmLibraryArg,
        };
        const exports = await init(info);
        wasmMemory = exports.memory;
        updateGlobalBufferAndViews(wasmMemory.buffer);
        Object.assign(binding, exports);
        binding.UTF8ToString = UTF8ToString;
    }
    await createWasm();
    return binding;
}

/* ---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *-------------------------------------------------------- */
let onigBinding = null;
// let defaultDebugCall = false
function throwLastOnigError(onigBinding) {
    throw new ShikiError$1(onigBinding.UTF8ToString(onigBinding.getLastOnigError()));
}
class UtfString {
    static _utf8ByteLength(str) {
        let result = 0;
        for (let i = 0, len = str.length; i < len; i++) {
            const charCode = str.charCodeAt(i);
            let codepoint = charCode;
            let wasSurrogatePair = false;
            if (charCode >= 0xD800 && charCode <= 0xDBFF) {
                // Hit a high surrogate, try to look for a matching low surrogate
                if (i + 1 < len) {
                    const nextCharCode = str.charCodeAt(i + 1);
                    if (nextCharCode >= 0xDC00 && nextCharCode <= 0xDFFF) {
                        // Found the matching low surrogate
                        codepoint = (((charCode - 0xD800) << 10) + 0x10000) | (nextCharCode - 0xDC00);
                        wasSurrogatePair = true;
                    }
                }
            }
            if (codepoint <= 0x7F)
                result += 1;
            else if (codepoint <= 0x7FF)
                result += 2;
            else if (codepoint <= 0xFFFF)
                result += 3;
            else
                result += 4;
            if (wasSurrogatePair)
                i++;
        }
        return result;
    }
    utf16Length;
    utf8Length;
    utf16Value;
    utf8Value;
    utf16OffsetToUtf8;
    utf8OffsetToUtf16;
    constructor(str) {
        const utf16Length = str.length;
        const utf8Length = UtfString._utf8ByteLength(str);
        const computeIndicesMapping = (utf8Length !== utf16Length);
        const utf16OffsetToUtf8 = computeIndicesMapping ? new Uint32Array(utf16Length + 1) : null;
        if (computeIndicesMapping)
            utf16OffsetToUtf8[utf16Length] = utf8Length;
        const utf8OffsetToUtf16 = computeIndicesMapping ? new Uint32Array(utf8Length + 1) : null;
        if (computeIndicesMapping)
            utf8OffsetToUtf16[utf8Length] = utf16Length;
        const utf8Value = new Uint8Array(utf8Length);
        let i8 = 0;
        for (let i16 = 0; i16 < utf16Length; i16++) {
            const charCode = str.charCodeAt(i16);
            let codePoint = charCode;
            let wasSurrogatePair = false;
            if (charCode >= 0xD800 && charCode <= 0xDBFF) {
                // Hit a high surrogate, try to look for a matching low surrogate
                if (i16 + 1 < utf16Length) {
                    const nextCharCode = str.charCodeAt(i16 + 1);
                    if (nextCharCode >= 0xDC00 && nextCharCode <= 0xDFFF) {
                        // Found the matching low surrogate
                        codePoint = (((charCode - 0xD800) << 10) + 0x10000) | (nextCharCode - 0xDC00);
                        wasSurrogatePair = true;
                    }
                }
            }
            if (computeIndicesMapping) {
                utf16OffsetToUtf8[i16] = i8;
                if (wasSurrogatePair)
                    utf16OffsetToUtf8[i16 + 1] = i8;
                if (codePoint <= 0x7F) {
                    utf8OffsetToUtf16[i8 + 0] = i16;
                }
                else if (codePoint <= 0x7FF) {
                    utf8OffsetToUtf16[i8 + 0] = i16;
                    utf8OffsetToUtf16[i8 + 1] = i16;
                }
                else if (codePoint <= 0xFFFF) {
                    utf8OffsetToUtf16[i8 + 0] = i16;
                    utf8OffsetToUtf16[i8 + 1] = i16;
                    utf8OffsetToUtf16[i8 + 2] = i16;
                }
                else {
                    utf8OffsetToUtf16[i8 + 0] = i16;
                    utf8OffsetToUtf16[i8 + 1] = i16;
                    utf8OffsetToUtf16[i8 + 2] = i16;
                    utf8OffsetToUtf16[i8 + 3] = i16;
                }
            }
            if (codePoint <= 0x7F) {
                utf8Value[i8++] = codePoint;
            }
            else if (codePoint <= 0x7FF) {
                utf8Value[i8++] = 0b11000000 | ((codePoint & 0b00000000000000000000011111000000) >>> 6);
                utf8Value[i8++] = 0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0);
            }
            else if (codePoint <= 0xFFFF) {
                utf8Value[i8++] = 0b11100000 | ((codePoint & 0b00000000000000001111000000000000) >>> 12);
                utf8Value[i8++] = 0b10000000 | ((codePoint & 0b00000000000000000000111111000000) >>> 6);
                utf8Value[i8++] = 0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0);
            }
            else {
                utf8Value[i8++] = 0b11110000 | ((codePoint & 0b00000000000111000000000000000000) >>> 18);
                utf8Value[i8++] = 0b10000000 | ((codePoint & 0b00000000000000111111000000000000) >>> 12);
                utf8Value[i8++] = 0b10000000 | ((codePoint & 0b00000000000000000000111111000000) >>> 6);
                utf8Value[i8++] = 0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0);
            }
            if (wasSurrogatePair)
                i16++;
        }
        this.utf16Length = utf16Length;
        this.utf8Length = utf8Length;
        this.utf16Value = str;
        this.utf8Value = utf8Value;
        this.utf16OffsetToUtf8 = utf16OffsetToUtf8;
        this.utf8OffsetToUtf16 = utf8OffsetToUtf16;
    }
    createString(onigBinding) {
        const result = onigBinding.omalloc(this.utf8Length);
        onigBinding.HEAPU8.set(this.utf8Value, result);
        return result;
    }
}
class OnigString {
    static LAST_ID = 0;
    static _sharedPtr = 0; // a pointer to a string of 10000 bytes
    static _sharedPtrInUse = false;
    id = (++OnigString.LAST_ID);
    _onigBinding;
    content;
    utf16Length;
    utf8Length;
    utf16OffsetToUtf8;
    utf8OffsetToUtf16;
    ptr;
    constructor(str) {
        if (!onigBinding)
            throw new ShikiError$1('Must invoke loadWasm first.');
        this._onigBinding = onigBinding;
        this.content = str;
        const utfString = new UtfString(str);
        this.utf16Length = utfString.utf16Length;
        this.utf8Length = utfString.utf8Length;
        this.utf16OffsetToUtf8 = utfString.utf16OffsetToUtf8;
        this.utf8OffsetToUtf16 = utfString.utf8OffsetToUtf16;
        if (this.utf8Length < 10000 && !OnigString._sharedPtrInUse) {
            if (!OnigString._sharedPtr)
                OnigString._sharedPtr = onigBinding.omalloc(10000);
            OnigString._sharedPtrInUse = true;
            onigBinding.HEAPU8.set(utfString.utf8Value, OnigString._sharedPtr);
            this.ptr = OnigString._sharedPtr;
        }
        else {
            this.ptr = utfString.createString(onigBinding);
        }
    }
    convertUtf8OffsetToUtf16(utf8Offset) {
        if (this.utf8OffsetToUtf16) {
            if (utf8Offset < 0)
                return 0;
            if (utf8Offset > this.utf8Length)
                return this.utf16Length;
            return this.utf8OffsetToUtf16[utf8Offset];
        }
        return utf8Offset;
    }
    convertUtf16OffsetToUtf8(utf16Offset) {
        if (this.utf16OffsetToUtf8) {
            if (utf16Offset < 0)
                return 0;
            if (utf16Offset > this.utf16Length)
                return this.utf8Length;
            return this.utf16OffsetToUtf8[utf16Offset];
        }
        return utf16Offset;
    }
    dispose() {
        if (this.ptr === OnigString._sharedPtr)
            OnigString._sharedPtrInUse = false;
        else
            this._onigBinding.ofree(this.ptr);
    }
}
class OnigScanner {
    _onigBinding;
    _ptr;
    constructor(patterns) {
        if (!onigBinding)
            throw new ShikiError$1('Must invoke loadWasm first.');
        const strPtrsArr = [];
        const strLenArr = [];
        for (let i = 0, len = patterns.length; i < len; i++) {
            const utfString = new UtfString(patterns[i]);
            strPtrsArr[i] = utfString.createString(onigBinding);
            strLenArr[i] = utfString.utf8Length;
        }
        const strPtrsPtr = onigBinding.omalloc(4 * patterns.length);
        onigBinding.HEAPU32.set(strPtrsArr, strPtrsPtr / 4);
        const strLenPtr = onigBinding.omalloc(4 * patterns.length);
        onigBinding.HEAPU32.set(strLenArr, strLenPtr / 4);
        const scannerPtr = onigBinding.createOnigScanner(strPtrsPtr, strLenPtr, patterns.length);
        for (let i = 0, len = patterns.length; i < len; i++)
            onigBinding.ofree(strPtrsArr[i]);
        onigBinding.ofree(strLenPtr);
        onigBinding.ofree(strPtrsPtr);
        if (scannerPtr === 0)
            throwLastOnigError(onigBinding);
        this._onigBinding = onigBinding;
        this._ptr = scannerPtr;
    }
    dispose() {
        this._onigBinding.freeOnigScanner(this._ptr);
    }
    findNextMatchSync(string, startPosition, arg) {
        // let debugCall = defaultDebugCall
        let options = 0 /* FindOption.None */;
        if (typeof arg === 'number') {
            // if (arg & FindOption.DebugCall)
            //   debugCall = true
            options = arg;
        }
        if (typeof string === 'string') {
            string = new OnigString(string);
            const result = this._findNextMatchSync(string, startPosition, false, options);
            string.dispose();
            return result;
        }
        return this._findNextMatchSync(string, startPosition, false, options);
    }
    _findNextMatchSync(string, startPosition, debugCall, options) {
        const onigBinding = this._onigBinding;
        // let resultPtr: Pointer
        // if (debugCall)
        //   resultPtr = onigBinding.findNextOnigScannerMatchDbg(this._ptr, string.id, string.ptr, string.utf8Length, string.convertUtf16OffsetToUtf8(startPosition), options)
        // else
        const resultPtr = onigBinding.findNextOnigScannerMatch(this._ptr, string.id, string.ptr, string.utf8Length, string.convertUtf16OffsetToUtf8(startPosition), options);
        if (resultPtr === 0) {
            // no match
            return null;
        }
        const HEAPU32 = onigBinding.HEAPU32;
        let offset = resultPtr / 4; // byte offset -> uint32 offset
        const index = HEAPU32[offset++];
        const count = HEAPU32[offset++];
        const captureIndices = [];
        for (let i = 0; i < count; i++) {
            const beg = string.convertUtf8OffsetToUtf16(HEAPU32[offset++]);
            const end = string.convertUtf8OffsetToUtf16(HEAPU32[offset++]);
            captureIndices[i] = {
                start: beg,
                end,
                length: end - beg,
            };
        }
        return {
            index,
            captureIndices,
        };
    }
}
function isInstantiatorOptionsObject(dataOrOptions) {
    return (typeof dataOrOptions.instantiator === 'function');
}
function isInstantiatorModule(dataOrOptions) {
    return (typeof dataOrOptions.default === 'function');
}
function isDataOptionsObject(dataOrOptions) {
    return (typeof dataOrOptions.data !== 'undefined');
}
function isResponse(dataOrOptions) {
    return (typeof Response !== 'undefined' && dataOrOptions instanceof Response);
}
function isArrayBuffer(data) {
    return (typeof ArrayBuffer !== 'undefined' && (data instanceof ArrayBuffer || ArrayBuffer.isView(data)))
        // eslint-disable-next-line node/prefer-global/buffer
        || (typeof Buffer !== 'undefined' && Buffer.isBuffer?.(data))
        || (typeof SharedArrayBuffer !== 'undefined' && data instanceof SharedArrayBuffer)
        || (typeof Uint32Array !== 'undefined' && data instanceof Uint32Array);
}
let initPromise;
function loadWasm(options) {
    if (initPromise)
        return initPromise;
    async function _load() {
        onigBinding = await main(async (info) => {
            let instance = options;
            instance = await instance;
            if (typeof instance === 'function')
                instance = await instance(info);
            if (typeof instance === 'function')
                instance = await instance(info);
            if (isInstantiatorOptionsObject(instance)) {
                instance = await instance.instantiator(info);
            }
            else if (isInstantiatorModule(instance)) {
                instance = await instance.default(info);
            }
            else {
                if (isDataOptionsObject(instance))
                    instance = instance.data;
                if (isResponse(instance)) {
                    if (typeof WebAssembly.instantiateStreaming === 'function')
                        instance = await _makeResponseStreamingLoader(instance)(info);
                    else
                        instance = await _makeResponseNonStreamingLoader(instance)(info);
                }
                else if (isArrayBuffer(instance)) {
                    instance = await _makeArrayBufferLoader(instance)(info);
                }
                // import("shiki/onig.wasm") returns `{ default: WebAssembly.Module }` on cloudflare workers
                // https://developers.cloudflare.com/workers/wrangler/bundling/
                else if (instance instanceof WebAssembly.Module) {
                    instance = await _makeArrayBufferLoader(instance)(info);
                }
                else if ('default' in instance && instance.default instanceof WebAssembly.Module) {
                    instance = await _makeArrayBufferLoader(instance.default)(info);
                }
            }
            if ('instance' in instance)
                instance = instance.instance;
            if ('exports' in instance)
                instance = instance.exports;
            return instance;
        });
    }
    initPromise = _load();
    return initPromise;
}
function _makeArrayBufferLoader(data) {
    return importObject => WebAssembly.instantiate(data, importObject);
}
function _makeResponseStreamingLoader(data) {
    return importObject => WebAssembly.instantiateStreaming(data, importObject);
}
function _makeResponseNonStreamingLoader(data) {
    return async (importObject) => {
        const arrayBuffer = await data.arrayBuffer();
        return WebAssembly.instantiate(arrayBuffer, importObject);
    };
}
// export function createOnigString(str: string) {
//   return new OnigString(str)
// }
// export function createOnigScanner(patterns: string[]) {
//   return new OnigScanner(patterns)
// }
// export function setDefaultDebugCall(_defaultDebugCall: boolean): void {
//   defaultDebugCall = _defaultDebugCall
// }

let _defaultWasmLoader;
/**
 * @internal
 */
function getDefaultWasmLoader() {
    return _defaultWasmLoader;
}
async function createOnigurumaEngine(options) {
    if (options)
        await loadWasm(options);
    return {
        createScanner(patterns) {
            return new OnigScanner(patterns);
        },
        createString(s) {
            return new OnigString(s);
        },
    };
}

// src/utils.ts
function clone(something) {
  return doClone(something);
}
function doClone(something) {
  if (Array.isArray(something)) {
    return cloneArray(something);
  }
  if (typeof something === "object") {
    return cloneObj(something);
  }
  return something;
}
function cloneArray(arr) {
  let r = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    r[i] = doClone(arr[i]);
  }
  return r;
}
function cloneObj(obj) {
  let r = {};
  for (let key in obj) {
    r[key] = doClone(obj[key]);
  }
  return r;
}
function mergeObjects(target, ...sources) {
  sources.forEach((source) => {
    for (let key in source) {
      target[key] = source[key];
    }
  });
  return target;
}
function basename(path) {
  const idx = ~path.lastIndexOf("/") || ~path.lastIndexOf("\\");
  if (idx === 0) {
    return path;
  } else if (~idx === path.length - 1) {
    return basename(path.substring(0, path.length - 1));
  } else {
    return path.substr(~idx + 1);
  }
}
var CAPTURING_REGEX_SOURCE = /\$(\d+)|\${(\d+):\/(downcase|upcase)}/g;
var RegexSource = class {
  static hasCaptures(regexSource) {
    if (regexSource === null) {
      return false;
    }
    CAPTURING_REGEX_SOURCE.lastIndex = 0;
    return CAPTURING_REGEX_SOURCE.test(regexSource);
  }
  static replaceCaptures(regexSource, captureSource, captureIndices) {
    return regexSource.replace(CAPTURING_REGEX_SOURCE, (match, index, commandIndex, command) => {
      let capture = captureIndices[parseInt(index || commandIndex, 10)];
      if (capture) {
        let result = captureSource.substring(capture.start, capture.end);
        while (result[0] === ".") {
          result = result.substring(1);
        }
        switch (command) {
          case "downcase":
            return result.toLowerCase();
          case "upcase":
            return result.toUpperCase();
          default:
            return result;
        }
      } else {
        return match;
      }
    });
  }
};
function strcmp(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}
function strArrCmp(a, b) {
  if (a === null && b === null) {
    return 0;
  }
  if (!a) {
    return -1;
  }
  if (!b) {
    return 1;
  }
  let len1 = a.length;
  let len2 = b.length;
  if (len1 === len2) {
    for (let i = 0; i < len1; i++) {
      let res = strcmp(a[i], b[i]);
      if (res !== 0) {
        return res;
      }
    }
    return 0;
  }
  return len1 - len2;
}
function isValidHexColor(hex) {
  if (/^#[0-9a-f]{6}$/i.test(hex)) {
    return true;
  }
  if (/^#[0-9a-f]{8}$/i.test(hex)) {
    return true;
  }
  if (/^#[0-9a-f]{3}$/i.test(hex)) {
    return true;
  }
  if (/^#[0-9a-f]{4}$/i.test(hex)) {
    return true;
  }
  return false;
}
function escapeRegExpCharacters(value) {
  return value.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
}
var CachedFn = class {
  constructor(fn) {
    this.fn = fn;
    this.cache = /* @__PURE__ */ new Map();
  }
  get(key) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const value = this.fn(key);
    this.cache.set(key, value);
    return value;
  }
};

// src/theme.ts
var Theme = class {
  constructor(_colorMap, _defaults, _root) {
    this._colorMap = _colorMap;
    this._defaults = _defaults;
    this._root = _root;
    this._cachedMatchRoot = new CachedFn(
      (scopeName) => this._root.match(scopeName)
    );
  }
  static createFromRawTheme(source, colorMap) {
    return this.createFromParsedTheme(parseTheme(source), colorMap);
  }
  static createFromParsedTheme(source, colorMap) {
    return resolveParsedThemeRules(source, colorMap);
  }
  getColorMap() {
    return this._colorMap.getColorMap();
  }
  getDefaults() {
    return this._defaults;
  }
  match(scopePath) {
    if (scopePath === null) {
      return this._defaults;
    }
    const scopeName = scopePath.scopeName;
    const matchingTrieElements = this._cachedMatchRoot.get(scopeName);
    const effectiveRule = matchingTrieElements.find(
      (v) => _scopePathMatchesParentScopes(scopePath.parent, v.parentScopes)
    );
    if (!effectiveRule) {
      return null;
    }
    return new StyleAttributes(
      effectiveRule.fontStyle,
      effectiveRule.foreground,
      effectiveRule.background
    );
  }
};
var ScopeStack = class _ScopeStack {
  constructor(parent, scopeName) {
    this.parent = parent;
    this.scopeName = scopeName;
  }
  static push(path, scopeNames) {
    for (const name of scopeNames) {
      path = new _ScopeStack(path, name);
    }
    return path;
  }
  static from(...segments) {
    let result = null;
    for (let i = 0; i < segments.length; i++) {
      result = new _ScopeStack(result, segments[i]);
    }
    return result;
  }
  push(scopeName) {
    return new _ScopeStack(this, scopeName);
  }
  getSegments() {
    let item = this;
    const result = [];
    while (item) {
      result.push(item.scopeName);
      item = item.parent;
    }
    result.reverse();
    return result;
  }
  toString() {
    return this.getSegments().join(" ");
  }
  extends(other) {
    if (this === other) {
      return true;
    }
    if (this.parent === null) {
      return false;
    }
    return this.parent.extends(other);
  }
  getExtensionIfDefined(base) {
    const result = [];
    let item = this;
    while (item && item !== base) {
      result.push(item.scopeName);
      item = item.parent;
    }
    return item === base ? result.reverse() : void 0;
  }
};
function _scopePathMatchesParentScopes(scopePath, parentScopes) {
  if (parentScopes.length === 0) {
    return true;
  }
  for (let index = 0; index < parentScopes.length; index++) {
    let scopePattern = parentScopes[index];
    let scopeMustMatch = false;
    if (scopePattern === ">") {
      if (index === parentScopes.length - 1) {
        return false;
      }
      scopePattern = parentScopes[++index];
      scopeMustMatch = true;
    }
    while (scopePath) {
      if (_matchesScope(scopePath.scopeName, scopePattern)) {
        break;
      }
      if (scopeMustMatch) {
        return false;
      }
      scopePath = scopePath.parent;
    }
    if (!scopePath) {
      return false;
    }
    scopePath = scopePath.parent;
  }
  return true;
}
function _matchesScope(scopeName, scopePattern) {
  return scopePattern === scopeName || scopeName.startsWith(scopePattern) && scopeName[scopePattern.length] === ".";
}
var StyleAttributes = class {
  constructor(fontStyle, foregroundId, backgroundId) {
    this.fontStyle = fontStyle;
    this.foregroundId = foregroundId;
    this.backgroundId = backgroundId;
  }
};
function parseTheme(source) {
  if (!source) {
    return [];
  }
  if (!source.settings || !Array.isArray(source.settings)) {
    return [];
  }
  let settings = source.settings;
  let result = [], resultLen = 0;
  for (let i = 0, len = settings.length; i < len; i++) {
    let entry = settings[i];
    if (!entry.settings) {
      continue;
    }
    let scopes;
    if (typeof entry.scope === "string") {
      let _scope = entry.scope;
      _scope = _scope.replace(/^[,]+/, "");
      _scope = _scope.replace(/[,]+$/, "");
      scopes = _scope.split(",");
    } else if (Array.isArray(entry.scope)) {
      scopes = entry.scope;
    } else {
      scopes = [""];
    }
    let fontStyle = -1 /* NotSet */;
    if (typeof entry.settings.fontStyle === "string") {
      fontStyle = 0 /* None */;
      let segments = entry.settings.fontStyle.split(" ");
      for (let j = 0, lenJ = segments.length; j < lenJ; j++) {
        let segment = segments[j];
        switch (segment) {
          case "italic":
            fontStyle = fontStyle | 1 /* Italic */;
            break;
          case "bold":
            fontStyle = fontStyle | 2 /* Bold */;
            break;
          case "underline":
            fontStyle = fontStyle | 4 /* Underline */;
            break;
          case "strikethrough":
            fontStyle = fontStyle | 8 /* Strikethrough */;
            break;
        }
      }
    }
    let foreground = null;
    if (typeof entry.settings.foreground === "string" && isValidHexColor(entry.settings.foreground)) {
      foreground = entry.settings.foreground;
    }
    let background = null;
    if (typeof entry.settings.background === "string" && isValidHexColor(entry.settings.background)) {
      background = entry.settings.background;
    }
    for (let j = 0, lenJ = scopes.length; j < lenJ; j++) {
      let _scope = scopes[j].trim();
      let segments = _scope.split(" ");
      let scope = segments[segments.length - 1];
      let parentScopes = null;
      if (segments.length > 1) {
        parentScopes = segments.slice(0, segments.length - 1);
        parentScopes.reverse();
      }
      result[resultLen++] = new ParsedThemeRule(
        scope,
        parentScopes,
        i,
        fontStyle,
        foreground,
        background
      );
    }
  }
  return result;
}
var ParsedThemeRule = class {
  constructor(scope, parentScopes, index, fontStyle, foreground, background) {
    this.scope = scope;
    this.parentScopes = parentScopes;
    this.index = index;
    this.fontStyle = fontStyle;
    this.foreground = foreground;
    this.background = background;
  }
};
var FontStyle = /* @__PURE__ */ ((FontStyle2) => {
  FontStyle2[FontStyle2["NotSet"] = -1] = "NotSet";
  FontStyle2[FontStyle2["None"] = 0] = "None";
  FontStyle2[FontStyle2["Italic"] = 1] = "Italic";
  FontStyle2[FontStyle2["Bold"] = 2] = "Bold";
  FontStyle2[FontStyle2["Underline"] = 4] = "Underline";
  FontStyle2[FontStyle2["Strikethrough"] = 8] = "Strikethrough";
  return FontStyle2;
})(FontStyle || {});
function resolveParsedThemeRules(parsedThemeRules, _colorMap) {
  parsedThemeRules.sort((a, b) => {
    let r = strcmp(a.scope, b.scope);
    if (r !== 0) {
      return r;
    }
    r = strArrCmp(a.parentScopes, b.parentScopes);
    if (r !== 0) {
      return r;
    }
    return a.index - b.index;
  });
  let defaultFontStyle = 0 /* None */;
  let defaultForeground = "#000000";
  let defaultBackground = "#ffffff";
  while (parsedThemeRules.length >= 1 && parsedThemeRules[0].scope === "") {
    let incomingDefaults = parsedThemeRules.shift();
    if (incomingDefaults.fontStyle !== -1 /* NotSet */) {
      defaultFontStyle = incomingDefaults.fontStyle;
    }
    if (incomingDefaults.foreground !== null) {
      defaultForeground = incomingDefaults.foreground;
    }
    if (incomingDefaults.background !== null) {
      defaultBackground = incomingDefaults.background;
    }
  }
  let colorMap = new ColorMap(_colorMap);
  let defaults = new StyleAttributes(defaultFontStyle, colorMap.getId(defaultForeground), colorMap.getId(defaultBackground));
  let root = new ThemeTrieElement(new ThemeTrieElementRule(0, null, -1 /* NotSet */, 0, 0), []);
  for (let i = 0, len = parsedThemeRules.length; i < len; i++) {
    let rule = parsedThemeRules[i];
    root.insert(0, rule.scope, rule.parentScopes, rule.fontStyle, colorMap.getId(rule.foreground), colorMap.getId(rule.background));
  }
  return new Theme(colorMap, defaults, root);
}
var ColorMap = class {
  constructor(_colorMap) {
    this._lastColorId = 0;
    this._id2color = [];
    this._color2id = /* @__PURE__ */ Object.create(null);
    if (Array.isArray(_colorMap)) {
      this._isFrozen = true;
      for (let i = 0, len = _colorMap.length; i < len; i++) {
        this._color2id[_colorMap[i]] = i;
        this._id2color[i] = _colorMap[i];
      }
    } else {
      this._isFrozen = false;
    }
  }
  getId(color) {
    if (color === null) {
      return 0;
    }
    color = color.toUpperCase();
    let value = this._color2id[color];
    if (value) {
      return value;
    }
    if (this._isFrozen) {
      throw new Error(`Missing color in color map - ${color}`);
    }
    value = ++this._lastColorId;
    this._color2id[color] = value;
    this._id2color[value] = color;
    return value;
  }
  getColorMap() {
    return this._id2color.slice(0);
  }
};
var emptyParentScopes = Object.freeze([]);
var ThemeTrieElementRule = class _ThemeTrieElementRule {
  constructor(scopeDepth, parentScopes, fontStyle, foreground, background) {
    this.scopeDepth = scopeDepth;
    this.parentScopes = parentScopes || emptyParentScopes;
    this.fontStyle = fontStyle;
    this.foreground = foreground;
    this.background = background;
  }
  clone() {
    return new _ThemeTrieElementRule(this.scopeDepth, this.parentScopes, this.fontStyle, this.foreground, this.background);
  }
  static cloneArr(arr) {
    let r = [];
    for (let i = 0, len = arr.length; i < len; i++) {
      r[i] = arr[i].clone();
    }
    return r;
  }
  acceptOverwrite(scopeDepth, fontStyle, foreground, background) {
    if (this.scopeDepth > scopeDepth) {
      console.log("how did this happen?");
    } else {
      this.scopeDepth = scopeDepth;
    }
    if (fontStyle !== -1 /* NotSet */) {
      this.fontStyle = fontStyle;
    }
    if (foreground !== 0) {
      this.foreground = foreground;
    }
    if (background !== 0) {
      this.background = background;
    }
  }
};
var ThemeTrieElement = class _ThemeTrieElement {
  constructor(_mainRule, rulesWithParentScopes = [], _children = {}) {
    this._mainRule = _mainRule;
    this._children = _children;
    this._rulesWithParentScopes = rulesWithParentScopes;
  }
  static _cmpBySpecificity(a, b) {
    if (a.scopeDepth !== b.scopeDepth) {
      return b.scopeDepth - a.scopeDepth;
    }
    let aParentIndex = 0;
    let bParentIndex = 0;
    while (true) {
      if (a.parentScopes[aParentIndex] === ">") {
        aParentIndex++;
      }
      if (b.parentScopes[bParentIndex] === ">") {
        bParentIndex++;
      }
      if (aParentIndex >= a.parentScopes.length || bParentIndex >= b.parentScopes.length) {
        break;
      }
      const parentScopeLengthDiff = b.parentScopes[bParentIndex].length - a.parentScopes[aParentIndex].length;
      if (parentScopeLengthDiff !== 0) {
        return parentScopeLengthDiff;
      }
      aParentIndex++;
      bParentIndex++;
    }
    return b.parentScopes.length - a.parentScopes.length;
  }
  match(scope) {
    if (scope !== "") {
      let dotIndex = scope.indexOf(".");
      let head;
      let tail;
      if (dotIndex === -1) {
        head = scope;
        tail = "";
      } else {
        head = scope.substring(0, dotIndex);
        tail = scope.substring(dotIndex + 1);
      }
      if (this._children.hasOwnProperty(head)) {
        return this._children[head].match(tail);
      }
    }
    const rules = this._rulesWithParentScopes.concat(this._mainRule);
    rules.sort(_ThemeTrieElement._cmpBySpecificity);
    return rules;
  }
  insert(scopeDepth, scope, parentScopes, fontStyle, foreground, background) {
    if (scope === "") {
      this._doInsertHere(scopeDepth, parentScopes, fontStyle, foreground, background);
      return;
    }
    let dotIndex = scope.indexOf(".");
    let head;
    let tail;
    if (dotIndex === -1) {
      head = scope;
      tail = "";
    } else {
      head = scope.substring(0, dotIndex);
      tail = scope.substring(dotIndex + 1);
    }
    let child;
    if (this._children.hasOwnProperty(head)) {
      child = this._children[head];
    } else {
      child = new _ThemeTrieElement(this._mainRule.clone(), ThemeTrieElementRule.cloneArr(this._rulesWithParentScopes));
      this._children[head] = child;
    }
    child.insert(scopeDepth + 1, tail, parentScopes, fontStyle, foreground, background);
  }
  _doInsertHere(scopeDepth, parentScopes, fontStyle, foreground, background) {
    if (parentScopes === null) {
      this._mainRule.acceptOverwrite(scopeDepth, fontStyle, foreground, background);
      return;
    }
    for (let i = 0, len = this._rulesWithParentScopes.length; i < len; i++) {
      let rule = this._rulesWithParentScopes[i];
      if (strArrCmp(rule.parentScopes, parentScopes) === 0) {
        rule.acceptOverwrite(scopeDepth, fontStyle, foreground, background);
        return;
      }
    }
    if (fontStyle === -1 /* NotSet */) {
      fontStyle = this._mainRule.fontStyle;
    }
    if (foreground === 0) {
      foreground = this._mainRule.foreground;
    }
    if (background === 0) {
      background = this._mainRule.background;
    }
    this._rulesWithParentScopes.push(new ThemeTrieElementRule(scopeDepth, parentScopes, fontStyle, foreground, background));
  }
};

// src/encodedTokenAttributes.ts
var EncodedTokenMetadata = class _EncodedTokenMetadata {
  static toBinaryStr(encodedTokenAttributes) {
    return encodedTokenAttributes.toString(2).padStart(32, "0");
  }
  static print(encodedTokenAttributes) {
    const languageId = _EncodedTokenMetadata.getLanguageId(encodedTokenAttributes);
    const tokenType = _EncodedTokenMetadata.getTokenType(encodedTokenAttributes);
    const fontStyle = _EncodedTokenMetadata.getFontStyle(encodedTokenAttributes);
    const foreground = _EncodedTokenMetadata.getForeground(encodedTokenAttributes);
    const background = _EncodedTokenMetadata.getBackground(encodedTokenAttributes);
    console.log({
      languageId,
      tokenType,
      fontStyle,
      foreground,
      background
    });
  }
  static getLanguageId(encodedTokenAttributes) {
    return (encodedTokenAttributes & 255 /* LANGUAGEID_MASK */) >>> 0 /* LANGUAGEID_OFFSET */;
  }
  static getTokenType(encodedTokenAttributes) {
    return (encodedTokenAttributes & 768 /* TOKEN_TYPE_MASK */) >>> 8 /* TOKEN_TYPE_OFFSET */;
  }
  static containsBalancedBrackets(encodedTokenAttributes) {
    return (encodedTokenAttributes & 1024 /* BALANCED_BRACKETS_MASK */) !== 0;
  }
  static getFontStyle(encodedTokenAttributes) {
    return (encodedTokenAttributes & 30720 /* FONT_STYLE_MASK */) >>> 11 /* FONT_STYLE_OFFSET */;
  }
  static getForeground(encodedTokenAttributes) {
    return (encodedTokenAttributes & 16744448 /* FOREGROUND_MASK */) >>> 15 /* FOREGROUND_OFFSET */;
  }
  static getBackground(encodedTokenAttributes) {
    return (encodedTokenAttributes & 4278190080 /* BACKGROUND_MASK */) >>> 24 /* BACKGROUND_OFFSET */;
  }
  /**
   * Updates the fields in `metadata`.
   * A value of `0`, `NotSet` or `null` indicates that the corresponding field should be left as is.
   */
  static set(encodedTokenAttributes, languageId, tokenType, containsBalancedBrackets, fontStyle, foreground, background) {
    let _languageId = _EncodedTokenMetadata.getLanguageId(encodedTokenAttributes);
    let _tokenType = _EncodedTokenMetadata.getTokenType(encodedTokenAttributes);
    let _containsBalancedBracketsBit = _EncodedTokenMetadata.containsBalancedBrackets(encodedTokenAttributes) ? 1 : 0;
    let _fontStyle = _EncodedTokenMetadata.getFontStyle(encodedTokenAttributes);
    let _foreground = _EncodedTokenMetadata.getForeground(encodedTokenAttributes);
    let _background = _EncodedTokenMetadata.getBackground(encodedTokenAttributes);
    if (languageId !== 0) {
      _languageId = languageId;
    }
    if (tokenType !== 8 /* NotSet */) {
      _tokenType = fromOptionalTokenType(tokenType);
    }
    if (containsBalancedBrackets !== null) {
      _containsBalancedBracketsBit = containsBalancedBrackets ? 1 : 0;
    }
    if (fontStyle !== -1 /* NotSet */) {
      _fontStyle = fontStyle;
    }
    if (foreground !== 0) {
      _foreground = foreground;
    }
    if (background !== 0) {
      _background = background;
    }
    return (_languageId << 0 /* LANGUAGEID_OFFSET */ | _tokenType << 8 /* TOKEN_TYPE_OFFSET */ | _containsBalancedBracketsBit << 10 /* BALANCED_BRACKETS_OFFSET */ | _fontStyle << 11 /* FONT_STYLE_OFFSET */ | _foreground << 15 /* FOREGROUND_OFFSET */ | _background << 24 /* BACKGROUND_OFFSET */) >>> 0;
  }
};
function toOptionalTokenType(standardType) {
  return standardType;
}
function fromOptionalTokenType(standardType) {
  return standardType;
}

// src/matcher.ts
function createMatchers(selector, matchesName) {
  const results = [];
  const tokenizer = newTokenizer(selector);
  let token = tokenizer.next();
  while (token !== null) {
    let priority = 0;
    if (token.length === 2 && token.charAt(1) === ":") {
      switch (token.charAt(0)) {
        case "R":
          priority = 1;
          break;
        case "L":
          priority = -1;
          break;
        default:
          console.log(`Unknown priority ${token} in scope selector`);
      }
      token = tokenizer.next();
    }
    let matcher = parseConjunction();
    results.push({ matcher, priority });
    if (token !== ",") {
      break;
    }
    token = tokenizer.next();
  }
  return results;
  function parseOperand() {
    if (token === "-") {
      token = tokenizer.next();
      const expressionToNegate = parseOperand();
      return (matcherInput) => !!expressionToNegate && !expressionToNegate(matcherInput);
    }
    if (token === "(") {
      token = tokenizer.next();
      const expressionInParents = parseInnerExpression();
      if (token === ")") {
        token = tokenizer.next();
      }
      return expressionInParents;
    }
    if (isIdentifier(token)) {
      const identifiers = [];
      do {
        identifiers.push(token);
        token = tokenizer.next();
      } while (isIdentifier(token));
      return (matcherInput) => matchesName(identifiers, matcherInput);
    }
    return null;
  }
  function parseConjunction() {
    const matchers = [];
    let matcher = parseOperand();
    while (matcher) {
      matchers.push(matcher);
      matcher = parseOperand();
    }
    return (matcherInput) => matchers.every((matcher2) => matcher2(matcherInput));
  }
  function parseInnerExpression() {
    const matchers = [];
    let matcher = parseConjunction();
    while (matcher) {
      matchers.push(matcher);
      if (token === "|" || token === ",") {
        do {
          token = tokenizer.next();
        } while (token === "|" || token === ",");
      } else {
        break;
      }
      matcher = parseConjunction();
    }
    return (matcherInput) => matchers.some((matcher2) => matcher2(matcherInput));
  }
}
function isIdentifier(token) {
  return !!token && !!token.match(/[\w\.:]+/);
}
function newTokenizer(input) {
  let regex = /([LR]:|[\w\.:][\w\.:\-]*|[\,\|\-\(\)])/g;
  let match = regex.exec(input);
  return {
    next: () => {
      if (!match) {
        return null;
      }
      const res = match[0];
      match = regex.exec(input);
      return res;
    }
  };
}
function disposeOnigString(str) {
  if (typeof str.dispose === "function") {
    str.dispose();
  }
}

// src/grammar/grammarDependencies.ts
var TopLevelRuleReference = class {
  constructor(scopeName) {
    this.scopeName = scopeName;
  }
  toKey() {
    return this.scopeName;
  }
};
var TopLevelRepositoryRuleReference = class {
  constructor(scopeName, ruleName) {
    this.scopeName = scopeName;
    this.ruleName = ruleName;
  }
  toKey() {
    return `${this.scopeName}#${this.ruleName}`;
  }
};
var ExternalReferenceCollector = class {
  constructor() {
    this._references = [];
    this._seenReferenceKeys = /* @__PURE__ */ new Set();
    this.visitedRule = /* @__PURE__ */ new Set();
  }
  get references() {
    return this._references;
  }
  add(reference) {
    const key = reference.toKey();
    if (this._seenReferenceKeys.has(key)) {
      return;
    }
    this._seenReferenceKeys.add(key);
    this._references.push(reference);
  }
};
var ScopeDependencyProcessor = class {
  constructor(repo, initialScopeName) {
    this.repo = repo;
    this.initialScopeName = initialScopeName;
    this.seenFullScopeRequests = /* @__PURE__ */ new Set();
    this.seenPartialScopeRequests = /* @__PURE__ */ new Set();
    this.seenFullScopeRequests.add(this.initialScopeName);
    this.Q = [new TopLevelRuleReference(this.initialScopeName)];
  }
  processQueue() {
    const q = this.Q;
    this.Q = [];
    const deps = new ExternalReferenceCollector();
    for (const dep of q) {
      collectReferencesOfReference(dep, this.initialScopeName, this.repo, deps);
    }
    for (const dep of deps.references) {
      if (dep instanceof TopLevelRuleReference) {
        if (this.seenFullScopeRequests.has(dep.scopeName)) {
          continue;
        }
        this.seenFullScopeRequests.add(dep.scopeName);
        this.Q.push(dep);
      } else {
        if (this.seenFullScopeRequests.has(dep.scopeName)) {
          continue;
        }
        if (this.seenPartialScopeRequests.has(dep.toKey())) {
          continue;
        }
        this.seenPartialScopeRequests.add(dep.toKey());
        this.Q.push(dep);
      }
    }
  }
};
function collectReferencesOfReference(reference, baseGrammarScopeName, repo, result) {
  const selfGrammar = repo.lookup(reference.scopeName);
  if (!selfGrammar) {
    if (reference.scopeName === baseGrammarScopeName) {
      throw new Error(`No grammar provided for <${baseGrammarScopeName}>`);
    }
    return;
  }
  const baseGrammar = repo.lookup(baseGrammarScopeName);
  if (reference instanceof TopLevelRuleReference) {
    collectExternalReferencesInTopLevelRule({ baseGrammar, selfGrammar }, result);
  } else {
    collectExternalReferencesInTopLevelRepositoryRule(
      reference.ruleName,
      { baseGrammar, selfGrammar, repository: selfGrammar.repository },
      result
    );
  }
  const injections = repo.injections(reference.scopeName);
  if (injections) {
    for (const injection of injections) {
      result.add(new TopLevelRuleReference(injection));
    }
  }
}
function collectExternalReferencesInTopLevelRepositoryRule(ruleName, context, result) {
  if (context.repository && context.repository[ruleName]) {
    const rule = context.repository[ruleName];
    collectExternalReferencesInRules([rule], context, result);
  }
}
function collectExternalReferencesInTopLevelRule(context, result) {
  if (context.selfGrammar.patterns && Array.isArray(context.selfGrammar.patterns)) {
    collectExternalReferencesInRules(
      context.selfGrammar.patterns,
      { ...context, repository: context.selfGrammar.repository },
      result
    );
  }
  if (context.selfGrammar.injections) {
    collectExternalReferencesInRules(
      Object.values(context.selfGrammar.injections),
      { ...context, repository: context.selfGrammar.repository },
      result
    );
  }
}
function collectExternalReferencesInRules(rules, context, result) {
  for (const rule of rules) {
    if (result.visitedRule.has(rule)) {
      continue;
    }
    result.visitedRule.add(rule);
    const patternRepository = rule.repository ? mergeObjects({}, context.repository, rule.repository) : context.repository;
    if (Array.isArray(rule.patterns)) {
      collectExternalReferencesInRules(rule.patterns, { ...context, repository: patternRepository }, result);
    }
    const include = rule.include;
    if (!include) {
      continue;
    }
    const reference = parseInclude(include);
    switch (reference.kind) {
      case 0 /* Base */:
        collectExternalReferencesInTopLevelRule({ ...context, selfGrammar: context.baseGrammar }, result);
        break;
      case 1 /* Self */:
        collectExternalReferencesInTopLevelRule(context, result);
        break;
      case 2 /* RelativeReference */:
        collectExternalReferencesInTopLevelRepositoryRule(reference.ruleName, { ...context, repository: patternRepository }, result);
        break;
      case 3 /* TopLevelReference */:
      case 4 /* TopLevelRepositoryReference */:
        const selfGrammar = reference.scopeName === context.selfGrammar.scopeName ? context.selfGrammar : reference.scopeName === context.baseGrammar.scopeName ? context.baseGrammar : void 0;
        if (selfGrammar) {
          const newContext = { baseGrammar: context.baseGrammar, selfGrammar, repository: patternRepository };
          if (reference.kind === 4 /* TopLevelRepositoryReference */) {
            collectExternalReferencesInTopLevelRepositoryRule(reference.ruleName, newContext, result);
          } else {
            collectExternalReferencesInTopLevelRule(newContext, result);
          }
        } else {
          if (reference.kind === 4 /* TopLevelRepositoryReference */) {
            result.add(new TopLevelRepositoryRuleReference(reference.scopeName, reference.ruleName));
          } else {
            result.add(new TopLevelRuleReference(reference.scopeName));
          }
        }
        break;
    }
  }
}
var BaseReference = class {
  constructor() {
    this.kind = 0 /* Base */;
  }
};
var SelfReference = class {
  constructor() {
    this.kind = 1 /* Self */;
  }
};
var RelativeReference = class {
  constructor(ruleName) {
    this.ruleName = ruleName;
    this.kind = 2 /* RelativeReference */;
  }
};
var TopLevelReference = class {
  constructor(scopeName) {
    this.scopeName = scopeName;
    this.kind = 3 /* TopLevelReference */;
  }
};
var TopLevelRepositoryReference = class {
  constructor(scopeName, ruleName) {
    this.scopeName = scopeName;
    this.ruleName = ruleName;
    this.kind = 4 /* TopLevelRepositoryReference */;
  }
};
function parseInclude(include) {
  if (include === "$base") {
    return new BaseReference();
  } else if (include === "$self") {
    return new SelfReference();
  }
  const indexOfSharp = include.indexOf("#");
  if (indexOfSharp === -1) {
    return new TopLevelReference(include);
  } else if (indexOfSharp === 0) {
    return new RelativeReference(include.substring(1));
  } else {
    const scopeName = include.substring(0, indexOfSharp);
    const ruleName = include.substring(indexOfSharp + 1);
    return new TopLevelRepositoryReference(scopeName, ruleName);
  }
}

// src/rule.ts
var HAS_BACK_REFERENCES = /\\(\d+)/;
var BACK_REFERENCING_END = /\\(\d+)/g;
var endRuleId = -1;
var whileRuleId = -2;
function ruleIdFromNumber(id) {
  return id;
}
function ruleIdToNumber(id) {
  return id;
}
var Rule = class {
  constructor($location, id, name, contentName) {
    this.$location = $location;
    this.id = id;
    this._name = name || null;
    this._nameIsCapturing = RegexSource.hasCaptures(this._name);
    this._contentName = contentName || null;
    this._contentNameIsCapturing = RegexSource.hasCaptures(this._contentName);
  }
  get debugName() {
    const location = this.$location ? `${basename(this.$location.filename)}:${this.$location.line}` : "unknown";
    return `${this.constructor.name}#${this.id} @ ${location}`;
  }
  getName(lineText, captureIndices) {
    if (!this._nameIsCapturing || this._name === null || lineText === null || captureIndices === null) {
      return this._name;
    }
    return RegexSource.replaceCaptures(this._name, lineText, captureIndices);
  }
  getContentName(lineText, captureIndices) {
    if (!this._contentNameIsCapturing || this._contentName === null) {
      return this._contentName;
    }
    return RegexSource.replaceCaptures(this._contentName, lineText, captureIndices);
  }
};
var CaptureRule = class extends Rule {
  constructor($location, id, name, contentName, retokenizeCapturedWithRuleId) {
    super($location, id, name, contentName);
    this.retokenizeCapturedWithRuleId = retokenizeCapturedWithRuleId;
  }
  dispose() {
  }
  collectPatterns(grammar, out) {
    throw new Error("Not supported!");
  }
  compile(grammar, endRegexSource) {
    throw new Error("Not supported!");
  }
  compileAG(grammar, endRegexSource, allowA, allowG) {
    throw new Error("Not supported!");
  }
};
var MatchRule = class extends Rule {
  constructor($location, id, name, match, captures) {
    super($location, id, name, null);
    this._match = new RegExpSource(match, this.id);
    this.captures = captures;
    this._cachedCompiledPatterns = null;
  }
  dispose() {
    if (this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns.dispose();
      this._cachedCompiledPatterns = null;
    }
  }
  get debugMatchRegExp() {
    return `${this._match.source}`;
  }
  collectPatterns(grammar, out) {
    out.push(this._match);
  }
  compile(grammar, endRegexSource) {
    return this._getCachedCompiledPatterns(grammar).compile(grammar);
  }
  compileAG(grammar, endRegexSource, allowA, allowG) {
    return this._getCachedCompiledPatterns(grammar).compileAG(grammar, allowA, allowG);
  }
  _getCachedCompiledPatterns(grammar) {
    if (!this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns = new RegExpSourceList();
      this.collectPatterns(grammar, this._cachedCompiledPatterns);
    }
    return this._cachedCompiledPatterns;
  }
};
var IncludeOnlyRule = class extends Rule {
  constructor($location, id, name, contentName, patterns) {
    super($location, id, name, contentName);
    this.patterns = patterns.patterns;
    this.hasMissingPatterns = patterns.hasMissingPatterns;
    this._cachedCompiledPatterns = null;
  }
  dispose() {
    if (this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns.dispose();
      this._cachedCompiledPatterns = null;
    }
  }
  collectPatterns(grammar, out) {
    for (const pattern of this.patterns) {
      const rule = grammar.getRule(pattern);
      rule.collectPatterns(grammar, out);
    }
  }
  compile(grammar, endRegexSource) {
    return this._getCachedCompiledPatterns(grammar).compile(grammar);
  }
  compileAG(grammar, endRegexSource, allowA, allowG) {
    return this._getCachedCompiledPatterns(grammar).compileAG(grammar, allowA, allowG);
  }
  _getCachedCompiledPatterns(grammar) {
    if (!this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns = new RegExpSourceList();
      this.collectPatterns(grammar, this._cachedCompiledPatterns);
    }
    return this._cachedCompiledPatterns;
  }
};
var BeginEndRule = class extends Rule {
  constructor($location, id, name, contentName, begin, beginCaptures, end, endCaptures, applyEndPatternLast, patterns) {
    super($location, id, name, contentName);
    this._begin = new RegExpSource(begin, this.id);
    this.beginCaptures = beginCaptures;
    this._end = new RegExpSource(end ? end : "\uFFFF", -1);
    this.endHasBackReferences = this._end.hasBackReferences;
    this.endCaptures = endCaptures;
    this.applyEndPatternLast = applyEndPatternLast || false;
    this.patterns = patterns.patterns;
    this.hasMissingPatterns = patterns.hasMissingPatterns;
    this._cachedCompiledPatterns = null;
  }
  dispose() {
    if (this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns.dispose();
      this._cachedCompiledPatterns = null;
    }
  }
  get debugBeginRegExp() {
    return `${this._begin.source}`;
  }
  get debugEndRegExp() {
    return `${this._end.source}`;
  }
  getEndWithResolvedBackReferences(lineText, captureIndices) {
    return this._end.resolveBackReferences(lineText, captureIndices);
  }
  collectPatterns(grammar, out) {
    out.push(this._begin);
  }
  compile(grammar, endRegexSource) {
    return this._getCachedCompiledPatterns(grammar, endRegexSource).compile(grammar);
  }
  compileAG(grammar, endRegexSource, allowA, allowG) {
    return this._getCachedCompiledPatterns(grammar, endRegexSource).compileAG(grammar, allowA, allowG);
  }
  _getCachedCompiledPatterns(grammar, endRegexSource) {
    if (!this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns = new RegExpSourceList();
      for (const pattern of this.patterns) {
        const rule = grammar.getRule(pattern);
        rule.collectPatterns(grammar, this._cachedCompiledPatterns);
      }
      if (this.applyEndPatternLast) {
        this._cachedCompiledPatterns.push(this._end.hasBackReferences ? this._end.clone() : this._end);
      } else {
        this._cachedCompiledPatterns.unshift(this._end.hasBackReferences ? this._end.clone() : this._end);
      }
    }
    if (this._end.hasBackReferences) {
      if (this.applyEndPatternLast) {
        this._cachedCompiledPatterns.setSource(this._cachedCompiledPatterns.length() - 1, endRegexSource);
      } else {
        this._cachedCompiledPatterns.setSource(0, endRegexSource);
      }
    }
    return this._cachedCompiledPatterns;
  }
};
var BeginWhileRule = class extends Rule {
  constructor($location, id, name, contentName, begin, beginCaptures, _while, whileCaptures, patterns) {
    super($location, id, name, contentName);
    this._begin = new RegExpSource(begin, this.id);
    this.beginCaptures = beginCaptures;
    this.whileCaptures = whileCaptures;
    this._while = new RegExpSource(_while, whileRuleId);
    this.whileHasBackReferences = this._while.hasBackReferences;
    this.patterns = patterns.patterns;
    this.hasMissingPatterns = patterns.hasMissingPatterns;
    this._cachedCompiledPatterns = null;
    this._cachedCompiledWhilePatterns = null;
  }
  dispose() {
    if (this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns.dispose();
      this._cachedCompiledPatterns = null;
    }
    if (this._cachedCompiledWhilePatterns) {
      this._cachedCompiledWhilePatterns.dispose();
      this._cachedCompiledWhilePatterns = null;
    }
  }
  get debugBeginRegExp() {
    return `${this._begin.source}`;
  }
  get debugWhileRegExp() {
    return `${this._while.source}`;
  }
  getWhileWithResolvedBackReferences(lineText, captureIndices) {
    return this._while.resolveBackReferences(lineText, captureIndices);
  }
  collectPatterns(grammar, out) {
    out.push(this._begin);
  }
  compile(grammar, endRegexSource) {
    return this._getCachedCompiledPatterns(grammar).compile(grammar);
  }
  compileAG(grammar, endRegexSource, allowA, allowG) {
    return this._getCachedCompiledPatterns(grammar).compileAG(grammar, allowA, allowG);
  }
  _getCachedCompiledPatterns(grammar) {
    if (!this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns = new RegExpSourceList();
      for (const pattern of this.patterns) {
        const rule = grammar.getRule(pattern);
        rule.collectPatterns(grammar, this._cachedCompiledPatterns);
      }
    }
    return this._cachedCompiledPatterns;
  }
  compileWhile(grammar, endRegexSource) {
    return this._getCachedCompiledWhilePatterns(grammar, endRegexSource).compile(grammar);
  }
  compileWhileAG(grammar, endRegexSource, allowA, allowG) {
    return this._getCachedCompiledWhilePatterns(grammar, endRegexSource).compileAG(grammar, allowA, allowG);
  }
  _getCachedCompiledWhilePatterns(grammar, endRegexSource) {
    if (!this._cachedCompiledWhilePatterns) {
      this._cachedCompiledWhilePatterns = new RegExpSourceList();
      this._cachedCompiledWhilePatterns.push(this._while.hasBackReferences ? this._while.clone() : this._while);
    }
    if (this._while.hasBackReferences) {
      this._cachedCompiledWhilePatterns.setSource(0, endRegexSource ? endRegexSource : "\uFFFF");
    }
    return this._cachedCompiledWhilePatterns;
  }
};
var RuleFactory = class _RuleFactory {
  static createCaptureRule(helper, $location, name, contentName, retokenizeCapturedWithRuleId) {
    return helper.registerRule((id) => {
      return new CaptureRule($location, id, name, contentName, retokenizeCapturedWithRuleId);
    });
  }
  static getCompiledRuleId(desc, helper, repository) {
    if (!desc.id) {
      helper.registerRule((id) => {
        desc.id = id;
        if (desc.match) {
          return new MatchRule(
            desc.$vscodeTextmateLocation,
            desc.id,
            desc.name,
            desc.match,
            _RuleFactory._compileCaptures(desc.captures, helper, repository)
          );
        }
        if (typeof desc.begin === "undefined") {
          if (desc.repository) {
            repository = mergeObjects({}, repository, desc.repository);
          }
          let patterns = desc.patterns;
          if (typeof patterns === "undefined" && desc.include) {
            patterns = [{ include: desc.include }];
          }
          return new IncludeOnlyRule(
            desc.$vscodeTextmateLocation,
            desc.id,
            desc.name,
            desc.contentName,
            _RuleFactory._compilePatterns(patterns, helper, repository)
          );
        }
        if (desc.while) {
          return new BeginWhileRule(
            desc.$vscodeTextmateLocation,
            desc.id,
            desc.name,
            desc.contentName,
            desc.begin,
            _RuleFactory._compileCaptures(desc.beginCaptures || desc.captures, helper, repository),
            desc.while,
            _RuleFactory._compileCaptures(desc.whileCaptures || desc.captures, helper, repository),
            _RuleFactory._compilePatterns(desc.patterns, helper, repository)
          );
        }
        return new BeginEndRule(
          desc.$vscodeTextmateLocation,
          desc.id,
          desc.name,
          desc.contentName,
          desc.begin,
          _RuleFactory._compileCaptures(desc.beginCaptures || desc.captures, helper, repository),
          desc.end,
          _RuleFactory._compileCaptures(desc.endCaptures || desc.captures, helper, repository),
          desc.applyEndPatternLast,
          _RuleFactory._compilePatterns(desc.patterns, helper, repository)
        );
      });
    }
    return desc.id;
  }
  static _compileCaptures(captures, helper, repository) {
    let r = [];
    if (captures) {
      let maximumCaptureId = 0;
      for (const captureId in captures) {
        if (captureId === "$vscodeTextmateLocation") {
          continue;
        }
        const numericCaptureId = parseInt(captureId, 10);
        if (numericCaptureId > maximumCaptureId) {
          maximumCaptureId = numericCaptureId;
        }
      }
      for (let i = 0; i <= maximumCaptureId; i++) {
        r[i] = null;
      }
      for (const captureId in captures) {
        if (captureId === "$vscodeTextmateLocation") {
          continue;
        }
        const numericCaptureId = parseInt(captureId, 10);
        let retokenizeCapturedWithRuleId = 0;
        if (captures[captureId].patterns) {
          retokenizeCapturedWithRuleId = _RuleFactory.getCompiledRuleId(captures[captureId], helper, repository);
        }
        r[numericCaptureId] = _RuleFactory.createCaptureRule(helper, captures[captureId].$vscodeTextmateLocation, captures[captureId].name, captures[captureId].contentName, retokenizeCapturedWithRuleId);
      }
    }
    return r;
  }
  static _compilePatterns(patterns, helper, repository) {
    let r = [];
    if (patterns) {
      for (let i = 0, len = patterns.length; i < len; i++) {
        const pattern = patterns[i];
        let ruleId = -1;
        if (pattern.include) {
          const reference = parseInclude(pattern.include);
          switch (reference.kind) {
            case 0 /* Base */:
            case 1 /* Self */:
              ruleId = _RuleFactory.getCompiledRuleId(repository[pattern.include], helper, repository);
              break;
            case 2 /* RelativeReference */:
              let localIncludedRule = repository[reference.ruleName];
              if (localIncludedRule) {
                ruleId = _RuleFactory.getCompiledRuleId(localIncludedRule, helper, repository);
              }
              break;
            case 3 /* TopLevelReference */:
            case 4 /* TopLevelRepositoryReference */:
              const externalGrammarName = reference.scopeName;
              const externalGrammarInclude = reference.kind === 4 /* TopLevelRepositoryReference */ ? reference.ruleName : null;
              const externalGrammar = helper.getExternalGrammar(externalGrammarName, repository);
              if (externalGrammar) {
                if (externalGrammarInclude) {
                  let externalIncludedRule = externalGrammar.repository[externalGrammarInclude];
                  if (externalIncludedRule) {
                    ruleId = _RuleFactory.getCompiledRuleId(externalIncludedRule, helper, externalGrammar.repository);
                  }
                } else {
                  ruleId = _RuleFactory.getCompiledRuleId(externalGrammar.repository.$self, helper, externalGrammar.repository);
                }
              }
              break;
          }
        } else {
          ruleId = _RuleFactory.getCompiledRuleId(pattern, helper, repository);
        }
        if (ruleId !== -1) {
          const rule = helper.getRule(ruleId);
          let skipRule = false;
          if (rule instanceof IncludeOnlyRule || rule instanceof BeginEndRule || rule instanceof BeginWhileRule) {
            if (rule.hasMissingPatterns && rule.patterns.length === 0) {
              skipRule = true;
            }
          }
          if (skipRule) {
            continue;
          }
          r.push(ruleId);
        }
      }
    }
    return {
      patterns: r,
      hasMissingPatterns: (patterns ? patterns.length : 0) !== r.length
    };
  }
};
var RegExpSource = class _RegExpSource {
  constructor(regExpSource, ruleId) {
    if (regExpSource) {
      const len = regExpSource.length;
      let lastPushedPos = 0;
      let output = [];
      let hasAnchor = false;
      for (let pos = 0; pos < len; pos++) {
        const ch = regExpSource.charAt(pos);
        if (ch === "\\") {
          if (pos + 1 < len) {
            const nextCh = regExpSource.charAt(pos + 1);
            if (nextCh === "z") {
              output.push(regExpSource.substring(lastPushedPos, pos));
              output.push("$(?!\\n)(?<!\\n)");
              lastPushedPos = pos + 2;
            } else if (nextCh === "A" || nextCh === "G") {
              hasAnchor = true;
            }
            pos++;
          }
        }
      }
      this.hasAnchor = hasAnchor;
      if (lastPushedPos === 0) {
        this.source = regExpSource;
      } else {
        output.push(regExpSource.substring(lastPushedPos, len));
        this.source = output.join("");
      }
    } else {
      this.hasAnchor = false;
      this.source = regExpSource;
    }
    if (this.hasAnchor) {
      this._anchorCache = this._buildAnchorCache();
    } else {
      this._anchorCache = null;
    }
    this.ruleId = ruleId;
    this.hasBackReferences = HAS_BACK_REFERENCES.test(this.source);
  }
  clone() {
    return new _RegExpSource(this.source, this.ruleId);
  }
  setSource(newSource) {
    if (this.source === newSource) {
      return;
    }
    this.source = newSource;
    if (this.hasAnchor) {
      this._anchorCache = this._buildAnchorCache();
    }
  }
  resolveBackReferences(lineText, captureIndices) {
    let capturedValues = captureIndices.map((capture) => {
      return lineText.substring(capture.start, capture.end);
    });
    BACK_REFERENCING_END.lastIndex = 0;
    return this.source.replace(BACK_REFERENCING_END, (match, g1) => {
      return escapeRegExpCharacters(capturedValues[parseInt(g1, 10)] || "");
    });
  }
  _buildAnchorCache() {
    let A0_G0_result = [];
    let A0_G1_result = [];
    let A1_G0_result = [];
    let A1_G1_result = [];
    let pos, len, ch, nextCh;
    for (pos = 0, len = this.source.length; pos < len; pos++) {
      ch = this.source.charAt(pos);
      A0_G0_result[pos] = ch;
      A0_G1_result[pos] = ch;
      A1_G0_result[pos] = ch;
      A1_G1_result[pos] = ch;
      if (ch === "\\") {
        if (pos + 1 < len) {
          nextCh = this.source.charAt(pos + 1);
          if (nextCh === "A") {
            A0_G0_result[pos + 1] = "\uFFFF";
            A0_G1_result[pos + 1] = "\uFFFF";
            A1_G0_result[pos + 1] = "A";
            A1_G1_result[pos + 1] = "A";
          } else if (nextCh === "G") {
            A0_G0_result[pos + 1] = "\uFFFF";
            A0_G1_result[pos + 1] = "G";
            A1_G0_result[pos + 1] = "\uFFFF";
            A1_G1_result[pos + 1] = "G";
          } else {
            A0_G0_result[pos + 1] = nextCh;
            A0_G1_result[pos + 1] = nextCh;
            A1_G0_result[pos + 1] = nextCh;
            A1_G1_result[pos + 1] = nextCh;
          }
          pos++;
        }
      }
    }
    return {
      A0_G0: A0_G0_result.join(""),
      A0_G1: A0_G1_result.join(""),
      A1_G0: A1_G0_result.join(""),
      A1_G1: A1_G1_result.join("")
    };
  }
  resolveAnchors(allowA, allowG) {
    if (!this.hasAnchor || !this._anchorCache) {
      return this.source;
    }
    if (allowA) {
      if (allowG) {
        return this._anchorCache.A1_G1;
      } else {
        return this._anchorCache.A1_G0;
      }
    } else {
      if (allowG) {
        return this._anchorCache.A0_G1;
      } else {
        return this._anchorCache.A0_G0;
      }
    }
  }
};
var RegExpSourceList = class {
  constructor() {
    this._items = [];
    this._hasAnchors = false;
    this._cached = null;
    this._anchorCache = {
      A0_G0: null,
      A0_G1: null,
      A1_G0: null,
      A1_G1: null
    };
  }
  dispose() {
    this._disposeCaches();
  }
  _disposeCaches() {
    if (this._cached) {
      this._cached.dispose();
      this._cached = null;
    }
    if (this._anchorCache.A0_G0) {
      this._anchorCache.A0_G0.dispose();
      this._anchorCache.A0_G0 = null;
    }
    if (this._anchorCache.A0_G1) {
      this._anchorCache.A0_G1.dispose();
      this._anchorCache.A0_G1 = null;
    }
    if (this._anchorCache.A1_G0) {
      this._anchorCache.A1_G0.dispose();
      this._anchorCache.A1_G0 = null;
    }
    if (this._anchorCache.A1_G1) {
      this._anchorCache.A1_G1.dispose();
      this._anchorCache.A1_G1 = null;
    }
  }
  push(item) {
    this._items.push(item);
    this._hasAnchors = this._hasAnchors || item.hasAnchor;
  }
  unshift(item) {
    this._items.unshift(item);
    this._hasAnchors = this._hasAnchors || item.hasAnchor;
  }
  length() {
    return this._items.length;
  }
  setSource(index, newSource) {
    if (this._items[index].source !== newSource) {
      this._disposeCaches();
      this._items[index].setSource(newSource);
    }
  }
  compile(onigLib) {
    if (!this._cached) {
      let regExps = this._items.map((e) => e.source);
      this._cached = new CompiledRule(onigLib, regExps, this._items.map((e) => e.ruleId));
    }
    return this._cached;
  }
  compileAG(onigLib, allowA, allowG) {
    if (!this._hasAnchors) {
      return this.compile(onigLib);
    } else {
      if (allowA) {
        if (allowG) {
          if (!this._anchorCache.A1_G1) {
            this._anchorCache.A1_G1 = this._resolveAnchors(onigLib, allowA, allowG);
          }
          return this._anchorCache.A1_G1;
        } else {
          if (!this._anchorCache.A1_G0) {
            this._anchorCache.A1_G0 = this._resolveAnchors(onigLib, allowA, allowG);
          }
          return this._anchorCache.A1_G0;
        }
      } else {
        if (allowG) {
          if (!this._anchorCache.A0_G1) {
            this._anchorCache.A0_G1 = this._resolveAnchors(onigLib, allowA, allowG);
          }
          return this._anchorCache.A0_G1;
        } else {
          if (!this._anchorCache.A0_G0) {
            this._anchorCache.A0_G0 = this._resolveAnchors(onigLib, allowA, allowG);
          }
          return this._anchorCache.A0_G0;
        }
      }
    }
  }
  _resolveAnchors(onigLib, allowA, allowG) {
    let regExps = this._items.map((e) => e.resolveAnchors(allowA, allowG));
    return new CompiledRule(onigLib, regExps, this._items.map((e) => e.ruleId));
  }
};
var CompiledRule = class {
  constructor(onigLib, regExps, rules) {
    this.regExps = regExps;
    this.rules = rules;
    this.scanner = onigLib.createOnigScanner(regExps);
  }
  dispose() {
    if (typeof this.scanner.dispose === "function") {
      this.scanner.dispose();
    }
  }
  toString() {
    const r = [];
    for (let i = 0, len = this.rules.length; i < len; i++) {
      r.push("   - " + this.rules[i] + ": " + this.regExps[i]);
    }
    return r.join("\n");
  }
  findNextMatchSync(string, startPosition, options) {
    const result = this.scanner.findNextMatchSync(string, startPosition, options);
    if (!result) {
      return null;
    }
    return {
      ruleId: this.rules[result.index],
      captureIndices: result.captureIndices
    };
  }
};

// src/grammar/basicScopesAttributeProvider.ts
var BasicScopeAttributes = class {
  constructor(languageId, tokenType) {
    this.languageId = languageId;
    this.tokenType = tokenType;
  }
};
var _BasicScopeAttributesProvider = class _BasicScopeAttributesProvider {
  constructor(initialLanguageId, embeddedLanguages) {
    this._getBasicScopeAttributes = new CachedFn((scopeName) => {
      const languageId = this._scopeToLanguage(scopeName);
      const standardTokenType = this._toStandardTokenType(scopeName);
      return new BasicScopeAttributes(languageId, standardTokenType);
    });
    this._defaultAttributes = new BasicScopeAttributes(initialLanguageId, 8 /* NotSet */);
    this._embeddedLanguagesMatcher = new ScopeMatcher(Object.entries(embeddedLanguages || {}));
  }
  getDefaultAttributes() {
    return this._defaultAttributes;
  }
  getBasicScopeAttributes(scopeName) {
    if (scopeName === null) {
      return _BasicScopeAttributesProvider._NULL_SCOPE_METADATA;
    }
    return this._getBasicScopeAttributes.get(scopeName);
  }
  /**
   * Given a produced TM scope, return the language that token describes or null if unknown.
   * e.g. source.html => html, source.css.embedded.html => css, punctuation.definition.tag.html => null
   */
  _scopeToLanguage(scope) {
    return this._embeddedLanguagesMatcher.match(scope) || 0;
  }
  _toStandardTokenType(scopeName) {
    const m = scopeName.match(_BasicScopeAttributesProvider.STANDARD_TOKEN_TYPE_REGEXP);
    if (!m) {
      return 8 /* NotSet */;
    }
    switch (m[1]) {
      case "comment":
        return 1 /* Comment */;
      case "string":
        return 2 /* String */;
      case "regex":
        return 3 /* RegEx */;
      case "meta.embedded":
        return 0 /* Other */;
    }
    throw new Error("Unexpected match for standard token type!");
  }
};
_BasicScopeAttributesProvider._NULL_SCOPE_METADATA = new BasicScopeAttributes(0, 0);
_BasicScopeAttributesProvider.STANDARD_TOKEN_TYPE_REGEXP = /\b(comment|string|regex|meta\.embedded)\b/;
var BasicScopeAttributesProvider = _BasicScopeAttributesProvider;
var ScopeMatcher = class {
  constructor(values) {
    if (values.length === 0) {
      this.values = null;
      this.scopesRegExp = null;
    } else {
      this.values = new Map(values);
      const escapedScopes = values.map(
        ([scopeName, value]) => escapeRegExpCharacters(scopeName)
      );
      escapedScopes.sort();
      escapedScopes.reverse();
      this.scopesRegExp = new RegExp(
        `^((${escapedScopes.join(")|(")}))($|\\.)`,
        ""
      );
    }
  }
  match(scope) {
    if (!this.scopesRegExp) {
      return void 0;
    }
    const m = scope.match(this.scopesRegExp);
    if (!m) {
      return void 0;
    }
    return this.values.get(m[1]);
  }
};

// src/debug.ts
({
  InDebugMode: typeof process !== "undefined" && !!process.env["VSCODE_TEXTMATE_DEBUG"]
});

// src/grammar/tokenizeString.ts
var TokenizeStringResult = class {
  constructor(stack, stoppedEarly) {
    this.stack = stack;
    this.stoppedEarly = stoppedEarly;
  }
};
function _tokenizeString(grammar, lineText, isFirstLine, linePos, stack, lineTokens, checkWhileConditions, timeLimit) {
  const lineLength = lineText.content.length;
  let STOP = false;
  let anchorPosition = -1;
  if (checkWhileConditions) {
    const whileCheckResult = _checkWhileConditions(
      grammar,
      lineText,
      isFirstLine,
      linePos,
      stack,
      lineTokens
    );
    stack = whileCheckResult.stack;
    linePos = whileCheckResult.linePos;
    isFirstLine = whileCheckResult.isFirstLine;
    anchorPosition = whileCheckResult.anchorPosition;
  }
  const startTime = Date.now();
  while (!STOP) {
    if (timeLimit !== 0) {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > timeLimit) {
        return new TokenizeStringResult(stack, true);
      }
    }
    scanNext();
  }
  return new TokenizeStringResult(stack, false);
  function scanNext() {
    const r = matchRuleOrInjections(
      grammar,
      lineText,
      isFirstLine,
      linePos,
      stack,
      anchorPosition
    );
    if (!r) {
      lineTokens.produce(stack, lineLength);
      STOP = true;
      return;
    }
    const captureIndices = r.captureIndices;
    const matchedRuleId = r.matchedRuleId;
    const hasAdvanced = captureIndices && captureIndices.length > 0 ? captureIndices[0].end > linePos : false;
    if (matchedRuleId === endRuleId) {
      const poppedRule = stack.getRule(grammar);
      lineTokens.produce(stack, captureIndices[0].start);
      stack = stack.withContentNameScopesList(stack.nameScopesList);
      handleCaptures(
        grammar,
        lineText,
        isFirstLine,
        stack,
        lineTokens,
        poppedRule.endCaptures,
        captureIndices
      );
      lineTokens.produce(stack, captureIndices[0].end);
      const popped = stack;
      stack = stack.parent;
      anchorPosition = popped.getAnchorPos();
      if (!hasAdvanced && popped.getEnterPos() === linePos) {
        stack = popped;
        lineTokens.produce(stack, lineLength);
        STOP = true;
        return;
      }
    } else {
      const _rule = grammar.getRule(matchedRuleId);
      lineTokens.produce(stack, captureIndices[0].start);
      const beforePush = stack;
      const scopeName = _rule.getName(lineText.content, captureIndices);
      const nameScopesList = stack.contentNameScopesList.pushAttributed(
        scopeName,
        grammar
      );
      stack = stack.push(
        matchedRuleId,
        linePos,
        anchorPosition,
        captureIndices[0].end === lineLength,
        null,
        nameScopesList,
        nameScopesList
      );
      if (_rule instanceof BeginEndRule) {
        const pushedRule = _rule;
        handleCaptures(
          grammar,
          lineText,
          isFirstLine,
          stack,
          lineTokens,
          pushedRule.beginCaptures,
          captureIndices
        );
        lineTokens.produce(stack, captureIndices[0].end);
        anchorPosition = captureIndices[0].end;
        const contentName = pushedRule.getContentName(
          lineText.content,
          captureIndices
        );
        const contentNameScopesList = nameScopesList.pushAttributed(
          contentName,
          grammar
        );
        stack = stack.withContentNameScopesList(contentNameScopesList);
        if (pushedRule.endHasBackReferences) {
          stack = stack.withEndRule(
            pushedRule.getEndWithResolvedBackReferences(
              lineText.content,
              captureIndices
            )
          );
        }
        if (!hasAdvanced && beforePush.hasSameRuleAs(stack)) {
          stack = stack.pop();
          lineTokens.produce(stack, lineLength);
          STOP = true;
          return;
        }
      } else if (_rule instanceof BeginWhileRule) {
        const pushedRule = _rule;
        handleCaptures(
          grammar,
          lineText,
          isFirstLine,
          stack,
          lineTokens,
          pushedRule.beginCaptures,
          captureIndices
        );
        lineTokens.produce(stack, captureIndices[0].end);
        anchorPosition = captureIndices[0].end;
        const contentName = pushedRule.getContentName(
          lineText.content,
          captureIndices
        );
        const contentNameScopesList = nameScopesList.pushAttributed(
          contentName,
          grammar
        );
        stack = stack.withContentNameScopesList(contentNameScopesList);
        if (pushedRule.whileHasBackReferences) {
          stack = stack.withEndRule(
            pushedRule.getWhileWithResolvedBackReferences(
              lineText.content,
              captureIndices
            )
          );
        }
        if (!hasAdvanced && beforePush.hasSameRuleAs(stack)) {
          stack = stack.pop();
          lineTokens.produce(stack, lineLength);
          STOP = true;
          return;
        }
      } else {
        const matchingRule = _rule;
        handleCaptures(
          grammar,
          lineText,
          isFirstLine,
          stack,
          lineTokens,
          matchingRule.captures,
          captureIndices
        );
        lineTokens.produce(stack, captureIndices[0].end);
        stack = stack.pop();
        if (!hasAdvanced) {
          stack = stack.safePop();
          lineTokens.produce(stack, lineLength);
          STOP = true;
          return;
        }
      }
    }
    if (captureIndices[0].end > linePos) {
      linePos = captureIndices[0].end;
      isFirstLine = false;
    }
  }
}
function _checkWhileConditions(grammar, lineText, isFirstLine, linePos, stack, lineTokens) {
  let anchorPosition = stack.beginRuleCapturedEOL ? 0 : -1;
  const whileRules = [];
  for (let node = stack; node; node = node.pop()) {
    const nodeRule = node.getRule(grammar);
    if (nodeRule instanceof BeginWhileRule) {
      whileRules.push({
        rule: nodeRule,
        stack: node
      });
    }
  }
  for (let whileRule = whileRules.pop(); whileRule; whileRule = whileRules.pop()) {
    const { ruleScanner, findOptions } = prepareRuleWhileSearch(whileRule.rule, grammar, whileRule.stack.endRule, isFirstLine, linePos === anchorPosition);
    const r = ruleScanner.findNextMatchSync(lineText, linePos, findOptions);
    if (r) {
      const matchedRuleId = r.ruleId;
      if (matchedRuleId !== whileRuleId) {
        stack = whileRule.stack.pop();
        break;
      }
      if (r.captureIndices && r.captureIndices.length) {
        lineTokens.produce(whileRule.stack, r.captureIndices[0].start);
        handleCaptures(grammar, lineText, isFirstLine, whileRule.stack, lineTokens, whileRule.rule.whileCaptures, r.captureIndices);
        lineTokens.produce(whileRule.stack, r.captureIndices[0].end);
        anchorPosition = r.captureIndices[0].end;
        if (r.captureIndices[0].end > linePos) {
          linePos = r.captureIndices[0].end;
          isFirstLine = false;
        }
      }
    } else {
      stack = whileRule.stack.pop();
      break;
    }
  }
  return { stack, linePos, anchorPosition, isFirstLine };
}
function matchRuleOrInjections(grammar, lineText, isFirstLine, linePos, stack, anchorPosition) {
  const matchResult = matchRule(grammar, lineText, isFirstLine, linePos, stack, anchorPosition);
  const injections = grammar.getInjections();
  if (injections.length === 0) {
    return matchResult;
  }
  const injectionResult = matchInjections(injections, grammar, lineText, isFirstLine, linePos, stack, anchorPosition);
  if (!injectionResult) {
    return matchResult;
  }
  if (!matchResult) {
    return injectionResult;
  }
  const matchResultScore = matchResult.captureIndices[0].start;
  const injectionResultScore = injectionResult.captureIndices[0].start;
  if (injectionResultScore < matchResultScore || injectionResult.priorityMatch && injectionResultScore === matchResultScore) {
    return injectionResult;
  }
  return matchResult;
}
function matchRule(grammar, lineText, isFirstLine, linePos, stack, anchorPosition) {
  const rule = stack.getRule(grammar);
  const { ruleScanner, findOptions } = prepareRuleSearch(rule, grammar, stack.endRule, isFirstLine, linePos === anchorPosition);
  const r = ruleScanner.findNextMatchSync(lineText, linePos, findOptions);
  if (r) {
    return {
      captureIndices: r.captureIndices,
      matchedRuleId: r.ruleId
    };
  }
  return null;
}
function matchInjections(injections, grammar, lineText, isFirstLine, linePos, stack, anchorPosition) {
  let bestMatchRating = Number.MAX_VALUE;
  let bestMatchCaptureIndices = null;
  let bestMatchRuleId;
  let bestMatchResultPriority = 0;
  const scopes = stack.contentNameScopesList.getScopeNames();
  for (let i = 0, len = injections.length; i < len; i++) {
    const injection = injections[i];
    if (!injection.matcher(scopes)) {
      continue;
    }
    const rule = grammar.getRule(injection.ruleId);
    const { ruleScanner, findOptions } = prepareRuleSearch(rule, grammar, null, isFirstLine, linePos === anchorPosition);
    const matchResult = ruleScanner.findNextMatchSync(lineText, linePos, findOptions);
    if (!matchResult) {
      continue;
    }
    const matchRating = matchResult.captureIndices[0].start;
    if (matchRating >= bestMatchRating) {
      continue;
    }
    bestMatchRating = matchRating;
    bestMatchCaptureIndices = matchResult.captureIndices;
    bestMatchRuleId = matchResult.ruleId;
    bestMatchResultPriority = injection.priority;
    if (bestMatchRating === linePos) {
      break;
    }
  }
  if (bestMatchCaptureIndices) {
    return {
      priorityMatch: bestMatchResultPriority === -1,
      captureIndices: bestMatchCaptureIndices,
      matchedRuleId: bestMatchRuleId
    };
  }
  return null;
}
function prepareRuleSearch(rule, grammar, endRegexSource, allowA, allowG) {
  const ruleScanner = rule.compileAG(grammar, endRegexSource, allowA, allowG);
  return { ruleScanner, findOptions: 0 /* None */ };
}
function prepareRuleWhileSearch(rule, grammar, endRegexSource, allowA, allowG) {
  const ruleScanner = rule.compileWhileAG(grammar, endRegexSource, allowA, allowG);
  return { ruleScanner, findOptions: 0 /* None */ };
}
function handleCaptures(grammar, lineText, isFirstLine, stack, lineTokens, captures, captureIndices) {
  if (captures.length === 0) {
    return;
  }
  const lineTextContent = lineText.content;
  const len = Math.min(captures.length, captureIndices.length);
  const localStack = [];
  const maxEnd = captureIndices[0].end;
  for (let i = 0; i < len; i++) {
    const captureRule = captures[i];
    if (captureRule === null) {
      continue;
    }
    const captureIndex = captureIndices[i];
    if (captureIndex.length === 0) {
      continue;
    }
    if (captureIndex.start > maxEnd) {
      break;
    }
    while (localStack.length > 0 && localStack[localStack.length - 1].endPos <= captureIndex.start) {
      lineTokens.produceFromScopes(localStack[localStack.length - 1].scopes, localStack[localStack.length - 1].endPos);
      localStack.pop();
    }
    if (localStack.length > 0) {
      lineTokens.produceFromScopes(localStack[localStack.length - 1].scopes, captureIndex.start);
    } else {
      lineTokens.produce(stack, captureIndex.start);
    }
    if (captureRule.retokenizeCapturedWithRuleId) {
      const scopeName = captureRule.getName(lineTextContent, captureIndices);
      const nameScopesList = stack.contentNameScopesList.pushAttributed(scopeName, grammar);
      const contentName = captureRule.getContentName(lineTextContent, captureIndices);
      const contentNameScopesList = nameScopesList.pushAttributed(contentName, grammar);
      const stackClone = stack.push(captureRule.retokenizeCapturedWithRuleId, captureIndex.start, -1, false, null, nameScopesList, contentNameScopesList);
      const onigSubStr = grammar.createOnigString(lineTextContent.substring(0, captureIndex.end));
      _tokenizeString(
        grammar,
        onigSubStr,
        isFirstLine && captureIndex.start === 0,
        captureIndex.start,
        stackClone,
        lineTokens,
        false,
        /* no time limit */
        0
      );
      disposeOnigString(onigSubStr);
      continue;
    }
    const captureRuleScopeName = captureRule.getName(lineTextContent, captureIndices);
    if (captureRuleScopeName !== null) {
      const base = localStack.length > 0 ? localStack[localStack.length - 1].scopes : stack.contentNameScopesList;
      const captureRuleScopesList = base.pushAttributed(captureRuleScopeName, grammar);
      localStack.push(new LocalStackElement(captureRuleScopesList, captureIndex.end));
    }
  }
  while (localStack.length > 0) {
    lineTokens.produceFromScopes(localStack[localStack.length - 1].scopes, localStack[localStack.length - 1].endPos);
    localStack.pop();
  }
}
var LocalStackElement = class {
  constructor(scopes, endPos) {
    this.scopes = scopes;
    this.endPos = endPos;
  }
};

// src/grammar/grammar.ts
function createGrammar(scopeName, grammar, initialLanguage, embeddedLanguages, tokenTypes, balancedBracketSelectors, grammarRepository, onigLib) {
  return new Grammar(
    scopeName,
    grammar,
    initialLanguage,
    embeddedLanguages,
    tokenTypes,
    balancedBracketSelectors,
    grammarRepository,
    onigLib
  );
}
function collectInjections(result, selector, rule, ruleFactoryHelper, grammar) {
  const matchers = createMatchers(selector, nameMatcher);
  const ruleId = RuleFactory.getCompiledRuleId(rule, ruleFactoryHelper, grammar.repository);
  for (const matcher of matchers) {
    result.push({
      debugSelector: selector,
      matcher: matcher.matcher,
      ruleId,
      grammar,
      priority: matcher.priority
    });
  }
}
function nameMatcher(identifers, scopes) {
  if (scopes.length < identifers.length) {
    return false;
  }
  let lastIndex = 0;
  return identifers.every((identifier) => {
    for (let i = lastIndex; i < scopes.length; i++) {
      if (scopesAreMatching(scopes[i], identifier)) {
        lastIndex = i + 1;
        return true;
      }
    }
    return false;
  });
}
function scopesAreMatching(thisScopeName, scopeName) {
  if (!thisScopeName) {
    return false;
  }
  if (thisScopeName === scopeName) {
    return true;
  }
  const len = scopeName.length;
  return thisScopeName.length > len && thisScopeName.substr(0, len) === scopeName && thisScopeName[len] === ".";
}
var Grammar = class {
  constructor(_rootScopeName, grammar, initialLanguage, embeddedLanguages, tokenTypes, balancedBracketSelectors, grammarRepository, _onigLib) {
    this._rootScopeName = _rootScopeName;
    this.balancedBracketSelectors = balancedBracketSelectors;
    this._onigLib = _onigLib;
    this._basicScopeAttributesProvider = new BasicScopeAttributesProvider(
      initialLanguage,
      embeddedLanguages
    );
    this._rootId = -1;
    this._lastRuleId = 0;
    this._ruleId2desc = [null];
    this._includedGrammars = {};
    this._grammarRepository = grammarRepository;
    this._grammar = initGrammar(grammar, null);
    this._injections = null;
    this._tokenTypeMatchers = [];
    if (tokenTypes) {
      for (const selector of Object.keys(tokenTypes)) {
        const matchers = createMatchers(selector, nameMatcher);
        for (const matcher of matchers) {
          this._tokenTypeMatchers.push({
            matcher: matcher.matcher,
            type: tokenTypes[selector]
          });
        }
      }
    }
  }
  get themeProvider() {
    return this._grammarRepository;
  }
  dispose() {
    for (const rule of this._ruleId2desc) {
      if (rule) {
        rule.dispose();
      }
    }
  }
  createOnigScanner(sources) {
    return this._onigLib.createOnigScanner(sources);
  }
  createOnigString(sources) {
    return this._onigLib.createOnigString(sources);
  }
  getMetadataForScope(scope) {
    return this._basicScopeAttributesProvider.getBasicScopeAttributes(scope);
  }
  _collectInjections() {
    const grammarRepository = {
      lookup: (scopeName2) => {
        if (scopeName2 === this._rootScopeName) {
          return this._grammar;
        }
        return this.getExternalGrammar(scopeName2);
      },
      injections: (scopeName2) => {
        return this._grammarRepository.injections(scopeName2);
      }
    };
    const result = [];
    const scopeName = this._rootScopeName;
    const grammar = grammarRepository.lookup(scopeName);
    if (grammar) {
      const rawInjections = grammar.injections;
      if (rawInjections) {
        for (let expression in rawInjections) {
          collectInjections(
            result,
            expression,
            rawInjections[expression],
            this,
            grammar
          );
        }
      }
      const injectionScopeNames = this._grammarRepository.injections(scopeName);
      if (injectionScopeNames) {
        injectionScopeNames.forEach((injectionScopeName) => {
          const injectionGrammar = this.getExternalGrammar(injectionScopeName);
          if (injectionGrammar) {
            const selector = injectionGrammar.injectionSelector;
            if (selector) {
              collectInjections(
                result,
                selector,
                injectionGrammar,
                this,
                injectionGrammar
              );
            }
          }
        });
      }
    }
    result.sort((i1, i2) => i1.priority - i2.priority);
    return result;
  }
  getInjections() {
    if (this._injections === null) {
      this._injections = this._collectInjections();
    }
    return this._injections;
  }
  registerRule(factory) {
    const id = ++this._lastRuleId;
    const result = factory(ruleIdFromNumber(id));
    this._ruleId2desc[id] = result;
    return result;
  }
  getRule(ruleId) {
    return this._ruleId2desc[ruleIdToNumber(ruleId)];
  }
  getExternalGrammar(scopeName, repository) {
    if (this._includedGrammars[scopeName]) {
      return this._includedGrammars[scopeName];
    } else if (this._grammarRepository) {
      const rawIncludedGrammar = this._grammarRepository.lookup(scopeName);
      if (rawIncludedGrammar) {
        this._includedGrammars[scopeName] = initGrammar(
          rawIncludedGrammar,
          repository && repository.$base
        );
        return this._includedGrammars[scopeName];
      }
    }
    return void 0;
  }
  tokenizeLine(lineText, prevState, timeLimit = 0) {
    const r = this._tokenize(lineText, prevState, false, timeLimit);
    return {
      tokens: r.lineTokens.getResult(r.ruleStack, r.lineLength),
      ruleStack: r.ruleStack,
      stoppedEarly: r.stoppedEarly
    };
  }
  tokenizeLine2(lineText, prevState, timeLimit = 0) {
    const r = this._tokenize(lineText, prevState, true, timeLimit);
    return {
      tokens: r.lineTokens.getBinaryResult(r.ruleStack, r.lineLength),
      ruleStack: r.ruleStack,
      stoppedEarly: r.stoppedEarly
    };
  }
  _tokenize(lineText, prevState, emitBinaryTokens, timeLimit) {
    if (this._rootId === -1) {
      this._rootId = RuleFactory.getCompiledRuleId(
        this._grammar.repository.$self,
        this,
        this._grammar.repository
      );
      this.getInjections();
    }
    let isFirstLine;
    if (!prevState || prevState === StateStackImpl.NULL) {
      isFirstLine = true;
      const rawDefaultMetadata = this._basicScopeAttributesProvider.getDefaultAttributes();
      const defaultStyle = this.themeProvider.getDefaults();
      const defaultMetadata = EncodedTokenMetadata.set(
        0,
        rawDefaultMetadata.languageId,
        rawDefaultMetadata.tokenType,
        null,
        defaultStyle.fontStyle,
        defaultStyle.foregroundId,
        defaultStyle.backgroundId
      );
      const rootScopeName = this.getRule(this._rootId).getName(
        null,
        null
      );
      let scopeList;
      if (rootScopeName) {
        scopeList = AttributedScopeStack.createRootAndLookUpScopeName(
          rootScopeName,
          defaultMetadata,
          this
        );
      } else {
        scopeList = AttributedScopeStack.createRoot(
          "unknown",
          defaultMetadata
        );
      }
      prevState = new StateStackImpl(
        null,
        this._rootId,
        -1,
        -1,
        false,
        null,
        scopeList,
        scopeList
      );
    } else {
      isFirstLine = false;
      prevState.reset();
    }
    lineText = lineText + "\n";
    const onigLineText = this.createOnigString(lineText);
    const lineLength = onigLineText.content.length;
    const lineTokens = new LineTokens(
      emitBinaryTokens,
      lineText,
      this._tokenTypeMatchers,
      this.balancedBracketSelectors
    );
    const r = _tokenizeString(
      this,
      onigLineText,
      isFirstLine,
      0,
      prevState,
      lineTokens,
      true,
      timeLimit
    );
    disposeOnigString(onigLineText);
    return {
      lineLength,
      lineTokens,
      ruleStack: r.stack,
      stoppedEarly: r.stoppedEarly
    };
  }
};
function initGrammar(grammar, base) {
  grammar = clone(grammar);
  grammar.repository = grammar.repository || {};
  grammar.repository.$self = {
    $vscodeTextmateLocation: grammar.$vscodeTextmateLocation,
    patterns: grammar.patterns,
    name: grammar.scopeName
  };
  grammar.repository.$base = base || grammar.repository.$self;
  return grammar;
}
var AttributedScopeStack = class _AttributedScopeStack {
  /**
   * Invariant:
   * ```
   * if (parent && !scopePath.extends(parent.scopePath)) {
   * 	throw new Error();
   * }
   * ```
   */
  constructor(parent, scopePath, tokenAttributes) {
    this.parent = parent;
    this.scopePath = scopePath;
    this.tokenAttributes = tokenAttributes;
  }
  static fromExtension(namesScopeList, contentNameScopesList) {
    let current = namesScopeList;
    let scopeNames = namesScopeList?.scopePath ?? null;
    for (const frame of contentNameScopesList) {
      scopeNames = ScopeStack.push(scopeNames, frame.scopeNames);
      current = new _AttributedScopeStack(current, scopeNames, frame.encodedTokenAttributes);
    }
    return current;
  }
  static createRoot(scopeName, tokenAttributes) {
    return new _AttributedScopeStack(null, new ScopeStack(null, scopeName), tokenAttributes);
  }
  static createRootAndLookUpScopeName(scopeName, tokenAttributes, grammar) {
    const rawRootMetadata = grammar.getMetadataForScope(scopeName);
    const scopePath = new ScopeStack(null, scopeName);
    const rootStyle = grammar.themeProvider.themeMatch(scopePath);
    const resolvedTokenAttributes = _AttributedScopeStack.mergeAttributes(
      tokenAttributes,
      rawRootMetadata,
      rootStyle
    );
    return new _AttributedScopeStack(null, scopePath, resolvedTokenAttributes);
  }
  get scopeName() {
    return this.scopePath.scopeName;
  }
  toString() {
    return this.getScopeNames().join(" ");
  }
  equals(other) {
    return _AttributedScopeStack.equals(this, other);
  }
  static equals(a, b) {
    do {
      if (a === b) {
        return true;
      }
      if (!a && !b) {
        return true;
      }
      if (!a || !b) {
        return false;
      }
      if (a.scopeName !== b.scopeName || a.tokenAttributes !== b.tokenAttributes) {
        return false;
      }
      a = a.parent;
      b = b.parent;
    } while (true);
  }
  static mergeAttributes(existingTokenAttributes, basicScopeAttributes, styleAttributes) {
    let fontStyle = -1 /* NotSet */;
    let foreground = 0;
    let background = 0;
    if (styleAttributes !== null) {
      fontStyle = styleAttributes.fontStyle;
      foreground = styleAttributes.foregroundId;
      background = styleAttributes.backgroundId;
    }
    return EncodedTokenMetadata.set(
      existingTokenAttributes,
      basicScopeAttributes.languageId,
      basicScopeAttributes.tokenType,
      null,
      fontStyle,
      foreground,
      background
    );
  }
  pushAttributed(scopePath, grammar) {
    if (scopePath === null) {
      return this;
    }
    if (scopePath.indexOf(" ") === -1) {
      return _AttributedScopeStack._pushAttributed(this, scopePath, grammar);
    }
    const scopes = scopePath.split(/ /g);
    let result = this;
    for (const scope of scopes) {
      result = _AttributedScopeStack._pushAttributed(result, scope, grammar);
    }
    return result;
  }
  static _pushAttributed(target, scopeName, grammar) {
    const rawMetadata = grammar.getMetadataForScope(scopeName);
    const newPath = target.scopePath.push(scopeName);
    const scopeThemeMatchResult = grammar.themeProvider.themeMatch(newPath);
    const metadata = _AttributedScopeStack.mergeAttributes(
      target.tokenAttributes,
      rawMetadata,
      scopeThemeMatchResult
    );
    return new _AttributedScopeStack(target, newPath, metadata);
  }
  getScopeNames() {
    return this.scopePath.getSegments();
  }
  getExtensionIfDefined(base) {
    const result = [];
    let self = this;
    while (self && self !== base) {
      result.push({
        encodedTokenAttributes: self.tokenAttributes,
        scopeNames: self.scopePath.getExtensionIfDefined(self.parent?.scopePath ?? null)
      });
      self = self.parent;
    }
    return self === base ? result.reverse() : void 0;
  }
};
var _StateStackImpl = class _StateStackImpl {
  /**
   * Invariant:
   * ```
   * if (contentNameScopesList !== nameScopesList && contentNameScopesList?.parent !== nameScopesList) {
   * 	throw new Error();
   * }
   * if (this.parent && !nameScopesList.extends(this.parent.contentNameScopesList)) {
   * 	throw new Error();
   * }
   * ```
   */
  constructor(parent, ruleId, enterPos, anchorPos, beginRuleCapturedEOL, endRule, nameScopesList, contentNameScopesList) {
    this.parent = parent;
    this.ruleId = ruleId;
    this.beginRuleCapturedEOL = beginRuleCapturedEOL;
    this.endRule = endRule;
    this.nameScopesList = nameScopesList;
    this.contentNameScopesList = contentNameScopesList;
    this._stackElementBrand = void 0;
    this.depth = this.parent ? this.parent.depth + 1 : 1;
    this._enterPos = enterPos;
    this._anchorPos = anchorPos;
  }
  equals(other) {
    if (other === null) {
      return false;
    }
    return _StateStackImpl._equals(this, other);
  }
  static _equals(a, b) {
    if (a === b) {
      return true;
    }
    if (!this._structuralEquals(a, b)) {
      return false;
    }
    return AttributedScopeStack.equals(a.contentNameScopesList, b.contentNameScopesList);
  }
  /**
   * A structural equals check. Does not take into account `scopes`.
   */
  static _structuralEquals(a, b) {
    do {
      if (a === b) {
        return true;
      }
      if (!a && !b) {
        return true;
      }
      if (!a || !b) {
        return false;
      }
      if (a.depth !== b.depth || a.ruleId !== b.ruleId || a.endRule !== b.endRule) {
        return false;
      }
      a = a.parent;
      b = b.parent;
    } while (true);
  }
  clone() {
    return this;
  }
  static _reset(el) {
    while (el) {
      el._enterPos = -1;
      el._anchorPos = -1;
      el = el.parent;
    }
  }
  reset() {
    _StateStackImpl._reset(this);
  }
  pop() {
    return this.parent;
  }
  safePop() {
    if (this.parent) {
      return this.parent;
    }
    return this;
  }
  push(ruleId, enterPos, anchorPos, beginRuleCapturedEOL, endRule, nameScopesList, contentNameScopesList) {
    return new _StateStackImpl(
      this,
      ruleId,
      enterPos,
      anchorPos,
      beginRuleCapturedEOL,
      endRule,
      nameScopesList,
      contentNameScopesList
    );
  }
  getEnterPos() {
    return this._enterPos;
  }
  getAnchorPos() {
    return this._anchorPos;
  }
  getRule(grammar) {
    return grammar.getRule(this.ruleId);
  }
  toString() {
    const r = [];
    this._writeString(r, 0);
    return "[" + r.join(",") + "]";
  }
  _writeString(res, outIndex) {
    if (this.parent) {
      outIndex = this.parent._writeString(res, outIndex);
    }
    res[outIndex++] = `(${this.ruleId}, ${this.nameScopesList?.toString()}, ${this.contentNameScopesList?.toString()})`;
    return outIndex;
  }
  withContentNameScopesList(contentNameScopeStack) {
    if (this.contentNameScopesList === contentNameScopeStack) {
      return this;
    }
    return this.parent.push(
      this.ruleId,
      this._enterPos,
      this._anchorPos,
      this.beginRuleCapturedEOL,
      this.endRule,
      this.nameScopesList,
      contentNameScopeStack
    );
  }
  withEndRule(endRule) {
    if (this.endRule === endRule) {
      return this;
    }
    return new _StateStackImpl(
      this.parent,
      this.ruleId,
      this._enterPos,
      this._anchorPos,
      this.beginRuleCapturedEOL,
      endRule,
      this.nameScopesList,
      this.contentNameScopesList
    );
  }
  // Used to warn of endless loops
  hasSameRuleAs(other) {
    let el = this;
    while (el && el._enterPos === other._enterPos) {
      if (el.ruleId === other.ruleId) {
        return true;
      }
      el = el.parent;
    }
    return false;
  }
  toStateStackFrame() {
    return {
      ruleId: ruleIdToNumber(this.ruleId),
      beginRuleCapturedEOL: this.beginRuleCapturedEOL,
      endRule: this.endRule,
      nameScopesList: this.nameScopesList?.getExtensionIfDefined(this.parent?.nameScopesList ?? null) ?? [],
      contentNameScopesList: this.contentNameScopesList?.getExtensionIfDefined(this.nameScopesList) ?? []
    };
  }
  static pushFrame(self, frame) {
    const namesScopeList = AttributedScopeStack.fromExtension(self?.nameScopesList ?? null, frame.nameScopesList);
    return new _StateStackImpl(
      self,
      ruleIdFromNumber(frame.ruleId),
      frame.enterPos ?? -1,
      frame.anchorPos ?? -1,
      frame.beginRuleCapturedEOL,
      frame.endRule,
      namesScopeList,
      AttributedScopeStack.fromExtension(namesScopeList, frame.contentNameScopesList)
    );
  }
};
// TODO remove me
_StateStackImpl.NULL = new _StateStackImpl(
  null,
  0,
  0,
  0,
  false,
  null,
  null,
  null
);
var StateStackImpl = _StateStackImpl;
var BalancedBracketSelectors = class {
  constructor(balancedBracketScopes, unbalancedBracketScopes) {
    this.allowAny = false;
    this.balancedBracketScopes = balancedBracketScopes.flatMap(
      (selector) => {
        if (selector === "*") {
          this.allowAny = true;
          return [];
        }
        return createMatchers(selector, nameMatcher).map((m) => m.matcher);
      }
    );
    this.unbalancedBracketScopes = unbalancedBracketScopes.flatMap(
      (selector) => createMatchers(selector, nameMatcher).map((m) => m.matcher)
    );
  }
  get matchesAlways() {
    return this.allowAny && this.unbalancedBracketScopes.length === 0;
  }
  get matchesNever() {
    return this.balancedBracketScopes.length === 0 && !this.allowAny;
  }
  match(scopes) {
    for (const excluder of this.unbalancedBracketScopes) {
      if (excluder(scopes)) {
        return false;
      }
    }
    for (const includer of this.balancedBracketScopes) {
      if (includer(scopes)) {
        return true;
      }
    }
    return this.allowAny;
  }
};
var LineTokens = class {
  constructor(emitBinaryTokens, lineText, tokenTypeOverrides, balancedBracketSelectors) {
    this.balancedBracketSelectors = balancedBracketSelectors;
    this._emitBinaryTokens = emitBinaryTokens;
    this._tokenTypeOverrides = tokenTypeOverrides;
    {
      this._lineText = null;
    }
    this._tokens = [];
    this._binaryTokens = [];
    this._lastTokenEndIndex = 0;
  }
  produce(stack, endIndex) {
    this.produceFromScopes(stack.contentNameScopesList, endIndex);
  }
  produceFromScopes(scopesList, endIndex) {
    if (this._lastTokenEndIndex >= endIndex) {
      return;
    }
    if (this._emitBinaryTokens) {
      let metadata = scopesList?.tokenAttributes ?? 0;
      let containsBalancedBrackets = false;
      if (this.balancedBracketSelectors?.matchesAlways) {
        containsBalancedBrackets = true;
      }
      if (this._tokenTypeOverrides.length > 0 || this.balancedBracketSelectors && !this.balancedBracketSelectors.matchesAlways && !this.balancedBracketSelectors.matchesNever) {
        const scopes2 = scopesList?.getScopeNames() ?? [];
        for (const tokenType of this._tokenTypeOverrides) {
          if (tokenType.matcher(scopes2)) {
            metadata = EncodedTokenMetadata.set(
              metadata,
              0,
              toOptionalTokenType(tokenType.type),
              null,
              -1 /* NotSet */,
              0,
              0
            );
          }
        }
        if (this.balancedBracketSelectors) {
          containsBalancedBrackets = this.balancedBracketSelectors.match(scopes2);
        }
      }
      if (containsBalancedBrackets) {
        metadata = EncodedTokenMetadata.set(
          metadata,
          0,
          8 /* NotSet */,
          containsBalancedBrackets,
          -1 /* NotSet */,
          0,
          0
        );
      }
      if (this._binaryTokens.length > 0 && this._binaryTokens[this._binaryTokens.length - 1] === metadata) {
        this._lastTokenEndIndex = endIndex;
        return;
      }
      this._binaryTokens.push(this._lastTokenEndIndex);
      this._binaryTokens.push(metadata);
      this._lastTokenEndIndex = endIndex;
      return;
    }
    const scopes = scopesList?.getScopeNames() ?? [];
    this._tokens.push({
      startIndex: this._lastTokenEndIndex,
      endIndex,
      // value: lineText.substring(lastTokenEndIndex, endIndex),
      scopes
    });
    this._lastTokenEndIndex = endIndex;
  }
  getResult(stack, lineLength) {
    if (this._tokens.length > 0 && this._tokens[this._tokens.length - 1].startIndex === lineLength - 1) {
      this._tokens.pop();
    }
    if (this._tokens.length === 0) {
      this._lastTokenEndIndex = -1;
      this.produce(stack, lineLength);
      this._tokens[this._tokens.length - 1].startIndex = 0;
    }
    return this._tokens;
  }
  getBinaryResult(stack, lineLength) {
    if (this._binaryTokens.length > 0 && this._binaryTokens[this._binaryTokens.length - 2] === lineLength - 1) {
      this._binaryTokens.pop();
      this._binaryTokens.pop();
    }
    if (this._binaryTokens.length === 0) {
      this._lastTokenEndIndex = -1;
      this.produce(stack, lineLength);
      this._binaryTokens[this._binaryTokens.length - 2] = 0;
    }
    const result = new Uint32Array(this._binaryTokens.length);
    for (let i = 0, len = this._binaryTokens.length; i < len; i++) {
      result[i] = this._binaryTokens[i];
    }
    return result;
  }
};

// src/registry.ts
var SyncRegistry = class {
  constructor(theme, _onigLib) {
    this._onigLib = _onigLib;
    this._grammars = /* @__PURE__ */ new Map();
    this._rawGrammars = /* @__PURE__ */ new Map();
    this._injectionGrammars = /* @__PURE__ */ new Map();
    this._theme = theme;
  }
  dispose() {
    for (const grammar of this._grammars.values()) {
      grammar.dispose();
    }
  }
  setTheme(theme) {
    this._theme = theme;
  }
  getColorMap() {
    return this._theme.getColorMap();
  }
  /**
   * Add `grammar` to registry and return a list of referenced scope names
   */
  addGrammar(grammar, injectionScopeNames) {
    this._rawGrammars.set(grammar.scopeName, grammar);
    if (injectionScopeNames) {
      this._injectionGrammars.set(grammar.scopeName, injectionScopeNames);
    }
  }
  /**
   * Lookup a raw grammar.
   */
  lookup(scopeName) {
    return this._rawGrammars.get(scopeName);
  }
  /**
   * Returns the injections for the given grammar
   */
  injections(targetScope) {
    return this._injectionGrammars.get(targetScope);
  }
  /**
   * Get the default theme settings
   */
  getDefaults() {
    return this._theme.getDefaults();
  }
  /**
   * Match a scope in the theme.
   */
  themeMatch(scopePath) {
    return this._theme.match(scopePath);
  }
  /**
   * Lookup a grammar.
   */
  grammarForScopeName(scopeName, initialLanguage, embeddedLanguages, tokenTypes, balancedBracketSelectors) {
    if (!this._grammars.has(scopeName)) {
      let rawGrammar = this._rawGrammars.get(scopeName);
      if (!rawGrammar) {
        return null;
      }
      this._grammars.set(scopeName, createGrammar(
        scopeName,
        rawGrammar,
        initialLanguage,
        embeddedLanguages,
        tokenTypes,
        balancedBracketSelectors,
        this,
        this._onigLib
      ));
    }
    return this._grammars.get(scopeName);
  }
};

// src/index.ts
var Registry$1 = class Registry {
  constructor(options) {
    this._options = options;
    this._syncRegistry = new SyncRegistry(
      Theme.createFromRawTheme(options.theme, options.colorMap),
      options.onigLib
    );
    this._ensureGrammarCache = /* @__PURE__ */ new Map();
  }
  dispose() {
    this._syncRegistry.dispose();
  }
  /**
   * Change the theme. Once called, no previous `ruleStack` should be used anymore.
   */
  setTheme(theme, colorMap) {
    this._syncRegistry.setTheme(Theme.createFromRawTheme(theme, colorMap));
  }
  /**
   * Returns a lookup array for color ids.
   */
  getColorMap() {
    return this._syncRegistry.getColorMap();
  }
  /**
   * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
   * Please do not use language id 0.
   */
  loadGrammarWithEmbeddedLanguages(initialScopeName, initialLanguage, embeddedLanguages) {
    return this.loadGrammarWithConfiguration(initialScopeName, initialLanguage, { embeddedLanguages });
  }
  /**
   * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
   * Please do not use language id 0.
   */
  loadGrammarWithConfiguration(initialScopeName, initialLanguage, configuration) {
    return this._loadGrammar(
      initialScopeName,
      initialLanguage,
      configuration.embeddedLanguages,
      configuration.tokenTypes,
      new BalancedBracketSelectors(
        configuration.balancedBracketSelectors || [],
        configuration.unbalancedBracketSelectors || []
      )
    );
  }
  /**
   * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
   */
  loadGrammar(initialScopeName) {
    return this._loadGrammar(initialScopeName, 0, null, null, null);
  }
  _loadGrammar(initialScopeName, initialLanguage, embeddedLanguages, tokenTypes, balancedBracketSelectors) {
    const dependencyProcessor = new ScopeDependencyProcessor(this._syncRegistry, initialScopeName);
    while (dependencyProcessor.Q.length > 0) {
      dependencyProcessor.Q.map((request) => this._loadSingleGrammar(request.scopeName));
      dependencyProcessor.processQueue();
    }
    return this._grammarForScopeName(
      initialScopeName,
      initialLanguage,
      embeddedLanguages,
      tokenTypes,
      balancedBracketSelectors
    );
  }
  _loadSingleGrammar(scopeName) {
    if (!this._ensureGrammarCache.has(scopeName)) {
      this._doLoadSingleGrammar(scopeName);
      this._ensureGrammarCache.set(scopeName, true);
    }
  }
  _doLoadSingleGrammar(scopeName) {
    const grammar = this._options.loadGrammar(scopeName);
    if (grammar) {
      const injections = typeof this._options.getInjections === "function" ? this._options.getInjections(scopeName) : void 0;
      this._syncRegistry.addGrammar(grammar, injections);
    }
  }
  /**
   * Adds a rawGrammar.
   */
  addGrammar(rawGrammar, injections = [], initialLanguage = 0, embeddedLanguages = null) {
    this._syncRegistry.addGrammar(rawGrammar, injections);
    return this._grammarForScopeName(rawGrammar.scopeName, initialLanguage, embeddedLanguages);
  }
  /**
   * Get the grammar for `scopeName`. The grammar must first be created via `loadGrammar` or `addGrammar`.
   */
  _grammarForScopeName(scopeName, initialLanguage = 0, embeddedLanguages = null, tokenTypes = null, balancedBracketSelectors = null) {
    return this._syncRegistry.grammarForScopeName(
      scopeName,
      initialLanguage,
      embeddedLanguages,
      tokenTypes,
      balancedBracketSelectors
    );
  }
};
var INITIAL = StateStackImpl.NULL;

/**
 * List of HTML void tag names.
 *
 * @type {Array<string>}
 */
const htmlVoidElements = [
  'area',
  'base',
  'basefont',
  'bgsound',
  'br',
  'col',
  'command',
  'embed',
  'frame',
  'hr',
  'image',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];

/**
 * @typedef {import('./info.js').Info} Info
 * @typedef {Record<string, Info>} Properties
 * @typedef {Record<string, string>} Normal
 */

class Schema {
  /**
   * @constructor
   * @param {Properties} property
   * @param {Normal} normal
   * @param {string} [space]
   */
  constructor(property, normal, space) {
    this.property = property;
    this.normal = normal;
    if (space) {
      this.space = space;
    }
  }
}

/** @type {Properties} */
Schema.prototype.property = {};
/** @type {Normal} */
Schema.prototype.normal = {};
/** @type {string|null} */
Schema.prototype.space = null;

/**
 * @typedef {import('./schema.js').Properties} Properties
 * @typedef {import('./schema.js').Normal} Normal
 */


/**
 * @param {Schema[]} definitions
 * @param {string} [space]
 * @returns {Schema}
 */
function merge(definitions, space) {
  /** @type {Properties} */
  const property = {};
  /** @type {Normal} */
  const normal = {};
  let index = -1;

  while (++index < definitions.length) {
    Object.assign(property, definitions[index].property);
    Object.assign(normal, definitions[index].normal);
  }

  return new Schema(property, normal, space)
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalize(value) {
  return value.toLowerCase()
}

class Info {
  /**
   * @constructor
   * @param {string} property
   * @param {string} attribute
   */
  constructor(property, attribute) {
    /** @type {string} */
    this.property = property;
    /** @type {string} */
    this.attribute = attribute;
  }
}

/** @type {string|null} */
Info.prototype.space = null;
Info.prototype.boolean = false;
Info.prototype.booleanish = false;
Info.prototype.overloadedBoolean = false;
Info.prototype.number = false;
Info.prototype.commaSeparated = false;
Info.prototype.spaceSeparated = false;
Info.prototype.commaOrSpaceSeparated = false;
Info.prototype.mustUseProperty = false;
Info.prototype.defined = false;

let powers = 0;

const boolean = increment();
const booleanish = increment();
const overloadedBoolean = increment();
const number = increment();
const spaceSeparated = increment();
const commaSeparated = increment();
const commaOrSpaceSeparated = increment();

function increment() {
  return 2 ** ++powers
}

const types = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  boolean,
  booleanish,
  commaOrSpaceSeparated,
  commaSeparated,
  number,
  overloadedBoolean,
  spaceSeparated
}, Symbol.toStringTag, { value: 'Module' }));

/** @type {Array<keyof types>} */
// @ts-expect-error: hush.
const checks = Object.keys(types);

class DefinedInfo extends Info {
  /**
   * @constructor
   * @param {string} property
   * @param {string} attribute
   * @param {number|null} [mask]
   * @param {string} [space]
   */
  constructor(property, attribute, mask, space) {
    let index = -1;

    super(property, attribute);

    mark(this, 'space', space);

    if (typeof mask === 'number') {
      while (++index < checks.length) {
        const check = checks[index];
        mark(this, checks[index], (mask & types[check]) === types[check]);
      }
    }
  }
}

DefinedInfo.prototype.defined = true;

/**
 * @param {DefinedInfo} values
 * @param {string} key
 * @param {unknown} value
 */
function mark(values, key, value) {
  if (value) {
    // @ts-expect-error: assume `value` matches the expected value of `key`.
    values[key] = value;
  }
}

/**
 * @typedef {import('./schema.js').Properties} Properties
 * @typedef {import('./schema.js').Normal} Normal
 *
 * @typedef {Record<string, string>} Attributes
 *
 * @typedef {Object} Definition
 * @property {Record<string, number|null>} properties
 * @property {(attributes: Attributes, property: string) => string} transform
 * @property {string} [space]
 * @property {Attributes} [attributes]
 * @property {Array<string>} [mustUseProperty]
 */


const own$3 = {}.hasOwnProperty;

/**
 * @param {Definition} definition
 * @returns {Schema}
 */
function create(definition) {
  /** @type {Properties} */
  const property = {};
  /** @type {Normal} */
  const normal = {};
  /** @type {string} */
  let prop;

  for (prop in definition.properties) {
    if (own$3.call(definition.properties, prop)) {
      const value = definition.properties[prop];
      const info = new DefinedInfo(
        prop,
        definition.transform(definition.attributes || {}, prop),
        value,
        definition.space
      );

      if (
        definition.mustUseProperty &&
        definition.mustUseProperty.includes(prop)
      ) {
        info.mustUseProperty = true;
      }

      property[prop] = info;

      normal[normalize(prop)] = prop;
      normal[normalize(info.attribute)] = prop;
    }
  }

  return new Schema(property, normal, definition.space)
}

const xlink = create({
  space: 'xlink',
  transform(_, prop) {
    return 'xlink:' + prop.slice(5).toLowerCase()
  },
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  }
});

const xml = create({
  space: 'xml',
  transform(_, prop) {
    return 'xml:' + prop.slice(3).toLowerCase()
  },
  properties: {xmlLang: null, xmlBase: null, xmlSpace: null}
});

/**
 * @param {Record<string, string>} attributes
 * @param {string} attribute
 * @returns {string}
 */
function caseSensitiveTransform(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute
}

/**
 * @param {Record<string, string>} attributes
 * @param {string} property
 * @returns {string}
 */
function caseInsensitiveTransform(attributes, property) {
  return caseSensitiveTransform(attributes, property.toLowerCase())
}

const xmlns = create({
  space: 'xmlns',
  attributes: {xmlnsxlink: 'xmlns:xlink'},
  transform: caseInsensitiveTransform,
  properties: {xmlns: null, xmlnsXLink: null}
});

const aria = create({
  transform(_, prop) {
    return prop === 'role' ? prop : 'aria-' + prop.slice(4).toLowerCase()
  },
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: booleanish,
    ariaAutoComplete: null,
    ariaBusy: booleanish,
    ariaChecked: booleanish,
    ariaColCount: number,
    ariaColIndex: number,
    ariaColSpan: number,
    ariaControls: spaceSeparated,
    ariaCurrent: null,
    ariaDescribedBy: spaceSeparated,
    ariaDetails: null,
    ariaDisabled: booleanish,
    ariaDropEffect: spaceSeparated,
    ariaErrorMessage: null,
    ariaExpanded: booleanish,
    ariaFlowTo: spaceSeparated,
    ariaGrabbed: booleanish,
    ariaHasPopup: null,
    ariaHidden: booleanish,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: spaceSeparated,
    ariaLevel: number,
    ariaLive: null,
    ariaModal: booleanish,
    ariaMultiLine: booleanish,
    ariaMultiSelectable: booleanish,
    ariaOrientation: null,
    ariaOwns: spaceSeparated,
    ariaPlaceholder: null,
    ariaPosInSet: number,
    ariaPressed: booleanish,
    ariaReadOnly: booleanish,
    ariaRelevant: null,
    ariaRequired: booleanish,
    ariaRoleDescription: spaceSeparated,
    ariaRowCount: number,
    ariaRowIndex: number,
    ariaRowSpan: number,
    ariaSelected: booleanish,
    ariaSetSize: number,
    ariaSort: null,
    ariaValueMax: number,
    ariaValueMin: number,
    ariaValueNow: number,
    ariaValueText: null,
    role: null
  }
});

const html$4 = create({
  space: 'html',
  attributes: {
    acceptcharset: 'accept-charset',
    classname: 'class',
    htmlfor: 'for',
    httpequiv: 'http-equiv'
  },
  transform: caseInsensitiveTransform,
  mustUseProperty: ['checked', 'multiple', 'muted', 'selected'],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: commaSeparated,
    acceptCharset: spaceSeparated,
    accessKey: spaceSeparated,
    action: null,
    allow: null,
    allowFullScreen: boolean,
    allowPaymentRequest: boolean,
    allowUserMedia: boolean,
    alt: null,
    as: null,
    async: boolean,
    autoCapitalize: null,
    autoComplete: spaceSeparated,
    autoFocus: boolean,
    autoPlay: boolean,
    blocking: spaceSeparated,
    capture: null,
    charSet: null,
    checked: boolean,
    cite: null,
    className: spaceSeparated,
    cols: number,
    colSpan: null,
    content: null,
    contentEditable: booleanish,
    controls: boolean,
    controlsList: spaceSeparated,
    coords: number | commaSeparated,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: boolean,
    defer: boolean,
    dir: null,
    dirName: null,
    disabled: boolean,
    download: overloadedBoolean,
    draggable: booleanish,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: boolean,
    formTarget: null,
    headers: spaceSeparated,
    height: number,
    hidden: boolean,
    high: number,
    href: null,
    hrefLang: null,
    htmlFor: spaceSeparated,
    httpEquiv: spaceSeparated,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: boolean,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: boolean,
    itemId: null,
    itemProp: spaceSeparated,
    itemRef: spaceSeparated,
    itemScope: boolean,
    itemType: spaceSeparated,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: boolean,
    low: number,
    manifest: null,
    max: null,
    maxLength: number,
    media: null,
    method: null,
    min: null,
    minLength: number,
    multiple: boolean,
    muted: boolean,
    name: null,
    nonce: null,
    noModule: boolean,
    noValidate: boolean,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: boolean,
    optimum: number,
    pattern: null,
    ping: spaceSeparated,
    placeholder: null,
    playsInline: boolean,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: boolean,
    referrerPolicy: null,
    rel: spaceSeparated,
    required: boolean,
    reversed: boolean,
    rows: number,
    rowSpan: number,
    sandbox: spaceSeparated,
    scope: null,
    scoped: boolean,
    seamless: boolean,
    selected: boolean,
    shadowRootClonable: boolean,
    shadowRootDelegatesFocus: boolean,
    shadowRootMode: null,
    shape: null,
    size: number,
    sizes: null,
    slot: null,
    span: number,
    spellCheck: booleanish,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: number,
    step: null,
    style: null,
    tabIndex: number,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: boolean,
    useMap: null,
    value: booleanish,
    width: number,
    wrap: null,
    writingSuggestions: null,

    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null, // Several. Use CSS `text-align` instead,
    aLink: null, // `<body>`. Use CSS `a:active {color}` instead
    archive: spaceSeparated, // `<object>`. List of URIs to archives
    axis: null, // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null, // `<body>`. Use CSS `background-image` instead
    bgColor: null, // `<body>` and table elements. Use CSS `background-color` instead
    border: number, // `<table>`. Use CSS `border-width` instead,
    borderColor: null, // `<table>`. Use CSS `border-color` instead,
    bottomMargin: number, // `<body>`
    cellPadding: null, // `<table>`
    cellSpacing: null, // `<table>`
    char: null, // Several table elements. When `align=char`, sets the character to align on
    charOff: null, // Several table elements. When `char`, offsets the alignment
    classId: null, // `<object>`
    clear: null, // `<br>`. Use CSS `clear` instead
    code: null, // `<object>`
    codeBase: null, // `<object>`
    codeType: null, // `<object>`
    color: null, // `<font>` and `<hr>`. Use CSS instead
    compact: boolean, // Lists. Use CSS to reduce space between items instead
    declare: boolean, // `<object>`
    event: null, // `<script>`
    face: null, // `<font>`. Use CSS instead
    frame: null, // `<table>`
    frameBorder: null, // `<iframe>`. Use CSS `border` instead
    hSpace: number, // `<img>` and `<object>`
    leftMargin: number, // `<body>`
    link: null, // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null, // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null, // `<img>`. Use a `<picture>`
    marginHeight: number, // `<body>`
    marginWidth: number, // `<body>`
    noResize: boolean, // `<frame>`
    noHref: boolean, // `<area>`. Use no href instead of an explicit `nohref`
    noShade: boolean, // `<hr>`. Use background-color and height instead of borders
    noWrap: boolean, // `<td>` and `<th>`
    object: null, // `<applet>`
    profile: null, // `<head>`
    prompt: null, // `<isindex>`
    rev: null, // `<link>`
    rightMargin: number, // `<body>`
    rules: null, // `<table>`
    scheme: null, // `<meta>`
    scrolling: booleanish, // `<frame>`. Use overflow in the child context
    standby: null, // `<object>`
    summary: null, // `<table>`
    text: null, // `<body>`. Use CSS `color` instead
    topMargin: number, // `<body>`
    valueType: null, // `<param>`
    version: null, // `<html>`. Use a doctype.
    vAlign: null, // Several. Use CSS `vertical-align` instead
    vLink: null, // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: number, // `<img>` and `<object>`

    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: boolean,
    disableRemotePlayback: boolean,
    prefix: null,
    property: null,
    results: number,
    security: null,
    unselectable: null
  }
});

const svg$1 = create({
  space: 'svg',
  attributes: {
    accentHeight: 'accent-height',
    alignmentBaseline: 'alignment-baseline',
    arabicForm: 'arabic-form',
    baselineShift: 'baseline-shift',
    capHeight: 'cap-height',
    className: 'class',
    clipPath: 'clip-path',
    clipRule: 'clip-rule',
    colorInterpolation: 'color-interpolation',
    colorInterpolationFilters: 'color-interpolation-filters',
    colorProfile: 'color-profile',
    colorRendering: 'color-rendering',
    crossOrigin: 'crossorigin',
    dataType: 'datatype',
    dominantBaseline: 'dominant-baseline',
    enableBackground: 'enable-background',
    fillOpacity: 'fill-opacity',
    fillRule: 'fill-rule',
    floodColor: 'flood-color',
    floodOpacity: 'flood-opacity',
    fontFamily: 'font-family',
    fontSize: 'font-size',
    fontSizeAdjust: 'font-size-adjust',
    fontStretch: 'font-stretch',
    fontStyle: 'font-style',
    fontVariant: 'font-variant',
    fontWeight: 'font-weight',
    glyphName: 'glyph-name',
    glyphOrientationHorizontal: 'glyph-orientation-horizontal',
    glyphOrientationVertical: 'glyph-orientation-vertical',
    hrefLang: 'hreflang',
    horizAdvX: 'horiz-adv-x',
    horizOriginX: 'horiz-origin-x',
    horizOriginY: 'horiz-origin-y',
    imageRendering: 'image-rendering',
    letterSpacing: 'letter-spacing',
    lightingColor: 'lighting-color',
    markerEnd: 'marker-end',
    markerMid: 'marker-mid',
    markerStart: 'marker-start',
    navDown: 'nav-down',
    navDownLeft: 'nav-down-left',
    navDownRight: 'nav-down-right',
    navLeft: 'nav-left',
    navNext: 'nav-next',
    navPrev: 'nav-prev',
    navRight: 'nav-right',
    navUp: 'nav-up',
    navUpLeft: 'nav-up-left',
    navUpRight: 'nav-up-right',
    onAbort: 'onabort',
    onActivate: 'onactivate',
    onAfterPrint: 'onafterprint',
    onBeforePrint: 'onbeforeprint',
    onBegin: 'onbegin',
    onCancel: 'oncancel',
    onCanPlay: 'oncanplay',
    onCanPlayThrough: 'oncanplaythrough',
    onChange: 'onchange',
    onClick: 'onclick',
    onClose: 'onclose',
    onCopy: 'oncopy',
    onCueChange: 'oncuechange',
    onCut: 'oncut',
    onDblClick: 'ondblclick',
    onDrag: 'ondrag',
    onDragEnd: 'ondragend',
    onDragEnter: 'ondragenter',
    onDragExit: 'ondragexit',
    onDragLeave: 'ondragleave',
    onDragOver: 'ondragover',
    onDragStart: 'ondragstart',
    onDrop: 'ondrop',
    onDurationChange: 'ondurationchange',
    onEmptied: 'onemptied',
    onEnd: 'onend',
    onEnded: 'onended',
    onError: 'onerror',
    onFocus: 'onfocus',
    onFocusIn: 'onfocusin',
    onFocusOut: 'onfocusout',
    onHashChange: 'onhashchange',
    onInput: 'oninput',
    onInvalid: 'oninvalid',
    onKeyDown: 'onkeydown',
    onKeyPress: 'onkeypress',
    onKeyUp: 'onkeyup',
    onLoad: 'onload',
    onLoadedData: 'onloadeddata',
    onLoadedMetadata: 'onloadedmetadata',
    onLoadStart: 'onloadstart',
    onMessage: 'onmessage',
    onMouseDown: 'onmousedown',
    onMouseEnter: 'onmouseenter',
    onMouseLeave: 'onmouseleave',
    onMouseMove: 'onmousemove',
    onMouseOut: 'onmouseout',
    onMouseOver: 'onmouseover',
    onMouseUp: 'onmouseup',
    onMouseWheel: 'onmousewheel',
    onOffline: 'onoffline',
    onOnline: 'ononline',
    onPageHide: 'onpagehide',
    onPageShow: 'onpageshow',
    onPaste: 'onpaste',
    onPause: 'onpause',
    onPlay: 'onplay',
    onPlaying: 'onplaying',
    onPopState: 'onpopstate',
    onProgress: 'onprogress',
    onRateChange: 'onratechange',
    onRepeat: 'onrepeat',
    onReset: 'onreset',
    onResize: 'onresize',
    onScroll: 'onscroll',
    onSeeked: 'onseeked',
    onSeeking: 'onseeking',
    onSelect: 'onselect',
    onShow: 'onshow',
    onStalled: 'onstalled',
    onStorage: 'onstorage',
    onSubmit: 'onsubmit',
    onSuspend: 'onsuspend',
    onTimeUpdate: 'ontimeupdate',
    onToggle: 'ontoggle',
    onUnload: 'onunload',
    onVolumeChange: 'onvolumechange',
    onWaiting: 'onwaiting',
    onZoom: 'onzoom',
    overlinePosition: 'overline-position',
    overlineThickness: 'overline-thickness',
    paintOrder: 'paint-order',
    panose1: 'panose-1',
    pointerEvents: 'pointer-events',
    referrerPolicy: 'referrerpolicy',
    renderingIntent: 'rendering-intent',
    shapeRendering: 'shape-rendering',
    stopColor: 'stop-color',
    stopOpacity: 'stop-opacity',
    strikethroughPosition: 'strikethrough-position',
    strikethroughThickness: 'strikethrough-thickness',
    strokeDashArray: 'stroke-dasharray',
    strokeDashOffset: 'stroke-dashoffset',
    strokeLineCap: 'stroke-linecap',
    strokeLineJoin: 'stroke-linejoin',
    strokeMiterLimit: 'stroke-miterlimit',
    strokeOpacity: 'stroke-opacity',
    strokeWidth: 'stroke-width',
    tabIndex: 'tabindex',
    textAnchor: 'text-anchor',
    textDecoration: 'text-decoration',
    textRendering: 'text-rendering',
    transformOrigin: 'transform-origin',
    typeOf: 'typeof',
    underlinePosition: 'underline-position',
    underlineThickness: 'underline-thickness',
    unicodeBidi: 'unicode-bidi',
    unicodeRange: 'unicode-range',
    unitsPerEm: 'units-per-em',
    vAlphabetic: 'v-alphabetic',
    vHanging: 'v-hanging',
    vIdeographic: 'v-ideographic',
    vMathematical: 'v-mathematical',
    vectorEffect: 'vector-effect',
    vertAdvY: 'vert-adv-y',
    vertOriginX: 'vert-origin-x',
    vertOriginY: 'vert-origin-y',
    wordSpacing: 'word-spacing',
    writingMode: 'writing-mode',
    xHeight: 'x-height',
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: 'playbackorder',
    timelineBegin: 'timelinebegin'
  },
  transform: caseSensitiveTransform,
  properties: {
    about: commaOrSpaceSeparated,
    accentHeight: number,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: number,
    amplitude: number,
    arabicForm: null,
    ascent: number,
    attributeName: null,
    attributeType: null,
    azimuth: number,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: number,
    by: null,
    calcMode: null,
    capHeight: number,
    className: spaceSeparated,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: number,
    diffuseConstant: number,
    direction: null,
    display: null,
    dur: null,
    divisor: number,
    dominantBaseline: null,
    download: boolean,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: number,
    enableBackground: null,
    end: null,
    event: null,
    exponent: number,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: number,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: commaSeparated,
    g2: commaSeparated,
    glyphName: commaSeparated,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: number,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: number,
    horizOriginX: number,
    horizOriginY: number,
    id: null,
    ideographic: number,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: number,
    k: number,
    k1: number,
    k2: number,
    k3: number,
    k4: number,
    kernelMatrix: commaOrSpaceSeparated,
    kernelUnitLength: null,
    keyPoints: null, // SEMI_COLON_SEPARATED
    keySplines: null, // SEMI_COLON_SEPARATED
    keyTimes: null, // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: number,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: number,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: number,
    overlineThickness: number,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: number,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: spaceSeparated,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: number,
    pointsAtY: number,
    pointsAtZ: number,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: commaOrSpaceSeparated,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: commaOrSpaceSeparated,
    rev: commaOrSpaceSeparated,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: commaOrSpaceSeparated,
    requiredFeatures: commaOrSpaceSeparated,
    requiredFonts: commaOrSpaceSeparated,
    requiredFormats: commaOrSpaceSeparated,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: number,
    specularExponent: number,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: number,
    strikethroughThickness: number,
    string: null,
    stroke: null,
    strokeDashArray: commaOrSpaceSeparated,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: number,
    strokeOpacity: number,
    strokeWidth: null,
    style: null,
    surfaceScale: number,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: commaOrSpaceSeparated,
    tabIndex: number,
    tableValues: null,
    target: null,
    targetX: number,
    targetY: number,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: commaOrSpaceSeparated,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: number,
    underlineThickness: number,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: number,
    values: null,
    vAlphabetic: number,
    vMathematical: number,
    vectorEffect: null,
    vHanging: number,
    vIdeographic: number,
    version: null,
    vertAdvY: number,
    vertOriginX: number,
    vertOriginY: number,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: number,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  }
});

/**
 * @typedef {import('./util/schema.js').Schema} Schema
 */


const valid = /^data[-\w.:]+$/i;
const dash = /-[a-z]/g;
const cap = /[A-Z]/g;

/**
 * @param {Schema} schema
 * @param {string} value
 * @returns {Info}
 */
function find(schema, value) {
  const normal = normalize(value);
  let prop = value;
  let Type = Info;

  if (normal in schema.normal) {
    return schema.property[schema.normal[normal]]
  }

  if (normal.length > 4 && normal.slice(0, 4) === 'data' && valid.test(value)) {
    // Attribute or property.
    if (value.charAt(4) === '-') {
      // Turn it into a property.
      const rest = value.slice(5).replace(dash, camelcase);
      prop = 'data' + rest.charAt(0).toUpperCase() + rest.slice(1);
    } else {
      // Turn it into an attribute.
      const rest = value.slice(4);

      if (!dash.test(rest)) {
        let dashes = rest.replace(cap, kebab);

        if (dashes.charAt(0) !== '-') {
          dashes = '-' + dashes;
        }

        value = 'data' + dashes;
      }
    }

    Type = DefinedInfo;
  }

  return new Type(prop, value)
}

/**
 * @param {string} $0
 * @returns {string}
 */
function kebab($0) {
  return '-' + $0.toLowerCase()
}

/**
 * @param {string} $0
 * @returns {string}
 */
function camelcase($0) {
  return $0.charAt(1).toUpperCase()
}

/**
 * @typedef {import('./lib/util/info.js').Info} Info
 * @typedef {import('./lib/util/schema.js').Schema} Schema
 */

const html$3 = merge([xml, xlink, xmlns, aria, html$4], 'html');
const svg = merge([xml, xlink, xmlns, aria, svg$1], 'svg');

/**
 * @callback Handler
 *   Handle a value, with a certain ID field set to a certain value.
 *   The ID field is passed to `zwitch`, and it’s value is this function’s
 *   place on the `handlers` record.
 * @param {...any} parameters
 *   Arbitrary parameters passed to the zwitch.
 *   The first will be an object with a certain ID field set to a certain value.
 * @returns {any}
 *   Anything!
 */

/**
 * @callback UnknownHandler
 *   Handle values that do have a certain ID field, but it’s set to a value
 *   that is not listed in the `handlers` record.
 * @param {unknown} value
 *   An object with a certain ID field set to an unknown value.
 * @param {...any} rest
 *   Arbitrary parameters passed to the zwitch.
 * @returns {any}
 *   Anything!
 */

/**
 * @callback InvalidHandler
 *   Handle values that do not have a certain ID field.
 * @param {unknown} value
 *   Any unknown value.
 * @param {...any} rest
 *   Arbitrary parameters passed to the zwitch.
 * @returns {void|null|undefined|never}
 *   This should crash or return nothing.
 */

/**
 * @template {InvalidHandler} [Invalid=InvalidHandler]
 * @template {UnknownHandler} [Unknown=UnknownHandler]
 * @template {Record<string, Handler>} [Handlers=Record<string, Handler>]
 * @typedef Options
 *   Configuration (required).
 * @property {Invalid} [invalid]
 *   Handler to use for invalid values.
 * @property {Unknown} [unknown]
 *   Handler to use for unknown values.
 * @property {Handlers} [handlers]
 *   Handlers to use.
 */

const own$2 = {}.hasOwnProperty;

/**
 * Handle values based on a field.
 *
 * @template {InvalidHandler} [Invalid=InvalidHandler]
 * @template {UnknownHandler} [Unknown=UnknownHandler]
 * @template {Record<string, Handler>} [Handlers=Record<string, Handler>]
 * @param {string} key
 *   Field to switch on.
 * @param {Options<Invalid, Unknown, Handlers>} [options]
 *   Configuration (required).
 * @returns {{unknown: Unknown, invalid: Invalid, handlers: Handlers, (...parameters: Parameters<Handlers[keyof Handlers]>): ReturnType<Handlers[keyof Handlers]>, (...parameters: Parameters<Unknown>): ReturnType<Unknown>}}
 */
function zwitch(key, options) {
  const settings = options || {};

  /**
   * Handle one value.
   *
   * Based on the bound `key`, a respective handler will be called.
   * If `value` is not an object, or doesn’t have a `key` property, the special
   * “invalid” handler will be called.
   * If `value` has an unknown `key`, the special “unknown” handler will be
   * called.
   *
   * All arguments, and the context object, are passed through to the handler,
   * and it’s result is returned.
   *
   * @this {unknown}
   *   Any context object.
   * @param {unknown} [value]
   *   Any value.
   * @param {...unknown} parameters
   *   Arbitrary parameters passed to the zwitch.
   * @property {Handler} invalid
   *   Handle for values that do not have a certain ID field.
   * @property {Handler} unknown
   *   Handle values that do have a certain ID field, but it’s set to a value
   *   that is not listed in the `handlers` record.
   * @property {Handlers} handlers
   *   Record of handlers.
   * @returns {unknown}
   *   Anything.
   */
  function one(value, ...parameters) {
    /** @type {Handler|undefined} */
    let fn = one.invalid;
    const handlers = one.handlers;

    if (value && own$2.call(value, key)) {
      // @ts-expect-error Indexable.
      const id = String(value[key]);
      // @ts-expect-error Indexable.
      fn = own$2.call(handlers, id) ? handlers[id] : one.unknown;
    }

    if (fn) {
      return fn.call(this, value, ...parameters)
    }
  }

  one.handlers = settings.handlers || {};
  one.invalid = settings.invalid;
  one.unknown = settings.unknown;

  // @ts-expect-error: matches!
  return one
}

/**
 * @typedef CoreOptions
 * @property {ReadonlyArray<string>} [subset=[]]
 *   Whether to only escape the given subset of characters.
 * @property {boolean} [escapeOnly=false]
 *   Whether to only escape possibly dangerous characters.
 *   Those characters are `"`, `&`, `'`, `<`, `>`, and `` ` ``.
 *
 * @typedef FormatOptions
 * @property {(code: number, next: number, options: CoreWithFormatOptions) => string} format
 *   Format strategy.
 *
 * @typedef {CoreOptions & FormatOptions & import('./util/format-smart.js').FormatSmartOptions} CoreWithFormatOptions
 */

const defaultSubsetRegex = /["&'<>`]/g;
const surrogatePairsRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
const controlCharactersRegex =
  // eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
  /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;
const regexEscapeRegex = /[|\\{}()[\]^$+*?.]/g;

/** @type {WeakMap<ReadonlyArray<string>, RegExp>} */
const subsetToRegexCache = new WeakMap();

/**
 * Encode certain characters in `value`.
 *
 * @param {string} value
 * @param {CoreWithFormatOptions} options
 * @returns {string}
 */
function core(value, options) {
  value = value.replace(
    options.subset
      ? charactersToExpressionCached(options.subset)
      : defaultSubsetRegex,
    basic
  );

  if (options.subset || options.escapeOnly) {
    return value
  }

  return (
    value
      // Surrogate pairs.
      .replace(surrogatePairsRegex, surrogate)
      // BMP control characters (C0 except for LF, CR, SP; DEL; and some more
      // non-ASCII ones).
      .replace(controlCharactersRegex, basic)
  )

  /**
   * @param {string} pair
   * @param {number} index
   * @param {string} all
   */
  function surrogate(pair, index, all) {
    return options.format(
      (pair.charCodeAt(0) - 0xd800) * 0x400 +
        pair.charCodeAt(1) -
        0xdc00 +
        0x10000,
      all.charCodeAt(index + 2),
      options
    )
  }

  /**
   * @param {string} character
   * @param {number} index
   * @param {string} all
   */
  function basic(character, index, all) {
    return options.format(
      character.charCodeAt(0),
      all.charCodeAt(index + 1),
      options
    )
  }
}

/**
 * A wrapper function that caches the result of `charactersToExpression` with a WeakMap.
 * This can improve performance when tooling calls `charactersToExpression` repeatedly
 * with the same subset.
 *
 * @param {ReadonlyArray<string>} subset
 * @returns {RegExp}
 */
function charactersToExpressionCached(subset) {
  let cached = subsetToRegexCache.get(subset);

  if (!cached) {
    cached = charactersToExpression(subset);
    subsetToRegexCache.set(subset, cached);
  }

  return cached
}

/**
 * @param {ReadonlyArray<string>} subset
 * @returns {RegExp}
 */
function charactersToExpression(subset) {
  /** @type {Array<string>} */
  const groups = [];
  let index = -1;

  while (++index < subset.length) {
    groups.push(subset[index].replace(regexEscapeRegex, '\\$&'));
  }

  return new RegExp('(?:' + groups.join('|') + ')', 'g')
}

const hexadecimalRegex = /[\dA-Fa-f]/;

/**
 * Configurable ways to encode characters as hexadecimal references.
 *
 * @param {number} code
 * @param {number} next
 * @param {boolean|undefined} omit
 * @returns {string}
 */
function toHexadecimal(code, next, omit) {
  const value = '&#x' + code.toString(16).toUpperCase();
  return omit && next && !hexadecimalRegex.test(String.fromCharCode(next))
    ? value
    : value + ';'
}

const decimalRegex = /\d/;

/**
 * Configurable ways to encode characters as decimal references.
 *
 * @param {number} code
 * @param {number} next
 * @param {boolean|undefined} omit
 * @returns {string}
 */
function toDecimal(code, next, omit) {
  const value = '&#' + String(code);
  return omit && next && !decimalRegex.test(String.fromCharCode(next))
    ? value
    : value + ';'
}

/**
 * List of legacy HTML named character references that don’t need a trailing semicolon.
 *
 * @type {Array<string>}
 */
const characterEntitiesLegacy = [
  'AElig',
  'AMP',
  'Aacute',
  'Acirc',
  'Agrave',
  'Aring',
  'Atilde',
  'Auml',
  'COPY',
  'Ccedil',
  'ETH',
  'Eacute',
  'Ecirc',
  'Egrave',
  'Euml',
  'GT',
  'Iacute',
  'Icirc',
  'Igrave',
  'Iuml',
  'LT',
  'Ntilde',
  'Oacute',
  'Ocirc',
  'Ograve',
  'Oslash',
  'Otilde',
  'Ouml',
  'QUOT',
  'REG',
  'THORN',
  'Uacute',
  'Ucirc',
  'Ugrave',
  'Uuml',
  'Yacute',
  'aacute',
  'acirc',
  'acute',
  'aelig',
  'agrave',
  'amp',
  'aring',
  'atilde',
  'auml',
  'brvbar',
  'ccedil',
  'cedil',
  'cent',
  'copy',
  'curren',
  'deg',
  'divide',
  'eacute',
  'ecirc',
  'egrave',
  'eth',
  'euml',
  'frac12',
  'frac14',
  'frac34',
  'gt',
  'iacute',
  'icirc',
  'iexcl',
  'igrave',
  'iquest',
  'iuml',
  'laquo',
  'lt',
  'macr',
  'micro',
  'middot',
  'nbsp',
  'not',
  'ntilde',
  'oacute',
  'ocirc',
  'ograve',
  'ordf',
  'ordm',
  'oslash',
  'otilde',
  'ouml',
  'para',
  'plusmn',
  'pound',
  'quot',
  'raquo',
  'reg',
  'sect',
  'shy',
  'sup1',
  'sup2',
  'sup3',
  'szlig',
  'thorn',
  'times',
  'uacute',
  'ucirc',
  'ugrave',
  'uml',
  'uuml',
  'yacute',
  'yen',
  'yuml'
];

/**
 * Map of named character references from HTML 4.
 *
 * @type {Record<string, string>}
 */
const characterEntitiesHtml4 = {
  nbsp: ' ',
  iexcl: '¡',
  cent: '¢',
  pound: '£',
  curren: '¤',
  yen: '¥',
  brvbar: '¦',
  sect: '§',
  uml: '¨',
  copy: '©',
  ordf: 'ª',
  laquo: '«',
  not: '¬',
  shy: '­',
  reg: '®',
  macr: '¯',
  deg: '°',
  plusmn: '±',
  sup2: '²',
  sup3: '³',
  acute: '´',
  micro: 'µ',
  para: '¶',
  middot: '·',
  cedil: '¸',
  sup1: '¹',
  ordm: 'º',
  raquo: '»',
  frac14: '¼',
  frac12: '½',
  frac34: '¾',
  iquest: '¿',
  Agrave: 'À',
  Aacute: 'Á',
  Acirc: 'Â',
  Atilde: 'Ã',
  Auml: 'Ä',
  Aring: 'Å',
  AElig: 'Æ',
  Ccedil: 'Ç',
  Egrave: 'È',
  Eacute: 'É',
  Ecirc: 'Ê',
  Euml: 'Ë',
  Igrave: 'Ì',
  Iacute: 'Í',
  Icirc: 'Î',
  Iuml: 'Ï',
  ETH: 'Ð',
  Ntilde: 'Ñ',
  Ograve: 'Ò',
  Oacute: 'Ó',
  Ocirc: 'Ô',
  Otilde: 'Õ',
  Ouml: 'Ö',
  times: '×',
  Oslash: 'Ø',
  Ugrave: 'Ù',
  Uacute: 'Ú',
  Ucirc: 'Û',
  Uuml: 'Ü',
  Yacute: 'Ý',
  THORN: 'Þ',
  szlig: 'ß',
  agrave: 'à',
  aacute: 'á',
  acirc: 'â',
  atilde: 'ã',
  auml: 'ä',
  aring: 'å',
  aelig: 'æ',
  ccedil: 'ç',
  egrave: 'è',
  eacute: 'é',
  ecirc: 'ê',
  euml: 'ë',
  igrave: 'ì',
  iacute: 'í',
  icirc: 'î',
  iuml: 'ï',
  eth: 'ð',
  ntilde: 'ñ',
  ograve: 'ò',
  oacute: 'ó',
  ocirc: 'ô',
  otilde: 'õ',
  ouml: 'ö',
  divide: '÷',
  oslash: 'ø',
  ugrave: 'ù',
  uacute: 'ú',
  ucirc: 'û',
  uuml: 'ü',
  yacute: 'ý',
  thorn: 'þ',
  yuml: 'ÿ',
  fnof: 'ƒ',
  Alpha: 'Α',
  Beta: 'Β',
  Gamma: 'Γ',
  Delta: 'Δ',
  Epsilon: 'Ε',
  Zeta: 'Ζ',
  Eta: 'Η',
  Theta: 'Θ',
  Iota: 'Ι',
  Kappa: 'Κ',
  Lambda: 'Λ',
  Mu: 'Μ',
  Nu: 'Ν',
  Xi: 'Ξ',
  Omicron: 'Ο',
  Pi: 'Π',
  Rho: 'Ρ',
  Sigma: 'Σ',
  Tau: 'Τ',
  Upsilon: 'Υ',
  Phi: 'Φ',
  Chi: 'Χ',
  Psi: 'Ψ',
  Omega: 'Ω',
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  epsilon: 'ε',
  zeta: 'ζ',
  eta: 'η',
  theta: 'θ',
  iota: 'ι',
  kappa: 'κ',
  lambda: 'λ',
  mu: 'μ',
  nu: 'ν',
  xi: 'ξ',
  omicron: 'ο',
  pi: 'π',
  rho: 'ρ',
  sigmaf: 'ς',
  sigma: 'σ',
  tau: 'τ',
  upsilon: 'υ',
  phi: 'φ',
  chi: 'χ',
  psi: 'ψ',
  omega: 'ω',
  thetasym: 'ϑ',
  upsih: 'ϒ',
  piv: 'ϖ',
  bull: '•',
  hellip: '…',
  prime: '′',
  Prime: '″',
  oline: '‾',
  frasl: '⁄',
  weierp: '℘',
  image: 'ℑ',
  real: 'ℜ',
  trade: '™',
  alefsym: 'ℵ',
  larr: '←',
  uarr: '↑',
  rarr: '→',
  darr: '↓',
  harr: '↔',
  crarr: '↵',
  lArr: '⇐',
  uArr: '⇑',
  rArr: '⇒',
  dArr: '⇓',
  hArr: '⇔',
  forall: '∀',
  part: '∂',
  exist: '∃',
  empty: '∅',
  nabla: '∇',
  isin: '∈',
  notin: '∉',
  ni: '∋',
  prod: '∏',
  sum: '∑',
  minus: '−',
  lowast: '∗',
  radic: '√',
  prop: '∝',
  infin: '∞',
  ang: '∠',
  and: '∧',
  or: '∨',
  cap: '∩',
  cup: '∪',
  int: '∫',
  there4: '∴',
  sim: '∼',
  cong: '≅',
  asymp: '≈',
  ne: '≠',
  equiv: '≡',
  le: '≤',
  ge: '≥',
  sub: '⊂',
  sup: '⊃',
  nsub: '⊄',
  sube: '⊆',
  supe: '⊇',
  oplus: '⊕',
  otimes: '⊗',
  perp: '⊥',
  sdot: '⋅',
  lceil: '⌈',
  rceil: '⌉',
  lfloor: '⌊',
  rfloor: '⌋',
  lang: '〈',
  rang: '〉',
  loz: '◊',
  spades: '♠',
  clubs: '♣',
  hearts: '♥',
  diams: '♦',
  quot: '"',
  amp: '&',
  lt: '<',
  gt: '>',
  OElig: 'Œ',
  oelig: 'œ',
  Scaron: 'Š',
  scaron: 'š',
  Yuml: 'Ÿ',
  circ: 'ˆ',
  tilde: '˜',
  ensp: ' ',
  emsp: ' ',
  thinsp: ' ',
  zwnj: '‌',
  zwj: '‍',
  lrm: '‎',
  rlm: '‏',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  sbquo: '‚',
  ldquo: '“',
  rdquo: '”',
  bdquo: '„',
  dagger: '†',
  Dagger: '‡',
  permil: '‰',
  lsaquo: '‹',
  rsaquo: '›',
  euro: '€'
};

/**
 * List of legacy (that don’t need a trailing `;`) named references which could,
 * depending on what follows them, turn into a different meaning
 *
 * @type {Array<string>}
 */
const dangerous = [
  'cent',
  'copy',
  'divide',
  'gt',
  'lt',
  'not',
  'para',
  'times'
];

const own$1 = {}.hasOwnProperty;

/**
 * `characterEntitiesHtml4` but inverted.
 *
 * @type {Record<string, string>}
 */
const characters = {};

/** @type {string} */
let key;

for (key in characterEntitiesHtml4) {
  if (own$1.call(characterEntitiesHtml4, key)) {
    characters[characterEntitiesHtml4[key]] = key;
  }
}

const notAlphanumericRegex = /[^\dA-Za-z]/;

/**
 * Configurable ways to encode characters as named references.
 *
 * @param {number} code
 * @param {number} next
 * @param {boolean|undefined} omit
 * @param {boolean|undefined} attribute
 * @returns {string}
 */
function toNamed(code, next, omit, attribute) {
  const character = String.fromCharCode(code);

  if (own$1.call(characters, character)) {
    const name = characters[character];
    const value = '&' + name;

    if (
      omit &&
      characterEntitiesLegacy.includes(name) &&
      !dangerous.includes(name) &&
      (!attribute ||
        (next &&
          next !== 61 /* `=` */ &&
          notAlphanumericRegex.test(String.fromCharCode(next))))
    ) {
      return value
    }

    return value + ';'
  }

  return ''
}

/**
 * @typedef FormatSmartOptions
 * @property {boolean} [useNamedReferences=false]
 *   Prefer named character references (`&amp;`) where possible.
 * @property {boolean} [useShortestReferences=false]
 *   Prefer the shortest possible reference, if that results in less bytes.
 *   **Note**: `useNamedReferences` can be omitted when using `useShortestReferences`.
 * @property {boolean} [omitOptionalSemicolons=false]
 *   Whether to omit semicolons when possible.
 *   **Note**: This creates what HTML calls “parse errors” but is otherwise still valid HTML — don’t use this except when building a minifier.
 *   Omitting semicolons is possible for certain named and numeric references in some cases.
 * @property {boolean} [attribute=false]
 *   Create character references which don’t fail in attributes.
 *   **Note**: `attribute` only applies when operating dangerously with
 *   `omitOptionalSemicolons: true`.
 */


/**
 * Configurable ways to encode a character yielding pretty or small results.
 *
 * @param {number} code
 * @param {number} next
 * @param {FormatSmartOptions} options
 * @returns {string}
 */
function formatSmart(code, next, options) {
  let numeric = toHexadecimal(code, next, options.omitOptionalSemicolons);
  /** @type {string|undefined} */
  let named;

  if (options.useNamedReferences || options.useShortestReferences) {
    named = toNamed(
      code,
      next,
      options.omitOptionalSemicolons,
      options.attribute
    );
  }

  // Use the shortest numeric reference when requested.
  // A simple algorithm would use decimal for all code points under 100, as
  // those are shorter than hexadecimal:
  //
  // * `&#99;` vs `&#x63;` (decimal shorter)
  // * `&#100;` vs `&#x64;` (equal)
  //
  // However, because we take `next` into consideration when `omit` is used,
  // And it would be possible that decimals are shorter on bigger values as
  // well if `next` is hexadecimal but not decimal, we instead compare both.
  if (
    (options.useShortestReferences || !named) &&
    options.useShortestReferences
  ) {
    const decimal = toDecimal(code, next, options.omitOptionalSemicolons);

    if (decimal.length < numeric.length) {
      numeric = decimal;
    }
  }

  return named &&
    (!options.useShortestReferences || named.length < numeric.length)
    ? named
    : numeric
}

/**
 * @typedef {import('./core.js').CoreOptions & import('./util/format-smart.js').FormatSmartOptions} Options
 * @typedef {import('./core.js').CoreOptions} LightOptions
 */


/**
 * Encode special characters in `value`.
 *
 * @param {string} value
 *   Value to encode.
 * @param {Options} [options]
 *   Configuration.
 * @returns {string}
 *   Encoded value.
 */
function stringifyEntities(value, options) {
  return core(value, Object.assign({format: formatSmart}, options))
}

/**
 * @import {Comment, Parents} from 'hast'
 * @import {State} from '../index.js'
 */


const htmlCommentRegex = /^>|^->|<!--|-->|--!>|<!-$/g;

// Declare arrays as variables so it can be cached by `stringifyEntities`
const bogusCommentEntitySubset = ['>'];
const commentEntitySubset = ['<', '>'];

/**
 * Serialize a comment.
 *
 * @param {Comment} node
 *   Node to handle.
 * @param {number | undefined} _1
 *   Index of `node` in `parent.
 * @param {Parents | undefined} _2
 *   Parent of `node`.
 * @param {State} state
 *   Info passed around about the current state.
 * @returns {string}
 *   Serialized node.
 */
function comment(node, _1, _2, state) {
  // See: <https://html.spec.whatwg.org/multipage/syntax.html#comments>
  return state.settings.bogusComments
    ? '<?' +
        stringifyEntities(
          node.value,
          Object.assign({}, state.settings.characterReferences, {
            subset: bogusCommentEntitySubset
          })
        ) +
        '>'
    : '<!--' + node.value.replace(htmlCommentRegex, encode) + '-->'

  /**
   * @param {string} $0
   */
  function encode($0) {
    return stringifyEntities(
      $0,
      Object.assign({}, state.settings.characterReferences, {
        subset: commentEntitySubset
      })
    )
  }
}

/**
 * @import {Doctype, Parents} from 'hast'
 * @import {State} from '../index.js'
 */

/**
 * Serialize a doctype.
 *
 * @param {Doctype} _1
 *   Node to handle.
 * @param {number | undefined} _2
 *   Index of `node` in `parent.
 * @param {Parents | undefined} _3
 *   Parent of `node`.
 * @param {State} state
 *   Info passed around about the current state.
 * @returns {string}
 *   Serialized node.
 */
function doctype(_1, _2, _3, state) {
  return (
    '<!' +
    (state.settings.upperDoctype ? 'DOCTYPE' : 'doctype') +
    (state.settings.tightDoctype ? '' : ' ') +
    'html>'
  )
}

/**
 * Count how often a character (or substring) is used in a string.
 *
 * @param {string} value
 *   Value to search in.
 * @param {string} character
 *   Character (or substring) to look for.
 * @return {number}
 *   Number of times `character` occurred in `value`.
 */
function ccount(value, character) {
  const source = String(value);

  if (typeof character !== 'string') {
    throw new TypeError('Expected character')
  }

  let count = 0;
  let index = source.indexOf(character);

  while (index !== -1) {
    count++;
    index = source.indexOf(character, index + character.length);
  }

  return count
}

/**
 * @typedef Options
 *   Configuration for `stringify`.
 * @property {boolean} [padLeft=true]
 *   Whether to pad a space before a token.
 * @property {boolean} [padRight=false]
 *   Whether to pad a space after a token.
 */


/**
 * Serialize an array of strings or numbers to comma-separated tokens.
 *
 * @param {Array<string|number>} values
 *   List of tokens.
 * @param {Options} [options]
 *   Configuration for `stringify` (optional).
 * @returns {string}
 *   Comma-separated tokens.
 */
function stringify$2(values, options) {
  const settings = options || {};

  // Ensure the last empty entry is seen.
  const input = values[values.length - 1] === '' ? [...values, ''] : values;

  return input
    .join(
      (settings.padRight ? ' ' : '') +
        ',' +
        (settings.padLeft === false ? '' : ' ')
    )
    .trim()
}

/**
 * Parse space-separated tokens to an array of strings.
 *
 * @param {string} value
 *   Space-separated tokens.
 * @returns {Array<string>}
 *   List of tokens.
 */

/**
 * Serialize an array of strings as space separated-tokens.
 *
 * @param {Array<string|number>} values
 *   List of tokens.
 * @returns {string}
 *   Space-separated tokens.
 */
function stringify$1(values) {
  return values.join(' ').trim()
}

/**
 * @typedef {import('hast').Nodes} Nodes
 */

// HTML whitespace expression.
// See <https://infra.spec.whatwg.org/#ascii-whitespace>.
const re = /[ \t\n\f\r]/g;

/**
 * Check if the given value is *inter-element whitespace*.
 *
 * @param {Nodes | string} thing
 *   Thing to check (`Node` or `string`).
 * @returns {boolean}
 *   Whether the `value` is inter-element whitespace (`boolean`): consisting of
 *   zero or more of space, tab (`\t`), line feed (`\n`), carriage return
 *   (`\r`), or form feed (`\f`); if a node is passed it must be a `Text` node,
 *   whose `value` field is checked.
 */
function whitespace(thing) {
  return typeof thing === 'object'
    ? thing.type === 'text'
      ? empty(thing.value)
      : false
    : empty(thing)
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function empty(value) {
  return value.replace(re, '') === ''
}

/**
 * @import {Parents, RootContent} from 'hast'
 */


const siblingAfter = siblings(1);
const siblingBefore = siblings(-1);

/** @type {Array<RootContent>} */
const emptyChildren$1 = [];

/**
 * Factory to check siblings in a direction.
 *
 * @param {number} increment
 */
function siblings(increment) {
  return sibling

  /**
   * Find applicable siblings in a direction.
   *
   * @template {Parents} Parent
   *   Parent type.
   * @param {Parent | undefined} parent
   *   Parent.
   * @param {number | undefined} index
   *   Index of child in `parent`.
   * @param {boolean | undefined} [includeWhitespace=false]
   *   Whether to include whitespace (default: `false`).
   * @returns {Parent extends {children: Array<infer Child>} ? Child | undefined : never}
   *   Child of parent.
   */
  function sibling(parent, index, includeWhitespace) {
    const siblings = parent ? parent.children : emptyChildren$1;
    let offset = (index || 0) + increment;
    let next = siblings[offset];

    if (!includeWhitespace) {
      while (next && whitespace(next)) {
        offset += increment;
        next = siblings[offset];
      }
    }

    // @ts-expect-error: it’s a correct child.
    return next
  }
}

/**
 * @import {Element, Parents} from 'hast'
 */

/**
 * @callback OmitHandle
 *   Check if a tag can be omitted.
 * @param {Element} element
 *   Element to check.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether to omit a tag.
 *
 */

const own = {}.hasOwnProperty;

/**
 * Factory to check if a given node can have a tag omitted.
 *
 * @param {Record<string, OmitHandle>} handlers
 *   Omission handlers, where each key is a tag name, and each value is the
 *   corresponding handler.
 * @returns {OmitHandle}
 *   Whether to omit a tag of an element.
 */
function omission(handlers) {
  return omit

  /**
   * Check if a given node can have a tag omitted.
   *
   * @type {OmitHandle}
   */
  function omit(node, index, parent) {
    return (
      own.call(handlers, node.tagName) &&
      handlers[node.tagName](node, index, parent)
    )
  }
}

/**
 * @import {Element, Parents} from 'hast'
 */


const closing = omission({
  body: body$1,
  caption: headOrColgroupOrCaption,
  colgroup: headOrColgroupOrCaption,
  dd,
  dt,
  head: headOrColgroupOrCaption,
  html: html$2,
  li,
  optgroup,
  option,
  p,
  rp: rubyElement,
  rt: rubyElement,
  tbody: tbody$1,
  td: cells,
  tfoot,
  th: cells,
  thead,
  tr
});

/**
 * Macro for `</head>`, `</colgroup>`, and `</caption>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function headOrColgroupOrCaption(_, index, parent) {
  const next = siblingAfter(parent, index, true);
  return (
    !next ||
    (next.type !== 'comment' &&
      !(next.type === 'text' && whitespace(next.value.charAt(0))))
  )
}

/**
 * Whether to omit `</html>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function html$2(_, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || next.type !== 'comment'
}

/**
 * Whether to omit `</body>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function body$1(_, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || next.type !== 'comment'
}

/**
 * Whether to omit `</p>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function p(_, index, parent) {
  const next = siblingAfter(parent, index);
  return next
    ? next.type === 'element' &&
        (next.tagName === 'address' ||
          next.tagName === 'article' ||
          next.tagName === 'aside' ||
          next.tagName === 'blockquote' ||
          next.tagName === 'details' ||
          next.tagName === 'div' ||
          next.tagName === 'dl' ||
          next.tagName === 'fieldset' ||
          next.tagName === 'figcaption' ||
          next.tagName === 'figure' ||
          next.tagName === 'footer' ||
          next.tagName === 'form' ||
          next.tagName === 'h1' ||
          next.tagName === 'h2' ||
          next.tagName === 'h3' ||
          next.tagName === 'h4' ||
          next.tagName === 'h5' ||
          next.tagName === 'h6' ||
          next.tagName === 'header' ||
          next.tagName === 'hgroup' ||
          next.tagName === 'hr' ||
          next.tagName === 'main' ||
          next.tagName === 'menu' ||
          next.tagName === 'nav' ||
          next.tagName === 'ol' ||
          next.tagName === 'p' ||
          next.tagName === 'pre' ||
          next.tagName === 'section' ||
          next.tagName === 'table' ||
          next.tagName === 'ul')
    : !parent ||
        // Confusing parent.
        !(
          parent.type === 'element' &&
          (parent.tagName === 'a' ||
            parent.tagName === 'audio' ||
            parent.tagName === 'del' ||
            parent.tagName === 'ins' ||
            parent.tagName === 'map' ||
            parent.tagName === 'noscript' ||
            parent.tagName === 'video')
        )
}

/**
 * Whether to omit `</li>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function li(_, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || (next.type === 'element' && next.tagName === 'li')
}

/**
 * Whether to omit `</dt>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function dt(_, index, parent) {
  const next = siblingAfter(parent, index);
  return Boolean(
    next &&
      next.type === 'element' &&
      (next.tagName === 'dt' || next.tagName === 'dd')
  )
}

/**
 * Whether to omit `</dd>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function dd(_, index, parent) {
  const next = siblingAfter(parent, index);
  return (
    !next ||
    (next.type === 'element' &&
      (next.tagName === 'dt' || next.tagName === 'dd'))
  )
}

/**
 * Whether to omit `</rt>` or `</rp>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function rubyElement(_, index, parent) {
  const next = siblingAfter(parent, index);
  return (
    !next ||
    (next.type === 'element' &&
      (next.tagName === 'rp' || next.tagName === 'rt'))
  )
}

/**
 * Whether to omit `</optgroup>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function optgroup(_, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || (next.type === 'element' && next.tagName === 'optgroup')
}

/**
 * Whether to omit `</option>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function option(_, index, parent) {
  const next = siblingAfter(parent, index);
  return (
    !next ||
    (next.type === 'element' &&
      (next.tagName === 'option' || next.tagName === 'optgroup'))
  )
}

/**
 * Whether to omit `</thead>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function thead(_, index, parent) {
  const next = siblingAfter(parent, index);
  return Boolean(
    next &&
      next.type === 'element' &&
      (next.tagName === 'tbody' || next.tagName === 'tfoot')
  )
}

/**
 * Whether to omit `</tbody>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function tbody$1(_, index, parent) {
  const next = siblingAfter(parent, index);
  return (
    !next ||
    (next.type === 'element' &&
      (next.tagName === 'tbody' || next.tagName === 'tfoot'))
  )
}

/**
 * Whether to omit `</tfoot>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function tfoot(_, index, parent) {
  return !siblingAfter(parent, index)
}

/**
 * Whether to omit `</tr>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function tr(_, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || (next.type === 'element' && next.tagName === 'tr')
}

/**
 * Whether to omit `</td>` or `</th>`.
 *
 * @param {Element} _
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the closing tag can be omitted.
 */
function cells(_, index, parent) {
  const next = siblingAfter(parent, index);
  return (
    !next ||
    (next.type === 'element' &&
      (next.tagName === 'td' || next.tagName === 'th'))
  )
}

/**
 * @import {Element, Parents} from 'hast'
 */


const opening = omission({
  body,
  colgroup,
  head,
  html: html$1,
  tbody
});

/**
 * Whether to omit `<html>`.
 *
 * @param {Element} node
 *   Element.
 * @returns {boolean}
 *   Whether the opening tag can be omitted.
 */
function html$1(node) {
  const head = siblingAfter(node, -1);
  return !head || head.type !== 'comment'
}

/**
 * Whether to omit `<head>`.
 *
 * @param {Element} node
 *   Element.
 * @returns {boolean}
 *   Whether the opening tag can be omitted.
 */
function head(node) {
  /** @type {Set<string>} */
  const seen = new Set();

  // Whether `srcdoc` or not,
  // make sure the content model at least doesn’t have too many `base`s/`title`s.
  for (const child of node.children) {
    if (
      child.type === 'element' &&
      (child.tagName === 'base' || child.tagName === 'title')
    ) {
      if (seen.has(child.tagName)) return false
      seen.add(child.tagName);
    }
  }

  // “May be omitted if the element is empty,
  // or if the first thing inside the head element is an element.”
  const child = node.children[0];
  return !child || child.type === 'element'
}

/**
 * Whether to omit `<body>`.
 *
 * @param {Element} node
 *   Element.
 * @returns {boolean}
 *   Whether the opening tag can be omitted.
 */
function body(node) {
  const head = siblingAfter(node, -1, true);

  return (
    !head ||
    (head.type !== 'comment' &&
      !(head.type === 'text' && whitespace(head.value.charAt(0))) &&
      !(
        head.type === 'element' &&
        (head.tagName === 'meta' ||
          head.tagName === 'link' ||
          head.tagName === 'script' ||
          head.tagName === 'style' ||
          head.tagName === 'template')
      ))
  )
}

/**
 * Whether to omit `<colgroup>`.
 * The spec describes some logic for the opening tag, but it’s easier to
 * implement in the closing tag, to the same effect, so we handle it there
 * instead.
 *
 * @param {Element} node
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the opening tag can be omitted.
 */
function colgroup(node, index, parent) {
  const previous = siblingBefore(parent, index);
  const head = siblingAfter(node, -1, true);

  // Previous colgroup was already omitted.
  if (
    parent &&
    previous &&
    previous.type === 'element' &&
    previous.tagName === 'colgroup' &&
    closing(previous, parent.children.indexOf(previous), parent)
  ) {
    return false
  }

  return Boolean(head && head.type === 'element' && head.tagName === 'col')
}

/**
 * Whether to omit `<tbody>`.
 *
 * @param {Element} node
 *   Element.
 * @param {number | undefined} index
 *   Index of element in parent.
 * @param {Parents | undefined} parent
 *   Parent of element.
 * @returns {boolean}
 *   Whether the opening tag can be omitted.
 */
function tbody(node, index, parent) {
  const previous = siblingBefore(parent, index);
  const head = siblingAfter(node, -1);

  // Previous table section was already omitted.
  if (
    parent &&
    previous &&
    previous.type === 'element' &&
    (previous.tagName === 'thead' || previous.tagName === 'tbody') &&
    closing(previous, parent.children.indexOf(previous), parent)
  ) {
    return false
  }

  return Boolean(head && head.type === 'element' && head.tagName === 'tr')
}

/**
 * @import {Element, Parents, Properties} from 'hast'
 * @import {State} from '../index.js'
 */


/**
 * Maps of subsets.
 *
 * Each value is a matrix of tuples.
 * The value at `0` causes parse errors, the value at `1` is valid.
 * Of both, the value at `0` is unsafe, and the value at `1` is safe.
 *
 * @type {Record<'double' | 'name' | 'single' | 'unquoted', Array<[Array<string>, Array<string>]>>}
 */
const constants = {
  // See: <https://html.spec.whatwg.org/#attribute-name-state>.
  name: [
    ['\t\n\f\r &/=>'.split(''), '\t\n\f\r "&\'/=>`'.split('')],
    ['\0\t\n\f\r "&\'/<=>'.split(''), '\0\t\n\f\r "&\'/<=>`'.split('')]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(unquoted)-state>.
  unquoted: [
    ['\t\n\f\r &>'.split(''), '\0\t\n\f\r "&\'<=>`'.split('')],
    ['\0\t\n\f\r "&\'<=>`'.split(''), '\0\t\n\f\r "&\'<=>`'.split('')]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(single-quoted)-state>.
  single: [
    ["&'".split(''), '"&\'`'.split('')],
    ["\0&'".split(''), '\0"&\'`'.split('')]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(double-quoted)-state>.
  double: [
    ['"&'.split(''), '"&\'`'.split('')],
    ['\0"&'.split(''), '\0"&\'`'.split('')]
  ]
};

/**
 * Serialize an element node.
 *
 * @param {Element} node
 *   Node to handle.
 * @param {number | undefined} index
 *   Index of `node` in `parent.
 * @param {Parents | undefined} parent
 *   Parent of `node`.
 * @param {State} state
 *   Info passed around about the current state.
 * @returns {string}
 *   Serialized node.
 */
function element(node, index, parent, state) {
  const schema = state.schema;
  const omit = schema.space === 'svg' ? false : state.settings.omitOptionalTags;
  let selfClosing =
    schema.space === 'svg'
      ? state.settings.closeEmptyElements
      : state.settings.voids.includes(node.tagName.toLowerCase());
  /** @type {Array<string>} */
  const parts = [];
  /** @type {string} */
  let last;

  if (schema.space === 'html' && node.tagName === 'svg') {
    state.schema = svg;
  }

  const attributes = serializeAttributes(state, node.properties);

  const content = state.all(
    schema.space === 'html' && node.tagName === 'template' ? node.content : node
  );

  state.schema = schema;

  // If the node is categorised as void, but it has children, remove the
  // categorisation.
  // This enables for example `menuitem`s, which are void in W3C HTML but not
  // void in WHATWG HTML, to be stringified properly.
  // Note: `menuitem` has since been removed from the HTML spec, and so is no
  // longer void.
  if (content) selfClosing = false;

  if (attributes || !omit || !opening(node, index, parent)) {
    parts.push('<', node.tagName, attributes ? ' ' + attributes : '');

    if (
      selfClosing &&
      (schema.space === 'svg' || state.settings.closeSelfClosing)
    ) {
      last = attributes.charAt(attributes.length - 1);
      if (
        !state.settings.tightSelfClosing ||
        last === '/' ||
        (last && last !== '"' && last !== "'")
      ) {
        parts.push(' ');
      }

      parts.push('/');
    }

    parts.push('>');
  }

  parts.push(content);

  if (!selfClosing && (!omit || !closing(node, index, parent))) {
    parts.push('</' + node.tagName + '>');
  }

  return parts.join('')
}

/**
 * @param {State} state
 * @param {Properties | null | undefined} properties
 * @returns {string}
 */
function serializeAttributes(state, properties) {
  /** @type {Array<string>} */
  const values = [];
  let index = -1;
  /** @type {string} */
  let key;

  if (properties) {
    for (key in properties) {
      if (properties[key] !== null && properties[key] !== undefined) {
        const value = serializeAttribute(state, key, properties[key]);
        if (value) values.push(value);
      }
    }
  }

  while (++index < values.length) {
    const last = state.settings.tightAttributes
      ? values[index].charAt(values[index].length - 1)
      : undefined;

    // In tight mode, don’t add a space after quoted attributes.
    if (index !== values.length - 1 && last !== '"' && last !== "'") {
      values[index] += ' ';
    }
  }

  return values.join('')
}

/**
 * @param {State} state
 * @param {string} key
 * @param {Properties[keyof Properties]} value
 * @returns {string}
 */
function serializeAttribute(state, key, value) {
  const info = find(state.schema, key);
  const x =
    state.settings.allowParseErrors && state.schema.space === 'html' ? 0 : 1;
  const y = state.settings.allowDangerousCharacters ? 0 : 1;
  let quote = state.quote;
  /** @type {string | undefined} */
  let result;

  if (info.overloadedBoolean && (value === info.attribute || value === '')) {
    value = true;
  } else if (
    info.boolean ||
    (info.overloadedBoolean && typeof value !== 'string')
  ) {
    value = Boolean(value);
  }

  if (
    value === null ||
    value === undefined ||
    value === false ||
    (typeof value === 'number' && Number.isNaN(value))
  ) {
    return ''
  }

  const name = stringifyEntities(
    info.attribute,
    Object.assign({}, state.settings.characterReferences, {
      // Always encode without parse errors in non-HTML.
      subset: constants.name[x][y]
    })
  );

  // No value.
  // There is currently only one boolean property in SVG: `[download]` on
  // `<a>`.
  // This property does not seem to work in browsers (Firefox, Safari, Chrome),
  // so I can’t test if dropping the value works.
  // But I assume that it should:
  //
  // ```html
  // <!doctype html>
  // <svg viewBox="0 0 100 100">
  //   <a href=https://example.com download>
  //     <circle cx=50 cy=40 r=35 />
  //   </a>
  // </svg>
  // ```
  //
  // See: <https://github.com/wooorm/property-information/blob/main/lib/svg.js>
  if (value === true) return name

  // `spaces` doesn’t accept a second argument, but it’s given here just to
  // keep the code cleaner.
  value = Array.isArray(value)
    ? (info.commaSeparated ? stringify$2 : stringify$1)(value, {
        padLeft: !state.settings.tightCommaSeparatedLists
      })
    : String(value);

  if (state.settings.collapseEmptyAttributes && !value) return name

  // Check unquoted value.
  if (state.settings.preferUnquoted) {
    result = stringifyEntities(
      value,
      Object.assign({}, state.settings.characterReferences, {
        attribute: true,
        subset: constants.unquoted[x][y]
      })
    );
  }

  // If we don’t want unquoted, or if `value` contains character references when
  // unquoted…
  if (result !== value) {
    // If the alternative is less common than `quote`, switch.
    if (
      state.settings.quoteSmart &&
      ccount(value, quote) > ccount(value, state.alternative)
    ) {
      quote = state.alternative;
    }

    result =
      quote +
      stringifyEntities(
        value,
        Object.assign({}, state.settings.characterReferences, {
          // Always encode without parse errors in non-HTML.
          subset: (quote === "'" ? constants.single : constants.double)[x][y],
          attribute: true
        })
      ) +
      quote;
  }

  // Don’t add a `=` for unquoted empties.
  return name + (result ? '=' + result : result)
}

/**
 * @import {Parents, Text} from 'hast'
 * @import {Raw} from 'mdast-util-to-hast'
 * @import {State} from '../index.js'
 */


// Declare array as variable so it can be cached by `stringifyEntities`
const textEntitySubset = ['<', '&'];

/**
 * Serialize a text node.
 *
 * @param {Raw | Text} node
 *   Node to handle.
 * @param {number | undefined} _
 *   Index of `node` in `parent.
 * @param {Parents | undefined} parent
 *   Parent of `node`.
 * @param {State} state
 *   Info passed around about the current state.
 * @returns {string}
 *   Serialized node.
 */
function text(node, _, parent, state) {
  // Check if content of `node` should be escaped.
  return parent &&
    parent.type === 'element' &&
    (parent.tagName === 'script' || parent.tagName === 'style')
    ? node.value
    : stringifyEntities(
        node.value,
        Object.assign({}, state.settings.characterReferences, {
          subset: textEntitySubset
        })
      )
}

/**
 * @import {Parents} from 'hast'
 * @import {Raw} from 'mdast-util-to-hast'
 * @import {State} from '../index.js'
 */


/**
 * Serialize a raw node.
 *
 * @param {Raw} node
 *   Node to handle.
 * @param {number | undefined} index
 *   Index of `node` in `parent.
 * @param {Parents | undefined} parent
 *   Parent of `node`.
 * @param {State} state
 *   Info passed around about the current state.
 * @returns {string}
 *   Serialized node.
 */
function raw(node, index, parent, state) {
  return state.settings.allowDangerousHtml
    ? node.value
    : text(node, index, parent, state)
}

/**
 * @import {Parents, Root} from 'hast'
 * @import {State} from '../index.js'
 */

/**
 * Serialize a root.
 *
 * @param {Root} node
 *   Node to handle.
 * @param {number | undefined} _1
 *   Index of `node` in `parent.
 * @param {Parents | undefined} _2
 *   Parent of `node`.
 * @param {State} state
 *   Info passed around about the current state.
 * @returns {string}
 *   Serialized node.
 */
function root(node, _1, _2, state) {
  return state.all(node)
}

/**
 * @import {Nodes, Parents} from 'hast'
 * @import {State} from '../index.js'
 */


/**
 * @type {(node: Nodes, index: number | undefined, parent: Parents | undefined, state: State) => string}
 */
const handle = zwitch('type', {
  invalid,
  unknown,
  handlers: {comment, doctype, element, raw, root, text}
});

/**
 * Fail when a non-node is found in the tree.
 *
 * @param {unknown} node
 *   Unknown value.
 * @returns {never}
 *   Never.
 */
function invalid(node) {
  throw new Error('Expected node, not `' + node + '`')
}

/**
 * Fail when a node with an unknown type is found in the tree.
 *
 * @param {unknown} node_
 *  Unknown node.
 * @returns {never}
 *   Never.
 */
function unknown(node_) {
  // `type` is guaranteed by runtime JS.
  const node = /** @type {Nodes} */ (node_);
  throw new Error('Cannot compile unknown node `' + node.type + '`')
}

/**
 * @import {Nodes, Parents, RootContent} from 'hast'
 * @import {Schema} from 'property-information'
 * @import {Options as StringifyEntitiesOptions} from 'stringify-entities'
 */


/** @type {Options} */
const emptyOptions = {};

/** @type {CharacterReferences} */
const emptyCharacterReferences = {};

/** @type {Array<never>} */
const emptyChildren = [];

/**
 * Serialize hast as HTML.
 *
 * @param {Array<RootContent> | Nodes} tree
 *   Tree to serialize.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {string}
 *   Serialized HTML.
 */
function toHtml(tree, options) {
  const options_ = emptyOptions;
  const quote = options_.quote || '"';
  const alternative = quote === '"' ? "'" : '"';

  if (quote !== '"' && quote !== "'") {
    throw new Error('Invalid quote `' + quote + '`, expected `\'` or `"`')
  }

  /** @type {State} */
  const state = {
    one,
    all,
    settings: {
      omitOptionalTags: options_.omitOptionalTags || false,
      allowParseErrors: options_.allowParseErrors || false,
      allowDangerousCharacters: options_.allowDangerousCharacters || false,
      quoteSmart: options_.quoteSmart || false,
      preferUnquoted: options_.preferUnquoted || false,
      tightAttributes: options_.tightAttributes || false,
      upperDoctype: options_.upperDoctype || false,
      tightDoctype: options_.tightDoctype || false,
      bogusComments: options_.bogusComments || false,
      tightCommaSeparatedLists: options_.tightCommaSeparatedLists || false,
      tightSelfClosing: options_.tightSelfClosing || false,
      collapseEmptyAttributes: options_.collapseEmptyAttributes || false,
      allowDangerousHtml: options_.allowDangerousHtml || false,
      voids: options_.voids || htmlVoidElements,
      characterReferences:
        options_.characterReferences || emptyCharacterReferences,
      closeSelfClosing: options_.closeSelfClosing || false,
      closeEmptyElements: options_.closeEmptyElements || false
    },
    schema: options_.space === 'svg' ? svg : html$3,
    quote,
    alternative
  };

  return state.one(
    Array.isArray(tree) ? {type: 'root', children: tree} : tree,
    undefined,
    undefined
  )
}

/**
 * Serialize a node.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {Nodes} node
 *   Node to handle.
 * @param {number | undefined} index
 *   Index of `node` in `parent.
 * @param {Parents | undefined} parent
 *   Parent of `node`.
 * @returns {string}
 *   Serialized node.
 */
function one(node, index, parent) {
  return handle(node, index, parent, this)
}

/**
 * Serialize all children of `parent`.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {Parents | undefined} parent
 *   Parent whose children to serialize.
 * @returns {string}
 */
function all(parent) {
  /** @type {Array<string>} */
  const results = [];
  const children = (parent && parent.children) || emptyChildren;
  let index = -1;

  while (++index < children.length) {
    results[index] = this.one(children[index], index, parent);
  }

  return results.join('')
}

function splitLines(code, preserveEnding = false) {
  const parts = code.split(/(\r?\n)/g);
  let index = 0;
  const lines = [];
  for (let i = 0; i < parts.length; i += 2) {
    const line = preserveEnding ? parts[i] + (parts[i + 1] || "") : parts[i];
    lines.push([line, index]);
    index += parts[i].length;
    index += parts[i + 1]?.length || 0;
  }
  return lines;
}
function isPlainLang(lang) {
  return !lang || ["plaintext", "txt", "text", "plain"].includes(lang);
}
function isSpecialLang(lang) {
  return lang === "ansi" || isPlainLang(lang);
}
function isNoneTheme(theme) {
  return theme === "none";
}
function isSpecialTheme(theme) {
  return isNoneTheme(theme);
}
function addClassToHast(node, className) {
  var _a;
  if (!className)
    return node;
  node.properties || (node.properties = {});
  (_a = node.properties).class || (_a.class = []);
  if (typeof node.properties.class === "string")
    node.properties.class = node.properties.class.split(/\s+/g);
  if (!Array.isArray(node.properties.class))
    node.properties.class = [];
  const targets = Array.isArray(className) ? className : className.split(/\s+/g);
  for (const c of targets) {
    if (c && !node.properties.class.includes(c))
      node.properties.class.push(c);
  }
  return node;
}
function splitToken(token, offsets) {
  let lastOffset = 0;
  const tokens = [];
  for (const offset of offsets) {
    if (offset > lastOffset) {
      tokens.push({
        ...token,
        content: token.content.slice(lastOffset, offset),
        offset: token.offset + lastOffset
      });
    }
    lastOffset = offset;
  }
  if (lastOffset < token.content.length) {
    tokens.push({
      ...token,
      content: token.content.slice(lastOffset),
      offset: token.offset + lastOffset
    });
  }
  return tokens;
}
function splitTokens(tokens, breakpoints) {
  const sorted = Array.from(breakpoints instanceof Set ? breakpoints : new Set(breakpoints)).sort((a, b) => a - b);
  if (!sorted.length)
    return tokens;
  return tokens.map((line) => {
    return line.flatMap((token) => {
      const breakpointsInToken = sorted.filter((i) => token.offset < i && i < token.offset + token.content.length).map((i) => i - token.offset).sort((a, b) => a - b);
      if (!breakpointsInToken.length)
        return token;
      return splitToken(token, breakpointsInToken);
    });
  });
}
async function normalizeGetter(p) {
  return Promise.resolve(typeof p === "function" ? p() : p).then((r) => r.default || r);
}
function resolveColorReplacements(theme, options) {
  const replacements = typeof theme === "string" ? {} : { ...theme.colorReplacements };
  const themeName = typeof theme === "string" ? theme : theme.name;
  for (const [key, value] of Object.entries(options?.colorReplacements || {})) {
    if (typeof value === "string")
      replacements[key] = value;
    else if (key === themeName)
      Object.assign(replacements, value);
  }
  return replacements;
}
function applyColorReplacements(color, replacements) {
  if (!color)
    return color;
  return replacements?.[color?.toLowerCase()] || color;
}
function getTokenStyleObject(token) {
  const styles = {};
  if (token.color)
    styles.color = token.color;
  if (token.bgColor)
    styles["background-color"] = token.bgColor;
  if (token.fontStyle) {
    if (token.fontStyle & FontStyle.Italic)
      styles["font-style"] = "italic";
    if (token.fontStyle & FontStyle.Bold)
      styles["font-weight"] = "bold";
    if (token.fontStyle & FontStyle.Underline)
      styles["text-decoration"] = "underline";
  }
  return styles;
}
function stringifyTokenStyle(token) {
  if (typeof token === "string")
    return token;
  return Object.entries(token).map(([key, value]) => `${key}:${value}`).join(";");
}
function createPositionConverter(code) {
  const lines = splitLines(code, true).map(([line]) => line);
  function indexToPos(index) {
    if (index === code.length) {
      return {
        line: lines.length - 1,
        character: lines[lines.length - 1].length
      };
    }
    let character = index;
    let line = 0;
    for (const lineText of lines) {
      if (character < lineText.length)
        break;
      character -= lineText.length;
      line++;
    }
    return { line, character };
  }
  function posToIndex(line, character) {
    let index = 0;
    for (let i = 0; i < line; i++)
      index += lines[i].length;
    index += character;
    return index;
  }
  return {
    lines,
    indexToPos,
    posToIndex
  };
}

class ShikiError extends Error {
  constructor(message) {
    super(message);
    this.name = "ShikiError";
  }
}

function transformerDecorations() {
  const map = /* @__PURE__ */ new WeakMap();
  function getContext(shiki) {
    if (!map.has(shiki.meta)) {
      let normalizePosition = function(p) {
        if (typeof p === "number") {
          if (p < 0 || p > shiki.source.length)
            throw new ShikiError(`Invalid decoration offset: ${p}. Code length: ${shiki.source.length}`);
          return {
            ...converter.indexToPos(p),
            offset: p
          };
        } else {
          const line = converter.lines[p.line];
          if (line === void 0)
            throw new ShikiError(`Invalid decoration position ${JSON.stringify(p)}. Lines length: ${converter.lines.length}`);
          if (p.character < 0 || p.character > line.length)
            throw new ShikiError(`Invalid decoration position ${JSON.stringify(p)}. Line ${p.line} length: ${line.length}`);
          return {
            ...p,
            offset: converter.posToIndex(p.line, p.character)
          };
        }
      };
      const converter = createPositionConverter(shiki.source);
      const decorations = (shiki.options.decorations || []).map((d) => ({
        ...d,
        start: normalizePosition(d.start),
        end: normalizePosition(d.end)
      }));
      verifyIntersections(decorations);
      map.set(shiki.meta, {
        decorations,
        converter,
        source: shiki.source
      });
    }
    return map.get(shiki.meta);
  }
  return {
    name: "shiki:decorations",
    tokens(tokens) {
      if (!this.options.decorations?.length)
        return;
      const ctx = getContext(this);
      const breakpoints = ctx.decorations.flatMap((d) => [d.start.offset, d.end.offset]);
      const splitted = splitTokens(tokens, breakpoints);
      return splitted;
    },
    code(codeEl) {
      if (!this.options.decorations?.length)
        return;
      const ctx = getContext(this);
      const lines = Array.from(codeEl.children).filter((i) => i.type === "element" && i.tagName === "span");
      if (lines.length !== ctx.converter.lines.length)
        throw new ShikiError(`Number of lines in code element (${lines.length}) does not match the number of lines in the source (${ctx.converter.lines.length}). Failed to apply decorations.`);
      function applyLineSection(line, start, end, decoration) {
        const lineEl = lines[line];
        let text = "";
        let startIndex = -1;
        let endIndex = -1;
        if (start === 0)
          startIndex = 0;
        if (end === 0)
          endIndex = 0;
        if (end === Number.POSITIVE_INFINITY)
          endIndex = lineEl.children.length;
        if (startIndex === -1 || endIndex === -1) {
          for (let i = 0; i < lineEl.children.length; i++) {
            text += stringify(lineEl.children[i]);
            if (startIndex === -1 && text.length === start)
              startIndex = i + 1;
            if (endIndex === -1 && text.length === end)
              endIndex = i + 1;
          }
        }
        if (startIndex === -1)
          throw new ShikiError(`Failed to find start index for decoration ${JSON.stringify(decoration.start)}`);
        if (endIndex === -1)
          throw new ShikiError(`Failed to find end index for decoration ${JSON.stringify(decoration.end)}`);
        const children = lineEl.children.slice(startIndex, endIndex);
        if (!decoration.alwaysWrap && children.length === lineEl.children.length) {
          applyDecoration(lineEl, decoration, "line");
        } else if (!decoration.alwaysWrap && children.length === 1 && children[0].type === "element") {
          applyDecoration(children[0], decoration, "token");
        } else {
          const wrapper = {
            type: "element",
            tagName: "span",
            properties: {},
            children
          };
          applyDecoration(wrapper, decoration, "wrapper");
          lineEl.children.splice(startIndex, children.length, wrapper);
        }
      }
      function applyLine(line, decoration) {
        lines[line] = applyDecoration(lines[line], decoration, "line");
      }
      function applyDecoration(el, decoration, type) {
        const properties = decoration.properties || {};
        const transform = decoration.transform || ((i) => i);
        el.tagName = decoration.tagName || "span";
        el.properties = {
          ...el.properties,
          ...properties,
          class: el.properties.class
        };
        if (decoration.properties?.class)
          addClassToHast(el, decoration.properties.class);
        el = transform(el, type) || el;
        return el;
      }
      const lineApplies = [];
      const sorted = ctx.decorations.sort((a, b) => b.start.offset - a.start.offset);
      for (const decoration of sorted) {
        const { start, end } = decoration;
        if (start.line === end.line) {
          applyLineSection(start.line, start.character, end.character, decoration);
        } else if (start.line < end.line) {
          applyLineSection(start.line, start.character, Number.POSITIVE_INFINITY, decoration);
          for (let i = start.line + 1; i < end.line; i++)
            lineApplies.unshift(() => applyLine(i, decoration));
          applyLineSection(end.line, 0, end.character, decoration);
        }
      }
      lineApplies.forEach((i) => i());
    }
  };
}
function verifyIntersections(items) {
  for (let i = 0; i < items.length; i++) {
    const foo = items[i];
    if (foo.start.offset > foo.end.offset)
      throw new ShikiError(`Invalid decoration range: ${JSON.stringify(foo.start)} - ${JSON.stringify(foo.end)}`);
    for (let j = i + 1; j < items.length; j++) {
      const bar = items[j];
      const isFooHasBarStart = foo.start.offset < bar.start.offset && bar.start.offset < foo.end.offset;
      const isFooHasBarEnd = foo.start.offset < bar.end.offset && bar.end.offset < foo.end.offset;
      const isBarHasFooStart = bar.start.offset < foo.start.offset && foo.start.offset < bar.end.offset;
      const isBarHasFooEnd = bar.start.offset < foo.end.offset && foo.end.offset < bar.end.offset;
      if (isFooHasBarStart || isFooHasBarEnd || isBarHasFooStart || isBarHasFooEnd) {
        if (isFooHasBarEnd && isFooHasBarEnd)
          continue;
        if (isBarHasFooStart && isBarHasFooEnd)
          continue;
        throw new ShikiError(`Decorations ${JSON.stringify(foo.start)} and ${JSON.stringify(bar.start)} intersect.`);
      }
    }
  }
}
function stringify(el) {
  if (el.type === "text")
    return el.value;
  if (el.type === "element")
    return el.children.map(stringify).join("");
  return "";
}

const builtInTransformers = [
  /* @__PURE__ */ transformerDecorations()
];
function getTransformers(options) {
  return [
    ...options.transformers || [],
    ...builtInTransformers
  ];
}

class GrammarState {
  constructor(_stack, lang, theme) {
    this._stack = _stack;
    this.lang = lang;
    this.theme = theme;
  }
  /**
   * Static method to create a initial grammar state.
   */
  static initial(lang, theme) {
    return new GrammarState(INITIAL, lang, theme);
  }
  get scopes() {
    return getScopes(this._stack);
  }
  toJSON() {
    return {
      lang: this.lang,
      theme: this.theme,
      scopes: this.scopes
    };
  }
}
function getScopes(stack) {
  const scopes = [];
  const visited = /* @__PURE__ */ new Set();
  function pushScope(stack2) {
    if (visited.has(stack2))
      return;
    visited.add(stack2);
    const name = stack2?.nameScopesList?.scopeName;
    if (name)
      scopes.push(name);
    if (stack2.parent)
      pushScope(stack2.parent);
  }
  pushScope(stack);
  return scopes;
}
function getGrammarStack(state) {
  if (!(state instanceof GrammarState))
    throw new ShikiError("Invalid grammar state");
  return state._stack;
}

// src/colors.ts
var namedColors = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "brightBlack",
  "brightRed",
  "brightGreen",
  "brightYellow",
  "brightBlue",
  "brightMagenta",
  "brightCyan",
  "brightWhite"
];

// src/decorations.ts
var decorations = {
  1: "bold",
  2: "dim",
  3: "italic",
  4: "underline",
  7: "reverse",
  9: "strikethrough"
};

// src/parser.ts
function findSequence(value, position) {
  const nextEscape = value.indexOf("\x1B[", position);
  if (nextEscape !== -1) {
    const nextClose = value.indexOf("m", nextEscape);
    return {
      sequence: value.substring(nextEscape + 2, nextClose).split(";"),
      startPosition: nextEscape,
      position: nextClose + 1
    };
  }
  return {
    position: value.length
  };
}
function parseColor(sequence, index) {
  let offset = 1;
  const colorMode = sequence[index + offset++];
  let color;
  if (colorMode === "2") {
    const rgb = [
      sequence[index + offset++],
      sequence[index + offset++],
      sequence[index + offset]
    ].map((x) => Number.parseInt(x));
    if (rgb.length === 3 && !rgb.some((x) => Number.isNaN(x))) {
      color = {
        type: "rgb",
        rgb
      };
    }
  } else if (colorMode === "5") {
    const colorIndex = Number.parseInt(sequence[index + offset]);
    if (!Number.isNaN(colorIndex)) {
      color = { type: "table", index: Number(colorIndex) };
    }
  }
  return [offset, color];
}
function parseSequence(sequence) {
  const commands = [];
  for (let i = 0; i < sequence.length; i++) {
    const code = sequence[i];
    const codeInt = Number.parseInt(code);
    if (Number.isNaN(codeInt))
      continue;
    if (codeInt === 0) {
      commands.push({ type: "resetAll" });
    } else if (codeInt <= 9) {
      const decoration = decorations[codeInt];
      if (decoration) {
        commands.push({
          type: "setDecoration",
          value: decorations[codeInt]
        });
      }
    } else if (codeInt <= 29) {
      const decoration = decorations[codeInt - 20];
      if (decoration) {
        commands.push({
          type: "resetDecoration",
          value: decoration
        });
      }
    } else if (codeInt <= 37) {
      commands.push({
        type: "setForegroundColor",
        value: { type: "named", name: namedColors[codeInt - 30] }
      });
    } else if (codeInt === 38) {
      const [offset, color] = parseColor(sequence, i);
      if (color) {
        commands.push({
          type: "setForegroundColor",
          value: color
        });
      }
      i += offset;
    } else if (codeInt === 39) {
      commands.push({
        type: "resetForegroundColor"
      });
    } else if (codeInt <= 47) {
      commands.push({
        type: "setBackgroundColor",
        value: { type: "named", name: namedColors[codeInt - 40] }
      });
    } else if (codeInt === 48) {
      const [offset, color] = parseColor(sequence, i);
      if (color) {
        commands.push({
          type: "setBackgroundColor",
          value: color
        });
      }
      i += offset;
    } else if (codeInt === 49) {
      commands.push({
        type: "resetBackgroundColor"
      });
    } else if (codeInt >= 90 && codeInt <= 97) {
      commands.push({
        type: "setForegroundColor",
        value: { type: "named", name: namedColors[codeInt - 90 + 8] }
      });
    } else if (codeInt >= 100 && codeInt <= 107) {
      commands.push({
        type: "setBackgroundColor",
        value: { type: "named", name: namedColors[codeInt - 100 + 8] }
      });
    }
  }
  return commands;
}
function createAnsiSequenceParser() {
  let foreground = null;
  let background = null;
  let decorations2 = /* @__PURE__ */ new Set();
  return {
    parse(value) {
      const tokens = [];
      let position = 0;
      do {
        const findResult = findSequence(value, position);
        const text = findResult.sequence ? value.substring(position, findResult.startPosition) : value.substring(position);
        if (text.length > 0) {
          tokens.push({
            value: text,
            foreground,
            background,
            decorations: new Set(decorations2)
          });
        }
        if (findResult.sequence) {
          const commands = parseSequence(findResult.sequence);
          for (const styleToken of commands) {
            if (styleToken.type === "resetAll") {
              foreground = null;
              background = null;
              decorations2.clear();
            } else if (styleToken.type === "resetForegroundColor") {
              foreground = null;
            } else if (styleToken.type === "resetBackgroundColor") {
              background = null;
            } else if (styleToken.type === "resetDecoration") {
              decorations2.delete(styleToken.value);
            }
          }
          for (const styleToken of commands) {
            if (styleToken.type === "setForegroundColor") {
              foreground = styleToken.value;
            } else if (styleToken.type === "setBackgroundColor") {
              background = styleToken.value;
            } else if (styleToken.type === "setDecoration") {
              decorations2.add(styleToken.value);
            }
          }
        }
        position = findResult.position;
      } while (position < value.length);
      return tokens;
    }
  };
}

// src/palette.ts
var defaultNamedColorsMap = {
  black: "#000000",
  red: "#bb0000",
  green: "#00bb00",
  yellow: "#bbbb00",
  blue: "#0000bb",
  magenta: "#ff00ff",
  cyan: "#00bbbb",
  white: "#eeeeee",
  brightBlack: "#555555",
  brightRed: "#ff5555",
  brightGreen: "#00ff00",
  brightYellow: "#ffff55",
  brightBlue: "#5555ff",
  brightMagenta: "#ff55ff",
  brightCyan: "#55ffff",
  brightWhite: "#ffffff"
};
function createColorPalette(namedColorsMap = defaultNamedColorsMap) {
  function namedColor(name) {
    return namedColorsMap[name];
  }
  function rgbColor(rgb) {
    return `#${rgb.map((x) => Math.max(0, Math.min(x, 255)).toString(16).padStart(2, "0")).join("")}`;
  }
  let colorTable;
  function getColorTable() {
    if (colorTable) {
      return colorTable;
    }
    colorTable = [];
    for (let i = 0; i < namedColors.length; i++) {
      colorTable.push(namedColor(namedColors[i]));
    }
    let levels = [0, 95, 135, 175, 215, 255];
    for (let r = 0; r < 6; r++) {
      for (let g = 0; g < 6; g++) {
        for (let b = 0; b < 6; b++) {
          colorTable.push(rgbColor([levels[r], levels[g], levels[b]]));
        }
      }
    }
    let level = 8;
    for (let i = 0; i < 24; i++, level += 10) {
      colorTable.push(rgbColor([level, level, level]));
    }
    return colorTable;
  }
  function tableColor(index) {
    return getColorTable()[index];
  }
  function value(color) {
    switch (color.type) {
      case "named":
        return namedColor(color.name);
      case "rgb":
        return rgbColor(color.rgb);
      case "table":
        return tableColor(color.index);
    }
  }
  return {
    value
  };
}

function tokenizeAnsiWithTheme(theme, fileContents, options) {
  const colorReplacements = resolveColorReplacements(theme, options);
  const lines = splitLines(fileContents);
  const colorPalette = createColorPalette(
    Object.fromEntries(
      namedColors.map((name) => [
        name,
        theme.colors?.[`terminal.ansi${name[0].toUpperCase()}${name.substring(1)}`]
      ])
    )
  );
  const parser = createAnsiSequenceParser();
  return lines.map(
    (line) => parser.parse(line[0]).map((token) => {
      let color;
      let bgColor;
      if (token.decorations.has("reverse")) {
        color = token.background ? colorPalette.value(token.background) : theme.bg;
        bgColor = token.foreground ? colorPalette.value(token.foreground) : theme.fg;
      } else {
        color = token.foreground ? colorPalette.value(token.foreground) : theme.fg;
        bgColor = token.background ? colorPalette.value(token.background) : void 0;
      }
      color = applyColorReplacements(color, colorReplacements);
      bgColor = applyColorReplacements(bgColor, colorReplacements);
      if (token.decorations.has("dim"))
        color = dimColor(color);
      let fontStyle = FontStyle.None;
      if (token.decorations.has("bold"))
        fontStyle |= FontStyle.Bold;
      if (token.decorations.has("italic"))
        fontStyle |= FontStyle.Italic;
      if (token.decorations.has("underline"))
        fontStyle |= FontStyle.Underline;
      return {
        content: token.value,
        offset: line[1],
        // TODO: more accurate offset? might need to fork ansi-sequence-parser
        color,
        bgColor,
        fontStyle
      };
    })
  );
}
function dimColor(color) {
  const hexMatch = color.match(/#([0-9a-f]{3})([0-9a-f]{3})?([0-9a-f]{2})?/);
  if (hexMatch) {
    if (hexMatch[3]) {
      const alpha = Math.round(Number.parseInt(hexMatch[3], 16) / 2).toString(16).padStart(2, "0");
      return `#${hexMatch[1]}${hexMatch[2]}${alpha}`;
    } else if (hexMatch[2]) {
      return `#${hexMatch[1]}${hexMatch[2]}80`;
    } else {
      return `#${Array.from(hexMatch[1]).map((x) => `${x}${x}`).join("")}80`;
    }
  }
  const cssVarMatch = color.match(/var\((--[\w-]+-ansi-[\w-]+)\)/);
  if (cssVarMatch)
    return `var(${cssVarMatch[1]}-dim)`;
  return color;
}

function codeToTokensBase(internal, code, options = {}) {
  const {
    lang = "text",
    theme: themeName = internal.getLoadedThemes()[0]
  } = options;
  if (isPlainLang(lang) || isNoneTheme(themeName))
    return splitLines(code).map((line) => [{ content: line[0], offset: line[1] }]);
  const { theme, colorMap } = internal.setTheme(themeName);
  if (lang === "ansi")
    return tokenizeAnsiWithTheme(theme, code, options);
  const _grammar = internal.getLanguage(lang);
  if (options.grammarState) {
    if (options.grammarState.lang !== _grammar.name) {
      throw new ShikiError$2(`Grammar state language "${options.grammarState.lang}" does not match highlight language "${_grammar.name}"`);
    }
    if (options.grammarState.theme !== themeName) {
      throw new ShikiError$2(`Grammar state theme "${options.grammarState.theme}" does not match highlight theme "${themeName}"`);
    }
  }
  return tokenizeWithTheme(code, _grammar, theme, colorMap, options);
}
function getLastGrammarState(internal, code, options = {}) {
  const {
    lang = "text",
    theme: themeName = internal.getLoadedThemes()[0]
  } = options;
  if (isPlainLang(lang) || isNoneTheme(themeName))
    throw new ShikiError$2("Plain language does not have grammar state");
  if (lang === "ansi")
    throw new ShikiError$2("ANSI language does not have grammar state");
  const { theme, colorMap } = internal.setTheme(themeName);
  const _grammar = internal.getLanguage(lang);
  return new GrammarState(
    _tokenizeWithTheme(code, _grammar, theme, colorMap, options).stateStack,
    _grammar.name,
    theme.name
  );
}
function tokenizeWithTheme(code, grammar, theme, colorMap, options) {
  return _tokenizeWithTheme(code, grammar, theme, colorMap, options).tokens;
}
function _tokenizeWithTheme(code, grammar, theme, colorMap, options) {
  const colorReplacements = resolveColorReplacements(theme, options);
  const {
    tokenizeMaxLineLength = 0,
    tokenizeTimeLimit = 500
  } = options;
  const lines = splitLines(code);
  let stateStack = options.grammarState ? getGrammarStack(options.grammarState) : options.grammarContextCode != null ? _tokenizeWithTheme(
    options.grammarContextCode,
    grammar,
    theme,
    colorMap,
    {
      ...options,
      grammarState: void 0,
      grammarContextCode: void 0
    }
  ).stateStack : INITIAL;
  let actual = [];
  const final = [];
  for (let i = 0, len = lines.length; i < len; i++) {
    const [line, lineOffset] = lines[i];
    if (line === "") {
      actual = [];
      final.push([]);
      continue;
    }
    if (tokenizeMaxLineLength > 0 && line.length >= tokenizeMaxLineLength) {
      actual = [];
      final.push([{
        content: line,
        offset: lineOffset,
        color: "",
        fontStyle: 0
      }]);
      continue;
    }
    let resultWithScopes;
    let tokensWithScopes;
    let tokensWithScopesIndex;
    if (options.includeExplanation) {
      resultWithScopes = grammar.tokenizeLine(line, stateStack);
      tokensWithScopes = resultWithScopes.tokens;
      tokensWithScopesIndex = 0;
    }
    const result = grammar.tokenizeLine2(line, stateStack, tokenizeTimeLimit);
    const tokensLength = result.tokens.length / 2;
    for (let j = 0; j < tokensLength; j++) {
      const startIndex = result.tokens[2 * j];
      const nextStartIndex = j + 1 < tokensLength ? result.tokens[2 * j + 2] : line.length;
      if (startIndex === nextStartIndex)
        continue;
      const metadata = result.tokens[2 * j + 1];
      const color = applyColorReplacements(
        colorMap[EncodedTokenMetadata.getForeground(metadata)],
        colorReplacements
      );
      const fontStyle = EncodedTokenMetadata.getFontStyle(metadata);
      const token = {
        content: line.substring(startIndex, nextStartIndex),
        offset: lineOffset + startIndex,
        color,
        fontStyle
      };
      if (options.includeExplanation) {
        const themeSettingsSelectors = [];
        if (options.includeExplanation !== "scopeName") {
          for (const setting of theme.settings) {
            let selectors;
            switch (typeof setting.scope) {
              case "string":
                selectors = setting.scope.split(/,/).map((scope) => scope.trim());
                break;
              case "object":
                selectors = setting.scope;
                break;
              default:
                continue;
            }
            themeSettingsSelectors.push({
              settings: setting,
              selectors: selectors.map((selector) => selector.split(/ /))
            });
          }
        }
        token.explanation = [];
        let offset = 0;
        while (startIndex + offset < nextStartIndex) {
          const tokenWithScopes = tokensWithScopes[tokensWithScopesIndex];
          const tokenWithScopesText = line.substring(
            tokenWithScopes.startIndex,
            tokenWithScopes.endIndex
          );
          offset += tokenWithScopesText.length;
          token.explanation.push({
            content: tokenWithScopesText,
            scopes: options.includeExplanation === "scopeName" ? explainThemeScopesNameOnly(
              tokenWithScopes.scopes
            ) : explainThemeScopesFull(
              themeSettingsSelectors,
              tokenWithScopes.scopes
            )
          });
          tokensWithScopesIndex += 1;
        }
      }
      actual.push(token);
    }
    final.push(actual);
    actual = [];
    stateStack = result.ruleStack;
  }
  return {
    tokens: final,
    stateStack
  };
}
function explainThemeScopesNameOnly(scopes) {
  return scopes.map((scope) => ({ scopeName: scope }));
}
function explainThemeScopesFull(themeSelectors, scopes) {
  const result = [];
  for (let i = 0, len = scopes.length; i < len; i++) {
    const scope = scopes[i];
    result[i] = {
      scopeName: scope,
      themeMatches: explainThemeScope(themeSelectors, scope, scopes.slice(0, i))
    };
  }
  return result;
}
function matchesOne(selector, scope) {
  return selector === scope || scope.substring(0, selector.length) === selector && scope[selector.length] === ".";
}
function matches(selectors, scope, parentScopes) {
  if (!matchesOne(selectors[selectors.length - 1], scope))
    return false;
  let selectorParentIndex = selectors.length - 2;
  let parentIndex = parentScopes.length - 1;
  while (selectorParentIndex >= 0 && parentIndex >= 0) {
    if (matchesOne(selectors[selectorParentIndex], parentScopes[parentIndex]))
      selectorParentIndex -= 1;
    parentIndex -= 1;
  }
  if (selectorParentIndex === -1)
    return true;
  return false;
}
function explainThemeScope(themeSettingsSelectors, scope, parentScopes) {
  const result = [];
  for (const { selectors, settings } of themeSettingsSelectors) {
    for (const selectorPieces of selectors) {
      if (matches(selectorPieces, scope, parentScopes)) {
        result.push(settings);
        break;
      }
    }
  }
  return result;
}

function codeToTokensWithThemes(internal, code, options) {
  const themes = Object.entries(options.themes).filter((i) => i[1]).map((i) => ({ color: i[0], theme: i[1] }));
  const tokens = syncThemesTokenization(
    ...themes.map((t) => codeToTokensBase(internal, code, {
      ...options,
      theme: t.theme
    }))
  );
  const mergedTokens = tokens[0].map(
    (line, lineIdx) => line.map((_token, tokenIdx) => {
      const mergedToken = {
        content: _token.content,
        variants: {},
        offset: _token.offset
      };
      if ("includeExplanation" in options && options.includeExplanation) {
        mergedToken.explanation = _token.explanation;
      }
      tokens.forEach((t, themeIdx) => {
        const {
          content: _,
          explanation: __,
          offset: ___,
          ...styles
        } = t[lineIdx][tokenIdx];
        mergedToken.variants[themes[themeIdx].color] = styles;
      });
      return mergedToken;
    })
  );
  return mergedTokens;
}
function syncThemesTokenization(...themes) {
  const outThemes = themes.map(() => []);
  const count = themes.length;
  for (let i = 0; i < themes[0].length; i++) {
    const lines = themes.map((t) => t[i]);
    const outLines = outThemes.map(() => []);
    outThemes.forEach((t, i2) => t.push(outLines[i2]));
    const indexes = lines.map(() => 0);
    const current = lines.map((l) => l[0]);
    while (current.every((t) => t)) {
      const minLength = Math.min(...current.map((t) => t.content.length));
      for (let n = 0; n < count; n++) {
        const token = current[n];
        if (token.content.length === minLength) {
          outLines[n].push(token);
          indexes[n] += 1;
          current[n] = lines[n][indexes[n]];
        } else {
          outLines[n].push({
            ...token,
            content: token.content.slice(0, minLength)
          });
          current[n] = {
            ...token,
            content: token.content.slice(minLength),
            offset: token.offset + minLength
          };
        }
      }
    }
  }
  return outThemes;
}

function codeToTokens(internal, code, options) {
  let bg;
  let fg;
  let tokens;
  let themeName;
  let rootStyle;
  if ("themes" in options) {
    const {
      defaultColor = "light",
      cssVariablePrefix = "--shiki-"
    } = options;
    const themes = Object.entries(options.themes).filter((i) => i[1]).map((i) => ({ color: i[0], theme: i[1] })).sort((a, b) => a.color === defaultColor ? -1 : b.color === defaultColor ? 1 : 0);
    if (themes.length === 0)
      throw new ShikiError("`themes` option must not be empty");
    const themeTokens = codeToTokensWithThemes(
      internal,
      code,
      options
    );
    if (defaultColor && !themes.find((t) => t.color === defaultColor))
      throw new ShikiError(`\`themes\` option must contain the defaultColor key \`${defaultColor}\``);
    const themeRegs = themes.map((t) => internal.getTheme(t.theme));
    const themesOrder = themes.map((t) => t.color);
    tokens = themeTokens.map((line) => line.map((token) => mergeToken(token, themesOrder, cssVariablePrefix, defaultColor)));
    const themeColorReplacements = themes.map((t) => resolveColorReplacements(t.theme, options));
    fg = themes.map((t, idx) => (idx === 0 && defaultColor ? "" : `${cssVariablePrefix + t.color}:`) + (applyColorReplacements(themeRegs[idx].fg, themeColorReplacements[idx]) || "inherit")).join(";");
    bg = themes.map((t, idx) => (idx === 0 && defaultColor ? "" : `${cssVariablePrefix + t.color}-bg:`) + (applyColorReplacements(themeRegs[idx].bg, themeColorReplacements[idx]) || "inherit")).join(";");
    themeName = `shiki-themes ${themeRegs.map((t) => t.name).join(" ")}`;
    rootStyle = defaultColor ? void 0 : [fg, bg].join(";");
  } else if ("theme" in options) {
    const colorReplacements = resolveColorReplacements(options.theme, options);
    tokens = codeToTokensBase(
      internal,
      code,
      options
    );
    const _theme = internal.getTheme(options.theme);
    bg = applyColorReplacements(_theme.bg, colorReplacements);
    fg = applyColorReplacements(_theme.fg, colorReplacements);
    themeName = _theme.name;
  } else {
    throw new ShikiError("Invalid options, either `theme` or `themes` must be provided");
  }
  return {
    tokens,
    fg,
    bg,
    themeName,
    rootStyle
  };
}
function mergeToken(merged, variantsOrder, cssVariablePrefix, defaultColor) {
  const token = {
    content: merged.content,
    explanation: merged.explanation,
    offset: merged.offset
  };
  const styles = variantsOrder.map((t) => getTokenStyleObject(merged.variants[t]));
  const styleKeys = new Set(styles.flatMap((t) => Object.keys(t)));
  const mergedStyles = {};
  styles.forEach((cur, idx) => {
    for (const key of styleKeys) {
      const value = cur[key] || "inherit";
      if (idx === 0 && defaultColor) {
        mergedStyles[key] = value;
      } else {
        const keyName = key === "color" ? "" : key === "background-color" ? "-bg" : `-${key}`;
        const varKey = cssVariablePrefix + variantsOrder[idx] + (key === "color" ? "" : keyName);
        mergedStyles[varKey] = value;
      }
    }
  });
  token.htmlStyle = mergedStyles;
  return token;
}

function codeToHast(internal, code, options, transformerContext = {
  meta: {},
  options,
  codeToHast: (_code, _options) => codeToHast(internal, _code, _options),
  codeToTokens: (_code, _options) => codeToTokens(internal, _code, _options)
}) {
  let input = code;
  for (const transformer of getTransformers(options))
    input = transformer.preprocess?.call(transformerContext, input, options) || input;
  let {
    tokens,
    fg,
    bg,
    themeName,
    rootStyle
  } = codeToTokens(internal, input, options);
  const {
    mergeWhitespaces = true
  } = options;
  if (mergeWhitespaces === true)
    tokens = mergeWhitespaceTokens(tokens);
  else if (mergeWhitespaces === "never")
    tokens = splitWhitespaceTokens(tokens);
  const contextSource = {
    ...transformerContext,
    get source() {
      return input;
    }
  };
  for (const transformer of getTransformers(options))
    tokens = transformer.tokens?.call(contextSource, tokens) || tokens;
  return tokensToHast(
    tokens,
    {
      ...options,
      fg,
      bg,
      themeName,
      rootStyle
    },
    contextSource
  );
}
function tokensToHast(tokens, options, transformerContext) {
  const transformers = getTransformers(options);
  const lines = [];
  const root = {
    type: "root",
    children: []
  };
  const {
    structure = "classic",
    tabindex = "0"
  } = options;
  let preNode = {
    type: "element",
    tagName: "pre",
    properties: {
      class: `shiki ${options.themeName || ""}`,
      style: options.rootStyle || `background-color:${options.bg};color:${options.fg}`,
      ...tabindex !== false && tabindex != null ? {
        tabindex: tabindex.toString()
      } : {},
      ...Object.fromEntries(
        Array.from(
          Object.entries(options.meta || {})
        ).filter(([key]) => !key.startsWith("_"))
      )
    },
    children: []
  };
  let codeNode = {
    type: "element",
    tagName: "code",
    properties: {},
    children: lines
  };
  const lineNodes = [];
  const context = {
    ...transformerContext,
    structure,
    addClassToHast,
    get source() {
      return transformerContext.source;
    },
    get tokens() {
      return tokens;
    },
    get options() {
      return options;
    },
    get root() {
      return root;
    },
    get pre() {
      return preNode;
    },
    get code() {
      return codeNode;
    },
    get lines() {
      return lineNodes;
    }
  };
  tokens.forEach((line, idx) => {
    if (idx) {
      if (structure === "inline")
        root.children.push({ type: "element", tagName: "br", properties: {}, children: [] });
      else if (structure === "classic")
        lines.push({ type: "text", value: "\n" });
    }
    let lineNode = {
      type: "element",
      tagName: "span",
      properties: { class: "line" },
      children: []
    };
    let col = 0;
    for (const token of line) {
      let tokenNode = {
        type: "element",
        tagName: "span",
        properties: {
          ...token.htmlAttrs
        },
        children: [{ type: "text", value: token.content }]
      };
      if (typeof token.htmlStyle === "string")
        ;
      const style = stringifyTokenStyle(token.htmlStyle || getTokenStyleObject(token));
      if (style)
        tokenNode.properties.style = style;
      for (const transformer of transformers)
        tokenNode = transformer?.span?.call(context, tokenNode, idx + 1, col, lineNode, token) || tokenNode;
      if (structure === "inline")
        root.children.push(tokenNode);
      else if (structure === "classic")
        lineNode.children.push(tokenNode);
      col += token.content.length;
    }
    if (structure === "classic") {
      for (const transformer of transformers)
        lineNode = transformer?.line?.call(context, lineNode, idx + 1) || lineNode;
      lineNodes.push(lineNode);
      lines.push(lineNode);
    }
  });
  if (structure === "classic") {
    for (const transformer of transformers)
      codeNode = transformer?.code?.call(context, codeNode) || codeNode;
    preNode.children.push(codeNode);
    for (const transformer of transformers)
      preNode = transformer?.pre?.call(context, preNode) || preNode;
    root.children.push(preNode);
  }
  let result = root;
  for (const transformer of transformers)
    result = transformer?.root?.call(context, result) || result;
  return result;
}
function mergeWhitespaceTokens(tokens) {
  return tokens.map((line) => {
    const newLine = [];
    let carryOnContent = "";
    let firstOffset = 0;
    line.forEach((token, idx) => {
      const isUnderline = token.fontStyle && token.fontStyle & FontStyle.Underline;
      const couldMerge = !isUnderline;
      if (couldMerge && token.content.match(/^\s+$/) && line[idx + 1]) {
        if (!firstOffset)
          firstOffset = token.offset;
        carryOnContent += token.content;
      } else {
        if (carryOnContent) {
          if (couldMerge) {
            newLine.push({
              ...token,
              offset: firstOffset,
              content: carryOnContent + token.content
            });
          } else {
            newLine.push(
              {
                content: carryOnContent,
                offset: firstOffset
              },
              token
            );
          }
          firstOffset = 0;
          carryOnContent = "";
        } else {
          newLine.push(token);
        }
      }
    });
    return newLine;
  });
}
function splitWhitespaceTokens(tokens) {
  return tokens.map((line) => {
    return line.flatMap((token) => {
      if (token.content.match(/^\s+$/))
        return token;
      const match = token.content.match(/^(\s*)(.*?)(\s*)$/);
      if (!match)
        return token;
      const [, leading, content, trailing] = match;
      if (!leading && !trailing)
        return token;
      const expanded = [{
        ...token,
        offset: token.offset + leading.length,
        content
      }];
      if (leading) {
        expanded.unshift({
          content: leading,
          offset: token.offset
        });
      }
      if (trailing) {
        expanded.push({
          content: trailing,
          offset: token.offset + leading.length + content.length
        });
      }
      return expanded;
    });
  });
}

function codeToHtml(internal, code, options) {
  const context = {
    meta: {},
    options,
    codeToHast: (_code, _options) => codeToHast(internal, _code, _options),
    codeToTokens: (_code, _options) => codeToTokens(internal, _code, _options)
  };
  let result = toHtml(codeToHast(internal, code, options, context));
  for (const transformer of getTransformers(options))
    result = transformer.postprocess?.call(context, result, options) || result;
  return result;
}

const VSCODE_FALLBACK_EDITOR_FG = { light: "#333333", dark: "#bbbbbb" };
const VSCODE_FALLBACK_EDITOR_BG = { light: "#fffffe", dark: "#1e1e1e" };
const RESOLVED_KEY = "__shiki_resolved";
function normalizeTheme(rawTheme) {
  if (rawTheme?.[RESOLVED_KEY])
    return rawTheme;
  const theme = {
    ...rawTheme
  };
  if (theme.tokenColors && !theme.settings) {
    theme.settings = theme.tokenColors;
    delete theme.tokenColors;
  }
  theme.type || (theme.type = "dark");
  theme.colorReplacements = { ...theme.colorReplacements };
  theme.settings || (theme.settings = []);
  let { bg, fg } = theme;
  if (!bg || !fg) {
    const globalSetting = theme.settings ? theme.settings.find((s) => !s.name && !s.scope) : void 0;
    if (globalSetting?.settings?.foreground)
      fg = globalSetting.settings.foreground;
    if (globalSetting?.settings?.background)
      bg = globalSetting.settings.background;
    if (!fg && theme?.colors?.["editor.foreground"])
      fg = theme.colors["editor.foreground"];
    if (!bg && theme?.colors?.["editor.background"])
      bg = theme.colors["editor.background"];
    if (!fg)
      fg = theme.type === "light" ? VSCODE_FALLBACK_EDITOR_FG.light : VSCODE_FALLBACK_EDITOR_FG.dark;
    if (!bg)
      bg = theme.type === "light" ? VSCODE_FALLBACK_EDITOR_BG.light : VSCODE_FALLBACK_EDITOR_BG.dark;
    theme.fg = fg;
    theme.bg = bg;
  }
  if (!(theme.settings[0] && theme.settings[0].settings && !theme.settings[0].scope)) {
    theme.settings.unshift({
      settings: {
        foreground: theme.fg,
        background: theme.bg
      }
    });
  }
  let replacementCount = 0;
  const replacementMap = /* @__PURE__ */ new Map();
  function getReplacementColor(value) {
    if (replacementMap.has(value))
      return replacementMap.get(value);
    replacementCount += 1;
    const hex = `#${replacementCount.toString(16).padStart(8, "0").toLowerCase()}`;
    if (theme.colorReplacements?.[`#${hex}`])
      return getReplacementColor(value);
    replacementMap.set(value, hex);
    return hex;
  }
  theme.settings = theme.settings.map((setting) => {
    const replaceFg = setting.settings?.foreground && !setting.settings.foreground.startsWith("#");
    const replaceBg = setting.settings?.background && !setting.settings.background.startsWith("#");
    if (!replaceFg && !replaceBg)
      return setting;
    const clone = {
      ...setting,
      settings: {
        ...setting.settings
      }
    };
    if (replaceFg) {
      const replacement = getReplacementColor(setting.settings.foreground);
      theme.colorReplacements[replacement] = setting.settings.foreground;
      clone.settings.foreground = replacement;
    }
    if (replaceBg) {
      const replacement = getReplacementColor(setting.settings.background);
      theme.colorReplacements[replacement] = setting.settings.background;
      clone.settings.background = replacement;
    }
    return clone;
  });
  for (const key of Object.keys(theme.colors || {})) {
    if (key === "editor.foreground" || key === "editor.background" || key.startsWith("terminal.ansi")) {
      if (!theme.colors[key]?.startsWith("#")) {
        const replacement = getReplacementColor(theme.colors[key]);
        theme.colorReplacements[replacement] = theme.colors[key];
        theme.colors[key] = replacement;
      }
    }
  }
  Object.defineProperty(theme, RESOLVED_KEY, {
    enumerable: false,
    writable: false,
    value: true
  });
  return theme;
}

async function resolveLangs(langs) {
  return Array.from(new Set((await Promise.all(
    langs.filter((l) => !isSpecialLang(l)).map(async (lang) => await normalizeGetter(lang).then((r) => Array.isArray(r) ? r : [r]))
  )).flat()));
}
async function resolveThemes(themes) {
  const resolved = await Promise.all(
    themes.map(
      async (theme) => isSpecialTheme(theme) ? null : normalizeTheme(await normalizeGetter(theme))
    )
  );
  return resolved.filter((i) => !!i);
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Registry extends Registry$1 {
  constructor(_resolver, _themes, _langs, _alias = {}) {
    super(_resolver);
    this._resolver = _resolver;
    this._themes = _themes;
    this._langs = _langs;
    this._alias = _alias;
    __publicField$1(this, "_resolvedThemes", /* @__PURE__ */ new Map());
    __publicField$1(this, "_resolvedGrammars", /* @__PURE__ */ new Map());
    __publicField$1(this, "_langMap", /* @__PURE__ */ new Map());
    __publicField$1(this, "_langGraph", /* @__PURE__ */ new Map());
    __publicField$1(this, "_textmateThemeCache", /* @__PURE__ */ new WeakMap());
    __publicField$1(this, "_loadedThemesCache", null);
    __publicField$1(this, "_loadedLanguagesCache", null);
    this._themes.map((t) => this.loadTheme(t));
    this.loadLanguages(this._langs);
  }
  getTheme(theme) {
    if (typeof theme === "string")
      return this._resolvedThemes.get(theme);
    else
      return this.loadTheme(theme);
  }
  loadTheme(theme) {
    const _theme = normalizeTheme(theme);
    if (_theme.name) {
      this._resolvedThemes.set(_theme.name, _theme);
      this._loadedThemesCache = null;
    }
    return _theme;
  }
  getLoadedThemes() {
    if (!this._loadedThemesCache)
      this._loadedThemesCache = [...this._resolvedThemes.keys()];
    return this._loadedThemesCache;
  }
  // Override and re-implement this method to cache the textmate themes as `TextMateTheme.createFromRawTheme`
  // is expensive. Themes can switch often especially for dual-theme support.
  //
  // The parent class also accepts `colorMap` as the second parameter, but since we don't use that,
  // we omit here so it's easier to cache the themes.
  setTheme(theme) {
    let textmateTheme = this._textmateThemeCache.get(theme);
    if (!textmateTheme) {
      textmateTheme = Theme.createFromRawTheme(theme);
      this._textmateThemeCache.set(theme, textmateTheme);
    }
    this._syncRegistry.setTheme(textmateTheme);
  }
  getGrammar(name) {
    if (this._alias[name]) {
      const resolved = /* @__PURE__ */ new Set([name]);
      while (this._alias[name]) {
        name = this._alias[name];
        if (resolved.has(name))
          throw new ShikiError(`Circular alias \`${Array.from(resolved).join(" -> ")} -> ${name}\``);
        resolved.add(name);
      }
    }
    return this._resolvedGrammars.get(name);
  }
  loadLanguage(lang) {
    if (this.getGrammar(lang.name))
      return;
    const embeddedLazilyBy = new Set(
      [...this._langMap.values()].filter((i) => i.embeddedLangsLazy?.includes(lang.name))
    );
    this._resolver.addLanguage(lang);
    const grammarConfig = {
      balancedBracketSelectors: lang.balancedBracketSelectors || ["*"],
      unbalancedBracketSelectors: lang.unbalancedBracketSelectors || []
    };
    this._syncRegistry._rawGrammars.set(lang.scopeName, lang);
    const g = this.loadGrammarWithConfiguration(lang.scopeName, 1, grammarConfig);
    g.name = lang.name;
    this._resolvedGrammars.set(lang.name, g);
    if (lang.aliases) {
      lang.aliases.forEach((alias) => {
        this._alias[alias] = lang.name;
      });
    }
    this._loadedLanguagesCache = null;
    if (embeddedLazilyBy.size) {
      for (const e of embeddedLazilyBy) {
        this._resolvedGrammars.delete(e.name);
        this._loadedLanguagesCache = null;
        this._syncRegistry?._injectionGrammars?.delete(e.scopeName);
        this._syncRegistry?._grammars?.delete(e.scopeName);
        this.loadLanguage(this._langMap.get(e.name));
      }
    }
  }
  dispose() {
    super.dispose();
    this._resolvedThemes.clear();
    this._resolvedGrammars.clear();
    this._langMap.clear();
    this._langGraph.clear();
    this._loadedThemesCache = null;
  }
  loadLanguages(langs) {
    for (const lang of langs)
      this.resolveEmbeddedLanguages(lang);
    const langsGraphArray = Array.from(this._langGraph.entries());
    const missingLangs = langsGraphArray.filter(([_, lang]) => !lang);
    if (missingLangs.length) {
      const dependents = langsGraphArray.filter(([_, lang]) => lang && lang.embeddedLangs?.some((l) => missingLangs.map(([name]) => name).includes(l))).filter((lang) => !missingLangs.includes(lang));
      throw new ShikiError(`Missing languages ${missingLangs.map(([name]) => `\`${name}\``).join(", ")}, required by ${dependents.map(([name]) => `\`${name}\``).join(", ")}`);
    }
    for (const [_, lang] of langsGraphArray)
      this._resolver.addLanguage(lang);
    for (const [_, lang] of langsGraphArray)
      this.loadLanguage(lang);
  }
  getLoadedLanguages() {
    if (!this._loadedLanguagesCache) {
      this._loadedLanguagesCache = [
        .../* @__PURE__ */ new Set([...this._resolvedGrammars.keys(), ...Object.keys(this._alias)])
      ];
    }
    return this._loadedLanguagesCache;
  }
  resolveEmbeddedLanguages(lang) {
    this._langMap.set(lang.name, lang);
    this._langGraph.set(lang.name, lang);
    if (lang.embeddedLangs) {
      for (const embeddedLang of lang.embeddedLangs)
        this._langGraph.set(embeddedLang, this._langMap.get(embeddedLang));
    }
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Resolver {
  constructor(engine, langs) {
    __publicField(this, "_langs", /* @__PURE__ */ new Map());
    __publicField(this, "_scopeToLang", /* @__PURE__ */ new Map());
    __publicField(this, "_injections", /* @__PURE__ */ new Map());
    __publicField(this, "_onigLib");
    this._onigLib = {
      createOnigScanner: (patterns) => engine.createScanner(patterns),
      createOnigString: (s) => engine.createString(s)
    };
    langs.forEach((i) => this.addLanguage(i));
  }
  get onigLib() {
    return this._onigLib;
  }
  getLangRegistration(langIdOrAlias) {
    return this._langs.get(langIdOrAlias);
  }
  loadGrammar(scopeName) {
    return this._scopeToLang.get(scopeName);
  }
  addLanguage(l) {
    this._langs.set(l.name, l);
    if (l.aliases) {
      l.aliases.forEach((a) => {
        this._langs.set(a, l);
      });
    }
    this._scopeToLang.set(l.scopeName, l);
    if (l.injectTo) {
      l.injectTo.forEach((i) => {
        if (!this._injections.get(i))
          this._injections.set(i, []);
        this._injections.get(i).push(l.scopeName);
      });
    }
  }
  getInjections(scopeName) {
    const scopeParts = scopeName.split(".");
    let injections = [];
    for (let i = 1; i <= scopeParts.length; i++) {
      const subScopeName = scopeParts.slice(0, i).join(".");
      injections = [...injections, ...this._injections.get(subScopeName) || []];
    }
    return injections;
  }
}

let instancesCount = 0;
function createShikiInternalSync(options) {
  instancesCount += 1;
  if (options.warnings !== false && instancesCount >= 10 && instancesCount % 10 === 0)
    console.warn(`[Shiki] ${instancesCount} instances have been created. Shiki is supposed to be used as a singleton, consider refactoring your code to cache your highlighter instance; Or call \`highlighter.dispose()\` to release unused instances.`);
  let isDisposed = false;
  if (!options.engine)
    throw new ShikiError("`engine` option is required for synchronous mode");
  const langs = (options.langs || []).flat(1);
  const themes = (options.themes || []).flat(1).map(normalizeTheme);
  const resolver = new Resolver(options.engine, langs);
  const _registry = new Registry(resolver, themes, langs, options.langAlias);
  let _lastTheme;
  function getLanguage(name) {
    ensureNotDisposed();
    const _lang = _registry.getGrammar(typeof name === "string" ? name : name.name);
    if (!_lang)
      throw new ShikiError(`Language \`${name}\` not found, you may need to load it first`);
    return _lang;
  }
  function getTheme(name) {
    if (name === "none")
      return { bg: "", fg: "", name: "none", settings: [], type: "dark" };
    ensureNotDisposed();
    const _theme = _registry.getTheme(name);
    if (!_theme)
      throw new ShikiError(`Theme \`${name}\` not found, you may need to load it first`);
    return _theme;
  }
  function setTheme(name) {
    ensureNotDisposed();
    const theme = getTheme(name);
    if (_lastTheme !== name) {
      _registry.setTheme(theme);
      _lastTheme = name;
    }
    const colorMap = _registry.getColorMap();
    return {
      theme,
      colorMap
    };
  }
  function getLoadedThemes() {
    ensureNotDisposed();
    return _registry.getLoadedThemes();
  }
  function getLoadedLanguages() {
    ensureNotDisposed();
    return _registry.getLoadedLanguages();
  }
  function loadLanguageSync(...langs2) {
    ensureNotDisposed();
    _registry.loadLanguages(langs2.flat(1));
  }
  async function loadLanguage(...langs2) {
    return loadLanguageSync(await resolveLangs(langs2));
  }
  function loadThemeSync(...themes2) {
    ensureNotDisposed();
    for (const theme of themes2.flat(1)) {
      _registry.loadTheme(theme);
    }
  }
  async function loadTheme(...themes2) {
    ensureNotDisposed();
    return loadThemeSync(await resolveThemes(themes2));
  }
  function ensureNotDisposed() {
    if (isDisposed)
      throw new ShikiError("Shiki instance has been disposed");
  }
  function dispose() {
    if (isDisposed)
      return;
    isDisposed = true;
    _registry.dispose();
    instancesCount -= 1;
  }
  return {
    setTheme,
    getTheme,
    getLanguage,
    getLoadedThemes,
    getLoadedLanguages,
    loadLanguage,
    loadLanguageSync,
    loadTheme,
    loadThemeSync,
    dispose,
    [Symbol.dispose]: dispose
  };
}

async function createShikiInternal(options = {}) {
  if (options.loadWasm) ;
  const [
    themes,
    langs,
    engine
  ] = await Promise.all([
    resolveThemes(options.themes || []),
    resolveLangs(options.langs || []),
    options.engine || createOnigurumaEngine(options.loadWasm || getDefaultWasmLoader())
  ]);
  return createShikiInternalSync({
    ...options,
    loadWasm: void 0,
    themes,
    langs,
    engine
  });
}

async function createHighlighterCore(options = {}) {
  const internal = await createShikiInternal(options);
  return {
    getLastGrammarState: (code, options2) => getLastGrammarState(internal, code, options2),
    codeToTokensBase: (code, options2) => codeToTokensBase(internal, code, options2),
    codeToTokensWithThemes: (code, options2) => codeToTokensWithThemes(internal, code, options2),
    codeToTokens: (code, options2) => codeToTokens(internal, code, options2),
    codeToHast: (code, options2) => codeToHast(internal, code, options2),
    codeToHtml: (code, options2) => codeToHtml(internal, code, options2),
    ...internal,
    getInternalContext: () => internal
  };
}

function textmateThemeToMonacoTheme(theme) {
  let rules = "rules" in theme ? theme.rules : void 0;
  if (!rules) {
    rules = [];
    const themeSettings = theme.settings || theme.tokenColors;
    for (const { scope, settings } of themeSettings) {
      const scopes = Array.isArray(scope) ? scope : [scope];
      for (const s of scopes) {
        if (settings.foreground && s) {
          rules.push({
            token: s,
            foreground: normalizeColor(settings.foreground)
          });
        }
      }
    }
  }
  const colors = Object.fromEntries(
    Object.entries(theme.colors || {}).map(([key, value]) => [key, `#${normalizeColor(value)}`])
  );
  return {
    base: theme.type === "light" ? "vs" : "vs-dark",
    inherit: false,
    colors,
    rules
  };
}
function shikiToMonaco(highlighter, monaco, options = {}) {
  const themeMap = /* @__PURE__ */ new Map();
  const themeIds = highlighter.getLoadedThemes();
  for (const themeId of themeIds) {
    const tmTheme = highlighter.getTheme(themeId);
    const monacoTheme = textmateThemeToMonacoTheme(tmTheme);
    themeMap.set(themeId, monacoTheme);
    monaco.editor.defineTheme(themeId, monacoTheme);
  }
  const colorMap = [];
  const colorToScopeMap = /* @__PURE__ */ new Map();
  const _setTheme = monaco.editor.setTheme.bind(monaco.editor);
  monaco.editor.setTheme = (themeName) => {
    const ret = highlighter.setTheme(themeName);
    const theme = themeMap.get(themeName);
    colorMap.length = ret.colorMap.length;
    ret.colorMap.forEach((color, i) => {
      colorMap[i] = color;
    });
    colorToScopeMap.clear();
    theme?.rules.forEach((rule) => {
      const c = normalizeColor(rule.foreground);
      if (c && !colorToScopeMap.has(c))
        colorToScopeMap.set(c, rule.token);
    });
    _setTheme(themeName);
  };
  monaco.editor.setTheme(themeIds[0]);
  function findScopeByColor(color) {
    return colorToScopeMap.get(color);
  }
  const {
    tokenizeMaxLineLength = 2e4,
    tokenizeTimeLimit = 500
  } = options;
  const monacoLanguageIds = new Set(monaco.languages.getLanguages().map((l) => l.id));
  for (const lang of highlighter.getLoadedLanguages()) {
    if (monacoLanguageIds.has(lang)) {
      monaco.languages.setTokensProvider(lang, {
        getInitialState() {
          return new TokenizerState(INITIAL);
        },
        tokenize(line, state) {
          if (line.length >= tokenizeMaxLineLength) {
            return {
              endState: state,
              tokens: [{ startIndex: 0, scopes: "" }]
            };
          }
          const grammar = highlighter.getLanguage(lang);
          const result = grammar.tokenizeLine2(line, state.ruleStack, tokenizeTimeLimit);
          if (result.stoppedEarly)
            console.warn(`Time limit reached when tokenizing line: ${line.substring(0, 100)}`);
          const tokensLength = result.tokens.length / 2;
          const tokens = [];
          for (let j = 0; j < tokensLength; j++) {
            const startIndex = result.tokens[2 * j];
            const metadata = result.tokens[2 * j + 1];
            const color = normalizeColor(colorMap[EncodedTokenMetadata.getForeground(metadata)] || "");
            const scope = findScopeByColor(color) || "";
            tokens.push({ startIndex, scopes: scope });
          }
          return { endState: new TokenizerState(result.ruleStack), tokens };
        }
      });
    }
  }
}
class TokenizerState {
  constructor(_ruleStack) {
    this._ruleStack = _ruleStack;
  }
  get ruleStack() {
    return this._ruleStack;
  }
  clone() {
    return new TokenizerState(this._ruleStack);
  }
  equals(other) {
    if (!other || !(other instanceof TokenizerState) || other !== this || other._ruleStack !== this._ruleStack) {
      return false;
    }
    return true;
  }
}
function normalizeColor(color) {
  if (!color)
    return color;
  color = (color.charCodeAt(0) === 35 ? color.slice(1) : color).toLowerCase();
  if (color.length === 3 || color.length === 4)
    color = color.split("").map((c) => c + c).join("");
  return color;
}

const lang$a = Object.freeze(JSON.parse("{\"displayName\":\"JavaScript\",\"name\":\"javascript\",\"patterns\":[{\"include\":\"#directives\"},{\"include\":\"#statements\"},{\"include\":\"#shebang\"}],\"repository\":{\"access-modifier\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(abstract|declare|override|public|protected|private|readonly|static)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"storage.modifier.js\"},\"after-operator-block-as-object-literal\":{\"begin\":\"(?<!\\\\+\\\\+|--)(?<=[:=(,\\\\[?+!>]|^await|[^\\\\._$0-9A-Za-z]await|^return|[^\\\\._$0-9A-Za-z]return|^yield|[^\\\\._$0-9A-Za-z]yield|^throw|[^\\\\._$0-9A-Za-z]throw|^in|[^\\\\._$0-9A-Za-z]in|^of|[^\\\\._$0-9A-Za-z]of|^typeof|[^\\\\._$0-9A-Za-z]typeof|&&|\\\\|\\\\||\\\\*)\\\\s*(\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.block.js\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"name\":\"meta.objectliteral.js\",\"patterns\":[{\"include\":\"#object-member\"}]},\"array-binding-pattern\":{\"begin\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\[)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.js\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.array.js\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.array.js\"}},\"patterns\":[{\"include\":\"#binding-element\"},{\"include\":\"#punctuation-comma\"}]},\"array-binding-pattern-const\":{\"begin\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\[)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.js\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.array.js\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.array.js\"}},\"patterns\":[{\"include\":\"#binding-element-const\"},{\"include\":\"#punctuation-comma\"}]},\"array-literal\":{\"begin\":\"\\\\s*(\\\\[)\",\"beginCaptures\":{\"1\":{\"name\":\"meta.brace.square.js\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.square.js\"}},\"name\":\"meta.array.literal.js\",\"patterns\":[{\"include\":\"#expression\"},{\"include\":\"#punctuation-comma\"}]},\"arrow-function\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"storage.modifier.async.js\"},\"2\":{\"name\":\"variable.parameter.js\"}},\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(\\\\basync)\\\\s+)?([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?==>)\",\"name\":\"meta.arrow.js\"},{\"begin\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(\\\\basync))?((?<![})!\\\\]])\\\\s*(?=((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|([<]\\\\s*[_$A-Za-z][_$0-9A-Za-z]*\\\\s+extends\\\\s*[^=>])|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>)))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.js\"}},\"end\":\"(?==>|\\\\{|(^\\\\s*(export|function|class|interface|let|var|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|const|import|enum|namespace|module|type|abstract|declare)\\\\s+))\",\"name\":\"meta.arrow.js\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#type-parameters\"},{\"include\":\"#function-parameters\"},{\"include\":\"#arrow-return-type\"},{\"include\":\"#possibly-arrow-return-type\"}]},{\"begin\":\"=>\",\"beginCaptures\":{\"0\":{\"name\":\"storage.type.function.arrow.js\"}},\"end\":\"((?<=\\\\}|\\\\S)(?<!=>)|((?!\\\\{)(?=\\\\S)))(?!\\\\/[\\\\/\\\\*])\",\"name\":\"meta.arrow.js\",\"patterns\":[{\"include\":\"#single-line-comment-consuming-line-ending\"},{\"include\":\"#decl-block\"},{\"include\":\"#expression\"}]}]},\"arrow-return-type\":{\"begin\":\"(?<=\\\\))\\\\s*(:)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.type.annotation.js\"}},\"end\":\"(?==>|\\\\{|(^\\\\s*(export|function|class|interface|let|var|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|const|import|enum|namespace|module|type|abstract|declare)\\\\s+))\",\"name\":\"meta.return.type.arrow.js\",\"patterns\":[{\"include\":\"#arrow-return-type-body\"}]},\"arrow-return-type-body\":{\"patterns\":[{\"begin\":\"(?<=[:])(?=\\\\s*\\\\{)\",\"end\":\"(?<=\\\\})\",\"patterns\":[{\"include\":\"#type-object\"}]},{\"include\":\"#type-predicate-operator\"},{\"include\":\"#type\"}]},\"async-modifier\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(async)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"storage.modifier.async.js\"},\"binding-element\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"include\":\"#numeric-literal\"},{\"include\":\"#regex\"},{\"include\":\"#object-binding-pattern\"},{\"include\":\"#array-binding-pattern\"},{\"include\":\"#destructuring-variable-rest\"},{\"include\":\"#variable-initializer\"}]},\"binding-element-const\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"include\":\"#numeric-literal\"},{\"include\":\"#regex\"},{\"include\":\"#object-binding-pattern-const\"},{\"include\":\"#array-binding-pattern-const\"},{\"include\":\"#destructuring-variable-rest-const\"},{\"include\":\"#variable-initializer\"}]},\"boolean-literal\":{\"patterns\":[{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))true(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"constant.language.boolean.true.js\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))false(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"constant.language.boolean.false.js\"}]},\"brackets\":{\"patterns\":[{\"begin\":\"{\",\"end\":\"}|(?=\\\\*/)\",\"patterns\":[{\"include\":\"#brackets\"}]},{\"begin\":\"\\\\[\",\"end\":\"\\\\]|(?=\\\\*/)\",\"patterns\":[{\"include\":\"#brackets\"}]}]},\"cast\":{\"patterns\":[{\"include\":\"#jsx\"}]},\"class-declaration\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(?:(abstract)\\\\s+)?\\\\b(class)\\\\b(?=\\\\s+|/[/*])\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"storage.modifier.js\"},\"4\":{\"name\":\"storage.type.class.js\"}},\"end\":\"(?<=\\\\})\",\"name\":\"meta.class.js\",\"patterns\":[{\"include\":\"#class-declaration-or-expression-patterns\"}]},\"class-declaration-or-expression-patterns\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#class-or-interface-heritage\"},{\"captures\":{\"0\":{\"name\":\"entity.name.type.class.js\"}},\"match\":\"[_$A-Za-z][_$0-9A-Za-z]*\"},{\"include\":\"#type-parameters\"},{\"include\":\"#class-or-interface-body\"}]},\"class-expression\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(abstract)\\\\s+)?(class)\\\\b(?=\\\\s+|[<{]|\\\\/[\\\\/*])\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.js\"},\"2\":{\"name\":\"storage.type.class.js\"}},\"end\":\"(?<=\\\\})\",\"name\":\"meta.class.js\",\"patterns\":[{\"include\":\"#class-declaration-or-expression-patterns\"}]},\"class-or-interface-body\":{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#decorator\"},{\"begin\":\"(?<=:)\\\\s*\",\"end\":\"(?=\\\\s|[;),}\\\\]:\\\\-+]|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"patterns\":[{\"include\":\"#expression\"}]},{\"include\":\"#method-declaration\"},{\"include\":\"#indexer-declaration\"},{\"include\":\"#field-declaration\"},{\"include\":\"#string\"},{\"include\":\"#type-annotation\"},{\"include\":\"#variable-initializer\"},{\"include\":\"#access-modifier\"},{\"include\":\"#property-accessor\"},{\"include\":\"#async-modifier\"},{\"include\":\"#after-operator-block-as-object-literal\"},{\"include\":\"#decl-block\"},{\"include\":\"#expression\"},{\"include\":\"#punctuation-comma\"},{\"include\":\"#punctuation-semicolon\"}]},\"class-or-interface-heritage\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:\\\\b(extends|implements)\\\\b)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.js\"}},\"end\":\"(?=\\\\{)\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#class-or-interface-heritage\"},{\"include\":\"#type-parameters\"},{\"include\":\"#expressionWithoutIdentifiers\"},{\"captures\":{\"1\":{\"name\":\"entity.name.type.module.js\"},\"2\":{\"name\":\"punctuation.accessor.js\"},\"3\":{\"name\":\"punctuation.accessor.optional.js\"}},\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))(?=\\\\s*[_$A-Za-z][_$0-9A-Za-z]*(\\\\s*\\\\??\\\\.\\\\s*[_$A-Za-z][_$0-9A-Za-z]*)*\\\\s*)\"},{\"captures\":{\"1\":{\"name\":\"entity.other.inherited-class.js\"}},\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\"},{\"include\":\"#expressionPunctuations\"}]},\"comment\":{\"patterns\":[{\"begin\":\"/\\\\*\\\\*(?!/)\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.js\"}},\"end\":\"\\\\*/\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.js\"}},\"name\":\"comment.block.documentation.js\",\"patterns\":[{\"include\":\"#docblock\"}]},{\"begin\":\"(/\\\\*)(?:\\\\s*((@)internal)(?=\\\\s|(\\\\*/)))?\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.comment.js\"},\"2\":{\"name\":\"storage.type.internaldeclaration.js\"},\"3\":{\"name\":\"punctuation.decorator.internaldeclaration.js\"}},\"end\":\"\\\\*/\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.js\"}},\"name\":\"comment.block.js\"},{\"begin\":\"(^[ \\\\t]+)?((//)(?:\\\\s*((@)internal)(?=\\\\s|$))?)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.whitespace.comment.leading.js\"},\"2\":{\"name\":\"comment.line.double-slash.js\"},\"3\":{\"name\":\"punctuation.definition.comment.js\"},\"4\":{\"name\":\"storage.type.internaldeclaration.js\"},\"5\":{\"name\":\"punctuation.decorator.internaldeclaration.js\"}},\"contentName\":\"comment.line.double-slash.js\",\"end\":\"(?=$)\"}]},\"control-statement\":{\"patterns\":[{\"include\":\"#switch-statement\"},{\"include\":\"#for-loop\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(catch|finally|throw|try)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.control.trycatch.js\"},{\"captures\":{\"1\":{\"name\":\"keyword.control.loop.js\"},\"2\":{\"name\":\"entity.name.label.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(break|continue|goto)\\\\s+([_$A-Za-z][_$0-9A-Za-z]*)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(break|continue|do|goto|while)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.control.loop.js\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(return)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.control.flow.js\"}},\"end\":\"(?=[;}]|$|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"patterns\":[{\"include\":\"#expression\"}]},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(case|default|switch)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.control.switch.js\"},{\"include\":\"#if-statement\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(else|if)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.control.conditional.js\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(with)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.control.with.js\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(package)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.control.js\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(debugger)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.other.debugger.js\"}]},\"decl-block\":{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"name\":\"meta.block.js\",\"patterns\":[{\"include\":\"#statements\"}]},\"declaration\":{\"patterns\":[{\"include\":\"#decorator\"},{\"include\":\"#var-expr\"},{\"include\":\"#function-declaration\"},{\"include\":\"#class-declaration\"},{\"include\":\"#interface-declaration\"},{\"include\":\"#enum-declaration\"},{\"include\":\"#namespace-declaration\"},{\"include\":\"#type-alias-declaration\"},{\"include\":\"#import-equals-declaration\"},{\"include\":\"#import-declaration\"},{\"include\":\"#export-declaration\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(declare|export)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"storage.modifier.js\"}]},\"decorator\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))\\\\@\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.decorator.js\"}},\"end\":\"(?=\\\\s)\",\"name\":\"meta.decorator.js\",\"patterns\":[{\"include\":\"#expression\"}]},\"destructuring-const\":{\"patterns\":[{\"begin\":\"(?<!=|:|^of|[^\\\\._$0-9A-Za-z]of|^in|[^\\\\._$0-9A-Za-z]in)\\\\s*(?=\\\\{)\",\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+))\",\"name\":\"meta.object-binding-pattern-variable.js\",\"patterns\":[{\"include\":\"#object-binding-pattern-const\"},{\"include\":\"#type-annotation\"},{\"include\":\"#comment\"}]},{\"begin\":\"(?<!=|:|^of|[^\\\\._$0-9A-Za-z]of|^in|[^\\\\._$0-9A-Za-z]in)\\\\s*(?=\\\\[)\",\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+))\",\"name\":\"meta.array-binding-pattern-variable.js\",\"patterns\":[{\"include\":\"#array-binding-pattern-const\"},{\"include\":\"#type-annotation\"},{\"include\":\"#comment\"}]}]},\"destructuring-parameter\":{\"patterns\":[{\"begin\":\"(?<!=|:)\\\\s*(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.js\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.object.js\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.object.js\"}},\"name\":\"meta.parameter.object-binding-pattern.js\",\"patterns\":[{\"include\":\"#parameter-object-binding-element\"}]},{\"begin\":\"(?<!=|:)\\\\s*(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\[)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.js\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.array.js\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.array.js\"}},\"name\":\"meta.paramter.array-binding-pattern.js\",\"patterns\":[{\"include\":\"#parameter-binding-element\"},{\"include\":\"#punctuation-comma\"}]}]},\"destructuring-parameter-rest\":{\"captures\":{\"1\":{\"name\":\"keyword.operator.rest.js\"},\"2\":{\"name\":\"variable.parameter.js\"}},\"match\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?([_$A-Za-z][_$0-9A-Za-z]*)\"},\"destructuring-variable\":{\"patterns\":[{\"begin\":\"(?<!=|:|^of|[^\\\\._$0-9A-Za-z]of|^in|[^\\\\._$0-9A-Za-z]in)\\\\s*(?=\\\\{)\",\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+))\",\"name\":\"meta.object-binding-pattern-variable.js\",\"patterns\":[{\"include\":\"#object-binding-pattern\"},{\"include\":\"#type-annotation\"},{\"include\":\"#comment\"}]},{\"begin\":\"(?<!=|:|^of|[^\\\\._$0-9A-Za-z]of|^in|[^\\\\._$0-9A-Za-z]in)\\\\s*(?=\\\\[)\",\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+))\",\"name\":\"meta.array-binding-pattern-variable.js\",\"patterns\":[{\"include\":\"#array-binding-pattern\"},{\"include\":\"#type-annotation\"},{\"include\":\"#comment\"}]}]},\"destructuring-variable-rest\":{\"captures\":{\"1\":{\"name\":\"keyword.operator.rest.js\"},\"2\":{\"name\":\"meta.definition.variable.js variable.other.readwrite.js\"}},\"match\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?([_$A-Za-z][_$0-9A-Za-z]*)\"},\"destructuring-variable-rest-const\":{\"captures\":{\"1\":{\"name\":\"keyword.operator.rest.js\"},\"2\":{\"name\":\"meta.definition.variable.js variable.other.constant.js\"}},\"match\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?([_$A-Za-z][_$0-9A-Za-z]*)\"},\"directives\":{\"begin\":\"^(///)\\\\s*(?=<(reference|amd-dependency|amd-module)(\\\\s+(path|types|no-default-lib|lib|name|resolution-mode)\\\\s*=\\\\s*((\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)))+\\\\s*/>\\\\s*$)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.comment.js\"}},\"end\":\"(?=$)\",\"name\":\"comment.line.triple-slash.directive.js\",\"patterns\":[{\"begin\":\"(<)(reference|amd-dependency|amd-module)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.directive.js\"},\"2\":{\"name\":\"entity.name.tag.directive.js\"}},\"end\":\"/>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.directive.js\"}},\"name\":\"meta.tag.js\",\"patterns\":[{\"match\":\"path|types|no-default-lib|lib|name|resolution-mode\",\"name\":\"entity.other.attribute-name.directive.js\"},{\"match\":\"=\",\"name\":\"keyword.operator.assignment.js\"},{\"include\":\"#string\"}]}]},\"docblock\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"constant.language.access-type.jsdoc\"}},\"match\":\"((@)(?:access|api))\\\\s+(private|protected|public)\\\\b\"},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"entity.name.type.instance.jsdoc\"},\"4\":{\"name\":\"punctuation.definition.bracket.angle.begin.jsdoc\"},\"5\":{\"name\":\"constant.other.email.link.underline.jsdoc\"},\"6\":{\"name\":\"punctuation.definition.bracket.angle.end.jsdoc\"}},\"match\":\"((@)author)\\\\s+([^@\\\\s<>*/](?:[^@<>*/]|\\\\*[^/])*)(?:\\\\s*(<)([^>\\\\s]+)(>))?\"},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"entity.name.type.instance.jsdoc\"},\"4\":{\"name\":\"keyword.operator.control.jsdoc\"},\"5\":{\"name\":\"entity.name.type.instance.jsdoc\"}},\"match\":\"((@)borrows)\\\\s+((?:[^@\\\\s*/]|\\\\*[^/])+)\\\\s+(as)\\\\s+((?:[^@\\\\s*/]|\\\\*[^/])+)\"},{\"begin\":\"((@)example)\\\\s+\",\"beginCaptures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"}},\"end\":\"(?=@|\\\\*/)\",\"name\":\"meta.example.jsdoc\",\"patterns\":[{\"match\":\"^\\\\s\\\\*\\\\s+\"},{\"begin\":\"\\\\G(<)caption(>)\",\"beginCaptures\":{\"0\":{\"name\":\"entity.name.tag.inline.jsdoc\"},\"1\":{\"name\":\"punctuation.definition.bracket.angle.begin.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.bracket.angle.end.jsdoc\"}},\"contentName\":\"constant.other.description.jsdoc\",\"end\":\"(</)caption(>)|(?=\\\\*/)\",\"endCaptures\":{\"0\":{\"name\":\"entity.name.tag.inline.jsdoc\"},\"1\":{\"name\":\"punctuation.definition.bracket.angle.begin.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.bracket.angle.end.jsdoc\"}}},{\"captures\":{\"0\":{\"name\":\"source.embedded.js\"}},\"match\":\"[^\\\\s@*](?:[^*]|\\\\*[^/])*\"}]},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"constant.language.symbol-type.jsdoc\"}},\"match\":\"((@)kind)\\\\s+(class|constant|event|external|file|function|member|mixin|module|namespace|typedef)\\\\b\"},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"variable.other.link.underline.jsdoc\"},\"4\":{\"name\":\"entity.name.type.instance.jsdoc\"}},\"match\":\"((@)see)\\\\s+(?:((?=https?://)(?:[^\\\\s*]|\\\\*[^/])+)|((?!https?://|(?:\\\\[[^\\\\[\\\\]]*\\\\])?{@(?:link|linkcode|linkplain|tutorial)\\\\b)(?:[^@\\\\s*/]|\\\\*[^/])+))\"},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"variable.other.jsdoc\"}},\"match\":\"((@)template)\\\\s+([A-Za-z_$][\\\\w$.\\\\[\\\\]]*(?:\\\\s*,\\\\s*[A-Za-z_$][\\\\w$.\\\\[\\\\]]*)*)\"},{\"begin\":\"((@)template)\\\\s+(?={)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"}},\"end\":\"(?=\\\\s|\\\\*/|[^{}\\\\[\\\\]A-Za-z_$])\",\"patterns\":[{\"include\":\"#jsdoctype\"},{\"match\":\"([A-Za-z_$][\\\\w$.\\\\[\\\\]]*)\",\"name\":\"variable.other.jsdoc\"}]},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"variable.other.jsdoc\"}},\"match\":\"((@)(?:arg|argument|const|constant|member|namespace|param|var))\\\\s+([A-Za-z_$][\\\\w$.\\\\[\\\\]]*)\"},{\"begin\":\"((@)typedef)\\\\s+(?={)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"}},\"end\":\"(?=\\\\s|\\\\*/|[^{}\\\\[\\\\]A-Za-z_$])\",\"patterns\":[{\"include\":\"#jsdoctype\"},{\"match\":\"(?:[^@\\\\s*/]|\\\\*[^/])+\",\"name\":\"entity.name.type.instance.jsdoc\"}]},{\"begin\":\"((@)(?:arg|argument|const|constant|member|namespace|param|prop|property|var))\\\\s+(?={)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"}},\"end\":\"(?=\\\\s|\\\\*/|[^{}\\\\[\\\\]A-Za-z_$])\",\"patterns\":[{\"include\":\"#jsdoctype\"},{\"match\":\"([A-Za-z_$][\\\\w$.\\\\[\\\\]]*)\",\"name\":\"variable.other.jsdoc\"},{\"captures\":{\"1\":{\"name\":\"punctuation.definition.optional-value.begin.bracket.square.jsdoc\"},\"2\":{\"name\":\"keyword.operator.assignment.jsdoc\"},\"3\":{\"name\":\"source.embedded.js\"},\"4\":{\"name\":\"punctuation.definition.optional-value.end.bracket.square.jsdoc\"},\"5\":{\"name\":\"invalid.illegal.syntax.jsdoc\"}},\"match\":\"(\\\\[)\\\\s*[\\\\w$]+(?:(?:\\\\[\\\\])?\\\\.[\\\\w$]+)*(?:\\\\s*(=)\\\\s*((?>\\\"(?:(?:\\\\*(?!/))|(?:\\\\\\\\(?!\\\"))|[^*\\\\\\\\])*?\\\"|'(?:(?:\\\\*(?!/))|(?:\\\\\\\\(?!'))|[^*\\\\\\\\])*?'|\\\\[(?:(?:\\\\*(?!/))|[^*])*?\\\\]|(?:(?:\\\\*(?!/))|\\\\s(?!\\\\s*\\\\])|\\\\[.*?(?:\\\\]|(?=\\\\*/))|[^*\\\\s\\\\[\\\\]])*)*))?\\\\s*(?:(\\\\])((?:[^*\\\\s]|\\\\*[^\\\\s/])+)?|(?=\\\\*/))\",\"name\":\"variable.other.jsdoc\"}]},{\"begin\":\"((@)(?:define|enum|exception|export|extends|lends|implements|modifies|namespace|private|protected|returns?|satisfies|suppress|this|throws|type|yields?))\\\\s+(?={)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"}},\"end\":\"(?=\\\\s|\\\\*/|[^{}\\\\[\\\\]A-Za-z_$])\",\"patterns\":[{\"include\":\"#jsdoctype\"}]},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"entity.name.type.instance.jsdoc\"}},\"match\":\"((@)(?:alias|augments|callback|constructs|emits|event|fires|exports?|extends|external|function|func|host|lends|listens|interface|memberof!?|method|module|mixes|mixin|name|requires|see|this|typedef|uses))\\\\s+((?:[^{}@\\\\s*]|\\\\*[^/])+)\"},{\"begin\":\"((@)(?:default(?:value)?|license|version))\\\\s+(([''\\\"]))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"variable.other.jsdoc\"},\"4\":{\"name\":\"punctuation.definition.string.begin.jsdoc\"}},\"contentName\":\"variable.other.jsdoc\",\"end\":\"(\\\\3)|(?=$|\\\\*/)\",\"endCaptures\":{\"0\":{\"name\":\"variable.other.jsdoc\"},\"1\":{\"name\":\"punctuation.definition.string.end.jsdoc\"}}},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"variable.other.jsdoc\"}},\"match\":\"((@)(?:default(?:value)?|license|tutorial|variation|version))\\\\s+([^\\\\s*]+)\"},{\"captures\":{\"1\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"}},\"match\":\"(@)(?:abstract|access|alias|api|arg|argument|async|attribute|augments|author|beta|borrows|bubbles|callback|chainable|class|classdesc|code|config|const|constant|constructor|constructs|copyright|default|defaultvalue|define|deprecated|desc|description|dict|emits|enum|event|example|exception|exports?|extends|extension(?:_?for)?|external|externs|file|fileoverview|final|fires|for|func|function|generator|global|hideconstructor|host|ignore|implements|implicitCast|inherit[Dd]oc|inner|instance|interface|internal|kind|lends|license|listens|main|member|memberof!?|method|mixes|mixins?|modifies|module|name|namespace|noalias|nocollapse|nocompile|nosideeffects|override|overview|package|param|polymer(?:Behavior)?|preserve|private|prop|property|protected|public|read[Oo]nly|record|require[ds]|returns?|see|since|static|struct|submodule|summary|suppress|template|this|throws|todo|tutorial|type|typedef|unrestricted|uses|var|variation|version|virtual|writeOnce|yields?)\\\\b\",\"name\":\"storage.type.class.jsdoc\"},{\"include\":\"#inline-tags\"},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"}},\"match\":\"((@)(?:[_$A-Za-z][_$0-9A-Za-z]*))(?=\\\\s+)\"}]},\"enum-declaration\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?(?:\\\\b(const)\\\\s+)?\\\\b(enum)\\\\s+([_$A-Za-z][_$0-9A-Za-z]*)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"storage.modifier.js\"},\"4\":{\"name\":\"storage.type.enum.js\"},\"5\":{\"name\":\"entity.name.type.enum.js\"}},\"end\":\"(?<=\\\\})\",\"name\":\"meta.enum.declaration.js\",\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)\",\"beginCaptures\":{\"0\":{\"name\":\"variable.other.enummember.js\"}},\"end\":\"(?=,|\\\\}|$)\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#variable-initializer\"}]},{\"begin\":\"(?=((\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\])))\",\"end\":\"(?=,|\\\\}|$)\",\"patterns\":[{\"include\":\"#string\"},{\"include\":\"#array-literal\"},{\"include\":\"#comment\"},{\"include\":\"#variable-initializer\"}]},{\"include\":\"#punctuation-comma\"}]}]},\"export-declaration\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"keyword.control.as.js\"},\"3\":{\"name\":\"storage.type.namespace.js\"},\"4\":{\"name\":\"entity.name.type.module.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(export)\\\\s+(as)\\\\s+(namespace)\\\\s+([_$A-Za-z][_$0-9A-Za-z]*)\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(export)(?:\\\\s+(type))?(?:(?:\\\\s*(=))|(?:\\\\s+(default)(?=\\\\s+)))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"keyword.control.type.js\"},\"3\":{\"name\":\"keyword.operator.assignment.js\"},\"4\":{\"name\":\"keyword.control.default.js\"}},\"end\":\"(?=$|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"name\":\"meta.export.default.js\",\"patterns\":[{\"include\":\"#interface-declaration\"},{\"include\":\"#expression\"}]},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(export)(?:\\\\s+(type))?\\\\b(?!(\\\\$)|(\\\\s*:))((?=\\\\s*[{*])|((?=\\\\s*[_$A-Za-z][_$0-9A-Za-z]*(\\\\s|,))(?!\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b)))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"keyword.control.type.js\"}},\"end\":\"(?=$|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"name\":\"meta.export.js\",\"patterns\":[{\"include\":\"#import-export-declaration\"}]}]},\"expression\":{\"patterns\":[{\"include\":\"#expressionWithoutIdentifiers\"},{\"include\":\"#identifiers\"},{\"include\":\"#expressionPunctuations\"}]},\"expression-inside-possibly-arrow-parens\":{\"patterns\":[{\"include\":\"#expressionWithoutIdentifiers\"},{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"include\":\"#decorator\"},{\"include\":\"#destructuring-parameter\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(override|public|protected|private|readonly)\\\\s+(?=(override|public|protected|private|readonly)\\\\s+)\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.js\"},\"2\":{\"name\":\"keyword.operator.rest.js\"},\"3\":{\"name\":\"entity.name.function.js variable.language.this.js\"},\"4\":{\"name\":\"entity.name.function.js\"},\"5\":{\"name\":\"keyword.operator.optional.js\"}},\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(override|public|private|protected|readonly)\\\\s+)?(?:(\\\\.\\\\.\\\\.)\\\\s*)?(?<!=|:)(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*(\\\\??)(?=\\\\s*(=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|([<]\\\\s*[_$A-Za-z][_$0-9A-Za-z]*\\\\s+extends\\\\s*[^=>])|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>)))))|(:\\\\s*((<)|([(]\\\\s*(([)])|(\\\\.\\\\.\\\\.)|([_$0-9A-Za-z]+\\\\s*(([:,?=])|([)]\\\\s*=>)))))))|(:\\\\s*(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))Function(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|(:\\\\s*((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))))|(:\\\\s*(=>|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(<[^<>]*>)|[^<>(),=])+=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|([<]\\\\s*[_$A-Za-z][_$0-9A-Za-z]*\\\\s+extends\\\\s*[^=>])|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>))))))\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.js\"},\"2\":{\"name\":\"keyword.operator.rest.js\"},\"3\":{\"name\":\"variable.parameter.js variable.language.this.js\"},\"4\":{\"name\":\"variable.parameter.js\"},\"5\":{\"name\":\"keyword.operator.optional.js\"}},\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(override|public|private|protected|readonly)\\\\s+)?(?:(\\\\.\\\\.\\\\.)\\\\s*)?(?<!=|:)(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*(\\\\??)(?=\\\\s*[:,]|$)\"},{\"include\":\"#type-annotation\"},{\"include\":\"#variable-initializer\"},{\"match\":\",\",\"name\":\"punctuation.separator.parameter.js\"},{\"include\":\"#identifiers\"},{\"include\":\"#expressionPunctuations\"}]},\"expression-operators\":{\"patterns\":[{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(await)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.control.flow.js\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(yield)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))(?=\\\\s*\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*\\\\*)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.flow.js\"}},\"end\":\"\\\\*\",\"endCaptures\":{\"0\":{\"name\":\"keyword.generator.asterisk.js\"}},\"patterns\":[{\"include\":\"#comment\"}]},{\"captures\":{\"1\":{\"name\":\"keyword.control.flow.js\"},\"2\":{\"name\":\"keyword.generator.asterisk.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(yield)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))(?:\\\\s*(\\\\*))?\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))delete(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.operator.expression.delete.js\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))in(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))(?!\\\\()\",\"name\":\"keyword.operator.expression.in.js\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))of(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))(?!\\\\()\",\"name\":\"keyword.operator.expression.of.js\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))instanceof(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.operator.expression.instanceof.js\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))new(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.operator.new.js\"},{\"include\":\"#typeof-operator\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))void(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.operator.expression.void.js\"},{\"captures\":{\"1\":{\"name\":\"keyword.control.as.js\"},\"2\":{\"name\":\"storage.modifier.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(as)\\\\s+(const)(?=\\\\s*($|[;,:})\\\\]]))\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(as)|(satisfies))\\\\s+\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.as.js\"},\"2\":{\"name\":\"keyword.control.satisfies.js\"}},\"end\":\"(?=^|[;),}\\\\]:?\\\\-+>]|\\\\|\\\\||\\\\&\\\\&|!==|$|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(as|satisfies)\\\\s+)|(\\\\s+<))\",\"patterns\":[{\"include\":\"#type\"}]},{\"match\":\"\\\\.\\\\.\\\\.\",\"name\":\"keyword.operator.spread.js\"},{\"match\":\"\\\\*=|(?<!\\\\()/=|%=|\\\\+=|-=\",\"name\":\"keyword.operator.assignment.compound.js\"},{\"match\":\"\\\\&=|\\\\^=|<<=|>>=|>>>=|\\\\|=\",\"name\":\"keyword.operator.assignment.compound.bitwise.js\"},{\"match\":\"<<|>>>|>>\",\"name\":\"keyword.operator.bitwise.shift.js\"},{\"match\":\"===|!==|==|!=\",\"name\":\"keyword.operator.comparison.js\"},{\"match\":\"<=|>=|<>|<|>\",\"name\":\"keyword.operator.relational.js\"},{\"captures\":{\"1\":{\"name\":\"keyword.operator.logical.js\"},\"2\":{\"name\":\"keyword.operator.assignment.compound.js\"},\"3\":{\"name\":\"keyword.operator.arithmetic.js\"}},\"match\":\"(?<=[_$0-9A-Za-z])(!)\\\\s*(?:(/=)|(?:(/)(?![/*])))\"},{\"match\":\"!|&&|\\\\|\\\\||\\\\?\\\\?\",\"name\":\"keyword.operator.logical.js\"},{\"match\":\"\\\\&|~|\\\\^|\\\\|\",\"name\":\"keyword.operator.bitwise.js\"},{\"match\":\"=\",\"name\":\"keyword.operator.assignment.js\"},{\"match\":\"--\",\"name\":\"keyword.operator.decrement.js\"},{\"match\":\"\\\\+\\\\+\",\"name\":\"keyword.operator.increment.js\"},{\"match\":\"%|\\\\*|/|-|\\\\+\",\"name\":\"keyword.operator.arithmetic.js\"},{\"begin\":\"(?<=[_$0-9A-Za-z)\\\\]])\\\\s*(?=(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)+(?:(/=)|(?:(/)(?![/*]))))\",\"end\":\"(?:(/=)|(?:(/)(?!\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/)))\",\"endCaptures\":{\"1\":{\"name\":\"keyword.operator.assignment.compound.js\"},\"2\":{\"name\":\"keyword.operator.arithmetic.js\"}},\"patterns\":[{\"include\":\"#comment\"}]},{\"captures\":{\"1\":{\"name\":\"keyword.operator.assignment.compound.js\"},\"2\":{\"name\":\"keyword.operator.arithmetic.js\"}},\"match\":\"(?<=[_$0-9A-Za-z)\\\\]])\\\\s*(?:(/=)|(?:(/)(?![/*])))\"}]},\"expressionPunctuations\":{\"patterns\":[{\"include\":\"#punctuation-comma\"},{\"include\":\"#punctuation-accessor\"}]},\"expressionWithoutIdentifiers\":{\"patterns\":[{\"include\":\"#jsx\"},{\"include\":\"#string\"},{\"include\":\"#regex\"},{\"include\":\"#comment\"},{\"include\":\"#function-expression\"},{\"include\":\"#class-expression\"},{\"include\":\"#arrow-function\"},{\"include\":\"#paren-expression-possibly-arrow\"},{\"include\":\"#cast\"},{\"include\":\"#ternary-expression\"},{\"include\":\"#new-expr\"},{\"include\":\"#instanceof-expr\"},{\"include\":\"#object-literal\"},{\"include\":\"#expression-operators\"},{\"include\":\"#function-call\"},{\"include\":\"#literal\"},{\"include\":\"#support-objects\"},{\"include\":\"#paren-expression\"}]},\"field-declaration\":{\"begin\":\"(?<!\\\\()(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(readonly)\\\\s+)?(?=\\\\s*((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(?:(?:(\\\\?)|(!))\\\\s*)?(=|:|;|,|\\\\}|$))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.js\"}},\"end\":\"(?=\\\\}|;|,|$|(^(?!\\\\s*((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(?:(?:(\\\\?)|(!))\\\\s*)?(=|:|;|,|$))))|(?<=\\\\})\",\"name\":\"meta.field.declaration.js\",\"patterns\":[{\"include\":\"#variable-initializer\"},{\"include\":\"#type-annotation\"},{\"include\":\"#string\"},{\"include\":\"#array-literal\"},{\"include\":\"#numeric-literal\"},{\"include\":\"#comment\"},{\"captures\":{\"1\":{\"name\":\"meta.definition.property.js entity.name.function.js\"},\"2\":{\"name\":\"keyword.operator.optional.js\"},\"3\":{\"name\":\"keyword.operator.definiteassignment.js\"}},\"match\":\"(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*)(?:(\\\\?)|(!))?(?=\\\\s*\\\\s*(=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|([<]\\\\s*[_$A-Za-z][_$0-9A-Za-z]*\\\\s+extends\\\\s*[^=>])|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>)))))|(:\\\\s*((<)|([(]\\\\s*(([)])|(\\\\.\\\\.\\\\.)|([_$0-9A-Za-z]+\\\\s*(([:,?=])|([)]\\\\s*=>)))))))|(:\\\\s*(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))Function(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|(:\\\\s*((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))))|(:\\\\s*(=>|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(<[^<>]*>)|[^<>(),=])+=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|([<]\\\\s*[_$A-Za-z][_$0-9A-Za-z]*\\\\s+extends\\\\s*[^=>])|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>))))))\"},{\"match\":\"\\\\#?[_$A-Za-z][_$0-9A-Za-z]*\",\"name\":\"meta.definition.property.js variable.object.property.js\"},{\"match\":\"\\\\?\",\"name\":\"keyword.operator.optional.js\"},{\"match\":\"!\",\"name\":\"keyword.operator.definiteassignment.js\"}]},\"for-loop\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))for(?=((\\\\s+|(\\\\s*\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*))await)?\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)?(\\\\())\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.control.loop.js\"}},\"end\":\"(?<=\\\\))\",\"patterns\":[{\"include\":\"#comment\"},{\"match\":\"await\",\"name\":\"keyword.control.loop.js\"},{\"begin\":\"\\\\(\",\"beginCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"patterns\":[{\"include\":\"#var-expr\"},{\"include\":\"#expression\"},{\"include\":\"#punctuation-semicolon\"}]}]},\"function-body\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#type-parameters\"},{\"include\":\"#function-parameters\"},{\"include\":\"#return-type\"},{\"include\":\"#type-function-return-type\"},{\"include\":\"#decl-block\"},{\"match\":\"\\\\*\",\"name\":\"keyword.generator.asterisk.js\"}]},\"function-call\":{\"patterns\":[{\"begin\":\"(?=(((([_$A-Za-z][_$0-9A-Za-z]*)(\\\\s*\\\\??\\\\.\\\\s*(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))*)|(\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))|(?<=[)]))\\\\s*(?:(\\\\?\\\\.\\\\s*)|(!))?((<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))(([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>)*(?<!=)>))*(?<!=)>)*(?<!=)>\\\\s*)?\\\\())\",\"end\":\"(?<=\\\\))(?!(((([_$A-Za-z][_$0-9A-Za-z]*)(\\\\s*\\\\??\\\\.\\\\s*(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))*)|(\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))|(?<=[)]))\\\\s*(?:(\\\\?\\\\.\\\\s*)|(!))?((<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))(([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>)*(?<!=)>))*(?<!=)>)*(?<!=)>\\\\s*)?\\\\())\",\"patterns\":[{\"begin\":\"(?=(([_$A-Za-z][_$0-9A-Za-z]*)(\\\\s*\\\\??\\\\.\\\\s*(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))*)|(\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))\",\"end\":\"(?=\\\\s*(?:(\\\\?\\\\.\\\\s*)|(!))?((<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))(([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>)*(?<!=)>))*(?<!=)>)*(?<!=)>\\\\s*)?\\\\())\",\"name\":\"meta.function-call.js\",\"patterns\":[{\"include\":\"#function-call-target\"}]},{\"include\":\"#comment\"},{\"include\":\"#function-call-optionals\"},{\"include\":\"#type-arguments\"},{\"include\":\"#paren-expression\"}]},{\"begin\":\"(?=(((([_$A-Za-z][_$0-9A-Za-z]*)(\\\\s*\\\\??\\\\.\\\\s*(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))*)|(\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))|(?<=[)]))(<\\\\s*[{\\\\[(]\\\\s*$))\",\"end\":\"(?<=>)(?!(((([_$A-Za-z][_$0-9A-Za-z]*)(\\\\s*\\\\??\\\\.\\\\s*(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))*)|(\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))|(?<=[)]))(<\\\\s*[{\\\\[(]\\\\s*$))\",\"patterns\":[{\"begin\":\"(?=(([_$A-Za-z][_$0-9A-Za-z]*)(\\\\s*\\\\??\\\\.\\\\s*(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))*)|(\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))\",\"end\":\"(?=(<\\\\s*[{\\\\[(]\\\\s*$))\",\"name\":\"meta.function-call.js\",\"patterns\":[{\"include\":\"#function-call-target\"}]},{\"include\":\"#comment\"},{\"include\":\"#function-call-optionals\"},{\"include\":\"#type-arguments\"}]}]},\"function-call-optionals\":{\"patterns\":[{\"match\":\"\\\\?\\\\.\",\"name\":\"meta.function-call.js punctuation.accessor.optional.js\"},{\"match\":\"!\",\"name\":\"meta.function-call.js keyword.operator.definiteassignment.js\"}]},\"function-call-target\":{\"patterns\":[{\"include\":\"#support-function-call-identifiers\"},{\"match\":\"(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*)\",\"name\":\"entity.name.function.js\"}]},\"function-declaration\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?(?:(async)\\\\s+)?(function\\\\b)(?:\\\\s*(\\\\*))?(?:(?:\\\\s+|(?<=\\\\*))([_$A-Za-z][_$0-9A-Za-z]*))?\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"storage.modifier.async.js\"},\"4\":{\"name\":\"storage.type.function.js\"},\"5\":{\"name\":\"keyword.generator.asterisk.js\"},\"6\":{\"name\":\"meta.definition.function.js entity.name.function.js\"}},\"end\":\"(?=;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))|(?<=\\\\})\",\"name\":\"meta.function.js\",\"patterns\":[{\"include\":\"#function-name\"},{\"include\":\"#function-body\"}]},\"function-expression\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(async)\\\\s+)?(function\\\\b)(?:\\\\s*(\\\\*))?(?:(?:\\\\s+|(?<=\\\\*))([_$A-Za-z][_$0-9A-Za-z]*))?\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.js\"},\"2\":{\"name\":\"storage.type.function.js\"},\"3\":{\"name\":\"keyword.generator.asterisk.js\"},\"4\":{\"name\":\"meta.definition.function.js entity.name.function.js\"}},\"end\":\"(?=;)|(?<=\\\\})\",\"name\":\"meta.function.expression.js\",\"patterns\":[{\"include\":\"#function-name\"},{\"include\":\"#single-line-comment-consuming-line-ending\"},{\"include\":\"#function-body\"}]},\"function-name\":{\"match\":\"[_$A-Za-z][_$0-9A-Za-z]*\",\"name\":\"meta.definition.function.js entity.name.function.js\"},\"function-parameters\":{\"begin\":\"\\\\(\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.parameters.begin.js\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.parameters.end.js\"}},\"name\":\"meta.parameters.js\",\"patterns\":[{\"include\":\"#function-parameters-body\"}]},\"function-parameters-body\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"include\":\"#decorator\"},{\"include\":\"#destructuring-parameter\"},{\"include\":\"#parameter-name\"},{\"include\":\"#parameter-type-annotation\"},{\"include\":\"#variable-initializer\"},{\"match\":\",\",\"name\":\"punctuation.separator.parameter.js\"}]},\"identifiers\":{\"patterns\":[{\"include\":\"#object-identifiers\"},{\"captures\":{\"1\":{\"name\":\"punctuation.accessor.js\"},\"2\":{\"name\":\"punctuation.accessor.optional.js\"},\"3\":{\"name\":\"entity.name.function.js\"}},\"match\":\"(?:(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*)?([_$A-Za-z][_$0-9A-Za-z]*)(?=\\\\s*=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|([<]\\\\s*[_$A-Za-z][_$0-9A-Za-z]*\\\\s+extends\\\\s*[^=>])|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>)))))\"},{\"captures\":{\"1\":{\"name\":\"punctuation.accessor.js\"},\"2\":{\"name\":\"punctuation.accessor.optional.js\"},\"3\":{\"name\":\"variable.other.constant.property.js\"}},\"match\":\"(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*(\\\\#?[A-Z][_$\\\\dA-Z]*)(?![_$0-9A-Za-z])\"},{\"captures\":{\"1\":{\"name\":\"punctuation.accessor.js\"},\"2\":{\"name\":\"punctuation.accessor.optional.js\"},\"3\":{\"name\":\"variable.other.property.js\"}},\"match\":\"(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*)\"},{\"match\":\"([A-Z][_$\\\\dA-Z]*)(?![_$0-9A-Za-z])\",\"name\":\"variable.other.constant.js\"},{\"match\":\"[_$A-Za-z][_$0-9A-Za-z]*\",\"name\":\"variable.other.readwrite.js\"}]},\"if-statement\":{\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?=\\\\bif\\\\s*(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))\\\\s*(?!\\\\{))\",\"end\":\"(?=;|$|\\\\})\",\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(if)\\\\s*(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.conditional.js\"},\"2\":{\"name\":\"meta.brace.round.js\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"patterns\":[{\"include\":\"#expression\"}]},{\"begin\":\"(?<=\\\\))\\\\s*\\\\/(?![\\\\/*])(?=(?:[^\\\\/\\\\\\\\\\\\[]|\\\\\\\\.|\\\\[([^\\\\]\\\\\\\\]|\\\\\\\\.)*\\\\])+\\\\/([dgimsuy]+|(?![\\\\/\\\\*])|(?=\\\\/\\\\*))(?!\\\\s*[a-zA-Z0-9_$]))\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.js\"}},\"end\":\"(/)([dgimsuy]*)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.end.js\"},\"2\":{\"name\":\"keyword.other.js\"}},\"name\":\"string.regexp.js\",\"patterns\":[{\"include\":\"#regexp\"}]},{\"include\":\"#statements\"}]}]},\"import-declaration\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(import)(?:\\\\s+(type)(?!\\\\s+from))?(?!\\\\s*[:(])(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"keyword.control.import.js\"},\"4\":{\"name\":\"keyword.control.type.js\"}},\"end\":\"(?<!^import|[^\\\\._$0-9A-Za-z]import)(?=;|$|^)\",\"name\":\"meta.import.js\",\"patterns\":[{\"include\":\"#single-line-comment-consuming-line-ending\"},{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"begin\":\"(?<=^import|[^\\\\._$0-9A-Za-z]import)(?!\\\\s*[\\\"'])\",\"end\":\"\\\\bfrom\\\\b\",\"endCaptures\":{\"0\":{\"name\":\"keyword.control.from.js\"}},\"patterns\":[{\"include\":\"#import-export-declaration\"}]},{\"include\":\"#import-export-declaration\"}]},\"import-equals-declaration\":{\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(import)(?:\\\\s+(type))?\\\\s+([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(=)\\\\s*(require)\\\\s*(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"keyword.control.import.js\"},\"4\":{\"name\":\"keyword.control.type.js\"},\"5\":{\"name\":\"variable.other.readwrite.alias.js\"},\"6\":{\"name\":\"keyword.operator.assignment.js\"},\"7\":{\"name\":\"keyword.control.require.js\"},\"8\":{\"name\":\"meta.brace.round.js\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"name\":\"meta.import-equals.external.js\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"}]},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(import)(?:\\\\s+(type))?\\\\s+([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(=)\\\\s*(?!require\\\\b)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"keyword.control.import.js\"},\"4\":{\"name\":\"keyword.control.type.js\"},\"5\":{\"name\":\"variable.other.readwrite.alias.js\"},\"6\":{\"name\":\"keyword.operator.assignment.js\"}},\"end\":\"(?=;|$|^)\",\"name\":\"meta.import-equals.internal.js\",\"patterns\":[{\"include\":\"#single-line-comment-consuming-line-ending\"},{\"include\":\"#comment\"},{\"captures\":{\"1\":{\"name\":\"entity.name.type.module.js\"},\"2\":{\"name\":\"punctuation.accessor.js\"},\"3\":{\"name\":\"punctuation.accessor.optional.js\"}},\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\"},{\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\",\"name\":\"variable.other.readwrite.js\"}]}]},\"import-export-assert-clause\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(with)|(assert))\\\\s*(\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.with.js\"},\"2\":{\"name\":\"keyword.control.assert.js\"},\"3\":{\"name\":\"punctuation.definition.block.js\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"match\":\"(?:[_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?=(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*:)\",\"name\":\"meta.object-literal.key.js\"},{\"match\":\":\",\"name\":\"punctuation.separator.key-value.js\"}]},\"import-export-block\":{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"name\":\"meta.block.js\",\"patterns\":[{\"include\":\"#import-export-clause\"}]},\"import-export-clause\":{\"patterns\":[{\"include\":\"#comment\"},{\"captures\":{\"1\":{\"name\":\"keyword.control.type.js\"},\"2\":{\"name\":\"keyword.control.default.js\"},\"3\":{\"name\":\"constant.language.import-export-all.js\"},\"4\":{\"name\":\"variable.other.readwrite.js\"},\"5\":{\"name\":\"keyword.control.as.js\"},\"6\":{\"name\":\"keyword.control.default.js\"},\"7\":{\"name\":\"variable.other.readwrite.alias.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(?:(\\\\btype)\\\\s+)?(?:(\\\\bdefault)|(\\\\*)|(\\\\b[_$A-Za-z][_$0-9A-Za-z]*)))\\\\s+(as)\\\\s+(?:(default(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|([_$A-Za-z][_$0-9A-Za-z]*))\"},{\"include\":\"#punctuation-comma\"},{\"match\":\"\\\\*\",\"name\":\"constant.language.import-export-all.js\"},{\"match\":\"\\\\b(default)\\\\b\",\"name\":\"keyword.control.default.js\"},{\"captures\":{\"1\":{\"name\":\"keyword.control.type.js\"},\"2\":{\"name\":\"variable.other.readwrite.alias.js\"}},\"match\":\"(?:(\\\\btype)\\\\s+)?([_$A-Za-z][_$0-9A-Za-z]*)\"}]},\"import-export-declaration\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"include\":\"#import-export-block\"},{\"match\":\"\\\\bfrom\\\\b\",\"name\":\"keyword.control.from.js\"},{\"include\":\"#import-export-assert-clause\"},{\"include\":\"#import-export-clause\"}]},\"indexer-declaration\":{\"begin\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(readonly)\\\\s*)?\\\\s*(\\\\[)\\\\s*([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?=:)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.js\"},\"2\":{\"name\":\"meta.brace.square.js\"},\"3\":{\"name\":\"variable.parameter.js\"}},\"end\":\"(\\\\])\\\\s*(\\\\?\\\\s*)?|$\",\"endCaptures\":{\"1\":{\"name\":\"meta.brace.square.js\"},\"2\":{\"name\":\"keyword.operator.optional.js\"}},\"name\":\"meta.indexer.declaration.js\",\"patterns\":[{\"include\":\"#type-annotation\"}]},\"indexer-mapped-type-declaration\":{\"begin\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))([+-])?(readonly)\\\\s*)?\\\\s*(\\\\[)\\\\s*([_$A-Za-z][_$0-9A-Za-z]*)\\\\s+(in)\\\\s+\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.type.modifier.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"meta.brace.square.js\"},\"4\":{\"name\":\"entity.name.type.js\"},\"5\":{\"name\":\"keyword.operator.expression.in.js\"}},\"end\":\"(\\\\])([+-])?\\\\s*(\\\\?\\\\s*)?|$\",\"endCaptures\":{\"1\":{\"name\":\"meta.brace.square.js\"},\"2\":{\"name\":\"keyword.operator.type.modifier.js\"},\"3\":{\"name\":\"keyword.operator.optional.js\"}},\"name\":\"meta.indexer.mappedtype.declaration.js\",\"patterns\":[{\"captures\":{\"1\":{\"name\":\"keyword.control.as.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(as)\\\\s+\"},{\"include\":\"#type\"}]},\"inline-tags\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"punctuation.definition.bracket.square.begin.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.bracket.square.end.jsdoc\"}},\"match\":\"(\\\\[)[^\\\\]]+(\\\\])(?={@(?:link|linkcode|linkplain|tutorial))\",\"name\":\"constant.other.description.jsdoc\"},{\"begin\":\"({)((@)(?:link(?:code|plain)?|tutorial))\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.bracket.curly.begin.jsdoc\"},\"2\":{\"name\":\"storage.type.class.jsdoc\"},\"3\":{\"name\":\"punctuation.definition.inline.tag.jsdoc\"}},\"end\":\"}|(?=\\\\*/)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.bracket.curly.end.jsdoc\"}},\"name\":\"entity.name.type.instance.jsdoc\",\"patterns\":[{\"captures\":{\"1\":{\"name\":\"variable.other.link.underline.jsdoc\"},\"2\":{\"name\":\"punctuation.separator.pipe.jsdoc\"}},\"match\":\"\\\\G((?=https?://)(?:[^|}\\\\s*]|\\\\*[/])+)(\\\\|)?\"},{\"captures\":{\"1\":{\"name\":\"variable.other.description.jsdoc\"},\"2\":{\"name\":\"punctuation.separator.pipe.jsdoc\"}},\"match\":\"\\\\G((?:[^{}@\\\\s|*]|\\\\*[^/])+)(\\\\|)?\"}]}]},\"instanceof-expr\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(instanceof)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.expression.instanceof.js\"}},\"end\":\"(?<=\\\\))|(?=[;),}\\\\]:?\\\\-+>]|\\\\|\\\\||\\\\&\\\\&|!==|$|(===|!==|==|!=)|(([\\\\&\\\\~\\\\^\\\\|]\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s+instanceof(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))function((\\\\s+[_$A-Za-z][_$0-9A-Za-z]*)|(\\\\s*[(]))))\",\"patterns\":[{\"include\":\"#type\"}]},\"interface-declaration\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(?:(abstract)\\\\s+)?\\\\b(interface)\\\\b(?=\\\\s+|/[/*])\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"storage.modifier.js\"},\"4\":{\"name\":\"storage.type.interface.js\"}},\"end\":\"(?<=\\\\})\",\"name\":\"meta.interface.js\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#class-or-interface-heritage\"},{\"captures\":{\"0\":{\"name\":\"entity.name.type.interface.js\"}},\"match\":\"[_$A-Za-z][_$0-9A-Za-z]*\"},{\"include\":\"#type-parameters\"},{\"include\":\"#class-or-interface-body\"}]},\"jsdoctype\":{\"patterns\":[{\"begin\":\"\\\\G({)\",\"beginCaptures\":{\"0\":{\"name\":\"entity.name.type.instance.jsdoc\"},\"1\":{\"name\":\"punctuation.definition.bracket.curly.begin.jsdoc\"}},\"contentName\":\"entity.name.type.instance.jsdoc\",\"end\":\"((}))\\\\s*|(?=\\\\*/)\",\"endCaptures\":{\"1\":{\"name\":\"entity.name.type.instance.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.bracket.curly.end.jsdoc\"}},\"patterns\":[{\"include\":\"#brackets\"}]}]},\"jsx\":{\"patterns\":[{\"include\":\"#jsx-tag-without-attributes-in-expression\"},{\"include\":\"#jsx-tag-in-expression\"}]},\"jsx-children\":{\"patterns\":[{\"include\":\"#jsx-tag-without-attributes\"},{\"include\":\"#jsx-tag\"},{\"include\":\"#jsx-evaluated-code\"},{\"include\":\"#jsx-entities\"}]},\"jsx-entities\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"punctuation.definition.entity.js\"},\"3\":{\"name\":\"punctuation.definition.entity.js\"}},\"match\":\"(&)([a-zA-Z0-9]+|#\\\\d+|#x[0-9a-fA-F]+)(;)\",\"name\":\"constant.character.entity.js\"}]},\"jsx-evaluated-code\":{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.section.embedded.begin.js\"}},\"contentName\":\"meta.embedded.expression.js\",\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.embedded.end.js\"}},\"patterns\":[{\"include\":\"#expression\"}]},\"jsx-string-double-quoted\":{\"begin\":\"\\\"\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.js\"}},\"end\":\"\\\"\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.js\"}},\"name\":\"string.quoted.double.js\",\"patterns\":[{\"include\":\"#jsx-entities\"}]},\"jsx-string-single-quoted\":{\"begin\":\"'\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.js\"}},\"end\":\"'\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.js\"}},\"name\":\"string.quoted.single.js\",\"patterns\":[{\"include\":\"#jsx-entities\"}]},\"jsx-tag\":{\"begin\":\"(?=(<)\\\\s*(?:([_$A-Za-z][-_$0-9A-Za-z.]*)(?<!\\\\.|-)(:))?((?:[a-z][a-z0-9]*|([_$A-Za-z][-_$0-9A-Za-z.]*))(?<!\\\\.|-))(?=((<\\\\s*)|(\\\\s+))(?!\\\\?)|\\\\/?>))\",\"end\":\"(/>)|(?:(</)\\\\s*(?:([_$A-Za-z][-_$0-9A-Za-z.]*)(?<!\\\\.|-)(:))?((?:[a-z][a-z0-9]*|([_$A-Za-z][-_$0-9A-Za-z.]*))(?<!\\\\.|-))?\\\\s*(>))\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.end.js\"},\"2\":{\"name\":\"punctuation.definition.tag.begin.js\"},\"3\":{\"name\":\"entity.name.tag.namespace.js\"},\"4\":{\"name\":\"punctuation.separator.namespace.js\"},\"5\":{\"name\":\"entity.name.tag.js\"},\"6\":{\"name\":\"support.class.component.js\"},\"7\":{\"name\":\"punctuation.definition.tag.end.js\"}},\"name\":\"meta.tag.js\",\"patterns\":[{\"begin\":\"(<)\\\\s*(?:([_$A-Za-z][-_$0-9A-Za-z.]*)(?<!\\\\.|-)(:))?((?:[a-z][a-z0-9]*|([_$A-Za-z][-_$0-9A-Za-z.]*))(?<!\\\\.|-))(?=((<\\\\s*)|(\\\\s+))(?!\\\\?)|\\\\/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.js\"},\"2\":{\"name\":\"entity.name.tag.namespace.js\"},\"3\":{\"name\":\"punctuation.separator.namespace.js\"},\"4\":{\"name\":\"entity.name.tag.js\"},\"5\":{\"name\":\"support.class.component.js\"}},\"end\":\"(?=[/]?>)\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#type-arguments\"},{\"include\":\"#jsx-tag-attributes\"}]},{\"begin\":\"(>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.end.js\"}},\"contentName\":\"meta.jsx.children.js\",\"end\":\"(?=</)\",\"patterns\":[{\"include\":\"#jsx-children\"}]}]},\"jsx-tag-attribute-assignment\":{\"match\":\"=(?=\\\\s*(?:'|\\\"|{|/\\\\*|//|\\\\n))\",\"name\":\"keyword.operator.assignment.js\"},\"jsx-tag-attribute-name\":{\"captures\":{\"1\":{\"name\":\"entity.other.attribute-name.namespace.js\"},\"2\":{\"name\":\"punctuation.separator.namespace.js\"},\"3\":{\"name\":\"entity.other.attribute-name.js\"}},\"match\":\"\\\\s*(?:([_$A-Za-z][-_$0-9A-Za-z.]*)(:))?([_$A-Za-z][-_$0-9A-Za-z]*)(?=\\\\s|=|/?>|/\\\\*|//)\"},\"jsx-tag-attributes\":{\"begin\":\"\\\\s+\",\"end\":\"(?=[/]?>)\",\"name\":\"meta.tag.attributes.js\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#jsx-tag-attribute-name\"},{\"include\":\"#jsx-tag-attribute-assignment\"},{\"include\":\"#jsx-string-double-quoted\"},{\"include\":\"#jsx-string-single-quoted\"},{\"include\":\"#jsx-evaluated-code\"},{\"include\":\"#jsx-tag-attributes-illegal\"}]},\"jsx-tag-attributes-illegal\":{\"match\":\"\\\\S+\",\"name\":\"invalid.illegal.attribute.js\"},\"jsx-tag-in-expression\":{\"begin\":\"(?<!\\\\+\\\\+|--)(?<=[({\\\\[,?=>:*]|&&|\\\\|\\\\||\\\\?|\\\\*\\\\/|^await|[^\\\\._$0-9A-Za-z]await|^return|[^\\\\._$0-9A-Za-z]return|^default|[^\\\\._$0-9A-Za-z]default|^yield|[^\\\\._$0-9A-Za-z]yield|^)\\\\s*(?!<\\\\s*[_$A-Za-z][_$0-9A-Za-z]*((\\\\s+extends\\\\s+[^=>])|,))(?=(<)\\\\s*(?:([_$A-Za-z][-_$0-9A-Za-z.]*)(?<!\\\\.|-)(:))?((?:[a-z][a-z0-9]*|([_$A-Za-z][-_$0-9A-Za-z.]*))(?<!\\\\.|-))(?=((<\\\\s*)|(\\\\s+))(?!\\\\?)|\\\\/?>))\",\"end\":\"(?!(<)\\\\s*(?:([_$A-Za-z][-_$0-9A-Za-z.]*)(?<!\\\\.|-)(:))?((?:[a-z][a-z0-9]*|([_$A-Za-z][-_$0-9A-Za-z.]*))(?<!\\\\.|-))(?=((<\\\\s*)|(\\\\s+))(?!\\\\?)|\\\\/?>))\",\"patterns\":[{\"include\":\"#jsx-tag\"}]},\"jsx-tag-without-attributes\":{\"begin\":\"(<)\\\\s*(?:([_$A-Za-z][-_$0-9A-Za-z.]*)(?<!\\\\.|-)(:))?((?:[a-z][a-z0-9]*|([_$A-Za-z][-_$0-9A-Za-z.]*))(?<!\\\\.|-))?\\\\s*(>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.js\"},\"2\":{\"name\":\"entity.name.tag.namespace.js\"},\"3\":{\"name\":\"punctuation.separator.namespace.js\"},\"4\":{\"name\":\"entity.name.tag.js\"},\"5\":{\"name\":\"support.class.component.js\"},\"6\":{\"name\":\"punctuation.definition.tag.end.js\"}},\"contentName\":\"meta.jsx.children.js\",\"end\":\"(</)\\\\s*(?:([_$A-Za-z][-_$0-9A-Za-z.]*)(?<!\\\\.|-)(:))?((?:[a-z][a-z0-9]*|([_$A-Za-z][-_$0-9A-Za-z.]*))(?<!\\\\.|-))?\\\\s*(>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.js\"},\"2\":{\"name\":\"entity.name.tag.namespace.js\"},\"3\":{\"name\":\"punctuation.separator.namespace.js\"},\"4\":{\"name\":\"entity.name.tag.js\"},\"5\":{\"name\":\"support.class.component.js\"},\"6\":{\"name\":\"punctuation.definition.tag.end.js\"}},\"name\":\"meta.tag.without-attributes.js\",\"patterns\":[{\"include\":\"#jsx-children\"}]},\"jsx-tag-without-attributes-in-expression\":{\"begin\":\"(?<!\\\\+\\\\+|--)(?<=[({\\\\[,?=>:*]|&&|\\\\|\\\\||\\\\?|\\\\*\\\\/|^await|[^\\\\._$0-9A-Za-z]await|^return|[^\\\\._$0-9A-Za-z]return|^default|[^\\\\._$0-9A-Za-z]default|^yield|[^\\\\._$0-9A-Za-z]yield|^)\\\\s*(?=(<)\\\\s*(?:([_$A-Za-z][-_$0-9A-Za-z.]*)(?<!\\\\.|-)(:))?((?:[a-z][a-z0-9]*|([_$A-Za-z][-_$0-9A-Za-z.]*))(?<!\\\\.|-))?\\\\s*(>))\",\"end\":\"(?!(<)\\\\s*(?:([_$A-Za-z][-_$0-9A-Za-z.]*)(?<!\\\\.|-)(:))?((?:[a-z][a-z0-9]*|([_$A-Za-z][-_$0-9A-Za-z.]*))(?<!\\\\.|-))?\\\\s*(>))\",\"patterns\":[{\"include\":\"#jsx-tag-without-attributes\"}]},\"label\":{\"patterns\":[{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(:)(?=\\\\s*\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.label.js\"},\"2\":{\"name\":\"punctuation.separator.label.js\"}},\"end\":\"(?<=\\\\})\",\"patterns\":[{\"include\":\"#decl-block\"}]},{\"captures\":{\"1\":{\"name\":\"entity.name.label.js\"},\"2\":{\"name\":\"punctuation.separator.label.js\"}},\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(:)\"}]},\"literal\":{\"patterns\":[{\"include\":\"#numeric-literal\"},{\"include\":\"#boolean-literal\"},{\"include\":\"#null-literal\"},{\"include\":\"#undefined-literal\"},{\"include\":\"#numericConstant-literal\"},{\"include\":\"#array-literal\"},{\"include\":\"#this-literal\"},{\"include\":\"#super-literal\"}]},\"method-declaration\":{\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:\\\\b(override)\\\\s+)?(?:\\\\b(public|private|protected)\\\\s+)?(?:\\\\b(abstract)\\\\s+)?(?:\\\\b(async)\\\\s+)?\\\\s*\\\\b(constructor)\\\\b(?!:)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"storage.modifier.js\"},\"4\":{\"name\":\"storage.modifier.async.js\"},\"5\":{\"name\":\"storage.type.js\"}},\"end\":\"(?=\\\\}|;|,|$)|(?<=\\\\})\",\"name\":\"meta.method.declaration.js\",\"patterns\":[{\"include\":\"#method-declaration-name\"},{\"include\":\"#function-body\"}]},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:\\\\b(override)\\\\s+)?(?:\\\\b(public|private|protected)\\\\s+)?(?:\\\\b(abstract)\\\\s+)?(?:\\\\b(async)\\\\s+)?(?:(?:\\\\s*\\\\b(new)\\\\b(?!:)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|(?:(\\\\*)\\\\s*)?)(?=\\\\s*((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*))?[(])\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"storage.modifier.js\"},\"4\":{\"name\":\"storage.modifier.async.js\"},\"5\":{\"name\":\"keyword.operator.new.js\"},\"6\":{\"name\":\"keyword.generator.asterisk.js\"}},\"end\":\"(?=\\\\}|;|,|$)|(?<=\\\\})\",\"name\":\"meta.method.declaration.js\",\"patterns\":[{\"include\":\"#method-declaration-name\"},{\"include\":\"#function-body\"}]},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:\\\\b(override)\\\\s+)?(?:\\\\b(public|private|protected)\\\\s+)?(?:\\\\b(abstract)\\\\s+)?(?:\\\\b(async)\\\\s+)?(?:\\\\b(get|set)\\\\s+)?(?:(\\\\*)\\\\s*)?(?=\\\\s*(((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(\\\\??))\\\\s*((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*))?[(])\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"storage.modifier.js\"},\"4\":{\"name\":\"storage.modifier.async.js\"},\"5\":{\"name\":\"storage.type.property.js\"},\"6\":{\"name\":\"keyword.generator.asterisk.js\"}},\"end\":\"(?=\\\\}|;|,|$)|(?<=\\\\})\",\"name\":\"meta.method.declaration.js\",\"patterns\":[{\"include\":\"#method-declaration-name\"},{\"include\":\"#function-body\"}]}]},\"method-declaration-name\":{\"begin\":\"(?=((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(\\\\??)\\\\s*[(<])\",\"end\":\"(?=\\\\(|<)\",\"patterns\":[{\"include\":\"#string\"},{\"include\":\"#array-literal\"},{\"include\":\"#numeric-literal\"},{\"match\":\"[_$A-Za-z][_$0-9A-Za-z]*\",\"name\":\"meta.definition.method.js entity.name.function.js\"},{\"match\":\"\\\\?\",\"name\":\"keyword.operator.optional.js\"}]},\"namespace-declaration\":{\"begin\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(namespace|module)\\\\s+(?=[_$A-Za-z\\\"'`]))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"storage.type.namespace.js\"}},\"end\":\"(?<=\\\\})|(?=;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"name\":\"meta.namespace.declaration.js\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\",\"name\":\"entity.name.type.module.js\"},{\"include\":\"#punctuation-accessor\"},{\"include\":\"#decl-block\"}]},\"new-expr\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(new)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.new.js\"}},\"end\":\"(?<=\\\\))|(?=[;),}\\\\]:?\\\\-+>]|\\\\|\\\\||\\\\&\\\\&|!==|$|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))new(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))function((\\\\s+[_$A-Za-z][_$0-9A-Za-z]*)|(\\\\s*[(]))))\",\"name\":\"new.expr.js\",\"patterns\":[{\"include\":\"#expression\"}]},\"null-literal\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))null(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"constant.language.null.js\"},\"numeric-literal\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"storage.type.numeric.bigint.js\"}},\"match\":\"\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$)\",\"name\":\"constant.numeric.hex.js\"},{\"captures\":{\"1\":{\"name\":\"storage.type.numeric.bigint.js\"}},\"match\":\"\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$)\",\"name\":\"constant.numeric.binary.js\"},{\"captures\":{\"1\":{\"name\":\"storage.type.numeric.bigint.js\"}},\"match\":\"\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$)\",\"name\":\"constant.numeric.octal.js\"},{\"captures\":{\"0\":{\"name\":\"constant.numeric.decimal.js\"},\"1\":{\"name\":\"meta.delimiter.decimal.period.js\"},\"2\":{\"name\":\"storage.type.numeric.bigint.js\"},\"3\":{\"name\":\"meta.delimiter.decimal.period.js\"},\"4\":{\"name\":\"storage.type.numeric.bigint.js\"},\"5\":{\"name\":\"meta.delimiter.decimal.period.js\"},\"6\":{\"name\":\"storage.type.numeric.bigint.js\"},\"7\":{\"name\":\"storage.type.numeric.bigint.js\"},\"8\":{\"name\":\"meta.delimiter.decimal.period.js\"},\"9\":{\"name\":\"storage.type.numeric.bigint.js\"},\"10\":{\"name\":\"meta.delimiter.decimal.period.js\"},\"11\":{\"name\":\"storage.type.numeric.bigint.js\"},\"12\":{\"name\":\"meta.delimiter.decimal.period.js\"},\"13\":{\"name\":\"storage.type.numeric.bigint.js\"},\"14\":{\"name\":\"storage.type.numeric.bigint.js\"}},\"match\":\"(?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$)\"}]},\"numericConstant-literal\":{\"patterns\":[{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))NaN(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"constant.language.nan.js\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))Infinity(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"constant.language.infinity.js\"}]},\"object-binding-element\":{\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"(?=((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(:))\",\"end\":\"(?=,|\\\\})\",\"patterns\":[{\"include\":\"#object-binding-element-propertyName\"},{\"include\":\"#binding-element\"}]},{\"include\":\"#object-binding-pattern\"},{\"include\":\"#destructuring-variable-rest\"},{\"include\":\"#variable-initializer\"},{\"include\":\"#punctuation-comma\"}]},\"object-binding-element-const\":{\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"(?=((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(:))\",\"end\":\"(?=,|\\\\})\",\"patterns\":[{\"include\":\"#object-binding-element-propertyName\"},{\"include\":\"#binding-element-const\"}]},{\"include\":\"#object-binding-pattern-const\"},{\"include\":\"#destructuring-variable-rest-const\"},{\"include\":\"#variable-initializer\"},{\"include\":\"#punctuation-comma\"}]},\"object-binding-element-propertyName\":{\"begin\":\"(?=((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(:))\",\"end\":\"(:)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.destructuring.js\"}},\"patterns\":[{\"include\":\"#string\"},{\"include\":\"#array-literal\"},{\"include\":\"#numeric-literal\"},{\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\",\"name\":\"variable.object.property.js\"}]},\"object-binding-pattern\":{\"begin\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.js\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.object.js\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.object.js\"}},\"patterns\":[{\"include\":\"#object-binding-element\"}]},\"object-binding-pattern-const\":{\"begin\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.js\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.object.js\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.object.js\"}},\"patterns\":[{\"include\":\"#object-binding-element-const\"}]},\"object-identifiers\":{\"patterns\":[{\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)(?=\\\\s*\\\\??\\\\.\\\\s*prototype\\\\b(?!\\\\$))\",\"name\":\"support.class.js\"},{\"captures\":{\"1\":{\"name\":\"punctuation.accessor.js\"},\"2\":{\"name\":\"punctuation.accessor.optional.js\"},\"3\":{\"name\":\"variable.other.constant.object.property.js\"},\"4\":{\"name\":\"variable.other.object.property.js\"}},\"match\":\"(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*(?:(\\\\#?[A-Z][_$\\\\dA-Z]*)|(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))(?=\\\\s*\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*)\"},{\"captures\":{\"1\":{\"name\":\"variable.other.constant.object.js\"},\"2\":{\"name\":\"variable.other.object.js\"}},\"match\":\"(?:([A-Z][_$\\\\dA-Z]*)|([_$A-Za-z][_$0-9A-Za-z]*))(?=\\\\s*\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*)\"}]},\"object-literal\":{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"name\":\"meta.objectliteral.js\",\"patterns\":[{\"include\":\"#object-member\"}]},\"object-literal-method-declaration\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:\\\\b(async)\\\\s+)?(?:\\\\b(get|set)\\\\s+)?(?:(\\\\*)\\\\s*)?(?=\\\\s*(((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(\\\\??))\\\\s*((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*))?[(])\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.js\"},\"2\":{\"name\":\"storage.type.property.js\"},\"3\":{\"name\":\"keyword.generator.asterisk.js\"}},\"end\":\"(?=\\\\}|;|,)|(?<=\\\\})\",\"name\":\"meta.method.declaration.js\",\"patterns\":[{\"include\":\"#method-declaration-name\"},{\"include\":\"#function-body\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:\\\\b(async)\\\\s+)?(?:\\\\b(get|set)\\\\s+)?(?:(\\\\*)\\\\s*)?(?=\\\\s*(((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(\\\\??))\\\\s*((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*))?[(])\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.js\"},\"2\":{\"name\":\"storage.type.property.js\"},\"3\":{\"name\":\"keyword.generator.asterisk.js\"}},\"end\":\"(?=\\\\(|<)\",\"patterns\":[{\"include\":\"#method-declaration-name\"}]}]},\"object-member\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#object-literal-method-declaration\"},{\"begin\":\"(?=\\\\[)\",\"end\":\"(?=:)|((?<=[\\\\]])(?=\\\\s*[(<]))\",\"name\":\"meta.object.member.js meta.object-literal.key.js\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#array-literal\"}]},{\"begin\":\"(?=[\\\\'\\\\\\\"\\\\`])\",\"end\":\"(?=:)|((?<=[\\\\'\\\\\\\"\\\\`])(?=((\\\\s*[(<,}])|(\\\\s+(as|satisifies)\\\\s+))))\",\"name\":\"meta.object.member.js meta.object-literal.key.js\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"}]},{\"begin\":\"(?=(\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$)))\",\"end\":\"(?=:)|(?=\\\\s*([(<,}])|(\\\\s+as|satisifies\\\\s+))\",\"name\":\"meta.object.member.js meta.object-literal.key.js\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#numeric-literal\"}]},{\"begin\":\"(?<=[\\\\]\\\\'\\\\\\\"\\\\`])(?=\\\\s*[(<])\",\"end\":\"(?=\\\\}|;|,)|(?<=\\\\})\",\"name\":\"meta.method.declaration.js\",\"patterns\":[{\"include\":\"#function-body\"}]},{\"captures\":{\"0\":{\"name\":\"meta.object-literal.key.js\"},\"1\":{\"name\":\"constant.numeric.decimal.js\"}},\"match\":\"(?![_$A-Za-z])([\\\\d]+)\\\\s*(?=(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*:)\",\"name\":\"meta.object.member.js\"},{\"captures\":{\"0\":{\"name\":\"meta.object-literal.key.js\"},\"1\":{\"name\":\"entity.name.function.js\"}},\"match\":\"(?:([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?=(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*:(\\\\s*\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/)*\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|([<]\\\\s*[_$A-Za-z][_$0-9A-Za-z]*\\\\s+extends\\\\s*[^=>])|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>))))))\",\"name\":\"meta.object.member.js\"},{\"captures\":{\"0\":{\"name\":\"meta.object-literal.key.js\"}},\"match\":\"(?:[_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?=(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*:)\",\"name\":\"meta.object.member.js\"},{\"begin\":\"\\\\.\\\\.\\\\.\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.operator.spread.js\"}},\"end\":\"(?=,|\\\\})\",\"name\":\"meta.object.member.js\",\"patterns\":[{\"include\":\"#expression\"}]},{\"captures\":{\"1\":{\"name\":\"variable.other.readwrite.js\"}},\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?=,|\\\\}|$|\\\\/\\\\/|\\\\/\\\\*)\",\"name\":\"meta.object.member.js\"},{\"captures\":{\"1\":{\"name\":\"keyword.control.as.js\"},\"2\":{\"name\":\"storage.modifier.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(as)\\\\s+(const)(?=\\\\s*([,}]|$))\",\"name\":\"meta.object.member.js\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(as)|(satisfies))\\\\s+\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.as.js\"},\"2\":{\"name\":\"keyword.control.satisfies.js\"}},\"end\":\"(?=[;),}\\\\]:?\\\\-+>]|\\\\|\\\\||\\\\&\\\\&|!==|$|^|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(as|satisifies)\\\\s+))\",\"name\":\"meta.object.member.js\",\"patterns\":[{\"include\":\"#type\"}]},{\"begin\":\"(?=[_$A-Za-z][_$0-9A-Za-z]*\\\\s*=)\",\"end\":\"(?=,|\\\\}|$|\\\\/\\\\/|\\\\/\\\\*)\",\"name\":\"meta.object.member.js\",\"patterns\":[{\"include\":\"#expression\"}]},{\"begin\":\":\",\"beginCaptures\":{\"0\":{\"name\":\"meta.object-literal.key.js punctuation.separator.key-value.js\"}},\"end\":\"(?=,|\\\\})\",\"name\":\"meta.object.member.js\",\"patterns\":[{\"begin\":\"(?<=:)\\\\s*(async)?(?=\\\\s*(<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)\\\\(\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.js\"}},\"end\":\"(?<=\\\\))\",\"patterns\":[{\"include\":\"#type-parameters\"},{\"begin\":\"\\\\(\",\"beginCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"patterns\":[{\"include\":\"#expression-inside-possibly-arrow-parens\"}]}]},{\"begin\":\"(?<=:)\\\\s*(async)?\\\\s*(\\\\()(?=\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.js\"},\"2\":{\"name\":\"meta.brace.round.js\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"patterns\":[{\"include\":\"#expression-inside-possibly-arrow-parens\"}]},{\"begin\":\"(?<=:)\\\\s*(async)?\\\\s*(?=<\\\\s*$)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.js\"}},\"end\":\"(?<=>)\",\"patterns\":[{\"include\":\"#type-parameters\"}]},{\"begin\":\"(?<=>)\\\\s*(\\\\()(?=\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))\",\"beginCaptures\":{\"1\":{\"name\":\"meta.brace.round.js\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"patterns\":[{\"include\":\"#expression-inside-possibly-arrow-parens\"}]},{\"include\":\"#possibly-arrow-return-type\"},{\"include\":\"#expression\"}]},{\"include\":\"#punctuation-comma\"},{\"include\":\"#decl-block\"}]},\"parameter-array-binding-pattern\":{\"begin\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\[)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.js\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.array.js\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.array.js\"}},\"patterns\":[{\"include\":\"#parameter-binding-element\"},{\"include\":\"#punctuation-comma\"}]},\"parameter-binding-element\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"include\":\"#numeric-literal\"},{\"include\":\"#regex\"},{\"include\":\"#parameter-object-binding-pattern\"},{\"include\":\"#parameter-array-binding-pattern\"},{\"include\":\"#destructuring-parameter-rest\"},{\"include\":\"#variable-initializer\"}]},\"parameter-name\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"storage.modifier.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(override|public|protected|private|readonly)\\\\s+(?=(override|public|protected|private|readonly)\\\\s+)\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.js\"},\"2\":{\"name\":\"keyword.operator.rest.js\"},\"3\":{\"name\":\"entity.name.function.js variable.language.this.js\"},\"4\":{\"name\":\"entity.name.function.js\"},\"5\":{\"name\":\"keyword.operator.optional.js\"}},\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(override|public|private|protected|readonly)\\\\s+)?(?:(\\\\.\\\\.\\\\.)\\\\s*)?(?<!=|:)(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*(\\\\??)(?=\\\\s*(=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|([<]\\\\s*[_$A-Za-z][_$0-9A-Za-z]*\\\\s+extends\\\\s*[^=>])|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>)))))|(:\\\\s*((<)|([(]\\\\s*(([)])|(\\\\.\\\\.\\\\.)|([_$0-9A-Za-z]+\\\\s*(([:,?=])|([)]\\\\s*=>)))))))|(:\\\\s*(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))Function(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|(:\\\\s*((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))))|(:\\\\s*(=>|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(<[^<>]*>)|[^<>(),=])+=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|([<]\\\\s*[_$A-Za-z][_$0-9A-Za-z]*\\\\s+extends\\\\s*[^=>])|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>))))))\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.js\"},\"2\":{\"name\":\"keyword.operator.rest.js\"},\"3\":{\"name\":\"variable.parameter.js variable.language.this.js\"},\"4\":{\"name\":\"variable.parameter.js\"},\"5\":{\"name\":\"keyword.operator.optional.js\"}},\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(override|public|private|protected|readonly)\\\\s+)?(?:(\\\\.\\\\.\\\\.)\\\\s*)?(?<!=|:)(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*(\\\\??)\"}]},\"parameter-object-binding-element\":{\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"(?=((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(:))\",\"end\":\"(?=,|\\\\})\",\"patterns\":[{\"include\":\"#object-binding-element-propertyName\"},{\"include\":\"#parameter-binding-element\"},{\"include\":\"#paren-expression\"}]},{\"include\":\"#parameter-object-binding-pattern\"},{\"include\":\"#destructuring-parameter-rest\"},{\"include\":\"#variable-initializer\"},{\"include\":\"#punctuation-comma\"}]},\"parameter-object-binding-pattern\":{\"begin\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.js\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.object.js\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.object.js\"}},\"patterns\":[{\"include\":\"#parameter-object-binding-element\"}]},\"parameter-type-annotation\":{\"patterns\":[{\"begin\":\"(:)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.type.annotation.js\"}},\"end\":\"(?=[,)])|(?==[^>])\",\"name\":\"meta.type.annotation.js\",\"patterns\":[{\"include\":\"#type\"}]}]},\"paren-expression\":{\"begin\":\"\\\\(\",\"beginCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"patterns\":[{\"include\":\"#expression\"}]},\"paren-expression-possibly-arrow\":{\"patterns\":[{\"begin\":\"(?<=[(=,])\\\\s*(async)?(?=\\\\s*((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*))?\\\\(\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.js\"}},\"end\":\"(?<=\\\\))\",\"patterns\":[{\"include\":\"#paren-expression-possibly-arrow-with-typeparameters\"}]},{\"begin\":\"(?<=[(=,]|=>|^return|[^\\\\._$0-9A-Za-z]return)\\\\s*(async)?(?=\\\\s*((((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*))?\\\\()|(<)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)))\\\\s*$)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.js\"}},\"end\":\"(?<=\\\\))\",\"patterns\":[{\"include\":\"#paren-expression-possibly-arrow-with-typeparameters\"}]},{\"include\":\"#possibly-arrow-return-type\"}]},\"paren-expression-possibly-arrow-with-typeparameters\":{\"patterns\":[{\"include\":\"#type-parameters\"},{\"begin\":\"\\\\(\",\"beginCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"patterns\":[{\"include\":\"#expression-inside-possibly-arrow-parens\"}]}]},\"possibly-arrow-return-type\":{\"begin\":\"(?<=\\\\)|^)\\\\s*(:)(?=\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*=>)\",\"beginCaptures\":{\"1\":{\"name\":\"meta.arrow.js meta.return.type.arrow.js keyword.operator.type.annotation.js\"}},\"contentName\":\"meta.arrow.js meta.return.type.arrow.js\",\"end\":\"(?==>|\\\\{|(^\\\\s*(export|function|class|interface|let|var|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|const|import|enum|namespace|module|type|abstract|declare)\\\\s+))\",\"patterns\":[{\"include\":\"#arrow-return-type-body\"}]},\"property-accessor\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(accessor|get|set)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"storage.type.property.js\"},\"punctuation-accessor\":{\"captures\":{\"1\":{\"name\":\"punctuation.accessor.js\"},\"2\":{\"name\":\"punctuation.accessor.optional.js\"}},\"match\":\"(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\"},\"punctuation-comma\":{\"match\":\",\",\"name\":\"punctuation.separator.comma.js\"},\"punctuation-semicolon\":{\"match\":\";\",\"name\":\"punctuation.terminator.statement.js\"},\"qstring-double\":{\"begin\":\"\\\"\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.js\"}},\"end\":\"(\\\")|((?:[^\\\\\\\\\\\\n])$)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.end.js\"},\"2\":{\"name\":\"invalid.illegal.newline.js\"}},\"name\":\"string.quoted.double.js\",\"patterns\":[{\"include\":\"#string-character-escape\"}]},\"qstring-single\":{\"begin\":\"'\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.js\"}},\"end\":\"(\\\\')|((?:[^\\\\\\\\\\\\n])$)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.end.js\"},\"2\":{\"name\":\"invalid.illegal.newline.js\"}},\"name\":\"string.quoted.single.js\",\"patterns\":[{\"include\":\"#string-character-escape\"}]},\"regex\":{\"patterns\":[{\"begin\":\"(?<!\\\\+\\\\+|--|})(?<=[=(:,\\\\[?+!]|^return|[^\\\\._$0-9A-Za-z]return|^case|[^\\\\._$0-9A-Za-z]case|=>|&&|\\\\|\\\\||\\\\*\\\\/)\\\\s*(\\\\/)(?![\\\\/*])(?=(?:[^\\\\/\\\\\\\\\\\\[()]|\\\\\\\\.|\\\\[([^\\\\]\\\\\\\\]|\\\\\\\\.)+\\\\]|\\\\(([^)\\\\\\\\]|\\\\\\\\.)+\\\\))+\\\\/([dgimsuy]+|(?![\\\\/\\\\*])|(?=\\\\/\\\\*))(?!\\\\s*[a-zA-Z0-9_$]))\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.begin.js\"}},\"end\":\"(/)([dgimsuy]*)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.end.js\"},\"2\":{\"name\":\"keyword.other.js\"}},\"name\":\"string.regexp.js\",\"patterns\":[{\"include\":\"#regexp\"}]},{\"begin\":\"((?<![_$0-9A-Za-z)\\\\]]|\\\\+\\\\+|--|}|\\\\*\\\\/)|((?<=^return|[^\\\\._$0-9A-Za-z]return|^case|[^\\\\._$0-9A-Za-z]case))\\\\s*)\\\\/(?![\\\\/*])(?=(?:[^\\\\/\\\\\\\\\\\\[]|\\\\\\\\.|\\\\[([^\\\\]\\\\\\\\]|\\\\\\\\.)*\\\\])+\\\\/([dgimsuy]+|(?![\\\\/\\\\*])|(?=\\\\/\\\\*))(?!\\\\s*[a-zA-Z0-9_$]))\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.js\"}},\"end\":\"(/)([dgimsuy]*)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.end.js\"},\"2\":{\"name\":\"keyword.other.js\"}},\"name\":\"string.regexp.js\",\"patterns\":[{\"include\":\"#regexp\"}]}]},\"regex-character-class\":{\"patterns\":[{\"match\":\"\\\\\\\\[wWsSdDtrnvf]|\\\\.\",\"name\":\"constant.other.character-class.regexp\"},{\"match\":\"\\\\\\\\([0-7]{3}|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4})\",\"name\":\"constant.character.numeric.regexp\"},{\"match\":\"\\\\\\\\c[A-Z]\",\"name\":\"constant.character.control.regexp\"},{\"match\":\"\\\\\\\\.\",\"name\":\"constant.character.escape.backslash.regexp\"}]},\"regexp\":{\"patterns\":[{\"match\":\"\\\\\\\\[bB]|\\\\^|\\\\$\",\"name\":\"keyword.control.anchor.regexp\"},{\"captures\":{\"0\":{\"name\":\"keyword.other.back-reference.regexp\"},\"1\":{\"name\":\"variable.other.regexp\"}},\"match\":\"\\\\\\\\[1-9]\\\\d*|\\\\\\\\k<([a-zA-Z_$][\\\\w$]*)>\"},{\"match\":\"[?+*]|\\\\{(\\\\d+,\\\\d+|\\\\d+,|,\\\\d+|\\\\d+)\\\\}\\\\??\",\"name\":\"keyword.operator.quantifier.regexp\"},{\"match\":\"\\\\|\",\"name\":\"keyword.operator.or.regexp\"},{\"begin\":\"(\\\\()((\\\\?=)|(\\\\?!)|(\\\\?<=)|(\\\\?<!))\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.group.regexp\"},\"2\":{\"name\":\"punctuation.definition.group.assertion.regexp\"},\"3\":{\"name\":\"meta.assertion.look-ahead.regexp\"},\"4\":{\"name\":\"meta.assertion.negative-look-ahead.regexp\"},\"5\":{\"name\":\"meta.assertion.look-behind.regexp\"},\"6\":{\"name\":\"meta.assertion.negative-look-behind.regexp\"}},\"end\":\"(\\\\))\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.group.regexp\"}},\"name\":\"meta.group.assertion.regexp\",\"patterns\":[{\"include\":\"#regexp\"}]},{\"begin\":\"\\\\((?:(\\\\?:)|(?:\\\\?<([a-zA-Z_$][\\\\w$]*)>))?\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.group.regexp\"},\"1\":{\"name\":\"punctuation.definition.group.no-capture.regexp\"},\"2\":{\"name\":\"variable.other.regexp\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.group.regexp\"}},\"name\":\"meta.group.regexp\",\"patterns\":[{\"include\":\"#regexp\"}]},{\"begin\":\"(\\\\[)(\\\\^)?\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.character-class.regexp\"},\"2\":{\"name\":\"keyword.operator.negation.regexp\"}},\"end\":\"(\\\\])\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.character-class.regexp\"}},\"name\":\"constant.other.character-class.set.regexp\",\"patterns\":[{\"captures\":{\"1\":{\"name\":\"constant.character.numeric.regexp\"},\"2\":{\"name\":\"constant.character.control.regexp\"},\"3\":{\"name\":\"constant.character.escape.backslash.regexp\"},\"4\":{\"name\":\"constant.character.numeric.regexp\"},\"5\":{\"name\":\"constant.character.control.regexp\"},\"6\":{\"name\":\"constant.character.escape.backslash.regexp\"}},\"match\":\"(?:.|(\\\\\\\\(?:[0-7]{3}|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}))|(\\\\\\\\c[A-Z])|(\\\\\\\\.))-(?:[^\\\\]\\\\\\\\]|(\\\\\\\\(?:[0-7]{3}|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}))|(\\\\\\\\c[A-Z])|(\\\\\\\\.))\",\"name\":\"constant.other.character-class.range.regexp\"},{\"include\":\"#regex-character-class\"}]},{\"include\":\"#regex-character-class\"}]},\"return-type\":{\"patterns\":[{\"begin\":\"(?<=\\\\))\\\\s*(:)(?=\\\\s*\\\\S)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.type.annotation.js\"}},\"end\":\"(?<![:|&])(?=$|^|[{};,]|//)\",\"name\":\"meta.return.type.js\",\"patterns\":[{\"include\":\"#return-type-core\"}]},{\"begin\":\"(?<=\\\\))\\\\s*(:)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.type.annotation.js\"}},\"end\":\"(?<![:|&])((?=[{};,]|//|^\\\\s*$)|((?<=\\\\S)(?=\\\\s*$)))\",\"name\":\"meta.return.type.js\",\"patterns\":[{\"include\":\"#return-type-core\"}]}]},\"return-type-core\":{\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"(?<=[:|&])(?=\\\\s*\\\\{)\",\"end\":\"(?<=\\\\})\",\"patterns\":[{\"include\":\"#type-object\"}]},{\"include\":\"#type-predicate-operator\"},{\"include\":\"#type\"}]},\"shebang\":{\"captures\":{\"1\":{\"name\":\"punctuation.definition.comment.js\"}},\"match\":\"\\\\A(#!).*(?=$)\",\"name\":\"comment.line.shebang.js\"},\"single-line-comment-consuming-line-ending\":{\"begin\":\"(^[ \\\\t]+)?((//)(?:\\\\s*((@)internal)(?=\\\\s|$))?)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.whitespace.comment.leading.js\"},\"2\":{\"name\":\"comment.line.double-slash.js\"},\"3\":{\"name\":\"punctuation.definition.comment.js\"},\"4\":{\"name\":\"storage.type.internaldeclaration.js\"},\"5\":{\"name\":\"punctuation.decorator.internaldeclaration.js\"}},\"contentName\":\"comment.line.double-slash.js\",\"end\":\"(?=^)\"},\"statements\":{\"patterns\":[{\"include\":\"#declaration\"},{\"include\":\"#control-statement\"},{\"include\":\"#after-operator-block-as-object-literal\"},{\"include\":\"#decl-block\"},{\"include\":\"#label\"},{\"include\":\"#expression\"},{\"include\":\"#punctuation-semicolon\"},{\"include\":\"#string\"},{\"include\":\"#comment\"}]},\"string\":{\"patterns\":[{\"include\":\"#qstring-single\"},{\"include\":\"#qstring-double\"},{\"include\":\"#template\"}]},\"string-character-escape\":{\"match\":\"\\\\\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|u\\\\{[0-9A-Fa-f]+\\\\}|[0-2][0-7]{0,2}|3[0-6][0-7]?|37[0-7]?|[4-7][0-7]?|.|$)\",\"name\":\"constant.character.escape.js\"},\"super-literal\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))super\\\\b(?!\\\\$)\",\"name\":\"variable.language.super.js\"},\"support-function-call-identifiers\":{\"patterns\":[{\"include\":\"#literal\"},{\"include\":\"#support-objects\"},{\"include\":\"#object-identifiers\"},{\"include\":\"#punctuation-accessor\"},{\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))import(?=\\\\s*[(]\\\\s*[\\\\\\\"\\\\'\\\\`]))\",\"name\":\"keyword.operator.expression.import.js\"}]},\"support-objects\":{\"patterns\":[{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(arguments)\\\\b(?!\\\\$)\",\"name\":\"variable.language.arguments.js\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(Promise)\\\\b(?!\\\\$)\",\"name\":\"support.class.promise.js\"},{\"captures\":{\"1\":{\"name\":\"keyword.control.import.js\"},\"2\":{\"name\":\"punctuation.accessor.js\"},\"3\":{\"name\":\"punctuation.accessor.optional.js\"},\"4\":{\"name\":\"support.variable.property.importmeta.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(import)\\\\s*(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*(meta)\\\\b(?!\\\\$)\"},{\"captures\":{\"1\":{\"name\":\"keyword.operator.new.js\"},\"2\":{\"name\":\"punctuation.accessor.js\"},\"3\":{\"name\":\"punctuation.accessor.optional.js\"},\"4\":{\"name\":\"support.variable.property.target.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(new)\\\\s*(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*(target)\\\\b(?!\\\\$)\"},{\"captures\":{\"1\":{\"name\":\"punctuation.accessor.js\"},\"2\":{\"name\":\"punctuation.accessor.optional.js\"},\"3\":{\"name\":\"support.variable.property.js\"},\"4\":{\"name\":\"support.constant.js\"}},\"match\":\"(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*(?:(?:(constructor|length|prototype|__proto__)\\\\b(?!\\\\$|\\\\s*(<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\())|(?:(EPSILON|MAX_SAFE_INTEGER|MAX_VALUE|MIN_SAFE_INTEGER|MIN_VALUE|NEGATIVE_INFINITY|POSITIVE_INFINITY)\\\\b(?!\\\\$)))\"},{\"captures\":{\"1\":{\"name\":\"support.type.object.module.js\"},\"2\":{\"name\":\"support.type.object.module.js\"},\"3\":{\"name\":\"punctuation.accessor.js\"},\"4\":{\"name\":\"punctuation.accessor.optional.js\"},\"5\":{\"name\":\"support.type.object.module.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(exports)|(module)(?:(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))(exports|id|filename|loaded|parent|children))?)\\\\b(?!\\\\$)\"}]},\"switch-statement\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?=\\\\bswitch\\\\s*\\\\()\",\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"name\":\"switch-statement.expr.js\",\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(switch)\\\\s*(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.switch.js\"},\"2\":{\"name\":\"meta.brace.round.js\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"name\":\"switch-expression.expr.js\",\"patterns\":[{\"include\":\"#expression\"}]},{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"end\":\"(?=\\\\})\",\"name\":\"switch-block.expr.js\",\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(case|default(?=:))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.switch.js\"}},\"end\":\"(?=:)\",\"name\":\"case-clause.expr.js\",\"patterns\":[{\"include\":\"#expression\"}]},{\"begin\":\"(:)\\\\s*(\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"case-clause.expr.js punctuation.definition.section.case-statement.js\"},\"2\":{\"name\":\"meta.block.js punctuation.definition.block.js\"}},\"contentName\":\"meta.block.js\",\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"meta.block.js punctuation.definition.block.js\"}},\"patterns\":[{\"include\":\"#statements\"}]},{\"captures\":{\"0\":{\"name\":\"case-clause.expr.js punctuation.definition.section.case-statement.js\"}},\"match\":\"(:)\"},{\"include\":\"#statements\"}]}]},\"template\":{\"patterns\":[{\"include\":\"#template-call\"},{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)?(`)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.function.tagged-template.js\"},\"2\":{\"name\":\"string.template.js punctuation.definition.string.template.begin.js\"}},\"contentName\":\"string.template.js\",\"end\":\"`\",\"endCaptures\":{\"0\":{\"name\":\"string.template.js punctuation.definition.string.template.end.js\"}},\"patterns\":[{\"include\":\"#template-substitution-element\"},{\"include\":\"#string-character-escape\"}]}]},\"template-call\":{\"patterns\":[{\"begin\":\"(?=(([_$A-Za-z][_$0-9A-Za-z]*\\\\s*\\\\??\\\\.\\\\s*)*|(\\\\??\\\\.\\\\s*)?)([_$A-Za-z][_$0-9A-Za-z]*)(<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))(([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>)*(?<!=)>))*(?<!=)>)*(?<!=)>\\\\s*)?`)\",\"end\":\"(?=`)\",\"patterns\":[{\"begin\":\"(?=(([_$A-Za-z][_$0-9A-Za-z]*\\\\s*\\\\??\\\\.\\\\s*)*|(\\\\??\\\\.\\\\s*)?)([_$A-Za-z][_$0-9A-Za-z]*))\",\"end\":\"(?=(<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))(([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>)*(?<!=)>))*(?<!=)>)*(?<!=)>\\\\s*)?`)\",\"patterns\":[{\"include\":\"#support-function-call-identifiers\"},{\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\",\"name\":\"entity.name.function.tagged-template.js\"}]},{\"include\":\"#type-arguments\"}]},{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)?\\\\s*(?=(<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))(([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>)*(?<!=)>))*(?<!=)>)*(?<!=)>\\\\s*)`)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.function.tagged-template.js\"}},\"end\":\"(?=`)\",\"patterns\":[{\"include\":\"#type-arguments\"}]}]},\"template-substitution-element\":{\"begin\":\"\\\\$\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.template-expression.begin.js\"}},\"contentName\":\"meta.embedded.line.js\",\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.template-expression.end.js\"}},\"name\":\"meta.template.expression.js\",\"patterns\":[{\"include\":\"#expression\"}]},\"template-type\":{\"patterns\":[{\"include\":\"#template-call\"},{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)?(`)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.function.tagged-template.js\"},\"2\":{\"name\":\"string.template.js punctuation.definition.string.template.begin.js\"}},\"contentName\":\"string.template.js\",\"end\":\"`\",\"endCaptures\":{\"0\":{\"name\":\"string.template.js punctuation.definition.string.template.end.js\"}},\"patterns\":[{\"include\":\"#template-type-substitution-element\"},{\"include\":\"#string-character-escape\"}]}]},\"template-type-substitution-element\":{\"begin\":\"\\\\$\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.template-expression.begin.js\"}},\"contentName\":\"meta.embedded.line.js\",\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.template-expression.end.js\"}},\"name\":\"meta.template.expression.js\",\"patterns\":[{\"include\":\"#type\"}]},\"ternary-expression\":{\"begin\":\"(?!\\\\?\\\\.\\\\s*[^\\\\d])(\\\\?)(?!\\\\?)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.ternary.js\"}},\"end\":\"\\\\s*(:)\",\"endCaptures\":{\"1\":{\"name\":\"keyword.operator.ternary.js\"}},\"patterns\":[{\"include\":\"#expression\"}]},\"this-literal\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))this\\\\b(?!\\\\$)\",\"name\":\"variable.language.this.js\"},\"type\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#type-string\"},{\"include\":\"#numeric-literal\"},{\"include\":\"#type-primitive\"},{\"include\":\"#type-builtin-literals\"},{\"include\":\"#type-parameters\"},{\"include\":\"#type-tuple\"},{\"include\":\"#type-object\"},{\"include\":\"#type-operators\"},{\"include\":\"#type-conditional\"},{\"include\":\"#type-fn-type-parameters\"},{\"include\":\"#type-paren-or-function-parameters\"},{\"include\":\"#type-function-return-type\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(readonly)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*\"},{\"include\":\"#type-name\"}]},\"type-alias-declaration\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(type)\\\\b\\\\s+([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"storage.type.type.js\"},\"4\":{\"name\":\"entity.name.type.alias.js\"}},\"end\":\"(?=\\\\}|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"name\":\"meta.type.declaration.js\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#type-parameters\"},{\"begin\":\"(=)\\\\s*(intrinsic)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.assignment.js\"},\"2\":{\"name\":\"keyword.control.intrinsic.js\"}},\"end\":\"(?=\\\\}|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"patterns\":[{\"include\":\"#type\"}]},{\"begin\":\"(=)\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.assignment.js\"}},\"end\":\"(?=\\\\}|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"patterns\":[{\"include\":\"#type\"}]}]},\"type-annotation\":{\"patterns\":[{\"begin\":\"(:)(?=\\\\s*\\\\S)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.type.annotation.js\"}},\"end\":\"(?<![:|&])(?!\\\\s*[|&]\\\\s+)((?=^|[,);}\\\\]]|//)|(?==[^>])|((?<=[}>\\\\])]|[_$A-Za-z])\\\\s*(?=\\\\{)))\",\"name\":\"meta.type.annotation.js\",\"patterns\":[{\"include\":\"#type\"}]},{\"begin\":\"(:)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.type.annotation.js\"}},\"end\":\"(?<![:|&])((?=[,);}\\\\]]|\\\\/\\\\/)|(?==[^>])|(?=^\\\\s*$)|((?<=[}>\\\\])]|[_$A-Za-z])\\\\s*(?=\\\\{)))\",\"name\":\"meta.type.annotation.js\",\"patterns\":[{\"include\":\"#type\"}]}]},\"type-arguments\":{\"begin\":\"<\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.typeparameters.begin.js\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.typeparameters.end.js\"}},\"name\":\"meta.type.parameters.js\",\"patterns\":[{\"include\":\"#type-arguments-body\"}]},\"type-arguments-body\":{\"patterns\":[{\"captures\":{\"0\":{\"name\":\"keyword.operator.type.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(_)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\"},{\"include\":\"#type\"},{\"include\":\"#punctuation-comma\"}]},\"type-builtin-literals\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(this|true|false|undefined|null|object)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"support.type.builtin.js\"},\"type-conditional\":{\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(extends)\\\\s+\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.js\"}},\"end\":\"(?<=:)\",\"patterns\":[{\"begin\":\"\\\\?\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.operator.ternary.js\"}},\"end\":\":\",\"endCaptures\":{\"0\":{\"name\":\"keyword.operator.ternary.js\"}},\"patterns\":[{\"include\":\"#type\"}]},{\"include\":\"#type\"}]}]},\"type-fn-type-parameters\":{\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(abstract)\\\\s+)?(new)\\\\b(?=\\\\s*<)\",\"beginCaptures\":{\"1\":{\"name\":\"meta.type.constructor.js storage.modifier.js\"},\"2\":{\"name\":\"meta.type.constructor.js keyword.control.new.js\"}},\"end\":\"(?<=>)\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#type-parameters\"}]},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(abstract)\\\\s+)?(new)\\\\b\\\\s*(?=\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.js\"},\"2\":{\"name\":\"keyword.control.new.js\"}},\"end\":\"(?<=\\\\))\",\"name\":\"meta.type.constructor.js\",\"patterns\":[{\"include\":\"#function-parameters\"}]},{\"begin\":\"((?=[(]\\\\s*(([)])|(\\\\.\\\\.\\\\.)|([_$0-9A-Za-z]+\\\\s*(([:,?=])|([)]\\\\s*=>))))))\",\"end\":\"(?<=\\\\))\",\"name\":\"meta.type.function.js\",\"patterns\":[{\"include\":\"#function-parameters\"}]}]},\"type-function-return-type\":{\"patterns\":[{\"begin\":\"(=>)(?=\\\\s*\\\\S)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.type.function.arrow.js\"}},\"end\":\"(?<!=>)(?<![|&])(?=[,\\\\]){}=;>:?]|//|$)\",\"name\":\"meta.type.function.return.js\",\"patterns\":[{\"include\":\"#type-function-return-type-core\"}]},{\"begin\":\"=>\",\"beginCaptures\":{\"0\":{\"name\":\"storage.type.function.arrow.js\"}},\"end\":\"(?<!=>)(?<![|&])((?=[,\\\\]){}=;:?>]|//|^\\\\s*$)|((?<=\\\\S)(?=\\\\s*$)))\",\"name\":\"meta.type.function.return.js\",\"patterns\":[{\"include\":\"#type-function-return-type-core\"}]}]},\"type-function-return-type-core\":{\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"(?<==>)(?=\\\\s*\\\\{)\",\"end\":\"(?<=\\\\})\",\"patterns\":[{\"include\":\"#type-object\"}]},{\"include\":\"#type-predicate-operator\"},{\"include\":\"#type\"}]},\"type-infer\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"keyword.operator.expression.infer.js\"},\"2\":{\"name\":\"entity.name.type.js\"},\"3\":{\"name\":\"keyword.operator.expression.extends.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(infer)\\\\s+([_$A-Za-z][_$0-9A-Za-z]*)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))(?:\\\\s+(extends)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))?\",\"name\":\"meta.type.infer.js\"}]},\"type-name\":{\"patterns\":[{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*(<)\",\"captures\":{\"1\":{\"name\":\"entity.name.type.module.js\"},\"2\":{\"name\":\"punctuation.accessor.js\"},\"3\":{\"name\":\"punctuation.accessor.optional.js\"},\"4\":{\"name\":\"meta.type.parameters.js punctuation.definition.typeparameters.begin.js\"}},\"contentName\":\"meta.type.parameters.js\",\"end\":\"(>)\",\"endCaptures\":{\"1\":{\"name\":\"meta.type.parameters.js punctuation.definition.typeparameters.end.js\"}},\"patterns\":[{\"include\":\"#type-arguments-body\"}]},{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(<)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.type.js\"},\"2\":{\"name\":\"meta.type.parameters.js punctuation.definition.typeparameters.begin.js\"}},\"contentName\":\"meta.type.parameters.js\",\"end\":\"(>)\",\"endCaptures\":{\"1\":{\"name\":\"meta.type.parameters.js punctuation.definition.typeparameters.end.js\"}},\"patterns\":[{\"include\":\"#type-arguments-body\"}]},{\"captures\":{\"1\":{\"name\":\"entity.name.type.module.js\"},\"2\":{\"name\":\"punctuation.accessor.js\"},\"3\":{\"name\":\"punctuation.accessor.optional.js\"}},\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\"},{\"match\":\"[_$A-Za-z][_$0-9A-Za-z]*\",\"name\":\"entity.name.type.js\"}]},\"type-object\":{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.js\"}},\"name\":\"meta.object.type.js\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#method-declaration\"},{\"include\":\"#indexer-declaration\"},{\"include\":\"#indexer-mapped-type-declaration\"},{\"include\":\"#field-declaration\"},{\"include\":\"#type-annotation\"},{\"begin\":\"\\\\.\\\\.\\\\.\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.operator.spread.js\"}},\"end\":\"(?=\\\\}|;|,|$)|(?<=\\\\})\",\"patterns\":[{\"include\":\"#type\"}]},{\"include\":\"#punctuation-comma\"},{\"include\":\"#punctuation-semicolon\"},{\"include\":\"#type\"}]},\"type-operators\":{\"patterns\":[{\"include\":\"#typeof-operator\"},{\"include\":\"#type-infer\"},{\"begin\":\"([&|])(?=\\\\s*\\\\{)\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.operator.type.js\"}},\"end\":\"(?<=\\\\})\",\"patterns\":[{\"include\":\"#type-object\"}]},{\"begin\":\"[&|]\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.operator.type.js\"}},\"end\":\"(?=\\\\S)\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))keyof(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.operator.expression.keyof.js\"},{\"match\":\"(\\\\?|:)\",\"name\":\"keyword.operator.ternary.js\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))import(?=\\\\s*\\\\()\",\"name\":\"keyword.operator.expression.import.js\"}]},\"type-parameters\":{\"begin\":\"(<)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.typeparameters.begin.js\"}},\"end\":\"(>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.typeparameters.end.js\"}},\"name\":\"meta.type.parameters.js\",\"patterns\":[{\"include\":\"#comment\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(extends|in|out|const)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"storage.modifier.js\"},{\"include\":\"#type\"},{\"include\":\"#punctuation-comma\"},{\"match\":\"(=)(?!>)\",\"name\":\"keyword.operator.assignment.js\"}]},\"type-paren-or-function-parameters\":{\"begin\":\"\\\\(\",\"beginCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.js\"}},\"name\":\"meta.type.paren.cover.js\",\"patterns\":[{\"captures\":{\"1\":{\"name\":\"storage.modifier.js\"},\"2\":{\"name\":\"keyword.operator.rest.js\"},\"3\":{\"name\":\"entity.name.function.js variable.language.this.js\"},\"4\":{\"name\":\"entity.name.function.js\"},\"5\":{\"name\":\"keyword.operator.optional.js\"}},\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(public|private|protected|readonly)\\\\s+)?(?:(\\\\.\\\\.\\\\.)\\\\s*)?(?<!=|:)(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))\\\\s*(\\\\??)(?=\\\\s*(:\\\\s*((<)|([(]\\\\s*(([)])|(\\\\.\\\\.\\\\.)|([_$0-9A-Za-z]+\\\\s*(([:,?=])|([)]\\\\s*=>)))))))|(:\\\\s*(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))Function(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|(:\\\\s*((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))))\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.js\"},\"2\":{\"name\":\"keyword.operator.rest.js\"},\"3\":{\"name\":\"variable.parameter.js variable.language.this.js\"},\"4\":{\"name\":\"variable.parameter.js\"},\"5\":{\"name\":\"keyword.operator.optional.js\"}},\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(public|private|protected|readonly)\\\\s+)?(?:(\\\\.\\\\.\\\\.)\\\\s*)?(?<!=|:)(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))\\\\s*(\\\\??)(?=:)\"},{\"include\":\"#type-annotation\"},{\"match\":\",\",\"name\":\"punctuation.separator.parameter.js\"},{\"include\":\"#type\"}]},\"type-predicate-operator\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"keyword.operator.type.asserts.js\"},\"2\":{\"name\":\"variable.parameter.js variable.language.this.js\"},\"3\":{\"name\":\"variable.parameter.js\"},\"4\":{\"name\":\"keyword.operator.expression.is.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(asserts)\\\\s+)?(?!asserts)(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))\\\\s(is)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\"},{\"captures\":{\"1\":{\"name\":\"keyword.operator.type.asserts.js\"},\"2\":{\"name\":\"variable.parameter.js variable.language.this.js\"},\"3\":{\"name\":\"variable.parameter.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(asserts)\\\\s+(?!is)(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))asserts(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.operator.type.asserts.js\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))is(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.operator.expression.is.js\"}]},\"type-primitive\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(string|number|bigint|boolean|symbol|any|void|never|unknown)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"support.type.primitive.js\"},\"type-string\":{\"patterns\":[{\"include\":\"#qstring-single\"},{\"include\":\"#qstring-double\"},{\"include\":\"#template-type\"}]},\"type-tuple\":{\"begin\":\"\\\\[\",\"beginCaptures\":{\"0\":{\"name\":\"meta.brace.square.js\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.square.js\"}},\"name\":\"meta.type.tuple.js\",\"patterns\":[{\"match\":\"\\\\.\\\\.\\\\.\",\"name\":\"keyword.operator.rest.js\"},{\"captures\":{\"1\":{\"name\":\"entity.name.label.js\"},\"2\":{\"name\":\"keyword.operator.optional.js\"},\"3\":{\"name\":\"punctuation.separator.label.js\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(\\\\?)?\\\\s*(:)\"},{\"include\":\"#type\"},{\"include\":\"#punctuation-comma\"}]},\"typeof-operator\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))typeof(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.operator.expression.typeof.js\"}},\"end\":\"(?=[,);}\\\\]=>:&|{?]|(extends\\\\s+)|$|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"patterns\":[{\"include\":\"#type-arguments\"},{\"include\":\"#expression\"}]},\"undefined-literal\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))undefined(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"constant.language.undefined.js\"},\"var-expr\":{\"patterns\":[{\"begin\":\"(?=(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(var|let)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))\",\"end\":\"(?!(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(var|let)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))((?=^|;|}|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))|((?<!^let|[^\\\\._$0-9A-Za-z]let|^var|[^\\\\._$0-9A-Za-z]var)(?=\\\\s*$)))\",\"name\":\"meta.var.expr.js\",\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(var|let)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"storage.type.js\"}},\"end\":\"(?=\\\\S)\"},{\"include\":\"#destructuring-variable\"},{\"include\":\"#var-single-variable\"},{\"include\":\"#variable-initializer\"},{\"include\":\"#comment\"},{\"begin\":\"(,)\\\\s*(?=$|\\\\/\\\\/)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.separator.comma.js\"}},\"end\":\"(?<!,)(((?==|;|}|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|^\\\\s*$))|((?<=\\\\S)(?=\\\\s*$)))\",\"patterns\":[{\"include\":\"#single-line-comment-consuming-line-ending\"},{\"include\":\"#comment\"},{\"include\":\"#destructuring-variable\"},{\"include\":\"#var-single-variable\"},{\"include\":\"#punctuation-comma\"}]},{\"include\":\"#punctuation-comma\"}]},{\"begin\":\"(?=(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(const(?!\\\\s+enum\\\\b))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"storage.type.js\"}},\"end\":\"(?!(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(const(?!\\\\s+enum\\\\b))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))((?=^|;|}|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))|((?<!^const|[^\\\\._$0-9A-Za-z]const)(?=\\\\s*$)))\",\"name\":\"meta.var.expr.js\",\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(const(?!\\\\s+enum\\\\b))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"storage.type.js\"}},\"end\":\"(?=\\\\S)\"},{\"include\":\"#destructuring-const\"},{\"include\":\"#var-single-const\"},{\"include\":\"#variable-initializer\"},{\"include\":\"#comment\"},{\"begin\":\"(,)\\\\s*(?=$|\\\\/\\\\/)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.separator.comma.js\"}},\"end\":\"(?<!,)(((?==|;|}|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|^\\\\s*$))|((?<=\\\\S)(?=\\\\s*$)))\",\"patterns\":[{\"include\":\"#single-line-comment-consuming-line-ending\"},{\"include\":\"#comment\"},{\"include\":\"#destructuring-const\"},{\"include\":\"#var-single-const\"},{\"include\":\"#punctuation-comma\"}]},{\"include\":\"#punctuation-comma\"}]},{\"begin\":\"(?=(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b((?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"storage.type.js\"}},\"end\":\"(?!(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b((?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))((?=;|}|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))|((?<!^using|[^\\\\._$0-9A-Za-z]using|^await\\\\s+using|[^\\\\._$0-9A-Za-z]await\\\\s+using)(?=\\\\s*$)))\",\"name\":\"meta.var.expr.js\",\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b((?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.js\"},\"2\":{\"name\":\"storage.modifier.js\"},\"3\":{\"name\":\"storage.type.js\"}},\"end\":\"(?=\\\\S)\"},{\"include\":\"#var-single-const\"},{\"include\":\"#variable-initializer\"},{\"include\":\"#comment\"},{\"begin\":\"(,)\\\\s*((?!\\\\S)|(?=\\\\/\\\\/))\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.separator.comma.js\"}},\"end\":\"(?<!,)(((?==|;|}|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|^\\\\s*$))|((?<=\\\\S)(?=\\\\s*$)))\",\"patterns\":[{\"include\":\"#single-line-comment-consuming-line-ending\"},{\"include\":\"#comment\"},{\"include\":\"#var-single-const\"},{\"include\":\"#punctuation-comma\"}]},{\"include\":\"#punctuation-comma\"}]}]},\"var-single-const\":{\"patterns\":[{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)(?=\\\\s*(=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|([<]\\\\s*[_$A-Za-z][_$0-9A-Za-z]*\\\\s+extends\\\\s*[^=>])|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>)))))|(:\\\\s*((<)|([(]\\\\s*(([)])|(\\\\.\\\\.\\\\.)|([_$0-9A-Za-z]+\\\\s*(([:,?=])|([)]\\\\s*=>)))))))|(:\\\\s*(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))Function(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|(:\\\\s*((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))))|(:\\\\s*(=>|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(<[^<>]*>)|[^<>(),=])+=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|([<]\\\\s*[_$A-Za-z][_$0-9A-Za-z]*\\\\s+extends\\\\s*[^=>])|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>))))))\",\"beginCaptures\":{\"1\":{\"name\":\"meta.definition.variable.js variable.other.constant.js entity.name.function.js\"}},\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|(;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b)))\",\"name\":\"meta.var-single-variable.expr.js\",\"patterns\":[{\"include\":\"#var-single-variable-type-annotation\"}]},{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)\",\"beginCaptures\":{\"1\":{\"name\":\"meta.definition.variable.js variable.other.constant.js\"}},\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|(;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b)))\",\"name\":\"meta.var-single-variable.expr.js\",\"patterns\":[{\"include\":\"#var-single-variable-type-annotation\"}]}]},\"var-single-variable\":{\"patterns\":[{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)(!)?(?=\\\\s*(=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|([<]\\\\s*[_$A-Za-z][_$0-9A-Za-z]*\\\\s+extends\\\\s*[^=>])|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>)))))|(:\\\\s*((<)|([(]\\\\s*(([)])|(\\\\.\\\\.\\\\.)|([_$0-9A-Za-z]+\\\\s*(([:,?=])|([)]\\\\s*=>)))))))|(:\\\\s*(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))Function(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|(:\\\\s*((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))))|(:\\\\s*(=>|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(<[^<>]*>)|[^<>(),=])+=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|([(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|([<]\\\\s*[_$A-Za-z][_$0-9A-Za-z]*\\\\s+extends\\\\s*[^=>])|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>))))))\",\"beginCaptures\":{\"1\":{\"name\":\"meta.definition.variable.js entity.name.function.js\"},\"2\":{\"name\":\"keyword.operator.definiteassignment.js\"}},\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|(;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b)))\",\"name\":\"meta.var-single-variable.expr.js\",\"patterns\":[{\"include\":\"#var-single-variable-type-annotation\"}]},{\"begin\":\"([A-Z][_$\\\\dA-Z]*)(?![_$0-9A-Za-z])(!)?\",\"beginCaptures\":{\"1\":{\"name\":\"meta.definition.variable.js variable.other.constant.js\"},\"2\":{\"name\":\"keyword.operator.definiteassignment.js\"}},\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|(;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b)))\",\"name\":\"meta.var-single-variable.expr.js\",\"patterns\":[{\"include\":\"#var-single-variable-type-annotation\"}]},{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)(!)?\",\"beginCaptures\":{\"1\":{\"name\":\"meta.definition.variable.js variable.other.readwrite.js\"},\"2\":{\"name\":\"keyword.operator.definiteassignment.js\"}},\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|(;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b)))\",\"name\":\"meta.var-single-variable.expr.js\",\"patterns\":[{\"include\":\"#var-single-variable-type-annotation\"}]}]},\"var-single-variable-type-annotation\":{\"patterns\":[{\"include\":\"#type-annotation\"},{\"include\":\"#string\"},{\"include\":\"#comment\"}]},\"variable-initializer\":{\"patterns\":[{\"begin\":\"(?<!=|!)(=)(?!=)(?=\\\\s*\\\\S)(?!\\\\s*.*=>\\\\s*$)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.assignment.js\"}},\"end\":\"(?=$|^|[,);}\\\\]]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+))\",\"patterns\":[{\"include\":\"#expression\"}]},{\"begin\":\"(?<!=|!)(=)(?!=)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.assignment.js\"}},\"end\":\"(?=[,);}\\\\]]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+))|(?=^\\\\s*$)|(?<![\\\\|\\\\&+\\\\-\\\\*\\\\/])(?<=\\\\S)(?<!=)(?=\\\\s*$)\",\"patterns\":[{\"include\":\"#expression\"}]}]}},\"scopeName\":\"source.js\",\"aliases\":[\"js\"]}"));

const javascript = [
  lang$a
];

const lang$9 = Object.freeze(JSON.parse("{\"displayName\":\"CSS\",\"name\":\"css\",\"patterns\":[{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"},{\"include\":\"#combinators\"},{\"include\":\"#selector\"},{\"include\":\"#at-rules\"},{\"include\":\"#rule-list\"}],\"repository\":{\"at-rules\":{\"patterns\":[{\"begin\":\"\\\\A(?:\\\\xEF\\\\xBB\\\\xBF)?(?i:(?=\\\\s*@charset\\\\b))\",\"end\":\";|(?=$)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.terminator.rule.css\"}},\"name\":\"meta.at-rule.charset.css\",\"patterns\":[{\"captures\":{\"1\":{\"name\":\"invalid.illegal.not-lowercase.charset.css\"},\"2\":{\"name\":\"invalid.illegal.leading-whitespace.charset.css\"},\"3\":{\"name\":\"invalid.illegal.no-whitespace.charset.css\"},\"4\":{\"name\":\"invalid.illegal.whitespace.charset.css\"},\"5\":{\"name\":\"invalid.illegal.not-double-quoted.charset.css\"},\"6\":{\"name\":\"invalid.illegal.unclosed-string.charset.css\"},\"7\":{\"name\":\"invalid.illegal.unexpected-characters.charset.css\"}},\"match\":\"\\\\G((?!@charset)@\\\\w+)|\\\\G(\\\\s+)|(@charset\\\\S[^;]*)|(?<=@charset)(\\\\x20{2,}|\\\\t+)|(?<=@charset\\\\x20)([^\\\";]+)|(\\\"[^\\\"]+$)|(?<=\\\")([^;]+)\"},{\"captures\":{\"1\":{\"name\":\"keyword.control.at-rule.charset.css\"},\"2\":{\"name\":\"punctuation.definition.keyword.css\"}},\"match\":\"((@)charset)(?=\\\\s)\"},{\"begin\":\"\\\"\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.css\"}},\"end\":\"\\\"|$\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.css\"}},\"name\":\"string.quoted.double.css\",\"patterns\":[{\"begin\":\"(?:\\\\G|^)(?=(?:[^\\\"])+$)\",\"end\":\"$\",\"name\":\"invalid.illegal.unclosed.string.css\"}]}]},{\"begin\":\"(?i)((@)import)(?:\\\\s+|$|(?=['\\\"]|/\\\\*))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.at-rule.import.css\"},\"2\":{\"name\":\"punctuation.definition.keyword.css\"}},\"end\":\";\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.terminator.rule.css\"}},\"name\":\"meta.at-rule.import.css\",\"patterns\":[{\"begin\":\"\\\\G\\\\s*(?=/\\\\*)\",\"end\":\"(?<=\\\\*/)\\\\s*\",\"patterns\":[{\"include\":\"#comment-block\"}]},{\"include\":\"#string\"},{\"include\":\"#url\"},{\"include\":\"#media-query-list\"}]},{\"begin\":\"(?i)((@)font-face)(?=\\\\s*|{|/\\\\*|$)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.at-rule.font-face.css\"},\"2\":{\"name\":\"punctuation.definition.keyword.css\"}},\"end\":\"(?!\\\\G)\",\"name\":\"meta.at-rule.font-face.css\",\"patterns\":[{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"},{\"include\":\"#rule-list\"}]},{\"begin\":\"(?i)(@)page(?=[\\\\s:{]|/\\\\*|$)\",\"captures\":{\"0\":{\"name\":\"keyword.control.at-rule.page.css\"},\"1\":{\"name\":\"punctuation.definition.keyword.css\"}},\"end\":\"(?=\\\\s*($|[:{;]))\",\"name\":\"meta.at-rule.page.css\",\"patterns\":[{\"include\":\"#rule-list\"}]},{\"begin\":\"(?i)(?=@media(\\\\s|\\\\(|/\\\\*|$))\",\"end\":\"(?<=})(?!\\\\G)\",\"patterns\":[{\"begin\":\"(?i)\\\\G(@)media\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.control.at-rule.media.css\"},\"1\":{\"name\":\"punctuation.definition.keyword.css\"}},\"end\":\"(?=\\\\s*[{;])\",\"name\":\"meta.at-rule.media.header.css\",\"patterns\":[{\"include\":\"#media-query-list\"}]},{\"begin\":\"{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.section.media.begin.bracket.curly.css\"}},\"end\":\"}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.media.end.bracket.curly.css\"}},\"name\":\"meta.at-rule.media.body.css\",\"patterns\":[{\"include\":\"$self\"}]}]},{\"begin\":\"(?i)(?=@counter-style([\\\\s'\\\"{;]|/\\\\*|$))\",\"end\":\"(?<=})(?!\\\\G)\",\"patterns\":[{\"begin\":\"(?i)\\\\G(@)counter-style\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.control.at-rule.counter-style.css\"},\"1\":{\"name\":\"punctuation.definition.keyword.css\"}},\"end\":\"(?=\\\\s*{)\",\"name\":\"meta.at-rule.counter-style.header.css\",\"patterns\":[{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"},{\"captures\":{\"0\":{\"patterns\":[{\"include\":\"#escapes\"}]}},\"match\":\"(?:[-a-zA-Z_]|[^\\\\x00-\\\\x7F])(?:[-a-zA-Z0-9_]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))*\",\"name\":\"variable.parameter.style-name.css\"}]},{\"begin\":\"{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.section.property-list.begin.bracket.curly.css\"}},\"end\":\"}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.property-list.end.bracket.curly.css\"}},\"name\":\"meta.at-rule.counter-style.body.css\",\"patterns\":[{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"},{\"include\":\"#rule-list-innards\"}]}]},{\"begin\":\"(?i)(?=@document([\\\\s'\\\"{;]|/\\\\*|$))\",\"end\":\"(?<=})(?!\\\\G)\",\"patterns\":[{\"begin\":\"(?i)\\\\G(@)document\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.control.at-rule.document.css\"},\"1\":{\"name\":\"punctuation.definition.keyword.css\"}},\"end\":\"(?=\\\\s*[{;])\",\"name\":\"meta.at-rule.document.header.css\",\"patterns\":[{\"begin\":\"(?i)(?<![\\\\w-])(url-prefix|domain|regexp)(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"support.function.document-rule.css\"},\"2\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"name\":\"meta.function.document-rule.css\",\"patterns\":[{\"include\":\"#string\"},{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"},{\"match\":\"[^'\\\")\\\\s]+\",\"name\":\"variable.parameter.document-rule.css\"}]},{\"include\":\"#url\"},{\"include\":\"#commas\"},{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"}]},{\"begin\":\"{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.section.document.begin.bracket.curly.css\"}},\"end\":\"}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.document.end.bracket.curly.css\"}},\"name\":\"meta.at-rule.document.body.css\",\"patterns\":[{\"include\":\"$self\"}]}]},{\"begin\":\"(?i)(?=@(?:-(?:webkit|moz|o|ms)-)?keyframes([\\\\s'\\\"{;]|/\\\\*|$))\",\"end\":\"(?<=})(?!\\\\G)\",\"patterns\":[{\"begin\":\"(?i)\\\\G(@)(?:-(?:webkit|moz|o|ms)-)?keyframes\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.control.at-rule.keyframes.css\"},\"1\":{\"name\":\"punctuation.definition.keyword.css\"}},\"end\":\"(?=\\\\s*{)\",\"name\":\"meta.at-rule.keyframes.header.css\",\"patterns\":[{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"},{\"captures\":{\"0\":{\"patterns\":[{\"include\":\"#escapes\"}]}},\"match\":\"(?:[-a-zA-Z_]|[^\\\\x00-\\\\x7F])(?:[-a-zA-Z0-9_]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))*\",\"name\":\"variable.parameter.keyframe-list.css\"}]},{\"begin\":\"{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.section.keyframes.begin.bracket.curly.css\"}},\"end\":\"}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.keyframes.end.bracket.curly.css\"}},\"name\":\"meta.at-rule.keyframes.body.css\",\"patterns\":[{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"},{\"captures\":{\"1\":{\"name\":\"entity.other.keyframe-offset.css\"},\"2\":{\"name\":\"entity.other.keyframe-offset.percentage.css\"}},\"match\":\"(?i)(?<![\\\\w-])(from|to)(?![\\\\w-])|([-+]?(?:\\\\d+(?:\\\\.\\\\d+)?|\\\\.\\\\d+)%)\"},{\"include\":\"#rule-list\"}]}]},{\"begin\":\"(?i)(?=@supports(\\\\s|\\\\(|/\\\\*|$))\",\"end\":\"(?<=})(?!\\\\G)|(?=;)\",\"patterns\":[{\"begin\":\"(?i)\\\\G(@)supports\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.control.at-rule.supports.css\"},\"1\":{\"name\":\"punctuation.definition.keyword.css\"}},\"end\":\"(?=\\\\s*[{;])\",\"name\":\"meta.at-rule.supports.header.css\",\"patterns\":[{\"include\":\"#feature-query-operators\"},{\"include\":\"#feature-query\"},{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"}]},{\"begin\":\"{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.section.supports.begin.bracket.curly.css\"}},\"end\":\"}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.supports.end.bracket.curly.css\"}},\"name\":\"meta.at-rule.supports.body.css\",\"patterns\":[{\"include\":\"$self\"}]}]},{\"begin\":\"(?i)((@)(-(ms|o)-)?viewport)(?=[\\\\s'\\\"{;]|/\\\\*|$)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.at-rule.viewport.css\"},\"2\":{\"name\":\"punctuation.definition.keyword.css\"}},\"end\":\"(?=\\\\s*[@{;])\",\"name\":\"meta.at-rule.viewport.css\",\"patterns\":[{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"}]},{\"begin\":\"(?i)((@)font-feature-values)(?=[\\\\s'\\\"{;]|/\\\\*|$)\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.at-rule.font-feature-values.css\"},\"2\":{\"name\":\"punctuation.definition.keyword.css\"}},\"contentName\":\"variable.parameter.font-name.css\",\"end\":\"(?=\\\\s*[@{;])\",\"name\":\"meta.at-rule.font-features.css\",\"patterns\":[{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"}]},{\"include\":\"#font-features\"},{\"begin\":\"(?i)((@)namespace)(?=[\\\\s'\\\";]|/\\\\*|$)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.at-rule.namespace.css\"},\"2\":{\"name\":\"punctuation.definition.keyword.css\"}},\"end\":\";|(?=[@{])\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.terminator.rule.css\"}},\"name\":\"meta.at-rule.namespace.css\",\"patterns\":[{\"include\":\"#url\"},{\"captures\":{\"1\":{\"patterns\":[{\"include\":\"#comment-block\"}]},\"2\":{\"name\":\"entity.name.function.namespace-prefix.css\",\"patterns\":[{\"include\":\"#escapes\"}]}},\"match\":\"(?i)(?:\\\\G|^|(?<=\\\\s))(?=(?<=\\\\s|^)(?:[-a-zA-Z_]|[^\\\\x00-\\\\x7F])|\\\\s*/\\\\*(?:[^*]|\\\\*[^/])*\\\\*/)(.*?)((?:[-a-zA-Z_]|[^\\\\x00-\\\\x7F])(?:[-a-zA-Z0-9_]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))*)\"},{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"},{\"include\":\"#string\"}]},{\"begin\":\"(?i)(?=@[\\\\w-]+[^;]+;s*$)\",\"end\":\"(?<=;)(?!\\\\G)\",\"patterns\":[{\"begin\":\"(?i)\\\\G(@)[\\\\w-]+\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.control.at-rule.css\"},\"1\":{\"name\":\"punctuation.definition.keyword.css\"}},\"end\":\";\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.terminator.rule.css\"}},\"name\":\"meta.at-rule.header.css\"}]},{\"begin\":\"(?i)(?=@[\\\\w-]+(\\\\s|\\\\(|{|/\\\\*|$))\",\"end\":\"(?<=})(?!\\\\G)\",\"patterns\":[{\"begin\":\"(?i)\\\\G(@)[\\\\w-]+\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.control.at-rule.css\"},\"1\":{\"name\":\"punctuation.definition.keyword.css\"}},\"end\":\"(?=\\\\s*[{;])\",\"name\":\"meta.at-rule.header.css\"},{\"begin\":\"{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.section.begin.bracket.curly.css\"}},\"end\":\"}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.end.bracket.curly.css\"}},\"name\":\"meta.at-rule.body.css\",\"patterns\":[{\"include\":\"$self\"}]}]}]},\"color-keywords\":{\"patterns\":[{\"match\":\"(?i)(?<![\\\\w-])(aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow)(?![\\\\w-])\",\"name\":\"support.constant.color.w3c-standard-color-name.css\"},{\"match\":\"(?i)(?<![\\\\w-])(aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|magenta|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rebeccapurple|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|transparent|turquoise|violet|wheat|whitesmoke|yellowgreen)(?![\\\\w-])\",\"name\":\"support.constant.color.w3c-extended-color-name.css\"},{\"match\":\"(?i)(?<![\\\\w-])currentColor(?![\\\\w-])\",\"name\":\"support.constant.color.current.css\"},{\"match\":\"(?i)(?<![\\\\w-])(ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonFace|ButtonHighlight|ButtonShadow|ButtonText|CaptionText|GrayText|Highlight|HighlightText|InactiveBorder|InactiveCaption|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText)(?![\\\\w-])\",\"name\":\"invalid.deprecated.color.system.css\"}]},\"combinators\":{\"patterns\":[{\"match\":\"/deep/|>>>\",\"name\":\"invalid.deprecated.combinator.css\"},{\"match\":\">>|>|\\\\+|~\",\"name\":\"keyword.operator.combinator.css\"}]},\"commas\":{\"match\":\",\",\"name\":\"punctuation.separator.list.comma.css\"},\"comment-block\":{\"begin\":\"/\\\\*\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.begin.css\"}},\"end\":\"\\\\*/\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.end.css\"}},\"name\":\"comment.block.css\"},\"escapes\":{\"patterns\":[{\"match\":\"\\\\\\\\[0-9a-fA-F]{1,6}\",\"name\":\"constant.character.escape.codepoint.css\"},{\"begin\":\"\\\\\\\\$\\\\s*\",\"end\":\"^(?<!\\\\G)\",\"name\":\"constant.character.escape.newline.css\"},{\"match\":\"\\\\\\\\.\",\"name\":\"constant.character.escape.css\"}]},\"feature-query\":{\"begin\":\"\\\\(\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.condition.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.condition.end.bracket.round.css\"}},\"name\":\"meta.feature-query.css\",\"patterns\":[{\"include\":\"#feature-query-operators\"},{\"include\":\"#feature-query\"}]},\"feature-query-operators\":{\"patterns\":[{\"match\":\"(?i)(?<=[\\\\s()]|^|\\\\*/)(and|not|or)(?=[\\\\s()]|/\\\\*|$)\",\"name\":\"keyword.operator.logical.feature.$1.css\"},{\"include\":\"#rule-list-innards\"}]},\"font-features\":{\"begin\":\"(?i)((@)(annotation|character-variant|ornaments|styleset|stylistic|swash))(?=[\\\\s@'\\\"{;]|/\\\\*|$)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.at-rule.${3:/downcase}.css\"},\"2\":{\"name\":\"punctuation.definition.keyword.css\"}},\"end\":\"(?<=})\",\"name\":\"meta.at-rule.${3:/downcase}.css\",\"patterns\":[{\"begin\":\"{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.section.property-list.begin.bracket.curly.css\"}},\"end\":\"}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.property-list.end.bracket.curly.css\"}},\"name\":\"meta.property-list.font-feature.css\",\"patterns\":[{\"captures\":{\"0\":{\"patterns\":[{\"include\":\"#escapes\"}]}},\"match\":\"(?:[-a-zA-Z_]|[^\\\\x00-\\\\x7F])(?:[-a-zA-Z0-9_]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))*\",\"name\":\"variable.font-feature.css\"},{\"include\":\"#rule-list-innards\"}]}]},\"functional-pseudo-classes\":{\"patterns\":[{\"begin\":\"(?i)((:)dir)(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"entity.other.attribute-name.pseudo-class.css\"},\"2\":{\"name\":\"punctuation.definition.entity.css\"},\"3\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"patterns\":[{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"},{\"match\":\"(?i)(?<![\\\\w-])(ltr|rtl)(?![\\\\w-])\",\"name\":\"support.constant.text-direction.css\"},{\"include\":\"#property-values\"}]},{\"begin\":\"(?i)((:)lang)(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"entity.other.attribute-name.pseudo-class.css\"},\"2\":{\"name\":\"punctuation.definition.entity.css\"},\"3\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"patterns\":[{\"match\":\"(?<=[(,\\\\s])[a-zA-Z]+(-[a-zA-Z0-9]*|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))*(?=[),\\\\s])\",\"name\":\"support.constant.language-range.css\"},{\"begin\":\"\\\"\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.css\"}},\"end\":\"\\\"\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.css\"}},\"name\":\"string.quoted.double.css\",\"patterns\":[{\"include\":\"#escapes\"},{\"match\":\"(?<=[\\\"\\\\s])[a-zA-Z*]+(-[a-zA-Z0-9*]*)*(?=[\\\"\\\\s])\",\"name\":\"support.constant.language-range.css\"}]},{\"begin\":\"'\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.css\"}},\"end\":\"'\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.css\"}},\"name\":\"string.quoted.single.css\",\"patterns\":[{\"include\":\"#escapes\"},{\"match\":\"(?<=['\\\\s])[a-zA-Z*]+(-[a-zA-Z0-9*]*)*(?=['\\\\s])\",\"name\":\"support.constant.language-range.css\"}]},{\"include\":\"#commas\"}]},{\"begin\":\"(?i)((:)(?:not|has|matches|where|is))(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"entity.other.attribute-name.pseudo-class.css\"},\"2\":{\"name\":\"punctuation.definition.entity.css\"},\"3\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"patterns\":[{\"include\":\"#selector-innards\"}]},{\"begin\":\"(?i)((:)nth-(?:last-)?(?:child|of-type))(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"entity.other.attribute-name.pseudo-class.css\"},\"2\":{\"name\":\"punctuation.definition.entity.css\"},\"3\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"patterns\":[{\"match\":\"(?i)[+-]?(\\\\d+n?|n)(\\\\s*[+-]\\\\s*\\\\d+)?\",\"name\":\"constant.numeric.css\"},{\"match\":\"(?i)even|odd\",\"name\":\"support.constant.parity.css\"}]}]},\"functions\":{\"patterns\":[{\"begin\":\"(?i)(?<![\\\\w-])(calc)(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"support.function.calc.css\"},\"2\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"name\":\"meta.function.calc.css\",\"patterns\":[{\"match\":\"[*/]|(?<=\\\\s|^)[-+](?=\\\\s|$)\",\"name\":\"keyword.operator.arithmetic.css\"},{\"include\":\"#property-values\"}]},{\"begin\":\"(?i)(?<![\\\\w-])(rgba?|rgb|hsla?|hsl|hwb|lab|oklab|lch|oklch|color)(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"support.function.misc.css\"},\"2\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"name\":\"meta.function.color.css\",\"patterns\":[{\"include\":\"#property-values\"}]},{\"begin\":\"(?i)(?<![\\\\w-])((?:-webkit-|-moz-|-o-)?(?:repeating-)?(?:linear|radial|conic)-gradient)(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"support.function.gradient.css\"},\"2\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"name\":\"meta.function.gradient.css\",\"patterns\":[{\"match\":\"(?i)(?<![\\\\w-])(from|to|at|in|hue)(?![\\\\w-])\",\"name\":\"keyword.operator.gradient.css\"},{\"include\":\"#property-values\"}]},{\"begin\":\"(?i)(?<![\\\\w-])(-webkit-gradient)(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"invalid.deprecated.gradient.function.css\"},\"2\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"name\":\"meta.function.gradient.invalid.deprecated.gradient.css\",\"patterns\":[{\"begin\":\"(?i)(?<![\\\\w-])(from|to|color-stop)(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"invalid.deprecated.function.css\"},\"2\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"patterns\":[{\"include\":\"#property-values\"}]},{\"include\":\"#property-values\"}]},{\"begin\":\"(?i)(?<![\\\\w-])(annotation|attr|blur|brightness|character-variant|clamp|contrast|counters?|cross-fade|drop-shadow|element|fit-content|format|grayscale|hue-rotate|color-mix|image-set|invert|local|max|min|minmax|opacity|ornaments|repeat|saturate|sepia|styleset|stylistic|swash|symbols|cos|sin|tan|acos|asin|atan|atan2|hypot|sqrt|pow|log|exp|abs|sign)(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"support.function.misc.css\"},\"2\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"name\":\"meta.function.misc.css\",\"patterns\":[{\"match\":\"(?i)(?<=[,\\\\s\\\"]|\\\\*/|^)\\\\d+x(?=[\\\\s,\\\"')]|/\\\\*|$)\",\"name\":\"constant.numeric.other.density.css\"},{\"include\":\"#property-values\"},{\"match\":\"[^'\\\"),\\\\s]+\",\"name\":\"variable.parameter.misc.css\"}]},{\"begin\":\"(?i)(?<![\\\\w-])(circle|ellipse|inset|polygon|rect)(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"support.function.shape.css\"},\"2\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"name\":\"meta.function.shape.css\",\"patterns\":[{\"match\":\"(?i)(?<=\\\\s|^|\\\\*/)(at|round)(?=\\\\s|/\\\\*|$)\",\"name\":\"keyword.operator.shape.css\"},{\"include\":\"#property-values\"}]},{\"begin\":\"(?i)(?<![\\\\w-])(cubic-bezier|steps)(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"support.function.timing-function.css\"},\"2\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"name\":\"meta.function.timing-function.css\",\"patterns\":[{\"match\":\"(?i)(?<![\\\\w-])(start|end)(?=\\\\s*\\\\)|$)\",\"name\":\"support.constant.step-direction.css\"},{\"include\":\"#property-values\"}]},{\"begin\":\"(?i)(?<![\\\\w-])((?:translate|scale|rotate)(?:[XYZ]|3D)?|matrix(?:3D)?|skew[XY]?|perspective)(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"support.function.transform.css\"},\"2\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"patterns\":[{\"include\":\"#property-values\"}]},{\"include\":\"#url\"},{\"begin\":\"(?i)(?<![\\\\w-])(var)(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"support.function.misc.css\"},\"2\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"name\":\"meta.function.variable.css\",\"patterns\":[{\"match\":\"--(?:[-a-zA-Z_]|[^\\\\x00-\\\\x7F])(?:[-a-zA-Z0-9_]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))*\",\"name\":\"variable.argument.css\"},{\"include\":\"#property-values\"}]}]},\"media-feature-keywords\":{\"match\":\"(?i)(?<=^|\\\\s|:|\\\\*/)(?:portrait|landscape|progressive|interlace|fullscreen|standalone|minimal-ui|browser|hover)(?=\\\\s|\\\\)|$)\",\"name\":\"support.constant.property-value.css\"},\"media-features\":{\"captures\":{\"1\":{\"name\":\"support.type.property-name.media.css\"},\"2\":{\"name\":\"support.type.property-name.media.css\"},\"3\":{\"name\":\"support.type.vendored.property-name.media.css\"}},\"match\":\"(?i)(?<=^|\\\\s|\\\\(|\\\\*/)(?:((?:min-|max-)?(?:height|width|aspect-ratio|color|color-index|monochrome|resolution)|grid|scan|orientation|display-mode|hover)|((?:min-|max-)?device-(?:height|width|aspect-ratio))|((?:[-_](?:webkit|apple|khtml|epub|moz|ms|o|xv|ah|rim|atsc|hp|tc|wap|ro)|(?:mso|prince))-[\\\\w-]+(?=\\\\s*(?:/\\\\*(?:[^*]|\\\\*[^/])*\\\\*/)?\\\\s*[:)])))(?=\\\\s|$|[><:=]|\\\\)|/\\\\*)\"},\"media-query\":{\"begin\":\"\\\\G\",\"end\":\"(?=\\\\s*[{;])\",\"patterns\":[{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"},{\"include\":\"#media-types\"},{\"match\":\"(?i)(?<=\\\\s|^|,|\\\\*/)(only|not)(?=\\\\s|{|/\\\\*|$)\",\"name\":\"keyword.operator.logical.$1.media.css\"},{\"match\":\"(?i)(?<=\\\\s|^|\\\\*/|\\\\))and(?=\\\\s|/\\\\*|$)\",\"name\":\"keyword.operator.logical.and.media.css\"},{\"match\":\",(?:(?:\\\\s*,)+|(?=\\\\s*[;){]))\",\"name\":\"invalid.illegal.comma.css\"},{\"include\":\"#commas\"},{\"begin\":\"\\\\(\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.parameters.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.parameters.end.bracket.round.css\"}},\"patterns\":[{\"include\":\"#media-features\"},{\"include\":\"#media-feature-keywords\"},{\"match\":\":\",\"name\":\"punctuation.separator.key-value.css\"},{\"match\":\">=|<=|=|<|>\",\"name\":\"keyword.operator.comparison.css\"},{\"captures\":{\"1\":{\"name\":\"constant.numeric.css\"},\"2\":{\"name\":\"keyword.operator.arithmetic.css\"},\"3\":{\"name\":\"constant.numeric.css\"}},\"match\":\"(\\\\d+)\\\\s*(/)\\\\s*(\\\\d+)\",\"name\":\"meta.ratio.css\"},{\"include\":\"#numeric-values\"},{\"include\":\"#comment-block\"}]}]},\"media-query-list\":{\"begin\":\"(?=\\\\s*[^{;])\",\"end\":\"(?=\\\\s*[{;])\",\"patterns\":[{\"include\":\"#media-query\"}]},\"media-types\":{\"captures\":{\"1\":{\"name\":\"support.constant.media.css\"},\"2\":{\"name\":\"invalid.deprecated.constant.media.css\"}},\"match\":\"(?i)(?<=^|\\\\s|,|\\\\*/)(?:(all|print|screen|speech)|(aural|braille|embossed|handheld|projection|tty|tv))(?=$|[{,\\\\s;]|/\\\\*)\"},\"numeric-values\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"punctuation.definition.constant.css\"}},\"match\":\"(#)(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\\\b\",\"name\":\"constant.other.color.rgb-value.hex.css\"},{\"captures\":{\"1\":{\"name\":\"keyword.other.unit.percentage.css\"},\"2\":{\"name\":\"keyword.other.unit.${2:/downcase}.css\"}},\"match\":\"(?i)(?<![\\\\w-])[-+]?(?:\\\\d+(?:\\\\.\\\\d+)?|\\\\.\\\\d+)(?:(?<=\\\\d)E[-+]?\\\\d+)?(?:(%)|(deg|grad|rad|turn|Hz|kHz|ch|cm|em|ex|fr|in|mm|mozmm|pc|pt|px|q|rem|rch|rex|rlh|ic|ric|rcap|vh|vw|vb|vi|svh|svw|svb|svi|dvh|dvw|dvb|dvi|lvh|lvw|lvb|lvi|vmax|vmin|cqw|cqi|cqh|cqb|cqmin|cqmax|dpi|dpcm|dppx|s|ms)\\\\b)?\",\"name\":\"constant.numeric.css\"}]},\"property-keywords\":{\"patterns\":[{\"match\":\"(?i)(?<![\\\\w-])(above|absolute|active|add|additive|after-edge|alias|all|all-petite-caps|all-scroll|all-small-caps|alpha|alphabetic|alternate|alternate-reverse|always|antialiased|auto|auto-fill|auto-fit|auto-pos|available|avoid|avoid-column|avoid-page|avoid-region|backwards|balance|baseline|before-edge|below|bevel|bidi-override|blink|block|block-axis|block-start|block-end|bold|bolder|border|border-box|both|bottom|bottom-outside|break-all|break-word|bullets|butt|capitalize|caption|cell|center|central|char|circle|clip|clone|close-quote|closest-corner|closest-side|col-resize|collapse|color|color-burn|color-dodge|column|column-reverse|common-ligatures|compact|condensed|contain|content|content-box|contents|context-menu|contextual|copy|cover|crisp-edges|crispEdges|crosshair|cyclic|dark|darken|dashed|decimal|default|dense|diagonal-fractions|difference|digits|disabled|disc|discretionary-ligatures|distribute|distribute-all-lines|distribute-letter|distribute-space|dot|dotted|double|double-circle|downleft|downright|e-resize|each-line|ease|ease-in|ease-in-out|ease-out|economy|ellipse|ellipsis|embed|end|evenodd|ew-resize|exact|exclude|exclusion|expanded|extends|extra-condensed|extra-expanded|fallback|farthest-corner|farthest-side|fill|fill-available|fill-box|filled|fit-content|fixed|flat|flex|flex-end|flex-start|flip|flow-root|forwards|freeze|from-image|full-width|geometricPrecision|georgian|grab|grabbing|grayscale|grid|groove|hand|hanging|hard-light|help|hidden|hide|historical-forms|historical-ligatures|horizontal|horizontal-tb|hue|icon|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|ideographic|inactive|infinite|inherit|initial|inline|inline-axis|inline-block|inline-end|inline-flex|inline-grid|inline-list-item|inline-start|inline-table|inset|inside|inter-character|inter-ideograph|inter-word|intersect|invert|isolate|isolate-override|italic|jis04|jis78|jis83|jis90|justify|justify-all|kannada|keep-all|landscape|large|larger|left|light|lighten|lighter|line|line-edge|line-through|linear|linearRGB|lining-nums|list-item|local|loose|lowercase|lr|lr-tb|ltr|luminance|luminosity|main-size|mandatory|manipulation|manual|margin-box|match-parent|match-source|mathematical|max-content|medium|menu|message-box|middle|min-content|miter|mixed|move|multiply|n-resize|narrower|ne-resize|nearest-neighbor|nesw-resize|newspaper|no-change|no-clip|no-close-quote|no-common-ligatures|no-contextual|no-discretionary-ligatures|no-drop|no-historical-ligatures|no-open-quote|no-repeat|none|nonzero|normal|not-allowed|nowrap|ns-resize|numbers|numeric|nw-resize|nwse-resize|oblique|oldstyle-nums|open|open-quote|optimizeLegibility|optimizeQuality|optimizeSpeed|optional|ordinal|outset|outside|over|overlay|overline|padding|padding-box|page|painted|pan-down|pan-left|pan-right|pan-up|pan-x|pan-y|paused|petite-caps|pixelated|plaintext|pointer|portrait|pre|pre-line|pre-wrap|preserve-3d|progress|progressive|proportional-nums|proportional-width|proximity|radial|recto|region|relative|remove|repeat|repeat-[xy]|reset-size|reverse|revert|ridge|right|rl|rl-tb|round|row|row-resize|row-reverse|row-severse|rtl|ruby|ruby-base|ruby-base-container|ruby-text|ruby-text-container|run-in|running|s-resize|saturation|scale-down|screen|scroll|scroll-position|se-resize|semi-condensed|semi-expanded|separate|sesame|show|sideways|sideways-left|sideways-lr|sideways-right|sideways-rl|simplified|slashed-zero|slice|small|small-caps|small-caption|smaller|smooth|soft-light|solid|space|space-around|space-between|space-evenly|spell-out|square|sRGB|stacked-fractions|start|static|status-bar|swap|step-end|step-start|sticky|stretch|strict|stroke|stroke-box|style|sub|subgrid|subpixel-antialiased|subtract|super|sw-resize|symbolic|table|table-caption|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row|table-row-group|tabular-nums|tb|tb-rl|text|text-after-edge|text-before-edge|text-bottom|text-top|thick|thin|titling-caps|top|top-outside|touch|traditional|transparent|triangle|ultra-condensed|ultra-expanded|under|underline|unicase|unset|upleft|uppercase|upright|use-glyph-orientation|use-script|verso|vertical|vertical-ideographic|vertical-lr|vertical-rl|vertical-text|view-box|visible|visibleFill|visiblePainted|visibleStroke|w-resize|wait|wavy|weight|whitespace|wider|words|wrap|wrap-reverse|x|x-large|x-small|xx-large|xx-small|y|zero|zoom-in|zoom-out)(?![\\\\w-])\",\"name\":\"support.constant.property-value.css\"},{\"match\":\"(?i)(?<![\\\\w-])(arabic-indic|armenian|bengali|cambodian|circle|cjk-decimal|cjk-earthly-branch|cjk-heavenly-stem|cjk-ideographic|decimal|decimal-leading-zero|devanagari|disc|disclosure-closed|disclosure-open|ethiopic-halehame-am|ethiopic-halehame-ti-e[rt]|ethiopic-numeric|georgian|gujarati|gurmukhi|hangul|hangul-consonant|hebrew|hiragana|hiragana-iroha|japanese-formal|japanese-informal|kannada|katakana|katakana-iroha|khmer|korean-hangul-formal|korean-hanja-formal|korean-hanja-informal|lao|lower-alpha|lower-armenian|lower-greek|lower-latin|lower-roman|malayalam|mongolian|myanmar|oriya|persian|simp-chinese-formal|simp-chinese-informal|square|tamil|telugu|thai|tibetan|trad-chinese-formal|trad-chinese-informal|upper-alpha|upper-armenian|upper-latin|upper-roman|urdu)(?![\\\\w-])\",\"name\":\"support.constant.property-value.list-style-type.css\"},{\"match\":\"(?<![\\\\w-])(?i:-(?:ah|apple|atsc|epub|hp|khtml|moz|ms|o|rim|ro|tc|wap|webkit|xv)|(?:mso|prince))-[a-zA-Z-]+\",\"name\":\"support.constant.vendored.property-value.css\"},{\"match\":\"(?<![\\\\w-])(?i:arial|century|comic|courier|garamond|georgia|helvetica|impact|lucida|symbol|system-ui|system|tahoma|times|trebuchet|ui-monospace|ui-rounded|ui-sans-serif|ui-serif|utopia|verdana|webdings|sans-serif|serif|monospace)(?![\\\\w-])\",\"name\":\"support.constant.font-name.css\"}]},\"property-names\":{\"patterns\":[{\"match\":\"(?i)(?<![\\\\w-])(?:accent-color|additive-symbols|align-content|align-items|align-self|all|animation|animation-delay|animation-direction|animation-duration|animation-fill-mode|animation-iteration-count|animation-name|animation-play-state|animation-timing-function|backdrop-filter|backface-visibility|background|background-attachment|background-blend-mode|background-clip|background-color|background-image|background-origin|background-position|background-position-[xy]|background-repeat|background-size|bleed|block-size|border|border-block-end|border-block-end-color|border-block-end-style|border-block-end-width|border-block-start|border-block-start-color|border-block-start-style|border-block-start-width|border-bottom|border-bottom-color|border-bottom-left-radius|border-bottom-right-radius|border-bottom-style|border-bottom-width|border-collapse|border-color|border-end-end-radius|border-end-start-radius|border-image|border-image-outset|border-image-repeat|border-image-slice|border-image-source|border-image-width|border-inline-end|border-inline-end-color|border-inline-end-style|border-inline-end-width|border-inline-start|border-inline-start-color|border-inline-start-style|border-inline-start-width|border-left|border-left-color|border-left-style|border-left-width|border-radius|border-right|border-right-color|border-right-style|border-right-width|border-spacing|border-start-end-radius|border-start-start-radius|border-style|border-top|border-top-color|border-top-left-radius|border-top-right-radius|border-top-style|border-top-width|border-width|bottom|box-decoration-break|box-shadow|box-sizing|break-after|break-before|break-inside|caption-side|caret-color|clear|clip|clip-path|clip-rule|color|color-adjust|color-interpolation-filters|color-scheme|column-count|column-fill|column-gap|column-rule|column-rule-color|column-rule-style|column-rule-width|column-span|column-width|columns|contain|container|container-name|container-type|content|counter-increment|counter-reset|cursor|direction|display|empty-cells|enable-background|fallback|fill|fill-opacity|fill-rule|filter|flex|flex-basis|flex-direction|flex-flow|flex-grow|flex-shrink|flex-wrap|float|flood-color|flood-opacity|font|font-display|font-family|font-feature-settings|font-kerning|font-language-override|font-optical-sizing|font-size|font-size-adjust|font-stretch|font-style|font-synthesis|font-variant|font-variant-alternates|font-variant-caps|font-variant-east-asian|font-variant-ligatures|font-variant-numeric|font-variant-position|font-variation-settings|font-weight|gap|glyph-orientation-horizontal|glyph-orientation-vertical|grid|grid-area|grid-auto-columns|grid-auto-flow|grid-auto-rows|grid-column|grid-column-end|grid-column-gap|grid-column-start|grid-gap|grid-row|grid-row-end|grid-row-gap|grid-row-start|grid-template|grid-template-areas|grid-template-columns|grid-template-rows|hanging-punctuation|height|hyphens|image-orientation|image-rendering|image-resolution|ime-mode|initial-letter|initial-letter-align|inline-size|inset|inset-block|inset-block-end|inset-block-start|inset-inline|inset-inline-end|inset-inline-start|isolation|justify-content|justify-items|justify-self|kerning|left|letter-spacing|lighting-color|line-break|line-clamp|line-height|list-style|list-style-image|list-style-position|list-style-type|margin|margin-block|margin-block-end|margin-block-start|margin-bottom|margin-inline|margin-inline-end|margin-inline-start|margin-left|margin-right|margin-top|marker-end|marker-mid|marker-start|marks|mask|mask-border|mask-border-mode|mask-border-outset|mask-border-repeat|mask-border-slice|mask-border-source|mask-border-width|mask-clip|mask-composite|mask-image|mask-mode|mask-origin|mask-position|mask-repeat|mask-size|mask-type|max-block-size|max-height|max-inline-size|max-lines|max-width|max-zoom|min-block-size|min-height|min-inline-size|min-width|min-zoom|mix-blend-mode|negative|object-fit|object-position|offset|offset-anchor|offset-distance|offset-path|offset-position|offset-rotation|opacity|order|orientation|orphans|outline|outline-color|outline-offset|outline-style|outline-width|overflow|overflow-anchor|overflow-block|overflow-inline|overflow-wrap|overflow-[xy]|overscroll-behavior|overscroll-behavior-block|overscroll-behavior-inline|overscroll-behavior-[xy]|pad|padding|padding-block|padding-block-end|padding-block-start|padding-bottom|padding-inline|padding-inline-end|padding-inline-start|padding-left|padding-right|padding-top|page-break-after|page-break-before|page-break-inside|paint-order|perspective|perspective-origin|place-content|place-items|place-self|pointer-events|position|prefix|quotes|range|resize|right|rotate|row-gap|ruby-align|ruby-merge|ruby-position|scale|scroll-behavior|scroll-margin|scroll-margin-block|scroll-margin-block-end|scroll-margin-block-start|scroll-margin-bottom|scroll-margin-inline|scroll-margin-inline-end|scroll-margin-inline-start|scroll-margin-left|scroll-margin-right|scroll-margin-top|scroll-padding|scroll-padding-block|scroll-padding-block-end|scroll-padding-block-start|scroll-padding-bottom|scroll-padding-inline|scroll-padding-inline-end|scroll-padding-inline-start|scroll-padding-left|scroll-padding-right|scroll-padding-top|scroll-snap-align|scroll-snap-coordinate|scroll-snap-destination|scroll-snap-stop|scroll-snap-type|scrollbar-color|scrollbar-gutter|scrollbar-width|shape-image-threshold|shape-margin|shape-outside|shape-rendering|size|speak-as|src|stop-color|stop-opacity|stroke|stroke-dasharray|stroke-dashoffset|stroke-linecap|stroke-linejoin|stroke-miterlimit|stroke-opacity|stroke-width|suffix|symbols|system|tab-size|table-layout|text-align|text-align-last|text-anchor|text-combine-upright|text-decoration|text-decoration-color|text-decoration-line|text-decoration-skip|text-decoration-skip-ink|text-decoration-style|text-decoration-thickness|text-emphasis|text-emphasis-color|text-emphasis-position|text-emphasis-style|text-indent|text-justify|text-orientation|text-overflow|text-rendering|text-shadow|text-size-adjust|text-transform|text-underline-offset|text-underline-position|top|touch-action|transform|transform-box|transform-origin|transform-style|transition|transition-delay|transition-duration|transition-property|transition-timing-function|translate|unicode-bidi|unicode-range|user-select|user-zoom|vertical-align|visibility|white-space|widows|width|will-change|word-break|word-spacing|word-wrap|writing-mode|z-index|zoom|alignment-baseline|baseline-shift|clip-rule|color-interpolation|color-interpolation-filters|color-profile|color-rendering|cx|cy|dominant-baseline|enable-background|fill|fill-opacity|fill-rule|flood-color|flood-opacity|glyph-orientation-horizontal|glyph-orientation-vertical|height|kerning|lighting-color|marker-end|marker-mid|marker-start|r|rx|ry|shape-rendering|stop-color|stop-opacity|stroke|stroke-dasharray|stroke-dashoffset|stroke-linecap|stroke-linejoin|stroke-miterlimit|stroke-opacity|stroke-width|text-anchor|width|x|y|adjust|after|align|align-last|alignment|alignment-adjust|appearance|attachment|azimuth|background-break|balance|baseline|before|bidi|binding|bookmark|bookmark-label|bookmark-level|bookmark-target|border-length|bottom-color|bottom-left-radius|bottom-right-radius|bottom-style|bottom-width|box|box-align|box-direction|box-flex|box-flex-group|box-lines|box-ordinal-group|box-orient|box-pack|break|character|collapse|column|column-break-after|column-break-before|count|counter|crop|cue|cue-after|cue-before|decoration|decoration-break|delay|display-model|display-role|down|drop|drop-initial-after-adjust|drop-initial-after-align|drop-initial-before-adjust|drop-initial-before-align|drop-initial-size|drop-initial-value|duration|elevation|emphasis|family|fit|fit-position|flex-group|float-offset|gap|grid-columns|grid-rows|hanging-punctuation|header|hyphenate|hyphenate-after|hyphenate-before|hyphenate-character|hyphenate-lines|hyphenate-resource|icon|image|increment|indent|index|initial-after-adjust|initial-after-align|initial-before-adjust|initial-before-align|initial-size|initial-value|inline-box-align|iteration-count|justify|label|left-color|left-style|left-width|length|level|line|line-stacking|line-stacking-ruby|line-stacking-shift|line-stacking-strategy|lines|list|mark|mark-after|mark-before|marks|marquee|marquee-direction|marquee-play-count|marquee-speed|marquee-style|max|min|model|move-to|name|nav|nav-down|nav-index|nav-left|nav-right|nav-up|new|numeral|offset|ordinal-group|orient|origin|overflow-style|overhang|pack|page|page-policy|pause|pause-after|pause-before|phonemes|pitch|pitch-range|play-count|play-during|play-state|point|presentation|presentation-level|profile|property|punctuation|punctuation-trim|radius|rate|rendering-intent|repeat|replace|reset|resolution|resource|respond-to|rest|rest-after|rest-before|richness|right-color|right-style|right-width|role|rotation|rotation-point|rows|ruby|ruby-overhang|ruby-span|rule|rule-color|rule-style|rule-width|shadow|size|size-adjust|sizing|space|space-collapse|spacing|span|speak|speak-header|speak-numeral|speak-punctuation|speech|speech-rate|speed|stacking|stacking-ruby|stacking-shift|stacking-strategy|stress|stretch|string-set|style|style-image|style-position|style-type|target|target-name|target-new|target-position|text|text-height|text-justify|text-outline|text-replace|text-wrap|timing-function|top-color|top-left-radius|top-right-radius|top-style|top-width|trim|unicode|up|user-select|variant|voice|voice-balance|voice-duration|voice-family|voice-pitch|voice-pitch-range|voice-rate|voice-stress|voice-volume|volume|weight|white|white-space-collapse|word|wrap)(?![\\\\w-])\",\"name\":\"support.type.property-name.css\"},{\"match\":\"(?<![\\\\w-])(?i:-(?:ah|apple|atsc|epub|hp|khtml|moz|ms|o|rim|ro|tc|wap|webkit|xv)|(?:mso|prince))-[a-zA-Z-]+\",\"name\":\"support.type.vendored.property-name.css\"}]},\"property-values\":{\"patterns\":[{\"include\":\"#commas\"},{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"},{\"include\":\"#functions\"},{\"include\":\"#property-keywords\"},{\"include\":\"#unicode-range\"},{\"include\":\"#numeric-values\"},{\"include\":\"#color-keywords\"},{\"include\":\"#string\"},{\"match\":\"!\\\\s*important(?![\\\\w-])\",\"name\":\"keyword.other.important.css\"}]},\"pseudo-classes\":{\"captures\":{\"1\":{\"name\":\"punctuation.definition.entity.css\"},\"2\":{\"name\":\"invalid.illegal.colon.css\"}},\"match\":\"(?i)(:)(:*)(?:active|any-link|checked|default|disabled|empty|enabled|first|(?:first|last|only)-(?:child|of-type)|focus|focus-visible|focus-within|fullscreen|host|hover|in-range|indeterminate|invalid|left|link|optional|out-of-range|read-only|read-write|required|right|root|scope|target|unresolved|valid|visited)(?![\\\\w-]|\\\\s*[;}])\",\"name\":\"entity.other.attribute-name.pseudo-class.css\"},\"pseudo-elements\":{\"captures\":{\"1\":{\"name\":\"punctuation.definition.entity.css\"},\"2\":{\"name\":\"punctuation.definition.entity.css\"}},\"match\":\"(?i)(?:(::?)(?:after|before|first-letter|first-line|(?:-(?:ah|apple|atsc|epub|hp|khtml|moz|ms|o|rim|ro|tc|wap|webkit|xv)|(?:mso|prince))-[a-z-]+)|(::)(?:backdrop|content|grammar-error|marker|placeholder|selection|shadow|spelling-error))(?![\\\\w-]|\\\\s*[;}])\",\"name\":\"entity.other.attribute-name.pseudo-element.css\"},\"rule-list\":{\"begin\":\"{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.section.property-list.begin.bracket.curly.css\"}},\"end\":\"}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.property-list.end.bracket.curly.css\"}},\"name\":\"meta.property-list.css\",\"patterns\":[{\"include\":\"#rule-list-innards\"}]},\"rule-list-innards\":{\"patterns\":[{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"},{\"include\":\"#font-features\"},{\"match\":\"(?<![\\\\w-])--(?:[-a-zA-Z_]|[^\\\\x00-\\\\x7F])(?:[-a-zA-Z0-9_]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))*\",\"name\":\"variable.css\"},{\"begin\":\"(?<![-a-zA-Z])(?=[-a-zA-Z])\",\"end\":\"$|(?![-a-zA-Z])\",\"name\":\"meta.property-name.css\",\"patterns\":[{\"include\":\"#property-names\"}]},{\"begin\":\"(:)\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.separator.key-value.css\"}},\"contentName\":\"meta.property-value.css\",\"end\":\"\\\\s*(;)|\\\\s*(?=}|\\\\))\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.terminator.rule.css\"}},\"patterns\":[{\"include\":\"#comment-block\"},{\"include\":\"#property-values\"}]},{\"match\":\";\",\"name\":\"punctuation.terminator.rule.css\"}]},\"selector\":{\"begin\":\"(?=(?:\\\\|)?(?:[-\\\\[:.*#a-zA-Z_]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.)))\",\"end\":\"(?=\\\\s*[/@{)])\",\"name\":\"meta.selector.css\",\"patterns\":[{\"include\":\"#selector-innards\"}]},\"selector-innards\":{\"patterns\":[{\"include\":\"#comment-block\"},{\"include\":\"#commas\"},{\"include\":\"#escapes\"},{\"include\":\"#combinators\"},{\"captures\":{\"1\":{\"name\":\"entity.other.namespace-prefix.css\"},\"2\":{\"name\":\"punctuation.separator.css\"}},\"match\":\"(?:^|(?<=[\\\\s,(};]))(?![-\\\\w*]+\\\\|(?![-\\\\[:.*#a-zA-Z_]|[^\\\\x00-\\\\x7F]))((?:[-a-zA-Z_]|[^\\\\x00-\\\\x7F])(?:[-a-zA-Z0-9_]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))*|\\\\*)?(\\\\|)\"},{\"include\":\"#tag-names\"},{\"match\":\"\\\\*\",\"name\":\"entity.name.tag.wildcard.css\"},{\"captures\":{\"1\":{\"name\":\"punctuation.definition.entity.css\"},\"2\":{\"patterns\":[{\"include\":\"#escapes\"}]}},\"match\":\"(?<![@\\\\w-])([.#])((?:-?\\\\d|-(?=$|[\\\\s,.#)\\\\[:{>+~|]|/\\\\*)|(?:[-a-zA-Z_0-9]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))*(?:[!\\\"'%&(*;<?@^`|\\\\]}]|/(?!\\\\*))+)(?:[-a-zA-Z_0-9]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))*)\",\"name\":\"invalid.illegal.bad-identifier.css\"},{\"captures\":{\"1\":{\"name\":\"punctuation.definition.entity.css\"},\"2\":{\"patterns\":[{\"include\":\"#escapes\"}]}},\"match\":\"(\\\\.)((?:[-a-zA-Z_0-9]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))+)(?=$|[\\\\s,.#)\\\\[:{>+~|]|/\\\\*)\",\"name\":\"entity.other.attribute-name.class.css\"},{\"captures\":{\"1\":{\"name\":\"punctuation.definition.entity.css\"},\"2\":{\"patterns\":[{\"include\":\"#escapes\"}]}},\"match\":\"(\\\\#)(-?(?!\\\\d)(?:[-a-zA-Z0-9_]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))+)(?=$|[\\\\s,.#)\\\\[:{>+~|]|/\\\\*)\",\"name\":\"entity.other.attribute-name.id.css\"},{\"begin\":\"\\\\[\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.entity.begin.bracket.square.css\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.entity.end.bracket.square.css\"}},\"name\":\"meta.attribute-selector.css\",\"patterns\":[{\"include\":\"#comment-block\"},{\"include\":\"#string\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.ignore-case.css\"}},\"match\":\"(?<=[\\\"'\\\\s]|^|\\\\*/)\\\\s*([iI])\\\\s*(?=[\\\\s\\\\]]|/\\\\*|$)\"},{\"captures\":{\"1\":{\"name\":\"string.unquoted.attribute-value.css\",\"patterns\":[{\"include\":\"#escapes\"}]}},\"match\":\"(?<==)\\\\s*((?!/\\\\*)(?:[^\\\\\\\\\\\"'\\\\s\\\\]]|\\\\\\\\.)+)\"},{\"include\":\"#escapes\"},{\"match\":\"[~|^$*]?=\",\"name\":\"keyword.operator.pattern.css\"},{\"match\":\"\\\\|\",\"name\":\"punctuation.separator.css\"},{\"captures\":{\"1\":{\"name\":\"entity.other.namespace-prefix.css\",\"patterns\":[{\"include\":\"#escapes\"}]}},\"match\":\"(-?(?!\\\\d)(?:[\\\\w-]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))+|\\\\*)(?=\\\\|(?!\\\\s|=|$|\\\\])(?:-?(?!\\\\d)|[\\\\\\\\\\\\w-]|[^\\\\x00-\\\\x7F]))\"},{\"captures\":{\"1\":{\"name\":\"entity.other.attribute-name.css\",\"patterns\":[{\"include\":\"#escapes\"}]}},\"match\":\"(-?(?!\\\\d)(?>[\\\\w-]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))+)\\\\s*(?=[~|^\\\\]$*=]|/\\\\*)\"}]},{\"include\":\"#pseudo-classes\"},{\"include\":\"#pseudo-elements\"},{\"include\":\"#functional-pseudo-classes\"},{\"match\":\"(?<![@\\\\w-])(?=[a-z]\\\\w*-)(?:(?![A-Z])[\\\\w-])+(?![(\\\\w-])\",\"name\":\"entity.name.tag.custom.css\"}]},\"string\":{\"patterns\":[{\"begin\":\"\\\"\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.css\"}},\"end\":\"\\\"|(?<!\\\\\\\\)(?=$|\\\\n)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.css\"}},\"name\":\"string.quoted.double.css\",\"patterns\":[{\"begin\":\"(?:\\\\G|^)(?=(?:[^\\\\\\\\\\\"]|\\\\\\\\.)+$)\",\"end\":\"$\",\"name\":\"invalid.illegal.unclosed.string.css\",\"patterns\":[{\"include\":\"#escapes\"}]},{\"include\":\"#escapes\"}]},{\"begin\":\"'\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.css\"}},\"end\":\"'|(?<!\\\\\\\\)(?=$|\\\\n)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.css\"}},\"name\":\"string.quoted.single.css\",\"patterns\":[{\"begin\":\"(?:\\\\G|^)(?=(?:[^\\\\\\\\']|\\\\\\\\.)+$)\",\"end\":\"$\",\"name\":\"invalid.illegal.unclosed.string.css\",\"patterns\":[{\"include\":\"#escapes\"}]},{\"include\":\"#escapes\"}]}]},\"tag-names\":{\"match\":\"(?i)(?<![\\\\w:-])(?:a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdi|bdo|bgsound|big|blink|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|command|content|data|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|element|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h[1-6]|head|header|hgroup|hr|html|i|iframe|image|img|input|ins|isindex|kbd|keygen|label|legend|li|link|listing|main|map|mark|marquee|math|menu|menuitem|meta|meter|multicol|nav|nextid|nobr|noembed|noframes|noscript|object|ol|optgroup|option|output|p|param|picture|plaintext|pre|progress|q|rb|rp|rt|rtc|ruby|s|samp|script|section|select|shadow|slot|small|source|spacer|span|strike|strong|style|sub|summary|sup|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video|wbr|xmp|altGlyph|altGlyphDef|altGlyphItem|animate|animateColor|animateMotion|animateTransform|circle|clipPath|color-profile|cursor|defs|desc|discard|ellipse|feBlend|feColorMatrix|feComponentTransfer|feComposite|feConvolveMatrix|feDiffuseLighting|feDisplacementMap|feDistantLight|feDropShadow|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feImage|feMerge|feMergeNode|feMorphology|feOffset|fePointLight|feSpecularLighting|feSpotLight|feTile|feTurbulence|filter|font-face|font-face-format|font-face-name|font-face-src|font-face-uri|foreignObject|g|glyph|glyphRef|hatch|hatchpath|hkern|line|linearGradient|marker|mask|mesh|meshgradient|meshpatch|meshrow|metadata|missing-glyph|mpath|path|pattern|polygon|polyline|radialGradient|rect|set|solidcolor|stop|svg|switch|symbol|text|textPath|tref|tspan|use|view|vkern|annotation|annotation-xml|maction|maligngroup|malignmark|math|menclose|merror|mfenced|mfrac|mglyph|mi|mlabeledtr|mlongdiv|mmultiscripts|mn|mo|mover|mpadded|mphantom|mroot|mrow|ms|mscarries|mscarry|msgroup|msline|mspace|msqrt|msrow|mstack|mstyle|msub|msubsup|msup|mtable|mtd|mtext|mtr|munder|munderover|semantics)(?=[+~>\\\\s,.#|){:\\\\[]|/\\\\*|$)\",\"name\":\"entity.name.tag.css\"},\"unicode-range\":{\"captures\":{\"0\":{\"name\":\"constant.other.unicode-range.css\"},\"1\":{\"name\":\"punctuation.separator.dash.unicode-range.css\"}},\"match\":\"(?<![\\\\w-])[Uu]\\\\+[0-9A-Fa-f?]{1,6}(?:(-)[0-9A-Fa-f]{1,6})?(?![\\\\w-])\"},\"url\":{\"begin\":\"(?i)(?<![\\\\w@-])(url)(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"support.function.url.css\"},\"2\":{\"name\":\"punctuation.section.function.begin.bracket.round.css\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.section.function.end.bracket.round.css\"}},\"name\":\"meta.function.url.css\",\"patterns\":[{\"match\":\"[^'\\\")\\\\s]+\",\"name\":\"variable.parameter.url.css\"},{\"include\":\"#string\"},{\"include\":\"#comment-block\"},{\"include\":\"#escapes\"}]}},\"scopeName\":\"source.css\"}"));

const css = [
  lang$9
];

const lang$8 = Object.freeze(JSON.parse("{\"displayName\":\"HTML\",\"injections\":{\"R:text.html - (comment.block, text.html meta.embedded, meta.tag.*.*.html, meta.tag.*.*.*.html, meta.tag.*.*.*.*.html)\":{\"comment\":\"Uses R: to ensure this matches after any other injections.\",\"patterns\":[{\"match\":\"<\",\"name\":\"invalid.illegal.bad-angle-bracket.html\"}]}},\"name\":\"html\",\"patterns\":[{\"include\":\"#xml-processing\"},{\"include\":\"#comment\"},{\"include\":\"#doctype\"},{\"include\":\"#cdata\"},{\"include\":\"#tags-valid\"},{\"include\":\"#tags-invalid\"},{\"include\":\"#entities\"}],\"repository\":{\"attribute\":{\"patterns\":[{\"begin\":\"(s(hape|cope|t(ep|art)|ize(s)?|p(ellcheck|an)|elected|lot|andbox|rc(set|doc|lang)?)|h(ttp-equiv|i(dden|gh)|e(ight|aders)|ref(lang)?)|n(o(nce|validate|module)|ame)|c(h(ecked|arset)|ite|o(nt(ent(editable)?|rols)|ords|l(s(pan)?|or))|lass|rossorigin)|t(ype(mustmatch)?|itle|a(rget|bindex)|ranslate)|i(s(map)?|n(tegrity|putmode)|tem(scope|type|id|prop|ref)|d)|op(timum|en)|d(i(sabled|r(name)?)|ownload|e(coding|f(er|ault))|at(etime|a)|raggable)|usemap|p(ing|oster|la(ysinline|ceholder)|attern|reload)|enctype|value|kind|for(m(novalidate|target|enctype|action|method)?)?|w(idth|rap)|l(ist|o(op|w)|a(ng|bel))|a(s(ync)?|c(ce(sskey|pt(-charset)?)|tion)|uto(c(omplete|apitalize)|play|focus)|l(t|low(usermedia|paymentrequest|fullscreen))|bbr)|r(ows(pan)?|e(versed|quired|ferrerpolicy|l|adonly))|m(in(length)?|u(ted|ltiple)|e(thod|dia)|a(nifest|x(length)?)))(?![\\\\w:-])\",\"beginCaptures\":{\"0\":{\"name\":\"entity.other.attribute-name.html\"}},\"comment\":\"HTML5 attributes, not event handlers\",\"end\":\"(?=\\\\s*+[^=\\\\s])\",\"name\":\"meta.attribute.$1.html\",\"patterns\":[{\"include\":\"#attribute-interior\"}]},{\"begin\":\"style(?![\\\\w:-])\",\"beginCaptures\":{\"0\":{\"name\":\"entity.other.attribute-name.html\"}},\"comment\":\"HTML5 style attribute\",\"end\":\"(?=\\\\s*+[^=\\\\s])\",\"name\":\"meta.attribute.style.html\",\"patterns\":[{\"begin\":\"=\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.separator.key-value.html\"}},\"end\":\"(?<=[^\\\\s=])(?!\\\\s*=)|(?=/?>)\",\"patterns\":[{\"begin\":\"(?=[^\\\\s=<>`/]|/(?!>))\",\"end\":\"(?!\\\\G)\",\"name\":\"meta.embedded.line.css\",\"patterns\":[{\"captures\":{\"0\":{\"name\":\"source.css\"}},\"match\":\"([^\\\\s\\\"'=<>`/]|/(?!>))+\",\"name\":\"string.unquoted.html\"},{\"begin\":\"\\\"\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.html\"}},\"contentName\":\"source.css\",\"end\":\"(\\\")\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.html\"},\"1\":{\"name\":\"source.css\"}},\"name\":\"string.quoted.double.html\",\"patterns\":[{\"include\":\"#entities\"}]},{\"begin\":\"'\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.html\"}},\"contentName\":\"source.css\",\"end\":\"(')\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.html\"},\"1\":{\"name\":\"source.css\"}},\"name\":\"string.quoted.single.html\",\"patterns\":[{\"include\":\"#entities\"}]}]},{\"match\":\"=\",\"name\":\"invalid.illegal.unexpected-equals-sign.html\"}]}]},{\"begin\":\"on(s(croll|t(orage|alled)|u(spend|bmit)|e(curitypolicyviolation|ek(ing|ed)|lect))|hashchange|c(hange|o(ntextmenu|py)|u(t|echange)|l(ick|ose)|an(cel|play(through)?))|t(imeupdate|oggle)|in(put|valid)|o(nline|ffline)|d(urationchange|r(op|ag(start|over|e(n(ter|d)|xit)|leave)?)|blclick)|un(handledrejection|load)|p(opstate|lay(ing)?|a(ste|use|ge(show|hide))|rogress)|e(nded|rror|mptied)|volumechange|key(down|up|press)|focus|w(heel|aiting)|l(oad(start|e(nd|d(data|metadata)))?|anguagechange)|a(uxclick|fterprint|bort)|r(e(s(ize|et)|jectionhandled)|atechange)|m(ouse(o(ut|ver)|down|up|enter|leave|move)|essage(error)?)|b(efore(unload|print)|lur))(?![\\\\w:-])\",\"beginCaptures\":{\"0\":{\"name\":\"entity.other.attribute-name.html\"}},\"comment\":\"HTML5 attributes, event handlers\",\"end\":\"(?=\\\\s*+[^=\\\\s])\",\"name\":\"meta.attribute.event-handler.$1.html\",\"patterns\":[{\"begin\":\"=\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.separator.key-value.html\"}},\"end\":\"(?<=[^\\\\s=])(?!\\\\s*=)|(?=/?>)\",\"patterns\":[{\"begin\":\"(?=[^\\\\s=<>`/]|/(?!>))\",\"end\":\"(?!\\\\G)\",\"name\":\"meta.embedded.line.js\",\"patterns\":[{\"captures\":{\"0\":{\"name\":\"source.js\"},\"1\":{\"patterns\":[{\"include\":\"source.js\"}]}},\"match\":\"(([^\\\\s\\\"'=<>`/]|/(?!>))+)\",\"name\":\"string.unquoted.html\"},{\"begin\":\"\\\"\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.html\"}},\"contentName\":\"source.js\",\"end\":\"(\\\")\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.html\"},\"1\":{\"name\":\"source.js\"}},\"name\":\"string.quoted.double.html\",\"patterns\":[{\"captures\":{\"0\":{\"patterns\":[{\"include\":\"source.js\"}]}},\"match\":\"([^\\\\n\\\"/]|/(?![/*]))+\"},{\"begin\":\"//\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.js\"}},\"end\":\"(?=\\\")|\\\\n\",\"name\":\"comment.line.double-slash.js\"},{\"begin\":\"/\\\\*\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.begin.js\"}},\"end\":\"(?=\\\")|\\\\*/\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.end.js\"}},\"name\":\"comment.block.js\"}]},{\"begin\":\"'\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.html\"}},\"contentName\":\"source.js\",\"end\":\"(')\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.html\"},\"1\":{\"name\":\"source.js\"}},\"name\":\"string.quoted.single.html\",\"patterns\":[{\"captures\":{\"0\":{\"patterns\":[{\"include\":\"source.js\"}]}},\"match\":\"([^\\\\n'/]|/(?![/*]))+\"},{\"begin\":\"//\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.js\"}},\"end\":\"(?=')|\\\\n\",\"name\":\"comment.line.double-slash.js\"},{\"begin\":\"/\\\\*\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.begin.js\"}},\"end\":\"(?=')|\\\\*/\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.end.js\"}},\"name\":\"comment.block.js\"}]}]},{\"match\":\"=\",\"name\":\"invalid.illegal.unexpected-equals-sign.html\"}]}]},{\"begin\":\"(data-[a-z\\\\-]+)(?![\\\\w:-])\",\"beginCaptures\":{\"0\":{\"name\":\"entity.other.attribute-name.html\"}},\"comment\":\"HTML5 attributes, data-*\",\"end\":\"(?=\\\\s*+[^=\\\\s])\",\"name\":\"meta.attribute.data-x.$1.html\",\"patterns\":[{\"include\":\"#attribute-interior\"}]},{\"begin\":\"(align|bgcolor|border)(?![\\\\w:-])\",\"beginCaptures\":{\"0\":{\"name\":\"invalid.deprecated.entity.other.attribute-name.html\"}},\"comment\":\"HTML attributes, deprecated\",\"end\":\"(?=\\\\s*+[^=\\\\s])\",\"name\":\"meta.attribute.$1.html\",\"patterns\":[{\"include\":\"#attribute-interior\"}]},{\"begin\":\"([^\\\\x{0020}\\\"'<>/=\\\\x{0000}-\\\\x{001F}\\\\x{007F}-\\\\x{009F}\\\\x{FDD0}-\\\\x{FDEF}\\\\x{FFFE}\\\\x{FFFF}\\\\x{1FFFE}\\\\x{1FFFF}\\\\x{2FFFE}\\\\x{2FFFF}\\\\x{3FFFE}\\\\x{3FFFF}\\\\x{4FFFE}\\\\x{4FFFF}\\\\x{5FFFE}\\\\x{5FFFF}\\\\x{6FFFE}\\\\x{6FFFF}\\\\x{7FFFE}\\\\x{7FFFF}\\\\x{8FFFE}\\\\x{8FFFF}\\\\x{9FFFE}\\\\x{9FFFF}\\\\x{AFFFE}\\\\x{AFFFF}\\\\x{BFFFE}\\\\x{BFFFF}\\\\x{CFFFE}\\\\x{CFFFF}\\\\x{DFFFE}\\\\x{DFFFF}\\\\x{EFFFE}\\\\x{EFFFF}\\\\x{FFFFE}\\\\x{FFFFF}\\\\x{10FFFE}\\\\x{10FFFF}]+)\",\"beginCaptures\":{\"0\":{\"name\":\"entity.other.attribute-name.html\"}},\"comment\":\"Anything else that is valid\",\"end\":\"(?=\\\\s*+[^=\\\\s])\",\"name\":\"meta.attribute.unrecognized.$1.html\",\"patterns\":[{\"include\":\"#attribute-interior\"}]},{\"match\":\"[^\\\\s>]+\",\"name\":\"invalid.illegal.character-not-allowed-here.html\"}]},\"attribute-interior\":{\"patterns\":[{\"begin\":\"=\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.separator.key-value.html\"}},\"end\":\"(?<=[^\\\\s=])(?!\\\\s*=)|(?=/?>)\",\"patterns\":[{\"match\":\"([^\\\\s\\\"'=<>`/]|/(?!>))+\",\"name\":\"string.unquoted.html\"},{\"begin\":\"\\\"\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.html\"}},\"end\":\"\\\"\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.html\"}},\"name\":\"string.quoted.double.html\",\"patterns\":[{\"include\":\"#entities\"}]},{\"begin\":\"'\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.html\"}},\"end\":\"'\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.html\"}},\"name\":\"string.quoted.single.html\",\"patterns\":[{\"include\":\"#entities\"}]},{\"match\":\"=\",\"name\":\"invalid.illegal.unexpected-equals-sign.html\"}]}]},\"cdata\":{\"begin\":\"<!\\\\[CDATA\\\\[\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.begin.html\"}},\"contentName\":\"string.other.inline-data.html\",\"end\":\"]]>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.metadata.cdata.html\"},\"comment\":{\"begin\":\"<!--\",\"captures\":{\"0\":{\"name\":\"punctuation.definition.comment.html\"}},\"end\":\"-->\",\"name\":\"comment.block.html\",\"patterns\":[{\"match\":\"\\\\G-?>\",\"name\":\"invalid.illegal.characters-not-allowed-here.html\"},{\"match\":\"<!--(?!>)|<!-(?=-->)\",\"name\":\"invalid.illegal.characters-not-allowed-here.html\"},{\"match\":\"--!>\",\"name\":\"invalid.illegal.characters-not-allowed-here.html\"}]},\"core-minus-invalid\":{\"comment\":\"This should be the root pattern array includes minus #tags-invalid\",\"patterns\":[{\"include\":\"#xml-processing\"},{\"include\":\"#comment\"},{\"include\":\"#doctype\"},{\"include\":\"#cdata\"},{\"include\":\"#tags-valid\"},{\"include\":\"#entities\"}]},\"doctype\":{\"begin\":\"<!(?=(?i:DOCTYPE\\\\s))\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.begin.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.metadata.doctype.html\",\"patterns\":[{\"match\":\"\\\\G(?i:DOCTYPE)\",\"name\":\"entity.name.tag.html\"},{\"begin\":\"\\\"\",\"end\":\"\\\"\",\"name\":\"string.quoted.double.html\"},{\"match\":\"[^\\\\s>]+\",\"name\":\"entity.other.attribute-name.html\"}]},\"entities\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"punctuation.definition.entity.html\"},\"912\":{\"name\":\"punctuation.definition.entity.html\"}},\"comment\":\"Yes this is a bit ridiculous, there are quite a lot of these\",\"match\":\"(&)(?=[a-zA-Z])((a(s(ymp(eq)?|cr|t)|n(d(slope|d|v|and)?|g(s(t|ph)|zarr|e|le|rt(vb(d)?)?|msd(a(h|c|d|e|f|a|g|b))?)?)|c(y|irc|d|ute|E)?|tilde|o(pf|gon)|uml|p(id|os|prox(eq)?|e|E|acir)?|elig|f(r)?|w(conint|int)|l(pha|e(ph|fsym))|acute|ring|grave|m(p|a(cr|lg))|breve)|A(s(sign|cr)|nd|MP|c(y|irc)|tilde|o(pf|gon)|uml|pplyFunction|fr|Elig|lpha|acute|ring|grave|macr|breve))|(B(scr|cy|opf|umpeq|e(cause|ta|rnoullis)|fr|a(ckslash|r(v|wed))|reve)|b(s(cr|im(e)?|ol(hsub|b)?|emi)|n(ot|e(quiv)?)|c(y|ong)|ig(s(tar|qcup)|c(irc|up|ap)|triangle(down|up)|o(times|dot|plus)|uplus|vee|wedge)|o(t(tom)?|pf|wtie|x(h(d|u|D|U)?|times|H(d|u|D|U)?|d(R|l|r|L)|u(R|l|r|L)|plus|D(R|l|r|L)|v(R|h|H|l|r|L)?|U(R|l|r|L)|V(R|h|H|l|r|L)?|minus|box))|Not|dquo|u(ll(et)?|mp(e(q)?|E)?)|prime|e(caus(e)?|t(h|ween|a)|psi|rnou|mptyv)|karow|fr|l(ock|k(1(2|4)|34)|a(nk|ck(square|triangle(down|left|right)?|lozenge)))|a(ck(sim(eq)?|cong|prime|epsilon)|r(vee|wed(ge)?))|r(eve|vbar)|brk(tbrk)?))|(c(s(cr|u(p(e)?|b(e)?))|h(cy|i|eck(mark)?)|ylcty|c(irc|ups(sm)?|edil|a(ps|ron))|tdot|ir(scir|c(eq|le(d(R|circ|S|dash|ast)|arrow(left|right)))?|e|fnint|E|mid)?|o(n(int|g(dot)?)|p(y(sr)?|f|rod)|lon(e(q)?)?|m(p(fn|le(xes|ment))?|ma(t)?))|dot|u(darr(l|r)|p(s|c(up|ap)|or|dot|brcap)?|e(sc|pr)|vee|wed|larr(p)?|r(vearrow(left|right)|ly(eq(succ|prec)|vee|wedge)|arr(m)?|ren))|e(nt(erdot)?|dil|mptyv)|fr|w(conint|int)|lubs(uit)?|a(cute|p(s|c(up|ap)|dot|and|brcup)?|r(on|et))|r(oss|arr))|C(scr|hi|c(irc|onint|edil|aron)|ircle(Minus|Times|Dot|Plus)|Hcy|o(n(tourIntegral|int|gruent)|unterClockwiseContourIntegral|p(f|roduct)|lon(e)?)|dot|up(Cap)?|OPY|e(nterDot|dilla)|fr|lo(seCurly(DoubleQuote|Quote)|ckwiseContourIntegral)|a(yleys|cute|p(italDifferentialD)?)|ross))|(d(s(c(y|r)|trok|ol)|har(l|r)|c(y|aron)|t(dot|ri(f)?)|i(sin|e|v(ide(ontimes)?|onx)?|am(s|ond(suit)?)?|gamma)|Har|z(cy|igrarr)|o(t(square|plus|eq(dot)?|minus)?|ublebarwedge|pf|wn(harpoon(left|right)|downarrows|arrow)|llar)|d(otseq|a(rr|gger))?|u(har|arr)|jcy|e(lta|g|mptyv)|f(isht|r)|wangle|lc(orn|rop)|a(sh(v)?|leth|rr|gger)|r(c(orn|rop)|bkarow)|b(karow|lac)|Arr)|D(s(cr|trok)|c(y|aron)|Scy|i(fferentialD|a(critical(Grave|Tilde|Do(t|ubleAcute)|Acute)|mond))|o(t(Dot|Equal)?|uble(Right(Tee|Arrow)|ContourIntegral|Do(t|wnArrow)|Up(DownArrow|Arrow)|VerticalBar|L(ong(RightArrow|Left(RightArrow|Arrow))|eft(RightArrow|Tee|Arrow)))|pf|wn(Right(TeeVector|Vector(Bar)?)|Breve|Tee(Arrow)?|arrow|Left(RightVector|TeeVector|Vector(Bar)?)|Arrow(Bar|UpArrow)?))|Zcy|el(ta)?|D(otrahd)?|Jcy|fr|a(shv|rr|gger)))|(e(s(cr|im|dot)|n(sp|g)|c(y|ir(c)?|olon|aron)|t(h|a)|o(pf|gon)|dot|u(ro|ml)|p(si(v|lon)?|lus|ar(sl)?)|e|D(ot|Dot)|q(s(im|lant(less|gtr))|c(irc|olon)|u(iv(DD)?|est|als)|vparsl)|f(Dot|r)|l(s(dot)?|inters|l)?|a(ster|cute)|r(Dot|arr)|g(s(dot)?|rave)?|x(cl|ist|p(onentiale|ectation))|m(sp(1(3|4))?|pty(set|v)?|acr))|E(s(cr|im)|c(y|irc|aron)|ta|o(pf|gon)|NG|dot|uml|TH|psilon|qu(ilibrium|al(Tilde)?)|fr|lement|acute|grave|x(ists|ponentialE)|m(pty(SmallSquare|VerySmallSquare)|acr)))|(f(scr|nof|cy|ilig|o(pf|r(k(v)?|all))|jlig|partint|emale|f(ilig|l(ig|lig)|r)|l(tns|lig|at)|allingdotseq|r(own|a(sl|c(1(2|8|3|4|5|6)|78|2(3|5)|3(8|4|5)|45|5(8|6)))))|F(scr|cy|illed(SmallSquare|VerySmallSquare)|o(uriertrf|pf|rAll)|fr))|(G(scr|c(y|irc|edil)|t|opf|dot|T|Jcy|fr|amma(d)?|reater(Greater|SlantEqual|Tilde|Equal(Less)?|FullEqual|Less)|g|breve)|g(s(cr|im(e|l)?)|n(sim|e(q(q)?)?|E|ap(prox)?)|c(y|irc)|t(c(c|ir)|dot|quest|lPar|r(sim|dot|eq(qless|less)|less|a(pprox|rr)))?|imel|opf|dot|jcy|e(s(cc|dot(o(l)?)?|l(es)?)?|q(slant|q)?|l)?|v(nE|ertneqq)|fr|E(l)?|l(j|E|a)?|a(cute|p|mma(d)?)|rave|g(g)?|breve))|(h(s(cr|trok|lash)|y(phen|bull)|circ|o(ok(leftarrow|rightarrow)|pf|arr|rbar|mtht)|e(llip|arts(uit)?|rcon)|ks(earow|warow)|fr|a(irsp|lf|r(dcy|r(cir|w)?)|milt)|bar|Arr)|H(s(cr|trok)|circ|ilbertSpace|o(pf|rizontalLine)|ump(DownHump|Equal)|fr|a(cek|t)|ARDcy))|(i(s(cr|in(s(v)?|dot|v|E)?)|n(care|t(cal|prod|e(rcal|gers)|larhk)?|odot|fin(tie)?)?|c(y|irc)?|t(ilde)?|i(nfin|i(nt|int)|ota)?|o(cy|ta|pf|gon)|u(kcy|ml)|jlig|prod|e(cy|xcl)|quest|f(f|r)|acute|grave|m(of|ped|a(cr|th|g(part|e|line))))|I(scr|n(t(e(rsection|gral))?|visible(Comma|Times))|c(y|irc)|tilde|o(ta|pf|gon)|dot|u(kcy|ml)|Ocy|Jlig|fr|Ecy|acute|grave|m(plies|a(cr|ginaryI))?))|(j(s(cr|ercy)|c(y|irc)|opf|ukcy|fr|math)|J(s(cr|ercy)|c(y|irc)|opf|ukcy|fr))|(k(scr|hcy|c(y|edil)|opf|jcy|fr|appa(v)?|green)|K(scr|c(y|edil)|Hcy|opf|Jcy|fr|appa))|(l(s(h|cr|trok|im(e|g)?|q(uo(r)?|b)|aquo)|h(ar(d|u(l)?)|blk)|n(sim|e(q(q)?)?|E|ap(prox)?)|c(y|ub|e(il|dil)|aron)|Barr|t(hree|c(c|ir)|imes|dot|quest|larr|r(i(e|f)?|Par))?|Har|o(ng(left(arrow|rightarrow)|rightarrow|mapsto)|times|z(enge|f)?|oparrow(left|right)|p(f|lus|ar)|w(ast|bar)|a(ng|rr)|brk)|d(sh|ca|quo(r)?|r(dhar|ushar))|ur(dshar|uhar)|jcy|par(lt)?|e(s(s(sim|dot|eq(qgtr|gtr)|approx|gtr)|cc|dot(o(r)?)?|g(es)?)?|q(slant|q)?|ft(harpoon(down|up)|threetimes|leftarrows|arrow(tail)?|right(squigarrow|harpoons|arrow(s)?))|g)?|v(nE|ertneqq)|f(isht|loor|r)|E(g)?|l(hard|corner|tri|arr)?|a(ng(d|le)?|cute|t(e(s)?|ail)?|p|emptyv|quo|rr(sim|hk|tl|pl|fs|lp|b(fs)?)?|gran|mbda)|r(har(d)?|corner|tri|arr|m)|g(E)?|m(idot|oust(ache)?)|b(arr|r(k(sl(d|u)|e)|ac(e|k))|brk)|A(tail|arr|rr))|L(s(h|cr|trok)|c(y|edil|aron)|t|o(ng(RightArrow|left(arrow|rightarrow)|rightarrow|Left(RightArrow|Arrow))|pf|wer(RightArrow|LeftArrow))|T|e(ss(Greater|SlantEqual|Tilde|EqualGreater|FullEqual|Less)|ft(Right(Vector|Arrow)|Ceiling|T(ee(Vector|Arrow)?|riangle(Bar|Equal)?)|Do(ubleBracket|wn(TeeVector|Vector(Bar)?))|Up(TeeVector|DownVector|Vector(Bar)?)|Vector(Bar)?|arrow|rightarrow|Floor|A(ngleBracket|rrow(RightArrow|Bar)?)))|Jcy|fr|l(eftarrow)?|a(ng|cute|placetrf|rr|mbda)|midot))|(M(scr|cy|inusPlus|opf|u|e(diumSpace|llintrf)|fr|ap)|m(s(cr|tpos)|ho|nplus|c(y|omma)|i(nus(d(u)?|b)?|cro|d(cir|dot|ast)?)|o(dels|pf)|dash|u(ltimap|map)?|p|easuredangle|DDot|fr|l(cp|dr)|a(cr|p(sto(down|up|left)?)?|l(t(ese)?|e)|rker)))|(n(s(hort(parallel|mid)|c(cue|e|r)?|im(e(q)?)?|u(cc(eq)?|p(set(eq(q)?)?|e|E)?|b(set(eq(q)?)?|e|E)?)|par|qsu(pe|be)|mid)|Rightarrow|h(par|arr|Arr)|G(t(v)?|g)|c(y|ong(dot)?|up|edil|a(p|ron))|t(ilde|lg|riangle(left(eq)?|right(eq)?)|gl)|i(s(d)?|v)?|o(t(ni(v(c|a|b))?|in(dot|v(c|a|b)|E)?)?|pf)|dash|u(m(sp|ero)?)?|jcy|p(olint|ar(sl|t|allel)?|r(cue|e(c(eq)?)?)?)|e(s(im|ear)|dot|quiv|ar(hk|r(ow)?)|xist(s)?|Arr)?|v(sim|infin|Harr|dash|Dash|l(t(rie)?|e|Arr)|ap|r(trie|Arr)|g(t|e))|fr|w(near|ar(hk|r(ow)?)|Arr)|V(dash|Dash)|l(sim|t(ri(e)?)?|dr|e(s(s)?|q(slant|q)?|ft(arrow|rightarrow))?|E|arr|Arr)|a(ng|cute|tur(al(s)?)?|p(id|os|prox|E)?|bla)|r(tri(e)?|ightarrow|arr(c|w)?|Arr)|g(sim|t(r)?|e(s|q(slant|q)?)?|E)|mid|L(t(v)?|eft(arrow|rightarrow)|l)|b(sp|ump(e)?))|N(scr|c(y|edil|aron)|tilde|o(nBreakingSpace|Break|t(R(ightTriangle(Bar|Equal)?|everseElement)|Greater(Greater|SlantEqual|Tilde|Equal|FullEqual|Less)?|S(u(cceeds(SlantEqual|Tilde|Equal)?|perset(Equal)?|bset(Equal)?)|quareSu(perset(Equal)?|bset(Equal)?))|Hump(DownHump|Equal)|Nested(GreaterGreater|LessLess)|C(ongruent|upCap)|Tilde(Tilde|Equal|FullEqual)?|DoubleVerticalBar|Precedes(SlantEqual|Equal)?|E(qual(Tilde)?|lement|xists)|VerticalBar|Le(ss(Greater|SlantEqual|Tilde|Equal|Less)?|ftTriangle(Bar|Equal)?))?|pf)|u|e(sted(GreaterGreater|LessLess)|wLine|gative(MediumSpace|Thi(nSpace|ckSpace)|VeryThinSpace))|Jcy|fr|acute))|(o(s(cr|ol|lash)|h(m|bar)|c(y|ir(c)?)|ti(lde|mes(as)?)|S|int|opf|d(sold|iv|ot|ash|blac)|uml|p(erp|lus|ar)|elig|vbar|f(cir|r)|l(c(ir|ross)|t|ine|arr)|a(st|cute)|r(slope|igof|or|d(er(of)?|f|m)?|v|arr)?|g(t|on|rave)|m(i(nus|cron|d)|ega|acr))|O(s(cr|lash)|c(y|irc)|ti(lde|mes)|opf|dblac|uml|penCurly(DoubleQuote|Quote)|ver(B(ar|rac(e|ket))|Parenthesis)|fr|Elig|acute|r|grave|m(icron|ega|acr)))|(p(s(cr|i)|h(i(v)?|one|mmat)|cy|i(tchfork|v)?|o(intint|und|pf)|uncsp|er(cnt|tenk|iod|p|mil)|fr|l(us(sim|cir|two|d(o|u)|e|acir|mn|b)?|an(ck(h)?|kv))|ar(s(im|l)|t|a(llel)?)?|r(sim|n(sim|E|ap)|cue|ime(s)?|o(d|p(to)?|f(surf|line|alar))|urel|e(c(sim|n(sim|eqq|approx)|curlyeq|eq|approx)?)?|E|ap)?|m)|P(s(cr|i)|hi|cy|i|o(incareplane|pf)|fr|lusMinus|artialD|r(ime|o(duct|portion(al)?)|ecedes(SlantEqual|Tilde|Equal)?)?))|(q(scr|int|opf|u(ot|est(eq)?|at(int|ernions))|prime|fr)|Q(scr|opf|UOT|fr))|(R(s(h|cr)|ho|c(y|edil|aron)|Barr|ight(Ceiling|T(ee(Vector|Arrow)?|riangle(Bar|Equal)?)|Do(ubleBracket|wn(TeeVector|Vector(Bar)?))|Up(TeeVector|DownVector|Vector(Bar)?)|Vector(Bar)?|arrow|Floor|A(ngleBracket|rrow(Bar|LeftArrow)?))|o(undImplies|pf)|uleDelayed|e(verse(UpEquilibrium|E(quilibrium|lement)))?|fr|EG|a(ng|cute|rr(tl)?)|rightarrow)|r(s(h|cr|q(uo(r)?|b)|aquo)|h(o(v)?|ar(d|u(l)?))|nmid|c(y|ub|e(il|dil)|aron)|Barr|t(hree|imes|ri(e|f|ltri)?)|i(singdotseq|ng|ght(squigarrow|harpoon(down|up)|threetimes|left(harpoons|arrows)|arrow(tail)?|rightarrows))|Har|o(times|p(f|lus|ar)|a(ng|rr)|brk)|d(sh|ca|quo(r)?|ldhar)|uluhar|p(polint|ar(gt)?)|e(ct|al(s|ine|part)?|g)|f(isht|loor|r)|l(har|arr|m)|a(ng(d|e|le)?|c(ute|e)|t(io(nals)?|ail)|dic|emptyv|quo|rr(sim|hk|c|tl|pl|fs|w|lp|ap|b(fs)?)?)|rarr|x|moust(ache)?|b(arr|r(k(sl(d|u)|e)|ac(e|k))|brk)|A(tail|arr|rr)))|(s(s(cr|tarf|etmn|mile)|h(y|c(hcy|y)|ort(parallel|mid)|arp)|c(sim|y|n(sim|E|ap)|cue|irc|polint|e(dil)?|E|a(p|ron))?|t(ar(f)?|r(ns|aight(phi|epsilon)))|i(gma(v|f)?|m(ne|dot|plus|e(q)?|l(E)?|rarr|g(E)?)?)|zlig|o(pf|ftcy|l(b(ar)?)?)|dot(e|b)?|u(ng|cc(sim|n(sim|eqq|approx)|curlyeq|eq|approx)?|p(s(im|u(p|b)|et(neq(q)?|eq(q)?)?)|hs(ol|ub)|1|n(e|E)|2|d(sub|ot)|3|plus|e(dot)?|E|larr|mult)?|m|b(s(im|u(p|b)|et(neq(q)?|eq(q)?)?)|n(e|E)|dot|plus|e(dot)?|E|rarr|mult)?)|pa(des(uit)?|r)|e(swar|ct|tm(n|inus)|ar(hk|r(ow)?)|xt|mi|Arr)|q(su(p(set(eq)?|e)?|b(set(eq)?|e)?)|c(up(s)?|ap(s)?)|u(f|ar(e|f))?)|fr(own)?|w(nwar|ar(hk|r(ow)?)|Arr)|larr|acute|rarr|m(t(e(s)?)?|i(d|le)|eparsl|a(shp|llsetminus))|bquo)|S(scr|hort(RightArrow|DownArrow|UpArrow|LeftArrow)|c(y|irc|edil|aron)?|tar|igma|H(cy|CHcy)|opf|u(c(hThat|ceeds(SlantEqual|Tilde|Equal)?)|p(set|erset(Equal)?)?|m|b(set(Equal)?)?)|OFTcy|q(uare(Su(perset(Equal)?|bset(Equal)?)|Intersection|Union)?|rt)|fr|acute|mallCircle))|(t(s(hcy|c(y|r)|trok)|h(i(nsp|ck(sim|approx))|orn|e(ta(sym|v)?|re(4|fore))|k(sim|ap))|c(y|edil|aron)|i(nt|lde|mes(d|b(ar)?)?)|o(sa|p(cir|f(ork)?|bot)?|ea)|dot|prime|elrec|fr|w(ixt|ohead(leftarrow|rightarrow))|a(u|rget)|r(i(sb|time|dot|plus|e|angle(down|q|left(eq)?|right(eq)?)?|minus)|pezium|ade)|brk)|T(s(cr|trok)|RADE|h(i(nSpace|ckSpace)|e(ta|refore))|c(y|edil|aron)|S(cy|Hcy)|ilde(Tilde|Equal|FullEqual)?|HORN|opf|fr|a(u|b)|ripleDot))|(u(scr|h(ar(l|r)|blk)|c(y|irc)|t(ilde|dot|ri(f)?)|Har|o(pf|gon)|d(har|arr|blac)|u(arr|ml)|p(si(h|lon)?|harpoon(left|right)|downarrow|uparrows|lus|arrow)|f(isht|r)|wangle|l(c(orn(er)?|rop)|tri)|a(cute|rr)|r(c(orn(er)?|rop)|tri|ing)|grave|m(l|acr)|br(cy|eve)|Arr)|U(scr|n(ion(Plus)?|der(B(ar|rac(e|ket))|Parenthesis))|c(y|irc)|tilde|o(pf|gon)|dblac|uml|p(si(lon)?|downarrow|Tee(Arrow)?|per(RightArrow|LeftArrow)|DownArrow|Equilibrium|arrow|Arrow(Bar|DownArrow)?)|fr|a(cute|rr(ocir)?)|ring|grave|macr|br(cy|eve)))|(v(s(cr|u(pn(e|E)|bn(e|E)))|nsu(p|b)|cy|Bar(v)?|zigzag|opf|dash|prop|e(e(eq|bar)?|llip|r(t|bar))|Dash|fr|ltri|a(ngrt|r(s(igma|u(psetneq(q)?|bsetneq(q)?))|nothing|t(heta|riangle(left|right))|p(hi|i|ropto)|epsilon|kappa|r(ho)?))|rtri|Arr)|V(scr|cy|opf|dash(l)?|e(e|r(yThinSpace|t(ical(Bar|Separator|Tilde|Line))?|bar))|Dash|vdash|fr|bar))|(w(scr|circ|opf|p|e(ierp|d(ge(q)?|bar))|fr|r(eath)?)|W(scr|circ|opf|edge|fr))|(X(scr|i|opf|fr)|x(s(cr|qcup)|h(arr|Arr)|nis|c(irc|up|ap)|i|o(time|dot|p(f|lus))|dtri|u(tri|plus)|vee|fr|wedge|l(arr|Arr)|r(arr|Arr)|map))|(y(scr|c(y|irc)|icy|opf|u(cy|ml)|en|fr|ac(y|ute))|Y(scr|c(y|irc)|opf|uml|Icy|Ucy|fr|acute|Acy))|(z(scr|hcy|c(y|aron)|igrarr|opf|dot|e(ta|etrf)|fr|w(nj|j)|acute)|Z(scr|c(y|aron)|Hcy|opf|dot|e(ta|roWidthSpace)|fr|acute)))(;)\",\"name\":\"constant.character.entity.named.$2.html\"},{\"captures\":{\"1\":{\"name\":\"punctuation.definition.entity.html\"},\"3\":{\"name\":\"punctuation.definition.entity.html\"}},\"match\":\"(&)#\\\\d+(;)\",\"name\":\"constant.character.entity.numeric.decimal.html\"},{\"captures\":{\"1\":{\"name\":\"punctuation.definition.entity.html\"},\"3\":{\"name\":\"punctuation.definition.entity.html\"}},\"match\":\"(&)#[xX][0-9a-fA-F]+(;)\",\"name\":\"constant.character.entity.numeric.hexadecimal.html\"},{\"match\":\"&(?=[a-zA-Z0-9]+;)\",\"name\":\"invalid.illegal.ambiguous-ampersand.html\"}]},\"math\":{\"patterns\":[{\"begin\":\"(?i)(<)(math)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(>))?\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.structure.$2.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"end\":\"(?i)(</)(\\\\2)\\\\s*(>)\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.structure.$2.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.element.structure.$2.html\",\"patterns\":[{\"begin\":\"(?<!>)\\\\G\",\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.structure.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"include\":\"#tags\"}]}],\"repository\":{\"attribute\":{\"patterns\":[{\"begin\":\"(s(hift|ymmetric|cript(sizemultiplier|level|minsize)|t(ackalign|retchy)|ide|u(pscriptshift|bscriptshift)|e(parator(s)?|lection)|rc)|h(eight|ref)|n(otation|umalign)|c(haralign|olumn(spa(n|cing)|width|lines|align)|lose|rossout)|i(n(dent(shift(first|last)?|target|align(first|last)?)|fixlinebreakstyle)|d)|o(pen|verflow)|d(i(splay(style)?|r)|e(nomalign|cimalpoint|pth))|position|e(dge|qual(columns|rows))|voffset|f(orm|ence|rame(spacing)?)|width|l(space|ine(thickness|leading|break(style|multchar)?)|o(ngdivstyle|cation)|ength|quote|argeop)|a(c(cent(under)?|tiontype)|l(t(text|img(-(height|valign|width))?)|ign(mentscope)?))|r(space|ow(spa(n|cing)|lines|align)|quote)|groupalign|x(link:href|mlns)|m(in(size|labelspacing)|ovablelimits|a(th(size|color|variant|background)|xsize))|bevelled)(?![\\\\w:-])\",\"beginCaptures\":{\"0\":{\"name\":\"entity.other.attribute-name.html\"}},\"end\":\"(?=\\\\s*+[^=\\\\s])\",\"name\":\"meta.attribute.$1.html\",\"patterns\":[{\"include\":\"#attribute-interior\"}]},{\"begin\":\"([^\\\\x{0020}\\\"'<>/=\\\\x{0000}-\\\\x{001F}\\\\x{007F}-\\\\x{009F}\\\\x{FDD0}-\\\\x{FDEF}\\\\x{FFFE}\\\\x{FFFF}\\\\x{1FFFE}\\\\x{1FFFF}\\\\x{2FFFE}\\\\x{2FFFF}\\\\x{3FFFE}\\\\x{3FFFF}\\\\x{4FFFE}\\\\x{4FFFF}\\\\x{5FFFE}\\\\x{5FFFF}\\\\x{6FFFE}\\\\x{6FFFF}\\\\x{7FFFE}\\\\x{7FFFF}\\\\x{8FFFE}\\\\x{8FFFF}\\\\x{9FFFE}\\\\x{9FFFF}\\\\x{AFFFE}\\\\x{AFFFF}\\\\x{BFFFE}\\\\x{BFFFF}\\\\x{CFFFE}\\\\x{CFFFF}\\\\x{DFFFE}\\\\x{DFFFF}\\\\x{EFFFE}\\\\x{EFFFF}\\\\x{FFFFE}\\\\x{FFFFF}\\\\x{10FFFE}\\\\x{10FFFF}]+)\",\"beginCaptures\":{\"0\":{\"name\":\"entity.other.attribute-name.html\"}},\"comment\":\"Anything else that is valid\",\"end\":\"(?=\\\\s*+[^=\\\\s])\",\"name\":\"meta.attribute.unrecognized.$1.html\",\"patterns\":[{\"include\":\"#attribute-interior\"}]},{\"match\":\"[^\\\\s>]+\",\"name\":\"invalid.illegal.character-not-allowed-here.html\"}]},\"tags\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#cdata\"},{\"captures\":{\"0\":{\"name\":\"meta.tag.structure.math.$2.void.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"match\":\"(?i)(<)(annotation|annotation-xml|semantics|menclose|merror|mfenced|mfrac|mpadded|mphantom|mroot|mrow|msqrt|mstyle|mmultiscripts|mover|mprescripts|msub|msubsup|msup|munder|munderover|none|mlabeledtr|mtable|mtd|mtr|mlongdiv|mscarries|mscarry|msgroup|msline|msrow|mstack|maction)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(/>))\",\"name\":\"meta.element.structure.math.$2.html\"},{\"begin\":\"(?i)(<)(annotation|annotation-xml|semantics|menclose|merror|mfenced|mfrac|mpadded|mphantom|mroot|mrow|msqrt|mstyle|mmultiscripts|mover|mprescripts|msub|msubsup|msup|munder|munderover|none|mlabeledtr|mtable|mtd|mtr|mlongdiv|mscarries|mscarry|msgroup|msline|msrow|mstack|maction)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(>))?\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.structure.math.$2.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"end\":\"(?i)(</)(\\\\2)\\\\s*(>)|(/>)|(?=</\\\\w+)\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.structure.math.$2.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"punctuation.definition.tag.end.html\"},\"4\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.element.structure.math.$2.html\",\"patterns\":[{\"begin\":\"(?<!>)\\\\G\",\"end\":\"(?=/>)|>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.structure.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"include\":\"#tags\"}]},{\"captures\":{\"0\":{\"name\":\"meta.tag.inline.math.$2.void.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"match\":\"(?i)(<)(mi|mn|mo|ms|mspace|mtext|maligngroup|malignmark)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(/>))\",\"name\":\"meta.element.inline.math.$2.html\"},{\"begin\":\"(?i)(<)(mi|mn|mo|ms|mspace|mtext|maligngroup|malignmark)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(>))?\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.inline.math.$2.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"end\":\"(?i)(</)(\\\\2)\\\\s*(>)|(/>)|(?=</\\\\w+)\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.inline.math.$2.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"punctuation.definition.tag.end.html\"},\"4\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.element.inline.math.$2.html\",\"patterns\":[{\"begin\":\"(?<!>)\\\\G\",\"end\":\"(?=/>)|>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.inline.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"include\":\"#tags\"}]},{\"captures\":{\"0\":{\"name\":\"meta.tag.object.math.$2.void.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"match\":\"(?i)(<)(mglyph)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(/>))\",\"name\":\"meta.element.object.math.$2.html\"},{\"begin\":\"(?i)(<)(mglyph)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(>))?\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.object.math.$2.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"end\":\"(?i)(</)(\\\\2)\\\\s*(>)|(/>)|(?=</\\\\w+)\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.object.math.$2.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"punctuation.definition.tag.end.html\"},\"4\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.element.object.math.$2.html\",\"patterns\":[{\"begin\":\"(?<!>)\\\\G\",\"end\":\"(?=/>)|>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.object.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"include\":\"#tags\"}]},{\"captures\":{\"0\":{\"name\":\"meta.tag.other.invalid.void.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.illegal.unrecognized-tag.html\"},\"4\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"6\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"match\":\"(?i)(<)(([\\\\w:]+))(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(/>))\",\"name\":\"meta.element.other.invalid.html\"},{\"begin\":\"(?i)(<)((\\\\w[^\\\\s>]*))(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(>))?\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.other.invalid.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.illegal.unrecognized-tag.html\"},\"4\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"6\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"end\":\"(?i)(</)((\\\\2))\\\\s*(>)|(/>)|(?=</\\\\w+)\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.other.invalid.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.illegal.unrecognized-tag.html\"},\"4\":{\"name\":\"punctuation.definition.tag.end.html\"},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.element.other.invalid.html\",\"patterns\":[{\"begin\":\"(?<!>)\\\\G\",\"end\":\"(?=/>)|>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.other.invalid.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"include\":\"#tags\"}]},{\"include\":\"#tags-invalid\"}]}}},\"svg\":{\"patterns\":[{\"begin\":\"(?i)(<)(svg)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(>))?\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.structure.$2.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"end\":\"(?i)(</)(\\\\2)\\\\s*(>)\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.structure.$2.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.element.structure.$2.html\",\"patterns\":[{\"begin\":\"(?<!>)\\\\G\",\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.structure.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"include\":\"#tags\"}]}],\"repository\":{\"attribute\":{\"patterns\":[{\"begin\":\"(s(hape-rendering|ystemLanguage|cale|t(yle|itchTiles|op-(color|opacity)|dDeviation|em(h|v)|artOffset|r(i(ng|kethrough-(thickness|position))|oke(-(opacity|dash(offset|array)|width|line(cap|join)|miterlimit))?))|urfaceScale|p(e(cular(Constant|Exponent)|ed)|acing|readMethod)|eed|lope)|h(oriz-(origin-x|adv-x)|eight|anging|ref(lang)?)|y(1|2|ChannelSelector)?|n(umOctaves|ame)|c(y|o(ntentS(criptType|tyleType)|lor(-(interpolation(-filters)?|profile|rendering))?)|ursor|l(ip(-(path|rule)|PathUnits)?|ass)|a(p-height|lcMode)|x)|t(ype|o|ext(-(decoration|anchor|rendering)|Length)|a(rget(X|Y)?|b(index|leValues))|ransform)|i(n(tercept|2)?|d(eographic)?|mage-rendering)|z(oomAndPan)?|o(p(erator|acity)|ver(flow|line-(thickness|position))|ffset|r(i(ent(ation)?|gin)|der))|d(y|i(splay|visor|ffuseConstant|rection)|ominant-baseline|ur|e(scent|celerate)|x)?|u(1|n(i(code(-(range|bidi))?|ts-per-em)|derline-(thickness|position))|2)|p(ing|oint(s(At(X|Y|Z))?|er-events)|a(nose-1|t(h(Length)?|tern(ContentUnits|Transform|Units))|int-order)|r(imitiveUnits|eserveA(spectRatio|lpha)))|e(n(d|able-background)|dgeMode|levation|x(ternalResourcesRequired|ponent))|v(i(sibility|ew(Box|Target))|-(hanging|ideographic|alphabetic|mathematical)|e(ctor-effect|r(sion|t-(origin-(y|x)|adv-y)))|alues)|k(1|2|3|e(y(Splines|Times|Points)|rn(ing|el(Matrix|UnitLength)))|4)?|f(y|il(ter(Res|Units)?|l(-(opacity|rule))?)|o(nt-(s(t(yle|retch)|ize(-adjust)?)|variant|family|weight)|rmat)|lood-(color|opacity)|r(om)?|x)|w(idth(s)?|ord-spacing|riting-mode)|l(i(ghting-color|mitingConeAngle)|ocal|e(ngthAdjust|tter-spacing)|ang)|a(scent|cc(umulate|ent-height)|ttribute(Name|Type)|zimuth|dditive|utoReverse|l(ignment-baseline|phabetic|lowReorder)|rabic-form|mplitude)|r(y|otate|e(s(tart|ult)|ndering-intent|peat(Count|Dur)|quired(Extensions|Features)|f(X|Y|errerPolicy)|l)|adius|x)?|g(1|2|lyph(Ref|-(name|orientation-(horizontal|vertical)))|radient(Transform|Units))|x(1|2|ChannelSelector|-height|link:(show|href|t(ype|itle)|a(ctuate|rcrole)|role)|ml:(space|lang|base))?|m(in|ode|e(thod|dia)|a(sk(ContentUnits|Units)?|thematical|rker(Height|-(start|end|mid)|Units|Width)|x))|b(y|ias|egin|ase(Profile|line-shift|Frequency)|box))(?![\\\\w:-])\",\"beginCaptures\":{\"0\":{\"name\":\"entity.other.attribute-name.html\"}},\"end\":\"(?=\\\\s*+[^=\\\\s])\",\"name\":\"meta.attribute.$1.html\",\"patterns\":[{\"include\":\"#attribute-interior\"}]},{\"begin\":\"([^\\\\x{0020}\\\"'<>/=\\\\x{0000}-\\\\x{001F}\\\\x{007F}-\\\\x{009F}\\\\x{FDD0}-\\\\x{FDEF}\\\\x{FFFE}\\\\x{FFFF}\\\\x{1FFFE}\\\\x{1FFFF}\\\\x{2FFFE}\\\\x{2FFFF}\\\\x{3FFFE}\\\\x{3FFFF}\\\\x{4FFFE}\\\\x{4FFFF}\\\\x{5FFFE}\\\\x{5FFFF}\\\\x{6FFFE}\\\\x{6FFFF}\\\\x{7FFFE}\\\\x{7FFFF}\\\\x{8FFFE}\\\\x{8FFFF}\\\\x{9FFFE}\\\\x{9FFFF}\\\\x{AFFFE}\\\\x{AFFFF}\\\\x{BFFFE}\\\\x{BFFFF}\\\\x{CFFFE}\\\\x{CFFFF}\\\\x{DFFFE}\\\\x{DFFFF}\\\\x{EFFFE}\\\\x{EFFFF}\\\\x{FFFFE}\\\\x{FFFFF}\\\\x{10FFFE}\\\\x{10FFFF}]+)\",\"beginCaptures\":{\"0\":{\"name\":\"entity.other.attribute-name.html\"}},\"comment\":\"Anything else that is valid\",\"end\":\"(?=\\\\s*+[^=\\\\s])\",\"name\":\"meta.attribute.unrecognized.$1.html\",\"patterns\":[{\"include\":\"#attribute-interior\"}]},{\"match\":\"[^\\\\s>]+\",\"name\":\"invalid.illegal.character-not-allowed-here.html\"}]},\"tags\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#cdata\"},{\"captures\":{\"0\":{\"name\":\"meta.tag.metadata.svg.$2.void.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"match\":\"(?i)(<)(color-profile|desc|metadata|script|style|title)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(/>))\",\"name\":\"meta.element.metadata.svg.$2.html\"},{\"begin\":\"(?i)(<)(color-profile|desc|metadata|script|style|title)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(>))?\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.metadata.svg.$2.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"end\":\"(?i)(</)(\\\\2)\\\\s*(>)|(/>)|(?=</\\\\w+)\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.metadata.svg.$2.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"punctuation.definition.tag.end.html\"},\"4\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.element.metadata.svg.$2.html\",\"patterns\":[{\"begin\":\"(?<!>)\\\\G\",\"end\":\"(?=/>)|>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.metadata.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"include\":\"#tags\"}]},{\"captures\":{\"0\":{\"name\":\"meta.tag.structure.svg.$2.void.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"match\":\"(?i)(<)(animateMotion|clipPath|defs|feComponentTransfer|feDiffuseLighting|feMerge|feSpecularLighting|filter|g|hatch|linearGradient|marker|mask|mesh|meshgradient|meshpatch|meshrow|pattern|radialGradient|switch|text|textPath)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(/>))\",\"name\":\"meta.element.structure.svg.$2.html\"},{\"begin\":\"(?i)(<)(animateMotion|clipPath|defs|feComponentTransfer|feDiffuseLighting|feMerge|feSpecularLighting|filter|g|hatch|linearGradient|marker|mask|mesh|meshgradient|meshpatch|meshrow|pattern|radialGradient|switch|text|textPath)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(>))?\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.structure.svg.$2.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"end\":\"(?i)(</)(\\\\2)\\\\s*(>)|(/>)|(?=</\\\\w+)\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.structure.svg.$2.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"punctuation.definition.tag.end.html\"},\"4\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.element.structure.svg.$2.html\",\"patterns\":[{\"begin\":\"(?<!>)\\\\G\",\"end\":\"(?=/>)|>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.structure.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"include\":\"#tags\"}]},{\"captures\":{\"0\":{\"name\":\"meta.tag.inline.svg.$2.void.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"match\":\"(?i)(<)(a|animate|discard|feBlend|feColorMatrix|feComposite|feConvolveMatrix|feDisplacementMap|feDistantLight|feDropShadow|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feMergeNode|feMorphology|feOffset|fePointLight|feSpotLight|feTile|feTurbulence|hatchPath|mpath|set|solidcolor|stop|tspan)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(/>))\",\"name\":\"meta.element.inline.svg.$2.html\"},{\"begin\":\"(?i)(<)(a|animate|discard|feBlend|feColorMatrix|feComposite|feConvolveMatrix|feDisplacementMap|feDistantLight|feDropShadow|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feMergeNode|feMorphology|feOffset|fePointLight|feSpotLight|feTile|feTurbulence|hatchPath|mpath|set|solidcolor|stop|tspan)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(>))?\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.inline.svg.$2.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"end\":\"(?i)(</)(\\\\2)\\\\s*(>)|(/>)|(?=</\\\\w+)\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.inline.svg.$2.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"punctuation.definition.tag.end.html\"},\"4\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.element.inline.svg.$2.html\",\"patterns\":[{\"begin\":\"(?<!>)\\\\G\",\"end\":\"(?=/>)|>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.inline.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"include\":\"#tags\"}]},{\"captures\":{\"0\":{\"name\":\"meta.tag.object.svg.$2.void.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"match\":\"(?i)(<)(circle|ellipse|feImage|foreignObject|image|line|path|polygon|polyline|rect|symbol|use|view)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(/>))\",\"name\":\"meta.element.object.svg.$2.html\"},{\"begin\":\"(?i)(<)(a|circle|ellipse|feImage|foreignObject|image|line|path|polygon|polyline|rect|symbol|use|view)(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(>))?\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.object.svg.$2.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"end\":\"(?i)(</)(\\\\2)\\\\s*(>)|(/>)|(?=</\\\\w+)\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.object.svg.$2.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"punctuation.definition.tag.end.html\"},\"4\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.element.object.svg.$2.html\",\"patterns\":[{\"begin\":\"(?<!>)\\\\G\",\"end\":\"(?=/>)|>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.object.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"include\":\"#tags\"}]},{\"captures\":{\"0\":{\"name\":\"meta.tag.other.svg.$2.void.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.deprecated.html\"},\"4\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"6\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"match\":\"(?i)(<)((altGlyph|altGlyphDef|altGlyphItem|animateColor|animateTransform|cursor|font|font-face|font-face-format|font-face-name|font-face-src|font-face-uri|glyph|glyphRef|hkern|missing-glyph|tref|vkern))(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(/>))\",\"name\":\"meta.element.other.svg.$2.html\"},{\"begin\":\"(?i)(<)((altGlyph|altGlyphDef|altGlyphItem|animateColor|animateTransform|cursor|font|font-face|font-face-format|font-face-name|font-face-src|font-face-uri|glyph|glyphRef|hkern|missing-glyph|tref|vkern))(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(>))?\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.other.svg.$2.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.deprecated.html\"},\"4\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"6\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"end\":\"(?i)(</)((\\\\2))\\\\s*(>)|(/>)|(?=</\\\\w+)\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.other.svg.$2.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.deprecated.html\"},\"4\":{\"name\":\"punctuation.definition.tag.end.html\"},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.element.other.svg.$2.html\",\"patterns\":[{\"begin\":\"(?<!>)\\\\G\",\"end\":\"(?=/>)|>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.other.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"include\":\"#tags\"}]},{\"captures\":{\"0\":{\"name\":\"meta.tag.other.invalid.void.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.illegal.unrecognized-tag.html\"},\"4\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"6\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"match\":\"(?i)(<)(([\\\\w:]+))(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(/>))\",\"name\":\"meta.element.other.invalid.html\"},{\"begin\":\"(?i)(<)((\\\\w[^\\\\s>]*))(?=\\\\s|/?>)(?:(([^\\\"'>]|\\\"[^\\\"]*\\\"|'[^']*')*)(>))?\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.other.invalid.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.illegal.unrecognized-tag.html\"},\"4\":{\"patterns\":[{\"include\":\"#attribute\"}]},\"6\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"end\":\"(?i)(</)((\\\\2))\\\\s*(>)|(/>)|(?=</\\\\w+)\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.other.invalid.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.illegal.unrecognized-tag.html\"},\"4\":{\"name\":\"punctuation.definition.tag.end.html\"},\"5\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.element.other.invalid.html\",\"patterns\":[{\"begin\":\"(?<!>)\\\\G\",\"end\":\"(?=/>)|>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.other.invalid.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"include\":\"#tags\"}]},{\"include\":\"#tags-invalid\"}]}}},\"tags-invalid\":{\"patterns\":[{\"begin\":\"(</?)((\\\\w[^\\\\s>]*))(?<!/)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.illegal.unrecognized-tag.html\"}},\"end\":\"((?: ?/)?>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.other.$2.html\",\"patterns\":[{\"include\":\"#attribute\"}]}]},\"tags-valid\":{\"patterns\":[{\"begin\":\"(^[ \\\\t]+)?(?=<(?i:style)\\\\b(?!-))\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.whitespace.embedded.leading.html\"}},\"end\":\"(?!\\\\G)([ \\\\t]*$\\\\n?)?\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.whitespace.embedded.trailing.html\"}},\"patterns\":[{\"begin\":\"(?i)(<)(style)(?=\\\\s|/?>)\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.metadata.style.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\"(?i)((<)/)(style)\\\\s*(>)\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.metadata.style.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"source.css-ignored-vscode\"},\"3\":{\"name\":\"entity.name.tag.html\"},\"4\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.embedded.block.html\",\"patterns\":[{\"begin\":\"\\\\G\",\"captures\":{\"1\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"end\":\"(>)\",\"name\":\"meta.tag.metadata.style.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?!\\\\G)\",\"end\":\"(?=</(?i:style))\",\"name\":\"source.css\",\"patterns\":[{\"include\":\"source.css\"}]}]}]},{\"begin\":\"(^[ \\\\t]+)?(?=<(?i:script)\\\\b(?!-))\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.whitespace.embedded.leading.html\"}},\"end\":\"(?!\\\\G)([ \\\\t]*$\\\\n?)?\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.whitespace.embedded.trailing.html\"}},\"patterns\":[{\"begin\":\"(<)((?i:script))\\\\b\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.metadata.script.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\"(/)((?i:script))(>)\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.metadata.script.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.embedded.block.html\",\"patterns\":[{\"begin\":\"\\\\G\",\"end\":\"(?=/)\",\"patterns\":[{\"begin\":\"(>)\",\"beginCaptures\":{\"0\":{\"name\":\"meta.tag.metadata.script.start.html\"},\"1\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"end\":\"((<))(?=/(?i:script))\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.metadata.script.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"source.js-ignored-vscode\"}},\"patterns\":[{\"begin\":\"\\\\G\",\"end\":\"(?=</(?i:script))\",\"name\":\"source.js\",\"patterns\":[{\"begin\":\"(^[ \\\\t]+)?(?=//)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.whitespace.comment.leading.js\"}},\"end\":\"(?!\\\\G)\",\"patterns\":[{\"begin\":\"//\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.js\"}},\"end\":\"(?=</script)|\\\\n\",\"name\":\"comment.line.double-slash.js\"}]},{\"begin\":\"/\\\\*\",\"captures\":{\"0\":{\"name\":\"punctuation.definition.comment.js\"}},\"end\":\"\\\\*/|(?=</script)\",\"name\":\"comment.block.js\"},{\"include\":\"source.js\"}]}]},{\"begin\":\"\\\\G\",\"end\":\"(?i:(?=>|type(?=[\\\\s=])(?!\\\\s*=\\\\s*(''|\\\"\\\"|('|\\\"|)(text/(javascript(1\\\\.[0-5])?|x-javascript|jscript|livescript|(x-)?ecmascript|babel)|application/((x-)?javascript|(x-)?ecmascript)|module)[\\\\s\\\"'>]))))\",\"name\":\"meta.tag.metadata.script.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i:(?=type\\\\s*=\\\\s*('|\\\"|)text/(x-handlebars|(x-(handlebars-)?|ng-)?template|html)[\\\\s\\\"'>]))\",\"end\":\"((<))(?=/(?i:script))\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.metadata.script.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"text.html.basic\"}},\"patterns\":[{\"begin\":\"\\\\G\",\"end\":\"(>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.metadata.script.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?!\\\\G)\",\"end\":\"(?=</(?i:script))\",\"name\":\"text.html.basic\",\"patterns\":[{\"include\":\"text.html.basic\"}]}]},{\"begin\":\"(?=(?i:type))\",\"end\":\"(<)(?=/(?i:script))\",\"endCaptures\":{\"0\":{\"name\":\"meta.tag.metadata.script.end.html\"},\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"}},\"patterns\":[{\"begin\":\"\\\\G\",\"end\":\"(>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.metadata.script.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?!\\\\G)\",\"end\":\"(?=</(?i:script))\",\"name\":\"source.unknown\"}]}]}]}]},{\"begin\":\"(?i)(<)(base|link|meta)(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\"/?>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.metadata.$2.void.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(<)(noscript|title)(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.metadata.$2.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(</)(noscript|title)(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.metadata.$2.end.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(<)(col|hr|input)(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\"/?>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.structure.$2.void.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(<)(address|article|aside|blockquote|body|button|caption|colgroup|datalist|dd|details|dialog|div|dl|dt|fieldset|figcaption|figure|footer|form|head|header|hgroup|html|h[1-6]|label|legend|li|main|map|menu|meter|nav|ol|optgroup|option|output|p|pre|progress|section|select|slot|summary|table|tbody|td|template|textarea|tfoot|th|thead|tr|ul)(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.structure.$2.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(</)(address|article|aside|blockquote|body|button|caption|colgroup|datalist|dd|details|dialog|div|dl|dt|fieldset|figcaption|figure|footer|form|head|header|hgroup|html|h[1-6]|label|legend|li|main|map|menu|meter|nav|ol|optgroup|option|output|p|pre|progress|section|select|slot|summary|table|tbody|td|template|textarea|tfoot|th|thead|tr|ul)(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.structure.$2.end.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(<)(area|br|wbr)(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\"/?>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.inline.$2.void.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(<)(a|abbr|b|bdi|bdo|cite|code|data|del|dfn|em|i|ins|kbd|mark|q|rp|rt|ruby|s|samp|small|span|strong|sub|sup|time|u|var)(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.inline.$2.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(</)(a|abbr|b|bdi|bdo|cite|code|data|del|dfn|em|i|ins|kbd|mark|q|rp|rt|ruby|s|samp|small|span|strong|sub|sup|time|u|var)(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.inline.$2.end.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(<)(embed|img|param|source|track)(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\"/?>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.object.$2.void.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(<)(audio|canvas|iframe|object|picture|video)(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.object.$2.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(</)(audio|canvas|iframe|object|picture|video)(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.object.$2.end.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(<)((basefont|isindex))(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.deprecated.html\"}},\"end\":\"/?>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.metadata.$2.void.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(<)((center|frameset|noembed|noframes))(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.deprecated.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.structure.$2.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(</)((center|frameset|noembed|noframes))(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.deprecated.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.structure.$2.end.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(<)((acronym|big|blink|font|strike|tt|xmp))(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.deprecated.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.inline.$2.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(</)((acronym|big|blink|font|strike|tt|xmp))(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.deprecated.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.inline.$2.end.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(<)((frame))(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.deprecated.html\"}},\"end\":\"/?>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.object.$2.void.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(<)((applet))(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.deprecated.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.object.$2.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(</)((applet))(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.deprecated.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.object.$2.end.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(<)((dir|keygen|listing|menuitem|plaintext|spacer))(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.illegal.no-longer-supported.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.other.$2.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(?i)(</)((dir|keygen|listing|menuitem|plaintext|spacer))(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"},\"3\":{\"name\":\"invalid.illegal.no-longer-supported.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.other.$2.end.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"include\":\"#math\"},{\"include\":\"#svg\"},{\"begin\":\"(<)([a-zA-Z][.0-9_a-zA-Z\\\\x{00B7}\\\\x{00C0}-\\\\x{00D6}\\\\x{00D8}-\\\\x{00F6}\\\\x{00F8}-\\\\x{037D}\\\\x{037F}-\\\\x{1FFF}\\\\x{200C}-\\\\x{200D}\\\\x{203F}-\\\\x{2040}\\\\x{2070}-\\\\x{218F}\\\\x{2C00}-\\\\x{2FEF}\\\\x{3001}-\\\\x{D7FF}\\\\x{F900}-\\\\x{FDCF}\\\\x{FDF0}-\\\\x{FFFD}\\\\x{10000}-\\\\x{EFFFF}]*-[\\\\-.0-9_a-zA-Z\\\\x{00B7}\\\\x{00C0}-\\\\x{00D6}\\\\x{00D8}-\\\\x{00F6}\\\\x{00F8}-\\\\x{037D}\\\\x{037F}-\\\\x{1FFF}\\\\x{200C}-\\\\x{200D}\\\\x{203F}-\\\\x{2040}\\\\x{2070}-\\\\x{218F}\\\\x{2C00}-\\\\x{2FEF}\\\\x{3001}-\\\\x{D7FF}\\\\x{F900}-\\\\x{FDCF}\\\\x{FDF0}-\\\\x{FFFD}\\\\x{10000}-\\\\x{EFFFF}]*)(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\"/?>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.custom.start.html\",\"patterns\":[{\"include\":\"#attribute\"}]},{\"begin\":\"(</)([a-zA-Z][.0-9_a-zA-Z\\\\x{00B7}\\\\x{00C0}-\\\\x{00D6}\\\\x{00D8}-\\\\x{00F6}\\\\x{00F8}-\\\\x{037D}\\\\x{037F}-\\\\x{1FFF}\\\\x{200C}-\\\\x{200D}\\\\x{203F}-\\\\x{2040}\\\\x{2070}-\\\\x{218F}\\\\x{2C00}-\\\\x{2FEF}\\\\x{3001}-\\\\x{D7FF}\\\\x{F900}-\\\\x{FDCF}\\\\x{FDF0}-\\\\x{FFFD}\\\\x{10000}-\\\\x{EFFFF}]*-[\\\\-.0-9_a-zA-Z\\\\x{00B7}\\\\x{00C0}-\\\\x{00D6}\\\\x{00D8}-\\\\x{00F6}\\\\x{00F8}-\\\\x{037D}\\\\x{037F}-\\\\x{1FFF}\\\\x{200C}-\\\\x{200D}\\\\x{203F}-\\\\x{2040}\\\\x{2070}-\\\\x{218F}\\\\x{2C00}-\\\\x{2FEF}\\\\x{3001}-\\\\x{D7FF}\\\\x{F900}-\\\\x{FDCF}\\\\x{FDF0}-\\\\x{FFFD}\\\\x{10000}-\\\\x{EFFFF}]*)(?=\\\\s|/?>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.custom.end.html\",\"patterns\":[{\"include\":\"#attribute\"}]}]},\"xml-processing\":{\"begin\":\"(<\\\\?)(xml)\",\"captures\":{\"1\":{\"name\":\"punctuation.definition.tag.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\"(\\\\?>)\",\"name\":\"meta.tag.metadata.processing.xml.html\",\"patterns\":[{\"include\":\"#attribute\"}]}},\"scopeName\":\"text.html.basic\",\"embeddedLangs\":[\"javascript\",\"css\"]}"));

const html = [
  ...javascript,
  ...css,
  lang$8
];

const lang$7 = Object.freeze(JSON.parse("{\"displayName\":\"TypeScript\",\"name\":\"typescript\",\"patterns\":[{\"include\":\"#directives\"},{\"include\":\"#statements\"},{\"include\":\"#shebang\"}],\"repository\":{\"access-modifier\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(abstract|declare|override|public|protected|private|readonly|static)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"storage.modifier.ts\"},\"after-operator-block-as-object-literal\":{\"begin\":\"(?<!\\\\+\\\\+|--)(?<=[:=(,\\\\[?+!>]|^await|[^\\\\._$0-9A-Za-z]await|^return|[^\\\\._$0-9A-Za-z]return|^yield|[^\\\\._$0-9A-Za-z]yield|^throw|[^\\\\._$0-9A-Za-z]throw|^in|[^\\\\._$0-9A-Za-z]in|^of|[^\\\\._$0-9A-Za-z]of|^typeof|[^\\\\._$0-9A-Za-z]typeof|&&|\\\\|\\\\||\\\\*)\\\\s*(\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.block.ts\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"name\":\"meta.objectliteral.ts\",\"patterns\":[{\"include\":\"#object-member\"}]},\"array-binding-pattern\":{\"begin\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\[)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.ts\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.array.ts\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.array.ts\"}},\"patterns\":[{\"include\":\"#binding-element\"},{\"include\":\"#punctuation-comma\"}]},\"array-binding-pattern-const\":{\"begin\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\[)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.ts\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.array.ts\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.array.ts\"}},\"patterns\":[{\"include\":\"#binding-element-const\"},{\"include\":\"#punctuation-comma\"}]},\"array-literal\":{\"begin\":\"\\\\s*(\\\\[)\",\"beginCaptures\":{\"1\":{\"name\":\"meta.brace.square.ts\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.square.ts\"}},\"name\":\"meta.array.literal.ts\",\"patterns\":[{\"include\":\"#expression\"},{\"include\":\"#punctuation-comma\"}]},\"arrow-function\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"storage.modifier.async.ts\"},\"2\":{\"name\":\"variable.parameter.ts\"}},\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(\\\\basync)\\\\s+)?([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?==>)\",\"name\":\"meta.arrow.ts\"},{\"begin\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(\\\\basync))?((?<![})!\\\\]])\\\\s*(?=((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>)))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.ts\"}},\"end\":\"(?==>|\\\\{|(^\\\\s*(export|function|class|interface|let|var|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|const|import|enum|namespace|module|type|abstract|declare)\\\\s+))\",\"name\":\"meta.arrow.ts\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#type-parameters\"},{\"include\":\"#function-parameters\"},{\"include\":\"#arrow-return-type\"},{\"include\":\"#possibly-arrow-return-type\"}]},{\"begin\":\"=>\",\"beginCaptures\":{\"0\":{\"name\":\"storage.type.function.arrow.ts\"}},\"end\":\"((?<=\\\\}|\\\\S)(?<!=>)|((?!\\\\{)(?=\\\\S)))(?!\\\\/[\\\\/\\\\*])\",\"name\":\"meta.arrow.ts\",\"patterns\":[{\"include\":\"#single-line-comment-consuming-line-ending\"},{\"include\":\"#decl-block\"},{\"include\":\"#expression\"}]}]},\"arrow-return-type\":{\"begin\":\"(?<=\\\\))\\\\s*(:)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.type.annotation.ts\"}},\"end\":\"(?==>|\\\\{|(^\\\\s*(export|function|class|interface|let|var|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|const|import|enum|namespace|module|type|abstract|declare)\\\\s+))\",\"name\":\"meta.return.type.arrow.ts\",\"patterns\":[{\"include\":\"#arrow-return-type-body\"}]},\"arrow-return-type-body\":{\"patterns\":[{\"begin\":\"(?<=[:])(?=\\\\s*\\\\{)\",\"end\":\"(?<=\\\\})\",\"patterns\":[{\"include\":\"#type-object\"}]},{\"include\":\"#type-predicate-operator\"},{\"include\":\"#type\"}]},\"async-modifier\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(async)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"storage.modifier.async.ts\"},\"binding-element\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"include\":\"#numeric-literal\"},{\"include\":\"#regex\"},{\"include\":\"#object-binding-pattern\"},{\"include\":\"#array-binding-pattern\"},{\"include\":\"#destructuring-variable-rest\"},{\"include\":\"#variable-initializer\"}]},\"binding-element-const\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"include\":\"#numeric-literal\"},{\"include\":\"#regex\"},{\"include\":\"#object-binding-pattern-const\"},{\"include\":\"#array-binding-pattern-const\"},{\"include\":\"#destructuring-variable-rest-const\"},{\"include\":\"#variable-initializer\"}]},\"boolean-literal\":{\"patterns\":[{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))true(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"constant.language.boolean.true.ts\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))false(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"constant.language.boolean.false.ts\"}]},\"brackets\":{\"patterns\":[{\"begin\":\"{\",\"end\":\"}|(?=\\\\*/)\",\"patterns\":[{\"include\":\"#brackets\"}]},{\"begin\":\"\\\\[\",\"end\":\"\\\\]|(?=\\\\*/)\",\"patterns\":[{\"include\":\"#brackets\"}]}]},\"cast\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"meta.brace.angle.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"meta.brace.angle.ts\"}},\"match\":\"\\\\s*(<)\\\\s*(const)\\\\s*(>)\",\"name\":\"cast.expr.ts\"},{\"begin\":\"(?:(?<!\\\\+\\\\+|--)(?<=^return|[^\\\\._$0-9A-Za-z]return|^throw|[^\\\\._$0-9A-Za-z]throw|^yield|[^\\\\._$0-9A-Za-z]yield|^await|[^\\\\._$0-9A-Za-z]await|^default|[^\\\\._$0-9A-Za-z]default|[=(,:>*?\\\\&\\\\|\\\\^]|[^_$0-9A-Za-z](?:\\\\+\\\\+|--)|[^+]\\\\+|[^\\\\-]-))\\\\s*(<)(?!<?=)(?!\\\\s*$)\",\"beginCaptures\":{\"1\":{\"name\":\"meta.brace.angle.ts\"}},\"end\":\"(>)\",\"endCaptures\":{\"1\":{\"name\":\"meta.brace.angle.ts\"}},\"name\":\"cast.expr.ts\",\"patterns\":[{\"include\":\"#type\"}]},{\"begin\":\"(?:(?<=^))\\\\s*(<)(?=[_$A-Za-z][_$0-9A-Za-z]*\\\\s*>)\",\"beginCaptures\":{\"1\":{\"name\":\"meta.brace.angle.ts\"}},\"end\":\"(>)\",\"endCaptures\":{\"1\":{\"name\":\"meta.brace.angle.ts\"}},\"name\":\"cast.expr.ts\",\"patterns\":[{\"include\":\"#type\"}]}]},\"class-declaration\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(?:(abstract)\\\\s+)?\\\\b(class)\\\\b(?=\\\\s+|/[/*])\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"storage.modifier.ts\"},\"4\":{\"name\":\"storage.type.class.ts\"}},\"end\":\"(?<=\\\\})\",\"name\":\"meta.class.ts\",\"patterns\":[{\"include\":\"#class-declaration-or-expression-patterns\"}]},\"class-declaration-or-expression-patterns\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#class-or-interface-heritage\"},{\"captures\":{\"0\":{\"name\":\"entity.name.type.class.ts\"}},\"match\":\"[_$A-Za-z][_$0-9A-Za-z]*\"},{\"include\":\"#type-parameters\"},{\"include\":\"#class-or-interface-body\"}]},\"class-expression\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(abstract)\\\\s+)?(class)\\\\b(?=\\\\s+|[<{]|\\\\/[\\\\/*])\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.ts\"},\"2\":{\"name\":\"storage.type.class.ts\"}},\"end\":\"(?<=\\\\})\",\"name\":\"meta.class.ts\",\"patterns\":[{\"include\":\"#class-declaration-or-expression-patterns\"}]},\"class-or-interface-body\":{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#decorator\"},{\"begin\":\"(?<=:)\\\\s*\",\"end\":\"(?=\\\\s|[;),}\\\\]:\\\\-+]|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"patterns\":[{\"include\":\"#expression\"}]},{\"include\":\"#method-declaration\"},{\"include\":\"#indexer-declaration\"},{\"include\":\"#field-declaration\"},{\"include\":\"#string\"},{\"include\":\"#type-annotation\"},{\"include\":\"#variable-initializer\"},{\"include\":\"#access-modifier\"},{\"include\":\"#property-accessor\"},{\"include\":\"#async-modifier\"},{\"include\":\"#after-operator-block-as-object-literal\"},{\"include\":\"#decl-block\"},{\"include\":\"#expression\"},{\"include\":\"#punctuation-comma\"},{\"include\":\"#punctuation-semicolon\"}]},\"class-or-interface-heritage\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:\\\\b(extends|implements)\\\\b)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.ts\"}},\"end\":\"(?=\\\\{)\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#class-or-interface-heritage\"},{\"include\":\"#type-parameters\"},{\"include\":\"#expressionWithoutIdentifiers\"},{\"captures\":{\"1\":{\"name\":\"entity.name.type.module.ts\"},\"2\":{\"name\":\"punctuation.accessor.ts\"},\"3\":{\"name\":\"punctuation.accessor.optional.ts\"}},\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))(?=\\\\s*[_$A-Za-z][_$0-9A-Za-z]*(\\\\s*\\\\??\\\\.\\\\s*[_$A-Za-z][_$0-9A-Za-z]*)*\\\\s*)\"},{\"captures\":{\"1\":{\"name\":\"entity.other.inherited-class.ts\"}},\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\"},{\"include\":\"#expressionPunctuations\"}]},\"comment\":{\"patterns\":[{\"begin\":\"/\\\\*\\\\*(?!/)\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.ts\"}},\"end\":\"\\\\*/\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.ts\"}},\"name\":\"comment.block.documentation.ts\",\"patterns\":[{\"include\":\"#docblock\"}]},{\"begin\":\"(/\\\\*)(?:\\\\s*((@)internal)(?=\\\\s|(\\\\*/)))?\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.comment.ts\"},\"2\":{\"name\":\"storage.type.internaldeclaration.ts\"},\"3\":{\"name\":\"punctuation.decorator.internaldeclaration.ts\"}},\"end\":\"\\\\*/\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.comment.ts\"}},\"name\":\"comment.block.ts\"},{\"begin\":\"(^[ \\\\t]+)?((//)(?:\\\\s*((@)internal)(?=\\\\s|$))?)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.whitespace.comment.leading.ts\"},\"2\":{\"name\":\"comment.line.double-slash.ts\"},\"3\":{\"name\":\"punctuation.definition.comment.ts\"},\"4\":{\"name\":\"storage.type.internaldeclaration.ts\"},\"5\":{\"name\":\"punctuation.decorator.internaldeclaration.ts\"}},\"contentName\":\"comment.line.double-slash.ts\",\"end\":\"(?=$)\"}]},\"control-statement\":{\"patterns\":[{\"include\":\"#switch-statement\"},{\"include\":\"#for-loop\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(catch|finally|throw|try)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.control.trycatch.ts\"},{\"captures\":{\"1\":{\"name\":\"keyword.control.loop.ts\"},\"2\":{\"name\":\"entity.name.label.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(break|continue|goto)\\\\s+([_$A-Za-z][_$0-9A-Za-z]*)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(break|continue|do|goto|while)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.control.loop.ts\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(return)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.control.flow.ts\"}},\"end\":\"(?=[;}]|$|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"patterns\":[{\"include\":\"#expression\"}]},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(case|default|switch)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.control.switch.ts\"},{\"include\":\"#if-statement\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(else|if)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.control.conditional.ts\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(with)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.control.with.ts\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(package)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.control.ts\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(debugger)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.other.debugger.ts\"}]},\"decl-block\":{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"name\":\"meta.block.ts\",\"patterns\":[{\"include\":\"#statements\"}]},\"declaration\":{\"patterns\":[{\"include\":\"#decorator\"},{\"include\":\"#var-expr\"},{\"include\":\"#function-declaration\"},{\"include\":\"#class-declaration\"},{\"include\":\"#interface-declaration\"},{\"include\":\"#enum-declaration\"},{\"include\":\"#namespace-declaration\"},{\"include\":\"#type-alias-declaration\"},{\"include\":\"#import-equals-declaration\"},{\"include\":\"#import-declaration\"},{\"include\":\"#export-declaration\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(declare|export)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"storage.modifier.ts\"}]},\"decorator\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))\\\\@\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.decorator.ts\"}},\"end\":\"(?=\\\\s)\",\"name\":\"meta.decorator.ts\",\"patterns\":[{\"include\":\"#expression\"}]},\"destructuring-const\":{\"patterns\":[{\"begin\":\"(?<!=|:|^of|[^\\\\._$0-9A-Za-z]of|^in|[^\\\\._$0-9A-Za-z]in)\\\\s*(?=\\\\{)\",\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+))\",\"name\":\"meta.object-binding-pattern-variable.ts\",\"patterns\":[{\"include\":\"#object-binding-pattern-const\"},{\"include\":\"#type-annotation\"},{\"include\":\"#comment\"}]},{\"begin\":\"(?<!=|:|^of|[^\\\\._$0-9A-Za-z]of|^in|[^\\\\._$0-9A-Za-z]in)\\\\s*(?=\\\\[)\",\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+))\",\"name\":\"meta.array-binding-pattern-variable.ts\",\"patterns\":[{\"include\":\"#array-binding-pattern-const\"},{\"include\":\"#type-annotation\"},{\"include\":\"#comment\"}]}]},\"destructuring-parameter\":{\"patterns\":[{\"begin\":\"(?<!=|:)\\\\s*(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.ts\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.object.ts\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.object.ts\"}},\"name\":\"meta.parameter.object-binding-pattern.ts\",\"patterns\":[{\"include\":\"#parameter-object-binding-element\"}]},{\"begin\":\"(?<!=|:)\\\\s*(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\[)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.ts\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.array.ts\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.array.ts\"}},\"name\":\"meta.paramter.array-binding-pattern.ts\",\"patterns\":[{\"include\":\"#parameter-binding-element\"},{\"include\":\"#punctuation-comma\"}]}]},\"destructuring-parameter-rest\":{\"captures\":{\"1\":{\"name\":\"keyword.operator.rest.ts\"},\"2\":{\"name\":\"variable.parameter.ts\"}},\"match\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?([_$A-Za-z][_$0-9A-Za-z]*)\"},\"destructuring-variable\":{\"patterns\":[{\"begin\":\"(?<!=|:|^of|[^\\\\._$0-9A-Za-z]of|^in|[^\\\\._$0-9A-Za-z]in)\\\\s*(?=\\\\{)\",\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+))\",\"name\":\"meta.object-binding-pattern-variable.ts\",\"patterns\":[{\"include\":\"#object-binding-pattern\"},{\"include\":\"#type-annotation\"},{\"include\":\"#comment\"}]},{\"begin\":\"(?<!=|:|^of|[^\\\\._$0-9A-Za-z]of|^in|[^\\\\._$0-9A-Za-z]in)\\\\s*(?=\\\\[)\",\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+))\",\"name\":\"meta.array-binding-pattern-variable.ts\",\"patterns\":[{\"include\":\"#array-binding-pattern\"},{\"include\":\"#type-annotation\"},{\"include\":\"#comment\"}]}]},\"destructuring-variable-rest\":{\"captures\":{\"1\":{\"name\":\"keyword.operator.rest.ts\"},\"2\":{\"name\":\"meta.definition.variable.ts variable.other.readwrite.ts\"}},\"match\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?([_$A-Za-z][_$0-9A-Za-z]*)\"},\"destructuring-variable-rest-const\":{\"captures\":{\"1\":{\"name\":\"keyword.operator.rest.ts\"},\"2\":{\"name\":\"meta.definition.variable.ts variable.other.constant.ts\"}},\"match\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?([_$A-Za-z][_$0-9A-Za-z]*)\"},\"directives\":{\"begin\":\"^(///)\\\\s*(?=<(reference|amd-dependency|amd-module)(\\\\s+(path|types|no-default-lib|lib|name|resolution-mode)\\\\s*=\\\\s*((\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)))+\\\\s*/>\\\\s*$)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.comment.ts\"}},\"end\":\"(?=$)\",\"name\":\"comment.line.triple-slash.directive.ts\",\"patterns\":[{\"begin\":\"(<)(reference|amd-dependency|amd-module)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.directive.ts\"},\"2\":{\"name\":\"entity.name.tag.directive.ts\"}},\"end\":\"/>\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.tag.directive.ts\"}},\"name\":\"meta.tag.ts\",\"patterns\":[{\"match\":\"path|types|no-default-lib|lib|name|resolution-mode\",\"name\":\"entity.other.attribute-name.directive.ts\"},{\"match\":\"=\",\"name\":\"keyword.operator.assignment.ts\"},{\"include\":\"#string\"}]}]},\"docblock\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"constant.language.access-type.jsdoc\"}},\"match\":\"((@)(?:access|api))\\\\s+(private|protected|public)\\\\b\"},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"entity.name.type.instance.jsdoc\"},\"4\":{\"name\":\"punctuation.definition.bracket.angle.begin.jsdoc\"},\"5\":{\"name\":\"constant.other.email.link.underline.jsdoc\"},\"6\":{\"name\":\"punctuation.definition.bracket.angle.end.jsdoc\"}},\"match\":\"((@)author)\\\\s+([^@\\\\s<>*/](?:[^@<>*/]|\\\\*[^/])*)(?:\\\\s*(<)([^>\\\\s]+)(>))?\"},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"entity.name.type.instance.jsdoc\"},\"4\":{\"name\":\"keyword.operator.control.jsdoc\"},\"5\":{\"name\":\"entity.name.type.instance.jsdoc\"}},\"match\":\"((@)borrows)\\\\s+((?:[^@\\\\s*/]|\\\\*[^/])+)\\\\s+(as)\\\\s+((?:[^@\\\\s*/]|\\\\*[^/])+)\"},{\"begin\":\"((@)example)\\\\s+\",\"beginCaptures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"}},\"end\":\"(?=@|\\\\*/)\",\"name\":\"meta.example.jsdoc\",\"patterns\":[{\"match\":\"^\\\\s\\\\*\\\\s+\"},{\"begin\":\"\\\\G(<)caption(>)\",\"beginCaptures\":{\"0\":{\"name\":\"entity.name.tag.inline.jsdoc\"},\"1\":{\"name\":\"punctuation.definition.bracket.angle.begin.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.bracket.angle.end.jsdoc\"}},\"contentName\":\"constant.other.description.jsdoc\",\"end\":\"(</)caption(>)|(?=\\\\*/)\",\"endCaptures\":{\"0\":{\"name\":\"entity.name.tag.inline.jsdoc\"},\"1\":{\"name\":\"punctuation.definition.bracket.angle.begin.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.bracket.angle.end.jsdoc\"}}},{\"captures\":{\"0\":{\"name\":\"source.embedded.ts\"}},\"match\":\"[^\\\\s@*](?:[^*]|\\\\*[^/])*\"}]},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"constant.language.symbol-type.jsdoc\"}},\"match\":\"((@)kind)\\\\s+(class|constant|event|external|file|function|member|mixin|module|namespace|typedef)\\\\b\"},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"variable.other.link.underline.jsdoc\"},\"4\":{\"name\":\"entity.name.type.instance.jsdoc\"}},\"match\":\"((@)see)\\\\s+(?:((?=https?://)(?:[^\\\\s*]|\\\\*[^/])+)|((?!https?://|(?:\\\\[[^\\\\[\\\\]]*\\\\])?{@(?:link|linkcode|linkplain|tutorial)\\\\b)(?:[^@\\\\s*/]|\\\\*[^/])+))\"},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"variable.other.jsdoc\"}},\"match\":\"((@)template)\\\\s+([A-Za-z_$][\\\\w$.\\\\[\\\\]]*(?:\\\\s*,\\\\s*[A-Za-z_$][\\\\w$.\\\\[\\\\]]*)*)\"},{\"begin\":\"((@)template)\\\\s+(?={)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"}},\"end\":\"(?=\\\\s|\\\\*/|[^{}\\\\[\\\\]A-Za-z_$])\",\"patterns\":[{\"include\":\"#jsdoctype\"},{\"match\":\"([A-Za-z_$][\\\\w$.\\\\[\\\\]]*)\",\"name\":\"variable.other.jsdoc\"}]},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"variable.other.jsdoc\"}},\"match\":\"((@)(?:arg|argument|const|constant|member|namespace|param|var))\\\\s+([A-Za-z_$][\\\\w$.\\\\[\\\\]]*)\"},{\"begin\":\"((@)typedef)\\\\s+(?={)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"}},\"end\":\"(?=\\\\s|\\\\*/|[^{}\\\\[\\\\]A-Za-z_$])\",\"patterns\":[{\"include\":\"#jsdoctype\"},{\"match\":\"(?:[^@\\\\s*/]|\\\\*[^/])+\",\"name\":\"entity.name.type.instance.jsdoc\"}]},{\"begin\":\"((@)(?:arg|argument|const|constant|member|namespace|param|prop|property|var))\\\\s+(?={)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"}},\"end\":\"(?=\\\\s|\\\\*/|[^{}\\\\[\\\\]A-Za-z_$])\",\"patterns\":[{\"include\":\"#jsdoctype\"},{\"match\":\"([A-Za-z_$][\\\\w$.\\\\[\\\\]]*)\",\"name\":\"variable.other.jsdoc\"},{\"captures\":{\"1\":{\"name\":\"punctuation.definition.optional-value.begin.bracket.square.jsdoc\"},\"2\":{\"name\":\"keyword.operator.assignment.jsdoc\"},\"3\":{\"name\":\"source.embedded.ts\"},\"4\":{\"name\":\"punctuation.definition.optional-value.end.bracket.square.jsdoc\"},\"5\":{\"name\":\"invalid.illegal.syntax.jsdoc\"}},\"match\":\"(\\\\[)\\\\s*[\\\\w$]+(?:(?:\\\\[\\\\])?\\\\.[\\\\w$]+)*(?:\\\\s*(=)\\\\s*((?>\\\"(?:(?:\\\\*(?!/))|(?:\\\\\\\\(?!\\\"))|[^*\\\\\\\\])*?\\\"|'(?:(?:\\\\*(?!/))|(?:\\\\\\\\(?!'))|[^*\\\\\\\\])*?'|\\\\[(?:(?:\\\\*(?!/))|[^*])*?\\\\]|(?:(?:\\\\*(?!/))|\\\\s(?!\\\\s*\\\\])|\\\\[.*?(?:\\\\]|(?=\\\\*/))|[^*\\\\s\\\\[\\\\]])*)*))?\\\\s*(?:(\\\\])((?:[^*\\\\s]|\\\\*[^\\\\s/])+)?|(?=\\\\*/))\",\"name\":\"variable.other.jsdoc\"}]},{\"begin\":\"((@)(?:define|enum|exception|export|extends|lends|implements|modifies|namespace|private|protected|returns?|satisfies|suppress|this|throws|type|yields?))\\\\s+(?={)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"}},\"end\":\"(?=\\\\s|\\\\*/|[^{}\\\\[\\\\]A-Za-z_$])\",\"patterns\":[{\"include\":\"#jsdoctype\"}]},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"entity.name.type.instance.jsdoc\"}},\"match\":\"((@)(?:alias|augments|callback|constructs|emits|event|fires|exports?|extends|external|function|func|host|lends|listens|interface|memberof!?|method|module|mixes|mixin|name|requires|see|this|typedef|uses))\\\\s+((?:[^{}@\\\\s*]|\\\\*[^/])+)\"},{\"begin\":\"((@)(?:default(?:value)?|license|version))\\\\s+(([''\\\"]))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"variable.other.jsdoc\"},\"4\":{\"name\":\"punctuation.definition.string.begin.jsdoc\"}},\"contentName\":\"variable.other.jsdoc\",\"end\":\"(\\\\3)|(?=$|\\\\*/)\",\"endCaptures\":{\"0\":{\"name\":\"variable.other.jsdoc\"},\"1\":{\"name\":\"punctuation.definition.string.end.jsdoc\"}}},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"},\"3\":{\"name\":\"variable.other.jsdoc\"}},\"match\":\"((@)(?:default(?:value)?|license|tutorial|variation|version))\\\\s+([^\\\\s*]+)\"},{\"captures\":{\"1\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"}},\"match\":\"(@)(?:abstract|access|alias|api|arg|argument|async|attribute|augments|author|beta|borrows|bubbles|callback|chainable|class|classdesc|code|config|const|constant|constructor|constructs|copyright|default|defaultvalue|define|deprecated|desc|description|dict|emits|enum|event|example|exception|exports?|extends|extension(?:_?for)?|external|externs|file|fileoverview|final|fires|for|func|function|generator|global|hideconstructor|host|ignore|implements|implicitCast|inherit[Dd]oc|inner|instance|interface|internal|kind|lends|license|listens|main|member|memberof!?|method|mixes|mixins?|modifies|module|name|namespace|noalias|nocollapse|nocompile|nosideeffects|override|overview|package|param|polymer(?:Behavior)?|preserve|private|prop|property|protected|public|read[Oo]nly|record|require[ds]|returns?|see|since|static|struct|submodule|summary|suppress|template|this|throws|todo|tutorial|type|typedef|unrestricted|uses|var|variation|version|virtual|writeOnce|yields?)\\\\b\",\"name\":\"storage.type.class.jsdoc\"},{\"include\":\"#inline-tags\"},{\"captures\":{\"1\":{\"name\":\"storage.type.class.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.block.tag.jsdoc\"}},\"match\":\"((@)(?:[_$A-Za-z][_$0-9A-Za-z]*))(?=\\\\s+)\"}]},\"enum-declaration\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?(?:\\\\b(const)\\\\s+)?\\\\b(enum)\\\\s+([_$A-Za-z][_$0-9A-Za-z]*)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"storage.modifier.ts\"},\"4\":{\"name\":\"storage.type.enum.ts\"},\"5\":{\"name\":\"entity.name.type.enum.ts\"}},\"end\":\"(?<=\\\\})\",\"name\":\"meta.enum.declaration.ts\",\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)\",\"beginCaptures\":{\"0\":{\"name\":\"variable.other.enummember.ts\"}},\"end\":\"(?=,|\\\\}|$)\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#variable-initializer\"}]},{\"begin\":\"(?=((\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\])))\",\"end\":\"(?=,|\\\\}|$)\",\"patterns\":[{\"include\":\"#string\"},{\"include\":\"#array-literal\"},{\"include\":\"#comment\"},{\"include\":\"#variable-initializer\"}]},{\"include\":\"#punctuation-comma\"}]}]},\"export-declaration\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"keyword.control.as.ts\"},\"3\":{\"name\":\"storage.type.namespace.ts\"},\"4\":{\"name\":\"entity.name.type.module.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(export)\\\\s+(as)\\\\s+(namespace)\\\\s+([_$A-Za-z][_$0-9A-Za-z]*)\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(export)(?:\\\\s+(type))?(?:(?:\\\\s*(=))|(?:\\\\s+(default)(?=\\\\s+)))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"keyword.control.type.ts\"},\"3\":{\"name\":\"keyword.operator.assignment.ts\"},\"4\":{\"name\":\"keyword.control.default.ts\"}},\"end\":\"(?=$|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"name\":\"meta.export.default.ts\",\"patterns\":[{\"include\":\"#interface-declaration\"},{\"include\":\"#expression\"}]},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(export)(?:\\\\s+(type))?\\\\b(?!(\\\\$)|(\\\\s*:))((?=\\\\s*[{*])|((?=\\\\s*[_$A-Za-z][_$0-9A-Za-z]*(\\\\s|,))(?!\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b)))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"keyword.control.type.ts\"}},\"end\":\"(?=$|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"name\":\"meta.export.ts\",\"patterns\":[{\"include\":\"#import-export-declaration\"}]}]},\"expression\":{\"patterns\":[{\"include\":\"#expressionWithoutIdentifiers\"},{\"include\":\"#identifiers\"},{\"include\":\"#expressionPunctuations\"}]},\"expression-inside-possibly-arrow-parens\":{\"patterns\":[{\"include\":\"#expressionWithoutIdentifiers\"},{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"include\":\"#decorator\"},{\"include\":\"#destructuring-parameter\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(override|public|protected|private|readonly)\\\\s+(?=(override|public|protected|private|readonly)\\\\s+)\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.ts\"},\"2\":{\"name\":\"keyword.operator.rest.ts\"},\"3\":{\"name\":\"entity.name.function.ts variable.language.this.ts\"},\"4\":{\"name\":\"entity.name.function.ts\"},\"5\":{\"name\":\"keyword.operator.optional.ts\"}},\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(override|public|private|protected|readonly)\\\\s+)?(?:(\\\\.\\\\.\\\\.)\\\\s*)?(?<!=|:)(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*(\\\\??)(?=\\\\s*(=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>)))))|(:\\\\s*((<)|([(]\\\\s*(([)])|(\\\\.\\\\.\\\\.)|([_$0-9A-Za-z]+\\\\s*(([:,?=])|([)]\\\\s*=>)))))))|(:\\\\s*(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))Function(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|(:\\\\s*((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))))|(:\\\\s*(=>|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(<[^<>]*>)|[^<>(),=])+=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>))))))\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.ts\"},\"2\":{\"name\":\"keyword.operator.rest.ts\"},\"3\":{\"name\":\"variable.parameter.ts variable.language.this.ts\"},\"4\":{\"name\":\"variable.parameter.ts\"},\"5\":{\"name\":\"keyword.operator.optional.ts\"}},\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(override|public|private|protected|readonly)\\\\s+)?(?:(\\\\.\\\\.\\\\.)\\\\s*)?(?<!=|:)(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*(\\\\??)(?=\\\\s*[:,]|$)\"},{\"include\":\"#type-annotation\"},{\"include\":\"#variable-initializer\"},{\"match\":\",\",\"name\":\"punctuation.separator.parameter.ts\"},{\"include\":\"#identifiers\"},{\"include\":\"#expressionPunctuations\"}]},\"expression-operators\":{\"patterns\":[{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(await)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.control.flow.ts\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(yield)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))(?=\\\\s*\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*\\\\*)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.flow.ts\"}},\"end\":\"\\\\*\",\"endCaptures\":{\"0\":{\"name\":\"keyword.generator.asterisk.ts\"}},\"patterns\":[{\"include\":\"#comment\"}]},{\"captures\":{\"1\":{\"name\":\"keyword.control.flow.ts\"},\"2\":{\"name\":\"keyword.generator.asterisk.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(yield)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))(?:\\\\s*(\\\\*))?\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))delete(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.operator.expression.delete.ts\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))in(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))(?!\\\\()\",\"name\":\"keyword.operator.expression.in.ts\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))of(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))(?!\\\\()\",\"name\":\"keyword.operator.expression.of.ts\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))instanceof(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.operator.expression.instanceof.ts\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))new(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.operator.new.ts\"},{\"include\":\"#typeof-operator\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))void(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.operator.expression.void.ts\"},{\"captures\":{\"1\":{\"name\":\"keyword.control.as.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(as)\\\\s+(const)(?=\\\\s*($|[;,:})\\\\]]))\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(as)|(satisfies))\\\\s+\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.as.ts\"},\"2\":{\"name\":\"keyword.control.satisfies.ts\"}},\"end\":\"(?=^|[;),}\\\\]:?\\\\-+>]|\\\\|\\\\||\\\\&\\\\&|!==|$|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(as|satisfies)\\\\s+)|(\\\\s+<))\",\"patterns\":[{\"include\":\"#type\"}]},{\"match\":\"\\\\.\\\\.\\\\.\",\"name\":\"keyword.operator.spread.ts\"},{\"match\":\"\\\\*=|(?<!\\\\()/=|%=|\\\\+=|-=\",\"name\":\"keyword.operator.assignment.compound.ts\"},{\"match\":\"\\\\&=|\\\\^=|<<=|>>=|>>>=|\\\\|=\",\"name\":\"keyword.operator.assignment.compound.bitwise.ts\"},{\"match\":\"<<|>>>|>>\",\"name\":\"keyword.operator.bitwise.shift.ts\"},{\"match\":\"===|!==|==|!=\",\"name\":\"keyword.operator.comparison.ts\"},{\"match\":\"<=|>=|<>|<|>\",\"name\":\"keyword.operator.relational.ts\"},{\"captures\":{\"1\":{\"name\":\"keyword.operator.logical.ts\"},\"2\":{\"name\":\"keyword.operator.assignment.compound.ts\"},\"3\":{\"name\":\"keyword.operator.arithmetic.ts\"}},\"match\":\"(?<=[_$0-9A-Za-z])(!)\\\\s*(?:(/=)|(?:(/)(?![/*])))\"},{\"match\":\"!|&&|\\\\|\\\\||\\\\?\\\\?\",\"name\":\"keyword.operator.logical.ts\"},{\"match\":\"\\\\&|~|\\\\^|\\\\|\",\"name\":\"keyword.operator.bitwise.ts\"},{\"match\":\"=\",\"name\":\"keyword.operator.assignment.ts\"},{\"match\":\"--\",\"name\":\"keyword.operator.decrement.ts\"},{\"match\":\"\\\\+\\\\+\",\"name\":\"keyword.operator.increment.ts\"},{\"match\":\"%|\\\\*|/|-|\\\\+\",\"name\":\"keyword.operator.arithmetic.ts\"},{\"begin\":\"(?<=[_$0-9A-Za-z)\\\\]])\\\\s*(?=(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)+(?:(/=)|(?:(/)(?![/*]))))\",\"end\":\"(?:(/=)|(?:(/)(?!\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/)))\",\"endCaptures\":{\"1\":{\"name\":\"keyword.operator.assignment.compound.ts\"},\"2\":{\"name\":\"keyword.operator.arithmetic.ts\"}},\"patterns\":[{\"include\":\"#comment\"}]},{\"captures\":{\"1\":{\"name\":\"keyword.operator.assignment.compound.ts\"},\"2\":{\"name\":\"keyword.operator.arithmetic.ts\"}},\"match\":\"(?<=[_$0-9A-Za-z)\\\\]])\\\\s*(?:(/=)|(?:(/)(?![/*])))\"}]},\"expressionPunctuations\":{\"patterns\":[{\"include\":\"#punctuation-comma\"},{\"include\":\"#punctuation-accessor\"}]},\"expressionWithoutIdentifiers\":{\"patterns\":[{\"include\":\"#string\"},{\"include\":\"#regex\"},{\"include\":\"#comment\"},{\"include\":\"#function-expression\"},{\"include\":\"#class-expression\"},{\"include\":\"#arrow-function\"},{\"include\":\"#paren-expression-possibly-arrow\"},{\"include\":\"#cast\"},{\"include\":\"#ternary-expression\"},{\"include\":\"#new-expr\"},{\"include\":\"#instanceof-expr\"},{\"include\":\"#object-literal\"},{\"include\":\"#expression-operators\"},{\"include\":\"#function-call\"},{\"include\":\"#literal\"},{\"include\":\"#support-objects\"},{\"include\":\"#paren-expression\"}]},\"field-declaration\":{\"begin\":\"(?<!\\\\()(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(readonly)\\\\s+)?(?=\\\\s*((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(?:(?:(\\\\?)|(!))\\\\s*)?(=|:|;|,|\\\\}|$))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.ts\"}},\"end\":\"(?=\\\\}|;|,|$|(^(?!\\\\s*((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(?:(?:(\\\\?)|(!))\\\\s*)?(=|:|;|,|$))))|(?<=\\\\})\",\"name\":\"meta.field.declaration.ts\",\"patterns\":[{\"include\":\"#variable-initializer\"},{\"include\":\"#type-annotation\"},{\"include\":\"#string\"},{\"include\":\"#array-literal\"},{\"include\":\"#numeric-literal\"},{\"include\":\"#comment\"},{\"captures\":{\"1\":{\"name\":\"meta.definition.property.ts entity.name.function.ts\"},\"2\":{\"name\":\"keyword.operator.optional.ts\"},\"3\":{\"name\":\"keyword.operator.definiteassignment.ts\"}},\"match\":\"(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*)(?:(\\\\?)|(!))?(?=\\\\s*\\\\s*(=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>)))))|(:\\\\s*((<)|([(]\\\\s*(([)])|(\\\\.\\\\.\\\\.)|([_$0-9A-Za-z]+\\\\s*(([:,?=])|([)]\\\\s*=>)))))))|(:\\\\s*(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))Function(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|(:\\\\s*((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))))|(:\\\\s*(=>|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(<[^<>]*>)|[^<>(),=])+=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>))))))\"},{\"match\":\"\\\\#?[_$A-Za-z][_$0-9A-Za-z]*\",\"name\":\"meta.definition.property.ts variable.object.property.ts\"},{\"match\":\"\\\\?\",\"name\":\"keyword.operator.optional.ts\"},{\"match\":\"!\",\"name\":\"keyword.operator.definiteassignment.ts\"}]},\"for-loop\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))for(?=((\\\\s+|(\\\\s*\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*))await)?\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)?(\\\\())\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.control.loop.ts\"}},\"end\":\"(?<=\\\\))\",\"patterns\":[{\"include\":\"#comment\"},{\"match\":\"await\",\"name\":\"keyword.control.loop.ts\"},{\"begin\":\"\\\\(\",\"beginCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"patterns\":[{\"include\":\"#var-expr\"},{\"include\":\"#expression\"},{\"include\":\"#punctuation-semicolon\"}]}]},\"function-body\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#type-parameters\"},{\"include\":\"#function-parameters\"},{\"include\":\"#return-type\"},{\"include\":\"#type-function-return-type\"},{\"include\":\"#decl-block\"},{\"match\":\"\\\\*\",\"name\":\"keyword.generator.asterisk.ts\"}]},\"function-call\":{\"patterns\":[{\"begin\":\"(?=(((([_$A-Za-z][_$0-9A-Za-z]*)(\\\\s*\\\\??\\\\.\\\\s*(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))*)|(\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))|(?<=[)]))\\\\s*(?:(\\\\?\\\\.\\\\s*)|(!))?((<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))(([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>)*(?<!=)>))*(?<!=)>)*(?<!=)>\\\\s*)?\\\\())\",\"end\":\"(?<=\\\\))(?!(((([_$A-Za-z][_$0-9A-Za-z]*)(\\\\s*\\\\??\\\\.\\\\s*(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))*)|(\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))|(?<=[)]))\\\\s*(?:(\\\\?\\\\.\\\\s*)|(!))?((<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))(([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>)*(?<!=)>))*(?<!=)>)*(?<!=)>\\\\s*)?\\\\())\",\"patterns\":[{\"begin\":\"(?=(([_$A-Za-z][_$0-9A-Za-z]*)(\\\\s*\\\\??\\\\.\\\\s*(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))*)|(\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))\",\"end\":\"(?=\\\\s*(?:(\\\\?\\\\.\\\\s*)|(!))?((<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))(([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>)*(?<!=)>))*(?<!=)>)*(?<!=)>\\\\s*)?\\\\())\",\"name\":\"meta.function-call.ts\",\"patterns\":[{\"include\":\"#function-call-target\"}]},{\"include\":\"#comment\"},{\"include\":\"#function-call-optionals\"},{\"include\":\"#type-arguments\"},{\"include\":\"#paren-expression\"}]},{\"begin\":\"(?=(((([_$A-Za-z][_$0-9A-Za-z]*)(\\\\s*\\\\??\\\\.\\\\s*(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))*)|(\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))|(?<=[)]))(<\\\\s*[{\\\\[(]\\\\s*$))\",\"end\":\"(?<=>)(?!(((([_$A-Za-z][_$0-9A-Za-z]*)(\\\\s*\\\\??\\\\.\\\\s*(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))*)|(\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))|(?<=[)]))(<\\\\s*[{\\\\[(]\\\\s*$))\",\"patterns\":[{\"begin\":\"(?=(([_$A-Za-z][_$0-9A-Za-z]*)(\\\\s*\\\\??\\\\.\\\\s*(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))*)|(\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))\",\"end\":\"(?=(<\\\\s*[{\\\\[(]\\\\s*$))\",\"name\":\"meta.function-call.ts\",\"patterns\":[{\"include\":\"#function-call-target\"}]},{\"include\":\"#comment\"},{\"include\":\"#function-call-optionals\"},{\"include\":\"#type-arguments\"}]}]},\"function-call-optionals\":{\"patterns\":[{\"match\":\"\\\\?\\\\.\",\"name\":\"meta.function-call.ts punctuation.accessor.optional.ts\"},{\"match\":\"!\",\"name\":\"meta.function-call.ts keyword.operator.definiteassignment.ts\"}]},\"function-call-target\":{\"patterns\":[{\"include\":\"#support-function-call-identifiers\"},{\"match\":\"(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*)\",\"name\":\"entity.name.function.ts\"}]},\"function-declaration\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?(?:(async)\\\\s+)?(function\\\\b)(?:\\\\s*(\\\\*))?(?:(?:\\\\s+|(?<=\\\\*))([_$A-Za-z][_$0-9A-Za-z]*))?\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"storage.modifier.async.ts\"},\"4\":{\"name\":\"storage.type.function.ts\"},\"5\":{\"name\":\"keyword.generator.asterisk.ts\"},\"6\":{\"name\":\"meta.definition.function.ts entity.name.function.ts\"}},\"end\":\"(?=;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))|(?<=\\\\})\",\"name\":\"meta.function.ts\",\"patterns\":[{\"include\":\"#function-name\"},{\"include\":\"#function-body\"}]},\"function-expression\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(async)\\\\s+)?(function\\\\b)(?:\\\\s*(\\\\*))?(?:(?:\\\\s+|(?<=\\\\*))([_$A-Za-z][_$0-9A-Za-z]*))?\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.ts\"},\"2\":{\"name\":\"storage.type.function.ts\"},\"3\":{\"name\":\"keyword.generator.asterisk.ts\"},\"4\":{\"name\":\"meta.definition.function.ts entity.name.function.ts\"}},\"end\":\"(?=;)|(?<=\\\\})\",\"name\":\"meta.function.expression.ts\",\"patterns\":[{\"include\":\"#function-name\"},{\"include\":\"#single-line-comment-consuming-line-ending\"},{\"include\":\"#function-body\"}]},\"function-name\":{\"match\":\"[_$A-Za-z][_$0-9A-Za-z]*\",\"name\":\"meta.definition.function.ts entity.name.function.ts\"},\"function-parameters\":{\"begin\":\"\\\\(\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.parameters.begin.ts\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.parameters.end.ts\"}},\"name\":\"meta.parameters.ts\",\"patterns\":[{\"include\":\"#function-parameters-body\"}]},\"function-parameters-body\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"include\":\"#decorator\"},{\"include\":\"#destructuring-parameter\"},{\"include\":\"#parameter-name\"},{\"include\":\"#parameter-type-annotation\"},{\"include\":\"#variable-initializer\"},{\"match\":\",\",\"name\":\"punctuation.separator.parameter.ts\"}]},\"identifiers\":{\"patterns\":[{\"include\":\"#object-identifiers\"},{\"captures\":{\"1\":{\"name\":\"punctuation.accessor.ts\"},\"2\":{\"name\":\"punctuation.accessor.optional.ts\"},\"3\":{\"name\":\"entity.name.function.ts\"}},\"match\":\"(?:(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*)?([_$A-Za-z][_$0-9A-Za-z]*)(?=\\\\s*=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>)))))\"},{\"captures\":{\"1\":{\"name\":\"punctuation.accessor.ts\"},\"2\":{\"name\":\"punctuation.accessor.optional.ts\"},\"3\":{\"name\":\"variable.other.constant.property.ts\"}},\"match\":\"(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*(\\\\#?[A-Z][_$\\\\dA-Z]*)(?![_$0-9A-Za-z])\"},{\"captures\":{\"1\":{\"name\":\"punctuation.accessor.ts\"},\"2\":{\"name\":\"punctuation.accessor.optional.ts\"},\"3\":{\"name\":\"variable.other.property.ts\"}},\"match\":\"(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*)\"},{\"match\":\"([A-Z][_$\\\\dA-Z]*)(?![_$0-9A-Za-z])\",\"name\":\"variable.other.constant.ts\"},{\"match\":\"[_$A-Za-z][_$0-9A-Za-z]*\",\"name\":\"variable.other.readwrite.ts\"}]},\"if-statement\":{\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?=\\\\bif\\\\s*(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))\\\\s*(?!\\\\{))\",\"end\":\"(?=;|$|\\\\})\",\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(if)\\\\s*(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.conditional.ts\"},\"2\":{\"name\":\"meta.brace.round.ts\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"patterns\":[{\"include\":\"#expression\"}]},{\"begin\":\"(?<=\\\\))\\\\s*\\\\/(?![\\\\/*])(?=(?:[^\\\\/\\\\\\\\\\\\[]|\\\\\\\\.|\\\\[([^\\\\]\\\\\\\\]|\\\\\\\\.)*\\\\])+\\\\/([dgimsuy]+|(?![\\\\/\\\\*])|(?=\\\\/\\\\*))(?!\\\\s*[a-zA-Z0-9_$]))\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.ts\"}},\"end\":\"(/)([dgimsuy]*)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.end.ts\"},\"2\":{\"name\":\"keyword.other.ts\"}},\"name\":\"string.regexp.ts\",\"patterns\":[{\"include\":\"#regexp\"}]},{\"include\":\"#statements\"}]}]},\"import-declaration\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(import)(?:\\\\s+(type)(?!\\\\s+from))?(?!\\\\s*[:(])(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"keyword.control.import.ts\"},\"4\":{\"name\":\"keyword.control.type.ts\"}},\"end\":\"(?<!^import|[^\\\\._$0-9A-Za-z]import)(?=;|$|^)\",\"name\":\"meta.import.ts\",\"patterns\":[{\"include\":\"#single-line-comment-consuming-line-ending\"},{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"begin\":\"(?<=^import|[^\\\\._$0-9A-Za-z]import)(?!\\\\s*[\\\"'])\",\"end\":\"\\\\bfrom\\\\b\",\"endCaptures\":{\"0\":{\"name\":\"keyword.control.from.ts\"}},\"patterns\":[{\"include\":\"#import-export-declaration\"}]},{\"include\":\"#import-export-declaration\"}]},\"import-equals-declaration\":{\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(import)(?:\\\\s+(type))?\\\\s+([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(=)\\\\s*(require)\\\\s*(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"keyword.control.import.ts\"},\"4\":{\"name\":\"keyword.control.type.ts\"},\"5\":{\"name\":\"variable.other.readwrite.alias.ts\"},\"6\":{\"name\":\"keyword.operator.assignment.ts\"},\"7\":{\"name\":\"keyword.control.require.ts\"},\"8\":{\"name\":\"meta.brace.round.ts\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"name\":\"meta.import-equals.external.ts\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"}]},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(import)(?:\\\\s+(type))?\\\\s+([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(=)\\\\s*(?!require\\\\b)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"keyword.control.import.ts\"},\"4\":{\"name\":\"keyword.control.type.ts\"},\"5\":{\"name\":\"variable.other.readwrite.alias.ts\"},\"6\":{\"name\":\"keyword.operator.assignment.ts\"}},\"end\":\"(?=;|$|^)\",\"name\":\"meta.import-equals.internal.ts\",\"patterns\":[{\"include\":\"#single-line-comment-consuming-line-ending\"},{\"include\":\"#comment\"},{\"captures\":{\"1\":{\"name\":\"entity.name.type.module.ts\"},\"2\":{\"name\":\"punctuation.accessor.ts\"},\"3\":{\"name\":\"punctuation.accessor.optional.ts\"}},\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\"},{\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\",\"name\":\"variable.other.readwrite.ts\"}]}]},\"import-export-assert-clause\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(with)|(assert))\\\\s*(\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.with.ts\"},\"2\":{\"name\":\"keyword.control.assert.ts\"},\"3\":{\"name\":\"punctuation.definition.block.ts\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"match\":\"(?:[_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?=(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*:)\",\"name\":\"meta.object-literal.key.ts\"},{\"match\":\":\",\"name\":\"punctuation.separator.key-value.ts\"}]},\"import-export-block\":{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"name\":\"meta.block.ts\",\"patterns\":[{\"include\":\"#import-export-clause\"}]},\"import-export-clause\":{\"patterns\":[{\"include\":\"#comment\"},{\"captures\":{\"1\":{\"name\":\"keyword.control.type.ts\"},\"2\":{\"name\":\"keyword.control.default.ts\"},\"3\":{\"name\":\"constant.language.import-export-all.ts\"},\"4\":{\"name\":\"variable.other.readwrite.ts\"},\"5\":{\"name\":\"keyword.control.as.ts\"},\"6\":{\"name\":\"keyword.control.default.ts\"},\"7\":{\"name\":\"variable.other.readwrite.alias.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(?:(\\\\btype)\\\\s+)?(?:(\\\\bdefault)|(\\\\*)|(\\\\b[_$A-Za-z][_$0-9A-Za-z]*)))\\\\s+(as)\\\\s+(?:(default(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|([_$A-Za-z][_$0-9A-Za-z]*))\"},{\"include\":\"#punctuation-comma\"},{\"match\":\"\\\\*\",\"name\":\"constant.language.import-export-all.ts\"},{\"match\":\"\\\\b(default)\\\\b\",\"name\":\"keyword.control.default.ts\"},{\"captures\":{\"1\":{\"name\":\"keyword.control.type.ts\"},\"2\":{\"name\":\"variable.other.readwrite.alias.ts\"}},\"match\":\"(?:(\\\\btype)\\\\s+)?([_$A-Za-z][_$0-9A-Za-z]*)\"}]},\"import-export-declaration\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"include\":\"#import-export-block\"},{\"match\":\"\\\\bfrom\\\\b\",\"name\":\"keyword.control.from.ts\"},{\"include\":\"#import-export-assert-clause\"},{\"include\":\"#import-export-clause\"}]},\"indexer-declaration\":{\"begin\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(readonly)\\\\s*)?\\\\s*(\\\\[)\\\\s*([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?=:)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.ts\"},\"2\":{\"name\":\"meta.brace.square.ts\"},\"3\":{\"name\":\"variable.parameter.ts\"}},\"end\":\"(\\\\])\\\\s*(\\\\?\\\\s*)?|$\",\"endCaptures\":{\"1\":{\"name\":\"meta.brace.square.ts\"},\"2\":{\"name\":\"keyword.operator.optional.ts\"}},\"name\":\"meta.indexer.declaration.ts\",\"patterns\":[{\"include\":\"#type-annotation\"}]},\"indexer-mapped-type-declaration\":{\"begin\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))([+-])?(readonly)\\\\s*)?\\\\s*(\\\\[)\\\\s*([_$A-Za-z][_$0-9A-Za-z]*)\\\\s+(in)\\\\s+\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.type.modifier.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"meta.brace.square.ts\"},\"4\":{\"name\":\"entity.name.type.ts\"},\"5\":{\"name\":\"keyword.operator.expression.in.ts\"}},\"end\":\"(\\\\])([+-])?\\\\s*(\\\\?\\\\s*)?|$\",\"endCaptures\":{\"1\":{\"name\":\"meta.brace.square.ts\"},\"2\":{\"name\":\"keyword.operator.type.modifier.ts\"},\"3\":{\"name\":\"keyword.operator.optional.ts\"}},\"name\":\"meta.indexer.mappedtype.declaration.ts\",\"patterns\":[{\"captures\":{\"1\":{\"name\":\"keyword.control.as.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(as)\\\\s+\"},{\"include\":\"#type\"}]},\"inline-tags\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"punctuation.definition.bracket.square.begin.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.bracket.square.end.jsdoc\"}},\"match\":\"(\\\\[)[^\\\\]]+(\\\\])(?={@(?:link|linkcode|linkplain|tutorial))\",\"name\":\"constant.other.description.jsdoc\"},{\"begin\":\"({)((@)(?:link(?:code|plain)?|tutorial))\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.bracket.curly.begin.jsdoc\"},\"2\":{\"name\":\"storage.type.class.jsdoc\"},\"3\":{\"name\":\"punctuation.definition.inline.tag.jsdoc\"}},\"end\":\"}|(?=\\\\*/)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.bracket.curly.end.jsdoc\"}},\"name\":\"entity.name.type.instance.jsdoc\",\"patterns\":[{\"captures\":{\"1\":{\"name\":\"variable.other.link.underline.jsdoc\"},\"2\":{\"name\":\"punctuation.separator.pipe.jsdoc\"}},\"match\":\"\\\\G((?=https?://)(?:[^|}\\\\s*]|\\\\*[/])+)(\\\\|)?\"},{\"captures\":{\"1\":{\"name\":\"variable.other.description.jsdoc\"},\"2\":{\"name\":\"punctuation.separator.pipe.jsdoc\"}},\"match\":\"\\\\G((?:[^{}@\\\\s|*]|\\\\*[^/])+)(\\\\|)?\"}]}]},\"instanceof-expr\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(instanceof)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.expression.instanceof.ts\"}},\"end\":\"(?<=\\\\))|(?=[;),}\\\\]:?\\\\-+>]|\\\\|\\\\||\\\\&\\\\&|!==|$|(===|!==|==|!=)|(([\\\\&\\\\~\\\\^\\\\|]\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s+instanceof(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))function((\\\\s+[_$A-Za-z][_$0-9A-Za-z]*)|(\\\\s*[(]))))\",\"patterns\":[{\"include\":\"#type\"}]},\"interface-declaration\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(?:(abstract)\\\\s+)?\\\\b(interface)\\\\b(?=\\\\s+|/[/*])\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"storage.modifier.ts\"},\"4\":{\"name\":\"storage.type.interface.ts\"}},\"end\":\"(?<=\\\\})\",\"name\":\"meta.interface.ts\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#class-or-interface-heritage\"},{\"captures\":{\"0\":{\"name\":\"entity.name.type.interface.ts\"}},\"match\":\"[_$A-Za-z][_$0-9A-Za-z]*\"},{\"include\":\"#type-parameters\"},{\"include\":\"#class-or-interface-body\"}]},\"jsdoctype\":{\"patterns\":[{\"begin\":\"\\\\G({)\",\"beginCaptures\":{\"0\":{\"name\":\"entity.name.type.instance.jsdoc\"},\"1\":{\"name\":\"punctuation.definition.bracket.curly.begin.jsdoc\"}},\"contentName\":\"entity.name.type.instance.jsdoc\",\"end\":\"((}))\\\\s*|(?=\\\\*/)\",\"endCaptures\":{\"1\":{\"name\":\"entity.name.type.instance.jsdoc\"},\"2\":{\"name\":\"punctuation.definition.bracket.curly.end.jsdoc\"}},\"patterns\":[{\"include\":\"#brackets\"}]}]},\"label\":{\"patterns\":[{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(:)(?=\\\\s*\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.label.ts\"},\"2\":{\"name\":\"punctuation.separator.label.ts\"}},\"end\":\"(?<=\\\\})\",\"patterns\":[{\"include\":\"#decl-block\"}]},{\"captures\":{\"1\":{\"name\":\"entity.name.label.ts\"},\"2\":{\"name\":\"punctuation.separator.label.ts\"}},\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(:)\"}]},\"literal\":{\"patterns\":[{\"include\":\"#numeric-literal\"},{\"include\":\"#boolean-literal\"},{\"include\":\"#null-literal\"},{\"include\":\"#undefined-literal\"},{\"include\":\"#numericConstant-literal\"},{\"include\":\"#array-literal\"},{\"include\":\"#this-literal\"},{\"include\":\"#super-literal\"}]},\"method-declaration\":{\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:\\\\b(override)\\\\s+)?(?:\\\\b(public|private|protected)\\\\s+)?(?:\\\\b(abstract)\\\\s+)?(?:\\\\b(async)\\\\s+)?\\\\s*\\\\b(constructor)\\\\b(?!:)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"storage.modifier.ts\"},\"4\":{\"name\":\"storage.modifier.async.ts\"},\"5\":{\"name\":\"storage.type.ts\"}},\"end\":\"(?=\\\\}|;|,|$)|(?<=\\\\})\",\"name\":\"meta.method.declaration.ts\",\"patterns\":[{\"include\":\"#method-declaration-name\"},{\"include\":\"#function-body\"}]},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:\\\\b(override)\\\\s+)?(?:\\\\b(public|private|protected)\\\\s+)?(?:\\\\b(abstract)\\\\s+)?(?:\\\\b(async)\\\\s+)?(?:(?:\\\\s*\\\\b(new)\\\\b(?!:)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|(?:(\\\\*)\\\\s*)?)(?=\\\\s*((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*))?[(])\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"storage.modifier.ts\"},\"4\":{\"name\":\"storage.modifier.async.ts\"},\"5\":{\"name\":\"keyword.operator.new.ts\"},\"6\":{\"name\":\"keyword.generator.asterisk.ts\"}},\"end\":\"(?=\\\\}|;|,|$)|(?<=\\\\})\",\"name\":\"meta.method.declaration.ts\",\"patterns\":[{\"include\":\"#method-declaration-name\"},{\"include\":\"#function-body\"}]},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:\\\\b(override)\\\\s+)?(?:\\\\b(public|private|protected)\\\\s+)?(?:\\\\b(abstract)\\\\s+)?(?:\\\\b(async)\\\\s+)?(?:\\\\b(get|set)\\\\s+)?(?:(\\\\*)\\\\s*)?(?=\\\\s*(((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(\\\\??))\\\\s*((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*))?[(])\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"storage.modifier.ts\"},\"4\":{\"name\":\"storage.modifier.async.ts\"},\"5\":{\"name\":\"storage.type.property.ts\"},\"6\":{\"name\":\"keyword.generator.asterisk.ts\"}},\"end\":\"(?=\\\\}|;|,|$)|(?<=\\\\})\",\"name\":\"meta.method.declaration.ts\",\"patterns\":[{\"include\":\"#method-declaration-name\"},{\"include\":\"#function-body\"}]}]},\"method-declaration-name\":{\"begin\":\"(?=((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(\\\\??)\\\\s*[(<])\",\"end\":\"(?=\\\\(|<)\",\"patterns\":[{\"include\":\"#string\"},{\"include\":\"#array-literal\"},{\"include\":\"#numeric-literal\"},{\"match\":\"[_$A-Za-z][_$0-9A-Za-z]*\",\"name\":\"meta.definition.method.ts entity.name.function.ts\"},{\"match\":\"\\\\?\",\"name\":\"keyword.operator.optional.ts\"}]},\"namespace-declaration\":{\"begin\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(namespace|module)\\\\s+(?=[_$A-Za-z\\\"'`]))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"storage.type.namespace.ts\"}},\"end\":\"(?<=\\\\})|(?=;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"name\":\"meta.namespace.declaration.ts\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\",\"name\":\"entity.name.type.module.ts\"},{\"include\":\"#punctuation-accessor\"},{\"include\":\"#decl-block\"}]},\"new-expr\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(new)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.new.ts\"}},\"end\":\"(?<=\\\\))|(?=[;),}\\\\]:?\\\\-+>]|\\\\|\\\\||\\\\&\\\\&|!==|$|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))new(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))function((\\\\s+[_$A-Za-z][_$0-9A-Za-z]*)|(\\\\s*[(]))))\",\"name\":\"new.expr.ts\",\"patterns\":[{\"include\":\"#expression\"}]},\"null-literal\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))null(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"constant.language.null.ts\"},\"numeric-literal\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"storage.type.numeric.bigint.ts\"}},\"match\":\"\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$)\",\"name\":\"constant.numeric.hex.ts\"},{\"captures\":{\"1\":{\"name\":\"storage.type.numeric.bigint.ts\"}},\"match\":\"\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$)\",\"name\":\"constant.numeric.binary.ts\"},{\"captures\":{\"1\":{\"name\":\"storage.type.numeric.bigint.ts\"}},\"match\":\"\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$)\",\"name\":\"constant.numeric.octal.ts\"},{\"captures\":{\"0\":{\"name\":\"constant.numeric.decimal.ts\"},\"1\":{\"name\":\"meta.delimiter.decimal.period.ts\"},\"2\":{\"name\":\"storage.type.numeric.bigint.ts\"},\"3\":{\"name\":\"meta.delimiter.decimal.period.ts\"},\"4\":{\"name\":\"storage.type.numeric.bigint.ts\"},\"5\":{\"name\":\"meta.delimiter.decimal.period.ts\"},\"6\":{\"name\":\"storage.type.numeric.bigint.ts\"},\"7\":{\"name\":\"storage.type.numeric.bigint.ts\"},\"8\":{\"name\":\"meta.delimiter.decimal.period.ts\"},\"9\":{\"name\":\"storage.type.numeric.bigint.ts\"},\"10\":{\"name\":\"meta.delimiter.decimal.period.ts\"},\"11\":{\"name\":\"storage.type.numeric.bigint.ts\"},\"12\":{\"name\":\"meta.delimiter.decimal.period.ts\"},\"13\":{\"name\":\"storage.type.numeric.bigint.ts\"},\"14\":{\"name\":\"storage.type.numeric.bigint.ts\"}},\"match\":\"(?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$)\"}]},\"numericConstant-literal\":{\"patterns\":[{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))NaN(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"constant.language.nan.ts\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))Infinity(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"constant.language.infinity.ts\"}]},\"object-binding-element\":{\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"(?=((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(:))\",\"end\":\"(?=,|\\\\})\",\"patterns\":[{\"include\":\"#object-binding-element-propertyName\"},{\"include\":\"#binding-element\"}]},{\"include\":\"#object-binding-pattern\"},{\"include\":\"#destructuring-variable-rest\"},{\"include\":\"#variable-initializer\"},{\"include\":\"#punctuation-comma\"}]},\"object-binding-element-const\":{\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"(?=((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(:))\",\"end\":\"(?=,|\\\\})\",\"patterns\":[{\"include\":\"#object-binding-element-propertyName\"},{\"include\":\"#binding-element-const\"}]},{\"include\":\"#object-binding-pattern-const\"},{\"include\":\"#destructuring-variable-rest-const\"},{\"include\":\"#variable-initializer\"},{\"include\":\"#punctuation-comma\"}]},\"object-binding-element-propertyName\":{\"begin\":\"(?=((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(:))\",\"end\":\"(:)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.destructuring.ts\"}},\"patterns\":[{\"include\":\"#string\"},{\"include\":\"#array-literal\"},{\"include\":\"#numeric-literal\"},{\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\",\"name\":\"variable.object.property.ts\"}]},\"object-binding-pattern\":{\"begin\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.ts\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.object.ts\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.object.ts\"}},\"patterns\":[{\"include\":\"#object-binding-element\"}]},\"object-binding-pattern-const\":{\"begin\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.ts\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.object.ts\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.object.ts\"}},\"patterns\":[{\"include\":\"#object-binding-element-const\"}]},\"object-identifiers\":{\"patterns\":[{\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)(?=\\\\s*\\\\??\\\\.\\\\s*prototype\\\\b(?!\\\\$))\",\"name\":\"support.class.ts\"},{\"captures\":{\"1\":{\"name\":\"punctuation.accessor.ts\"},\"2\":{\"name\":\"punctuation.accessor.optional.ts\"},\"3\":{\"name\":\"variable.other.constant.object.property.ts\"},\"4\":{\"name\":\"variable.other.object.property.ts\"}},\"match\":\"(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*(?:(\\\\#?[A-Z][_$\\\\dA-Z]*)|(\\\\#?[_$A-Za-z][_$0-9A-Za-z]*))(?=\\\\s*\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*)\"},{\"captures\":{\"1\":{\"name\":\"variable.other.constant.object.ts\"},\"2\":{\"name\":\"variable.other.object.ts\"}},\"match\":\"(?:([A-Z][_$\\\\dA-Z]*)|([_$A-Za-z][_$0-9A-Za-z]*))(?=\\\\s*\\\\??\\\\.\\\\s*\\\\#?[_$A-Za-z][_$0-9A-Za-z]*)\"}]},\"object-literal\":{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"name\":\"meta.objectliteral.ts\",\"patterns\":[{\"include\":\"#object-member\"}]},\"object-literal-method-declaration\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:\\\\b(async)\\\\s+)?(?:\\\\b(get|set)\\\\s+)?(?:(\\\\*)\\\\s*)?(?=\\\\s*(((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(\\\\??))\\\\s*((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*))?[(])\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.ts\"},\"2\":{\"name\":\"storage.type.property.ts\"},\"3\":{\"name\":\"keyword.generator.asterisk.ts\"}},\"end\":\"(?=\\\\}|;|,)|(?<=\\\\})\",\"name\":\"meta.method.declaration.ts\",\"patterns\":[{\"include\":\"#method-declaration-name\"},{\"include\":\"#function-body\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:\\\\b(async)\\\\s+)?(?:\\\\b(get|set)\\\\s+)?(?:(\\\\*)\\\\s*)?(?=\\\\s*(((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(\\\\??))\\\\s*((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*))?[(])\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.ts\"},\"2\":{\"name\":\"storage.type.property.ts\"},\"3\":{\"name\":\"keyword.generator.asterisk.ts\"}},\"end\":\"(?=\\\\(|<)\",\"patterns\":[{\"include\":\"#method-declaration-name\"}]}]},\"object-member\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#object-literal-method-declaration\"},{\"begin\":\"(?=\\\\[)\",\"end\":\"(?=:)|((?<=[\\\\]])(?=\\\\s*[(<]))\",\"name\":\"meta.object.member.ts meta.object-literal.key.ts\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#array-literal\"}]},{\"begin\":\"(?=[\\\\'\\\\\\\"\\\\`])\",\"end\":\"(?=:)|((?<=[\\\\'\\\\\\\"\\\\`])(?=((\\\\s*[(<,}])|(\\\\s+(as|satisifies)\\\\s+))))\",\"name\":\"meta.object.member.ts meta.object-literal.key.ts\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"}]},{\"begin\":\"(?=(\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$)))\",\"end\":\"(?=:)|(?=\\\\s*([(<,}])|(\\\\s+as|satisifies\\\\s+))\",\"name\":\"meta.object.member.ts meta.object-literal.key.ts\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#numeric-literal\"}]},{\"begin\":\"(?<=[\\\\]\\\\'\\\\\\\"\\\\`])(?=\\\\s*[(<])\",\"end\":\"(?=\\\\}|;|,)|(?<=\\\\})\",\"name\":\"meta.method.declaration.ts\",\"patterns\":[{\"include\":\"#function-body\"}]},{\"captures\":{\"0\":{\"name\":\"meta.object-literal.key.ts\"},\"1\":{\"name\":\"constant.numeric.decimal.ts\"}},\"match\":\"(?![_$A-Za-z])([\\\\d]+)\\\\s*(?=(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*:)\",\"name\":\"meta.object.member.ts\"},{\"captures\":{\"0\":{\"name\":\"meta.object-literal.key.ts\"},\"1\":{\"name\":\"entity.name.function.ts\"}},\"match\":\"(?:([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?=(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*:(\\\\s*\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/)*\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>))))))\",\"name\":\"meta.object.member.ts\"},{\"captures\":{\"0\":{\"name\":\"meta.object-literal.key.ts\"}},\"match\":\"(?:[_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?=(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*:)\",\"name\":\"meta.object.member.ts\"},{\"begin\":\"\\\\.\\\\.\\\\.\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.operator.spread.ts\"}},\"end\":\"(?=,|\\\\})\",\"name\":\"meta.object.member.ts\",\"patterns\":[{\"include\":\"#expression\"}]},{\"captures\":{\"1\":{\"name\":\"variable.other.readwrite.ts\"}},\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?=,|\\\\}|$|\\\\/\\\\/|\\\\/\\\\*)\",\"name\":\"meta.object.member.ts\"},{\"captures\":{\"1\":{\"name\":\"keyword.control.as.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(as)\\\\s+(const)(?=\\\\s*([,}]|$))\",\"name\":\"meta.object.member.ts\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(as)|(satisfies))\\\\s+\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.as.ts\"},\"2\":{\"name\":\"keyword.control.satisfies.ts\"}},\"end\":\"(?=[;),}\\\\]:?\\\\-+>]|\\\\|\\\\||\\\\&\\\\&|!==|$|^|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(as|satisifies)\\\\s+))\",\"name\":\"meta.object.member.ts\",\"patterns\":[{\"include\":\"#type\"}]},{\"begin\":\"(?=[_$A-Za-z][_$0-9A-Za-z]*\\\\s*=)\",\"end\":\"(?=,|\\\\}|$|\\\\/\\\\/|\\\\/\\\\*)\",\"name\":\"meta.object.member.ts\",\"patterns\":[{\"include\":\"#expression\"}]},{\"begin\":\":\",\"beginCaptures\":{\"0\":{\"name\":\"meta.object-literal.key.ts punctuation.separator.key-value.ts\"}},\"end\":\"(?=,|\\\\})\",\"name\":\"meta.object.member.ts\",\"patterns\":[{\"begin\":\"(?<=:)\\\\s*(async)?(?=\\\\s*(<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)\\\\(\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.ts\"}},\"end\":\"(?<=\\\\))\",\"patterns\":[{\"include\":\"#type-parameters\"},{\"begin\":\"\\\\(\",\"beginCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"patterns\":[{\"include\":\"#expression-inside-possibly-arrow-parens\"}]}]},{\"begin\":\"(?<=:)\\\\s*(async)?\\\\s*(\\\\()(?=\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.ts\"},\"2\":{\"name\":\"meta.brace.round.ts\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"patterns\":[{\"include\":\"#expression-inside-possibly-arrow-parens\"}]},{\"begin\":\"(?<=:)\\\\s*(async)?\\\\s*(?=<\\\\s*$)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.ts\"}},\"end\":\"(?<=>)\",\"patterns\":[{\"include\":\"#type-parameters\"}]},{\"begin\":\"(?<=>)\\\\s*(\\\\()(?=\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))\",\"beginCaptures\":{\"1\":{\"name\":\"meta.brace.round.ts\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"patterns\":[{\"include\":\"#expression-inside-possibly-arrow-parens\"}]},{\"include\":\"#possibly-arrow-return-type\"},{\"include\":\"#expression\"}]},{\"include\":\"#punctuation-comma\"},{\"include\":\"#decl-block\"}]},\"parameter-array-binding-pattern\":{\"begin\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\[)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.ts\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.array.ts\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.array.ts\"}},\"patterns\":[{\"include\":\"#parameter-binding-element\"},{\"include\":\"#punctuation-comma\"}]},\"parameter-binding-element\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#string\"},{\"include\":\"#numeric-literal\"},{\"include\":\"#regex\"},{\"include\":\"#parameter-object-binding-pattern\"},{\"include\":\"#parameter-array-binding-pattern\"},{\"include\":\"#destructuring-parameter-rest\"},{\"include\":\"#variable-initializer\"}]},\"parameter-name\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"storage.modifier.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(override|public|protected|private|readonly)\\\\s+(?=(override|public|protected|private|readonly)\\\\s+)\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.ts\"},\"2\":{\"name\":\"keyword.operator.rest.ts\"},\"3\":{\"name\":\"entity.name.function.ts variable.language.this.ts\"},\"4\":{\"name\":\"entity.name.function.ts\"},\"5\":{\"name\":\"keyword.operator.optional.ts\"}},\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(override|public|private|protected|readonly)\\\\s+)?(?:(\\\\.\\\\.\\\\.)\\\\s*)?(?<!=|:)(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*(\\\\??)(?=\\\\s*(=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>)))))|(:\\\\s*((<)|([(]\\\\s*(([)])|(\\\\.\\\\.\\\\.)|([_$0-9A-Za-z]+\\\\s*(([:,?=])|([)]\\\\s*=>)))))))|(:\\\\s*(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))Function(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|(:\\\\s*((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))))|(:\\\\s*(=>|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(<[^<>]*>)|[^<>(),=])+=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>))))))\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.ts\"},\"2\":{\"name\":\"keyword.operator.rest.ts\"},\"3\":{\"name\":\"variable.parameter.ts variable.language.this.ts\"},\"4\":{\"name\":\"variable.parameter.ts\"},\"5\":{\"name\":\"keyword.operator.optional.ts\"}},\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(override|public|private|protected|readonly)\\\\s+)?(?:(\\\\.\\\\.\\\\.)\\\\s*)?(?<!=|:)(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*(\\\\??)\"}]},\"parameter-object-binding-element\":{\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"(?=((\\\\b(?<!\\\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:b|B)[01][01_]*(n)?\\\\b(?!\\\\$))|(\\\\b(?<!\\\\$)0(?:o|O)?[0-7][0-7_]*(n)?\\\\b(?!\\\\$))|((?<!\\\\$)(?:(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\B(\\\\.)\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*[eE][+-]?\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(\\\\.)(n)?\\\\B)|(?:\\\\B(\\\\.)\\\\d[0-9_]*(n)?\\\\b)|(?:\\\\b\\\\d[0-9_]*(n)?\\\\b(?!\\\\.)))(?!\\\\$))|([_$A-Za-z][_$0-9A-Za-z]*)|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`)|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])+\\\\]))\\\\s*(:))\",\"end\":\"(?=,|\\\\})\",\"patterns\":[{\"include\":\"#object-binding-element-propertyName\"},{\"include\":\"#parameter-binding-element\"},{\"include\":\"#paren-expression\"}]},{\"include\":\"#parameter-object-binding-pattern\"},{\"include\":\"#destructuring-parameter-rest\"},{\"include\":\"#variable-initializer\"},{\"include\":\"#punctuation-comma\"}]},\"parameter-object-binding-pattern\":{\"begin\":\"(?:(\\\\.\\\\.\\\\.)\\\\s*)?(\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.rest.ts\"},\"2\":{\"name\":\"punctuation.definition.binding-pattern.object.ts\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.binding-pattern.object.ts\"}},\"patterns\":[{\"include\":\"#parameter-object-binding-element\"}]},\"parameter-type-annotation\":{\"patterns\":[{\"begin\":\"(:)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.type.annotation.ts\"}},\"end\":\"(?=[,)])|(?==[^>])\",\"name\":\"meta.type.annotation.ts\",\"patterns\":[{\"include\":\"#type\"}]}]},\"paren-expression\":{\"begin\":\"\\\\(\",\"beginCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"patterns\":[{\"include\":\"#expression\"}]},\"paren-expression-possibly-arrow\":{\"patterns\":[{\"begin\":\"(?<=[(=,])\\\\s*(async)?(?=\\\\s*((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*))?\\\\(\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.ts\"}},\"end\":\"(?<=\\\\))\",\"patterns\":[{\"include\":\"#paren-expression-possibly-arrow-with-typeparameters\"}]},{\"begin\":\"(?<=[(=,]|=>|^return|[^\\\\._$0-9A-Za-z]return)\\\\s*(async)?(?=\\\\s*((((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*))?\\\\()|(<)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)))\\\\s*$)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.async.ts\"}},\"end\":\"(?<=\\\\))\",\"patterns\":[{\"include\":\"#paren-expression-possibly-arrow-with-typeparameters\"}]},{\"include\":\"#possibly-arrow-return-type\"}]},\"paren-expression-possibly-arrow-with-typeparameters\":{\"patterns\":[{\"include\":\"#type-parameters\"},{\"begin\":\"\\\\(\",\"beginCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"patterns\":[{\"include\":\"#expression-inside-possibly-arrow-parens\"}]}]},\"possibly-arrow-return-type\":{\"begin\":\"(?<=\\\\)|^)\\\\s*(:)(?=\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*=>)\",\"beginCaptures\":{\"1\":{\"name\":\"meta.arrow.ts meta.return.type.arrow.ts keyword.operator.type.annotation.ts\"}},\"contentName\":\"meta.arrow.ts meta.return.type.arrow.ts\",\"end\":\"(?==>|\\\\{|(^\\\\s*(export|function|class|interface|let|var|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|const|import|enum|namespace|module|type|abstract|declare)\\\\s+))\",\"patterns\":[{\"include\":\"#arrow-return-type-body\"}]},\"property-accessor\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(accessor|get|set)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"storage.type.property.ts\"},\"punctuation-accessor\":{\"captures\":{\"1\":{\"name\":\"punctuation.accessor.ts\"},\"2\":{\"name\":\"punctuation.accessor.optional.ts\"}},\"match\":\"(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\"},\"punctuation-comma\":{\"match\":\",\",\"name\":\"punctuation.separator.comma.ts\"},\"punctuation-semicolon\":{\"match\":\";\",\"name\":\"punctuation.terminator.statement.ts\"},\"qstring-double\":{\"begin\":\"\\\"\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.ts\"}},\"end\":\"(\\\")|((?:[^\\\\\\\\\\\\n])$)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.end.ts\"},\"2\":{\"name\":\"invalid.illegal.newline.ts\"}},\"name\":\"string.quoted.double.ts\",\"patterns\":[{\"include\":\"#string-character-escape\"}]},\"qstring-single\":{\"begin\":\"'\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.ts\"}},\"end\":\"(\\\\')|((?:[^\\\\\\\\\\\\n])$)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.end.ts\"},\"2\":{\"name\":\"invalid.illegal.newline.ts\"}},\"name\":\"string.quoted.single.ts\",\"patterns\":[{\"include\":\"#string-character-escape\"}]},\"regex\":{\"patterns\":[{\"begin\":\"(?<!\\\\+\\\\+|--|})(?<=[=(:,\\\\[?+!]|^return|[^\\\\._$0-9A-Za-z]return|^case|[^\\\\._$0-9A-Za-z]case|=>|&&|\\\\|\\\\||\\\\*\\\\/)\\\\s*(\\\\/)(?![\\\\/*])(?=(?:[^\\\\/\\\\\\\\\\\\[()]|\\\\\\\\.|\\\\[([^\\\\]\\\\\\\\]|\\\\\\\\.)+\\\\]|\\\\(([^)\\\\\\\\]|\\\\\\\\.)+\\\\))+\\\\/([dgimsuy]+|(?![\\\\/\\\\*])|(?=\\\\/\\\\*))(?!\\\\s*[a-zA-Z0-9_$]))\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.begin.ts\"}},\"end\":\"(/)([dgimsuy]*)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.end.ts\"},\"2\":{\"name\":\"keyword.other.ts\"}},\"name\":\"string.regexp.ts\",\"patterns\":[{\"include\":\"#regexp\"}]},{\"begin\":\"((?<![_$0-9A-Za-z)\\\\]]|\\\\+\\\\+|--|}|\\\\*\\\\/)|((?<=^return|[^\\\\._$0-9A-Za-z]return|^case|[^\\\\._$0-9A-Za-z]case))\\\\s*)\\\\/(?![\\\\/*])(?=(?:[^\\\\/\\\\\\\\\\\\[]|\\\\\\\\.|\\\\[([^\\\\]\\\\\\\\]|\\\\\\\\.)*\\\\])+\\\\/([dgimsuy]+|(?![\\\\/\\\\*])|(?=\\\\/\\\\*))(?!\\\\s*[a-zA-Z0-9_$]))\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.ts\"}},\"end\":\"(/)([dgimsuy]*)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.end.ts\"},\"2\":{\"name\":\"keyword.other.ts\"}},\"name\":\"string.regexp.ts\",\"patterns\":[{\"include\":\"#regexp\"}]}]},\"regex-character-class\":{\"patterns\":[{\"match\":\"\\\\\\\\[wWsSdDtrnvf]|\\\\.\",\"name\":\"constant.other.character-class.regexp\"},{\"match\":\"\\\\\\\\([0-7]{3}|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4})\",\"name\":\"constant.character.numeric.regexp\"},{\"match\":\"\\\\\\\\c[A-Z]\",\"name\":\"constant.character.control.regexp\"},{\"match\":\"\\\\\\\\.\",\"name\":\"constant.character.escape.backslash.regexp\"}]},\"regexp\":{\"patterns\":[{\"match\":\"\\\\\\\\[bB]|\\\\^|\\\\$\",\"name\":\"keyword.control.anchor.regexp\"},{\"captures\":{\"0\":{\"name\":\"keyword.other.back-reference.regexp\"},\"1\":{\"name\":\"variable.other.regexp\"}},\"match\":\"\\\\\\\\[1-9]\\\\d*|\\\\\\\\k<([a-zA-Z_$][\\\\w$]*)>\"},{\"match\":\"[?+*]|\\\\{(\\\\d+,\\\\d+|\\\\d+,|,\\\\d+|\\\\d+)\\\\}\\\\??\",\"name\":\"keyword.operator.quantifier.regexp\"},{\"match\":\"\\\\|\",\"name\":\"keyword.operator.or.regexp\"},{\"begin\":\"(\\\\()((\\\\?=)|(\\\\?!)|(\\\\?<=)|(\\\\?<!))\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.group.regexp\"},\"2\":{\"name\":\"punctuation.definition.group.assertion.regexp\"},\"3\":{\"name\":\"meta.assertion.look-ahead.regexp\"},\"4\":{\"name\":\"meta.assertion.negative-look-ahead.regexp\"},\"5\":{\"name\":\"meta.assertion.look-behind.regexp\"},\"6\":{\"name\":\"meta.assertion.negative-look-behind.regexp\"}},\"end\":\"(\\\\))\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.group.regexp\"}},\"name\":\"meta.group.assertion.regexp\",\"patterns\":[{\"include\":\"#regexp\"}]},{\"begin\":\"\\\\((?:(\\\\?:)|(?:\\\\?<([a-zA-Z_$][\\\\w$]*)>))?\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.group.regexp\"},\"1\":{\"name\":\"punctuation.definition.group.no-capture.regexp\"},\"2\":{\"name\":\"variable.other.regexp\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.group.regexp\"}},\"name\":\"meta.group.regexp\",\"patterns\":[{\"include\":\"#regexp\"}]},{\"begin\":\"(\\\\[)(\\\\^)?\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.character-class.regexp\"},\"2\":{\"name\":\"keyword.operator.negation.regexp\"}},\"end\":\"(\\\\])\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.character-class.regexp\"}},\"name\":\"constant.other.character-class.set.regexp\",\"patterns\":[{\"captures\":{\"1\":{\"name\":\"constant.character.numeric.regexp\"},\"2\":{\"name\":\"constant.character.control.regexp\"},\"3\":{\"name\":\"constant.character.escape.backslash.regexp\"},\"4\":{\"name\":\"constant.character.numeric.regexp\"},\"5\":{\"name\":\"constant.character.control.regexp\"},\"6\":{\"name\":\"constant.character.escape.backslash.regexp\"}},\"match\":\"(?:.|(\\\\\\\\(?:[0-7]{3}|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}))|(\\\\\\\\c[A-Z])|(\\\\\\\\.))-(?:[^\\\\]\\\\\\\\]|(\\\\\\\\(?:[0-7]{3}|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}))|(\\\\\\\\c[A-Z])|(\\\\\\\\.))\",\"name\":\"constant.other.character-class.range.regexp\"},{\"include\":\"#regex-character-class\"}]},{\"include\":\"#regex-character-class\"}]},\"return-type\":{\"patterns\":[{\"begin\":\"(?<=\\\\))\\\\s*(:)(?=\\\\s*\\\\S)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.type.annotation.ts\"}},\"end\":\"(?<![:|&])(?=$|^|[{};,]|//)\",\"name\":\"meta.return.type.ts\",\"patterns\":[{\"include\":\"#return-type-core\"}]},{\"begin\":\"(?<=\\\\))\\\\s*(:)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.type.annotation.ts\"}},\"end\":\"(?<![:|&])((?=[{};,]|//|^\\\\s*$)|((?<=\\\\S)(?=\\\\s*$)))\",\"name\":\"meta.return.type.ts\",\"patterns\":[{\"include\":\"#return-type-core\"}]}]},\"return-type-core\":{\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"(?<=[:|&])(?=\\\\s*\\\\{)\",\"end\":\"(?<=\\\\})\",\"patterns\":[{\"include\":\"#type-object\"}]},{\"include\":\"#type-predicate-operator\"},{\"include\":\"#type\"}]},\"shebang\":{\"captures\":{\"1\":{\"name\":\"punctuation.definition.comment.ts\"}},\"match\":\"\\\\A(#!).*(?=$)\",\"name\":\"comment.line.shebang.ts\"},\"single-line-comment-consuming-line-ending\":{\"begin\":\"(^[ \\\\t]+)?((//)(?:\\\\s*((@)internal)(?=\\\\s|$))?)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.whitespace.comment.leading.ts\"},\"2\":{\"name\":\"comment.line.double-slash.ts\"},\"3\":{\"name\":\"punctuation.definition.comment.ts\"},\"4\":{\"name\":\"storage.type.internaldeclaration.ts\"},\"5\":{\"name\":\"punctuation.decorator.internaldeclaration.ts\"}},\"contentName\":\"comment.line.double-slash.ts\",\"end\":\"(?=^)\"},\"statements\":{\"patterns\":[{\"include\":\"#declaration\"},{\"include\":\"#control-statement\"},{\"include\":\"#after-operator-block-as-object-literal\"},{\"include\":\"#decl-block\"},{\"include\":\"#label\"},{\"include\":\"#expression\"},{\"include\":\"#punctuation-semicolon\"},{\"include\":\"#string\"},{\"include\":\"#comment\"}]},\"string\":{\"patterns\":[{\"include\":\"#qstring-single\"},{\"include\":\"#qstring-double\"},{\"include\":\"#template\"}]},\"string-character-escape\":{\"match\":\"\\\\\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|u\\\\{[0-9A-Fa-f]+\\\\}|[0-2][0-7]{0,2}|3[0-6][0-7]?|37[0-7]?|[4-7][0-7]?|.|$)\",\"name\":\"constant.character.escape.ts\"},\"super-literal\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))super\\\\b(?!\\\\$)\",\"name\":\"variable.language.super.ts\"},\"support-function-call-identifiers\":{\"patterns\":[{\"include\":\"#literal\"},{\"include\":\"#support-objects\"},{\"include\":\"#object-identifiers\"},{\"include\":\"#punctuation-accessor\"},{\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))import(?=\\\\s*[(]\\\\s*[\\\\\\\"\\\\'\\\\`]))\",\"name\":\"keyword.operator.expression.import.ts\"}]},\"support-objects\":{\"patterns\":[{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(arguments)\\\\b(?!\\\\$)\",\"name\":\"variable.language.arguments.ts\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(Promise)\\\\b(?!\\\\$)\",\"name\":\"support.class.promise.ts\"},{\"captures\":{\"1\":{\"name\":\"keyword.control.import.ts\"},\"2\":{\"name\":\"punctuation.accessor.ts\"},\"3\":{\"name\":\"punctuation.accessor.optional.ts\"},\"4\":{\"name\":\"support.variable.property.importmeta.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(import)\\\\s*(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*(meta)\\\\b(?!\\\\$)\"},{\"captures\":{\"1\":{\"name\":\"keyword.operator.new.ts\"},\"2\":{\"name\":\"punctuation.accessor.ts\"},\"3\":{\"name\":\"punctuation.accessor.optional.ts\"},\"4\":{\"name\":\"support.variable.property.target.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(new)\\\\s*(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*(target)\\\\b(?!\\\\$)\"},{\"captures\":{\"1\":{\"name\":\"punctuation.accessor.ts\"},\"2\":{\"name\":\"punctuation.accessor.optional.ts\"},\"3\":{\"name\":\"support.variable.property.ts\"},\"4\":{\"name\":\"support.constant.ts\"}},\"match\":\"(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*(?:(?:(constructor|length|prototype|__proto__)\\\\b(?!\\\\$|\\\\s*(<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\())|(?:(EPSILON|MAX_SAFE_INTEGER|MAX_VALUE|MIN_SAFE_INTEGER|MIN_VALUE|NEGATIVE_INFINITY|POSITIVE_INFINITY)\\\\b(?!\\\\$)))\"},{\"captures\":{\"1\":{\"name\":\"support.type.object.module.ts\"},\"2\":{\"name\":\"support.type.object.module.ts\"},\"3\":{\"name\":\"punctuation.accessor.ts\"},\"4\":{\"name\":\"punctuation.accessor.optional.ts\"},\"5\":{\"name\":\"support.type.object.module.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(exports)|(module)(?:(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))(exports|id|filename|loaded|parent|children))?)\\\\b(?!\\\\$)\"}]},\"switch-statement\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?=\\\\bswitch\\\\s*\\\\()\",\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"name\":\"switch-statement.expr.ts\",\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(switch)\\\\s*(\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.switch.ts\"},\"2\":{\"name\":\"meta.brace.round.ts\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"name\":\"switch-expression.expr.ts\",\"patterns\":[{\"include\":\"#expression\"}]},{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"end\":\"(?=\\\\})\",\"name\":\"switch-block.expr.ts\",\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(case|default(?=:))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.switch.ts\"}},\"end\":\"(?=:)\",\"name\":\"case-clause.expr.ts\",\"patterns\":[{\"include\":\"#expression\"}]},{\"begin\":\"(:)\\\\s*(\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"case-clause.expr.ts punctuation.definition.section.case-statement.ts\"},\"2\":{\"name\":\"meta.block.ts punctuation.definition.block.ts\"}},\"contentName\":\"meta.block.ts\",\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"meta.block.ts punctuation.definition.block.ts\"}},\"patterns\":[{\"include\":\"#statements\"}]},{\"captures\":{\"0\":{\"name\":\"case-clause.expr.ts punctuation.definition.section.case-statement.ts\"}},\"match\":\"(:)\"},{\"include\":\"#statements\"}]}]},\"template\":{\"patterns\":[{\"include\":\"#template-call\"},{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)?(`)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.function.tagged-template.ts\"},\"2\":{\"name\":\"string.template.ts punctuation.definition.string.template.begin.ts\"}},\"contentName\":\"string.template.ts\",\"end\":\"`\",\"endCaptures\":{\"0\":{\"name\":\"string.template.ts punctuation.definition.string.template.end.ts\"}},\"patterns\":[{\"include\":\"#template-substitution-element\"},{\"include\":\"#string-character-escape\"}]}]},\"template-call\":{\"patterns\":[{\"begin\":\"(?=(([_$A-Za-z][_$0-9A-Za-z]*\\\\s*\\\\??\\\\.\\\\s*)*|(\\\\??\\\\.\\\\s*)?)([_$A-Za-z][_$0-9A-Za-z]*)(<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))(([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>)*(?<!=)>))*(?<!=)>)*(?<!=)>\\\\s*)?`)\",\"end\":\"(?=`)\",\"patterns\":[{\"begin\":\"(?=(([_$A-Za-z][_$0-9A-Za-z]*\\\\s*\\\\??\\\\.\\\\s*)*|(\\\\??\\\\.\\\\s*)?)([_$A-Za-z][_$0-9A-Za-z]*))\",\"end\":\"(?=(<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))(([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>)*(?<!=)>))*(?<!=)>)*(?<!=)>\\\\s*)?`)\",\"patterns\":[{\"include\":\"#support-function-call-identifiers\"},{\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\",\"name\":\"entity.name.function.tagged-template.ts\"}]},{\"include\":\"#type-arguments\"}]},{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)?\\\\s*(?=(<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))(([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>|<\\\\s*(((keyof|infer|typeof|readonly)\\\\s+)|(([_$A-Za-z][_$0-9A-Za-z]*|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))(?=\\\\s*([<>\\\\,\\\\.\\\\[]|=>|&(?!&)|\\\\|(?!\\\\|)))))([^<>(]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(?<==)>)*(?<!=)>))*(?<!=)>)*(?<!=)>\\\\s*)`)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.function.tagged-template.ts\"}},\"end\":\"(?=`)\",\"patterns\":[{\"include\":\"#type-arguments\"}]}]},\"template-substitution-element\":{\"begin\":\"\\\\$\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.template-expression.begin.ts\"}},\"contentName\":\"meta.embedded.line.ts\",\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.template-expression.end.ts\"}},\"name\":\"meta.template.expression.ts\",\"patterns\":[{\"include\":\"#expression\"}]},\"template-type\":{\"patterns\":[{\"include\":\"#template-call\"},{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)?(`)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.function.tagged-template.ts\"},\"2\":{\"name\":\"string.template.ts punctuation.definition.string.template.begin.ts\"}},\"contentName\":\"string.template.ts\",\"end\":\"`\",\"endCaptures\":{\"0\":{\"name\":\"string.template.ts punctuation.definition.string.template.end.ts\"}},\"patterns\":[{\"include\":\"#template-type-substitution-element\"},{\"include\":\"#string-character-escape\"}]}]},\"template-type-substitution-element\":{\"begin\":\"\\\\$\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.template-expression.begin.ts\"}},\"contentName\":\"meta.embedded.line.ts\",\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.template-expression.end.ts\"}},\"name\":\"meta.template.expression.ts\",\"patterns\":[{\"include\":\"#type\"}]},\"ternary-expression\":{\"begin\":\"(?!\\\\?\\\\.\\\\s*[^\\\\d])(\\\\?)(?!\\\\?)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.ternary.ts\"}},\"end\":\"\\\\s*(:)\",\"endCaptures\":{\"1\":{\"name\":\"keyword.operator.ternary.ts\"}},\"patterns\":[{\"include\":\"#expression\"}]},\"this-literal\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))this\\\\b(?!\\\\$)\",\"name\":\"variable.language.this.ts\"},\"type\":{\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#type-string\"},{\"include\":\"#numeric-literal\"},{\"include\":\"#type-primitive\"},{\"include\":\"#type-builtin-literals\"},{\"include\":\"#type-parameters\"},{\"include\":\"#type-tuple\"},{\"include\":\"#type-object\"},{\"include\":\"#type-operators\"},{\"include\":\"#type-conditional\"},{\"include\":\"#type-fn-type-parameters\"},{\"include\":\"#type-paren-or-function-parameters\"},{\"include\":\"#type-function-return-type\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(readonly)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*\"},{\"include\":\"#type-name\"}]},\"type-alias-declaration\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(type)\\\\b\\\\s+([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"storage.type.type.ts\"},\"4\":{\"name\":\"entity.name.type.alias.ts\"}},\"end\":\"(?=\\\\}|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"name\":\"meta.type.declaration.ts\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#type-parameters\"},{\"begin\":\"(=)\\\\s*(intrinsic)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.assignment.ts\"},\"2\":{\"name\":\"keyword.control.intrinsic.ts\"}},\"end\":\"(?=\\\\}|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"patterns\":[{\"include\":\"#type\"}]},{\"begin\":\"(=)\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.assignment.ts\"}},\"end\":\"(?=\\\\}|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"patterns\":[{\"include\":\"#type\"}]}]},\"type-annotation\":{\"patterns\":[{\"begin\":\"(:)(?=\\\\s*\\\\S)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.type.annotation.ts\"}},\"end\":\"(?<![:|&])(?!\\\\s*[|&]\\\\s+)((?=^|[,);}\\\\]]|//)|(?==[^>])|((?<=[}>\\\\])]|[_$A-Za-z])\\\\s*(?=\\\\{)))\",\"name\":\"meta.type.annotation.ts\",\"patterns\":[{\"include\":\"#type\"}]},{\"begin\":\"(:)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.type.annotation.ts\"}},\"end\":\"(?<![:|&])((?=[,);}\\\\]]|\\\\/\\\\/)|(?==[^>])|(?=^\\\\s*$)|((?<=[}>\\\\])]|[_$A-Za-z])\\\\s*(?=\\\\{)))\",\"name\":\"meta.type.annotation.ts\",\"patterns\":[{\"include\":\"#type\"}]}]},\"type-arguments\":{\"begin\":\"<\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.typeparameters.begin.ts\"}},\"end\":\">\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.typeparameters.end.ts\"}},\"name\":\"meta.type.parameters.ts\",\"patterns\":[{\"include\":\"#type-arguments-body\"}]},\"type-arguments-body\":{\"patterns\":[{\"captures\":{\"0\":{\"name\":\"keyword.operator.type.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(_)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\"},{\"include\":\"#type\"},{\"include\":\"#punctuation-comma\"}]},\"type-builtin-literals\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(this|true|false|undefined|null|object)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"support.type.builtin.ts\"},\"type-conditional\":{\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(extends)\\\\s+\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.ts\"}},\"end\":\"(?<=:)\",\"patterns\":[{\"begin\":\"\\\\?\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.operator.ternary.ts\"}},\"end\":\":\",\"endCaptures\":{\"0\":{\"name\":\"keyword.operator.ternary.ts\"}},\"patterns\":[{\"include\":\"#type\"}]},{\"include\":\"#type\"}]}]},\"type-fn-type-parameters\":{\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(abstract)\\\\s+)?(new)\\\\b(?=\\\\s*<)\",\"beginCaptures\":{\"1\":{\"name\":\"meta.type.constructor.ts storage.modifier.ts\"},\"2\":{\"name\":\"meta.type.constructor.ts keyword.control.new.ts\"}},\"end\":\"(?<=>)\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#type-parameters\"}]},{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(abstract)\\\\s+)?(new)\\\\b\\\\s*(?=\\\\()\",\"beginCaptures\":{\"1\":{\"name\":\"storage.modifier.ts\"},\"2\":{\"name\":\"keyword.control.new.ts\"}},\"end\":\"(?<=\\\\))\",\"name\":\"meta.type.constructor.ts\",\"patterns\":[{\"include\":\"#function-parameters\"}]},{\"begin\":\"((?=[(]\\\\s*(([)])|(\\\\.\\\\.\\\\.)|([_$0-9A-Za-z]+\\\\s*(([:,?=])|([)]\\\\s*=>))))))\",\"end\":\"(?<=\\\\))\",\"name\":\"meta.type.function.ts\",\"patterns\":[{\"include\":\"#function-parameters\"}]}]},\"type-function-return-type\":{\"patterns\":[{\"begin\":\"(=>)(?=\\\\s*\\\\S)\",\"beginCaptures\":{\"1\":{\"name\":\"storage.type.function.arrow.ts\"}},\"end\":\"(?<!=>)(?<![|&])(?=[,\\\\]){}=;>:?]|//|$)\",\"name\":\"meta.type.function.return.ts\",\"patterns\":[{\"include\":\"#type-function-return-type-core\"}]},{\"begin\":\"=>\",\"beginCaptures\":{\"0\":{\"name\":\"storage.type.function.arrow.ts\"}},\"end\":\"(?<!=>)(?<![|&])((?=[,\\\\]){}=;:?>]|//|^\\\\s*$)|((?<=\\\\S)(?=\\\\s*$)))\",\"name\":\"meta.type.function.return.ts\",\"patterns\":[{\"include\":\"#type-function-return-type-core\"}]}]},\"type-function-return-type-core\":{\"patterns\":[{\"include\":\"#comment\"},{\"begin\":\"(?<==>)(?=\\\\s*\\\\{)\",\"end\":\"(?<=\\\\})\",\"patterns\":[{\"include\":\"#type-object\"}]},{\"include\":\"#type-predicate-operator\"},{\"include\":\"#type\"}]},\"type-infer\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"keyword.operator.expression.infer.ts\"},\"2\":{\"name\":\"entity.name.type.ts\"},\"3\":{\"name\":\"keyword.operator.expression.extends.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(infer)\\\\s+([_$A-Za-z][_$0-9A-Za-z]*)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))(?:\\\\s+(extends)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))?\",\"name\":\"meta.type.infer.ts\"}]},\"type-name\":{\"patterns\":[{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\\\\s*(<)\",\"captures\":{\"1\":{\"name\":\"entity.name.type.module.ts\"},\"2\":{\"name\":\"punctuation.accessor.ts\"},\"3\":{\"name\":\"punctuation.accessor.optional.ts\"},\"4\":{\"name\":\"meta.type.parameters.ts punctuation.definition.typeparameters.begin.ts\"}},\"contentName\":\"meta.type.parameters.ts\",\"end\":\"(>)\",\"endCaptures\":{\"1\":{\"name\":\"meta.type.parameters.ts punctuation.definition.typeparameters.end.ts\"}},\"patterns\":[{\"include\":\"#type-arguments-body\"}]},{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(<)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.type.ts\"},\"2\":{\"name\":\"meta.type.parameters.ts punctuation.definition.typeparameters.begin.ts\"}},\"contentName\":\"meta.type.parameters.ts\",\"end\":\"(>)\",\"endCaptures\":{\"1\":{\"name\":\"meta.type.parameters.ts punctuation.definition.typeparameters.end.ts\"}},\"patterns\":[{\"include\":\"#type-arguments-body\"}]},{\"captures\":{\"1\":{\"name\":\"entity.name.type.module.ts\"},\"2\":{\"name\":\"punctuation.accessor.ts\"},\"3\":{\"name\":\"punctuation.accessor.optional.ts\"}},\"match\":\"([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(?:(\\\\.)|(\\\\?\\\\.(?!\\\\s*[\\\\d])))\"},{\"match\":\"[_$A-Za-z][_$0-9A-Za-z]*\",\"name\":\"entity.name.type.ts\"}]},\"type-object\":{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.block.ts\"}},\"name\":\"meta.object.type.ts\",\"patterns\":[{\"include\":\"#comment\"},{\"include\":\"#method-declaration\"},{\"include\":\"#indexer-declaration\"},{\"include\":\"#indexer-mapped-type-declaration\"},{\"include\":\"#field-declaration\"},{\"include\":\"#type-annotation\"},{\"begin\":\"\\\\.\\\\.\\\\.\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.operator.spread.ts\"}},\"end\":\"(?=\\\\}|;|,|$)|(?<=\\\\})\",\"patterns\":[{\"include\":\"#type\"}]},{\"include\":\"#punctuation-comma\"},{\"include\":\"#punctuation-semicolon\"},{\"include\":\"#type\"}]},\"type-operators\":{\"patterns\":[{\"include\":\"#typeof-operator\"},{\"include\":\"#type-infer\"},{\"begin\":\"([&|])(?=\\\\s*\\\\{)\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.operator.type.ts\"}},\"end\":\"(?<=\\\\})\",\"patterns\":[{\"include\":\"#type-object\"}]},{\"begin\":\"[&|]\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.operator.type.ts\"}},\"end\":\"(?=\\\\S)\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))keyof(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.operator.expression.keyof.ts\"},{\"match\":\"(\\\\?|:)\",\"name\":\"keyword.operator.ternary.ts\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))import(?=\\\\s*\\\\()\",\"name\":\"keyword.operator.expression.import.ts\"}]},\"type-parameters\":{\"begin\":\"(<)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.typeparameters.begin.ts\"}},\"end\":\"(>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.typeparameters.end.ts\"}},\"name\":\"meta.type.parameters.ts\",\"patterns\":[{\"include\":\"#comment\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(extends|in|out|const)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"storage.modifier.ts\"},{\"include\":\"#type\"},{\"include\":\"#punctuation-comma\"},{\"match\":\"(=)(?!>)\",\"name\":\"keyword.operator.assignment.ts\"}]},\"type-paren-or-function-parameters\":{\"begin\":\"\\\\(\",\"beginCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"end\":\"\\\\)\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.round.ts\"}},\"name\":\"meta.type.paren.cover.ts\",\"patterns\":[{\"captures\":{\"1\":{\"name\":\"storage.modifier.ts\"},\"2\":{\"name\":\"keyword.operator.rest.ts\"},\"3\":{\"name\":\"entity.name.function.ts variable.language.this.ts\"},\"4\":{\"name\":\"entity.name.function.ts\"},\"5\":{\"name\":\"keyword.operator.optional.ts\"}},\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(public|private|protected|readonly)\\\\s+)?(?:(\\\\.\\\\.\\\\.)\\\\s*)?(?<!=|:)(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))\\\\s*(\\\\??)(?=\\\\s*(:\\\\s*((<)|([(]\\\\s*(([)])|(\\\\.\\\\.\\\\.)|([_$0-9A-Za-z]+\\\\s*(([:,?=])|([)]\\\\s*=>)))))))|(:\\\\s*(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))Function(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|(:\\\\s*((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))))\"},{\"captures\":{\"1\":{\"name\":\"storage.modifier.ts\"},\"2\":{\"name\":\"keyword.operator.rest.ts\"},\"3\":{\"name\":\"variable.parameter.ts variable.language.this.ts\"},\"4\":{\"name\":\"variable.parameter.ts\"},\"5\":{\"name\":\"keyword.operator.optional.ts\"}},\"match\":\"(?:(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(public|private|protected|readonly)\\\\s+)?(?:(\\\\.\\\\.\\\\.)\\\\s*)?(?<!=|:)(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))\\\\s*(\\\\??)(?=:)\"},{\"include\":\"#type-annotation\"},{\"match\":\",\",\"name\":\"punctuation.separator.parameter.ts\"},{\"include\":\"#type\"}]},\"type-predicate-operator\":{\"patterns\":[{\"captures\":{\"1\":{\"name\":\"keyword.operator.type.asserts.ts\"},\"2\":{\"name\":\"variable.parameter.ts variable.language.this.ts\"},\"3\":{\"name\":\"variable.parameter.ts\"},\"4\":{\"name\":\"keyword.operator.expression.is.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(asserts)\\\\s+)?(?!asserts)(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))\\\\s(is)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\"},{\"captures\":{\"1\":{\"name\":\"keyword.operator.type.asserts.ts\"},\"2\":{\"name\":\"variable.parameter.ts variable.language.this.ts\"},\"3\":{\"name\":\"variable.parameter.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(asserts)\\\\s+(?!is)(?:(this)|([_$A-Za-z][_$0-9A-Za-z]*))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))asserts(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.operator.type.asserts.ts\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))is(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"keyword.operator.expression.is.ts\"}]},\"type-primitive\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(string|number|bigint|boolean|symbol|any|void|never|unknown)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"support.type.primitive.ts\"},\"type-string\":{\"patterns\":[{\"include\":\"#qstring-single\"},{\"include\":\"#qstring-double\"},{\"include\":\"#template-type\"}]},\"type-tuple\":{\"begin\":\"\\\\[\",\"beginCaptures\":{\"0\":{\"name\":\"meta.brace.square.ts\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"meta.brace.square.ts\"}},\"name\":\"meta.type.tuple.ts\",\"patterns\":[{\"match\":\"\\\\.\\\\.\\\\.\",\"name\":\"keyword.operator.rest.ts\"},{\"captures\":{\"1\":{\"name\":\"entity.name.label.ts\"},\"2\":{\"name\":\"keyword.operator.optional.ts\"},\"3\":{\"name\":\"punctuation.separator.label.ts\"}},\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))([_$A-Za-z][_$0-9A-Za-z]*)\\\\s*(\\\\?)?\\\\s*(:)\"},{\"include\":\"#type\"},{\"include\":\"#punctuation-comma\"}]},\"typeof-operator\":{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))typeof(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"beginCaptures\":{\"0\":{\"name\":\"keyword.operator.expression.typeof.ts\"}},\"end\":\"(?=[,);}\\\\]=>:&|{?]|(extends\\\\s+)|$|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))\",\"patterns\":[{\"include\":\"#type-arguments\"},{\"include\":\"#expression\"}]},\"undefined-literal\":{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))undefined(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"constant.language.undefined.ts\"},\"var-expr\":{\"patterns\":[{\"begin\":\"(?=(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(var|let)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))\",\"end\":\"(?!(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(var|let)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))((?=^|;|}|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))|((?<!^let|[^\\\\._$0-9A-Za-z]let|^var|[^\\\\._$0-9A-Za-z]var)(?=\\\\s*$)))\",\"name\":\"meta.var.expr.ts\",\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(var|let)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"storage.type.ts\"}},\"end\":\"(?=\\\\S)\"},{\"include\":\"#destructuring-variable\"},{\"include\":\"#var-single-variable\"},{\"include\":\"#variable-initializer\"},{\"include\":\"#comment\"},{\"begin\":\"(,)\\\\s*(?=$|\\\\/\\\\/)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.separator.comma.ts\"}},\"end\":\"(?<!,)(((?==|;|}|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|^\\\\s*$))|((?<=\\\\S)(?=\\\\s*$)))\",\"patterns\":[{\"include\":\"#single-line-comment-consuming-line-ending\"},{\"include\":\"#comment\"},{\"include\":\"#destructuring-variable\"},{\"include\":\"#var-single-variable\"},{\"include\":\"#punctuation-comma\"}]},{\"include\":\"#punctuation-comma\"}]},{\"begin\":\"(?=(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(const(?!\\\\s+enum\\\\b))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"storage.type.ts\"}},\"end\":\"(?!(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(const(?!\\\\s+enum\\\\b))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))((?=^|;|}|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))|((?<!^const|[^\\\\._$0-9A-Za-z]const)(?=\\\\s*$)))\",\"name\":\"meta.var.expr.ts\",\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b(const(?!\\\\s+enum\\\\b))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"storage.type.ts\"}},\"end\":\"(?=\\\\S)\"},{\"include\":\"#destructuring-const\"},{\"include\":\"#var-single-const\"},{\"include\":\"#variable-initializer\"},{\"include\":\"#comment\"},{\"begin\":\"(,)\\\\s*(?=$|\\\\/\\\\/)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.separator.comma.ts\"}},\"end\":\"(?<!,)(((?==|;|}|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|^\\\\s*$))|((?<=\\\\S)(?=\\\\s*$)))\",\"patterns\":[{\"include\":\"#single-line-comment-consuming-line-ending\"},{\"include\":\"#comment\"},{\"include\":\"#destructuring-const\"},{\"include\":\"#var-single-const\"},{\"include\":\"#punctuation-comma\"}]},{\"include\":\"#punctuation-comma\"}]},{\"begin\":\"(?=(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b((?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"storage.type.ts\"}},\"end\":\"(?!(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b((?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))((?=;|}|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b))|((?<!^using|[^\\\\._$0-9A-Za-z]using|^await\\\\s+using|[^\\\\._$0-9A-Za-z]await\\\\s+using)(?=\\\\s*$)))\",\"name\":\"meta.var.expr.ts\",\"patterns\":[{\"begin\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(?:(\\\\bexport)\\\\s+)?(?:(\\\\bdeclare)\\\\s+)?\\\\b((?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b))(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.control.export.ts\"},\"2\":{\"name\":\"storage.modifier.ts\"},\"3\":{\"name\":\"storage.type.ts\"}},\"end\":\"(?=\\\\S)\"},{\"include\":\"#var-single-const\"},{\"include\":\"#variable-initializer\"},{\"include\":\"#comment\"},{\"begin\":\"(,)\\\\s*((?!\\\\S)|(?=\\\\/\\\\/))\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.separator.comma.ts\"}},\"end\":\"(?<!,)(((?==|;|}|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|^\\\\s*$))|((?<=\\\\S)(?=\\\\s*$)))\",\"patterns\":[{\"include\":\"#single-line-comment-consuming-line-ending\"},{\"include\":\"#comment\"},{\"include\":\"#var-single-const\"},{\"include\":\"#punctuation-comma\"}]},{\"include\":\"#punctuation-comma\"}]}]},\"var-single-const\":{\"patterns\":[{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)(?=\\\\s*(=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>)))))|(:\\\\s*((<)|([(]\\\\s*(([)])|(\\\\.\\\\.\\\\.)|([_$0-9A-Za-z]+\\\\s*(([:,?=])|([)]\\\\s*=>)))))))|(:\\\\s*(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))Function(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|(:\\\\s*((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))))|(:\\\\s*(=>|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(<[^<>]*>)|[^<>(),=])+=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>))))))\",\"beginCaptures\":{\"1\":{\"name\":\"meta.definition.variable.ts variable.other.constant.ts entity.name.function.ts\"}},\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|(;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b)))\",\"name\":\"meta.var-single-variable.expr.ts\",\"patterns\":[{\"include\":\"#var-single-variable-type-annotation\"}]},{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)\",\"beginCaptures\":{\"1\":{\"name\":\"meta.definition.variable.ts variable.other.constant.ts\"}},\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|(;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b)))\",\"name\":\"meta.var-single-variable.expr.ts\",\"patterns\":[{\"include\":\"#var-single-variable-type-annotation\"}]}]},\"var-single-variable\":{\"patterns\":[{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)(!)?(?=\\\\s*(=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>)))))|(:\\\\s*((<)|([(]\\\\s*(([)])|(\\\\.\\\\.\\\\.)|([_$0-9A-Za-z]+\\\\s*(([:,?=])|([)]\\\\s*=>)))))))|(:\\\\s*(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))Function(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.)))|(:\\\\s*((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))))))|(:\\\\s*(=>|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(<[^<>]*>)|[^<>(),=])+=\\\\s*(((async\\\\s+)?((function\\\\s*[(<*])|(function\\\\s+)|([_$A-Za-z][_$0-9A-Za-z]*\\\\s*=>)))|((async\\\\s*)?(((<\\\\s*$)|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*((([{\\\\[]\\\\s*)?$)|((\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})\\\\s*((:\\\\s*\\\\{?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*)))|((\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])\\\\s*((:\\\\s*\\\\[?$)|((\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+\\\\s*)?=\\\\s*))))))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?[(]\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([)]\\\\s*:)|((\\\\.\\\\.\\\\.\\\\s*)?[_$A-Za-z][_$0-9A-Za-z]*\\\\s*:)))|((<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<]|<\\\\s*(((const\\\\s+)?[_$A-Za-z])|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\]))([^=<>]|=[^<])*>)*>)*>\\\\s*)?\\\\(\\\\s*(\\\\/\\\\*([^\\\\*]|(\\\\*[^\\\\/]))*\\\\*\\\\/\\\\s*)*(([_$A-Za-z]|(\\\\{([^{}]|(\\\\{([^{}]|\\\\{[^{}]*\\\\})*\\\\}))*\\\\})|(\\\\[([^\\\\[\\\\]]|(\\\\[([^\\\\[\\\\]]|\\\\[[^\\\\[\\\\]]*\\\\])*\\\\]))*\\\\])|(\\\\.\\\\.\\\\.\\\\s*[_$A-Za-z]))([^()\\\\'\\\\\\\"\\\\`]|(\\\\(([^()]|(\\\\(([^()]|\\\\([^()]*\\\\))*\\\\)))*\\\\))|(\\\\'([^\\\\'\\\\\\\\]|\\\\\\\\.)*\\\\')|(\\\\\\\"([^\\\\\\\"\\\\\\\\]|\\\\\\\\.)*\\\\\\\")|(\\\\`([^\\\\`\\\\\\\\]|\\\\\\\\.)*\\\\`))*)?\\\\)(\\\\s*:\\\\s*([^<>(){}]|<([^<>]|<([^<>]|<[^<>]+>)+>)+>|\\\\([^()]+\\\\)|\\\\{[^{}]+\\\\})+)?\\\\s*=>))))))\",\"beginCaptures\":{\"1\":{\"name\":\"meta.definition.variable.ts entity.name.function.ts\"},\"2\":{\"name\":\"keyword.operator.definiteassignment.ts\"}},\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|(;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b)))\",\"name\":\"meta.var-single-variable.expr.ts\",\"patterns\":[{\"include\":\"#var-single-variable-type-annotation\"}]},{\"begin\":\"([A-Z][_$\\\\dA-Z]*)(?![_$0-9A-Za-z])(!)?\",\"beginCaptures\":{\"1\":{\"name\":\"meta.definition.variable.ts variable.other.constant.ts\"},\"2\":{\"name\":\"keyword.operator.definiteassignment.ts\"}},\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|(;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b)))\",\"name\":\"meta.var-single-variable.expr.ts\",\"patterns\":[{\"include\":\"#var-single-variable-type-annotation\"}]},{\"begin\":\"([_$A-Za-z][_$0-9A-Za-z]*)(!)?\",\"beginCaptures\":{\"1\":{\"name\":\"meta.definition.variable.ts variable.other.readwrite.ts\"},\"2\":{\"name\":\"keyword.operator.definiteassignment.ts\"}},\"end\":\"(?=$|^|[;,=}]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+)|(;|^\\\\s*$|(?:^\\\\s*(?:abstract|async|(?:\\\\bawait\\\\s+(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)\\\\b)|break|case|catch|class|const|continue|declare|do|else|enum|export|finally|function|for|goto|if|import|interface|let|module|namespace|switch|return|throw|try|type|(?:\\\\busing(?=\\\\s+(?!in\\\\b|of\\\\b(?!\\\\s*(?:of\\\\b|=)))[_$A-Za-z])\\\\b)|var|while)\\\\b)))\",\"name\":\"meta.var-single-variable.expr.ts\",\"patterns\":[{\"include\":\"#var-single-variable-type-annotation\"}]}]},\"var-single-variable-type-annotation\":{\"patterns\":[{\"include\":\"#type-annotation\"},{\"include\":\"#string\"},{\"include\":\"#comment\"}]},\"variable-initializer\":{\"patterns\":[{\"begin\":\"(?<!=|!)(=)(?!=)(?=\\\\s*\\\\S)(?!\\\\s*.*=>\\\\s*$)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.assignment.ts\"}},\"end\":\"(?=$|^|[,);}\\\\]]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+))\",\"patterns\":[{\"include\":\"#expression\"}]},{\"begin\":\"(?<!=|!)(=)(?!=)\",\"beginCaptures\":{\"1\":{\"name\":\"keyword.operator.assignment.ts\"}},\"end\":\"(?=[,);}\\\\]]|((?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(of|in)\\\\s+))|(?=^\\\\s*$)|(?<![\\\\|\\\\&+\\\\-\\\\*\\\\/])(?<=\\\\S)(?<!=)(?=\\\\s*$)\",\"patterns\":[{\"include\":\"#expression\"}]}]}},\"scopeName\":\"source.ts\",\"aliases\":[\"ts\"]}"));

const typescript = [
  lang$7
];

const lang$6 = Object.freeze(JSON.parse("{\"displayName\":\"JSON\",\"name\":\"json\",\"patterns\":[{\"include\":\"#value\"}],\"repository\":{\"array\":{\"begin\":\"\\\\[\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.array.begin.json\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.array.end.json\"}},\"name\":\"meta.structure.array.json\",\"patterns\":[{\"include\":\"#value\"},{\"match\":\",\",\"name\":\"punctuation.separator.array.json\"},{\"match\":\"[^\\\\s\\\\]]\",\"name\":\"invalid.illegal.expected-array-separator.json\"}]},\"comments\":{\"patterns\":[{\"begin\":\"/\\\\*\\\\*(?!/)\",\"captures\":{\"0\":{\"name\":\"punctuation.definition.comment.json\"}},\"end\":\"\\\\*/\",\"name\":\"comment.block.documentation.json\"},{\"begin\":\"/\\\\*\",\"captures\":{\"0\":{\"name\":\"punctuation.definition.comment.json\"}},\"end\":\"\\\\*/\",\"name\":\"comment.block.json\"},{\"captures\":{\"1\":{\"name\":\"punctuation.definition.comment.json\"}},\"match\":\"(//).*$\\\\n?\",\"name\":\"comment.line.double-slash.js\"}]},\"constant\":{\"match\":\"\\\\b(?:true|false|null)\\\\b\",\"name\":\"constant.language.json\"},\"number\":{\"match\":\"-?(?:0|[1-9]\\\\d*)(?:(?:\\\\.\\\\d+)?(?:[eE][+-]?\\\\d+)?)?\",\"name\":\"constant.numeric.json\"},\"object\":{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.dictionary.begin.json\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.dictionary.end.json\"}},\"name\":\"meta.structure.dictionary.json\",\"patterns\":[{\"comment\":\"the JSON object key\",\"include\":\"#objectkey\"},{\"include\":\"#comments\"},{\"begin\":\":\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.separator.dictionary.key-value.json\"}},\"end\":\"(,)|(?=\\\\})\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.separator.dictionary.pair.json\"}},\"name\":\"meta.structure.dictionary.value.json\",\"patterns\":[{\"comment\":\"the JSON object value\",\"include\":\"#value\"},{\"match\":\"[^\\\\s,]\",\"name\":\"invalid.illegal.expected-dictionary-separator.json\"}]},{\"match\":\"[^\\\\s}]\",\"name\":\"invalid.illegal.expected-dictionary-separator.json\"}]},\"objectkey\":{\"begin\":\"\\\"\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.support.type.property-name.begin.json\"}},\"end\":\"\\\"\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.support.type.property-name.end.json\"}},\"name\":\"string.json support.type.property-name.json\",\"patterns\":[{\"include\":\"#stringcontent\"}]},\"string\":{\"begin\":\"\\\"\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.json\"}},\"end\":\"\\\"\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.json\"}},\"name\":\"string.quoted.double.json\",\"patterns\":[{\"include\":\"#stringcontent\"}]},\"stringcontent\":{\"patterns\":[{\"match\":\"\\\\\\\\(?:[\\\"\\\\\\\\/bfnrt]|u[0-9a-fA-F]{4})\",\"name\":\"constant.character.escape.json\"},{\"match\":\"\\\\\\\\.\",\"name\":\"invalid.illegal.unrecognized-string-escape.json\"}]},\"value\":{\"patterns\":[{\"include\":\"#constant\"},{\"include\":\"#number\"},{\"include\":\"#string\"},{\"include\":\"#array\"},{\"include\":\"#object\"},{\"include\":\"#comments\"}]}},\"scopeName\":\"source.json\"}"));

const json = [
  lang$6
];

const lang$5 = Object.freeze(JSON.parse("{\"displayName\":\"HTML (Derivative)\",\"injections\":{\"R:text.html - (comment.block, text.html meta.embedded, meta.tag.*.*.html, meta.tag.*.*.*.html, meta.tag.*.*.*.*.html)\":{\"comment\":\"Uses R: to ensure this matches after any other injections.\",\"patterns\":[{\"match\":\"<\",\"name\":\"invalid.illegal.bad-angle-bracket.html\"}]}},\"name\":\"html-derivative\",\"patterns\":[{\"include\":\"text.html.basic#core-minus-invalid\"},{\"begin\":\"(</?)(\\\\w[^\\\\s>]*)(?<!/)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"},\"2\":{\"name\":\"entity.name.tag.html\"}},\"end\":\"((?: ?/)?>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"meta.tag.other.unrecognized.html.derivative\",\"patterns\":[{\"include\":\"text.html.basic#attribute\"}]}],\"scopeName\":\"text.html.derivative\",\"embeddedLangs\":[\"html\"]}"));

const html_derivative = [
  ...html,
  lang$5
];

const lang$4 = Object.freeze(JSON.parse("{\"fileTypes\":[],\"injectTo\":[\"text.html.markdown\"],\"injectionSelector\":\"L:text.html.markdown\",\"name\":\"markdown-vue\",\"patterns\":[{\"include\":\"#vue-code-block\"}],\"repository\":{\"vue-code-block\":{\"begin\":\"(^|\\\\G)(\\\\s*)(`{3,}|~{3,})\\\\s*(?i:(vue)((\\\\s+|:|,|\\\\{|\\\\?)[^`~]*)?$)\",\"beginCaptures\":{\"3\":{\"name\":\"punctuation.definition.markdown\"},\"4\":{\"name\":\"fenced_code.block.language.markdown\"},\"5\":{\"name\":\"fenced_code.block.language.attributes.markdown\",\"patterns\":[]}},\"end\":\"(^|\\\\G)(\\\\2|\\\\s{0,3})(\\\\3)\\\\s*$\",\"endCaptures\":{\"3\":{\"name\":\"punctuation.definition.markdown\"}},\"name\":\"markup.fenced_code.block.markdown\",\"patterns\":[{\"include\":\"source.vue\"}]}},\"scopeName\":\"markdown.vue.codeblock\"}"));

const markdown_vue = [
  lang$4
];

const lang$3 = Object.freeze(JSON.parse("{\"fileTypes\":[],\"injectTo\":[\"source.vue\",\"text.html.markdown\",\"text.html.derivative\",\"text.pug\"],\"injectionSelector\":\"L:meta.tag -meta.attribute -meta.ng-binding -entity.name.tag.pug -attribute_value -source.tsx -source.js.jsx, L:meta.element -meta.attribute\",\"name\":\"vue-directives\",\"patterns\":[{\"include\":\"source.vue#vue-directives\"}],\"scopeName\":\"vue.directives\"}"));

const vue_directives = [
  lang$3
];

const lang$2 = Object.freeze(JSON.parse("{\"fileTypes\":[],\"injectTo\":[\"source.vue\",\"text.html.markdown\",\"text.html.derivative\",\"text.pug\"],\"injectionSelector\":\"L:text.pug -comment -string.comment, L:text.html.derivative -comment.block, L:text.html.markdown -comment.block\",\"name\":\"vue-interpolations\",\"patterns\":[{\"include\":\"source.vue#vue-interpolations\"}],\"scopeName\":\"vue.interpolations\"}"));

const vue_interpolations = [
  lang$2
];

const lang$1 = Object.freeze(JSON.parse("{\"fileTypes\":[],\"injectTo\":[\"source.vue\"],\"injectionSelector\":\"L:source.css -comment, L:source.postcss -comment, L:source.sass -comment, L:source.stylus -comment\",\"name\":\"vue-sfc-style-variable-injection\",\"patterns\":[{\"include\":\"#vue-sfc-style-variable-injection\"}],\"repository\":{\"vue-sfc-style-variable-injection\":{\"begin\":\"\\\\b(v-bind)\\\\s*\\\\(\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.function\"}},\"end\":\"\\\\)\",\"name\":\"vue.sfc.style.variable.injection.v-bind\",\"patterns\":[{\"begin\":\"('|\\\")\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html\"}},\"end\":\"(\\\\1)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.end.html\"}},\"name\":\"source.ts.embedded.html.vue\",\"patterns\":[{\"include\":\"source.js\"}]},{\"include\":\"source.js\"}]}},\"scopeName\":\"vue.sfc.style.variable.injection\",\"embeddedLangs\":[\"javascript\"]}"));

const vue_sfc_style_variable_injection = [
  ...javascript,
  lang$1
];

const lang = Object.freeze(JSON.parse("{\"displayName\":\"Vue\",\"name\":\"vue\",\"patterns\":[{\"include\":\"text.html.basic#comment\"},{\"include\":\"#self-closing-tag\"},{\"begin\":\"(<)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"}},\"end\":\"(>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.end.html.vue\"}},\"patterns\":[{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)md\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"text.html.markdown\",\"patterns\":[{\"include\":\"text.html.markdown\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)html\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"text.html.derivative\",\"patterns\":[{\"include\":\"#html-stuff\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)pug\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"text.pug\",\"patterns\":[{\"include\":\"text.pug\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)stylus\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.stylus\",\"patterns\":[{\"include\":\"source.stylus\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)postcss\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.postcss\",\"patterns\":[{\"include\":\"source.postcss\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)sass\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.sass\",\"patterns\":[{\"include\":\"source.sass\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)css\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.css\",\"patterns\":[{\"include\":\"source.css\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)scss\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.css.scss\",\"patterns\":[{\"include\":\"source.css.scss\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)less\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.css.less\",\"patterns\":[{\"include\":\"source.css.less\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)js\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.js\",\"patterns\":[{\"include\":\"source.js\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)ts\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.ts\",\"patterns\":[{\"include\":\"source.ts\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)jsx\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.js.jsx\",\"patterns\":[{\"include\":\"source.js.jsx\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)tsx\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.tsx\",\"patterns\":[{\"include\":\"source.tsx\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)coffee\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.coffee\",\"patterns\":[{\"include\":\"source.coffee\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)json\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.json\",\"patterns\":[{\"include\":\"source.json\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)jsonc\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.json.comments\",\"patterns\":[{\"include\":\"source.json.comments\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)json5\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.json5\",\"patterns\":[{\"include\":\"source.json5\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)yaml\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.yaml\",\"patterns\":[{\"include\":\"source.yaml\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)toml\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.toml\",\"patterns\":[{\"include\":\"source.toml\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)(gql|graphql)\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.graphql\",\"patterns\":[{\"include\":\"source.graphql\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\\\\b(?=[^>]*\\\\blang\\\\s*=\\\\s*(['\\\"]?)vue\\\\b\\\\2)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"source.vue\",\"patterns\":[{\"include\":\"source.vue\"}]}]},{\"begin\":\"(template)\\\\b\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/template\\\\b)\",\"name\":\"text.html.derivative\",\"patterns\":[{\"include\":\"#html-stuff\"}]}]},{\"begin\":\"(script)\\\\b\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/script\\\\b)\",\"name\":\"source.js\",\"patterns\":[{\"include\":\"source.js\"}]}]},{\"begin\":\"(style)\\\\b\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/style\\\\b)\",\"name\":\"source.css\",\"patterns\":[{\"include\":\"source.css\"}]}]},{\"begin\":\"([a-zA-Z0-9:-]+)\",\"beginCaptures\":{\"1\":{\"name\":\"entity.name.tag.$1.html.vue\"}},\"end\":\"(</)(\\\\1)\\\\s*(?=>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"patterns\":[{\"include\":\"#tag-stuff\"},{\"begin\":\"(?<=>)\",\"end\":\"(?=<\\\\/)\",\"name\":\"text\"}]}]}],\"repository\":{\"html-stuff\":{\"patterns\":[{\"include\":\"#template-tag\"},{\"include\":\"text.html.derivative\"},{\"include\":\"text.html.basic\"}]},\"self-closing-tag\":{\"begin\":\"(<)([a-zA-Z0-9:-]+)(?=([^>]+/>))\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"end\":\"(/>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.end.html.vue\"}},\"name\":\"self-closing-tag\",\"patterns\":[{\"include\":\"#tag-stuff\"}]},\"tag-stuff\":{\"begin\":\"\\\\G\",\"end\":\"(?=/>)|(>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.end.html.vue\"}},\"name\":\"meta.tag-stuff\",\"patterns\":[{\"include\":\"#vue-directives\"},{\"include\":\"text.html.basic#attribute\"}]},\"template-tag\":{\"patterns\":[{\"include\":\"#template-tag-1\"},{\"include\":\"#template-tag-2\"}]},\"template-tag-1\":{\"begin\":\"(<)(template)\\\\b(>)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"},\"3\":{\"name\":\"punctuation.definition.tag.end.html.vue\"}},\"end\":\"(/?>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.end.html.vue\"}},\"name\":\"meta.template-tag.start\",\"patterns\":[{\"begin\":\"\\\\G\",\"end\":\"(?=/>)|((</)(template)\\\\b)\",\"endCaptures\":{\"2\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"3\":{\"name\":\"entity.name.tag.$3.html.vue\"}},\"name\":\"meta.template-tag.end\",\"patterns\":[{\"include\":\"#html-stuff\"}]}]},\"template-tag-2\":{\"begin\":\"(<)(template)\\\\b\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"2\":{\"name\":\"entity.name.tag.$2.html.vue\"}},\"end\":\"(/?>)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.tag.end.html.vue\"}},\"name\":\"meta.template-tag.start\",\"patterns\":[{\"begin\":\"\\\\G\",\"end\":\"(?=/>)|((</)(template)\\\\b)\",\"endCaptures\":{\"2\":{\"name\":\"punctuation.definition.tag.begin.html.vue\"},\"3\":{\"name\":\"entity.name.tag.$3.html.vue\"}},\"name\":\"meta.template-tag.end\",\"patterns\":[{\"include\":\"#tag-stuff\"},{\"include\":\"#html-stuff\"}]}]},\"vue-directives\":{\"patterns\":[{\"include\":\"#vue-directives-control\"},{\"include\":\"#vue-directives-style-attr\"},{\"include\":\"#vue-directives-original\"},{\"include\":\"#vue-directives-generic-attr\"}]},\"vue-directives-control\":{\"begin\":\"(v-for)|(v-if|v-else-if|v-else)\",\"captures\":{\"1\":{\"name\":\"keyword.control.loop.vue\"},\"2\":{\"name\":\"keyword.control.conditional.vue\"}},\"end\":\"(?=\\\\s*+[^=\\\\s])\",\"name\":\"meta.attribute.directive.control.vue\",\"patterns\":[{\"include\":\"#vue-directives-expression\"}]},\"vue-directives-expression\":{\"patterns\":[{\"begin\":\"(=)\\\\s*('|\\\"|`)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.separator.key-value.html.vue\"},\"2\":{\"name\":\"punctuation.definition.string.begin.html.vue\"}},\"end\":\"(\\\\2)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.end.html.vue\"}},\"patterns\":[{\"begin\":\"(?<=('|\\\"|`))\",\"end\":\"(?=\\\\1)\",\"name\":\"source.ts.embedded.html.vue\",\"patterns\":[{\"include\":\"source.ts#expression\"}]}]},{\"begin\":\"(=)\\\\s*(?=[^'\\\"`])\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.separator.key-value.html.vue\"}},\"end\":\"(?=(\\\\s|>|\\\\/>))\",\"patterns\":[{\"begin\":\"(?=[^'\\\"`])\",\"end\":\"(?=(\\\\s|>|\\\\/>))\",\"name\":\"source.ts.embedded.html.vue\",\"patterns\":[{\"include\":\"source.ts#expression\"}]}]}]},\"vue-directives-generic-attr\":{\"begin\":\"\\\\b(generic)\\\\s*(=)\",\"captures\":{\"1\":{\"name\":\"entity.other.attribute-name.html.vue\"},\"2\":{\"name\":\"punctuation.separator.key-value.html.vue\"}},\"end\":\"(?<='|\\\")\",\"name\":\"meta.attribute.generic.vue\",\"patterns\":[{\"begin\":\"('|\\\")\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.begin.html.vue\"}},\"comment\":\"https://github.com/microsoft/vscode/blob/fd4346210f59135fad81a8b8c4cea7bf5a9ca6b4/extensions/typescript-basics/syntaxes/TypeScript.tmLanguage.json#L4002-L4020\",\"end\":\"(\\\\1)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.end.html.vue\"}},\"name\":\"meta.type.parameters.vue\",\"patterns\":[{\"include\":\"source.ts#comment\"},{\"match\":\"(?<![_$0-9A-Za-z])(?:(?<=\\\\.\\\\.\\\\.)|(?<!\\\\.))(extends|in|out)(?![_$0-9A-Za-z])(?:(?=\\\\.\\\\.\\\\.)|(?!\\\\.))\",\"name\":\"storage.modifier.ts\"},{\"include\":\"source.ts#type\"},{\"include\":\"source.ts#punctuation-comma\"},{\"match\":\"(=)(?!>)\",\"name\":\"keyword.operator.assignment.ts\"}]}]},\"vue-directives-original\":{\"begin\":\"(?:(?:(v-[\\\\w-]+)(:)?)|([:\\\\.])|(@)|(#))(?:(?:(\\\\[)([^\\\\]]*)(\\\\]))|([\\\\w-]+))?\",\"beginCaptures\":{\"1\":{\"name\":\"entity.other.attribute-name.html.vue\"},\"2\":{\"name\":\"punctuation.separator.key-value.html.vue\"},\"3\":{\"name\":\"punctuation.attribute-shorthand.bind.html.vue\"},\"4\":{\"name\":\"punctuation.attribute-shorthand.event.html.vue\"},\"5\":{\"name\":\"punctuation.attribute-shorthand.slot.html.vue\"},\"6\":{\"name\":\"punctuation.separator.key-value.html.vue\"},\"7\":{\"name\":\"source.ts.embedded.html.vue\",\"patterns\":[{\"include\":\"source.ts#expression\"}]},\"8\":{\"name\":\"punctuation.separator.key-value.html.vue\"},\"9\":{\"name\":\"entity.other.attribute-name.html.vue\"}},\"end\":\"(?=\\\\s*[^=\\\\s])\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.end.html.vue\"}},\"name\":\"meta.attribute.directive.vue\",\"patterns\":[{\"1\":{\"name\":\"punctuation.separator.key-value.html.vue\"},\"2\":{\"name\":\"entity.other.attribute-name.html.vue\"},\"match\":\"(\\\\.)([\\\\w-]*)\"},{\"include\":\"#vue-directives-expression\"}]},\"vue-directives-style-attr\":{\"begin\":\"\\\\b(style)\\\\s*(=)\",\"captures\":{\"1\":{\"name\":\"entity.other.attribute-name.html.vue\"},\"2\":{\"name\":\"punctuation.separator.key-value.html.vue\"}},\"end\":\"(?<='|\\\")\",\"name\":\"meta.attribute.style.vue\",\"patterns\":[{\"begin\":\"('|\\\")\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.begin.html.vue\"}},\"comment\":\"Copy from source.css#rule-list-innards\",\"end\":\"(\\\\1)\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.string.end.html.vue\"}},\"name\":\"source.css.embedded.html.vue\",\"patterns\":[{\"include\":\"source.css#comment-block\"},{\"include\":\"source.css#escapes\"},{\"include\":\"source.css#font-features\"},{\"match\":\"(?<![\\\\w-])--(?:[-a-zA-Z_]|[^\\\\x00-\\\\x7F])(?:[-a-zA-Z0-9_]|[^\\\\x00-\\\\x7F]|\\\\\\\\(?:[0-9a-fA-F]{1,6}|.))*\",\"name\":\"variable.css\"},{\"begin\":\"(?<![-a-zA-Z])(?=[-a-zA-Z])\",\"end\":\"$|(?![-a-zA-Z])\",\"name\":\"meta.property-name.css\",\"patterns\":[{\"include\":\"source.css#property-names\"}]},{\"begin\":\"(:)\\\\s*\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.separator.key-value.css\"}},\"comment\":\"Modify end to fix #199. TODO: handle ' character.\",\"contentName\":\"meta.property-value.css\",\"end\":\"\\\\s*(;)|\\\\s*(?='|\\\")\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.terminator.rule.css\"}},\"patterns\":[{\"include\":\"source.css#comment-block\"},{\"include\":\"source.css#property-values\"}]},{\"match\":\";\",\"name\":\"punctuation.terminator.rule.css\"}]}]},\"vue-interpolations\":{\"patterns\":[{\"begin\":\"(\\\\{\\\\{)\",\"beginCaptures\":{\"1\":{\"name\":\"punctuation.definition.interpolation.begin.html.vue\"}},\"end\":\"(\\\\}\\\\})\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.definition.interpolation.end.html.vue\"}},\"name\":\"expression.embedded.vue\",\"patterns\":[{\"begin\":\"\\\\G\",\"end\":\"(?=\\\\}\\\\})\",\"name\":\"source.ts.embedded.html.vue\",\"patterns\":[{\"include\":\"source.ts#expression\"}]}]}]}},\"scopeName\":\"source.vue\",\"embeddedLangs\":[\"html\",\"css\",\"javascript\",\"typescript\",\"json\",\"html-derivative\",\"markdown-vue\",\"vue-directives\",\"vue-interpolations\",\"vue-sfc-style-variable-injection\"],\"embeddedLangsLazy\":[\"markdown\",\"pug\",\"stylus\",\"sass\",\"scss\",\"less\",\"jsx\",\"tsx\",\"coffee\",\"jsonc\",\"json5\",\"yaml\",\"toml\",\"graphql\"]}"));

const langVue = [
  ...html,
  ...css,
  ...javascript,
  ...typescript,
  ...json,
  ...html_derivative,
  ...markdown_vue,
  ...vue_directives,
  ...vue_interpolations,
  ...vue_sfc_style_variable_injection,
  lang
];

/* Theme: dark-plus */
const themeDark = Object.freeze(JSON.parse("{\"colors\":{\"actionBar.toggledBackground\":\"#383a49\",\"activityBarBadge.background\":\"#007ACC\",\"checkbox.border\":\"#6B6B6B\",\"editor.background\":\"#1E1E1E\",\"editor.foreground\":\"#D4D4D4\",\"editor.inactiveSelectionBackground\":\"#3A3D41\",\"editor.selectionHighlightBackground\":\"#ADD6FF26\",\"editorIndentGuide.activeBackground\":\"#707070\",\"editorIndentGuide.background\":\"#404040\",\"input.placeholderForeground\":\"#A6A6A6\",\"list.activeSelectionIconForeground\":\"#FFF\",\"list.dropBackground\":\"#383B3D\",\"menu.background\":\"#252526\",\"menu.border\":\"#454545\",\"menu.foreground\":\"#CCCCCC\",\"menu.separatorBackground\":\"#454545\",\"ports.iconRunningProcessForeground\":\"#369432\",\"sideBarSectionHeader.background\":\"#0000\",\"sideBarSectionHeader.border\":\"#ccc3\",\"sideBarTitle.foreground\":\"#BBBBBB\",\"statusBarItem.remoteBackground\":\"#16825D\",\"statusBarItem.remoteForeground\":\"#FFF\",\"tab.lastPinnedBorder\":\"#ccc3\",\"terminal.inactiveSelectionBackground\":\"#3A3D41\",\"widget.border\":\"#303031\"},\"displayName\":\"Dark Plus\",\"name\":\"dark-plus\",\"semanticHighlighting\":true,\"semanticTokenColors\":{\"customLiteral\":\"#DCDCAA\",\"newOperator\":\"#C586C0\",\"numberLiteral\":\"#b5cea8\",\"stringLiteral\":\"#ce9178\"},\"tokenColors\":[{\"scope\":[\"meta.embedded\",\"source.groovy.embedded\",\"string meta.image.inline.markdown\",\"variable.legacy.builtin.python\"],\"settings\":{\"foreground\":\"#D4D4D4\"}},{\"scope\":\"emphasis\",\"settings\":{\"fontStyle\":\"italic\"}},{\"scope\":\"strong\",\"settings\":{\"fontStyle\":\"bold\"}},{\"scope\":\"header\",\"settings\":{\"foreground\":\"#000080\"}},{\"scope\":\"comment\",\"settings\":{\"foreground\":\"#6A9955\"}},{\"scope\":\"constant.language\",\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":[\"constant.numeric\",\"variable.other.enummember\",\"keyword.operator.plus.exponent\",\"keyword.operator.minus.exponent\"],\"settings\":{\"foreground\":\"#b5cea8\"}},{\"scope\":\"constant.regexp\",\"settings\":{\"foreground\":\"#646695\"}},{\"scope\":\"entity.name.tag\",\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":\"entity.name.tag.css\",\"settings\":{\"foreground\":\"#d7ba7d\"}},{\"scope\":\"entity.other.attribute-name\",\"settings\":{\"foreground\":\"#9cdcfe\"}},{\"scope\":[\"entity.other.attribute-name.class.css\",\"entity.other.attribute-name.class.mixin.css\",\"entity.other.attribute-name.id.css\",\"entity.other.attribute-name.parent-selector.css\",\"entity.other.attribute-name.pseudo-class.css\",\"entity.other.attribute-name.pseudo-element.css\",\"source.css.less entity.other.attribute-name.id\",\"entity.other.attribute-name.scss\"],\"settings\":{\"foreground\":\"#d7ba7d\"}},{\"scope\":\"invalid\",\"settings\":{\"foreground\":\"#f44747\"}},{\"scope\":\"markup.underline\",\"settings\":{\"fontStyle\":\"underline\"}},{\"scope\":\"markup.bold\",\"settings\":{\"fontStyle\":\"bold\",\"foreground\":\"#569cd6\"}},{\"scope\":\"markup.heading\",\"settings\":{\"fontStyle\":\"bold\",\"foreground\":\"#569cd6\"}},{\"scope\":\"markup.italic\",\"settings\":{\"fontStyle\":\"italic\"}},{\"scope\":\"markup.strikethrough\",\"settings\":{\"fontStyle\":\"strikethrough\"}},{\"scope\":\"markup.inserted\",\"settings\":{\"foreground\":\"#b5cea8\"}},{\"scope\":\"markup.deleted\",\"settings\":{\"foreground\":\"#ce9178\"}},{\"scope\":\"markup.changed\",\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":\"punctuation.definition.quote.begin.markdown\",\"settings\":{\"foreground\":\"#6A9955\"}},{\"scope\":\"punctuation.definition.list.begin.markdown\",\"settings\":{\"foreground\":\"#6796e6\"}},{\"scope\":\"markup.inline.raw\",\"settings\":{\"foreground\":\"#ce9178\"}},{\"scope\":\"punctuation.definition.tag\",\"settings\":{\"foreground\":\"#808080\"}},{\"scope\":[\"meta.preprocessor\",\"entity.name.function.preprocessor\"],\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":\"meta.preprocessor.string\",\"settings\":{\"foreground\":\"#ce9178\"}},{\"scope\":\"meta.preprocessor.numeric\",\"settings\":{\"foreground\":\"#b5cea8\"}},{\"scope\":\"meta.structure.dictionary.key.python\",\"settings\":{\"foreground\":\"#9cdcfe\"}},{\"scope\":\"meta.diff.header\",\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":\"storage\",\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":\"storage.type\",\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":[\"storage.modifier\",\"keyword.operator.noexcept\"],\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":[\"string\",\"meta.embedded.assembly\"],\"settings\":{\"foreground\":\"#ce9178\"}},{\"scope\":\"string.tag\",\"settings\":{\"foreground\":\"#ce9178\"}},{\"scope\":\"string.value\",\"settings\":{\"foreground\":\"#ce9178\"}},{\"scope\":\"string.regexp\",\"settings\":{\"foreground\":\"#d16969\"}},{\"scope\":[\"punctuation.definition.template-expression.begin\",\"punctuation.definition.template-expression.end\",\"punctuation.section.embedded\"],\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":[\"meta.template.expression\"],\"settings\":{\"foreground\":\"#d4d4d4\"}},{\"scope\":[\"support.type.vendored.property-name\",\"support.type.property-name\",\"variable.css\",\"variable.scss\",\"variable.other.less\",\"source.coffee.embedded\"],\"settings\":{\"foreground\":\"#9cdcfe\"}},{\"scope\":\"keyword\",\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":\"keyword.control\",\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":\"keyword.operator\",\"settings\":{\"foreground\":\"#d4d4d4\"}},{\"scope\":[\"keyword.operator.new\",\"keyword.operator.expression\",\"keyword.operator.cast\",\"keyword.operator.sizeof\",\"keyword.operator.alignof\",\"keyword.operator.typeid\",\"keyword.operator.alignas\",\"keyword.operator.instanceof\",\"keyword.operator.logical.python\",\"keyword.operator.wordlike\"],\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":\"keyword.other.unit\",\"settings\":{\"foreground\":\"#b5cea8\"}},{\"scope\":[\"punctuation.section.embedded.begin.php\",\"punctuation.section.embedded.end.php\"],\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":\"support.function.git-rebase\",\"settings\":{\"foreground\":\"#9cdcfe\"}},{\"scope\":\"constant.sha.git-rebase\",\"settings\":{\"foreground\":\"#b5cea8\"}},{\"scope\":[\"storage.modifier.import.java\",\"variable.language.wildcard.java\",\"storage.modifier.package.java\"],\"settings\":{\"foreground\":\"#d4d4d4\"}},{\"scope\":\"variable.language\",\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":[\"entity.name.function\",\"support.function\",\"support.constant.handlebars\",\"source.powershell variable.other.member\",\"entity.name.operator.custom-literal\"],\"settings\":{\"foreground\":\"#DCDCAA\"}},{\"scope\":[\"support.class\",\"support.type\",\"entity.name.type\",\"entity.name.namespace\",\"entity.other.attribute\",\"entity.name.scope-resolution\",\"entity.name.class\",\"storage.type.numeric.go\",\"storage.type.byte.go\",\"storage.type.boolean.go\",\"storage.type.string.go\",\"storage.type.uintptr.go\",\"storage.type.error.go\",\"storage.type.rune.go\",\"storage.type.cs\",\"storage.type.generic.cs\",\"storage.type.modifier.cs\",\"storage.type.variable.cs\",\"storage.type.annotation.java\",\"storage.type.generic.java\",\"storage.type.java\",\"storage.type.object.array.java\",\"storage.type.primitive.array.java\",\"storage.type.primitive.java\",\"storage.type.token.java\",\"storage.type.groovy\",\"storage.type.annotation.groovy\",\"storage.type.parameters.groovy\",\"storage.type.generic.groovy\",\"storage.type.object.array.groovy\",\"storage.type.primitive.array.groovy\",\"storage.type.primitive.groovy\"],\"settings\":{\"foreground\":\"#4EC9B0\"}},{\"scope\":[\"meta.type.cast.expr\",\"meta.type.new.expr\",\"support.constant.math\",\"support.constant.dom\",\"support.constant.json\",\"entity.other.inherited-class\"],\"settings\":{\"foreground\":\"#4EC9B0\"}},{\"scope\":[\"keyword.control\",\"source.cpp keyword.operator.new\",\"keyword.operator.delete\",\"keyword.other.using\",\"keyword.other.directive.using\",\"keyword.other.operator\",\"entity.name.operator\"],\"settings\":{\"foreground\":\"#C586C0\"}},{\"scope\":[\"variable\",\"meta.definition.variable.name\",\"support.variable\",\"entity.name.variable\",\"constant.other.placeholder\"],\"settings\":{\"foreground\":\"#9CDCFE\"}},{\"scope\":[\"variable.other.constant\",\"variable.other.enummember\"],\"settings\":{\"foreground\":\"#4FC1FF\"}},{\"scope\":[\"meta.object-literal.key\"],\"settings\":{\"foreground\":\"#9CDCFE\"}},{\"scope\":[\"support.constant.property-value\",\"support.constant.font-name\",\"support.constant.media-type\",\"support.constant.media\",\"constant.other.color.rgb-value\",\"constant.other.rgb-value\",\"support.constant.color\"],\"settings\":{\"foreground\":\"#CE9178\"}},{\"scope\":[\"punctuation.definition.group.regexp\",\"punctuation.definition.group.assertion.regexp\",\"punctuation.definition.character-class.regexp\",\"punctuation.character.set.begin.regexp\",\"punctuation.character.set.end.regexp\",\"keyword.operator.negation.regexp\",\"support.other.parenthesis.regexp\"],\"settings\":{\"foreground\":\"#CE9178\"}},{\"scope\":[\"constant.character.character-class.regexp\",\"constant.other.character-class.set.regexp\",\"constant.other.character-class.regexp\",\"constant.character.set.regexp\"],\"settings\":{\"foreground\":\"#d16969\"}},{\"scope\":[\"keyword.operator.or.regexp\",\"keyword.control.anchor.regexp\"],\"settings\":{\"foreground\":\"#DCDCAA\"}},{\"scope\":\"keyword.operator.quantifier.regexp\",\"settings\":{\"foreground\":\"#d7ba7d\"}},{\"scope\":[\"constant.character\",\"constant.other.option\"],\"settings\":{\"foreground\":\"#569cd6\"}},{\"scope\":\"constant.character.escape\",\"settings\":{\"foreground\":\"#d7ba7d\"}},{\"scope\":\"entity.name.label\",\"settings\":{\"foreground\":\"#C8C8C8\"}}],\"type\":\"dark\"}"));

/* Theme: light-plus */
const themeLight = Object.freeze(JSON.parse("{\"colors\":{\"actionBar.toggledBackground\":\"#dddddd\",\"activityBarBadge.background\":\"#007ACC\",\"checkbox.border\":\"#919191\",\"editor.background\":\"#FFFFFF\",\"editor.foreground\":\"#000000\",\"editor.inactiveSelectionBackground\":\"#E5EBF1\",\"editor.selectionHighlightBackground\":\"#ADD6FF80\",\"editorIndentGuide.activeBackground\":\"#939393\",\"editorIndentGuide.background\":\"#D3D3D3\",\"editorSuggestWidget.background\":\"#F3F3F3\",\"input.placeholderForeground\":\"#767676\",\"list.activeSelectionIconForeground\":\"#FFF\",\"list.focusAndSelectionOutline\":\"#90C2F9\",\"list.hoverBackground\":\"#E8E8E8\",\"menu.border\":\"#D4D4D4\",\"notebook.cellBorderColor\":\"#E8E8E8\",\"notebook.selectedCellBackground\":\"#c8ddf150\",\"ports.iconRunningProcessForeground\":\"#369432\",\"searchEditor.textInputBorder\":\"#CECECE\",\"settings.numberInputBorder\":\"#CECECE\",\"settings.textInputBorder\":\"#CECECE\",\"sideBarSectionHeader.background\":\"#0000\",\"sideBarSectionHeader.border\":\"#61616130\",\"sideBarTitle.foreground\":\"#6F6F6F\",\"statusBarItem.errorBackground\":\"#c72e0f\",\"statusBarItem.remoteBackground\":\"#16825D\",\"statusBarItem.remoteForeground\":\"#FFF\",\"tab.lastPinnedBorder\":\"#61616130\",\"terminal.inactiveSelectionBackground\":\"#E5EBF1\",\"widget.border\":\"#d4d4d4\"},\"displayName\":\"Light Plus\",\"name\":\"light-plus\",\"semanticHighlighting\":true,\"semanticTokenColors\":{\"customLiteral\":\"#795E26\",\"newOperator\":\"#AF00DB\",\"numberLiteral\":\"#098658\",\"stringLiteral\":\"#a31515\"},\"tokenColors\":[{\"scope\":[\"meta.embedded\",\"source.groovy.embedded\",\"string meta.image.inline.markdown\",\"variable.legacy.builtin.python\"],\"settings\":{\"foreground\":\"#000000ff\"}},{\"scope\":\"emphasis\",\"settings\":{\"fontStyle\":\"italic\"}},{\"scope\":\"strong\",\"settings\":{\"fontStyle\":\"bold\"}},{\"scope\":\"meta.diff.header\",\"settings\":{\"foreground\":\"#000080\"}},{\"scope\":\"comment\",\"settings\":{\"foreground\":\"#008000\"}},{\"scope\":\"constant.language\",\"settings\":{\"foreground\":\"#0000ff\"}},{\"scope\":[\"constant.numeric\",\"variable.other.enummember\",\"keyword.operator.plus.exponent\",\"keyword.operator.minus.exponent\"],\"settings\":{\"foreground\":\"#098658\"}},{\"scope\":\"constant.regexp\",\"settings\":{\"foreground\":\"#811f3f\"}},{\"scope\":\"entity.name.tag\",\"settings\":{\"foreground\":\"#800000\"}},{\"scope\":\"entity.name.selector\",\"settings\":{\"foreground\":\"#800000\"}},{\"scope\":\"entity.other.attribute-name\",\"settings\":{\"foreground\":\"#e50000\"}},{\"scope\":[\"entity.other.attribute-name.class.css\",\"entity.other.attribute-name.class.mixin.css\",\"entity.other.attribute-name.id.css\",\"entity.other.attribute-name.parent-selector.css\",\"entity.other.attribute-name.pseudo-class.css\",\"entity.other.attribute-name.pseudo-element.css\",\"source.css.less entity.other.attribute-name.id\",\"entity.other.attribute-name.scss\"],\"settings\":{\"foreground\":\"#800000\"}},{\"scope\":\"invalid\",\"settings\":{\"foreground\":\"#cd3131\"}},{\"scope\":\"markup.underline\",\"settings\":{\"fontStyle\":\"underline\"}},{\"scope\":\"markup.bold\",\"settings\":{\"fontStyle\":\"bold\",\"foreground\":\"#000080\"}},{\"scope\":\"markup.heading\",\"settings\":{\"fontStyle\":\"bold\",\"foreground\":\"#800000\"}},{\"scope\":\"markup.italic\",\"settings\":{\"fontStyle\":\"italic\"}},{\"scope\":\"markup.strikethrough\",\"settings\":{\"fontStyle\":\"strikethrough\"}},{\"scope\":\"markup.inserted\",\"settings\":{\"foreground\":\"#098658\"}},{\"scope\":\"markup.deleted\",\"settings\":{\"foreground\":\"#a31515\"}},{\"scope\":\"markup.changed\",\"settings\":{\"foreground\":\"#0451a5\"}},{\"scope\":[\"punctuation.definition.quote.begin.markdown\",\"punctuation.definition.list.begin.markdown\"],\"settings\":{\"foreground\":\"#0451a5\"}},{\"scope\":\"markup.inline.raw\",\"settings\":{\"foreground\":\"#800000\"}},{\"scope\":\"punctuation.definition.tag\",\"settings\":{\"foreground\":\"#800000\"}},{\"scope\":[\"meta.preprocessor\",\"entity.name.function.preprocessor\"],\"settings\":{\"foreground\":\"#0000ff\"}},{\"scope\":\"meta.preprocessor.string\",\"settings\":{\"foreground\":\"#a31515\"}},{\"scope\":\"meta.preprocessor.numeric\",\"settings\":{\"foreground\":\"#098658\"}},{\"scope\":\"meta.structure.dictionary.key.python\",\"settings\":{\"foreground\":\"#0451a5\"}},{\"scope\":\"storage\",\"settings\":{\"foreground\":\"#0000ff\"}},{\"scope\":\"storage.type\",\"settings\":{\"foreground\":\"#0000ff\"}},{\"scope\":[\"storage.modifier\",\"keyword.operator.noexcept\"],\"settings\":{\"foreground\":\"#0000ff\"}},{\"scope\":[\"string\",\"meta.embedded.assembly\"],\"settings\":{\"foreground\":\"#a31515\"}},{\"scope\":[\"string.comment.buffered.block.pug\",\"string.quoted.pug\",\"string.interpolated.pug\",\"string.unquoted.plain.in.yaml\",\"string.unquoted.plain.out.yaml\",\"string.unquoted.block.yaml\",\"string.quoted.single.yaml\",\"string.quoted.double.xml\",\"string.quoted.single.xml\",\"string.unquoted.cdata.xml\",\"string.quoted.double.html\",\"string.quoted.single.html\",\"string.unquoted.html\",\"string.quoted.single.handlebars\",\"string.quoted.double.handlebars\"],\"settings\":{\"foreground\":\"#0000ff\"}},{\"scope\":\"string.regexp\",\"settings\":{\"foreground\":\"#811f3f\"}},{\"scope\":[\"punctuation.definition.template-expression.begin\",\"punctuation.definition.template-expression.end\",\"punctuation.section.embedded\"],\"settings\":{\"foreground\":\"#0000ff\"}},{\"scope\":[\"meta.template.expression\"],\"settings\":{\"foreground\":\"#000000\"}},{\"scope\":[\"support.constant.property-value\",\"support.constant.font-name\",\"support.constant.media-type\",\"support.constant.media\",\"constant.other.color.rgb-value\",\"constant.other.rgb-value\",\"support.constant.color\"],\"settings\":{\"foreground\":\"#0451a5\"}},{\"scope\":[\"support.type.vendored.property-name\",\"support.type.property-name\",\"variable.css\",\"variable.scss\",\"variable.other.less\",\"source.coffee.embedded\"],\"settings\":{\"foreground\":\"#e50000\"}},{\"scope\":[\"support.type.property-name.json\"],\"settings\":{\"foreground\":\"#0451a5\"}},{\"scope\":\"keyword\",\"settings\":{\"foreground\":\"#0000ff\"}},{\"scope\":\"keyword.control\",\"settings\":{\"foreground\":\"#0000ff\"}},{\"scope\":\"keyword.operator\",\"settings\":{\"foreground\":\"#000000\"}},{\"scope\":[\"keyword.operator.new\",\"keyword.operator.expression\",\"keyword.operator.cast\",\"keyword.operator.sizeof\",\"keyword.operator.alignof\",\"keyword.operator.typeid\",\"keyword.operator.alignas\",\"keyword.operator.instanceof\",\"keyword.operator.logical.python\",\"keyword.operator.wordlike\"],\"settings\":{\"foreground\":\"#0000ff\"}},{\"scope\":\"keyword.other.unit\",\"settings\":{\"foreground\":\"#098658\"}},{\"scope\":[\"punctuation.section.embedded.begin.php\",\"punctuation.section.embedded.end.php\"],\"settings\":{\"foreground\":\"#800000\"}},{\"scope\":\"support.function.git-rebase\",\"settings\":{\"foreground\":\"#0451a5\"}},{\"scope\":\"constant.sha.git-rebase\",\"settings\":{\"foreground\":\"#098658\"}},{\"scope\":[\"storage.modifier.import.java\",\"variable.language.wildcard.java\",\"storage.modifier.package.java\"],\"settings\":{\"foreground\":\"#000000\"}},{\"scope\":\"variable.language\",\"settings\":{\"foreground\":\"#0000ff\"}},{\"scope\":[\"entity.name.function\",\"support.function\",\"support.constant.handlebars\",\"source.powershell variable.other.member\",\"entity.name.operator.custom-literal\"],\"settings\":{\"foreground\":\"#795E26\"}},{\"scope\":[\"support.class\",\"support.type\",\"entity.name.type\",\"entity.name.namespace\",\"entity.other.attribute\",\"entity.name.scope-resolution\",\"entity.name.class\",\"storage.type.numeric.go\",\"storage.type.byte.go\",\"storage.type.boolean.go\",\"storage.type.string.go\",\"storage.type.uintptr.go\",\"storage.type.error.go\",\"storage.type.rune.go\",\"storage.type.cs\",\"storage.type.generic.cs\",\"storage.type.modifier.cs\",\"storage.type.variable.cs\",\"storage.type.annotation.java\",\"storage.type.generic.java\",\"storage.type.java\",\"storage.type.object.array.java\",\"storage.type.primitive.array.java\",\"storage.type.primitive.java\",\"storage.type.token.java\",\"storage.type.groovy\",\"storage.type.annotation.groovy\",\"storage.type.parameters.groovy\",\"storage.type.generic.groovy\",\"storage.type.object.array.groovy\",\"storage.type.primitive.array.groovy\",\"storage.type.primitive.groovy\"],\"settings\":{\"foreground\":\"#267f99\"}},{\"scope\":[\"meta.type.cast.expr\",\"meta.type.new.expr\",\"support.constant.math\",\"support.constant.dom\",\"support.constant.json\",\"entity.other.inherited-class\"],\"settings\":{\"foreground\":\"#267f99\"}},{\"scope\":[\"keyword.control\",\"source.cpp keyword.operator.new\",\"source.cpp keyword.operator.delete\",\"keyword.other.using\",\"keyword.other.directive.using\",\"keyword.other.operator\",\"entity.name.operator\"],\"settings\":{\"foreground\":\"#AF00DB\"}},{\"scope\":[\"variable\",\"meta.definition.variable.name\",\"support.variable\",\"entity.name.variable\",\"constant.other.placeholder\"],\"settings\":{\"foreground\":\"#001080\"}},{\"scope\":[\"variable.other.constant\",\"variable.other.enummember\"],\"settings\":{\"foreground\":\"#0070C1\"}},{\"scope\":[\"meta.object-literal.key\"],\"settings\":{\"foreground\":\"#001080\"}},{\"scope\":[\"support.constant.property-value\",\"support.constant.font-name\",\"support.constant.media-type\",\"support.constant.media\",\"constant.other.color.rgb-value\",\"constant.other.rgb-value\",\"support.constant.color\"],\"settings\":{\"foreground\":\"#0451a5\"}},{\"scope\":[\"punctuation.definition.group.regexp\",\"punctuation.definition.group.assertion.regexp\",\"punctuation.definition.character-class.regexp\",\"punctuation.character.set.begin.regexp\",\"punctuation.character.set.end.regexp\",\"keyword.operator.negation.regexp\",\"support.other.parenthesis.regexp\"],\"settings\":{\"foreground\":\"#d16969\"}},{\"scope\":[\"constant.character.character-class.regexp\",\"constant.other.character-class.set.regexp\",\"constant.other.character-class.regexp\",\"constant.character.set.regexp\"],\"settings\":{\"foreground\":\"#811f3f\"}},{\"scope\":\"keyword.operator.quantifier.regexp\",\"settings\":{\"foreground\":\"#000000\"}},{\"scope\":[\"keyword.operator.or.regexp\",\"keyword.control.anchor.regexp\"],\"settings\":{\"foreground\":\"#EE0000\"}},{\"scope\":[\"constant.character\",\"constant.other.option\"],\"settings\":{\"foreground\":\"#0000ff\"}},{\"scope\":\"constant.character.escape\",\"settings\":{\"foreground\":\"#EE0000\"}},{\"scope\":\"entity.name.label\",\"settings\":{\"foreground\":\"#000000\"}}],\"type\":\"light\"}"));

async function registerHighlighter() {
  const highlighter = await createHighlighterCore({
    themes: [themeDark, themeLight],
    langs: [langVue],
    loadWasm: import('./wasm-CR5DIDIU.js')
  });
  languages.register({ id: "vue" });
  shikiToMonaco(highlighter, monaco);
  return {
    light: themeLight.name,
    dark: themeDark.name
  };
}

export { registerHighlighter };
