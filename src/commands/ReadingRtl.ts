import { mdiFormatTextdirectionRToL } from "@mdi/js";
import { Command } from "./Command";

export const ReadingRtl: Command = {
    exec: controller => controller.setTextDirection("rtl"),
    isActive: controller => controller.isTextDirection("rtl"),
    iconPath: mdiFormatTextdirectionRToL,
};
