'use client';
import { getChildNodes, getItemCount } from '@react-stately/collections';
export { Item, Section } from '@react-stately/collections';
import { useCollator, useLocale } from '@react-aria/i18n';
import { isFocusVisible, usePress, useHover } from '@react-aria/interactions';
import { useSelectableCollection, useSelectableItem } from '@react-aria/selection';
import { mergeProps } from '@react-aria/utils';
import { useTreeState } from '@react-stately/tree';
import React, { useRef, useMemo, useId, useEffect, useCallback, createContext, useContext } from 'react';
import { Icon } from '@keystar/ui/icon';
import { chevronLeftIcon } from '@keystar/ui/icon/icons/chevronLeftIcon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { dotIcon } from '@keystar/ui/icon/icons/dotIcon';
import { SlotProvider } from '@keystar/ui/slots';
import { useStyleProps, classNames, css, tokenSchema, toDataAttributes } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

class TreeKeyboardDelegate {
  constructor(collator, collection, disabledKeys) {
    this.collator = collator;
    this.collection = collection;
    this.disabledKeys = disabledKeys;
  }
  getKeyAbove(key) {
    let {
      collection,
      disabledKeys
    } = this;
    let keyBefore = collection.getKeyBefore(key);
    while (keyBefore !== null) {
      let item = collection.getItem(keyBefore);
      if ((item === null || item === void 0 ? void 0 : item.type) === 'item' && !disabledKeys.has(item.key)) {
        return keyBefore;
      }
      keyBefore = collection.getKeyBefore(keyBefore);
    }
    return null;
  }
  getKeyBelow(key) {
    let {
      collection,
      disabledKeys
    } = this;
    let keyBelow = collection.getKeyAfter(key);
    while (keyBelow !== null) {
      let item = collection.getItem(keyBelow);
      if ((item === null || item === void 0 ? void 0 : item.type) === 'item' && !disabledKeys.has(item.key)) {
        return keyBelow;
      }
      keyBelow = collection.getKeyAfter(keyBelow);
    }
    return null;
  }
  getFirstKey() {
    let {
      collection,
      disabledKeys
    } = this;
    let key = collection.getFirstKey();
    while (key !== null) {
      let item = collection.getItem(key);
      if ((item === null || item === void 0 ? void 0 : item.type) === 'item' && !disabledKeys.has(item.key)) {
        return key;
      }
      key = collection.getKeyAfter(key);
    }
    return null;
  }
  getLastKey() {
    let {
      collection,
      disabledKeys
    } = this;
    let key = collection.getLastKey();
    while (key !== null) {
      let item = collection.getItem(key);
      if ((item === null || item === void 0 ? void 0 : item.type) === 'item' && !disabledKeys.has(item.key)) {
        return key;
      }
      key = collection.getKeyBefore(key);
    }
    return null;
  }
  getKeyForSearch(search, fromKey = this.getFirstKey()) {
    let {
      collator,
      collection
    } = this;
    let key = fromKey;
    while (key !== null) {
      let item = collection.getItem(key);
      if (item !== null && item !== void 0 && item.textValue && collator.compare(search, item.textValue.slice(0, search.length)) === 0) {
        return key;
      }
      key = this.getKeyBelow(key);
    }
    return null;
  }
}

