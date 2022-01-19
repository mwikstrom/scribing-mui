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
import { CustomOption, CustomOptionProvider } from "../FlowEditorToolbar";

export interface InteractionButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
    getCustomInteractionOptions?: CustomOptionProvider<Interaction | null>;
}

export const InteractionButton: FC<InteractionButtonProps> = props => {
    const { controller, frozen, getCustomInteractionOptions, ...rest } = props;
    const locale = useMaterialFlowLocale();
    const interaction = useMemo<Interaction | null | undefined>(() => controller?.getInteraction(), [controller]);

    const customOptions = useMemo<readonly CustomOption<Interaction | null>[]>(() => {
        if (getCustomInteractionOptions) {
            return getCustomInteractionOptions(interaction || null);
        } else {
            return [];
        }
    }, [interaction, getCustomInteractionOptions]);

    const options = useMemo<readonly InteractionOption[]>(() => ([
        ...customOptions,
        ...DEFAULT_INTERACTION_OPTIONS,
    ]), [customOptions]);

    const selected = useMemo<InteractionOption | undefined>(() => {
        const customSelected = customOptions.find(opt => opt.selected);
        if (customSelected) {
            return customSelected;
        } else if (interaction === null) {
            return "none";
        } else if (interaction instanceof OpenUrl) {
            return "open_url";
        } else if (interaction instanceof RunScript) {
            return "run_script";
        }
    }, [interaction, customOptions]);

    const [dialog, setDialog] = useState<Exclude<InteractionOption, "none"> | null>(null);

    const onOptionSelected = useCallback((value: InteractionOption) => {
        if (value === "none") {
            controller?.setInteraction(null);
        } else {
            setDialog(value);
        }
    }, [controller]);

    const getOptionKey = useCallback((value: InteractionOption): string => {
        if (typeof value === "string") {
            return value;
        } else {
            return `$${value.key}`;
        }
    }, []);

    const isSameOption = useCallback((first: InteractionOption, second: InteractionOption) => {
        return getOptionKey(first) === getOptionKey(second);
    }, [getOptionKey]);

    const getOptionLabel = useCallback((value: InteractionOption) => {
        if (typeof value === "string") {
            const text = locale[`interaction_${value}` as const];
            if (value === "none") {
                return text;
            } else {
                return `${text}…`;
            }
        } else {
            return `${value.label}…`;
        }
    }, [locale]);

    const closeDialog = useCallback(() => setDialog(null), []);

    const setInteraction = useCallback((value: Interaction | null | undefined) => {
        if (value !== undefined) {
            controller?.setInteraction(value);
        }
        setDialog(null);
    }, [controller]);

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
                disabled={frozen || !controller}
                options={options}
                selected={selected}
                onOptionSelected={onOptionSelected}
                isSameOption={isSameOption}
                getOptionKey={getOptionKey}
                getOptionLabel={getOptionLabel}
                children={<Icon size={1} path={mdiGestureTapButton}/>}
            />
            {dialog === "run_script" && (
                <ScriptEditorDialog
                    open
                    initialValue={interaction instanceof RunScript ? interaction.script : ""}
                    onComplete={setRunScript}
                    onClose={closeDialog}
                    scriptLabel={locale.interaction_run_script}
                />
            )}
            {dialog === "open_url" && (
                <TextFieldDialog
                    open
                    fullWidth
                    maxWidth="sm"
                    initialValue={interaction instanceof OpenUrl ? interaction.url : ""}
                    onComplete={setOpenUrl}
                    onClose={closeDialog}
                    inputLabel={locale.interaction_open_url}
                />
            )}
            {dialog && typeof dialog !== "string" && dialog.renderDialog(interaction || null, setInteraction)}
        </>
    );
};

type InteractionOption = DefaultInteractionOption | CustomOption<Interaction | null>;

type DefaultInteractionOption = (typeof DEFAULT_INTERACTION_OPTIONS)[number];

const DEFAULT_INTERACTION_OPTIONS = [
    "open_url",
    "run_script",
    "none",
] as const;
