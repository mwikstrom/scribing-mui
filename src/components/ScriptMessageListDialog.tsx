import {
    Box,
    Button,
    DialogActions,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText
} from "@material-ui/core";
import { mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import React, { FC, useCallback, useMemo } from "react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ResponsiveDialog, ResponsiveDialogProps } from "./ResponsiveDialog";

export interface ScriptMessageListDialogProps extends Omit<ResponsiveDialogProps, "onClose"> {
    messages?: ReadonlyMap<string, string>;
    onMessageClick?: (key: string) => void;
    onMessageDelete?: (key: string) => void;
    onAddNew?: () => void;
    onClose?: () => void;
}

export const ScriptMessageListDialog: FC<ScriptMessageListDialogProps> = props => {
    const {
        messages,
        onMessageClick,
        onMessageDelete,
        onAddNew,
        onClose,
        ...otherProps
    } = props;
    const locale = useMaterialFlowLocale();
    const messageArray = useMemo(() => messages ? Array.from(messages) : [], [messages]);
    return (
        <ResponsiveDialog {...otherProps} maxWidth="xs" fullWidth onClose={onClose}>
            <List>
                {messageArray.map(([key, value]) => (
                    <ScriptMessageListItem
                        key={key}
                        messageKey={key}
                        messageFormat={value}
                        onMessageClick={onMessageClick}
                        onMessageDelete={onMessageDelete}
                    />
                ))}
            </List>
            <DialogActions>
                <Button color="primary" onClick={onAddNew}>
                    {locale.button_add_new}
                </Button>
                <Box flex={1}/>
                <Button onClick={onClose}>
                    {locale.button_close}
                </Button>
            </DialogActions>
        </ResponsiveDialog>
    );
};

interface ScriptMessageListItemProps {
    messageKey: string;
    messageFormat: string;
    onMessageClick?: (key: string) => void;
    onMessageDelete?: (key: string) => void;
}

const ScriptMessageListItem: FC<ScriptMessageListItemProps> = props => {
    const {
        messageKey,
        messageFormat,
        onMessageClick: onMessageClickProp,
        onMessageDelete: onMessageDeleteProp
    } = props;
    const onMessageClick = useCallback(() => {
        if (onMessageClickProp) {
            onMessageClickProp(messageKey);
        }
    }, [onMessageClickProp, messageKey]);
    const onMessageDelete = useCallback(() => {
        if (onMessageDeleteProp) {
            onMessageDeleteProp(messageKey);
        }
    }, [onMessageDeleteProp, messageKey]);
    return (
        <ListItem button onClick={onMessageClick}>
            <ListItemText 
                primary={messageKey}
                secondary={
                    <Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                        {messageFormat}
                    </Box>
                }
            />
            <ListItemSecondaryAction>
                <IconButton onClick={onMessageDelete}>
                    <Icon size={1} path={mdiTrashCan}/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};
