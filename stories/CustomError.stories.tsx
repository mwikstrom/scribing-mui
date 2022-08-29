import React, { FC, useCallback, useEffect, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Box, Button, MuiThemeProvider, Theme, Typography } from "@material-ui/core";
import { ApplicationErrorRenderScope, FlowView } from "scribing-react";
import { MaterialFlowPalette } from "../src/MaterialFlowPalette";
import { makeStyles } from "@material-ui/styles";
import { FlowContent } from "scribing";
import { useStoryTheme } from "./theme";
import { MaterialFlowTypography } from "../src/MaterialFlowTypography";
import { MaterialScribingComponents } from "../src/MaterialScribingComponents";

interface StoryProps {
    dark?: boolean;
    content?: FlowContent;
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
    const { content = FlowContent.emptyParagraph } = props;
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <MaterialFlowTypography>
                <MaterialFlowPalette>
                    <MaterialScribingComponents>
                        <ApplicationErrorRenderScope renderErrorInfo={renderErrorInfo}>
                            <FlowView content={content}/>
                        </ApplicationErrorRenderScope>
                    </MaterialScribingComponents>
                </MaterialFlowPalette>
            </MaterialFlowTypography>
        </div>
    );
};

const renderErrorInfo = (error: Error) => <ErrorInfo error={error}/>;

const ErrorInfo: FC<{error: Error}> = props => {
    const { error } = props;
    const [pending, setPending] = useState(true);
    const onClick = useCallback(() => {
        alert("This is FUN!");
    }, []);
    useEffect(() => {
        const timerId = setTimeout(() => setPending(false), 1000);
        return () => { clearTimeout(timerId); };
    }, [error]);
    return pending ? (
        <Box>
            <Typography variant="caption">Rendition is pending...</Typography>
        </Box>
    ) : (
        <Box>
            <Typography variant="h4" color="secondary">Custom error!</Typography>
            <Typography variant="body2">{error.message}</Typography>
            <Box py={1}>
                <Button onClick={onClick} variant="outlined">Click me for fun!</Button>
            </Box>
        </Box>
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
    title: "CustomError",
    component: Story,
} as ComponentMeta<typeof Story>;

const Content = FlowContent.fromJsonValue([
    "This button should fail and a custom error should be displayed in a tooltip:",
    { break: "para" },
    {
        box: ["Click me!"],
        style: {
            interaction: { script: "{ await delay(1000); throw new Error('This failed intentionally'); }" },
        }    
    },
    { break: "para" },
]);

const Template: ComponentStory<typeof Story> = args => <Story {...args}/>;

export const Light = Template.bind({});
Light.args = { content: Content };

export const Dark = Template.bind({});
Dark.args = { content: Content, dark: true };

