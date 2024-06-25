import 'react';
import { Keystatic } from '@keystatic/core/ui';
import { jsx } from 'react/jsx-runtime';

const appSlug = {
  envName: 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
  value: import.meta.env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
};
function makePage(config) {
  return function Keystatic$1() {
    return /*#__PURE__*/jsx(Keystatic, {
      config: config,
      appSlug: appSlug
    });
  };
}

export { makePage };
