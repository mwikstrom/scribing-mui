import { mdiContentCopy } from "@mdi/js";
import { Command } from "./Command";

export const Copy: Command = {
    exec: () => document.execCommand("copy"),
    isDisabled: controller => controller.isCaret(),
    iconPath: mdiContentCopy,
};