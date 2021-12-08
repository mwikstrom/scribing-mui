import { alpha, Button, Tab, Tabs, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import React, { FC, useEffect, useState } from "react";
import { DataIcon, useDataIcons } from "scribing-react";
import { useMaterialFlowLocale } from "..";
import { IconTagSelector } from "./IconTagSelector";
import { VirtualGrid } from "./VirtualGrid";

export interface IconSelectorProps {
    className?: string;
    initial?: string;
    onChange?: (value: string) => void;
    onApply?: (value: string) => void;
}

export const IconSelector: FC<IconSelectorProps> = props => {
    const { className, initial = "", onChange, onApply } = props;
    const locale = useMaterialFlowLocale();
    const [tabIndex, setTabIndex] = useState(0);
    const [selectedIcon, setSelectedIcon] = useState(initial);
    const pack = ["predefined", "mdi"][tabIndex];
    const [tag, setTag] = useState("");
    const iconArray = useDataIcons(pack, tag);
    const classes = useStyles();
    useEffect(() => setTag(""), [pack]);
    useEffect(() => {
        if (onChange) {
            onChange(selectedIcon);
        }
    }, [onChange, selectedIcon]);
    return (
        <div className={className}>
            <div className={classes.header}>
                <Tabs value={tabIndex} onChange={(_, value) => setTabIndex(value)} textColor="secondary">
                    <Tab label={locale.tab_predefined_icons}/>
                    <Tab label={locale.tab_material_design_icons}/>
                </Tabs>
                <div style={{flex:1}}/>
                <IconTagSelector
                    className={classes.tagSelector}
                    pack={pack}
                    selected={tag}
                    onChange={setTag}
                />
            </div>
            <VirtualGrid 
                className={classes.gallery}
                children={iconArray}
                itemWidth={ITEM_SIZE}
                itemHeight={ITEM_SIZE}
                getItemKey={item => item}
                renderItem={item => (
                    <Button
                        className={clsx(
                            classes.galleryItem,
                            item === selectedIcon && classes.activeItem,
                        )}
                        children={<DataIcon className={classes.icon} data={item}/>}
                        onClick={() => setSelectedIcon(item)}
                        onDoubleClick={() => {
                            setSelectedIcon(item);
                            if (onApply) {
                                onApply(item);
                            }
                        }}
                    />
                )}
                itemClass={classes.galleryItem}
                itemDisplay={"inline-flex"}
                maxRows={MAX_ROWS}
                resetScrollOnChange
            />
        </div>
    );
};

const ICON_SIZE = 48;
const MAX_ROWS = 5;
const ITEM_SIZE = 80;

const useStyles = makeStyles((theme: Theme) => ({
    header: {
        display: "flex",
        flexDirection: "row",
    },
    gallery: {
        minHeight: ITEM_SIZE * MAX_ROWS,
    },
    galleryItem: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        alignItems: "center",
        justifyContent: "center",
        "&$activeItem": {
            backgroundColor: alpha(theme.palette.action.active, 0.12),
            "&:hover": {
                backgroundColor: alpha(theme.palette.action.active, 0.15),
            },    
        }
    },
    activeItem: {},
    icon: {
        width: ICON_SIZE,
        height: ICON_SIZE,
    },
    tagSelector: {
        maxHeight: 40,
        overflow: "hidden",
        alignSelf: "center",
    },
}));

