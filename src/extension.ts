// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cl from './color';

const configName = 'mc-hex-conter';

let instances: any[] = [];
let config: any;

export function activate(context: vscode.ExtensionContext) {
	instances = [];
	config = vscode.workspace.getConfiguration(configName);

	vscode.commands.registerTextEditorCommand('mc-hex-converter.convert', cl.runConvert);

	vscode.workspace.onDidChangeConfiguration(changeConfig, null, context.subscriptions);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function changeConfig() {
	config = vscode.workspace.getConfiguration(configName);
}