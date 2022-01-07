import { mdiCodeTags } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { FC, useCallback, useMemo, useState } from "react";
import { FlowEditorController } from "scribing-react";
import { ToolButton, ToolButtonProps } from "../components/ToolButton";
import { MarkupDialog, UnsetSymbol } from "../components/MarkupDialog";

export interface MarkupButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
}

export const MarkupButton: FC<MarkupButtonProps> = props => {
    const { controller, frozen, ...rest } = props;
    const [isDialogOpen, setDialogOpen] = useState(false);
    const openDialog = useCallback(() => setDialogOpen(true), []);
    const closeDialog = useCallback(() => setDialogOpen(false), []);    
    const completeDialog = useCallback((tag: string, attr: Map<string, string | UnsetSymbol>, insertEmpty: boolean) => {
        closeDialog();
        if (controller) {
            if (!controller.isMarkup()) {
                const insertAttr = new Map<string, string>();
                for (const [key, value] of attr) {
                    if (typeof value === "string") {
                        insertAttr.set(key, value);
                    }
                }
                controller.insertMarkup(tag, insertAttr, insertEmpty);
            } else {
                if (tag && controller.getMarkupTag() !== tag) {
                    controller.setMarkupTag(tag);
                }
                for (const [key, value] of attr) {
                    if (typeof value === "string") {
                        controller.setMarkupAttr(key, value);
                    } else {
                        controller.unsetMarkupAttr(key);
                    }
                }
            }
        }
    }, [controller, closeDialog]);
    const disabled = useMemo(() => frozen || !controller || controller?.isTableSelection(), [frozen, controller]);
    const active = useMemo(() => controller?.isMarkup(), [controller]);
    return (
        <>
            <ToolButton
                {...rest} 
                onClick={openDialog}
                disabled={disabled}
                active={active}
                children={<Icon size={1} path={mdiCodeTags}/>}
            />
            {isDialogOpen && (
                <MarkupDialog
                    open={isDialogOpen}
                    isNew={!active}
                    tag={controller?.getMarkupTag()}
                    attr={controller?.getMarkupAttrs()}
                    canInsertEmpty={!active && controller?.isCaret()}
                    onClose={closeDialog}
                    onComplete={completeDialog}
                />
            )}
        </>
    );
};
