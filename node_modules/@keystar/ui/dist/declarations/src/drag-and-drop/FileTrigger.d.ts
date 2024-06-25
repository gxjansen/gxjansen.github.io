import React, { ReactNode } from 'react';
export type FileTriggerProps = {
    /** Specifies what mime type of files are allowed. */
    acceptedFileTypes?: string[];
    /** Whether multiple files can be selected. */
    allowsMultiple?: boolean;
    /** The children of the component. */
    children?: ReactNode;
    /** Specifies the use of a media capture mechanism to capture the media on the spot. */
    defaultCamera?: 'user' | 'environment';
    /** Handler when a user selects a file. */
    onSelect?: (files: FileList | null) => void;
};
/**
 * A FileTrigger allows a user to access the file system with any pressable
 * component, or custom components built with usePress.
 */
declare const _FileTrigger: React.ForwardRefExoticComponent<FileTriggerProps & React.RefAttributes<HTMLInputElement>>;
export { _FileTrigger as FileTrigger };
