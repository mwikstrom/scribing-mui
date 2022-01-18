import React, { FC, useCallback, useMemo, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CustomInteractionOption, EditorSourceState, FlowEditorToolbar } from "../src/FlowEditorToolbar";
import { Button, Dialog, DialogActions, DialogTitle, MuiThemeProvider, TextField, Theme } from "@material-ui/core";
import { FlowEditor, FlowEditorController, FlowEditorState } from "scribing-react";
import { MaterialFlowPalette } from "../src/MaterialFlowPalette";
import { makeStyles } from "@material-ui/styles";
import { FlowContent, Interaction, OpenUrl } from "scribing";
import { useStoryTheme } from "./theme";
import { MaterialFlowTypography } from "../src/MaterialFlowTypography";
import { MaterialScribingComponents } from "../src";

interface StoryProps {
    dark?: boolean;
    broken?: boolean;
}

const Story: FC<StoryProps> = props => {
    const { dark, ...rest } = props;
    const theme = useStoryTheme(dark);
    return (
        <MuiThemeProvider theme={theme}>
            <Root {...rest}/>
        </MuiThemeProvider>
    );
};

const Root: FC<Omit<StoryProps, "dark">> = props => {
    const { broken } = props;
    const [controller, setController] = useState<FlowEditorController | null>(null);
    const classes = useStyles();
    const [source, setSource] = useState<EditorSourceState>(broken ? "broken" : "checked-out");
    const transitionSource = useCallback((target: EditorSourceState, delay = 1000) => {
        setSource("busy");
        const timerId = setTimeout(() => setSource(target), delay);
        return () => clearTimeout(timerId);
    }, []);
    const onCheckIn = useCallback(() => transitionSource("checked-in"), []);
    const onCheckOut = useCallback(() => transitionSource("checked-out"), []);
    const frozen = useMemo(() => source === "busy" || source === "checked-in", [source]);    
    const getCustomInteractionOptions = useCallback((interaction: Interaction | null) => {
        const openTopic: CustomInteractionOption = {
            key: "open_topic",
            label: "Open topic",
            selected: interaction instanceof OpenUrl && /^[a-zA-Z0-9-]+$/.test(interaction.url),
            renderDialog: (interaction, onClose) => <OpenTopicDialog interaction={interaction} onClose={onClose}/>
        };
        return [openTopic];
    }, []);
    return (
        <div className={classes.root}>
            <MaterialFlowTypography>
                <MaterialFlowPalette>
                    <MaterialScribingComponents>
                        <FlowEditorToolbar
                            className={classes.toolbar}
                            controller={controller}
                            source={source}
                            frozen={frozen}
                            onCheckIn={onCheckIn}
                            onCheckOut={onCheckOut}
                            getCustomInteractionOptions={getCustomInteractionOptions}
                        />
                        <FlowEditor
                            className={classes.editor}
                            defaultState={INITIAL_STATE}
                            onControllerChange={setController}
                            autoFocus
                        />
                    </MaterialScribingComponents>
                </MaterialFlowPalette>
            </MaterialFlowTypography>
        </div>
    );
};

interface OpenTopicDialogProps {
    interaction: Interaction | null;
    onClose: (interaction?: Interaction | null) => void;
}

const OpenTopicDialog = (props: OpenTopicDialogProps) => {
    const { interaction, onClose } = props;
    const [url, setUrl] = useState(() => interaction instanceof OpenUrl ? interaction.url : "");
    return (
        <Dialog open onClose={() => onClose()}>
            <DialogTitle>Open topic</DialogTitle>
            <TextField value={url} onChange={e => setUrl(e.target.value)}/>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button onClick={() => onClose(new OpenUrl({ url }))}>OK</Button>
            </DialogActions>
        </Dialog>
    );
};

const INITIAL_STATE = FlowEditorState.empty.set("content", FlowContent.emptyParagraph);

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(2),
    },
    toolbar: {
    },
    editor: {
        flex: 1,
        overflow: "auto",
    },
}));

export default {
    title: "FlowEditorToolbar",
    component: Story,
} as ComponentMeta<typeof Story>;

const Template: ComponentStory<typeof Story> = args => <Story {...args}/>;

export const Light = Template.bind({});
Light.args = {};

export const Dark = Template.bind({});
Dark.args = { dark: true };

export const LightBroken = Template.bind({});
LightBroken.args = { broken: true };

export const DarkBroken = Template.bind({});
DarkBroken.args = { broken: true, dark: true };
