import React, { FC, ReactNode, useCallback, useMemo } from "react";
import { Command } from "../commands/Command";
import { FlowEditorController } from "scribing-react";
import { ToolButton, ToolButtonProps } from "../components/ToolButton";
import Icon from "@mdi/react";

export interface CommandButtonProps extends ToolButtonProps {
    command: Command;
    controller?: FlowEditorController | null;
    frozen?: boolean;
    children?: ReactNode;
}

export const CommandButton: FC<CommandButtonProps> = props => {
    const { command, controller, frozen, children: givenChildren, disabled: disabledOverride, ...rest } = props;
    
    const disabled = useMemo(() => {
        if (frozen && !command.ignoreFrozen) {
            return true;
        } else if (typeof disabledOverride === "boolean") {
            return disabledOverride;
        } else if (!controller) {
            return true;
        } else if (!command.isDisabled) {
            return false;
        } else {
            return command.isDisabled(controller);
        }
    }, [disabledOverride, command, frozen, controller]);
    
    const active = useMemo(() => {
        if (!controller) {
            return false;
        } else if (!command.isActive) {
            return false;
        } else {
            return command.isActive(controller);
        }
    }, [command, controller]);

    const children = useMemo(() => {
        if (givenChildren) {
            return givenChildren;
        }
        const iconPath = typeof command.iconPath === "function" ? 
            controller && command.iconPath(controller) : 
            command.iconPath;
        if (!iconPath) {
            return null;
        }
        return (
            <Icon
                size={1}
                path={iconPath}
                horizontal={command.flipIcon && !!controller && command.flipIcon(controller)}
            />
        );
    }, [givenChildren, command, controller]);

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
            children={children}
        />
    );
};
