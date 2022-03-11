import { Box, MuiThemeProvider, Theme, Typography } from "@material-ui/core";
import React, { FC } from "react";
import ReactDOM from "react-dom";
import { ParamInfo, TypeInfo } from "../TypeInfo";

export const getTypeInfoClass = (info: TypeInfo): string => {
    const { decl } = info;
    if (decl === "function" || decl === "class") {
        return decl;
    } else if (decl === "object") {
        return "namespace";
    } else {
        return "variable";
    }
};

export const renderInfo = (props: TypeInfoViewProps): () => HTMLElement => () => {
    const { dom, render } = deferRenderInfo(props);
    render();
    return dom;
};

export const deferRenderInfo = (props: TypeInfoViewProps): { dom: HTMLElement, render: () => void } => {
    const dom = document.createElement("div");
    const render = () => ReactDOM.render(<TypeInfoView {...props}/>, dom);
    return { dom, render };
};

export interface TypeInfoViewProps {
    label: string;
    info: TypeInfo;
    theme: Theme;
}

const TypeInfoView = (props: TypeInfoViewProps) => {
    const { label, info, theme } = props;
    const { scope, decl } = info;
    const overline = [scope, getTypeInfoClass(info)].filter(Boolean).join(" ");
    return (
        <MuiThemeProvider theme={theme}>
            <Block><Subtle>{overline}</Subtle></Block>
            <Block>
                <PrimaryAccent>{label}</PrimaryAccent>
                {decl === "function" ? (
                    <>
                        <Separator>(</Separator>
                        {info.params ? info.params.map((param, index) => (
                            <ParamName key={index} param={param} index={index}/>
                        )) : <Separator>&hellip;</Separator>}
                        <Separator>)</Separator>
                    </>
                ) : (decl === "string" || decl === "boolean" || decl === "number") && info.value !== undefined ? (
                    <>
                        <Separator> = </Separator>
                        <Normal>{info.value}</Normal>
                    </>
                ) : info.decl !== "unknown" && (
                    <>
                        <Separator>: </Separator>
                        <InlineType info={info}/>
                    </>
                )}
            </Block>
            {info.desc && (
                <Box my={2}>
                    <Typography variant="body2">{info.desc}</Typography>
                </Box>
            )}
            {decl === "function" && info.params && info.params.map((param, index) => (
                <Box key={index} mt={1}>
                    <Block>
                        {param.optional && <Subtle>optional </Subtle>}
                        {param.spread && <Subtle>rest </Subtle>}
                        <Subtle>param </Subtle>
                        <SecondaryAccent>{getParamName({param, index})}</SecondaryAccent>
                        {param.type && param.type.decl !== "unknown" && (
                            <>
                                <Separator>: </Separator>
                                <InlineType info={param.type}/>
                            </>
                        )}
                    </Block>
                </Box>
            ))}
            {decl === "function" && info.returnType && (
                <Box mt={1}>
                    <Block>
                        <Subtle>returns </Subtle>
                        <InlineType info={info.returnType}/>
                    </Block>
                </Box>
            )}
        </MuiThemeProvider>
    );
};

interface InlineTypeProps {
    info: TypeInfo;
}

const InlineType = (props: InlineTypeProps) => {
    const { info } = props;
    const { decl } = info;
    if (decl === "promise") {
        const label = <Normal>Promise</Normal>;
        if (info.resolveType) {
            return (
                <>
                    {label}
                    <Separator>&lt;</Separator>
                    <InlineType info={info.resolveType}/>
                    <Separator>&gt;</Separator>
                </>
            );
        } else {
            return label;
        }
    } else if (decl === "array") {
        const label = <Normal>Array</Normal>;
        if (info.itemType && info.itemType.decl !== "unknown") {
            return (
                <>
                    {label}
                    <Separator>&lt;</Separator>
                    <InlineType info={info.itemType}/>
                    <Separator>&gt;</Separator>
                </>
            );
        } else {
            return label;
        }
    } else if (decl === "tuple") {
        return (
            <>
                <Separator>[</Separator>
                {info.itemTypes.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <Separator>, </Separator>}
                        <InlineType info={item}/>
                    </React.Fragment>
                ))}
                <Separator>]</Separator>
            </>
        );
    } else if (decl === "union") {
        return (
            <>
                <Separator>(</Separator>
                {info.union.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <Separator> | </Separator>}
                        <InlineType info={item}/>
                    </React.Fragment>
                ))}
                <Separator>)</Separator>
            </>
        );
    } else {
        return <Normal>{decl}</Normal>;
    }
};

interface ParamNameProps {
    param: ParamInfo;
    index: number;
}

const ParamName = (props: ParamNameProps) => {
    const { index, param: { spread, optional } } = props;
    return (
        <>
            {index > 0 && <Separator>, </Separator>}
            {spread && <Normal>&hellip;</Normal>}
            <SecondaryAccent>{getParamName(props)}</SecondaryAccent>
            {optional && <Normal>?</Normal>}
        </>
    );
};

const getParamName = (props: ParamNameProps) => {
    const { index, param: { name = `p${index}` } } = props;
    return name;
};

const Block: FC = props => (
    <Typography variant="caption" component="div" {...props}/>
);

const Separator: FC = props => <Subtle {...props}/>;

const PrimaryAccent: FC = props => (
    <Typography variant="inherit" component="span" color="primary" {...props}/>
);

const SecondaryAccent: FC = props => (
    <Typography variant="inherit" component="span" color="secondary" {...props}/>
);

const Normal: FC = props => (
    <Typography variant="inherit" component="span" color="textPrimary" {...props}/>
);

const Subtle: FC = props => (
    <Typography variant="inherit" component="span" color="textSecondary" {...props}/>
);
