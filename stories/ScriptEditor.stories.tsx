import React, { FC } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MuiThemeProvider, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { ScriptEditor } from "../src/components/ScriptEditor";
import { useStoryTheme } from "./theme";

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
    return (
        <div className={classes.root}>
            <ScriptEditor
                className={classes.editor}
                initialValue={SCRIPT_TEXT}
            />
        </div>
    );
};

const SCRIPT_TEXT = `{
  console.log("Hello world");
  const apa = 1 + 2.3;
  // Line comment
  const olle = JSON.stringify(apa);
  const func = () => { /* noop */ };
}
`;

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
    editor: {
        flex: 1,
    },
}));

export default {
    title: "ScriptEditor",
    component: Story,
} as ComponentMeta<typeof Story>;

const Template: ComponentStory<typeof Story> = args => <Story {...args}/>;

export const Light = Template.bind({});
Light.args = {};

export const Dark = Template.bind({});
Dark.args = { dark: true };
