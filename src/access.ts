import * as vs from 'vscode';
import * as ts from 'typescript';

import { toggle as coreToggle, AccessOptions } from './core';
import { getIndentAtLine, getTabs, changeToRange, createSourceFileFromActiveEditor } from './refactor';

export function toggle() {
    const source = createSourceFileFromActiveEditor();
    if (!source) {
        return;
    }
    const editor = source.editor;
    const {document, selection} = editor;

    const options: AccessOptions = vs.workspace.getConfiguration('extension.typescript.refactor.Access.toggle');

    const changes = coreToggle(source.sourceFile, document.offsetAt(selection.start), options);
    if (!changes) {
        return;
    }

    editor.edit(builder =>
        changes.forEach(change => builder.replace(changeToRange(document, change), change.newText)))
        .then(ok => {
            if (ok) {
                editor.selection = selection;
            }
        });
}
