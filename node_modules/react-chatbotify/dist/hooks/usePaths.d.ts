/**
 * External custom hook for managing paths in the chatbot conversation flow.
 */
export declare const usePaths: () => {
    getCurrPath: () => string | null;
    getPrevPath: () => string | null;
    goToPath: (pathToGo: keyof import("..").Flow) => Promise<boolean>;
    paths: string[];
    replacePaths: (newPaths: Array<string>) => void;
};
//# sourceMappingURL=usePaths.d.ts.map