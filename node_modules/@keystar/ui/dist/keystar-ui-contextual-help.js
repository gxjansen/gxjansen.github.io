'use client';
import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useLabels, mergeProps } from '@react-aria/utils';
import { forwardRef } from 'react';
import { ActionButton } from '@keystar/ui/button';
import { DialogTrigger, Dialog } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { helpCircleIcon } from '@keystar/ui/icon/icons/helpCircleIcon';
import { infoIcon } from '@keystar/ui/icon/icons/infoIcon';
import { ClearSlots } from '@keystar/ui/slots';
import { classNames, css, tokenSchema } from '@keystar/ui/style';
import { jsxs, jsx } from 'react/jsx-runtime';

var localizedMessages = {
	"ar-AE": {
		help: "مساعدة",
		info: "معلومات"
	},
	"bg-BG": {
		help: "Помощ",
		info: "Информация"
	},
	"cs-CZ": {
		help: "Nápověda",
		info: "Informace"
	},
	"da-DK": {
		help: "Hjælp",
		info: "Oplysninger"
	},
	"de-DE": {
		help: "Hilfe",
		info: "Informationen"
	},
	"el-GR": {
		help: "Βοήθεια",
		info: "Πληροφορίες"
	},
	"en-US": {
		info: "Information",
		help: "Help"
	},
	"es-ES": {
		help: "Ayuda",
		info: "Información"
	},
	"et-EE": {
		help: "Spikker",
		info: "Teave"
	},
	"fi-FI": {
		help: "Ohje",
		info: "Tiedot"
	},
	"fr-FR": {
		help: "Aide",
		info: "Informations"
	},
	"he-IL": {
		help: "עזרה",
		info: "מידע"
	},
	"hr-HR": {
		help: "Pomoć",
		info: "Informacije"
	},
	"hu-HU": {
		help: "Súgó",
		info: "Információ"
	},
	"it-IT": {
		help: "Aiuto",
		info: "Informazioni"
	},
	"ja-JP": {
		help: "ヘルプ",
		info: "情報"
	},
	"ko-KR": {
		help: "도움말",
		info: "정보"
	},
	"lt-LT": {
		help: "Žinynas",
		info: "Informacija"
	},
	"lv-LV": {
		help: "Palīdzība",
		info: "Informācija"
	},
	"nb-NO": {
		help: "Hjelp",
		info: "Informasjon"
	},
	"nl-NL": {
		help: "Help",
		info: "Informatie"
	},
	"pl-PL": {
		help: "Pomoc",
		info: "Informacja"
	},
	"pt-BR": {
		help: "Ajuda",
		info: "Informações"
	},
	"pt-PT": {
		help: "Ajuda",
		info: "Informação"
	},
	"ro-RO": {
		help: "Ajutor",
		info: "Informaţii"
	},
	"ru-RU": {
		help: "Справка",
		info: "Информация"
	},
	"sk-SK": {
		help: "Pomoc",
		info: "Informácie"
	},
	"sl-SI": {
		help: "Pomoč",
		info: "Informacije"
	},
	"sr-SP": {
		help: "Pomoć",
		info: "Informacije"
	},
	"sv-SE": {
		help: "Hjälp",
		info: "Information"
	},
	"tr-TR": {
		help: "Yardım",
		info: "Bilgiler"
	},
	"uk-UA": {
		help: "Довідка",
		info: "Інформація"
	},
	"zh-CN": {
		help: "帮助",
		info: "信息"
	},
	"zh-TW": {
		help: "說明",
		info: "資訊"
	}
};

/** Contextual help shows a user extra information about an adjacent component. */
const ContextualHelp = /*#__PURE__*/forwardRef(function ContextualHelp(props, ref) {
  let {
    children,
    variant = 'help',
    ...otherProps
  } = props;
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let labelProps = useLabels(otherProps, stringFormatter.format(variant));
  let icon = variant === 'info' ? infoIcon : helpCircleIcon;
  return /*#__PURE__*/jsxs(DialogTrigger, {
    ...otherProps,
    type: "popover",
    children: [/*#__PURE__*/jsx(ActionButton, {
      ...mergeProps(otherProps, labelProps, {
        isDisabled: false
      }),
      ref: ref,
      UNSAFE_className: classNames(css({
        borderRadius: tokenSchema.size.radius.small,
        height: tokenSchema.size.element.small,
        minWidth: 'unset',
        paddingInline: 0,
        width: tokenSchema.size.element.small
      }), otherProps.UNSAFE_className),
      prominence: "low",
      children: /*#__PURE__*/jsx(Icon, {
        src: icon
      })
    }), /*#__PURE__*/jsx(ClearSlots, {
      children: /*#__PURE__*/jsx(Dialog, {
        children: children
      })
    })]
  });
});

export { ContextualHelp };
