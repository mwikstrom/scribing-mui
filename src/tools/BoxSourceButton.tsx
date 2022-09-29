import { mdiFunctionVariant } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { FC, useCallback, useMemo, useState } from "react";
import { FlowEditorController } from "scribing-react";
import { ScriptEditorDialog } from "../ScriptEditorDialog";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ToolButton, ToolButtonProps } from "../components/ToolButton";
import { Script } from "scribing";

export interface BoxSourceButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
}

export const BoxSourceButton: FC<BoxSourceButtonProps> = props => {
    const { controller, frozen, ...rest } = props;
    const [isDialogOpen, setDialogOpen] = useState(false);
    const openDialog = useCallback(() => setDialogOpen(true), []);
    const closeDialog = useCallback(() => setDialogOpen(false), []);    
    const saveScript = useCallback((value: Script) => {
        if (/^\s*(?:\{\s*\}\s*)?$/.test(value.code) && value.messages.size === 0) {
            controller?.formatBox("source", null);
        } else {
            controller?.formatBox("source", value);
        }
    }, [controller]);
    const completeDialog = useCallback((script: Script | null) => {
        closeDialog();
        if (script !== null) {
            saveScript(script);
        }
    }, [closeDialog, saveScript]);
    const disabled = useMemo(() => {
        if (!controller || frozen) {
            return true;
        } else {
            return !controller.isBox();
        }
    }, [frozen, controller]);
    const lang = useMemo(() => controller?.getTextStyle().lang, [controller]);
    const initialValue = useMemo(() => controller?.getBoxStyle()?.source ?? null, [controller]);
    const active = !!initialValue;
    const locale = useMaterialFlowLocale();
    return (
        <>
            <ToolButton
                {...rest} 
                onClick={openDialog}
                disabled={disabled}
                active={active}
                children={<Icon size={1} path={mdiFunctionVariant}/>}
            />
            <ScriptEditorDialog
                open={isDialogOpen}
                initialValue={initialValue}
                lang={lang}
                onClose={closeDialog}
                onComplete={completeDialog}
                onSave={saveScript}
                scriptLabel={locale.label_data_source}
                completeLabel={locale.button_apply}
                controller={controller}
                idempotent
            />
        </>
    );
};

