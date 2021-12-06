import { mdiContentCut } from "@mdi/js";
import { Command } from "./Command";

export const Cut: Command = {
    exec: () => document.execCommand("cut"),
    isDisabled: controller => controller.isCaret(),
    iconPath: mdiContentCut,
};