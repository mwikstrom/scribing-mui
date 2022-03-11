import {  parseScript, Slicer } from "../src/script/syntax";
import { getTypeSelectionPathFromNode, selectMember, selectMemberOrIndex, TypeSelection } from "../src/script/path";

describe("getTypeSelectionPathFromNode", () => {
    it("can find root variable", () => {
        const path = getPathFromScript("MyVar");
        expect(path).toMatchObject(["MyVar"].map(selectMember));
    });

    it("can find root this", () => {
        const path = getPathFromScript("this");
        expect(path).toMatchObject(["this"].map(selectMember));
    });

    it("can find root property", () => {
        const path = getPathFromScript("MyVar.MyProp");
        expect(path).toMatchObject(["MyVar", "MyProp"].map(selectMember));
    });    

    it("can find this property", () => {
        const path = getPathFromScript("this.MyProp");
        expect(path).toMatchObject(["this", "MyProp"].map(selectMember));
    });    

    it("can find nested property", () => {
        const path = getPathFromScript("a.b.c");
        expect(path).toMatchObject(["a", "b", "c"].map(selectMember));
    });    

    it("can find deeply nested property", () => {
        const path = getPathFromScript("a.b.c.d.e.f");
        expect(path).toMatchObject(["a", "b", "c", "d", "e", "f"].map(selectMember));
    });    

    it("can find deeply nested property from this", () => {
        const path = getPathFromScript("this.a.b.c.d.e.f");
        expect(path).toMatchObject(["this", "a", "b", "c", "d", "e", "f"].map(selectMember));
    });    

    it("can find deeply nested property using brackets", () => {
        const path = getPathFromScript("a['b\"\\\"x'][\"c'y\"].d.e[123]['f']");
        expect(path).toMatchObject(["a", "b\"\"x", "c'y", "d", "e", 123, "f"].map(selectMemberOrIndex));
    });
    
    /* TODO: I designed these selectors, but I never implemented them:
    it("can select await", () => {
        const path = getPathFromScript("await some.thing");
        expect(path).toMatchObject([
            { select: "member", member: "some" },
            { select: "member", member: "thing" },
            { select: "await" }, 
        ]);
    });
    
    it("can select return", () => {
        const path = getPathFromScript("some()");
        expect(path).toMatchObject([
            { select: "member", member: "something" },
            { select: "return" }, 
        ]);
    });

    it("can select return prop", () => {
        const path = getPathFromScript("some().thing");
        expect(path).toMatchObject([
            { select: "member", member: "some" },
            { select: "return" }, 
            { select: "member", member: "thing" },
        ]);
    });

    it("can select first empty param", () => {
        const path = getPathFromScript("some(");
        expect(path).toMatchObject([
            { select: "member", member: "some" },
            { select: "param", param: 0 }, 
        ]);
    });

    it("can select first named param", () => {
        const path = getPathFromScript("some(thing");
        expect(path).toMatchObject([
            { select: "member", member: "some" },
            { select: "param", param: 0 }, 
        ]);
    });

    it("can select second empty param", () => {
        const path = getPathFromScript("some(other,");
        expect(path).toMatchObject([
            { select: "member", member: "some" },
            { select: "param", param: 1 }, 
        ]);
    });

    it("can select second named param", () => {
        const path = getPathFromScript("some(other,thing");
        expect(path).toMatchObject([
            { select: "member", member: "some" },
            { select: "param", param: 1 }, 
        ]);
    });*/
});

const getPathFromScript = (script: string): readonly TypeSelection[] | null => {
    const node = parseScript(script).tree?.resolveInner(script.length, -1);
    const slice: Slicer = (from, to) => script.substring(from, to);
    return getTypeSelectionPathFromNode(node, slice);
};