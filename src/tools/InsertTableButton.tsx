import { Menu, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { mdiTablePlus } from "@mdi/js";
import { Icon } from "@mdi/react";
import clsx from "clsx";
import React, { FC, useCallback, useMemo, useState } from "react";
import { FlowEditorController } from "scribing-react";
import { ToolButton, ToolButtonProps } from "./ToolButton";

export interface InsertTableButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
}

export const InsertTableButton: FC<InsertTableButtonProps> = props => {
    const { controller, ...rest } = props;
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [buttonRef, setButtonRef] = useState<HTMLElement | null>(null);
    const [cols, setCols] = useState(1);
    const [rows, setRows] = useState(1);
    const openMenu = useCallback(() => setMenuOpen(true), []);
    const closeMenu = useCallback(() => setMenuOpen(false), []);
    const insertTable = useCallback(() => {
        closeMenu();
        controller?.insertTable(cols, rows);
    }, [controller, closeMenu, cols, rows]);
    const disabled = useMemo(() => !controller || !controller.isCaret(), [controller]);
    const classes = useStyles();
    return (
        <>
            <ToolButton
                {...rest} 
                ref={setButtonRef}
                onClick={openMenu}
                disabled={disabled}
                children={<Icon size={1} path={mdiTablePlus}/>}
            />
            <Menu open={isMenuOpen} anchorEl={buttonRef} onClose={closeMenu}>
                <div className={classes.menu}>
                    <div className={classes.table} onClick={insertTable}>
                        {ROWS.map(r => (
                            <div key={r} className={classes.row}>
                                {COLS.map(c => (
                                    <span
                                        key={c}
                                        className={clsx(
                                            classes.cell,
                                            rows >= r && cols >= c && classes.selected
                                        )}
                                        onMouseEnter={() => {
                                            setCols(c);
                                            setRows(r);
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <Typography 
                        variant="caption"
                        component="div"
                        className={classes.label}
                        children={`${cols} x ${rows}`}
                    />
                </div>
            </Menu>
        </>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    menu: {
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        userSelect: "none",
    },
    table: {
        cursor: "pointer",
    },
    row: {},
    cell: {
        display: "inline-block",
        width: theme.spacing(2),
        height: theme.spacing(2),
        border: `1px solid ${theme.palette.divider}`,
        margin: theme.spacing(0.25),
    },
    selected: {
        backgroundColor: theme.palette.action.selected,
    },
    label: {
        paddingTop: theme.spacing(1),
        textAlign: "center",
    },
}));

const range = (count: number, start = 1) => new Array(count).fill(start).map((base,index) => base + index);
const ROWS = range(8);
const COLS = range(10);
