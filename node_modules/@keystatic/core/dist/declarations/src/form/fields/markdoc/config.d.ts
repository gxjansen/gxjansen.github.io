import { BasicFormField, SlugFormField, ComponentSchema } from "../../api.js";
type HeadingLevels = boolean | readonly (1 | 2 | 3 | 4 | 5 | 6)[];
export type BasicStringFormField = BasicFormField<string> | SlugFormField<string, string, string, null>;
export type EditorConfig = {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    code: boolean;
    heading: {
        levels: readonly (1 | 2 | 3 | 4 | 5 | 6)[];
        schema: Record<string, ComponentSchema>;
    };
    blockquote: boolean;
    orderedList: boolean;
    unorderedList: boolean;
    table: boolean;
    link: boolean;
    image: {
        directory: string | undefined;
        publicPath: string | undefined;
        transformFilename: (originalFilename: string) => string;
        schema: {
            alt: BasicStringFormField;
            title: BasicStringFormField;
        };
    } | undefined;
    divider: boolean;
    codeBlock: {
        schema: Record<string, ComponentSchema>;
    } | undefined;
};
export type MarkdocEditorOptions = {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    code?: boolean;
    heading?: HeadingLevels | {
        levels: HeadingLevels;
        schema: Record<string, ComponentSchema>;
    };
    blockquote?: boolean;
    orderedList?: boolean;
    unorderedList?: boolean;
    table?: boolean;
    link?: boolean;
    image?: boolean | {
        directory?: string;
        publicPath?: string;
        transformFilename?: (originalFilename: string) => string;
        schema?: {
            alt?: BasicStringFormField;
            title?: BasicStringFormField;
        };
    };
    divider?: boolean;
    codeBlock?: boolean | {
        schema: Record<string, ComponentSchema>;
    };
};
export type MDXEditorOptions = {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    code?: boolean;
    heading?: HeadingLevels;
    blockquote?: boolean;
    orderedList?: boolean;
    unorderedList?: boolean;
    table?: boolean;
    link?: boolean;
    image?: boolean | {
        directory?: string;
        publicPath?: string;
        transformFilename?: (originalFilename: string) => string;
        schema?: {
            alt?: BasicStringFormField;
            title?: BasicStringFormField;
        };
    };
    divider?: boolean;
    codeBlock?: boolean;
};
type EditorOptions = MarkdocEditorOptions | MDXEditorOptions;
export declare function editorOptionsToConfig(options: EditorOptions): EditorConfig;
export {};
