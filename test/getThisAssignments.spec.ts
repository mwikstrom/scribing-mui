import { getThisAssignments, parseScript } from "../src/script/syntax";

describe("getThisAssignments", () => {
    it("can detect simple this assignment", () => {
        const script = "this.MyVar = 123";
        const parsed = parseScript(script);
        const assignments = getThisAssignments(parsed, (from, to) => script.substring(from, to));
        expect(Object.keys(assignments)).toMatchObject(["MyVar"]);
    });

    it("can detect nested this assignment", () => {
        const script = "{ const lambda = () => this.MyVar = 123; }";
        const parsed = parseScript(script);
        const assignments = getThisAssignments(parsed, (from, to) => script.substring(from, to));
        expect(Object.keys(assignments)).toMatchObject(["MyVar"]);
    });
});