/// <reference types="react" />
import { TableLayout } from '@react-stately/layout';
import { TableState } from '@react-stately/table';
import { TableProps } from "./types.js";
export interface TableContextValue<T> {
    state: TableState<T>;
    layout: TableLayout<T> & {
        state: TableState<T>;
    };
    isEmpty: boolean;
}
export declare const TableContext: import("react").Context<TableContextValue<any>>;
export declare function useTableContext(): TableContextValue<any>;
export declare const VirtualizerContext: import("react").Context<null>;
export declare function useVirtualizerContext(): null;
export declare function TableView<T extends object>(props: TableProps<T>): import("react").JSX.Element;
