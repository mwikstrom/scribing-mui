import { mdiFormatPilcrow } from "@mdi/js";
import { Command } from "./Command";

export const ToggleFormattingMarks: Command = {
    exec: controller => controller.toggleFormattingMarks(),
    isActive: controller => controller.getFormattingMarks(),
    iconPath: mdiFormatPilcrow,
};
