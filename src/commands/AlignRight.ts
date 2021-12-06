import { mdiFormatAlignRight } from "@mdi/js";
import { FlowEditorController } from "scribing-react";
import { Command } from "./Command";

export const AlignRight: Command = {
    exec: controller => controller.setTextAlignment(alignment(controller)),
    isActive: controller => controller.isTextAlignment(alignment(controller)),
    iconPath: mdiFormatAlignRight,
};

const alignment = (controller: FlowEditorController) => controller.isTextDirection("rtl") ? "start" : "end";
