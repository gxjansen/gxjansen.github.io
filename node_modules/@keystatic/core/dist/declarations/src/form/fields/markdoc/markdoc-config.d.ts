import { Config, NodeType } from "../../../markdoc.js";
import { MarkdocEditorOptions } from "./config.js";
import { ContentComponent } from "../../../content-components.js";
export declare function createMarkdocConfig<Components extends Record<string, ContentComponent>>(opts: {
    options?: MarkdocEditorOptions;
    components?: Components;
    render?: {
        tags?: {
            [_ in keyof Components]?: string;
        };
        nodes?: {
            [_ in NodeType]?: string;
        };
    };
}): Config;
