import { getGlobalAssignments, parseScript } from "../src/script/syntax";

describe("getGlobalAssignments", () => {
    it("can detect simple global assignment", () => {
        const script = "MyVar = 123";
        const parsed = parseScript(script);
        const assignments = getGlobalAssignments(parsed, (from, to) => script.substring(from, to));
        expect(Object.keys(assignments)).toMatchObject(["MyVar"]);
    });

    it("can detect nested global assignment", () => {
        const script = "{ const lambda = () => MyVar = 123; }";
        const parsed = parseScript(script);
        const assignments = getGlobalAssignments(parsed, (from, to) => script.substring(from, to));
        expect(Object.keys(assignments)).toMatchObject(["MyVar"]);
    });
});