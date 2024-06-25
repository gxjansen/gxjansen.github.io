'use client';
export { Item } from '@react-stately/collections';
import { useGridListItem, useGridListSelectionCheckbox, useGridList } from '@react-aria/gridlist';
import { useFocusRing, FocusScope } from '@react-aria/focus';
import { useLocale, useLocalizedStringFormatter, useCollator } from '@react-aria/i18n';
import { Virtualizer } from '@react-aria/virtualizer';
import { mergeProps, useObjectRef, filterDOMProps } from '@react-aria/utils';
import { ListLayout } from '@react-stately/layout';
import { useListState } from '@react-stately/list';
import { assert } from 'emery';
import React, { createContext, useContext, useRef, useEffect, useMemo } from 'react';
import { KeystarProvider, useProvider } from '@keystar/ui/core';
import { ProgressCircle } from '@keystar/ui/progress';
import { ClassList, toDataAttributes, classNames, css, tokenSchema, FocusRing, transition, useStyleProps } from '@keystar/ui/style';
import { Grid, Flex } from '@keystar/ui/layout';
import { SlotProvider, ClearSlots } from '@keystar/ui/slots';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useVisuallyHidden } from '@react-aria/visually-hidden';
import { useButton } from '@react-aria/button';
import { useHover } from '@react-aria/interactions';
import { Checkbox } from '@keystar/ui/checkbox';
import { Icon } from '@keystar/ui/icon';
import { chevronLeftIcon } from '@keystar/ui/icon/icons/chevronLeftIcon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { gripVerticalIcon } from '@keystar/ui/icon/icons/gripVerticalIcon';

const listViewClassList = new ClassList('ListView', ['centered-wrapper']);
const listViewItemClassList = new ClassList('ListViewItem', ['actionmenu', 'actions', 'badge', 'checkbox', 'content', 'description', 'draghandle', 'grid', 'parent-indicator', 'row', 'thumbnail']);

const ListViewContext =
/*#__PURE__*/
// @ts-expect-error
createContext(null);
const ListViewProvider = ListViewContext.Provider;
function useListViewContext() {
  let context = useContext(ListViewContext);
  if (!context) {
    throw new Error('Attempt to access `ListViewContext` outside of its provided.');
  }
  return context;
}

var localizedMessages = {
	"ar-AE": {
		loading: "جارٍ التحميل...",
		loadingMore: "جارٍ تحميل المزيد..."
	},
	"bg-BG": {
		loading: "Зареждане...",
		loadingMore: "Зареждане на още..."
	},
	"cs-CZ": {
		loading: "Načítání...",
		loadingMore: "Načítání dalších..."
	},
	"da-DK": {
		loading: "Indlæser...",
		loadingMore: "Indlæser flere..."
	},
	"de-DE": {
		loading: "Laden...",
		loadingMore: "Mehr laden ..."
	},
	"el-GR": {
		loading: "Φόρτωση...",
		loadingMore: "Φόρτωση περισσότερων..."
	},
	"en-US": {
		loading: "Loading…",
		loadingMore: "Loading more…"
	},
	"es-ES": {
		loading: "Cargando…",
		loadingMore: "Cargando más…"
	},
	"et-EE": {
		loading: "Laadimine...",
		loadingMore: "Laadi rohkem..."
	},
	"fi-FI": {
		loading: "Ladataan…",
		loadingMore: "Ladataan lisää…"
	},
	"fr-FR": {
		loading: "Chargement...",
		loadingMore: "Chargement supplémentaire..."
	},
	"he-IL": {
		loading: "טוען...",
		loadingMore: "טוען עוד..."
	},
	"hr-HR": {
		loading: "Učitavam...",
		loadingMore: "Učitavam još..."
	},
	"hu-HU": {
		loading: "Betöltés folyamatban…",
		loadingMore: "Továbbiak betöltése folyamatban…"
	},
	"it-IT": {
		loading: "Caricamento...",
		loadingMore: "Caricamento altri..."
	},
	"ja-JP": {
		loading: "読み込み中...",
		loadingMore: "さらに読み込み中..."
	},
	"ko-KR": {
		loading: "로드 중…",
		loadingMore: "추가 로드 중…"
	},
	"lt-LT": {
		loading: "Įkeliama...",
		loadingMore: "Įkeliama daugiau..."
	},
	"lv-LV": {
		loading: "Notiek ielāde...",
		loadingMore: "Tiek ielādēts vēl..."
	},
	"nb-NO": {
		loading: "Laster inn ...",
		loadingMore: "Laster inn flere ..."
	},
	"nl-NL": {
		loading: "Laden...",
		loadingMore: "Meer laden..."
	},
	"pl-PL": {
		loading: "Ładowanie...",
		loadingMore: "Wczytywanie większej liczby..."
	},
	"pt-BR": {
		loading: "Carregando...",
		loadingMore: "Carregando mais..."
	},
	"pt-PT": {
		loading: "A carregar...",
		loadingMore: "A carregar mais..."
	},
	"ro-RO": {
		loading: "Se încarcă...",
		loadingMore: "Se încarcă mai multe..."
	},
	"ru-RU": {
		loading: "Загрузка...",
		loadingMore: "Дополнительная загрузка..."
	},
	"sk-SK": {
		loading: "Načítava sa...",
		loadingMore: "Načítava sa viac..."
	},
	"sl-SI": {
		loading: "Nalaganje ...",
		loadingMore: "Nalaganje več vsebine ..."
	},
	"sr-SP": {
		loading: "Učitavam...",
		loadingMore: "Učitavam još..."
	},
	"sv-SE": {
		loading: "Läser in...",
		loadingMore: "Läser in mer..."
	},
	"tr-TR": {
		loading: "Yükleniyor...",
		loadingMore: "Daha fazla yükleniyor..."
	},
	"uk-UA": {
		loading: "Завантаження…",
		loadingMore: "Завантаження інших об’єктів..."
	},
	"zh-CN": {
		loading: "正在加载...",
		loadingMore: "正在加载更多..."
	},
	"zh-T": {
		loading: "載入中…",
		loadingMore: "正在載入更多…"
	}
};

