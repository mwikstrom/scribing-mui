import { Box, IconButton, Theme, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import { mdiFunctionVariant } from "@mdi/js";
import Icon from "@mdi/react";
import { 
    DataGrid,
    GridCellParams,
    GridColDef,
    GridColumns,
    GridRenderCellParams,
    MuiEvent
} from "@mui/x-data-grid";
import React, { FC, SyntheticEvent, useMemo, useState } from "react";
import { Script } from "scribing";
import { FlowEditorController } from "scribing-react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ScriptEditorDialog } from "../ScriptEditorDialog";

export interface KeyValueGridProps {
    data: ReadonlyMap<string, string | Script | null>;
    controller?: FlowEditorController | null;
    onSetValue: (key: string, value: string | Script) => void;
    onUnsetValue: (key: string) => void;
    keyLabel: string;
    newKeyLabel: string;
    valueLabel?: string;
    lang?: string;
}

export const KeyValueGrid: FC<KeyValueGridProps> = props => {
    const locale = useMaterialFlowLocale();
    const {
        data,
        controller,
        keyLabel,
        newKeyLabel,
        valueLabel = locale.label_value,
        lang = controller?.getTextStyle().lang,
        onSetValue,
        onUnsetValue,
    } = props;
    const classes = useStyles();
    const columns = useMemo<GridColumns>(() => {
        const commonProps: Partial<GridColDef> = {
            flex: 1,
            sortable: false,
            editable: true,
        };
        return [
            { 
                ...commonProps,
                field: "key",
                headerName: keyLabel,
                renderCell: (params: GridRenderCellParams) => {
                    const insert = typeof params.id !== "string";                    
                    const text = insert ? newKeyLabel : String(params.value);
                    const color = insert ? "textSecondary" : "inherit";
                    return <TextCell color={color}>{text}</TextCell>;
                },
            },
            {
                ...commonProps,
                field: "value",
                headerName: valueLabel,
                renderCell: (params: GridRenderCellParams) => {
                    const rowId = params.id;
                    const key = params.getValue(rowId, "key");
                    const multi = params.value === null;
                    const script = params.value instanceof Script;
                    const color = multi || script ? "textSecondary" : "inherit";
                    const text = multi ? (
                        locale.label_multiple_values
                    ) : script ? (
                        locale.label_script
                    ) : String(params.value);
                    return typeof key === "string" && key && (
                        <Box display="flex" flexDirection="row" flex={1}>
                            <TextCell color={color}>{text}</TextCell>
                            {(script || multi || params.value === "") && (
                                <Box flex={0}>
                                    <IconButton size="small" onClick={() => onEditScript(params)}>
                                        <Icon size={0.75} path={mdiFunctionVariant}/>
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                    );
                },
            },
        ];
    }, [keyLabel, newKeyLabel, valueLabel, locale]);
    const rows = useMemo(() => [
        ...Array.from(data).map(([key, value]) => ({
            id: key,
            key,
            value,
        })),
        { id: 0, key: "", value: "" }
    ], [data]);
    const [editingScript, setEditingScript] = useState<{key: string, initial: Script | null}|null>(null);
    const onEditScript = (params: Pick<GridCellParams, "id" | "getValue">) => {
        const rowId = params.id;
        const key = params.getValue(rowId, "key");
        const value = params.getValue(rowId, "value");
        if (typeof key === "string" && key) {
            setEditingScript({key, initial: value instanceof Script ? value : null});
        }
    };
    const onCellEditStart = (params: GridCellParams, e: MuiEvent<SyntheticEvent>) => {
        if (params.field === "value") {
            const rowId = params.id;
            const key = params.getValue(rowId, "key");
            if (typeof key !== "string" || !key) {
                e.defaultMuiPrevented = true;
            } else {
                const value = params.getValue(rowId, "value");
                if (value instanceof Script) {
                    e.defaultMuiPrevented = true;
                    onEditScript(params);
                }
            }
        }
    };
    const onCellEditStop = (params: GridCellParams) => {
        const rowId = params.id;
        const key = params.getValue(rowId, "key");
        const value = params.getValue(rowId, "value");
        if (typeof rowId === "string" && rowId !== key) {
            onUnsetValue(rowId);
        }
        if (typeof key === "string" && key && (typeof value === "string" || value instanceof Script)) {
            onSetValue(key, value);
        }
    };
    return (
        <>
            <DataGrid
                columns={columns}
                rows={rows}
                autoHeight
                density="compact"
                disableColumnFilter
                disableColumnMenu
                disableColumnSelector
                disableDensitySelector
                showColumnRightBorder
                showCellRightBorder
                disableVirtualization
                getRowId={row => row.id}
                hideFooter
                editMode="cell"
                onCellEditStart={onCellEditStart}
                onCellEditStop={onCellEditStop}
                classes={classes}
            />
            {editingScript && (
                <ScriptEditorDialog
                    open
                    scriptLabel={editingScript.key}
                    initialValue={editingScript.initial}
                    onClose={() => setEditingScript(null)}
                    lang={lang}
                    controller={controller}
                    onComplete={value => {
                        if (value) {
                            onSetValue(editingScript.key, value);
                        }
                        setEditingScript(null);
                    }}
                />
            )}
        </>
    );
};

interface TextCellProps {
    children: string;
    color: "inherit" | "textSecondary";
}

const TextCell: FC<TextCellProps> = ({children, color}) => {
    const theme = useTheme<Theme>();
    return (
        <Box paddingLeft={`${theme.spacing(1) - 1}px`} flex={1}>
            <Typography color={color} variant="inherit">{children}</Typography>
        </Box>
    );
};

const useStyles = makeStyles((theme: Theme) => {
    const borderColor =
        theme.palette.type === "light" ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)";
    return {
        root: {
            borderColor,
            "& .MuiDataGrid-columnsContainer": {
                borderColor,
            },
            "& $cell": {
                borderColor,
            },
            "& $columnHeader": {
                borderColor,
            },
            "& $columnHeader:focus, & $columnHeader:focus-within": {
                outline: "none",
            },
            "& $columnHeader:last-child": {
                borderRight: "none",
            },
            "& $row:last-child $cell": {
                borderBottom: "none",
            },
        },
        cell: {},
        row: {},
        columnHeader: {},
    };
});
