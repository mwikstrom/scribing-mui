import React, { FC, useMemo } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MuiThemeProvider, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useStoryTheme } from "./theme";
import { ScriptMessageDialog } from "../src/components/ScriptMessageDialog";

interface StoryProps {
    dark?: boolean;
    messageKey?: string;
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

const Root: FC<Omit<StoryProps, "dark">> = ({messageKey}) => {
    const classes = useStyles();
    const messages = useMemo(() => {
        return new Map()
            .set("TXT1", "Hello world!")
            .set(
                "TXT2",
                `{gender, select,
    male {He has}
    female {She has}
    other {They have}
} {numPhotos, plural,
    =0 {no photos.}
    =1 {one photo.}
    other {# photos.}
}`
            );
    }, []);
    return (
        <div className={classes.root}>
            <ScriptMessageDialog open allMessages={messages} messageKey={messageKey}/>
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
    title: "ScriptMessageDialog",
    component: Story,
} as ComponentMeta<typeof Story>;

const Template: ComponentStory<typeof Story> = args => <Story {...args}/>;

export const LightNew = Template.bind({});
LightNew.args = {};

export const DarkNew = Template.bind({});
DarkNew.args = { dark: true };

export const LightExisting = Template.bind({});
LightExisting.args = { messageKey: "TXT2" };

export const DarkExisting = Template.bind({});
DarkExisting.args = { dark: true, messageKey: "TXT2" };
