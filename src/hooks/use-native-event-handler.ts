import { useCallback, useLayoutEffect } from "react";

/** @internal */
export const useNativeEventHandler = <Args extends [...unknown[]]>(
    target: EventTarget | null,
    type: string,
    handler: (...args: Args) => void,
    dependencies: unknown[],
    options?: boolean | AddEventListenerOptions,
): void => {
    const callback = useCallback(handler, [...dependencies, target]) as unknown as EventListener;
    useLayoutEffect(() => {
        if (target) {
            let active = true;
            const wrapped: typeof callback = (...args) => {
                if (active) {
                    callback(...args);
                }
            };
            target.addEventListener(type, wrapped, options);
            return () => {
                if (active) {
                    active = false;
                    target.removeEventListener(type, wrapped);
                }
            };
        }
    }, [target, callback]);
};
