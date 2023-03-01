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

TypeInfo.annotate(
    myFunc,
    TypeInfo.function(
        [ 
            { renderInfoTip: props => <MyParamInfo {...props}/>, desc: "The first param" },
            { renderInfoTip: props => <MyParamInfo {...props}/> },
            { renderInfoTip: props => <MyParamInfo {...props}/>, desc: "The third param" },
        ],
        TypeInfo.promise(TypeInfo.ident("MyObj", TypeInfo.desc("My fine object", TypeInfo.object({
            propA: TypeInfo.string,
            propB: TypeInfo.union(TypeInfo.object({
                foo: TypeInfo.desc("The number of cool things", TypeInfo.number),
                bar: TypeInfo.array(TypeInfo.object({ bool: TypeInfo.boolean })),
            }), TypeInfo.undefined),
        }))))
    )
);

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
  const obj = await myFunc(123, "abc", { flag: true });
  const olle = JSON.stringify(apa);
  const func = () => { /* noop */ };
  const { propA, propB: B } = obj;
  const b = obj.propB;
}
`;

const MyParamInfo = (props: ParamInfoTipRenderProps) => {
    const {
        hasConstantValue,
        constantValue,
        variableName,
        paramIndex,
        paramsBefore,
        onApplyConstantValue,
        onApplyVariableName,
        onUpdateLayout
    } = props;
    const [ showButton, setShowButton ] = useState(false);
    const onApplyRandomValue = useCallback(() => {
        if (onApplyConstantValue) {
            onApplyConstantValue(Math.floor(Math.random() * 1000));
        }
    }, [onApplyConstantValue]);
    const onApplyRandomName = useCallback(() => {
        if (onApplyVariableName) {
            onApplyVariableName(`VAR_${Math.floor(Math.random() * 1000)}`);
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
            <Typography>Parameter index: {paramIndex}</Typography>
            <Typography variant="body1" color={hasConstantValue || variableName ? "textPrimary" : "textSecondary"}>
                {hasConstantValue ? String(constantValue) : variableName || "n/a"}
            </Typography>
            {showButton && (
                <>
                    <Button variant="outlined" color="primary" onClick={onApplyRandomValue}>Set random value</Button>
                    <Button variant="outlined" color="primary" onClick={onApplyRandomName}>Set random name</Button>
                </>
            )}
            {paramsBefore.length > 0 && (
                <>
                    <Typography>Before:</Typography>
                    {paramsBefore.map(before => (
                        <Typography variant="body1">
                            {before.hasConstantValue ? String(before.constantValue) : before.variableName || "n/a"}
                        </Typography>    
                    ))}
                </>
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

export const LightIntialCaretPosition = Template.bind({});
LightIntialCaretPosition.args = { initialPosition: 39 };
