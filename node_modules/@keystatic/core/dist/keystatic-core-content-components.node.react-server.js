import { c as cloudImageSchema, C as CloudImagePreviewForNewEditor, a as cloudImageToolbarIcon, h as handleFile } from './cloud-image-schema-45663374.node.react-server.js';
import './index-9722793d.node.react-server.js';
import './index-10ea50e2.node.react-server.js';
import 'react/jsx-runtime';

function wrapper(config) {
  return {
    kind: 'wrapper',
    ...config
  };
}
function block(config) {
  return {
    kind: 'block',
    ...config
  };
}
function inline(config) {
  return {
    kind: 'inline',
    ...config
  };
}
function mark(config) {
  return {
    kind: 'mark',
    ...config
  };
}
function repeating(config) {
  var _config$validation$ch, _config$validation, _config$validation$ch2, _config$validation2;
  return {
    kind: 'repeating',
    ...config,
    children: Array.isArray(config.children) ? config.children : [config.children],
    validation: {
      children: {
        min: (_config$validation$ch = (_config$validation = config.validation) === null || _config$validation === void 0 || (_config$validation = _config$validation.children) === null || _config$validation === void 0 ? void 0 : _config$validation.min) !== null && _config$validation$ch !== void 0 ? _config$validation$ch : 0,
        max: (_config$validation$ch2 = (_config$validation2 = config.validation) === null || _config$validation2 === void 0 || (_config$validation2 = _config$validation2.children) === null || _config$validation2 === void 0 ? void 0 : _config$validation2.max) !== null && _config$validation$ch2 !== void 0 ? _config$validation$ch2 : Infinity
      }
    }
  };
}
function cloudImage(args) {
  return {
    kind: 'block',
    label: args.label,
    schema: cloudImageSchema,
    NodeView: CloudImagePreviewForNewEditor,
    icon: cloudImageToolbarIcon,
    handleFile: handleFile
  };
}

export { block, cloudImage, inline, mark, repeating, wrapper };
