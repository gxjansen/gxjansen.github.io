export function defaultAwarenessStateFilter(currentClientId: number, userClientId: number, _user: any): boolean;
export function defaultCursorBuilder(user: any): HTMLElement;
export function defaultSelectionBuilder(user: any): import('prosemirror-view').DecorationAttrs;
export function createDecorations(state: any, awareness: Awareness, awarenessFilter: (arg0: number, arg1: number, arg2: any) => boolean, createCursor: (arg0: {
    name: string;
    color: string;
}) => Element, createSelection: (arg0: {
    name: string;
    color: string;
}) => import('prosemirror-view').DecorationAttrs): any;
export function yCursorPlugin(awareness: Awareness, { awarenessStateFilter, cursorBuilder, selectionBuilder, getSelection }?: {
    awarenessStateFilter?: (arg0: any, arg1: any, arg2: any) => boolean;
    cursorBuilder?: (arg0: any) => HTMLElement;
    selectionBuilder?: (arg0: any) => import('prosemirror-view').DecorationAttrs;
    getSelection?: (arg0: any) => any;
}, cursorStateField?: string): any;
import { Awareness } from "y-protocols/awareness";
