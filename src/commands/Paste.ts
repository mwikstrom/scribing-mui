import { mdiContentPaste } from "@mdi/js";
import { Command } from "./Command";

export const Paste: Command = {
    exec: () => document.execCommand("paste"),
    isDisabled: () => true,
    iconPath: mdiContentPaste,
};