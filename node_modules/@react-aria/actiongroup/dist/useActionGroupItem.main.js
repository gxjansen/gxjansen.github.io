var $7WRxK$reactariautils = require("@react-aria/utils");
var $7WRxK$react = require("react");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "useActionGroupItem", () => $44b92e5de834b44e$export$9597202bd3099a29);
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

const $44b92e5de834b44e$var$BUTTON_ROLES = {
    'none': undefined,
    'single': 'radio',
    'multiple': 'checkbox'
};
function $44b92e5de834b44e$export$9597202bd3099a29(props, state, ref) {
    let selectionMode = state.selectionManager.selectionMode;
    let buttonProps = {
        role: $44b92e5de834b44e$var$BUTTON_ROLES[selectionMode]
    };
    if (selectionMode !== 'none') {
        let isSelected = state.selectionManager.isSelected(props.key);
        buttonProps['aria-checked'] = isSelected;
    }
    let isFocused = props.key === state.selectionManager.focusedKey;
    let onRemovedWithFocus = (0, $7WRxK$reactariautils.useEffectEvent)(()=>{
        if (isFocused) state.selectionManager.setFocusedKey(null);
    });
    // If the focused item is removed from the DOM, reset the focused key to null.
    (0, $7WRxK$react.useEffect)(()=>{
        return ()=>{
            onRemovedWithFocus();
        };
    }, [
        onRemovedWithFocus
    ]);
    return {
        buttonProps: (0, $7WRxK$reactariautils.mergeProps)(buttonProps, {
            tabIndex: isFocused || state.selectionManager.focusedKey == null ? 0 : -1,
            onFocus () {
                state.selectionManager.setFocusedKey(props.key);
            },
            onPress () {
                state.selectionManager.select(props.key);
            }
        })
    };
}


//# sourceMappingURL=useActionGroupItem.main.js.map
