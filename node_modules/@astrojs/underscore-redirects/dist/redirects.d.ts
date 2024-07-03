export type RedirectDefinition = {
    dynamic: boolean;
    input: string;
    target: string;
    weight: number;
    status: number;
    force?: number;
};
export declare class Redirects {
    definitions: RedirectDefinition[];
    minInputLength: number;
    minTargetLength: number;
    /**
     * Adds a new definition by inserting it into the list of definitions
     * prioritized by the given weight. This keeps higher priority definitions
     * At the top of the list once printed.
     */
    add(definition: RedirectDefinition): void;
    print(): string;
    empty(): boolean;
}
