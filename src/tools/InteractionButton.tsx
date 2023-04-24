import { mdiGestureTapButton } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { FC, useCallback, useMemo, useState } from "react";
import { FlowContent, Interaction, OpenUrl, RunScript, Script, TextRun, TextStyle } from "scribing";
import { FlowEditorController } from "scribing-react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ToolButtonProps } from "../components/ToolButton";
import { OptionButton } from "../components/OptionButton";
import { ScriptEditorDialog } from "../ScriptEditorDialog";
import { TextFieldDialog } from "../components/TextFieldDialog";
import { CustomOption, CustomOptionProvider } from "../FlowEditorToolbar";
import { InteractionOptionResult, getInteractionUpdateInfo } from "../InteractionOptionResult";

export interface InteractionButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
    getCustomInteractionOptions?: CustomOptionProvider<Interaction | null, InteractionOptionResult>;
}

export const InteractionButton: FC<InteractionButtonProps> = props => {
    const { controller, frozen, getCustomInteractionOptions, ...rest } = props;
    const locale = useMaterialFlowLocale();
    const interaction = useMemo<Interaction | null | undefined>(() => controller?.getInteraction(), [controller]);

    const customOptions = useMemo<readonly CustomOption<Interaction | null, InteractionOptionResult>[]>(() => {
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

    const lang = useMemo(() => controller?.getTextStyle().lang, [controller]);
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

    const applyDialog = useCallback((result: InteractionOptionResult | null) => {
        const { interaction, defaultText } = getInteractionUpdateInfo(result);
        if (defaultText && controller?.isCaret() && !controller?.getLink()) {
            controller.insertContent(
                FlowContent.fromData([
                    TextRun.fromData({ text: defaultText, style: new TextStyle({ link: interaction }) })
                ])
            );
        } else {
            controller?.setInteraction(interaction);
        }
    }, [controller]);

    const completeDialog = useCallback((result: InteractionOptionResult | undefined) => {
        if (result !== undefined) {
            applyDialog(result);
        }
        closeDialog();
    }, [applyDialog, closeDialog]);

    const setRunScript = useCallback((value: Script | null) => {
        if (value !== null) {
            controller?.setInteraction(new RunScript({ script: value }));
        }
        setDialog(null);
    }, [controller]);

    const saveRunScript = useCallback((value: Script) => {
        controller?.setInteraction(new RunScript({ script: value }));
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
                    initialValue={interaction instanceof RunScript ? interaction.script : null}
                    lang={lang}
                    onComplete={setRunScript}
                    onSave={saveRunScript}
                    onClose={closeDialog}
                    scriptLabel={locale.interaction_run_script}
                    controller={controller}
                    idempotent={false}
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
            {
                typeof dialog === "object" && 
                dialog !== null && 
                typeof dialog.renderDialog === "function" && 
                dialog.renderDialog(interaction || null, completeDialog, applyDialog)
            }
        </>
    );
};

type InteractionOption = DefaultInteractionOption | CustomOption<Interaction | null, InteractionOptionResult>;

type DefaultInteractionOption = (typeof DEFAULT_INTERACTION_OPTIONS)[number];

const DEFAULT_INTERACTION_OPTIONS = [
    "open_url",
    "run_script",
    "none",
] as const;
