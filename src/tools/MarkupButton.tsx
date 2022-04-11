import { mdiCodeTags } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { FC, useCallback, useMemo, useState } from "react";
import { FlowEditorController } from "scribing-react";
import { ToolButtonProps } from "../components/ToolButton";
import { MarkupDialog } from "../components/MarkupDialog";
import { getMarkupInfo, MarkupInfo, MarkupUpdateInfo } from "../MarkupInfo";
import { CustomOption, CustomOptionProvider } from "../FlowEditorToolbar";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { OptionButton } from "../components/OptionButton";
import { Script } from "scribing";

export interface MarkupButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
    getCustomMarkupOptions?: CustomOptionProvider<MarkupInfo | null, MarkupUpdateInfo>;
}

export const MarkupButton: FC<MarkupButtonProps> = props => {
    const { controller, frozen, getCustomMarkupOptions, ...rest } = props;
    const locale = useMaterialFlowLocale();
    const current = useMemo(() => getMarkupInfo(controller), [controller]);
    const disabled = useMemo(() => frozen || !controller || controller?.isTableSelection(), [frozen, controller]);
    const active = !!current;

    const customOptions = useMemo<readonly CustomOption<MarkupInfo | null, MarkupUpdateInfo>[]>(() => {
        if (getCustomMarkupOptions) {
            return getCustomMarkupOptions(current);
        } else {
            return [];
        }
    }, [current, getCustomMarkupOptions]);
    
    const options = useMemo<readonly MarkupOption[]>(() => ([
        ...customOptions,
        ...DEFAULT_MARKUP_OPTIONS,
    ]), [customOptions]);

    const selected = useMemo<MarkupOption | undefined>(() => {
        const customSelected = customOptions.find(opt => opt.selected);
        if (customSelected) {
            return customSelected;
        } else if (current) {
            return "advanced";
        }
    }, [current, customOptions]);

    const [dialog, setDialog] = useState<Exclude<MarkupOption, "none"> | null>(null);
    const closeDialog = useCallback(() => setDialog(null), []);

    const applyUpdate = useCallback((update: MarkupUpdateInfo | undefined) => {
        if (controller && update) {
            const { tag, attr, empty } = update;
            if (controller.isMarkup()) {
                if (tag && controller.getMarkupTag() !== tag) {
                    controller.setMarkupTag(tag);
                }
                if (attr) {
                    for (const [key, value] of attr) {
                        if (typeof value === "string" || value instanceof Script) {
                            controller.setMarkupAttr(key, value);
                        } else {
                            controller.unsetMarkupAttr(key);
                        }
                    }
                }
            } else if (tag) {
                const insertAttr = new Map<string, string | Script>();
                if (attr) {
                    for (const [key, value] of attr) {
                        if (typeof value === "string" || value instanceof Script) {
                            insertAttr.set(key, value);
                        }
                    }
                }
                controller.insertMarkup(tag, insertAttr, empty);
            }
        }
    }, [controller]);

    const completeDialog = useCallback((update: MarkupUpdateInfo | undefined) => {
        closeDialog();
        applyUpdate(update);
    }, [closeDialog, applyUpdate]);

    const getOptionKey = useCallback((value: MarkupOption): string => {
        if (typeof value === "string") {
            return value;
        } else {
            return `$${value.key}`;
        }
    }, []);

    const isSameOption = useCallback((first: MarkupOption, second: MarkupOption) => {
        return getOptionKey(first) === getOptionKey(second);
    }, [getOptionKey]);

    const getOptionLabel = useCallback((value: MarkupOption) => {
        if (typeof value === "string") {
            return `${locale[`markup_${value}` as const]}…`;
        } else if (typeof value.renderDialog === "function") {
            return `${value.label}…`;
        } else {
            return value.label;
        }
    }, [locale]);

    const onOptionSelected = useCallback((option: MarkupOption) => {
        if (typeof option !== "object" || option.renderDialog) {
            setDialog(option);
        } else if (option.getResult) {
            applyUpdate(option.getResult(current));
        }
    }, [applyUpdate, current]);

    return (
        <>
            <OptionButton
                {...rest} 
                autoSelectSingleOption
                active={active}
                disabled={disabled}
                options={options}
                selected={selected}
                onOptionSelected={onOptionSelected}
                isSameOption={isSameOption}
                getOptionKey={getOptionKey}
                getOptionLabel={getOptionLabel}
                children={<Icon size={1} path={mdiCodeTags}/>}
            />
            {dialog === "advanced" && (
                <MarkupDialog
                    open
                    current={current}
                    canInsertEmpty={!current && controller?.isCaret()}
                    onClose={closeDialog}
                    onComplete={completeDialog}
                />
            )}
            {
                typeof dialog === "object" && 
                dialog !== null && 
                typeof dialog.renderDialog === "function" && 
                dialog.renderDialog(current, completeDialog)
            }
        </>
    );
};

type MarkupOption = DefaultMarkupOption | CustomOption<MarkupInfo | null, MarkupUpdateInfo>;

type DefaultMarkupOption = (typeof DEFAULT_MARKUP_OPTIONS)[number];

const DEFAULT_MARKUP_OPTIONS = [
    "advanced",
] as const;
