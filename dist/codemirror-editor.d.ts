import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { DefineComponent } from 'vue';
import { PublicProps } from 'vue';

declare const _default: DefineComponent<EditorProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
change: (code: string) => any;
}, string, PublicProps, Readonly<EditorProps> & Readonly<{
onChange?: ((code: string) => any) | undefined;
}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, any>;
export default _default;

declare type EditorMode = 'js' | 'css' | 'ssr';

declare interface EditorProps {
    value: string;
    filename: string;
    readonly?: boolean;
    mode?: EditorMode;
}

export { }
