import React, { FC, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MuiThemeProvider, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useStoryTheme } from "./theme";
import { KeyValueGrid } from "../src/components/KeyValueGrid";

interface StoryProps {
    dark?: boolean;
    data?: Record<string, string | null>;
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
    const { data: initial } = props;
    const [data, setData] = useState(() => new Map(Object.entries(initial || {})));
    const classes = useStyles();
    const onSetValue = (key: string, value: string) => setData(
        before => new Map([...before, [key, value]])
    );
    const onUnsetValue = (unset: string) => setData(
        before => new Map(Array.from(before).filter(([key]) => key !== unset))
    );
    return (
        <div className={classes.root}>
            <div>
                <KeyValueGrid
                    data={data}
                    keyLabel="Key"
                    newKeyLabel="Type a new key here"
                    onSetValue={onSetValue}
                    onUnsetValue={onUnsetValue}
                />
            </div>
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
    title: "KeyValueGrid",
    component: Story,
} as ComponentMeta<typeof Story>;

const Template: ComponentStory<typeof Story> = args => <Story {...args}/>;

export const Light = Template.bind({});
Light.args = {};

export const Dark = Template.bind({});
Dark.args = { dark: true };

export const Data = Template.bind({});
Data.args = {
    data: {
        "Normal": "Value",
        "Multiple": null,
        "Empty": "",
    }
};
