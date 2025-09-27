import * as vscode from 'vscode';

// Common regex patterns for testing
const REGEX_PATTERNS = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    url: /^https?:\/\/[^\s$.?#].[^\s]*$/i,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    uuid: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    jwt: /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
};

export function activate(context: vscode.ExtensionContext) {
    console.log('Regex Snippets Plus extension is now active!');

    // Register test regex command
    let testRegexCommand = vscode.commands.registerCommand('regex-snippets-plus.testRegex', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        
        if (!selectedText) {
            vscode.window.showErrorMessage('Please select a regex pattern to test');
            return;
        }

        const testString = await vscode.window.showInputBox({
            prompt: 'Enter test string to validate against the regex',
            placeHolder: 'test@example.com'
        });

        if (testString !== undefined) {
            try {
                const regex = new RegExp(selectedText);
                const isMatch = regex.test(testString);
                
                const panel = vscode.window.createWebviewPanel(
                    'regexTester',
                    'Regex Tester Results',
                    vscode.ViewColumn.Beside,
                    { enableScripts: true }
                );

                panel.webview.html = getRegexTestWebviewContent(selectedText, testString, isMatch, regex.exec(testString));
            } catch (error) {
                vscode.window.showErrorMessage(`Invalid regex pattern: ${error}`);
            }
        }
    });

    // Register explain regex command
    let explainRegexCommand = vscode.commands.registerCommand('regex-snippets-plus.explainRegex', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        
        if (!selectedText) {
            vscode.window.showErrorMessage('Please select a regex pattern to explain');
            return;
        }

        const explanation = explainRegexPattern(selectedText);
        
        const panel = vscode.window.createWebviewPanel(
            'regexExplainer',
            'Regex Pattern Explanation',
            vscode.ViewColumn.Beside,
            { enableScripts: true }
        );

        panel.webview.html = getRegexExplanationWebviewContent(selectedText, explanation);
    });

    context.subscriptions.push(testRegexCommand, explainRegexCommand);
}

function explainRegexPattern(pattern: string): string {
    let explanation = 'Regex Pattern Analysis:\n\n';
    
    if (pattern.startsWith('^')) explanation += '^ - Matches start of string\n';
    if (pattern.endsWith('$')) explanation += '$ - Matches end of string\n';
    if (pattern.includes('+')) explanation += '+ - Matches one or more of the preceding element\n';
    if (pattern.includes('*')) explanation += '* - Matches zero or more of the preceding element\n';
    if (pattern.includes('?')) explanation += '? - Matches zero or one of the preceding element\n';
    if (pattern.includes('\\d')) explanation += '\\d - Matches any digit (0-9)\n';
    if (pattern.includes('\\w')) explanation += '\\w - Matches any word character (letters, digits, underscore)\n';
    if (pattern.includes('\\s')) explanation += '\\s - Matches any whitespace character\n';
    if (pattern.includes('[')) explanation += '[...] - Character class, matches any character within brackets\n';
    if (pattern.includes('(')) explanation += '(...) - Capturing group\n';
    if (pattern.includes('|')) explanation += '| - Alternation (OR operator)\n';
    if (pattern.includes('{')) explanation += '{n,m} - Quantifier, matches between n and m times\n';
    
    return explanation || 'No specific explanation available for this pattern.';
}

function getRegexTestWebviewContent(pattern: string, testString: string, isMatch: boolean, match: RegExpExecArray | null): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Regex Test Results</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .result { padding: 15px; margin: 10px 0; border-radius: 5px; }
            .match { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
            .no-match { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
            .pattern { font-family: monospace; background: #f8f9fa; padding: 10px; border-radius: 3px; }
            .groups { margin-top: 15px; }
            .group { background: #e9ecef; padding: 8px; margin: 5px 0; border-radius: 3px; }
        </style>
    </head>
    <body>
        <h2>🔍 Regex Test Results</h2>
        
        <h3>Pattern:</h3>
        <div class="pattern">${pattern}</div>
        
        <h3>Test String:</h3>
        <div class="pattern">${testString}</div>
        
        <h3>Result:</h3>
        <div class="result ${isMatch ? 'match' : 'no-match'}">
            ${isMatch ? '✅ Match Found!' : '❌ No Match'}
        </div>
        
        ${match && match.length > 1 ? `
        <div class="groups">
            <h3>Captured Groups:</h3>
            ${match.slice(1).map((group, index) => `
                <div class="group">
                    <strong>Group ${index + 1}:</strong> ${group || 'empty'}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${isMatch && match ? `
        <div class="groups">
            <h3>Match Details:</h3>
            <div class="group"><strong>Full Match:</strong> ${match[0]}</div>
            <div class="group"><strong>Index:</strong> ${match.index}</div>
        </div>
        ` : ''}
    </body>
    </html>
    `;
}

function getRegexExplanationWebviewContent(pattern: string, explanation: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Regex Pattern Explanation</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .pattern { font-family: monospace; background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 16px; }
            .explanation { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .breakdown { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
            pre { white-space: pre-wrap; }
        </style>
    </head>
    <body>
        <h2>📖 Regex Pattern Explanation</h2>
        
        <h3>Pattern:</h3>
        <div class="pattern">${pattern}</div>
        
        <h3>Explanation:</h3>
        <div class="explanation">
            <pre>${explanation}</pre>
        </div>
        
        <div class="breakdown">
            <h3>Common Regex Elements:</h3>
            <ul>
                <li><code>^</code> - Start of string</li>
                <li><code>$</code> - End of string</li>
                <li><code>\\d</code> - Any digit (0-9)</li>
                <li><code>\\w</code> - Any word character (a-z, A-Z, 0-9, _)</li>
                <li><code>\\s</code> - Any whitespace character</li>
                <li><code>+</code> - One or more</li>
                <li><code>*</code> - Zero or more</li>
                <li><code>?</code> - Zero or one</li>
                <li><code>[...]</code> - Character class</li>
                <li><code>(...)</code> - Capturing group</li>
                <li><code>|</code> - Alternation (OR)</li>
                <li><code>{n,m}</code> - Between n and m times</li>
            </ul>
        </div>
    </body>
    </html>
    `;
}

export function deactivate() {
    console.log('Regex Snippets Plus extension is now deactivated');
}