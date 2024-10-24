import { ReactElement, ReactNode } from 'react';
import { BasicFormField, ComponentSchema, ObjectField, ParsedValueForComponentSchema, SlugFormField } from "./form/api.js";
import { Config } from "./index.js";
type WrapperComponentConfig<Schema extends Record<string, ComponentSchema>> = {
    label: string;
    description?: string;
    icon?: ReactElement;
    schema: Schema;
    forSpecificLocations?: boolean;
} & ({
    ContentView?: (props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
        children: ReactNode;
    }) => ReactNode;
} | {
    NodeView?: (props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
        onChange(value: ParsedValueForComponentSchema<ObjectField<Schema>>): void;
        onRemove(): void;
        isSelected: boolean;
        children: ReactNode;
    }) => ReactNode;
});
type WrapperComponent<Schema extends Record<string, ComponentSchema>> = WrapperComponentConfig<Schema> & {
    kind: 'wrapper';
};
export declare function wrapper<Schema extends Record<string, ComponentSchema>>(config: WrapperComponentConfig<Schema>): WrapperComponent<Schema>;
type BlockComponentConfig<Schema extends Record<string, ComponentSchema>> = {
    label: string;
    description?: string;
    icon?: ReactElement;
    schema: Schema;
    forSpecificLocations?: boolean;
} & ({
    ContentView?: (props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
    }) => ReactNode;
} | {
    NodeView?: (props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
        onChange(value: ParsedValueForComponentSchema<ObjectField<Schema>>): void;
        onRemove(): void;
        isSelected: boolean;
    }) => ReactNode;
});
type BlockComponent<Schema extends Record<string, ComponentSchema>> = BlockComponentConfig<Schema> & {
    kind: 'block';
    handleFile?: (file: File, config: Config) => false | Promise<ParsedValueForComponentSchema<ObjectField<Schema>>>;
};
export declare function block<Schema extends Record<string, ComponentSchema>>(config: BlockComponentConfig<Schema>): BlockComponent<Schema>;
type InlineComponentConfig<Schema extends Record<string, ComponentSchema>> = {
    label: string;
    description?: string;
    icon?: ReactElement;
    schema: Schema;
    ToolbarView?(props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
        onChange(value: ParsedValueForComponentSchema<ObjectField<Schema>>): void;
        onRemove(): void;
    }): ReactNode;
} & ({
    ContentView?: (props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
    }) => ReactNode;
} | {
    NodeView?: (props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
        onChange(value: ParsedValueForComponentSchema<ObjectField<Schema>>): void;
        onRemove(): void;
        isSelected: boolean;
    }) => ReactNode;
});
type InlineComponent<Schema extends Record<string, ComponentSchema>> = InlineComponentConfig<Schema> & {
    kind: 'inline';
    handleFile?: (file: File, config: Config) => false | Promise<ParsedValueForComponentSchema<ObjectField<Schema>>>;
};
export declare function inline<Schema extends Record<string, ComponentSchema>>(config: InlineComponentConfig<Schema>): InlineComponent<Schema>;
type Thing<T, Schema extends Record<string, ComponentSchema>> = T | {
    method(props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
    }): T;
}['method'];
type MarkComponentConfig<Schema extends Record<string, ComponentSchema>> = {
    label: string;
    icon: ReactElement;
    schema: Schema;
    tag?: 'span' | 'strong' | 'em' | 'u' | 'del' | 'code' | 'a' | 'sub' | 'sup' | 'kbd' | 'abbr' | 'mark' | 's' | 'small' | 'big';
    style?: Thing<{
        [key: string]: string;
    }, Schema>;
    className?: Thing<string, Schema>;
};
type MarkComponent<Schema extends Record<string, ComponentSchema>> = MarkComponentConfig<Schema> & {
    kind: 'mark';
};
export declare function mark<Schema extends Record<string, ComponentSchema>>(config: MarkComponentConfig<Schema>): MarkComponent<Schema>;
type RepeatingComponentConfig<Schema extends Record<string, ComponentSchema>> = WrapperComponentConfig<Schema> & {
    children: string | string[];
    validation?: {
        children?: {
            min?: number;
            max?: number;
        };
    };
};
type RepeatingComponent<Schema extends Record<string, ComponentSchema>> = WrapperComponentConfig<Schema> & {
    kind: 'repeating';
    children: string[];
    validation: {
        children: {
            min: number;
            max: number;
        };
    };
};
export declare function repeating<Schema extends Record<string, ComponentSchema>>(config: RepeatingComponentConfig<Schema>): RepeatingComponent<Schema>;
export type ContentComponent = WrapperComponent<Record<string, ComponentSchema>> | BlockComponent<Record<string, ComponentSchema>> | RepeatingComponent<Record<string, ComponentSchema>> | InlineComponent<Record<string, ComponentSchema>> | MarkComponent<Record<string, ComponentSchema>>;
export declare function cloudImage(args: {
    label: string;
}): BlockComponent<{
    src: SlugFormField<string, string, string, null>;
    alt: SlugFormField<string, string, string, null>;
    height: BasicFormField<number | null>;
    width: BasicFormField<number | null>;
}>;
export {};
