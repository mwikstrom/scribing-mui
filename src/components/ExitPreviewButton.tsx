import { Typography } from "@material-ui/core";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import React, { FC } from "react";
import { TogglePreview } from "../commands/TogglePreview";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { CommandButton, CommandButtonProps } from "../tools/CommandButton";

export type ExitPreviewButtonProps = Omit<CommandButtonProps, "command">;

export const ExitPreviewButton: FC<ExitPreviewButtonProps> = props => {
    const locale = useMaterialFlowLocale();
    return (
        <CommandButton {...props} command={TogglePreview} startIcon={<Icon size={0.75} path={mdiClose}/>}>
            <Typography variant="body2">{locale.button_exit_preview}</Typography>
        </CommandButton>
    );
};
