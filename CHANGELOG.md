## 1.14.1 - 2023-05-28

- Fix: Inserting constant `RegExp`

## 1.14.0 - 2023-05-28

- Support `RegExp` constant values

## 1.13.1 - 2023-04-25

- Use the new `visitScript` method in `FlowNodeVisitor`

## 1.13.0 - 2023-04-24

- Insert image from media library (custom selector)

## 1.12.0 - 2023-04-24

- Support default text when inserting link interaction

## 1.11.2 - 2023-03-16

- Use grab/grabbing cursor in image zoom box
- Make image zoom box stand out
- Edit image icon

## 1.11.1 - 2023-03-15

- Fix incorrect text align tip label

## 1.11.0 - 2023-03-14

- Image zoom box

## 1.10.0 - 2023-03-14

- Image scale dialog

## 1.9.5 - 2023-03-03

- Declare BigIntType

## 1.9.4 - 2023-03-03

- Declare bigint
- Fix display of union with undefined

## 1.9.3 - 2023-03-03

- Handle AwaitExpression

## 1.9.2 - 2023-03-03

- Param info tip style fixes

## 1.9.1 - 2023-03-02

- Fix: Ordering of preceding parameters in parameter info tip

## 1.9.0 - 2023-03-01

- Support variable names in parameter info tip
- Access to preceding parameter values in parameter info tip
- Description in arameter type info

## 1.8.0 - 2023-03-01

- Autocompletion info view has now a bounded max height with scrolling
- Initial caret position

## 1.7.0 - 2023-02-27

- Tab key can now be used to accept current completion
- Named type information `TypeInfo.ident`
- Variable type information

## 1.6.2 - 2023-02-27

- Fix: Overflow scrolling

## 1.6.1 - 2023-02-12

- Fix: Error border not displayed

## 1.6.0 - 2023-02-12

- Overflow-y is now `auto` instead of `scroll`
- Fix: Fullscreen overflow scrolling in script editor dialog
- Fix: Handle result from `parse` callback in code editor
- New feature: Decorate source with annotations from `parse` callback
- New feature: JSON diff view
- New peer dependency: `@codemirror/lint`
- New peer dependency: `diff-match-patch`

## 1.5.1 - 2022-12-14

- Fix: Exception was thrown when getting param info tip for function without parameters

## 1.5.0 - 2022-12-13

- Upgrade Codemirror to 6.x

## 1.4.2 - 2022-12-12

- Fix: Code editor `minInlineSize: auto`

## 1.4.1 - 2022-12-09

- Add missing style prop `minHeight` to `CodeEditorProps`

## 1.4.0 - 2022-12-09

- New feature: `<CodeEditor>`

## 1.3.0 - 2022-11-28

- New feature: Apply changes from custom option dialog without closing it

## 1.2.2 - 2022-09-29

- Fix: Unset box data source when empty

## 1.2.1 - 2022-09-26

- Fix color of icon inside button

## 1.2.0 - 2022-07-13

- Prevent accidental close of script editor dialog
- Show indicator in script editor dialog when there are unsaved changes
- Intercept CTRL+S in script editor dialog
- Add `onSave` callback to script editor dialog

## 1.1.0 - 2022-07-07

Export `<ScriptEditor>` component.

## 1.0.0 - 2022-05-04

The first non-preview/development release.
