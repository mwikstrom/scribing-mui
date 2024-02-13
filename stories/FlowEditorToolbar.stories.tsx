import React, { FC, useCallback, useMemo, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CustomOption, EditorSourceState, FlowEditorToolbar, FlowEditorToolbarProps } from "../src/FlowEditorToolbar";
import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    MuiThemeProvider, 
    TextField, 
    Theme 
} from "@material-ui/core";
import { FlowEditor, FlowEditorController, FlowEditorState } from "scribing-react";
import { MaterialFlowPalette } from "../src/MaterialFlowPalette";
import { makeStyles } from "@material-ui/styles";
import { FlowContent, Interaction, OpenUrl } from "scribing";
import { useStoryTheme } from "./theme";
import { MaterialFlowTypography } from "../src/MaterialFlowTypography";
import { MarkupInfo, MarkupUpdateInfo } from "../src/MarkupInfo";
import { MaterialScribingComponents } from "../src/MaterialScribingComponents";
import { InteractionOptionResult } from "../src";

interface StoryProps {
    dark?: boolean;
    customPreview?: boolean;
    broken?: boolean;
    renderImageSelector?: FlowEditorToolbarProps["renderImageSelector"];
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
    const { broken, customPreview, renderImageSelector } = props;
    const [controller, setController] = useState<FlowEditorController | null>(null);
    const classes = useStyles();

    const [source, setSource] = useState<EditorSourceState>(broken ? "broken" : "checked-out");

    const [isProofReadingActive, setProofReadingActive] = useState(false);
    const onToggleProofReading = useCallback(() => setProofReadingActive(before => !before), [setProofReadingActive]);

    const [isFullscreenActive, setFullscreenActive] = useState(false);
    const onToggleFullscreen = useCallback(() => setFullscreenActive(before => !before), [setFullscreenActive]);

    const [isPreviewActive, setPreviewActive] = useState(false);
    const onTogglePreview = useCallback(() => setPreviewActive(before => !before), [setPreviewActive]);

    const transitionSource = useCallback((target: EditorSourceState, delay = 1000) => {
        setSource("busy");
        const timerId = setTimeout(() => setSource(target), delay);
        return () => clearTimeout(timerId);
    }, []);

    const onCheckIn = useCallback(() => transitionSource("checked-in"), []);
    const onCheckOut = useCallback(() => transitionSource("checked-out"), []);
    const frozen = useMemo(() => source === "busy" || source === "checked-in", [source]);

    const getCustomInteractionOptions = useCallback((interaction: Interaction | null) => {
        const openTopic: CustomOption<Interaction | null, InteractionOptionResult> = {
            key: "open_topic",
            label: "Open topic",
            selected: interaction instanceof OpenUrl && /^[a-zA-Z0-9-]+$/.test(interaction.url),
            renderDialog: (current, onClose) => <OpenTopicDialog interaction={current} onClose={onClose}/>
        };
        return [openTopic];
    }, []);

    const getCustomMarkupOptions = useCallback((markup: MarkupInfo | null) => {
        const importFragment: CustomOption<MarkupInfo | null, MarkupUpdateInfo> = {
            key: "import_fragment",
            label: "Import fragment",
            selected: markup?.tag === "Import" && !!markup.attr?.has("topic"),
            renderDialog: (current, onClose) => <ImportTopicDialog markup={current} onClose={onClose}/>
        };
        return [importFragment];
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
                            isProofReadingActive={isProofReadingActive}
                            isFullscreenActive={isFullscreenActive}
                            isPreviewActive={customPreview ? isPreviewActive : undefined}
                            onCheckIn={onCheckIn}
                            onCheckOut={onCheckOut}
                            onToggleProofReading={onToggleProofReading}
                            onToggleFullscreen={onToggleFullscreen}
                            onTogglePreview={onTogglePreview}
                            getCustomInteractionOptions={getCustomInteractionOptions}
                            getCustomMarkupOptions={getCustomMarkupOptions}
                            renderImageSelector={renderImageSelector}
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
    onClose: (interaction?: InteractionOptionResult) => void;
}

const OpenTopicDialog = (props: OpenTopicDialogProps) => {
    const { interaction, onClose } = props;
    const [url, setUrl] = useState(() => interaction instanceof OpenUrl ? interaction.url : "");
    const onOk = useCallback(() => {
        const interaction = new OpenUrl({ url });
        if (url === "foo") {
            onClose({ interaction, defaultText: "FOOBAR" });
        } else {
            onClose(interaction);
        }
    }, [onClose, url]);
    return (
        <Dialog open onClose={() => onClose()}>
            <DialogTitle>Open topic</DialogTitle>
            <DialogContent>
                <TextField autoFocus variant="outlined" value={url} onChange={e => setUrl(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button onClick={onOk}>OK</Button>
            </DialogActions>
        </Dialog>
    );
};

interface ImportTopicDialogProps {
    markup: MarkupInfo | null;
    onClose: (update?: MarkupUpdateInfo) => void;
}

const ImportTopicDialog = (props: ImportTopicDialogProps) => {
    const { markup, onClose } = props;
    const [topic, setTopic] = useState(() => markup?.attr?.get("topic") || "");
    const onApply = useCallback(() => {
        onClose({ tag: "Import", attr: new Map().set("topic", topic), empty: true});
    }, [onClose, topic]);
    return (
        <Dialog open onClose={() => onClose()}>
            <DialogTitle>Import topic</DialogTitle>
            <DialogContent>
                <TextField autoFocus variant="outlined" value={topic} onChange={e => setTopic(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button onClick={onApply}>OK</Button>
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

export const DarkWithImageSelector = Template.bind({});
DarkWithImageSelector.args = {
    dark: true,
    renderImageSelector: callback => (
        <Dialog open onClose={() => callback(null)}>
            <DialogActions>
                <Button onClick={() => callback("fake-url")}>Insert fake</Button>
            </DialogActions>
        </Dialog>
    ),
};

export const DarkWithCustomPreview = Template.bind({});
DarkWithCustomPreview.args = {
    dark: true,
    customPreview: true,
};
