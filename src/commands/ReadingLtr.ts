import { mdiFormatTextdirectionLToR } from "@mdi/js";
import { Command } from "./Command";

export const ReadingLtr: Command = {
    exec: controller => controller.setTextDirection("ltr"),
    isActive: controller => controller.isTextDirection("ltr"),
    iconPath: mdiFormatTextdirectionLToR,
};
