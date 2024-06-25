import { VoussoirTheme } from "../../dist/keystar-ui-style.js";
import { ColorScheme } from "../../dist/keystar-ui-types.js";
type StrictBackground = keyof VoussoirTheme['color']['background'];
export declare const documentElementClasses: (args: {
    bodyBackground?: StrictBackground;
    colorScheme?: ColorScheme;
}) => string;
export {};
