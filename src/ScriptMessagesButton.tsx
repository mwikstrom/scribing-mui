import { IconButton, Tooltip } from "@material-ui/core";
import { mdiMessagePlusOutline, mdiMessageTextOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React, { VFC, useCallback, useEffect, useState } from "react";
import { useMaterialFlowLocale } from "./MaterialFlowLocale";
import { ScriptMessageDialog } from "./components/ScriptMessageDialog";
import { ScriptMessageListDialog } from "./components/ScriptMessageListDialog";

/** @public */
export interface ScriptMessagesButtonProps {
    messages: ReadonlyMap<string, string>;
    lang?: string;
    onMessagesChange: (callback: (before: ReadonlyMap<string, string>) => Map<string, string>) => void;
    onEditChange: (value: boolean) => void;
}

/** @public */
export const ScriptMessagesButton: VFC<ScriptMessagesButtonProps> = props => {
    const locale = useMaterialFlowLocale();
    const {
        messages,
        lang,
        onMessagesChange,
        onEditChange,
    } = props;

    const hasMessages = messages.size > 0;
    const [edit, setEdit] = useState<string | boolean>(false);
    
    const saveMessage = useCallback((key: string, value: string) => {
        onMessagesChange(before => {
            return Object.freeze(new Map(before).set(key, value));
        });
        setEdit(false);
    }, [onMessagesChange]);

    const deleteMessage = useCallback((key: string) => {
        let gotEmpty = false;
        onMessagesChange(before => {
            const after = new Map(before);
            after.delete(key);
            gotEmpty = after.size === 0;
            return Object.freeze(after);
        });
        if (gotEmpty) {
            setEdit(false);
        }
    }, [onMessagesChange]);

    useEffect(() => {
        if (onEditChange) {
            onEditChange(edit !== false);
        }
    }, [edit, onEditChange]);

    return (
        <>
            <Tooltip 
                arrow
                placement="top"
                title={hasMessages ? locale.tip_messages : locale.tip_add_message}
                children={
                    <IconButton color="primary" onClick={() => setEdit(true)}>
                        <Icon
                            path={hasMessages ? mdiMessageTextOutline : mdiMessagePlusOutline}
                            size={1}
                        />
                    </IconButton>
                }
            />
            {edit !== false && ((typeof edit === "string" || !hasMessages) ? (
                <ScriptMessageDialog
                    open
                    BackdropProps={{transitionDuration:0}}
                    allMessages={messages}
                    messageKey={typeof edit === "string" ? edit : undefined}
                    lang={lang}
                    onClose={() => setEdit(false)}
                    onSave={saveMessage}
                />
            ) : (
                <ScriptMessageListDialog
                    open
                    BackdropProps={{transitionDuration:0}}
                    messages={messages}
                    onClose={() => setEdit(false)}
                    onMessageClick={setEdit}
                    onMessageDelete={deleteMessage}
                    onAddNew={() => setEdit("")}
                />
            ))}
        </>
    );
};
