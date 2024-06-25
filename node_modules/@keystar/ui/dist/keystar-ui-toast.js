'use client';
import { useToastQueue, ToastQueue } from '@react-stately/toast';
import { forwardRef, useMemo, useRef, useEffect, useSyncExternalStore } from 'react';
import { warning } from 'emery';
import { useLocalizedStringFormatter, useLocale } from '@react-aria/i18n';
import { useToast, useToastRegion } from '@react-aria/toast';
import { useObjectRef } from '@react-aria/utils';
import { Button, ClearButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { checkCircle2Icon } from '@keystar/ui/icon/icons/checkCircle2Icon';
import { infoIcon } from '@keystar/ui/icon/icons/infoIcon';
import { alertTriangleIcon } from '@keystar/ui/icon/icons/alertTriangleIcon';
import { keyframes, useStyleProps, classNames, css, tokenSchema, useIsMobileDevice, FocusRing } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';
import { SlotProvider } from '@keystar/ui/slots';
import { jsx, jsxs } from 'react/jsx-runtime';
import ReactDOM from 'react-dom';
import { KeystarProvider } from '@keystar/ui/core';

var intlMessages = {
	"ar-AE": {
		info: "معلومات",
		critical: "خطأ",
		positive: "تم بنجاح"
	},
	"bg-BG": {
		info: "Инфо",
		critical: "Грешка",
		positive: "Успех"
	},
	"cs-CZ": {
		info: "Informace",
		critical: "Chyba",
		positive: "Úspěch"
	},
	"da-DK": {
		info: "Info",
		critical: "Fejl",
		positive: "Fuldført"
	},
	"de-DE": {
		info: "Informationen",
		critical: "Fehler",
		positive: "Erfolg"
	},
	"el-GR": {
		info: "Πληροφορίες",
		critical: "Σφάλμα",
		positive: "Επιτυχία"
	},
	"en-US": {
		info: "Info",
		critical: "Error",
		positive: "Success"
	},
	"es-ES": {
		info: "Información",
		critical: "Error",
		positive: "Éxito"
	},
	"et-EE": {
		info: "Teave",
		critical: "Viga",
		positive: "Valmis"
	},
	"fi-FI": {
		info: "Tiedot",
		critical: "Virhe",
		positive: "Onnistui"
	},
	"fr-FR": {
		info: "Infos",
		critical: "Erreur",
		positive: "Succès"
	},
	"he-IL": {
		info: "מידע",
		critical: "שגיאה",
		positive: "הצלחה"
	},
	"hr-HR": {
		info: "Informacije",
		critical: "Pogreška",
		positive: "Uspješno"
	},
	"hu-HU": {
		info: "Információ",
		critical: "Hiba",
		positive: "Siker"
	},
	"it-IT": {
		info: "Informazioni",
		critical: "Errore",
		positive: "Operazione riuscita"
	},
	"ja-JP": {
		info: "情報",
		critical: "エラー",
		positive: "成功"
	},
	"ko-KR": {
		info: "정보",
		critical: "오류",
		positive: "성공"
	},
	"lt-LT": {
		info: "Informacija",
		critical: "Klaida",
		positive: "Sėkmingai"
	},
	"lv-LV": {
		info: "Informācija",
		critical: "Kļūda",
		positive: "Izdevās"
	},
	"nb-NO": {
		info: "Info",
		critical: "Feil",
		positive: "Vellykket"
	},
	"nl-NL": {
		info: "Info",
		critical: "Fout",
		positive: "Geslaagd"
	},
	"pl-PL": {
		info: "Informacje",
		critical: "Błąd",
		positive: "Powodzenie"
	},
	"pt-BR": {
		info: "Informações",
		critical: "Erro",
		positive: "Sucesso"
	},
	"pt-PT": {
		info: "Informação",
		critical: "Erro",
		positive: "Sucesso"
	},
	"ro-RO": {
		info: "Informaţii",
		critical: "Eroare",
		positive: "Succes"
	},
	"ru-RU": {
		info: "Информация",
		critical: "Ошибка",
		positive: "Успешно"
	},
	"sk-SK": {
		info: "Informácie",
		critical: "Chyba",
		positive: "Úspech"
	},
	"sl-SI": {
		info: "Informacije",
		critical: "Napaka",
		positive: "Uspešno"
	},
	"sr-SP": {
		info: "Informacije",
		critical: "Greška",
		positive: "Uspešno"
	},
	"sv-SE": {
		info: "Info",
		critical: "Fel",
		positive: "Lyckades"
	},
	"tr-TR": {
		info: "Bilgiler",
		critical: "Hata",
		positive: "Başarılı"
	},
	"uk-UA": {
		info: "Інформація",
		critical: "Помилка",
		positive: "Успішно"
	},
	"zh-CN": {
		info: "信息",
		critical: "错误",
		positive: "成功"
	},
	"zh-TW": {
		info: "資訊",
		critical: "錯誤",
		positive: "成功"
	}
};

const ICONS = {
  info: infoIcon,
  critical: alertTriangleIcon,
  // neutral: infoIcon,
  positive: checkCircle2Icon
};
function Toast(props, ref) {
  let {
    toast: {
      key,
      animation,
      content: {
        children,
        tone,
        actionLabel,
        onAction,
        shouldCloseOnAction
      }
    },
    state,
    ...otherProps
  } = props;
  let domRef = useObjectRef(ref);
  let {
    closeButtonProps,
    titleProps,
    toastProps
  } = useToast(props, state, domRef);
  let styleProps = useStyleProps(otherProps);
  let stringFormatter = useLocalizedStringFormatter(intlMessages);
  let iconLabel = tone && tone !== 'neutral' ? stringFormatter.format(tone) : null;
  let icon = tone && tone !== 'neutral' ? ICONS[tone] : null;
  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    if (shouldCloseOnAction) {
      state.close(key);
    }
  };
  let slots = useMemo(() => ({
    text: {
      color: 'inherit'
    }
  }), []);
  return /*#__PURE__*/jsx("div", {
    ...styleProps,
    ...toastProps,
    ref: domRef,
    "data-tone": tone,
    className: classNames(css({
      borderRadius: tokenSchema.size.radius.regular,
      display: 'flex',
      margin: tokenSchema.size.space.large,
      maxWidth: tokenSchema.size.container.xsmall,
      minHeight: tokenSchema.size.element.large,
      padding: tokenSchema.size.space.regular,
      paddingInlineStart: tokenSchema.size.space.large,
      pointerEvents: 'auto',
      position: 'absolute',
      // tones
      color: tokenSchema.color.foreground.onEmphasis,
      '&[data-tone=neutral]': {
        background: tokenSchema.color.scale['slate9']
      },
      '&[data-tone=info]': {
        background: tokenSchema.color.background.accentEmphasis
      },
      '&[data-tone=positive]': {
        background: tokenSchema.color.background.positiveEmphasis
      },
      '&[data-tone=critical]': {
        background: tokenSchema.color.background.criticalEmphasis
      },
      // animations
      '&[data-animation=entering]': {
        animation: `${slideInAnim} 300ms`
      },
      '&[data-animation=exiting]': {
        animation: `${fadeOutAnim} 300ms forwards`
      }
    }), styleProps.className),
    style: {
      ...styleProps.style,
      zIndex: props.toast.priority
    },
    "data-animation": animation,
    onAnimationEnd: () => {
      if (animation === 'exiting') {
        state.remove(key);
      }
    },
    children: /*#__PURE__*/jsxs(SlotProvider, {
      slots: slots,
      children: [icon && /*#__PURE__*/jsx(Icon, {
        "aria-label": iconLabel,
        src: icon,
        size: "medium",
        marginTop: "small",
        marginEnd: "regular"
      }), /*#__PURE__*/jsxs("div", {
        className: classNames(css({
          alignItems: 'center',
          display: 'flex',
          columnGap: tokenSchema.size.space.large,
          flex: 1,
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          paddingInlineEnd: tokenSchema.size.space.large
        })),
        children: [/*#__PURE__*/jsx("div", {
          className: classNames(css({
            flexGrow: 1,
            paddingBlock: tokenSchema.size.space.regular
          })),
          ...titleProps,
          children: isReactText(children) ? /*#__PURE__*/jsx(Text, {
            children: children
          }) : children
        }), actionLabel && /*#__PURE__*/jsx(Button, {
          onPress: handleAction
          // prominence="low"
          ,
          static: "light"
          // tone="secondary"
          // staticColor="white"
          ,
          children: actionLabel
        })]
      }), /*#__PURE__*/jsx("div", {
        className: css({
          borderInlineStart: `${tokenSchema.size.border.regular} solid #fff3`,
          paddingInlineStart: tokenSchema.size.space.regular
        }),
        children: /*#__PURE__*/jsx(ClearButton, {
          static: "light",
          ...closeButtonProps
        })
      })]
    })
  });
}
let slideInAnim = keyframes({
  from: {
    transform: `var(--slide-from)`
  },
  to: {
    transform: `var(--slide-to)`
  }
});
let fadeOutAnim = keyframes({
  from: {
    opacity: 1
  },
  to: {
    opacity: 0
  }
});
let _Toast = /*#__PURE__*/forwardRef(Toast);

