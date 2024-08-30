import type { AstroConfig, RewritePayload, RouteData } from '../../@types/astro.js';
export type FindRouteToRewrite = {
    payload: RewritePayload;
    routes: RouteData[];
    request: Request;
    trailingSlash: AstroConfig['trailingSlash'];
    buildFormat: AstroConfig['build']['format'];
    base: AstroConfig['base'];
};
export interface FindRouteToRewriteResult {
    routeData: RouteData;
    newUrl: URL;
    pathname: string;
}
/**
 * Shared logic to retrieve the rewritten route. It returns a tuple that represents:
 * 1. The new `Request` object. It contains `base`
 * 2.
 */
export declare function findRouteToRewrite({ payload, routes, request, trailingSlash, buildFormat, base, }: FindRouteToRewrite): FindRouteToRewriteResult;
