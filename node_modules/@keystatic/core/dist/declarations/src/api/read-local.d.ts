import { Config } from "../config.js";
export declare function readToDirEntries(baseDir: string): Promise<import("../app/trees.js").TreeEntry[]>;
export declare function getAllowedDirectories(config: Config): string[];
