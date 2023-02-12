import React, { FC, useCallback, useMemo } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CssBaseline, MuiThemeProvider, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { CodeEditor, CodeEditorProps } from "../src/CodeEditor";
import { json } from "@codemirror/lang-json";
import { useStoryTheme } from "./theme";

interface StoryProps extends Omit<CodeEditorProps, "className"> {
    dark?: boolean;
    illegalWords?: readonly string[];
}

const Story: FC<StoryProps> = props => {
    const { dark, ...rest } = props;
    const theme = useStoryTheme(dark);
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline>
                <Root {...rest}/>
            </CssBaseline>
        </MuiThemeProvider>
    );
};

const Root: FC<Omit<StoryProps, "dark">> = props => {
    const { illegalWords, initialValue = INITIAL_VALUE, ...otherProps } = props;
    const classes = useStyles();
    const language = useMemo(json, []);
    const parse = useCallback<Required<CodeEditorProps>["parse"]>((input, report) => {
        if (illegalWords) {
            for (let i = 0; i < illegalWords.length; ++i) {
                const word = illegalWords[i];
                let pos = 0;
                while (pos >= 0) {
                    pos = input.indexOf(word, pos);
                    if (pos >= 0) {
                        report({
                            from: pos,
                            to: pos += word.length,
                            severity: (["error", "warning", "info"] as const)[i % 4],
                            message: `The word "${word}" is not allowed`
                        });
                    }
                }
            }
        }
        JSON.parse(input);
    }, [illegalWords]);
    return (
        <div className={classes.root}>
            <CodeEditor
                {...otherProps}
                parse={parse}
                language={language}
                className={classes.editor}
                initialValue={initialValue}
            />
        </div>
    );
};

const INITIAL_VALUE = `{
    "foo": "bar",
    "bar": 123,
    "nested": {
        "array": [1, 2, 3],
        "ok": true
    }
}
`;

const MY_VALUE = `{
    "foo": "bar",
    "bar": 123,
    "removed": "yes",
    "nested": {
        "array": [1, 2, 3],
        "ok": true
    }
}
`;

const THEIR_VALUE = `{
    "foo": "Bar",
    "baz": 12.34,        
    "nested": {
        "deep": {
            "array": [1.2, 2, 3, 4],
            "ok": true
        }
    },
    "new": null
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
    title: "JsonEditor",
    component: Story,
} as ComponentMeta<typeof Story>;

const Template: ComponentStory<typeof Story> = args => <Story {...args}/>;

export const Light = Template.bind({});
Light.args = {};

export const Dark = Template.bind({});
Dark.args = { dark: true };

export const DarkIllegalWords = Template.bind({});
DarkIllegalWords.args = { dark: true, illegalWords: ["foo", "bar", "fubar!"] };

export const DarkDiff = Template.bind({});
DarkDiff.args = {
    dark: true,
    initialValue: MY_VALUE,
    theirValue: THEIR_VALUE,
    label: "Authored",
    theirLabel: "Imported"
};

export const LightDiff = Template.bind({});
LightDiff.args = {
    initialValue: MY_VALUE,
    theirValue: THEIR_VALUE,
    label: "Authored",
    theirLabel: "Imported"
};

export const LightReadOnly = Template.bind({});
LightReadOnly.args = { readOnly: true, autoFocus: true };

export const DarkReadOnly = Template.bind({});
DarkReadOnly.args = { dark: true, readOnly: true, autoFocus: true };
