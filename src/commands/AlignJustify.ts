import { mdiFormatAlignJustify } from "@mdi/js";
import { Command } from "./Command";

export const AlignJustify: Command = {
    exec: controller => controller.setTextAlignment("justify"),
    isActive: controller => controller.isTextAlignment("justify"),
    iconPath: mdiFormatAlignJustify,
};
