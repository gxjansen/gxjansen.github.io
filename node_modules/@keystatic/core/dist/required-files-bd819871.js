import { load } from 'js-yaml';

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
function splitFrontmatter(data) {
  const str = textDecoder.decode(data);
  const match = str.match(/^---(?:\r?\n([^]*?))?\r?\n---\r?\n?/);
  if (match) {
    var _match$;
    const encoded = textEncoder.encode(match[0]);
    return {
      frontmatter: (_match$ = match[1]) !== null && _match$ !== void 0 ? _match$ : '',
      content: data.slice(encoded.byteLength)
    };
  }
  return null;
}
function loadDataFile(data, formatInfo, requireFrontmatter = false) {
  const parse = formatInfo.data === 'json' ? JSON.parse : load;
  if (!formatInfo.contentField) {
    const dataFile = textDecoder.decode(data);
    return {
      loaded: parse(dataFile)
    };
  }
  const res = splitFrontmatter(data);
  if (requireFrontmatter && !res) {
    throw new Error('Frontmatter not found');
  }
  return {
    loaded: res === null ? {} : parse(res.frontmatter),
    extraFakeFile: {
      path: `${formatInfo.contentField.path.join('/')}${formatInfo.contentField.contentExtension}`,
      contents: res === null ? data : res.content
    }
  };
}

export { loadDataFile as l };
