import { mdiFormatAlignCenter } from "@mdi/js";
import { Command } from "./Command";

export const AlignCenter: Command = {
    exec: controller => controller.setTextAlignment("center"),
    isActive: controller => controller.isTextAlignment("center"),
    iconPath: mdiFormatAlignCenter,
};
