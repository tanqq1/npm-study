declare type debounceBack<T> = (pushData: T) => void;
interface DebounceOptions {
    wait?: number;
    leading?: boolean;
    maxWait?: number;
    trailing?: boolean;
}
export default function useDebounceCache<T>(callback: (a: T[]) => void, options?: DebounceOptions, handler?: (a: T) => any): debounceBack<T>;
export {};
