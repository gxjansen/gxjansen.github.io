import type { AstroConfig, RouteData } from 'astro';
import { Redirects } from './redirects.js';
interface CreateRedirectsFromAstroRoutesParams {
    config: Pick<AstroConfig, 'build' | 'output' | 'base'>;
    /**
     * Maps a `RouteData` to a dynamic target
     */
    routeToDynamicTargetMap: Map<RouteData, string>;
    dir: URL;
}
/**
 * Takes a set of routes and creates a Redirects object from them.
 */
export declare function createRedirectsFromAstroRoutes({ config, routeToDynamicTargetMap, dir, }: CreateRedirectsFromAstroRoutesParams): Redirects;
export {};
