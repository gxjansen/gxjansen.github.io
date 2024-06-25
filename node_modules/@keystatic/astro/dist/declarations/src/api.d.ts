import { APIRouteConfig } from '@keystatic/core/api/generic';
import type { APIContext } from 'astro';
export declare function makeHandler(_config: APIRouteConfig): (context: APIContext) => Promise<Response>;