function DragPreview(props) {
  let {
    item,
    itemCount,
    itemHeight,
    density
  } = props;
  let isDraggingMultiple = itemCount > 1;
  return /*#__PURE__*/jsx("div", {
    ...toDataAttributes({
      density,
      multi: isDraggingMultiple
    }),
    style: {
      height: itemHeight
    },
    className: classNames(css({
      display: 'grid',
      backgroundColor: tokenSchema.color.background.canvas,
      border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderSelected}`,
      borderRadius: tokenSchema.size.radius.small,
      paddingInline: tokenSchema.size.space.medium,
      position: 'relative',
      outline: 0,
      width: tokenSchema.size.alias.singleLineWidth,
      // Density
      minHeight: tokenSchema.size.element.medium,
      paddingBlock: tokenSchema.size.space.medium,
      '&[data-density="compact"]': {
        minHeight: tokenSchema.size.element.regular,
        paddingBlock: tokenSchema.size.space.regular
      },
      '&[data-density="spacious"]': {
        minHeight: tokenSchema.size.element.large,
        paddingBlock: tokenSchema.size.space.large
      },
      // indicate that multiple items are being dragged by implying a stack
      '&[data-multi=true]::after': {
        backgroundColor: 'inherit',
        border: 'inherit',
        borderRadius: 'inherit',
        content: '" "',
        display: 'block',
        height: '100%',
        insetInlineStart: 4,
        position: 'absolute',
        top: 4,
        width: '100%',
        zIndex: -1
      }
    })),
    children: /*#__PURE__*/jsx(Grid, {
      UNSAFE_className: listViewItemClassList.element('grid'),
      columns: "auto auto 1fr auto",
      rows: "1fr auto",
      areas: ['thumbnail content     . badge', 'thumbnail description . badge'],
      alignItems: "center",
      children: /*#__PURE__*/jsxs(SlotProvider, {
        slots: {
          text: {
            gridArea: 'content',
            flexGrow: 1,
            truncate: true,
            weight: 'medium',
            UNSAFE_className: listViewItemClassList.element('content')
          },
          description: {
            color: 'neutralSecondary',
            size: 'small',
            gridArea: 'description',
            flexGrow: 1,
            marginTop: 'small',
            truncate: true,
            UNSAFE_className: listViewItemClassList.element('description')
          },
          image: {
            borderRadius: 'xsmall',
            gridArea: 'thumbnail',
            marginEnd: 'regular',
            overflow: 'hidden',
            height: density === 'compact' ? 'element.small' : 'element.regular',
            UNSAFE_className: listViewItemClassList.element('thumbnail')
          },
          button: {
            isHidden: true,
            UNSAFE_className: listViewItemClassList.element('actions')
          },
          actionGroup: {
            isHidden: true,
            UNSAFE_className: listViewItemClassList.element('actions')
          },
          actionMenu: {
            isHidden: true,
            UNSAFE_className: listViewItemClassList.element('actionmenu')
          }
        },
        children: [isReactText(item.rendered) ? /*#__PURE__*/jsx(Text, {
          children: item.rendered
        }) : item.rendered, isDraggingMultiple && /*#__PURE__*/jsx(Flex, {
          alignItems: "center",
          backgroundColor: "accentEmphasis",
          borderRadius: "small",
          gridArea: "badge",
          minWidth: "element.small",
          padding: "small",
          UNSAFE_className: listViewItemClassList.element('badge'),
          children: /*#__PURE__*/jsx(Text, {
            align: "center",
            color: "inverse",
            size: "small",
            weight: "medium",
            children: itemCount
          })
        })]
      })
    })
  });
}

function InsertionIndicator(props) {
  let {
    dropState,
    dragAndDropHooks
  } = useListViewContext();
  const {
    target,
    isPresentationOnly
  } = props;
  assert(!!dragAndDropHooks.useDropIndicator, 'dragAndDropHooks.useDropIndicator is not defined.');
  let ref = useRef(null);
  let {
    dropIndicatorProps
  } = dragAndDropHooks.useDropIndicator(props, dropState, ref);
  let {
    visuallyHiddenProps
  } = useVisuallyHidden();
  let isDropTarget = dropState.isDropTarget(target);
  if (!isDropTarget && dropIndicatorProps['aria-hidden']) {
    return null;
  }
  let maskColor = tokenSchema.color.background.canvas;
  let borderColor = tokenSchema.color.background.accentEmphasis;
  let borderSize = tokenSchema.size.border.medium;
  let circleSize = tokenSchema.size.space.regular;
  return /*#__PURE__*/jsx("div", {
    role: "row",
    "aria-hidden": dropIndicatorProps['aria-hidden'],
    children: /*#__PURE__*/jsx("div", {
      role: "gridcell",
      "aria-selected": "false",
      ...toDataAttributes({
        dropTarget: isDropTarget
      }),
      className: classNames(css({
        insetInlineStart: circleSize,
        outline: 'none',
        position: 'absolute',
        width: `calc(100% - (2 * ${circleSize}))`,
        '&[data-drop-target=true]': {
          borderBottom: `${borderSize} solid ${borderColor}`,
          '&::before': {
            left: `calc(${circleSize} * -1)`
          },
          '&::after': {
            right: `calc(${circleSize} * -1)`
          },
          '&::before, &::after': {
            backgroundColor: maskColor,
            border: `${borderSize} solid ${borderColor}`,
            borderRadius: '50%',
            content: '" "',
            height: circleSize,
            position: 'absolute',
            top: `calc(${circleSize} / -2 - ${borderSize} / 2)`,
            width: circleSize,
            zIndex: 5
          }
        }
      })),
      children: !isPresentationOnly && /*#__PURE__*/jsx("div", {
        ...visuallyHiddenProps,
        role: "button",
        ...dropIndicatorProps,
        ref: ref
      })
    })
  });
}

function ListViewItem(props) {
  var _draggableItem, _draggableItem2, _dropIndicator, _dropIndicator2;
  let {
    item
  } = props;
  let {
    density,
    dragAndDropHooks,
    dragState,
    dropState,
    isListDraggable,
    isListDroppable,
    layout,
    loadingState,
    overflowMode,
    state
  } = useListViewContext();
  let {
    direction
  } = useLocale();
  let rowRef = useRef(null);
  let {
    isFocusVisible: isFocusVisibleWithin,
    focusProps: focusWithinProps
  } = useFocusRing({
    within: true
  });
  let {
    isFocusVisible,
    focusProps
  } = useFocusRing();
  let {
    rowProps,
    gridCellProps,
    isPressed,
    descriptionProps,
    isDisabled,
    allowsSelection,
    hasAction
  } = useGridListItem({
    node: item,
    isVirtualized: true,
    shouldSelectOnPressUp: isListDraggable
  }, state, rowRef);
  let isDroppable = isListDroppable && !isDisabled;
  let {
    hoverProps,
    isHovered
  } = useHover({
    isDisabled: !allowsSelection && !hasAction
  });
  let {
    checkboxProps
  } = useGridListSelectionCheckbox({
    key: item.key
  }, state);
  let draggableItem;
  if (isListDraggable) {
    // FIXME: improve implementation/types such that these guards aren't necessary
    assert(!!(dragAndDropHooks && dragAndDropHooks.useDraggableItem), 'useDraggableItem is missing from dragAndDropHooks');
    draggableItem = dragAndDropHooks.useDraggableItem({
      key: item.key,
      hasDragButton: true
    }, dragState);
    if (isDisabled) {
      draggableItem = null;
    }
  }
  let isDropTarget;
  let dropIndicator;
  let dropIndicatorRef = useRef(null);
  if (isListDroppable) {
    let target = {
      type: 'item',
      key: item.key,
      dropPosition: 'on'
    };
    isDropTarget = dropState.isDropTarget(target);
    // FIXME: improve implementation/types such that these guards aren't necessary
    assert(!!(dragAndDropHooks && dragAndDropHooks.useDropIndicator), 'useDropIndicator is missing from dragAndDropHooks');
    dropIndicator = dragAndDropHooks.useDropIndicator({
      target
    }, dropState, dropIndicatorRef);
  }
  let dragButtonRef = useRef(null);
  let {
    buttonProps
  } = useButton({
    // @ts-expect-error
    ...((_draggableItem = draggableItem) === null || _draggableItem === void 0 ? void 0 : _draggableItem.dragButtonProps),
    elementType: 'div'
  }, dragButtonRef);
  let chevron = /*#__PURE__*/jsx(Icon, {
    ...toDataAttributes({
      disabled: !hasAction,
      visible: item.props.hasChildItems
    }),
    color: "neutral",
    src: direction === 'ltr' ? chevronRightIcon : chevronLeftIcon,
    "aria-hidden": "true",
    UNSAFE_className: classNames(listViewItemClassList.element('parent-indicator'), css({
      display: 'none',
      gridArea: 'chevron',
      marginInlineStart: tokenSchema.size.space.regular,
      [`${listViewItemClassList.selector('root')}[data-child-nodes=true] &`]: {
        display: 'inline-block',
        visibility: 'hidden'
      },
      '&[data-visible=true]': {
        visibility: 'visible'
      },
      '&[data-disabled=true]': {
        stroke: tokenSchema.color.alias.foregroundDisabled
      }
    }))
  });
  let showCheckbox = state.selectionManager.selectionMode !== 'none' && state.selectionManager.selectionBehavior === 'toggle';
  let {
    visuallyHiddenProps
  } = useVisuallyHidden();
  let dropProps = isDroppable ? // @ts-expect-error
  void 0  :
  // @ts-expect-error
  {
    'aria-hidden': void 0 
  };
  const mergedProps = mergeProps(rowProps, // @ts-expect-error
  (_draggableItem2 = draggableItem) === null || _draggableItem2 === void 0 ? void 0 : _draggableItem2.dragProps, dropProps, hoverProps, focusWithinProps, focusProps,
  // Remove tab index from list row if performing a screenreader drag. This prevents TalkBack from focusing the row,
  // allowing for single swipe navigation between row drop indicator
  // @ts-expect-error
  (dragAndDropHooks === null || dragAndDropHooks === void 0 ? void 0 : dragAndDropHooks.isVirtualDragging()) && {
    tabIndex: null
  });
  let isFirstRow = item.prevKey == null;
  let isLastRow = item.nextKey == null;
  // Figure out if the ListView content is equal or greater in height to the container. If so, we'll need to round the bottom
  // border corners of the last row when selected and we can get rid of the bottom border if it isn't selected to avoid border overlap
  // with bottom border
  let isFlushWithContainerBottom = false;
  if (isLastRow && loadingState !== 'loadingMore') {
    var _layout$getContentSiz, _layout$virtualizer;
    if (((_layout$getContentSiz = layout.getContentSize()) === null || _layout$getContentSiz === void 0 ? void 0 : _layout$getContentSiz.height) >= ((_layout$virtualizer = layout.virtualizer) === null || _layout$virtualizer === void 0 ? void 0 : _layout$virtualizer.getVisibleRect().height)) {
      isFlushWithContainerBottom = true;
    }
  }
  let content = isReactText(item.rendered) ? /*#__PURE__*/jsx(Text, {
    children: item.rendered
  }) : item.rendered;
  if (isDisabled) {
    content = /*#__PURE__*/jsx(KeystarProvider, {
      isDisabled: true,
      children: content
    });
  }
  return /*#__PURE__*/jsx("div", {
    ...mergedProps,
    ...toDataAttributes({
      'flush-last': isFlushWithContainerBottom
    }),
    className: classNames(listViewItemClassList.element('row'), css({
      cursor: 'default',
      outline: 0,
      position: 'relative',
      /* box shadow for bottom border */
      '&:not([data-flush-last=true])::after': {
        boxShadow: `inset 0 -1px 0 0 ${tokenSchema.color.border.neutral}`,
        content: '" "',
        display: 'block',
        insetBlockEnd: 0,
        insetBlockStart: 0,
        insetInlineEnd: 0,
        insetInlineStart: 0,
        pointerEvents: 'none',
        position: 'absolute',
        zIndex: 3
      }
    })),
    ref: rowRef,
    children: /*#__PURE__*/jsx("div", {
      ...toDataAttributes({
        first: isFirstRow || undefined,
        last: isLastRow || undefined,
        // @ts-expect-error
        droppable: isDropTarget || undefined,
        draggable: isListDraggable || undefined,
        focus: isFocusVisible ? 'visible' : isFocusVisibleWithin ? 'within' : undefined,
        interaction: isPressed ? 'press' : isHovered ? 'hover' : undefined
      }),
      className: classNames(listViewItemClassList.element('root'), css({
        display: 'grid',
        paddingInline: tokenSchema.size.space.medium,
        position: 'relative',
        outline: 0,
        // density
        minHeight: tokenSchema.size.element.medium,
        paddingBlock: tokenSchema.size.space.medium,
        [`${listViewClassList.selector('root')}[data-density="compact"] &`]: {
          minHeight: tokenSchema.size.element.regular,
          paddingBlock: tokenSchema.size.space.regular
        },
        [`${listViewClassList.selector('root')}[data-density="spacious"] &`]: {
          minHeight: tokenSchema.size.element.large,
          paddingBlock: tokenSchema.size.space.large
        },
        // variants
        '&[data-draggable=true]': {
          paddingInlineStart: tokenSchema.size.space.small
        },
        // interactions
        '&[data-interaction="hover"]': {
          backgroundColor: tokenSchema.color.alias.backgroundHovered
        },
        '&[data-interaction="press"]': {
          backgroundColor: tokenSchema.color.alias.backgroundPressed
        },
        // focus indicator
        '&[data-focus="visible"]': {
          '&::before': {
            backgroundColor: tokenSchema.color.background.accentEmphasis,
            borderRadius: tokenSchema.size.space.small,
            content: '""',
            insetBlock: 0,
            insetInlineStart: tokenSchema.size.space.xsmall,
            marginBlock: tokenSchema.size.space.xsmall,
            marginInlineEnd: `calc(${tokenSchema.size.space.small} * -1)`,
            position: 'absolute',
            width: tokenSchema.size.space.small
          }
        },
        // selected
        [`${listViewItemClassList.selector('row')}[aria-selected="true"] &`]: {
          backgroundColor: tokenSchema.color.alias.backgroundSelected,
          // boxShadow: `0 0 0 ${tokenSchema.size.border.regular} ${tokenSchema.color.alias.focusRing}`,

          '&[data-interaction="hover"], &[data-focus="visible"]': {
            backgroundColor: tokenSchema.color.alias.backgroundSelectedHovered
          }
        }
      })),
      ...gridCellProps,
      children: /*#__PURE__*/jsxs(Grid, {
        UNSAFE_className: listViewItemClassList.element('grid')
        // minmax supports `ActionGroup` buttonLabelBehavior="collapse"
        ,
        columns: "auto auto auto 1fr minmax(0px, auto) auto auto",
        rows: "1fr auto",
        areas: ['draghandle checkbox thumbnail content actions actionmenu chevron', 'draghandle checkbox thumbnail description actions actionmenu chevron'],
        alignItems: "center",
        children: [isListDraggable && /*#__PURE__*/jsx("div", {
          className: classNames(css({
            gridArea: 'draghandle',
            display: 'flex',
            justifyContent: 'center',
            width: tokenSchema.size.element.small
          })),
          children: !isDisabled && /*#__PURE__*/jsx(FocusRing, {
            children: /*#__PURE__*/jsx("div", {
              ...buttonProps,
              className: classNames(listViewItemClassList.element('draghandle'), css({
                outline: 0,
                position: 'relative',
                // focus ring
                '::after': {
                  borderRadius: tokenSchema.size.radius.small,
                  content: '""',
                  inset: 0,
                  margin: 0,
                  position: 'absolute',
                  transition: transition(['box-shadow', 'margin'], {
                    easing: 'easeOut'
                  })
                },
                '&[data-focus=visible]::after': {
                  boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
                  margin: `calc(${tokenSchema.size.alias.focusRingGap} * -1)`
                }
              })),
              ref: dragButtonRef,
              draggable: "true",
              children: /*#__PURE__*/jsx(Icon, {
                src: gripVerticalIcon,
                color: "neutral"
              })
            })
          })
        }), isListDroppable && !((_dropIndicator = dropIndicator) !== null && _dropIndicator !== void 0 && _dropIndicator.isHidden) && /*#__PURE__*/jsx("div", {
          role: "button",
          ...visuallyHiddenProps,
          ...((_dropIndicator2 = dropIndicator) === null || _dropIndicator2 === void 0 ? void 0 : _dropIndicator2.dropIndicatorProps),
          ref: dropIndicatorRef
        }), showCheckbox && /*#__PURE__*/jsx(Flex, {
          gridArea: "checkbox",
          alignItems: "center",
          justifyContent: "center",
          children: /*#__PURE__*/jsx(Checkbox, {
            ...checkboxProps,
            UNSAFE_className: classNames(listViewItemClassList.element('checkbox'), css({
              paddingInlineEnd: tokenSchema.size.space.regular
            }))
          })
        }), /*#__PURE__*/jsxs(SlotProvider, {
          slots: {
            text: {
              color: isDisabled ? 'color.alias.foregroundDisabled' : undefined,
              gridArea: 'content',
              flexGrow: 1,
              truncate: overflowMode === 'truncate',
              weight: 'medium',
              UNSAFE_className: listViewItemClassList.element('content')
            },
            description: {
              color: isDisabled ? 'color.alias.foregroundDisabled' : 'neutralSecondary',
              size: 'small',
              gridArea: 'description',
              flexGrow: 1,
              marginTop: 'regular',
              truncate: overflowMode === 'truncate',
              UNSAFE_className: listViewItemClassList.element('description'),
              ...descriptionProps
            },
            image: {
              borderRadius: 'xsmall',
              gridArea: 'thumbnail',
              marginEnd: 'regular',
              overflow: 'hidden',
              height: density === 'compact' ? 'element.small' : 'element.regular',
              UNSAFE_className: listViewItemClassList.element('thumbnail')
            },
            button: {
              UNSAFE_className: listViewItemClassList.element('actions'),
              prominence: 'low',
              gridArea: 'actions'
            },
            actionGroup: {
              UNSAFE_className: listViewItemClassList.element('actions'),
              prominence: 'low',
              gridArea: 'actions',
              density: 'compact'
            },
            actionMenu: {
              UNSAFE_className: listViewItemClassList.element('actionmenu'),
              prominence: 'low',
              gridArea: 'actionmenu'
            }
          },
          children: [content, /*#__PURE__*/jsx(ClearSlots, {
            children: chevron
          })]
        })]
      })
    })
  });
}

function RootDropIndicator() {
  let {
    dropState,
    dragAndDropHooks
  } = useListViewContext();
  let ref = useRef(null);
  assert(!!dragAndDropHooks.useDropIndicator, 'dragAndDropHooks.useDropIndicator is not defined.');
  let {
    dropIndicatorProps
  } = dragAndDropHooks.useDropIndicator({
    target: {
      type: 'root'
    }
  }, dropState, ref);
  let isDropTarget = dropState.isDropTarget({
    type: 'root'
  });
  let {
    visuallyHiddenProps
  } = useVisuallyHidden();
  if (!isDropTarget && dropIndicatorProps['aria-hidden']) {
    return null;
  }
  return /*#__PURE__*/jsx("div", {
    role: "row",
    "aria-hidden": dropIndicatorProps['aria-hidden'],
    children: /*#__PURE__*/jsx("div", {
      role: "gridcell",
      "aria-selected": "false",
      children: /*#__PURE__*/jsx("div", {
        role: "button",
        ...visuallyHiddenProps,
        ...dropIndicatorProps,
        ref: ref
      })
    })
  });
}

const ROW_HEIGHTS = {
  compact: {
    medium: 32,
    large: 40
  },
  regular: {
    medium: 40,
    large: 50
  },
  spacious: {
    medium: 48,
    large: 60
  }
};
function useListLayout(state, density, overflowMode) {
  let {
    scale
  } = useProvider();
  let collator = useCollator({
    usage: 'search',
    sensitivity: 'base'
  });
  let isEmpty = state.collection.size === 0;
  let layout = useMemo(() => new ListLayout({
    estimatedRowHeight: ROW_HEIGHTS[density][scale],
    padding: 0,
    collator,
    loaderHeight: isEmpty ? undefined : ROW_HEIGHTS[density][scale]
  }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [collator, scale, density, isEmpty, overflowMode]);
  layout.collection = state.collection;
  layout.disabledKeys = state.disabledKeys;
  return layout;
}
function ListView(props, ref) {
  var _dropState, _droppableCollection;
  let {
    density = 'regular',
    loadingState,
    onLoadMore,
    isQuiet,
    overflowMode = 'truncate',
    onAction,
    dragAndDropHooks,
    ...otherProps
  } = props;
  let isListDraggable = !!(dragAndDropHooks !== null && dragAndDropHooks !== void 0 && dragAndDropHooks.useDraggableCollectionState);
  let isListDroppable = !!(dragAndDropHooks !== null && dragAndDropHooks !== void 0 && dragAndDropHooks.useDroppableCollectionState);
  let dragHooksProvided = useRef(isListDraggable);
  let dropHooksProvided = useRef(isListDroppable);
  useEffect(() => {
    if (dragHooksProvided.current !== isListDraggable) {
      console.warn('Drag hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.');
    }
    if (dropHooksProvided.current !== isListDroppable) {
      console.warn('Drop hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.');
    }
  }, [isListDraggable, isListDroppable]);
  let domRef = useObjectRef(ref);
  let state = useListState({
    ...props,
    selectionBehavior: props.selectionStyle === 'highlight' ? 'replace' : 'toggle'
  });
  let {
    collection,
    selectionManager
  } = state;
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let isLoading = loadingState === 'loading' || loadingState === 'loadingMore';
  let styleProps = useStyleProps(props);
  let preview = useRef(null);

  // DraggableCollectionState;
  let dragState = (() => {
    if (dragAndDropHooks != null && dragAndDropHooks.useDraggableCollectionState && dragAndDropHooks.useDraggableCollection) {
      let state = dragAndDropHooks.useDraggableCollectionState({
        collection,
        selectionManager,
        preview
      });
      dragAndDropHooks.useDraggableCollection({}, state, domRef);
      return state;
    }
  })();
  let layout = useListLayout(state, props.density || 'regular', overflowMode);
  // !!0 is false, so we can cast size or undefined and they'll be falsy
  layout.allowDisabledKeyFocus = state.selectionManager.disabledBehavior === 'selection' || !!(dragState !== null && dragState !== void 0 && dragState.draggingKeys.size);
  let DragPreview$1 = dragAndDropHooks === null || dragAndDropHooks === void 0 ? void 0 : dragAndDropHooks.DragPreview;
  let dropState;
  let droppableCollection;
  let isRootDropTarget;
  if (dragAndDropHooks && dragAndDropHooks.useDroppableCollectionState && dragAndDropHooks.useDroppableCollection) {
    dropState = dragAndDropHooks.useDroppableCollectionState({
      collection,
      selectionManager
    });
    droppableCollection = dragAndDropHooks.useDroppableCollection({
      keyboardDelegate: layout,
      dropTargetDelegate: layout
    }, dropState, domRef);
    isRootDropTarget = dropState.isDropTarget({
      type: 'root'
    });
  }
  let {
    gridProps
  } = useGridList({
    ...props,
    isVirtualized: true,
    keyboardDelegate: layout,
    onAction
  }, state, domRef);

  // Sync loading state into the layout.
  layout.isLoading = isLoading;
  let focusedKey = selectionManager.focusedKey;
  // @ts-expect-error
  if (((_dropState = dropState) === null || _dropState === void 0 || (_dropState = _dropState.target) === null || _dropState === void 0 ? void 0 : _dropState.type) === 'item') {
    focusedKey = dropState.target.key;
  }
  let hasAnyChildren = useMemo(() => [...collection].some(item => item.hasChildNodes), [collection]);
  return /*#__PURE__*/jsxs(ListViewProvider, {
    value: {
      density,
      // @ts-expect-error
      dragAndDropHooks,
      // @ts-expect-error
      dragState,
      // @ts-expect-error
      dropState,
      isListDraggable,
      isListDroppable,
      // @ts-expect-error
      layout,
      // @ts-expect-error
      loadingState,
      // @ts-expect-error
      onAction,
      overflowMode,
      state
    },
    children: [/*#__PURE__*/jsx(FocusScope, {
      children: /*#__PURE__*/jsx(FocusRing, {
        children: /*#__PURE__*/jsx(Virtualizer, {
          ...mergeProps(
          // @ts-expect-error
          isListDroppable ? (_droppableCollection = droppableCollection) === null || _droppableCollection === void 0 ? void 0 : _droppableCollection.collectionProps : {}, gridProps),
          ...filterDOMProps(otherProps),
          ...gridProps,
          ...styleProps,
          ...toDataAttributes({
            childNodes: hasAnyChildren,
            density,
            draggable: isListDraggable,
            // @ts-expect-error
            dropTarget: isRootDropTarget,
            overflowMode
          }),
          isLoading: isLoading,
          onLoadMore: onLoadMore,
          ref: domRef,
          focusedKey: focusedKey,
          scrollDirection: "vertical",
          className: classNames(listViewClassList.element('root'), css({
            backgroundColor: tokenSchema.color.background.canvas,
            border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
            borderRadius: tokenSchema.size.radius.medium,
            boxSizing: 'content-box',
            // resolves measurement/scroll issues related to border
            outline: 0,
            overflow: 'auto',
            position: 'relative',
            transform: 'translate3d(0, 0, 0)',
            userSelect: 'none',
            '&[data-drop-target=true]': {
              borderColor: tokenSchema.color.alias.focusRing,
              backgroundColor: tokenSchema.color.alias.backgroundSelected,
              boxShadow: `inset 0 0 0 1px ${tokenSchema.color.alias.focusRing}`
            },
            '&[data-focus=visible]': {
              borderColor: tokenSchema.color.alias.focusRing,
              boxShadow: `inset 0 0 0 1px ${tokenSchema.color.alias.focusRing}`
            }
          }), styleProps.className),
          layout: layout,
          collection: collection,
          transitionDuration: isLoading ? 160 : 220,
          children: (type, item) => {
            if (type === 'item') {
              return /*#__PURE__*/jsxs(Fragment, {
                children: [isListDroppable && collection.getKeyBefore(item.key) == null && /*#__PURE__*/jsx(RootDropIndicator, {}, "root"), isListDroppable && /*#__PURE__*/jsx(InsertionIndicator, {
                  target: {
                    key: item.key,
                    type: 'item',
                    dropPosition: 'before'
                  }
                }, `${item.key}-before`), /*#__PURE__*/jsx(ListViewItem, {
                  item: item,
                  isEmphasized: true,
                  hasActions: !!onAction
                }), isListDroppable && /*#__PURE__*/jsx(InsertionIndicator, {
                  target: {
                    key: item.key,
                    type: 'item',
                    dropPosition: 'after'
                  },
                  isPresentationOnly: collection.getKeyAfter(item.key) != null
                }, `${item.key}-after`)]
              });
            } else if (type === 'loader') {
              return /*#__PURE__*/jsx(CenteredWrapper, {
                children: /*#__PURE__*/jsx(ProgressCircle, {
                  isIndeterminate: true,
                  size: density === 'compact' ? 'small' : undefined,
                  "aria-label": collection.size > 0 ? stringFormatter.format('loadingMore') : stringFormatter.format('loading')
                })
              });
            } else if (type === 'placeholder') {
              let emptyState = props.renderEmptyState ? props.renderEmptyState() : null;
              if (emptyState == null) {
                return null;
              }
              return /*#__PURE__*/jsx(CenteredWrapper, {
                children: emptyState
              });
            }
          }
        })
      })
    }), DragPreview$1 && isListDraggable && /*#__PURE__*/jsx(DragPreview$1, {
      ref: preview,
      children: () => {
        // @ts-expect-error FIXME
        let item = state.collection.getItem(dragState.draggedKey);
        assert(item != null, 'Dragged item must exist in collection.');

        // @ts-expect-error
        let itemCount = dragState.draggingKeys.size;
        // @ts-expect-error
        let itemHeight = layout.getLayoutInfo(dragState.draggedKey).rect.height;
        return /*#__PURE__*/jsx(DragPreview, {
          item: item,
          itemCount: itemCount,
          itemHeight: itemHeight,
          density: density
        });
      }
    })]
  });
}
function CenteredWrapper({
  children
}) {
  let {
    state
  } = useListViewContext();
  return /*#__PURE__*/jsx("div", {
    role: "row",
    "aria-rowindex": state.collection.size + 1,
    "data-has-items": state.collection.size > 0,
    className: classNames(listViewClassList.element('centered-wrapper'), css({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      // if there's items it must be loading—add a gutter between the items
      // and the loading indicator
      '&[data-has-items=true]': {
        paddingTop: tokenSchema.size.space.regular
      }
    })),
    children: /*#__PURE__*/jsx("div", {
      role: "gridcell",
      children: children
    })
  });
}

/**
 * Displays a list of interactive items, and allows a user to navigate, select,
 * or perform an action.
 */
const _ListView = /*#__PURE__*/React.forwardRef(ListView);

export { _ListView as ListView };
