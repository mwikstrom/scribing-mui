import React, { FC, useCallback, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Box, Button, MuiThemeProvider, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useStoryTheme } from "./theme";
import { ScriptEditorDialog } from "../src/ScriptEditorDialog";
import { Script } from "scribing";

interface StoryProps {
    dark?: boolean;
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

const Root: FC<Omit<StoryProps, "dark">> = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const [value, setValue] = useState<Script | null>(null);
    const toggle = useCallback(() => setOpen(before => !before), []);
    const complete = useCallback((result: Script | null) => {
        if (result) {
            setValue(result);
        }
        setOpen(false);
    }, []);
    return (
        <div className={classes.root}>
            <Box p={2}>
                <Button disabled={open} onClick={toggle}>Open dialog</Button>
            </Box>
            {open && (
                <ScriptEditorDialog
                    open={open}
                    onClose={toggle}
                    onComplete={complete}
                    onSave={setValue}
                    initialValue={value}
                    scriptLabel="Script code"
                />
            )}
        </div>
    );
};

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
}));

export default {
    title: "ScriptEditorDialog",
    component: Story,
} as ComponentMeta<typeof Story>;

const Template: ComponentStory<typeof Story> = args => <Story {...args}/>;

export const Light = Template.bind({});
Light.args = {};

export const Dark = Template.bind({});
Dark.args = { dark: true };
