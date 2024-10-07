import { Component } from 'vue';
import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { ComputedRef } from 'vue';
import { CreateComponentPublicInstanceWithMixins } from 'vue';
import * as defaultCompiler from 'vue/compiler-sfc';
import { DefineComponent } from 'vue';
import { editor } from 'monaco-editor-core';
import { GlobalComponents } from 'vue';
import { GlobalDirectives } from 'vue';
import { version as languageToolsVersion } from '@vue/language-service/package.json';
import type * as monaco from 'monaco-editor-core';
import { PublicProps } from 'vue';
import { Ref } from 'vue';
import { SFCAsyncStyleCompileOptions } from 'vue/compiler-sfc';
import { SFCScriptCompileOptions } from 'vue/compiler-sfc';
import { SFCTemplateCompileOptions } from 'vue/compiler-sfc';
import { ShallowRef } from 'vue';
import { ToRefs } from 'vue';
import { UnwrapRef } from 'vue';

declare type __VLS_PublicProps = {
    modelValue?: boolean;
} & typeof __VLS_typeProps;

declare let __VLS_typeProps: ReplProps;

export declare function compileFile(store: Store, { filename, code, compiled }: File_2): Promise<(string | Error)[]>;

declare type EditorComponentType = Component<EditorProps>;

declare type EditorMode = 'js' | 'css' | 'ssr';

declare interface EditorProps {
    value: string;
    filename: string;
    readonly?: boolean;
    mode?: EditorMode;
}

declare class File_2 {
    filename: string;
    code: string;
    hidden: boolean;
    compiled: {
        js: string;
        css: string;
        ssr: string;
    };
    editorViewState: editor.ICodeEditorViewState | null;
    constructor(filename: string, code?: string, hidden?: boolean);
    get language(): "css" | "vue" | "typescript" | "html" | "javascript";
}
export { File_2 as File }

export declare interface ImportMap {
    imports?: Record<string, string | undefined>;
    scopes?: Record<string, Record<string, string>>;
}

export { languageToolsVersion }

export declare function mergeImportMap(a: ImportMap, b: ImportMap): ImportMap;

export declare type OutputModes = 'preview' | EditorMode;

