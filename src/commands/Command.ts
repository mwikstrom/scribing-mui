import { FlowEditorController } from "scribing-react";

export interface Command {
    exec: (controller: FlowEditorController) => void;
    isActive?: (controller: FlowEditorController) => boolean | undefined;
    isDisabled?: (controller: FlowEditorController) => boolean | undefined;
    iconPath?: string | ((controller: FlowEditorController) => string);
    flipIcon?: (controller: FlowEditorController) => boolean | undefined;
    ignoreFrozen?: boolean;
}
