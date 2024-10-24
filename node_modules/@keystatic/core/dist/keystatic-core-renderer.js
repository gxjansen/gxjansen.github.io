import { c } from './react-compiler-runtime-0011f46e.js';
import { Fragment } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

const defaultRenderers = {
  inline: {
    bold: 'strong',
    code: 'code',
    keyboard: 'kbd',
    strikethrough: 's',
    italic: 'em',
    link: 'a',
    subscript: 'sub',
    superscript: 'sup',
    underline: 'u'
  },
  block: {
    image({
      src,
      alt,
      title
    }) {
      return /*#__PURE__*/jsx("img", {
        src: src,
        alt: alt,
        title: title
      });
    },
    block: 'div',
    blockquote: 'blockquote',
    paragraph: ({
      children,
      textAlign
    }) => {
      return /*#__PURE__*/jsx("p", {
        style: {
          textAlign
        },
        children: children
      });
    },
    divider: 'hr',
    heading: ({
      level,
      children,
      textAlign
    }) => {
      let Heading = `h${level}`;
      return /*#__PURE__*/jsx(Heading, {
        style: {
          textAlign
        },
        children: children
      });
    },
    code({
      children
    }) {
      return /*#__PURE__*/jsx("pre", {
        children: /*#__PURE__*/jsx("code", {
          children: children
        })
      });
    },
    list: ({
      children,
      type
    }) => {
      const List = type === 'ordered' ? 'ol' : 'ul';
      return /*#__PURE__*/jsx(List, {
        children: children.map((x, i) => /*#__PURE__*/jsx("li", {
          children: x
        }, i))
      });
    },
    layout: ({
      children,
      layout
    }) => {
      return /*#__PURE__*/jsx("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: layout.map(x => `${x}fr`).join(' ')
        },
        children: children.map((element, i) => /*#__PURE__*/jsx("div", {
          children: element
        }, i))
      });
    },
    table: ({
      head,
      body
    }) => {
      return /*#__PURE__*/jsxs("table", {
        children: [head && /*#__PURE__*/jsx("thead", {
          children: /*#__PURE__*/jsx("tr", {
            children: head.map((x, i) => /*#__PURE__*/jsx("th", {
              colSpan: x.colSpan,
              rowSpan: x.rowSpan,
              children: x.children
            }, i))
          })
        }), /*#__PURE__*/jsx("tbody", {
          children: body.map((row, i) => /*#__PURE__*/jsx("tr", {
            children: row.map((x, j) => /*#__PURE__*/jsx("td", {
              colSpan: x.colSpan,
              rowSpan: x.rowSpan,
              children: x.children
            }, j))
          }, i))
        })]
      });
    }
  }
};
function DocumentNode(t0) {
  const $ = c(57);
  const {
    node: _node,
    componentBlocks,
    renderers
  } = t0;
  if (typeof _node.text === "string") {
    let child;
    if ($[0] !== _node || $[1] !== renderers.inline) {
      child = /*#__PURE__*/jsx(Fragment, {
        children: _node.text
      });
      Object.keys(renderers.inline).forEach(markName => {
        if (markName !== "link" && _node[markName]) {
          const Mark = renderers.inline[markName];
          child = /*#__PURE__*/jsx(Mark, {
            children: child
          });
        }
      });
      $[0] = _node;
      $[1] = renderers.inline;
      $[2] = child;
    } else {
      child = $[2];
    }
    return child;
  }
  const node = _node;
  let children;
  let t1;
  if ($[3] !== componentBlocks || $[4] !== renderers || $[5] !== node) {
    t1 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let t2;
      if ($[8] !== componentBlocks || $[9] !== renderers) {
        t2 = (x, i) => /*#__PURE__*/jsx(DocumentNode, {
          node: x,
          componentBlocks: componentBlocks,
          renderers: renderers
        }, i);
        $[8] = componentBlocks;
        $[9] = renderers;
        $[10] = t2;
      } else {
        t2 = $[10];
      }
      children = node.children.map(t2);
      bb1: switch (node.type) {
        case "blockquote":
          {
            t1 = /*#__PURE__*/jsx(renderers.block.blockquote, {
              children: children
            });
            break bb0;
          }
        case "paragraph":
          {
            t1 = /*#__PURE__*/jsx(renderers.block.paragraph, {
              textAlign: node.textAlign,
              children: children
            });
            break bb0;
          }
        case "code":
          {
            if (node.children.length === 1 && node.children[0] && typeof node.children[0].text === "string") {
              let rest_0;
              if ($[11] !== node) {
                const {
                  type: type_0,
                  children: children_0,
                  ...t3
                } = node;
                rest_0 = t3;
                $[11] = node;
                $[12] = rest_0;
              } else {
                rest_0 = $[12];
              }
              const t3 = node.children[0];
              let t4;
              if ($[13] !== renderers.block.code || $[14] !== rest_0 || $[15] !== t3.text) {
                t4 = /*#__PURE__*/jsx(renderers.block.code, {
                  ...rest_0,
                  children: t3.text
                });
                $[13] = renderers.block.code;
                $[14] = rest_0;
                $[15] = t3.text;
                $[16] = t4;
              } else {
                t4 = $[16];
              }
              t1 = t4;
              break bb0;
            }
            break bb1;
          }
        case "layout":
          {
            t1 = /*#__PURE__*/jsx(renderers.block.layout, {
              layout: node.layout,
              children: children
            });
            break bb0;
          }
        case "divider":
          {
            let t3;
            if ($[17] !== renderers.block.divider) {
              t3 = /*#__PURE__*/jsx(renderers.block.divider, {});
              $[17] = renderers.block.divider;
              $[18] = t3;
            } else {
              t3 = $[18];
            }
            t1 = t3;
            break bb0;
          }
        case "heading":
          {
            let rest;
            if ($[19] !== node) {
              const {
                type,
                children: _children,
                ...t3
              } = node;
              rest = t3;
              $[19] = node;
              $[20] = rest;
            } else {
              rest = $[20];
            }
            t1 = /*#__PURE__*/jsx(renderers.block.heading, {
              ...rest,
              children: children
            });
            break bb0;
          }
        case "component-block":
          {
            const Comp = componentBlocks[node.component];
            if (Comp) {
              const props = createComponentBlockProps(node, children);
              let t3;
              if ($[21] !== Comp || $[22] !== props) {
                t3 = /*#__PURE__*/jsx(Comp, {
                  ...props
                });
                $[21] = Comp;
                $[22] = props;
                $[23] = t3;
              } else {
                t3 = $[23];
              }
              let t4;
              if ($[24] !== renderers.block.block || $[25] !== t3) {
                t4 = /*#__PURE__*/jsx(renderers.block.block, {
                  children: t3
                });
                $[24] = renderers.block.block;
                $[25] = t3;
                $[26] = t4;
              } else {
                t4 = $[26];
              }
              t1 = t4;
              break bb0;
            }
            break bb1;
          }
        case "ordered-list":
        case "unordered-list":
          {
            const t3 = node.type === "ordered-list" ? "ordered" : "unordered";
            let t4;
            if ($[27] !== renderers.block.list || $[28] !== children || $[29] !== t3) {
              t4 = /*#__PURE__*/jsx(renderers.block.list, {
                children: children,
                type: t3
              });
              $[27] = renderers.block.list;
              $[28] = children;
              $[29] = t3;
              $[30] = t4;
            } else {
              t4 = $[30];
            }
            t1 = t4;
            break bb0;
          }
        case "link":
          {
            const t3 = node.href;
            let t4;
            if ($[31] !== renderers.inline.link || $[32] !== t3 || $[33] !== children) {
              t4 = /*#__PURE__*/jsx(renderers.inline.link, {
                href: t3,
                children: children
              });
              $[31] = renderers.inline.link;
              $[32] = t3;
              $[33] = children;
              $[34] = t4;
            } else {
              t4 = $[34];
            }
            t1 = t4;
            break bb0;
          }
        case "image":
          {
            const t3 = node.src;
            const t4 = node.alt;
            const t5 = node.title;
            let t6;
            if ($[35] !== renderers.block.image || $[36] !== t3 || $[37] !== t4 || $[38] !== t5) {
              t6 = /*#__PURE__*/jsx(renderers.block.image, {
                src: t3,
                alt: t4,
                title: t5
              });
              $[35] = renderers.block.image;
              $[36] = t3;
              $[37] = t4;
              $[38] = t5;
              $[39] = t6;
            } else {
              t6 = $[39];
            }
            t1 = t6;
            break bb0;
          }
        case "table":
          {
            const first = node.children[0];
            const second = node.children[1];
            const body = second || first;
            const head = second ? first : undefined;
            let t3;
            if ($[40] !== head || $[41] !== componentBlocks || $[42] !== renderers) {
              t3 = head ? head.children[0].children.map(cell => ({
                children: cell.children.map((x_0, i_0) => /*#__PURE__*/jsx(DocumentNode, {
                  node: x_0,
                  componentBlocks: componentBlocks,
                  renderers: renderers
                }, i_0))
              })) : undefined;
              $[40] = head;
              $[41] = componentBlocks;
              $[42] = renderers;
              $[43] = t3;
            } else {
              t3 = $[43];
            }
            const t4 = body.children;
            let t5;
            if ($[44] !== componentBlocks || $[45] !== renderers || $[46] !== t4) {
              let t6;
              if ($[48] !== componentBlocks || $[49] !== renderers) {
                t6 = row => row.children.map(cell_0 => ({
                  children: cell_0.children.map((x_1, i_1) => /*#__PURE__*/jsx(DocumentNode, {
                    node: x_1,
                    componentBlocks: componentBlocks,
                    renderers: renderers
                  }, i_1))
                }));
                $[48] = componentBlocks;
                $[49] = renderers;
                $[50] = t6;
              } else {
                t6 = $[50];
              }
              t5 = t4.map(t6);
              $[44] = componentBlocks;
              $[45] = renderers;
              $[46] = t4;
              $[47] = t5;
            } else {
              t5 = $[47];
            }
            let t6;
            if ($[51] !== renderers.block.table || $[52] !== t3 || $[53] !== t5) {
              t6 = /*#__PURE__*/jsx(renderers.block.table, {
                head: t3,
                body: t5
              });
              $[51] = renderers.block.table;
              $[52] = t3;
              $[53] = t5;
              $[54] = t6;
            } else {
              t6 = $[54];
            }
            t1 = t6;
            break bb0;
          }
      }
    }
    $[3] = componentBlocks;
    $[4] = renderers;
    $[5] = node;
    $[6] = children;
    $[7] = t1;
  } else {
    children = $[6];
    t1 = $[7];
  }
  if (t1 !== Symbol.for("react.early_return_sentinel")) {
    return t1;
  }
  let t2;
  if ($[55] !== children) {
    t2 = /*#__PURE__*/jsx(Fragment, {
      children: children
    });
    $[55] = children;
    $[56] = t2;
  } else {
    t2 = $[56];
  }
  return t2;
}
function set(obj, propPath, value) {
  if (propPath.length === 1) {
    obj[propPath[0]] = value;
  } else {
    let firstElement = propPath.shift();
    set(obj[firstElement], propPath, value);
  }
}
function createComponentBlockProps(node, children) {
  const formProps = JSON.parse(JSON.stringify(node.props));
  node.children.forEach((child, i) => {
    if (child.propPath) {
      const propPath = [...child.propPath];
      set(formProps, propPath, children[i]);
    }
  });
  return formProps;
}
function DocumentRenderer(props) {
  var _props$renderers, _props$renderers2;
  const $ = c(18);
  const t0 = (_props$renderers = props.renderers) === null || _props$renderers === void 0 ? void 0 : _props$renderers.inline;
  let t1;
  if ($[0] !== t0) {
    t1 = {
      ...defaultRenderers.inline,
      ...t0
    };
    $[0] = t0;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const t2 = (_props$renderers2 = props.renderers) === null || _props$renderers2 === void 0 ? void 0 : _props$renderers2.block;
  let t3;
  if ($[2] !== t2) {
    t3 = {
      ...defaultRenderers.block,
      ...t2
    };
    $[2] = t2;
    $[3] = t3;
  } else {
    t3 = $[3];
  }
  let t4;
  if ($[4] !== t1 || $[5] !== t3) {
    t4 = {
      inline: t1,
      block: t3
    };
    $[4] = t1;
    $[5] = t3;
    $[6] = t4;
  } else {
    t4 = $[6];
  }
  const renderers = t4;
  let t5;
  if ($[7] !== props.componentBlocks) {
    t5 = props.componentBlocks || {};
    $[7] = props.componentBlocks;
    $[8] = t5;
  } else {
    t5 = $[8];
  }
  const componentBlocks = t5;
  let t6;
  if ($[9] !== componentBlocks || $[10] !== renderers || $[11] !== props.document) {
    let t7;
    if ($[13] !== componentBlocks || $[14] !== renderers) {
      t7 = (x, i) => /*#__PURE__*/jsx(DocumentNode, {
        node: x,
        componentBlocks: componentBlocks,
        renderers: renderers
      }, i);
      $[13] = componentBlocks;
      $[14] = renderers;
      $[15] = t7;
    } else {
      t7 = $[15];
    }
    t6 = props.document.map(t7);
    $[9] = componentBlocks;
    $[10] = renderers;
    $[11] = props.document;
    $[12] = t6;
  } else {
    t6 = $[12];
  }
  let t7;
  if ($[16] !== t6) {
    t7 = /*#__PURE__*/jsx(Fragment, {
      children: t6
    });
    $[16] = t6;
    $[17] = t7;
  } else {
    t7 = $[17];
  }
  return t7;
}

export { DocumentRenderer, defaultRenderers };
