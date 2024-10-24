import {createFocusManager as $6SCDv$createFocusManager} from "@react-aria/focus";
import {useLayoutEffect as $6SCDv$useLayoutEffect, filterDOMProps as $6SCDv$filterDOMProps} from "@react-aria/utils";
import {useLocale as $6SCDv$useLocale} from "@react-aria/i18n";
import {useState as $6SCDv$useState} from "react";

/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 



const $304ac34015d4535d$var$BUTTON_GROUP_ROLES = {
    'none': 'toolbar',
    'single': 'radiogroup',
    'multiple': 'toolbar'
};
function $304ac34015d4535d$export$f4bf8d43c16de704(props, state, ref) {
    let { isDisabled: isDisabled, orientation: orientation = 'horizontal' } = props;
    let [isInToolbar, setInToolbar] = (0, $6SCDv$useState)(false);
    (0, $6SCDv$useLayoutEffect)(()=>{
        var _ref_current_parentElement;
        setInToolbar(!!(ref.current && ((_ref_current_parentElement = ref.current.parentElement) === null || _ref_current_parentElement === void 0 ? void 0 : _ref_current_parentElement.closest('[role="toolbar"]'))));
    }, [
        ref
    ]);
    let allKeys = [
        ...state.collection.getKeys()
    ];
    if (!allKeys.some((key)=>!state.disabledKeys.has(key))) isDisabled = true;
    let { direction: direction } = (0, $6SCDv$useLocale)();
    let focusManager = (0, $6SCDv$createFocusManager)(ref);
    let flipDirection = direction === 'rtl' && orientation === 'horizontal';
    let onKeyDown = (e)=>{
        if (!e.currentTarget.contains(e.target)) return;
        switch(e.key){
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                e.stopPropagation();
                if (e.key === 'ArrowRight' && flipDirection) focusManager.focusPrevious({
                    wrap: true
                });
                else focusManager.focusNext({
                    wrap: true
                });
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                e.stopPropagation();
                if (e.key === 'ArrowLeft' && flipDirection) focusManager.focusNext({
                    wrap: true
                });
                else focusManager.focusPrevious({
                    wrap: true
                });
                break;
        }
    };
    let role = $304ac34015d4535d$var$BUTTON_GROUP_ROLES[state.selectionManager.selectionMode];
    if (isInToolbar && role === 'toolbar') role = 'group';
    return {
        actionGroupProps: {
            ...(0, $6SCDv$filterDOMProps)(props, {
                labelable: true
            }),
            role: role,
            'aria-orientation': role === 'toolbar' ? orientation : undefined,
            'aria-disabled': isDisabled,
            onKeyDown: onKeyDown
        }
    };
}


export {$304ac34015d4535d$export$f4bf8d43c16de704 as useActionGroup};
//# sourceMappingURL=useActionGroup.module.js.map
