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
