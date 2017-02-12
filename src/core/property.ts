import * as ts from 'typescript';

import { findChildOfKind, childrenOf } from './refactor';

function findType(node: ts.Node): ts.Node {
    let typeNode;
    const children = node.getChildren();
    for (let i = 0, n = children.length; i < n; i++) {
        const it = children[i];
        if (it.kind === ts.SyntaxKind.ColonToken && i + 1 < n) {
            typeNode = children[i + 1];
            break;
        }
    }
    return typeNode;
}

export interface GetterSetterOptions {
    prefix?: string; // default _
    singleLine?: boolean;
}

export function toGetterSetter(sourceFile: ts.SourceFile, pos: number, indent: string, tab: string, options?: GetterSetterOptions): ts.TextChange {
    let prefix = '_';
    let newLine = '\n';

    if (options && options.prefix) {
        prefix = options.prefix;
    }

    if (options && options.singleLine) {
        newLine = '';
    }

    const text = sourceFile.getFullText();
    let change: ts.TextChange;
    visitor(sourceFile);
    return change;

    function visitor(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.PropertyDeclaration) {
            const span = { start: node.getStart(), length: node.getEnd() - node.getStart() };
            if (ts.textSpanContainsPosition(span, pos)) {

                const typeNode = findType(node);
                const type = typeNode ? (': ' + text.substring(typeNode.getStart(), typeNode.getEnd())) : '';

                const newLineIndentTab = newLine ? newLine + indent + tab : ' ';
                const newLineIndent = newLine ? newLine + indent : ' ';
                const nameNode = findChildOfKind(node, ts.SyntaxKind.Identifier);
                const name = text.substring(nameNode.getStart(), nameNode.getEnd());
                const nodeText = text.substring(node.getStart(), node.getEnd());
                const getter = indent + 'get ' + name + '()' + type + ' {' + newLineIndentTab + 'return this.' + prefix + name + ';' + newLineIndent + '}';
                const setter = indent + 'set ' + name + '(value' + type + ') {' + newLineIndentTab + 'this.' + prefix + name + ' = value;' + newLineIndent + '}';
                const newText = 'private ' + prefix + nodeText + '\n' + getter + '\n' + setter;
                change = { span, newText };
            }
        }

        if (!change) {
            ts.forEachChild(node, visitor);
        }
    }
}