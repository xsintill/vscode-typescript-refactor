/**
 * Provides the 'Extract variable' command.
 */

import * as vscode from 'vscode';

import { toggleSingleStatementBlockExpression, singleStatementBlockToExpression, expressionToBlock } from './arrow-function';
import { extractVariable } from './extract-variable';
import { semicolons } from './semicolon';
import { toGetterSetter } from './property';
import { interpolate } from './stringg';
import { toggle } from './access';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.typescript.refactor.ExtractVariable', extractVariable));
    context.subscriptions.push(vscode.commands.registerCommand('extension.typescript.refactor.ArrowFunction.ToggleSingleStatementBlockExpression', toggleSingleStatementBlockExpression));
    context.subscriptions.push(vscode.commands.registerCommand('extension.typescript.refactor.ArrowFunction.SingleStatementBlockToExpressionAll', () => singleStatementBlockToExpression(true)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.typescript.refactor.ArrowFunction.ExpressionToBlock', expressionToBlock));
    context.subscriptions.push(vscode.commands.registerCommand('extension.typescript.refactor.Semicolons.Add', () => semicolons(true)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.typescript.refactor.Semicolons.Remove', () => semicolons(false)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.typescript.refactor.Property.ToGetterSetter', toGetterSetter));
    context.subscriptions.push(vscode.commands.registerCommand('extension.typescript.refactor.String.Interpolate', interpolate));
    context.subscriptions.push(vscode.commands.registerCommand('extension.typescript.refactor.Access.toggle', toggle));
}
