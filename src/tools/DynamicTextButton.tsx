import { mdiFunctionVariant } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { FC, useCallback, useMemo, useState } from "react";
import { DynamicText, Script } from "scribing";
import { FlowEditorController } from "scribing-react";
import { ScriptEditorDialog } from "../components/ScriptEditorDialog";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ToolButton, ToolButtonProps } from "../components/ToolButton";

export interface DynamicTextButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
}

export const DynamicTextButton: FC<DynamicTextButtonProps> = props => {
    const { controller, frozen, ...rest } = props;
    const [isDialogOpen, setDialogOpen] = useState(false);
    const openDialog = useCallback(() => setDialogOpen(true), []);
    const closeDialog = useCallback(() => setDialogOpen(false), []);    
    const completeDialog = useCallback((script: Script | null) => {
        closeDialog();
        if (script !== null) {
            if (controller?.isCaret()) {
                controller?.insertNode(new DynamicText({
                    expression: script,
                    style: controller.getCaretStyle(),
                }));
            } else {
                controller?.setDynamicTextExpression(script);
            }
        }
    }, [controller, closeDialog]);
    const disabled = useMemo(() => {
        if (!controller || frozen) {
            return true;
        } else if (controller.isCaret()) {
            return false;
        } else if (controller.isDynamicText()) {
            return false;
        } else {
            return true;
        }
    }, [frozen, controller]);
    const active = useMemo(() => controller?.isDynamicText(), [controller]);
    const initialValue = useMemo(() => controller?.getDynamicTextExpression() ?? null, [controller]);
    const locale = useMaterialFlowLocale();
    const lang = useMemo(() => controller?.getTextStyle().lang, [controller]);
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
                scriptLabel={locale.label_dynamic_text_script}
                completeLabel={active ? locale.button_apply : locale.button_insert}
            />
        </>
    );
};
