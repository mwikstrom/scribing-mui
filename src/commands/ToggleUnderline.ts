import { mdiFormatUnderline } from "@mdi/js";
import { Command } from "./Command";

export const ToggleUnderline: Command = {
    exec: controller => controller.toggleUnderline(),
    isActive: controller => controller.isUnderlined(),
    iconPath: mdiFormatUnderline,
};