/** @private Positioning and provider for toast children. */
function ToastContainer(props) {
  let {
    children,
    state
  } = props;
  let {
    direction
  } = useLocale();
  let isMobileDevice = useIsMobileDevice();
  let placement = isMobileDevice ? 'center' : props.placement || 'end';
  let position = isMobileDevice ? 'bottom' : props.position || 'bottom';
  let ref = useRef(null);
  let {
    regionProps
  } = useToastRegion(props, state, ref);
  let contents = /*#__PURE__*/jsx(KeystarProvider, {
    UNSAFE_style: {
      background: 'transparent'
    },
    children: /*#__PURE__*/jsx(FocusRing, {
      children: /*#__PURE__*/jsx("div", {
        ...regionProps,
        ref: ref
        // TODO: replace with CSS `dir(rtl)` when supported: https://caniuse.com/css-dir-pseudo
        ,
        "data-direction": direction,
        "data-position": position,
        "data-placement": placement,
        className: css({
          display: 'flex',
          insetInline: 0,
          outline: 'none',
          pointerEvents: 'none',
          position: 'fixed',
          zIndex: 100 /* above modals */,

          '&[data-focus=visible] > :first-child:after': {
            borderRadius: `calc(${tokenSchema.size.radius.regular} + ${tokenSchema.size.alias.focusRingGap})`,
            boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
            content: '""',
            inset: 0,
            margin: `calc(-1 * ${tokenSchema.size.alias.focusRingGap})`,
            pointerEvents: 'none',
            position: 'absolute'
          },
          '&[data-position=top]': {
            top: 0,
            flexDirection: 'column',
            '--slide-from': 'translateY(-100%)',
            '--slide-to': 'translateY(0)'
          },
          '&[data-position=bottom]': {
            bottom: 0,
            flexDirection: 'column-reverse',
            '--slide-from': 'translateY(100%)',
            '--slide-to': 'translateY(0)'
          },
          '&[data-placement=start]': {
            alignItems: 'flex-start',
            '--slide-from': 'translateX(-100%)',
            '--slide-to': 'translateX(0)',
            '&[data-direction=rtl]': {
              '--slide-from': 'translateX(100%)'
            }
          },
          '&[data-placement=center]': {
            alignItems: 'center'
          },
          '&[data-placement=end]': {
            alignItems: 'flex-end',
            '--slide-from': 'translateX(100%)',
            '--slide-to': 'translateX(0)',
            '&[data-direction=rtl]': {
              '--slide-from': 'translateX(-100%)'
            }
          }
        }),
        children: children
      })
    })
  });
  return /*#__PURE__*/ReactDOM.createPortal(contents, document.body);
}

