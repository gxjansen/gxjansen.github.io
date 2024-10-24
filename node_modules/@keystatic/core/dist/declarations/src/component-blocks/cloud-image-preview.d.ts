import { PreviewProps, ObjectField, Config, ParsedValueForComponentSchema } from "../index.js";
import { BaseStyleProps } from '@keystar/ui/style';
export type CloudImageProps = {
    src: string;
    width?: number;
    height?: number;
    alt: string;
};
type ImageDimensions = Pick<CloudImageProps, 'width' | 'height'>;
export declare function parseImageData(data: string): CloudImageProps;
export declare function loadImageData(url: string, config: Config): Promise<CloudImageProps>;
export declare function ImageDimensionsInput(props: {
    src: string;
    image: ImageDimensions;
    onChange: (image: ImageDimensions) => void;
}): import("react").JSX.Element;
export type ImageStatus = '' | 'loading' | 'good' | 'error';
export declare const emptyImageData: CloudImageProps;
export declare function UploadImageButton(props: BaseStyleProps & {
    onUploaded: (data: CloudImageProps) => void;
}): import("react").JSX.Element | null;
export declare function CloudImagePreview(props: PreviewProps<ObjectField<typeof import("./cloud-image-schema.js").cloudImageSchema>> & {
    onRemove(): void;
}): import("react").JSX.Element;
export declare function handleFile(file: File, config: Config): false | Promise<{
    alt: string;
    src: string;
    height: number;
    width: number;
}>;
export declare function CloudImagePreviewForNewEditor(props: {
    onRemove: () => void;
    onChange: (data: ParsedValueForComponentSchema<ObjectField<typeof import("./cloud-image-schema.js").cloudImageSchema>>) => void;
    value: ParsedValueForComponentSchema<ObjectField<typeof import("./cloud-image-schema.js").cloudImageSchema>>;
    isSelected: boolean;
}): import("react").JSX.Element;
export declare function useImageLibraryURL(): string;
export declare const cloudImageToolbarIcon: import("react").JSX.Element;
export {};
