/**
 * External custom hook for managing toasts.
 */
export declare const useToasts: () => {
    showToast: (content: string | JSX.Element, timeout?: number) => Promise<string | null>;
    dismissToast: (id: string) => Promise<string | null>;
    toasts: import("..").Toast[];
    replaceToasts: (newToasts: Array<import("..").Toast>) => void;
};
//# sourceMappingURL=useToasts.d.ts.map