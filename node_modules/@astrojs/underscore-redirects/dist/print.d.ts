import type { RedirectDefinition } from './redirects.js';
/**
 * Pretty print a list of definitions into the output format. Keeps
 * things readable for humans. Ex:
 * /nope               /                              301
 * /other              /                              301
 * /two                /                              302
 * /team/articles/*    /team/articles/*\/index.html    200
 * /blog/*             /team/articles/*\/index.html    301
 */
export declare function print(definitions: RedirectDefinition[], minInputLength: number, minTargetLength: number): string;
