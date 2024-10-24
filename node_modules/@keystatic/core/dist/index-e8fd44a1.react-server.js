import { jsx } from 'react/jsx-runtime';

class FieldDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FieldDataError';
  }
}

function assertRequired(value, validation, label) {
  if (value === null && validation !== null && validation !== void 0 && validation.isRequired) {
    throw new FieldDataError(`${label} is required`);
  }
}
function basicFormFieldWithSimpleReaderParse(config) {
  return {
    kind: 'form',
    Input: config.Input,
    defaultValue: config.defaultValue,
    parse: config.parse,
    serialize: config.serialize,
    validate: config.validate,
    reader: {
      parse(value) {
        return config.validate(config.parse(value));
      }
    },
    label: config.label
  };
}

// this is used in react-server environments to avoid bundling UI when the reader API is used
// if you added a new field and get an error that there's missing a missing export here,
// you probably just need to add another empty export here

function empty() {
  throw new Error("unexpected call to function that shouldn't be called in React server component environment");
}
let SlugFieldInput = empty,
  TextFieldInput = empty,
  UrlFieldInput = empty,
  SelectFieldInput = empty,
  RelationshipInput = empty,
  PathReferenceInput = empty,
  MultiselectFieldInput = empty,
  MultiRelationshipInput = empty,
  IntegerFieldInput = empty,
  NumberFieldInput = empty,
  ImageFieldInput = empty,
  FileFieldInput = empty,
  DatetimeFieldInput = empty,
  DateFieldInput = empty,
  CloudImageFieldInput = empty,
  BlocksFieldInput = empty,
  DocumentFieldInput = empty,
  CheckboxFieldInput = empty,
  createEditorSchema = empty,
  getDefaultValue = empty,
  parseToEditorState = empty,
  serializeFromEditorState = empty,
  parseToEditorStateMDX = empty,
  serializeFromEditorStateMDX = empty,
  createEditorStateFromYJS = empty,
  prosemirrorToYXmlFragment = empty,
  normalizeDocumentFieldChildren = empty,
  slugify = empty,
  serializeMarkdoc = empty;

function validateText(val, min, max, fieldLabel, slugInfo, pattern) {
  if (val.length < min) {
    if (min === 1) {
      return `${fieldLabel} must not be empty`;
    } else {
      return `${fieldLabel} must be at least ${min} characters long`;
    }
  }
  if (val.length > max) {
    return `${fieldLabel} must be no longer than ${max} characters`;
  }
  if (pattern && !pattern.regex.test(val)) {
    return pattern.message || `${fieldLabel} must match the pattern ${pattern.regex}`;
  }
  if (slugInfo) {
    if (val === '') {
      return `${fieldLabel} must not be empty`;
    }
    if (val === '..') {
      return `${fieldLabel} must not be ..`;
    }
    if (val === '.') {
      return `${fieldLabel} must not be .`;
    }
    if (slugInfo.glob === '**') {
      const split = val.split('/');
      if (split.some(s => s === '..')) {
        return `${fieldLabel} must not contain ..`;
      }
      if (split.some(s => s === '.')) {
        return `${fieldLabel} must not be .`;
      }
    }
    if ((slugInfo.glob === '*' ? /[\\/]/ : /[\\]/).test(val)) {
      return `${fieldLabel} must not contain slashes`;
    }
    if (/^\s|\s$/.test(val)) {
      return `${fieldLabel} must not start or end with spaces`;
    }
    if (slugInfo.slugs.has(val)) {
      return `${fieldLabel} must be unique`;
    }
  }
}

function parseAsNormalField(value) {
  if (value === undefined) {
    return '';
  }
  if (typeof value !== 'string') {
    throw new FieldDataError('Must be a string');
  }
  return value;
}
const emptySet = new Set();
function text({
  label,
  defaultValue = '',
  validation: {
    length: {
      max = Infinity,
      min = 0
    } = {},
    pattern,
    isRequired
  } = {},
  description,
  multiline = false
}) {
  min = Math.max(isRequired ? 1 : 0, min);
  function validate(value, slugField) {
    const message = validateText(value, min, max, label, slugField, pattern);
    if (message !== undefined) {
      throw new FieldDataError(message);
    }
    return value;
  }
  return {
    kind: 'form',
    formKind: 'slug',
    label,
    Input(props) {
      return /*#__PURE__*/jsx(TextFieldInput, {
        label: label,
        description: description,
        min: min,
        max: max,
        multiline: multiline,
        pattern: pattern,
        ...props
      });
    },
    defaultValue() {
      return typeof defaultValue === 'string' ? defaultValue : defaultValue();
    },
    parse(value, args) {
      if ((args === null || args === void 0 ? void 0 : args.slug) !== undefined) {
        return args.slug;
      }
      return parseAsNormalField(value);
    },
    serialize(value) {
      return {
        value: value === '' ? undefined : value
      };
    },
    serializeWithSlug(value) {
      return {
        slug: value,
        value: undefined
      };
    },
    reader: {
      parse(value) {
        const parsed = parseAsNormalField(value);
        return validate(parsed, undefined);
      },
      parseWithSlug(_value, args) {
        validate(parseAsNormalField(args.slug), {
          glob: args.glob,
          slugs: emptySet
        });
        return null;
      }
    },
    validate(value, args) {
      return validate(value, args === null || args === void 0 ? void 0 : args.slugField);
    }
  };
}

export { BlocksFieldInput as B, CheckboxFieldInput as C, DateFieldInput as D, FieldDataError as F, ImageFieldInput as I, MultiRelationshipInput as M, NumberFieldInput as N, PathReferenceInput as P, RelationshipInput as R, SelectFieldInput as S, UrlFieldInput as U, CloudImageFieldInput as a, basicFormFieldWithSimpleReaderParse as b, assertRequired as c, DatetimeFieldInput as d, FileFieldInput as e, MultiselectFieldInput as f, SlugFieldInput as g, DocumentFieldInput as h, serializeMarkdoc as i, getDefaultValue as j, serializeFromEditorState as k, prosemirrorToYXmlFragment as l, createEditorStateFromYJS as m, normalizeDocumentFieldChildren as n, parseToEditorStateMDX as o, parseToEditorState as p, serializeFromEditorStateMDX as q, createEditorSchema as r, slugify as s, text as t, IntegerFieldInput as u, validateText as v };
