import { ClassNamesArg } from '@emotion/css';
export declare const classNamePrefix = "kui";
export declare const resetClassName: string;
export declare function voussoirClassName(className: string): string;
/**
 * A thin wrapper around [Emotion's `cx`
 * function](https://emotion.sh/docs/@emotion/css#cx) that includes the reset
 * class name.
 */
export declare function classNames(...inputs: ClassNamesArg[]): string;
/**
 * A ClassList organises component class names with appropriate prefixes,
 * offering strongly-typed methods for declaration in JSX and styles.
 */
export declare class ClassList<ElementName extends 'root' | (string & {})> {
    #private;
    constructor(componentName: string, elements?: ReadonlyArray<ElementName>);
    element(name: ElementName | 'root'): string;
    selector(element: ElementName | 'root', combinator?: CssCombinator): string;
}
type CssCombinator = keyof typeof combinators;
declare const combinators: {
    readonly descendant: "& ";
    readonly child: "& > ";
    readonly sibling: "& ~ ";
    readonly 'adjacent-sibling': "& + ";
};
export {};
