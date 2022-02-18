import React, { FC, useMemo } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MuiThemeProvider, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useStoryTheme } from "./theme";
import { ScriptMessageListDialog } from "../src/components/ScriptMessageListDialog";

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
    const messages = useMemo(() => {
        return new Map()
            .set("TXT1", "Hello world!")
            .set(
                "TXT2",
                `You have {numPhotos, plural,
    =0 {no photos.}
    =1 {one photo.}
    other {# photos.}
}`
            );
    }, []);
    return (
        <div className={classes.root}>
            <ScriptMessageListDialog open messages={messages}/>
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
    title: "ScriptMessageListDialog",
    component: Story,
} as ComponentMeta<typeof Story>;

const Template: ComponentStory<typeof Story> = args => <Story {...args}/>;

export const Light = Template.bind({});
Light.args = {};

export const Dark = Template.bind({});
Dark.args = { dark: true };
