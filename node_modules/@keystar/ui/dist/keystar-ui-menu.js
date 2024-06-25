'use client';
import { getChildNodes } from '@react-stately/collections';
export { Item, Section } from '@react-stately/collections';
import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { mergeProps, useObjectRef, useSyncRef, filterDOMProps } from '@react-aria/utils';
import React, { useContext, useRef, Fragment, forwardRef } from 'react';
import { useMenuItem, useMenuSection, useMenu, useMenuTrigger } from '@react-aria/menu';
import { useTreeState } from '@react-stately/tree';
import { ListItem, listStyles } from '@keystar/ui/listbox';
import { css, tokenSchema, useStyleProps, classNames, useIsMobileDevice } from '@keystar/ui/style';
import { useFocusRing } from '@react-aria/focus';
import { useHover, PressResponder } from '@react-aria/interactions';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useSeparator } from '@react-aria/separator';
import { Divider } from '@keystar/ui/layout';
import { useMenuTriggerState } from '@react-stately/menu';
import { Tray, Popover } from '@keystar/ui/overlays';
import { SlotProvider, useSlotProps } from '@keystar/ui/slots';
import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { moreHorizontalIcon } from '@keystar/ui/icon/icons/moreHorizontalIcon';

var localizedMessages = {
	"ar-AE": {
		moreActions: "المزيد من الإجراءات"
	},
	"bg-BG": {
		moreActions: "Повече действия"
	},
	"cs-CZ": {
		moreActions: "Další akce"
	},
	"da-DK": {
		moreActions: "Flere handlinger"
	},
	"de-DE": {
		moreActions: "Mehr Aktionen"
	},
	"el-GR": {
		moreActions: "Περισσότερες ενέργειες"
	},
	"en-US": {
		moreActions: "More actions"
	},
	"es-ES": {
		moreActions: "Más acciones"
	},
	"et-EE": {
		moreActions: "Veel toiminguid"
	},
	"fi-FI": {
		moreActions: "Lisää toimintoja"
	},
	"fr-FR": {
		moreActions: "Autres actions"
	},
	"he-IL": {
		moreActions: "פעולות נוספות"
	},
	"hr-HR": {
		moreActions: "Dodatne radnje"
	},
	"hu-HU": {
		moreActions: "További lehetőségek"
	},
	"it-IT": {
		moreActions: "Altre azioni"
	},
	"ja-JP": {
		moreActions: "その他のアクション"
	},
	"ko-KR": {
		moreActions: "기타 작업"
	},
	"lt-LT": {
		moreActions: "Daugiau veiksmų"
	},
	"lv-LV": {
		moreActions: "Citas darbības"
	},
	"nb-NO": {
		moreActions: "Flere handlinger"
	},
	"nl-NL": {
		moreActions: "Meer handelingen"
	},
	"pl-PL": {
		moreActions: "Więcej akcji"
	},
	"pt-BR": {
		moreActions: "Mais ações"
	},
	"pt-PT": {
		moreActions: "Mais ações"
	},
	"ro-RO": {
		moreActions: "Mai multe acțiuni"
	},
	"ru-RU": {
		moreActions: "Дополнительные действия"
	},
	"sk-SK": {
		moreActions: "Ďalšie akcie"
	},
	"sl-SI": {
		moreActions: "Več možnosti"
	},
	"sr-SP": {
		moreActions: "Dodatne radnje"
	},
	"sv-SE": {
		moreActions: "Fler åtgärder"
	},
	"tr-TR": {
		moreActions: "Daha fazla eylem"
	},
	"uk-UA": {
		moreActions: "Більше дій"
	},
	"zh-CN": {
		moreActions: "更多操作"
	},
	"zh-TW": {
		moreActions: "更多動作"
	}
};

const MenuContext = /*#__PURE__*/React.createContext({});
function useMenuContext() {
  return useContext(MenuContext);
}

