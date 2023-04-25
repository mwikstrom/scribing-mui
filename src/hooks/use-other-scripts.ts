import { useCallback, useEffect, useState } from "react";
import { FlowNodeVisitor, Script} from "scribing";
import { FlowEditorController, FlowEditorState } from "scribing-react";

// NOTE: The idea for this hook is that it should return all scripts in the flow document except
// the one(s) that are selected. However, this implementation is simplified and returns ALL scripts.
export function useOtherScripts(controller: FlowEditorController | null | undefined): Script[] {
    return useAllScripts(controller?.state);
}

function useAllScripts(state: FlowEditorState | null | undefined): Script[] {
    const extract = useCallback(() => {
        const extractor = new ScriptExtractor();
        if (state) {
            extractor.visitFlowContent(state.content);
        }
        return extractor.result;
    }, [state]);
    const [result, setResult] = useState(extract);
    useEffect(() => setResult(before => {
        const after = extract();
        let same = before.length === after.length;
        for (let i = 0; i < before.length && same; ++i) {
            same = before[0].equals(after[0]);
        }
        return same ? before : after;
    }), [extract]);
    return result;
}

class ScriptExtractor extends FlowNodeVisitor {
    public readonly result: Script[] = [];

    visitScript(script: Script): Script {
        this.result.push(script);
        return super.visitScript(script);
    }
}
