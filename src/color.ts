import * as vscode from 'vscode';

export async function runConvert(editor: vscode.TextEditor, edit: vscode.TextEditorEdit, document: vscode.TextDocument) {
	let selections: any[] = [];
	for (let selection of editor.selections) {
		if (selection.start.compareTo(selection.end) < 0) {
			let range = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
			let word = evaluateHEX(range, editor, document);
			if (word) {
				selections.push({range: range, word: word});
			}
		}
	}

	if (selections) {
		editor.edit(builder => replaceHEX(selections, builder));
	}
}

function replaceHEX(selections: any[], builder: vscode.TextEditorEdit) {
	for (let selection of selections) {
		builder.replace(selection.range, selection.word);
	}
}

function evaluateHEX(range: vscode.Range, editor: vscode.TextEditor, document: vscode.TextDocument) {
	let fullHexRegex = /^#[a-f\d]{6}$/gi;
	let halfHexRegex = /^#[a-f\d]{3}$/gi;
	let text = editor.document.getText(range);
	let fullTest = fullHexRegex.test(text);
	let halfTest = halfHexRegex.test(text);

	if (fullTest) {
		return convertFullHex(text.slice(1));
	}
	else if (halfTest) {
		return convertHalfHex(text.slice(1));
	}
	else {
		return null;
	}
}

function convertFullHex(text: string) {
	const hexMap = {
		'0': 0,
		'1': 1,
		'2': 2,
		'3': 3,
		'4': 4,
		'5': 5,
		'6': 6,
		'7': 7,
		'8': 8,
		'9': 9,
		'A': 10,
		'B': 11,
		'C': 12,
		'D': 13,
		'E': 14,
		'F': 15,
	};

	let result = 0;
	let chars = [...text];

	// Loop through "text" one character at a time
	for (let n = 0; n < chars.length; n++) {
		// Reverse the index so it'll read from right to left
		let index = (chars.length - 1) - n;
		let key: string = chars[index].toUpperCase();
		// @ts-ignore
		let value = hexMap[key];
		// result = result + charₙ × 16ⁿ
		result += value * Math.pow(16, n);
	}

	return result.toString();
}

function convertHalfHex(text: string) {
	const chars = [...text];
	let newChar = [];
	// Convert #ABC => #AABBCC
	for (let char of chars) {
		newChar.push(char);
		newChar.push(char);
	}
	const newText = newChar.join('');
	return convertFullHex(newText);
}