const TreeContext = /*#__PURE__*/createContext(null);
function useTreeContext() {
  let context = useContext(TreeContext);
  if (context === null) {
    throw new Error('NavTree: missing context');
  }
  return context;
}
function NavTree(props) {
  let {
    onAction,
    onSelectionChange,
    selectedKey,
    ...otherProps
  } = props;
  let ref = useRef(null);
  let styleProps = useStyleProps(props);

  // tweak selection behaviour
  let [selectedAncestralKeys, setSelectedAncestralKeys] = React.useState([]);
  let selectionProps = useMemo(() => {
    if (selectedKey) {
      let selectedKeys = new Set([selectedKey]);
      return {
        selectedKeys,
        selectionMode: 'single'
      };
    }
    return {};
  }, [selectedKey]);

  // tree state
  let state = useTreeState({
    ...otherProps,
    ...selectionProps
  });
  let collator = useCollator({
    usage: 'search',
    sensitivity: 'base'
  });
  let keyboardDelegate = useMemo(() => new TreeKeyboardDelegate(collator, state.collection, state.disabledKeys), [collator, state.collection, state.disabledKeys]);
  let {
    collectionProps
  } = useSelectableCollection({
    ...props,
    allowsTabNavigation: true,
    keyboardDelegate,
    ref,
    selectionManager: state.selectionManager
  });
  let id = useId();
  let context = useMemo(() => ({
    id,
    onAction,
    onSelectionChange,
    selectedAncestralKeys
  }), [id, onAction, onSelectionChange, selectedAncestralKeys]);
  useEffect(() => {
    if (state.selectionManager.firstSelectedKey) {
      let item = state.collection.getItem(state.selectionManager.firstSelectedKey);
      if (item) {
        let ancestors = getAncestors(state.collection, item);
        setSelectedAncestralKeys(ancestors.map(item => item.key));
      }
    }
  }, [state.collection, state.selectionManager.firstSelectedKey]);
  return /*#__PURE__*/jsx(TreeContext.Provider, {
    value: context,
    children: /*#__PURE__*/jsx("div", {
      ...collectionProps,
      ...styleProps,
      className: classNames(styleProps.className, css({
        outline: 'none'
      })),
      ref: ref,
      role: "treegrid",
      children: resolveTreeNodes({
        nodes: state.collection,
        state
      })
    })
  });
}
function resolveTreeNodes({
  nodes,
  state
}) {
  return Array.from(nodes).map(node => {
    let Comp = node.type === 'section' ? TreeSection : TreeItem;
    return /*#__PURE__*/jsx(Comp, {
      node: node,
      state: state
    }, node.key);
  });
}

