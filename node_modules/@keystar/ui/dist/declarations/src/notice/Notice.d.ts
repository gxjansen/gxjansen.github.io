import { DOMProps } from '@react-types/shared';
import { ReactNode } from 'react';
import { BaseStyleProps, ClassList } from "../../dist/keystar-ui-style.js";
export declare const noticeClassList: ClassList<"heading">;
declare const toneToIcon: {
    caution: import("react").JSX.Element;
    critical: import("react").JSX.Element;
    neutral: import("react").JSX.Element;
    positive: import("react").JSX.Element;
};
type NoticeTone = keyof typeof toneToIcon;
export type NoticeProps = {
    children: ReactNode;
    tone?: NoticeTone;
} & BaseStyleProps & DOMProps;
/**
 * Use notices to highlight information that affects a section, feature or page.
 * Draw attention without interrupting users from their current task.
 */
export declare function Notice(props: NoticeProps): import("react").JSX.Element;
export {};
