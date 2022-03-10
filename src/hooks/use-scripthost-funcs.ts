import { useMemo } from "react";
import { ScriptFunction } from "scripthost";
import { useScriptHost } from "scripthost-react";

export function useScriptHostFuncs(): Iterable<[string, ScriptFunction]> {
    const scriptHost = useScriptHost();
    return useMemo(() => {
        const result = new Map<string, ScriptFunction>();
        for (const [key, value] of Object.entries(scriptHost.funcs)) {
            if (value) {
                result.set(key, value);
            }
        }
        return result;
    }, [scriptHost]);
}