/** @private */
function MenuItem(props) {
  let {
    item,
    state,
    isVirtualized,
    onAction
  } = props;
  let {
    onClose,
    closeOnSelect
  } = useMenuContext();
  let {
    rendered,
    key
  } = item;
  let isSelected = state.selectionManager.isSelected(key);
  let isDisabled = state.selectionManager.isDisabled(key);
  let ref = useRef(null);
  let {
    menuItemProps,
    labelProps,
    descriptionProps,
    keyboardShortcutProps
  } = useMenuItem({
    isSelected,
    isDisabled,
    'aria-label': item['aria-label'],
    key,
    onClose,
    closeOnSelect,
    isVirtualized,
    onAction
  }, state, ref);
  let {
    hoverProps,
    isHovered
  } = useHover({
    isDisabled
  });
  let {
    focusProps,
    isFocusVisible
  } = useFocusRing();
  let contents = isReactText(rendered) ? /*#__PURE__*/jsx(Text, {
    children: rendered
  }) : rendered;
  // NOTE: Support for `disabledBehavior` is not yet implemented in react-aria.
  let role = state.selectionManager.disabledBehavior === 'selection' && state.disabledKeys.has(key) ? 'menuitem' : undefined;
  return /*#__PURE__*/jsx(ListItem, {
    ...mergeProps(menuItemProps, {
      role
    }, hoverProps, focusProps),
    elementType: item.props.href ? 'a' : 'div',
    descriptionProps: descriptionProps,
    keyboardShortcutProps: keyboardShortcutProps,
    labelProps: labelProps,
    isHovered: isHovered,
    isFocused: isFocusVisible,
    isSelected: isSelected,
    ref: ref,
    children: contents
  });
}

/** @private */
function MenuSection(props) {
  let {
    item,
    state,
    onAction
  } = props;
  let {
    itemProps,
    headingProps,
    groupProps
  } = useMenuSection({
    heading: item.rendered,
    'aria-label': item['aria-label']
  });
  let {
    separatorProps
  } = useSeparator({});
  return /*#__PURE__*/jsxs(Fragment, {
    children: [item.key !== state.collection.getFirstKey() && /*#__PURE__*/jsx(Divider, {
      ...separatorProps,
      marginY: "small"
    }), /*#__PURE__*/jsxs("div", {
      ...itemProps,
      children: [item.rendered && /*#__PURE__*/jsx(Text, {
        casing: "uppercase",
        size: "small",
        color: "neutralSecondary",
        weight: "medium",
        UNSAFE_className: css({
          paddingBlock: tokenSchema.size.space.regular,
          paddingInline: tokenSchema.size.space.medium
        }),
        ...headingProps,
        children: item.rendered
      }), /*#__PURE__*/jsx("div", {
        ...groupProps,
        children: [...getChildNodes(item, state.collection)].map(node => {
          let item = /*#__PURE__*/jsx(MenuItem, {
            item: node,
            state: state,
            onAction: onAction
          }, node.key);
          if (node.wrapper) {
            item = node.wrapper(item);
          }
          return item;
        })
      })]
    })]
  });
}

function Menu(props, forwardedRef) {
  let contextProps = useContext(MenuContext);
  let completeProps = {
    ...mergeProps(contextProps, props)
  };
  let domRef = useObjectRef(forwardedRef);
  let state = useTreeState(completeProps);
  let {
    menuProps
  } = useMenu(completeProps, state, domRef);
  let styleProps = useStyleProps(completeProps);
  useSyncRef(contextProps, domRef);
  return /*#__PURE__*/jsx("div", {
    ...menuProps,
    ...styleProps,
    ref: domRef,
    className: classNames(listStyles, styleProps.className),
    "data-selection": state.selectionManager.selectionMode,
    children: [...state.collection].map(item => {
      if (item.type === 'section') {
        return /*#__PURE__*/jsx(MenuSection, {
          item: item,
          state: state,
          onAction: completeProps.onAction
        }, item.key);
      }
      let menuItem = /*#__PURE__*/jsx(MenuItem, {
        item: item,
        state: state,
        onAction: completeProps.onAction
      }, item.key);
      if (item.wrapper) {
        menuItem = item.wrapper(menuItem);
      }
      return menuItem;
    })
  });
}

/**
 * Menus display a list of actions or options that a user can choose.
 */
