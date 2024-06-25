export interface DialogContainerValue {
    type: 'modal' | 'popover' | 'tray' | 'fullscreen';
    dismiss(): void;
}
/** A dialog may be abstracted from its trigger; this hook provides access to context. */
export declare function useDialogContainer(): DialogContainerValue;
