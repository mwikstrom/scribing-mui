import React, { FC, useMemo, useCallback, useEffect, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Box, Button, CssBaseline, MuiThemeProvider, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { ScriptEditor, ScriptEditorProps } from "../src/ScriptEditor";
import { useStoryTheme } from "./theme";
import { createBrowserScriptHost, ScriptHostScope, useScriptHost } from "scripthost-react";
import { ScriptFunction } from "scripthost";
import { ParamInfoTipRenderProps, TypeInfo } from "../src/TypeInfo";

interface StoryProps extends Omit<ScriptEditorProps, "className" | "initialValue" | "globals"> {
    dark?: boolean;
}

const Story: FC<StoryProps> = props => {
    const { dark, ...rest } = props;
    const theme = useStoryTheme(dark);
    const host = useMemo(() => createBrowserScriptHost({ expose: { myFunc } }), []);
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline>
                <ScriptHostScope host={host}>
                    <Root {...rest}/>
                </ScriptHostScope>
            </CssBaseline>
        </MuiThemeProvider>
    );
};

const myFunc: ScriptFunction = async () => void(0);

TypeInfo.annotate(myFunc, TypeInfo.function([
    { renderInfoTip: props => <MyParamInfo {...props}/> },
]));

const Root: FC<Omit<StoryProps, "dark">> = props => {
    const classes = useStyles();
    const host = useScriptHost();
    const globals = useMemo(() => {
        const result = new Map<string, TypeInfo>();
        for (const [key, func] of Object.entries(host.funcs)) {
            if (func) {
                result.set(key, TypeInfo.from(func));
            }
        }
        return result;
    }, [host]);
    return (
        <div className={classes.root}>
            <ScriptEditor
                {...props}
                className={classes.editor}
                initialValue={SCRIPT_TEXT}
                globals={globals}
            />
        </div>
    );
};

const SCRIPT_TEXT = `{
  // Line comment
  const message = "Hello world";
  myFunc(123, "abc", { flag: true });
  const olle = JSON.stringify(apa);
  const func = () => { /* noop */ };
}
`;

const MyParamInfo = (props: ParamInfoTipRenderProps) => {
    const { hasConstantValue, constantValue, onApplyConstantValue, onUpdateLayout } = props;
    const [ showButton, setShowButton ] = useState(false);
    const onApplyRandomValue = useCallback(() => {
        if (onApplyConstantValue) {
            onApplyConstantValue(Math.floor(Math.random() * 1000));
        }
    }, [onApplyConstantValue]);
    useEffect(() => {
        const timerId = setTimeout(() => {
            setShowButton(true);
            onUpdateLayout();
        }, 500);
        return () => clearTimeout(timerId);
    }, []);
    return (
        <Box p={1}>
            <Typography variant="body1" color={hasConstantValue ? "textPrimary" : "textSecondary"}>
                {hasConstantValue ? String(constantValue) : "n/a"}
            </Typography>
            {showButton && (
                <Button variant="outlined" color="primary" onClick={onApplyRandomValue}>Set random</Button>
            )}
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

export const LightReadOnly = Template.bind({});
LightReadOnly.args = { readOnly: true, autoFocus: true };

export const DarkReadOnly = Template.bind({});
DarkReadOnly.args = { dark: true, readOnly: true, autoFocus: true };