// TODO: review accessibility
function TreeSection({
  node,
  state
}) {
  return /*#__PURE__*/jsxs(Fragment, {
    children: [/*#__PURE__*/jsx("div", {
      role: "rowgroup",
      children: /*#__PURE__*/jsx("div", {
        role: "row",
        children: /*#__PURE__*/jsx("div", {
          role: "columnheader",
          "aria-sort": "none",
          children: /*#__PURE__*/jsx(Text, {
            casing: "uppercase",
            size: "small",
            color: "neutralSecondary",
            weight: "medium",
            UNSAFE_className: css({
              paddingBlock: tokenSchema.size.space.medium,
              paddingInline: tokenSchema.size.space.medium
            }),
            children: node.rendered
          })
        })
      })
    }), /*#__PURE__*/jsx("div", {
      role: "rowgroup",
      children: resolveTreeNodes({
        nodes: getChildNodes(node, state.collection),
        state
      })
    })]
  });
}
function TreeItem({
  node,
  state
}) {
  let ref = useRef(null);
  let {
    direction
  } = useLocale();
  let {
    itemProps,
    isExpanded,
    isPressed,
    isHovered,
    isFocused,
    isSelectedAncestor
  } = useTreeItem({
    node
  }, state, ref);
  let isRtl = direction === 'rtl';
  let contents = isReactText(node.rendered) ? /*#__PURE__*/jsx(Text, {
    children: node.rendered
  }) : node.rendered;
  let itemClassName = css({
    color: tokenSchema.color.alias.foregroundIdle,
    cursor: 'default',
    fontWeight: tokenSchema.typography.fontWeight.medium,
    position: 'relative',
    outline: 'none',
    padding: tokenSchema.size.alias.focusRing,
    paddingInlineStart: tokenSchema.size.space.regular
  });
  let itemStyle = useCallback((...selectors) => selectors.map(selector => `.${itemClassName}${selector}`).join(', '), [itemClassName]);
  return /*#__PURE__*/jsxs(SlotProvider, {
    slots: {
      button: {
        isHidden: !(isFocused && isFocusVisible()) && !isHovered,
        elementType: 'span',
        marginStart: 'auto',
        prominence: 'low'
      },
      text: {
        color: 'inherit',
        truncate: true,
        weight: 'inherit'
      }
    },
    children: [/*#__PURE__*/jsx("div", {
      ...itemProps,
      ...toDataAttributes({
        selectedAncestor: isSelectedAncestor || undefined,
        hovered: isHovered || undefined,
        pressed: isPressed || undefined,
        focused: isFocused ? isFocusVisible() ? 'visible' : 'true' : undefined
      }),
      ref: ref,
      role: "row",
      className: itemClassName,
      children: /*#__PURE__*/jsxs("div", {
        role: "gridcell",
        className: css({
          alignItems: 'center',
          // borderRadius: `calc(${tokenSchema.size.radius.regular} + ${tokenSchema.size.alias.focusRing})`,
          borderRadius: tokenSchema.size.radius.regular,
          display: 'flex',
          gap: tokenSchema.size.space.small,
          minHeight: tokenSchema.size.element.regular,
          paddingInlineStart: `calc(${tokenSchema.size.space.regular} * var(--inset))`,
          '[role=rowgroup] &': {
            paddingInlineStart: `calc(${tokenSchema.size.space.regular} * calc(var(--inset) - 1))`
          },
          // interaction states
          [itemStyle('[data-hovered] > &')]: {
            backgroundColor: tokenSchema.color.alias.backgroundHovered,
            color: tokenSchema.color.alias.foregroundHovered
          },
          [itemStyle('[data-pressed] > &')]: {
            backgroundColor: tokenSchema.color.alias.backgroundPressed,
            color: tokenSchema.color.alias.foregroundPressed
          },
          [itemStyle('[data-focused=visible] > &')]: {
            outline: `${tokenSchema.size.alias.focusRing} solid ${tokenSchema.color.alias.focusRing}`
          },
          // indicate when a collapsed item contains the selected item, so
          // that the user always knows where they are in the tree
          [itemStyle('[data-selected-ancestor=true][aria-expanded=false] > &')]: {
            '&::before': {
              backgroundColor: tokenSchema.color.background.accentEmphasis,
              borderRadius: tokenSchema.size.space.small,
              content: '""',
              insetBlockStart: `50%`,
              insetInlineStart: 0,
              marginBlockStart: `calc(${tokenSchema.size.space.medium} / 2 * -1)`,
              position: 'absolute',
              height: tokenSchema.size.space.medium,
              width: tokenSchema.size.space.small
            }
          },
          // selected item
          [itemStyle('[aria-current=page] > &')]: {
            backgroundColor: tokenSchema.color.alias.backgroundHovered,
            color: tokenSchema.color.alias.foregroundHovered,
            fontWeight: tokenSchema.typography.fontWeight.semibold,
            '&::before': {
              backgroundColor: tokenSchema.color.background.accentEmphasis,
              borderRadius: tokenSchema.size.space.small,
              content: '""',
              insetBlock: tokenSchema.size.space.small,
              insetInlineStart: 0,
              position: 'absolute',
              width: tokenSchema.size.space.small
            }
          },
          [itemStyle('[aria-current=page][data-hovered] > &')]: {
            backgroundColor: tokenSchema.color.alias.backgroundPressed
          }
        }),
        style: {
          // @ts-expect-error
          '--inset': node.level + 1
        },
        children: [node.hasChildNodes ? /*#__PURE__*/jsx(Icon, {
          src: isRtl ? chevronLeftIcon : chevronRightIcon,
          color: "neutralTertiary",
          UNSAFE_style: {
            transform: `rotate(${isExpanded ? isRtl ? -90 : 90 : 0}deg)`
          }
        }) : /*#__PURE__*/jsx(Icon, {
          src: dotIcon,
          color: "neutralTertiary"
        }), contents]
      })
    }), isExpanded && resolveTreeNodes({
      nodes: getChildNodes(node, state.collection),
      state
    })]
  });
}
/**
 * Provides the behavior and accessibility implementation for an item within a tree.
 * @param props - Props for the tree item.
 * @param state - State of the parent list, as returned by `useTreeState`.
 * @param ref - The ref attached to the tree element.
 */
