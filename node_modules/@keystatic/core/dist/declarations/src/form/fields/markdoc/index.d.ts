import { Node as MarkdocNode } from "../../../markdoc.js";
import { AssetsFormField, ContentFormField } from "../../api.js";
import type { EditorState } from 'prosemirror-state';
import { ContentComponent } from "../../../content-components.js";
import { MDXEditorOptions, MarkdocEditorOptions } from "./config.js";
export declare function markdoc({ label, description, options, components, extension, }: {
    label: string;
    description?: string;
    options?: MarkdocEditorOptions;
    extension?: 'mdoc' | 'md';
    components?: Record<string, ContentComponent>;
}): markdoc.Field;
export declare namespace markdoc {
    var createMarkdocConfig: typeof import("./markdoc-config.js").createMarkdocConfig;
    var inline: ({ label, description, options, components, }: {
        label: string;
        description?: string;
        options?: MarkdocEditorOptions;
        components?: Record<string, ContentComponent>;
    }) => markdoc.inline.Field;
}
export declare namespace markdoc {
    type Field = ContentFormField<EditorState, EditorState, {
        node: MarkdocNode;
    }>;
}
export declare namespace markdoc.inline {
    type Field = AssetsFormField<EditorState, EditorState, {
        node: MarkdocNode;
    }>;
}
export declare function mdx({ label, description, options, components, extension, }: {
    label: string;
    description?: string;
    options?: MDXEditorOptions;
    extension?: 'mdx' | 'md';
    components?: Record<string, ContentComponent>;
}): mdx.Field;
export declare namespace mdx {
    var inline: ({ label, description, options, components, }: {
        label: string;
        description?: string;
        options?: MDXEditorOptions;
        components?: Record<string, ContentComponent>;
    }) => mdx.inline.Field;
}
export declare namespace mdx {
    type Field = ContentFormField<EditorState, EditorState, string>;
}
export declare namespace mdx.inline {
    type Field = AssetsFormField<EditorState, EditorState, string>;
}
