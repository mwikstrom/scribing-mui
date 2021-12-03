import React, { FC } from "react";
import { FlowEditorController } from "scribing-react";
import { Toolbar } from "@material-ui/core";

/** @public */
export interface FlowEditorToolbarProps {
    controller?: FlowEditorController | null;
}

/** @public */
export const FlowEditorToolbar: FC<FlowEditorToolbarProps> = () => {
    return (
        <Toolbar>
            
        </Toolbar>
    );
};
