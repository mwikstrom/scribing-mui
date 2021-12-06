import { mdiFormatItalic } from "@mdi/js";
import { Command } from "./Command";

export const ToggleItalic: Command = {
    exec: controller => controller.toggleItalic(),
    isActive: controller => controller.isItalic(),
    iconPath: mdiFormatItalic,
};