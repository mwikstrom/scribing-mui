import React, { FC, ReactNode, useCallback, useMemo } from "react";
import { Command } from "./commands/Command";
import { FlowEditorController } from "scribing-react";
import { ToolButton, ToolButtonProps } from "./ToolButton";
import Icon from "@mdi/react";

export interface CommandButtonProps extends ToolButtonProps {
    command: Command;
    controller?: FlowEditorController | null;
    children?: ReactNode;
}

export const CommandButton: FC<CommandButtonProps> = props => {
    const { command, controller, children, ...rest } = props;
    const { iconPath } = command;
    
    const disabled = useMemo(() => {
        if (!controller) {
            return true;
        } else if (!command.isDisabled) {
            return false;
        } else {
            return command.isDisabled(controller);
        }
    }, [command, controller]);
    
    const active = useMemo(() => {
        if (!controller) {
            return false;
        } else if (!command.isActive) {
            return false;
        } else {
            return command.isActive(controller);
        }
    }, [command, controller]);

    const onClick = useCallback(() => {
        if (controller) {
            command.exec(controller);
        }
    }, [command, controller]);

    return (
        <ToolButton
            {...rest}
            disabled={disabled}
            active={active}
            onClick={onClick}
            children={children ? children : iconPath && <Icon size={1} path={iconPath}/>}
        />
    );
};
