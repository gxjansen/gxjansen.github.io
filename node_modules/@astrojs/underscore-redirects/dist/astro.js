import { posix } from "node:path";
import { Redirects } from "./redirects.js";
const pathJoin = posix.join;
function getRedirectStatus(route) {
  if (typeof route.redirect === "object") {
    return route.redirect.status;
  }
  return 301;
}
function createRedirectsFromAstroRoutes({
  config,
  routeToDynamicTargetMap,
  dir
}) {
  const base = config.base && config.base !== "/" ? config.base.endsWith("/") ? config.base.slice(0, -1) : config.base : "";
  const output = config.output;
  const _redirects = new Redirects();
  for (const [route, dynamicTarget = ""] of routeToDynamicTargetMap) {
    if (route.pathname) {
      if (route.redirect) {
        _redirects.add({
          dynamic: false,
          input: `${base}${route.pathname}`,
          target: typeof route.redirect === "object" ? route.redirect.destination : route.redirect,
          status: getRedirectStatus(route),
          weight: 2
        });
        continue;
      }
      if (output === "static") {
        continue;
      } else if (route.distURL) {
        _redirects.add({
          dynamic: false,
          input: `${base}${route.pathname}`,
          target: prependForwardSlash(route.distURL.toString().replace(dir.toString(), "")),
          status: 200,
          weight: 2
        });
      } else {
        _redirects.add({
          dynamic: false,
          input: `${base}${route.pathname}`,
          target: dynamicTarget,
          status: 200,
          weight: 2
        });
        if (route.route === "/404") {
          _redirects.add({
            dynamic: true,
            input: "/*",
            target: dynamicTarget,
            status: 404,
            weight: 0
          });
        }
      }
    } else {
      const pattern = generateDynamicPattern(route);
      if (route.distURL) {
        const targetRoute = route.redirectRoute ?? route;
        const targetPattern = generateDynamicPattern(targetRoute);
        let target = targetPattern;
        if (config.build.format === "directory") {
          target = pathJoin(target, "index.html");
        } else {
          target += ".html";
        }
        _redirects.add({
          dynamic: true,
          input: `${base}${pattern}`,
          target,
          status: route.type === "redirect" ? 301 : 200,
          weight: 1
        });
      } else {
        _redirects.add({
          dynamic: true,
          input: `${base}${pattern}`,
          target: dynamicTarget,
          status: 200,
          weight: 1
        });
      }
    }
  }
  return _redirects;
}
function generateDynamicPattern(route) {
  const pattern = "/" + route.segments.map(([part]) => {
    if (part.dynamic) {
      if (part.spread) {
        return "*";
      } else {
        return ":" + part.content;
      }
    } else {
      return part.content;
    }
  }).join("/");
  return pattern;
}
function prependForwardSlash(str) {
  return str.startsWith("/") ? str : "/" + str;
}
export {
  createRedirectsFromAstroRoutes
};