export declare const Preview: DefineComponent<    {
show: boolean;
ssr: boolean;
}, {
reload: typeof reload_2;
container: Readonly<ShallowRef<HTMLDivElement | null>>;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{
show: boolean;
ssr: boolean;
}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {
container: HTMLDivElement;
}, any>;

/**
 * Reload the preview iframe
 */
declare function reload(): void;

/**
 * Reload the preview iframe
 */
declare function reload_2(): void;

export declare const Repl: DefineComponent<__VLS_PublicProps, {
reload: typeof reload;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
"update:modelValue": (modelValue: boolean) => any;
}, string, PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
"onUpdate:modelValue"?: ((modelValue: boolean) => any) | undefined;
}>, {
ssr: boolean;
layout: "horizontal" | "vertical";
store: Store;
splitPaneOptions: {
codeTogglerText?: string;
outputTogglerText?: string;
};
theme: "dark" | "light";
previewTheme: boolean;
autoResize: boolean;
showCompileOutput: boolean;
showImportMap: boolean;
showTsConfig: boolean;
clearConsole: boolean;
layoutReverse: boolean;
previewOptions: {
headHTML?: string;
bodyHTML?: string;
placeholderHTML?: string;
customCode?: {
importCode?: string;
useCode?: string;
};
showRuntimeError?: boolean;
showRuntimeWarning?: boolean;
};
editorOptions: {
showErrorText?: string | false;
autoSaveText?: string | false;
monacoOptions?: monaco.editor.IStandaloneEditorConstructionOptions;
};
}, {}, {}, {}, string, ComponentProvideOptions, false, {
output: CreateComponentPublicInstanceWithMixins<Readonly<{
editorComponent: EditorComponentType;
showCompileOutput?: boolean;
ssr: boolean;
}> & Readonly<{}>, {
reload: () => void;
previewRef: Readonly<ShallowRef<CreateComponentPublicInstanceWithMixins<Readonly<{
show: boolean;
ssr: boolean;
}> & Readonly<{}>, {
reload: () => void;
container: Readonly<ShallowRef<HTMLDivElement | null>>;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, PublicProps, {}, false, {}, {}, GlobalComponents, GlobalDirectives, string, {
container: HTMLDivElement;
}, any, ComponentProvideOptions, {
P: {};
B: {};
D: {};
C: {};
M: {};
Defaults: {};
}, Readonly<{
show: boolean;
ssr: boolean;
}> & Readonly<{}>, {
reload: () => void;
container: Readonly<ShallowRef<HTMLDivElement | null>>;
}, {}, {}, {}, {}> | null>>;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, PublicProps, {}, false, {}, {}, GlobalComponents, GlobalDirectives, string, {
preview: CreateComponentPublicInstanceWithMixins<Readonly<{
show: boolean;
ssr: boolean;
}> & Readonly<{}>, {
reload: () => void;
container: Readonly<ShallowRef<HTMLDivElement | null>>;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, PublicProps, {}, false, {}, {}, GlobalComponents, GlobalDirectives, string, {
container: HTMLDivElement;
}, any, ComponentProvideOptions, {
P: {};
B: {};
D: {};
C: {};
M: {};
Defaults: {};
}, Readonly<{
show: boolean;
ssr: boolean;
}> & Readonly<{}>, {
reload: () => void;
container: Readonly<ShallowRef<HTMLDivElement | null>>;
}, {}, {}, {}, {}> | null;
}, any, ComponentProvideOptions, {
P: {};
B: {};
D: {};
C: {};
M: {};
Defaults: {};
}, Readonly<{
editorComponent: EditorComponentType;
showCompileOutput?: boolean;
ssr: boolean;
}> & Readonly<{}>, {
reload: () => void;
previewRef: Readonly<ShallowRef<CreateComponentPublicInstanceWithMixins<Readonly<{
show: boolean;
ssr: boolean;
}> & Readonly<{}>, {
reload: () => void;
container: Readonly<ShallowRef<HTMLDivElement | null>>;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, PublicProps, {}, false, {}, {}, GlobalComponents, GlobalDirectives, string, {
container: HTMLDivElement;
}, any, ComponentProvideOptions, {
P: {};
B: {};
D: {};
C: {};
M: {};
Defaults: {};
}, Readonly<{
show: boolean;
ssr: boolean;
}> & Readonly<{}>, {
reload: () => void;
container: Readonly<ShallowRef<HTMLDivElement | null>>;
}, {}, {}, {}, {}> | null>>;
}, {}, {}, {}, {}> | null;
}, any>;

export declare interface ReplProps {
    theme?: 'dark' | 'light';
    previewTheme?: boolean;
    editor: EditorComponentType;
    store?: Store;
    autoResize?: boolean;
    showCompileOutput?: boolean;
    showImportMap?: boolean;
    showTsConfig?: boolean;
    clearConsole?: boolean;
    layout?: 'horizontal' | 'vertical';
    layoutReverse?: boolean;
    ssr?: boolean;
    previewOptions?: {
        headHTML?: string;
        bodyHTML?: string;
        placeholderHTML?: string;
        customCode?: {
            importCode?: string;
            useCode?: string;
        };
        showRuntimeError?: boolean;
        showRuntimeWarning?: boolean;
    };
    editorOptions?: {
        showErrorText?: string | false;
        autoSaveText?: string | false;
        monacoOptions?: monaco.editor.IStandaloneEditorConstructionOptions;
    };
    splitPaneOptions?: {
        codeTogglerText?: string;
        outputTogglerText?: string;
    };
}

export declare interface ReplStore extends UnwrapRef<StoreState> {
    activeFile: File_2;
    /** Loading compiler */
    loading: boolean;
    init(): void;
    setActive(filename: string): void;
    addFile(filename: string | File_2): void;
    deleteFile(filename: string): void;
    renameFile(oldFilename: string, newFilename: string): void;
    getImportMap(): ImportMap;
    getTsConfig(): Record<string, any>;
    serialize(): string;
    deserialize(serializedState: string): void;
    getFiles(): Record<string, string>;
    setFiles(newFiles: Record<string, string>, mainFile?: string): Promise<void>;
}

export declare interface SFCOptions {
    script?: Partial<SFCScriptCompileOptions>;
    style?: Partial<SFCAsyncStyleCompileOptions>;
    template?: Partial<SFCTemplateCompileOptions>;
}

export declare type Store = Pick<ReplStore, 'files' | 'activeFile' | 'mainFile' | 'errors' | 'showOutput' | 'outputMode' | 'sfcOptions' | 'compiler' | 'vueVersion' | 'locale' | 'typescriptVersion' | 'dependencyVersion' | 'reloadLanguageTools' | 'init' | 'setActive' | 'addFile' | 'deleteFile' | 'renameFile' | 'getImportMap' | 'getTsConfig'>;

export declare type StoreState = ToRefs<{
    files: Record<string, File_2>;
    activeFilename: string;
    mainFile: string;
    template: {
        welcomeSFC?: string;
        newSFC?: string;
    };
    builtinImportMap: ImportMap;
    errors: (string | Error)[];
    showOutput: boolean;
    outputMode: OutputModes;
    sfcOptions: SFCOptions;
    /** `@vue/compiler-sfc` */
    compiler: typeof defaultCompiler;
    vueVersion: string | null;
    locale: string | undefined;
    typescriptVersion: string;
    /** \{ dependencyName: version \} */
    dependencyVersion: Record<string, string>;
    reloadLanguageTools?: (() => void) | undefined;
}>;

export declare function useStore({ files, activeFilename, // set later
    mainFile, template, builtinImportMap, // set later
    errors, showOutput, outputMode, sfcOptions, compiler, vueVersion, locale, typescriptVersion, dependencyVersion, reloadLanguageTools, }?: Partial<StoreState>, serializedState?: string): ReplStore;

export declare function useVueImportMap(defaults?: {
    runtimeDev?: string | (() => string);
    runtimeProd?: string | (() => string);
    serverRenderer?: string | (() => string);
    vueVersion?: string | null;
}): {
    productionMode: Ref<boolean, boolean>;
    importMap: ComputedRef<ImportMap>;
    vueVersion: Ref<string | null, string | null>;
    defaultVersion: string;
};

export { }