// There is a single global toast queue instance for the whole app, initialized lazily.
let globalToastQueue = null;
function getGlobalToastQueue() {
  if (!globalToastQueue) {
    globalToastQueue = new ToastQueue({
      maxVisibleToasts: 1,
      hasExitAnimation: true
    });
  }
  return globalToastQueue;
}
let toastProviders = new Set();
let subscriptions = new Set();
function subscribe(fn) {
  subscriptions.add(fn);
  return () => subscriptions.delete(fn);
}
function getActiveToaster() {
  return toastProviders.values().next().value;
}
function useActiveToaster() {
  return useSyncExternalStore(subscribe, getActiveToaster, getActiveToaster);
}

/**
 * A Toaster renders the queued toasts in an application. It should be
 * placed at the root of the app.
 */
function Toaster(props) {
  // Track all toast provider instances in a set.
  // Only the first one will actually render.
  // We use a ref to do this, since it will have a stable identity
  // over the lifetime of the component.
  let ref = useRef();
  toastProviders.add(ref);

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      // When this toast provider unmounts, reset all animations so that
      // when the new toast provider renders, it is seamless.
      for (let toast of getGlobalToastQueue().visibleToasts) {
        toast.animation = undefined;
      }

      // Remove this toast provider, and call subscriptions.
      // This will cause all other instances to re-render,
      // and the first one to become the new active toast provider.
      toastProviders.delete(ref);
      for (let fn of subscriptions) {
        fn();
      }
    };
  }, []);

  // Only render if this is the active toast provider instance, and there are visible toasts.
  let activeToaster = useActiveToaster();
  let state = useToastQueue(getGlobalToastQueue());
  if (ref === activeToaster && state.visibleToasts.length > 0) {
    return /*#__PURE__*/jsx(ToastContainer, {
      state: state,
      ...props,
      children: state.visibleToasts.map(toast => /*#__PURE__*/jsx(_Toast, {
        toast: toast,
        state: state
      }, toast.key))
    });
  }
  return null;
}
function addToast(children, tone, options = {}) {
  // Dispatch a custom event so that toasts can be intercepted and re-targeted, e.g. when inside an iframe.
  if (typeof CustomEvent !== 'undefined' && typeof window !== 'undefined') {
    let event = new CustomEvent('keystar-ui-toast', {
      cancelable: true,
      bubbles: true,
      detail: {
        children,
        tone,
        options
      }
    });
    let shouldContinue = window.dispatchEvent(event);
    if (!shouldContinue) {
      return () => {};
    }
  }
  let value = {
    children,
    tone,
    actionLabel: options.actionLabel,
    onAction: options.onAction,
    shouldCloseOnAction: options.shouldCloseOnAction
  };

  // Actionable toasts cannot be auto dismissed.
  warning(!(options.timeout && options.onAction), 'Timeouts are not supported on actionable toasts.');
  warning(!!(options.timeout && options.timeout >= 5000), 'Timeouts must be at least 5000ms, for accessibility.');
  let timeout = options.timeout && !options.onAction ? Math.max(options.timeout, 5000) : undefined;
  let queue = getGlobalToastQueue();
  let key = queue.add(value, {
    priority: getPriority(tone, options),
    timeout,
    onClose: options.onClose
  });
  return () => queue.close(key);
}
const toastQueue = {
  /** Queues a neutral toast. */
  neutral(children, options = {}) {
    return addToast(children, 'neutral', options);
  },
  /** Queues a positive toast. */
  positive(children, options = {}) {
    return addToast(children, 'positive', options);
  },
  /** Queues a critical toast. */
  critical(children, options = {}) {
    return addToast(children, 'critical', options);
  },
  /** Queues an informational toast. */
  info(children, options = {}) {
    return addToast(children, 'info', options);
  }
};

// TODO: if a lower priority toast comes in, no way to know until you dismiss
// the higher priority one.
const PRIORITY = {
  // actionable toasts gain 4 priority points. make sure critical toasts are
  // always at the top.
  critical: 10,
  positive: 3,
  info: 2,
  neutral: 1
};
function getPriority(tone, options) {
  let priority = PRIORITY[tone] || 1;
  if (options.onAction) {
    priority += 4;
  }
  return priority;
}

export { Toaster, toastQueue };
