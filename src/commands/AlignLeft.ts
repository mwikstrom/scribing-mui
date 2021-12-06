import { mdiFormatAlignLeft } from "@mdi/js";
import { FlowEditorController } from "scribing-react";
import { Command } from "./Command";

export const AlignLeft: Command = {
    exec: controller => controller.setTextAlignment(alignment(controller)),
    isActive: controller => controller.isTextAlignment(alignment(controller)),
    iconPath: mdiFormatAlignLeft,
};

const alignment = (controller: FlowEditorController) => controller.isTextDirection("rtl") ? "end" : "start";
