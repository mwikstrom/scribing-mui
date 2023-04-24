import { Interaction } from "scribing";

/** @public */
export type InteractionOptionResult = Interaction | InteractionUpdateInfo | null;

/** @public */
export interface InteractionUpdateInfo {
    interaction: Interaction | null;
    defaultText?: string;
}

/** @public */
export const getInteractionUpdateInfo = (result: InteractionOptionResult): InteractionUpdateInfo => {
    if (result instanceof Interaction) {
        return { interaction: result };
    } else if (result) {
        return result;
    } else {
        return { interaction: null };
    }
};
