export declare const getName: () => string;
declare type debounceBack<T> = (pushData: T) => void;
interface DebounceOptions {
    wait?: number;
    leading?: boolean;
    maxWait?: number;
    trailing?: boolean;
}
export declare function useDebounceCache<T>(callback: (a: T[]) => void, options?: DebounceOptions, handler?: (a: T) => any): debounceBack<T>;
export {};