function useTreeItem(props, state, ref) {
  let {
    node,
    isVirtualized
  } = props;
  let {
    selectionManager
  } = state;
  let treeData = useTreeContext();
  let {
    direction
  } = useLocale();
  let isExpanded = state.expandedKeys.has(node.key);
  let isSelectedAncestor = treeData === null || treeData === void 0 ? void 0 : treeData.selectedAncestralKeys.includes(node.key);
  let onPress = e => {
    var _treeData$onAction;
    (_treeData$onAction = treeData.onAction) === null || _treeData$onAction === void 0 || _treeData$onAction.call(treeData, node.key);
    if (node.hasChildNodes) {
      // allow the user to alt+click to expand/collapse all descendants
      if (e.altKey) {
        let descendants = getDescendantNodes(node, state.collection);
        let newKeys = new Set(state.expandedKeys);
        for (let descendant of descendants) {
          if (isExpanded) {
            newKeys.delete(descendant.key);
          } else {
            newKeys.add(descendant.key);
          }
        }
        state.setExpandedKeys(newKeys);
      } else {
        state.toggleKey(node.key);
      }
    } else {
      var _treeData$onSelection;
      (_treeData$onSelection = treeData.onSelectionChange) === null || _treeData$onSelection === void 0 || _treeData$onSelection.call(treeData, node.key);
    }
  };
  let {
    itemProps: selectableItemProps,
    ...itemStates
  } = useSelectableItem({
    key: node.key,
    selectionManager,
    ref,
    isVirtualized,
    // shouldUseVirtualFocus: true,
    shouldSelectOnPressUp: true
  });
  let {
    pressProps
  } = usePress({
    onPress,
    isDisabled: itemStates.isDisabled
  });
  let {
    isHovered,
    hoverProps
  } = useHover({
    isDisabled: itemStates.isDisabled
  });
  let onKeyDownCapture = e => {
    if (!ref.current || !e.currentTarget.contains(e.target)) {
      return;
    }
    let handleArrowBackward = () => {
      if (node.hasChildNodes && isExpanded) {
        if (e.altKey) {
          let expandedKeys = new Set(state.expandedKeys);
          for (let descendant of getDescendantNodes(node, state.collection)) {
            expandedKeys.delete(descendant.key);
          }
          state.setExpandedKeys(expandedKeys);
        } else {
          state.toggleKey(node.key);
        }
      } else if (node !== null && node !== void 0 && node.parentKey) {
        let parentNode = state.collection.getItem(node.parentKey);
        if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.type) === 'item') {
          selectionManager.setFocusedKey(node.parentKey);
        }
      }
    };
    let handleArrowForward = () => {
      if (node.hasChildNodes && !isExpanded) {
        if (e.altKey) {
          let expandedKeys = new Set(state.expandedKeys);
          for (let descendant of getDescendantNodes(node, state.collection)) {
            expandedKeys.add(descendant.key);
          }
          state.setExpandedKeys(expandedKeys);
        } else {
          state.toggleKey(node.key);
        }
      } else if (node.hasChildNodes) {
        let firstChild = state.collection.getKeyAfter(node.key);
        if (firstChild) {
          selectionManager.setFocusedKey(firstChild);
        }
      }
    };
    switch (e.key) {
      case 'ArrowLeft':
        {
          e.preventDefault();
          if (direction === 'rtl') {
            handleArrowForward();
          } else {
            handleArrowBackward();
          }
          break;
        }
      case 'ArrowRight':
        {
          e.preventDefault();
          if (direction === 'rtl') {
            handleArrowBackward();
          } else {
            handleArrowForward();
          }
          break;
        }
    }
  };
  let itemProps = {
    ...mergeProps(selectableItemProps, pressProps, hoverProps),
    onKeyDownCapture,
    'aria-label': node.textValue || undefined,
    'aria-disabled': itemStates.isDisabled || undefined,
    'aria-level': node.level + 1,
    'aria-expanded': node.hasChildNodes ? isExpanded : undefined,
    'aria-current': itemStates.isSelected ? 'page' : undefined
  };
  if (isVirtualized) {
    var _state$collection$get;
    let index = Number((_state$collection$get = state.collection.getItem(node.key)) === null || _state$collection$get === void 0 ? void 0 : _state$collection$get.index);
    itemProps['aria-posinset'] = Number.isNaN(index) ? undefined : index + 1;
    itemProps['aria-setsize'] = getItemCount(state.collection);
  }
  return {
    itemProps,
    ...itemStates,
    isExpanded: node.hasChildNodes && isExpanded,
    isSelectedAncestor,
    isHovered
  };
}

/** Get descendants that contain children, inclusive of the root node. */
function getDescendantNodes(node, collection, depth = Infinity) {
  const descendants = new Set();
  if (depth === 0 || !node.hasChildNodes) {
    return descendants;
  }
  descendants.add(node);
  for (let child of getChildNodes(node, collection)) {
    const childDescendants = getDescendantNodes(child, collection, depth - 1);
    for (let descendant of childDescendants) {
      descendants.add(descendant);
    }
  }
  return descendants;
}
function getAncestors(collection, node) {
  let parents = [];
  while (((_node = node) === null || _node === void 0 ? void 0 : _node.parentKey) != null) {
    var _node;
    // @ts-expect-error if there's a `parentKey`, there's a parent...
    node = collection.getItem(node.parentKey);
    parents.unshift(node);
  }
  return parents;
}

export { NavTree };