// forwardRef doesn't support generic parameters, so cast the result to the correct type
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
const _Menu = /*#__PURE__*/React.forwardRef(Menu);

/**
 * The MenuTrigger serves as a wrapper around a Menu and its associated trigger,
 * linking the Menu's open state with the trigger's press state.
 */
const MenuTrigger = /*#__PURE__*/forwardRef(function MenuTrigger(props, forwardedRef) {
  let triggerRef = useRef(null);
  let domRef = useObjectRef(forwardedRef);
  let menuTriggerRef = domRef || triggerRef;
  let menuRef = useRef(null);
  let {
    children,
    align = 'start',
    shouldFlip = true,
    direction = 'bottom',
    closeOnSelect,
    trigger = 'press'
  } = props;
  let [menuTrigger, menu] = React.Children.toArray(children);
  let state = useMenuTriggerState(props);
  let {
    menuTriggerProps,
    menuProps
  } = useMenuTrigger({
    trigger
  }, state, menuTriggerRef);
  let initialPlacement;
  switch (direction) {
    case 'left':
    case 'right':
    case 'start':
    case 'end':
      initialPlacement = `${direction} ${align === 'end' ? 'bottom' : 'top'}`;
      break;
    case 'bottom':
    case 'top':
    default:
      initialPlacement = `${direction} ${align}`;
  }
  let isMobile = useIsMobileDevice();
  let menuContext = {
    ...menuProps,
    ref: menuRef,
    onClose: state.close,
    closeOnSelect,
    autoFocus: state.focusStrategy || true,
    UNSAFE_style: isMobile ? {
      width: '100%',
      maxHeight: 'inherit'
    } : {
      maxWidth: tokenSchema.size.dialog.xsmall
    }
  };

  // On small screen devices, the menu is rendered in a tray, otherwise a popover.
  let overlay;
  if (isMobile) {
    overlay = /*#__PURE__*/jsx(Tray, {
      state: state,
      children: menu
    });
  } else {
    overlay = /*#__PURE__*/jsx(Popover, {
      state: state,
      triggerRef: menuTriggerRef,
      scrollRef: menuRef,
      placement: initialPlacement,
      hideArrow: true,
      shouldFlip: shouldFlip,
      children: menu
    });
  }
  return /*#__PURE__*/jsxs(Fragment, {
    children: [/*#__PURE__*/jsx(SlotProvider, {
      slots: {
        actionButton: {
          holdAffordance: trigger === 'longPress'
        }
      },
      children: /*#__PURE__*/jsx(PressResponder, {
        ...menuTriggerProps,
        ref: menuTriggerRef,
        isPressed: state.isOpen,
        children: menuTrigger
      })
    }), /*#__PURE__*/jsx(MenuContext.Provider, {
      // TODO: Fix this type error
      // @ts-expect-error
      value: menuContext,
      children: overlay
    })]
  });
});

function ActionMenu(props, ref) {
  props = useSlotProps(props, 'actionMenu');
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let buttonProps = filterDOMProps(props, {
    labelable: true
  });
  if (buttonProps['aria-label'] === undefined) {
    buttonProps['aria-label'] = stringFormatter.format('moreActions');
  }
  return /*#__PURE__*/jsxs(MenuTrigger, {
    isOpen: props.isOpen,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
    align: props.align,
    direction: props.direction,
    shouldFlip: props.shouldFlip,
    children: [/*#__PURE__*/jsx(ActionButton, {
      ref: ref,
      ...props,
      ...buttonProps,
      children: /*#__PURE__*/jsx(Icon, {
        src: moreHorizontalIcon
      })
    }), /*#__PURE__*/jsx(_Menu, {
      children: props.children,
      items: props.items,
      disabledKeys: props.disabledKeys,
      onAction: props.onAction
    })]
  });
}

/**
 * ActionMenu combines an ActionButton with a Menu for simple "more actions" use cases.
 */
const _ActionMenu = /*#__PURE__*/forwardRef(ActionMenu);

export { _ActionMenu as ActionMenu, _Menu as Menu, MenuTrigger };
