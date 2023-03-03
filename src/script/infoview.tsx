import { Box, Container, Divider, Typography } from "@material-ui/core";
import React, { FC, ReactNode, ReactPortal } from "react";
import ReactDOM from "react-dom";
import { ParamInfo, TypeInfo } from "../TypeInfo";

export const getTypeInfoClass = (info: TypeInfo, local?: boolean): string => {
    const { decl } = info;
    if (decl === "function" || decl === "class") {
        return decl;
    } else if (decl === "object" && !local) {
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
    const { mount, ...other } = props;
    const func = () => <TypeInfoView {...other}/>;
    return deferRenderFunc(func, mount);
};

export const deferRenderFunc = (
    func: () => ReactNode,
    mount: MountFunc,
): { dom: HTMLElement, render: () => void } => {
    const dom = document.createElement("div");
    dom.className = "cm-paraminfo";    
    const render = () => {
        const portal = ReactDOM.createPortal(func(), dom);
        const unmount = mount(portal);
        const observer = new MutationObserver(list => list.forEach(m => m.removedNodes.forEach(node => {
            if (node === dom) {
                unmount();
                observer.disconnect();
            }
        })));
        let attempt = 1;
        const setup = () => {
            if (dom.parentElement) {
                observer.observe(dom.parentElement, { childList: true });
            } else if (attempt >= 10) {
                unmount();
            } else {
                ++attempt;
                setTimeout(setup, attempt > 2 ? 50 : 0);
            }
        };
        setup();
    };
    return { dom, render };
};

export interface UnmountFunc {
    (): void;
}

export interface MountFunc {
    (portal: ReactPortal): UnmountFunc;
}

export interface TypeInfoViewProps {
    label: string;
    info: TypeInfo;
    pad?: boolean;
    mount: MountFunc;
}

const TypeInfoView = (props: Omit<TypeInfoViewProps, "mount">) => {
    const { label, info, pad } = props;
    const { scope, decl } = info;
    const overline = [scope, getTypeInfoClass(info, scope === "local")].filter(Boolean).join(" ");
    return (
        <Container maxWidth="sm" disableGutters>
            <Box p={pad ? 1 : 0}>
                <Block><Subtle>{overline}</Subtle></Block>
                {decl === "union" ? info.union.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && (
                            <Box my={2}><Divider /></Box>
                        )}
                        <TypeInfoViewBody label={label} info={item} />   
                    </React.Fragment>
                )) : <TypeInfoViewBody label={label} info={info} />}
            </Box>
        </Container>
    );
};

const TypeInfoViewBody = (props: Pick<TypeInfoViewProps, "label" | "info">) => {
    const { label, info } = props;
    const { decl } = info;
    return (
        <>
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
                ) : (
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
            {decl === "object" && info.props && Object.entries(info.props).map(([key, prop]) => (
                <Box key={key} mt={1}>
                    <Block>
                        <Subtle>property </Subtle>
                        <SecondaryAccent>{key}</SecondaryAccent>
                        <Separator>: </Separator>
                        <InlineType info={prop}/>
                        {prop.desc && (
                            <Box pl={2}><Subtle>{prop.desc}</Subtle></Box>
                        )}
                    </Block>
                </Box>
            ))}
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
                        {param.desc && (
                            <Box pl={2}><Subtle>{param.desc}</Subtle></Box>
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
        </>
    );
};

interface InlineTypeProps {
    info: TypeInfo;
}

const InlineType = (props: InlineTypeProps) => {
    const { info } = props;
    const { decl, ident } = info;
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
    } else if (ident) {
        return <PrimaryAccent>{ident}</PrimaryAccent>;
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
