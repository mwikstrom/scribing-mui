import { mdiGestureTapButton } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { FC, useCallback, useMemo, useState } from "react";
import { Interaction, OpenUrl, RunScript } from "scribing";
import { FlowEditorController } from "scribing-react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ToolButtonProps } from "../components/ToolButton";
import { OptionButton } from "../components/OptionButton";
import { ScriptEditorDialog } from "../components/ScriptEditorDialog";
import { TextFieldDialog } from "../components/TextFieldDialog";

export interface InteractionButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
}

export const InteractionButton: FC<InteractionButtonProps> = props => {
    const { controller, ...rest } = props;
    const interaction = useMemo<Interaction | null | undefined>(() => controller?.getInteraction(), [controller]);
    const selected = useMemo<InteractionOption | undefined>(() => {
        if (interaction === null) {
            return "none";
        } else if (interaction instanceof OpenUrl) {
            return "open_url";
        } else if (interaction instanceof RunScript) {
            return "run_script";
        }
    }, [interaction]);
    const [dialog, setDialog] = useState<"open_url" | "run_script" | null>(null);
    const onOptionSelected = useCallback((value: InteractionOption) => {
        if (value === "none") {
            controller?.setInteraction(null);
        } else {
            setDialog(value);
        }
    }, [controller]);
    const locale = useMaterialFlowLocale();
    const getOptionLabel = useCallback((value: InteractionOption) => {
        const text = locale[`interaction_${value}` as const];
        if (value === "none") {
            return text;
        } else {
            return `${text}…`;
        }
    }, [locale]);
    const closeDialog = useCallback(() => setDialog(null), []);
    const setRunScript = useCallback((value: string | null) => {
        if (value !== null) {
            controller?.setInteraction(new RunScript({ script: value }));
        }
        setDialog(null);
    }, [controller]);
    const setOpenUrl = useCallback((value: string | null) => {
        if (value !== null) {
            controller?.setInteraction(new OpenUrl({ url: value }));
        }
        setDialog(null);
    }, [controller]);
    return (
        <>
            <OptionButton
                {...rest} 
                active={!!interaction}
                disabled={!controller}
                options={INTERACTION_OPTIONS}
                selected={selected}
                onOptionSelected={onOptionSelected}
                getOptionLabel={getOptionLabel}
                children={<Icon size={1} path={mdiGestureTapButton}/>}
            />
            <ScriptEditorDialog
                open={dialog === "run_script"}
                initialValue={interaction instanceof RunScript ? interaction.script : ""}
                onComplete={setRunScript}
                onClose={closeDialog}
                scriptLabel={locale.interaction_run_script}
            />
            <TextFieldDialog
                open={dialog === "open_url"}
                fullWidth
                maxWidth="sm"
                initialValue={interaction instanceof OpenUrl ? interaction.url : ""}
                onComplete={setOpenUrl}
                onClose={closeDialog}
                inputLabel={locale.interaction_open_url}
            />
        </>
    );
};

type InteractionOption = (typeof INTERACTION_OPTIONS)[number];

const INTERACTION_OPTIONS = [
    "none",
    "open_url",
    "run_script"
] as const;