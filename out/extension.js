"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
// Common regex patterns for testing
const REGEX_PATTERNS = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    url: /^https?:\/\/[^\s$.?#].[^\s]*$/i,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    uuid: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    jwt: /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
};
function activate(context) {
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
                const panel = vscode.window.createWebviewPanel('regexTester', 'Regex Tester Results', vscode.ViewColumn.Beside, { enableScripts: true });
                panel.webview.html = getRegexTestWebviewContent(selectedText, testString, isMatch, regex.exec(testString));
            }
            catch (error) {
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
        const panel = vscode.window.createWebviewPanel('regexExplainer', 'Regex Pattern Explanation', vscode.ViewColumn.Beside, { enableScripts: true });
        panel.webview.html = getRegexExplanationWebviewContent(selectedText, explanation);
    });
    // Register generate regex command
    let generateRegexCommand = vscode.commands.registerCommand('regex-snippets-plus.generateRegex', async () => {
        const examples = await vscode.window.showInputBox({
            prompt: 'Enter example strings (comma-separated) to generate a regex pattern',
            placeHolder: 'test@example.com, user@domain.org, admin@site.net',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Please enter at least one example';
                }
                return null;
            }
        });
        if (!examples) {
            return;
        }
        const exampleList = examples.split(',').map(s => s.trim()).filter(s => s.length > 0);
        if (exampleList.length === 0) {
            vscode.window.showErrorMessage('No valid examples provided');
            return;
        }
        const generatedPattern = generateRegexFromExamples(exampleList);
        const panel = vscode.window.createWebviewPanel('regexGenerator', 'Generated Regex Pattern', vscode.ViewColumn.Beside, { enableScripts: true });
        panel.webview.html = getRegexGenerationWebviewContent(exampleList, generatedPattern);
    });
    context.subscriptions.push(testRegexCommand, explainRegexCommand, generateRegexCommand);
}
exports.activate = activate;
function generateRegexFromExamples(examples) {
    // Basic regex generation logic - analyze common patterns
    // This is a simplified implementation
    // Check if all examples are email-like
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (examples.every(ex => emailPattern.test(ex))) {
        return '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
    }
    // Check if all examples are URLs
    const urlPattern = /^https?:\/\//i;
    if (examples.every(ex => urlPattern.test(ex))) {
        return '^https?:\\/\\/[^\\s$.?#].[^\\s]*$';
    }
    // Check if all examples are phone numbers
    const phonePattern = /^[\+]?[\d\s\-\(\)]+$/;
    if (examples.every(ex => phonePattern.test(ex))) {
        return '^[\\+]?[\\d\\s\\-\\(\\)]+$';
    }
    // Check if all examples are numbers
    if (examples.every(ex => /^\d+$/.test(ex))) {
        return '^\\d+$';
    }
    // Check if all examples are alphanumeric
    if (examples.every(ex => /^[a-zA-Z0-9]+$/.test(ex))) {
        return '^[a-zA-Z0-9]+$';
    }
    // Find common prefix
    let commonPrefix = examples[0];
    for (let j = 1; j < examples.length; j++) {
        const example = examples[j];
        let i = 0;
        while (i < commonPrefix.length && i < example.length && commonPrefix[i] === example[i]) {
            i++;
        }
        commonPrefix = commonPrefix.substring(0, i);
    }
    // Find common suffix
    let commonSuffix = examples[0];
    for (let j = 1; j < examples.length; j++) {
        const example = examples[j];
        let i = 0;
        while (i < commonSuffix.length && i < example.length &&
            commonSuffix[commonSuffix.length - 1 - i] === example[example.length - 1 - i]) {
            i++;
        }
        commonSuffix = commonSuffix.substring(commonSuffix.length - i);
    }
    // Escape special regex characters
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Build pattern with anchors
    let pattern = '^';
    // Check if prefix and suffix overlap
    const prefixLength = commonPrefix.length;
    const suffixLength = commonSuffix.length;
    const minLength = Math.min(...examples.map(ex => ex.length));
    if (prefixLength + suffixLength > minLength) {
        // Overlapping - adjust to prevent issues
        if (prefixLength > 0) {
            pattern += escapeRegex(commonPrefix) + '.*$';
        }
        else if (suffixLength > 0) {
            pattern += '.*' + escapeRegex(commonSuffix) + '$';
        }
        else {
            pattern += '.+$';
        }
    }
    else {
        // No overlap
        if (prefixLength > 0) {
            pattern += escapeRegex(commonPrefix);
        }
        pattern += '.*';
        if (suffixLength > 0) {
            pattern += escapeRegex(commonSuffix);
        }
        pattern += '$';
    }
    // If pattern is too generic, try to find character classes
    if (pattern === '^.*$' || pattern === '^.+$') {
        // Analyze character types used
        const hasLetters = examples.some(ex => /[a-zA-Z]/.test(ex));
        const hasDigits = examples.some(ex => /\d/.test(ex));
        const hasSpecial = examples.some(ex => /[^a-zA-Z0-9]/.test(ex));
        if (hasLetters && hasDigits && !hasSpecial) {
            pattern = '^[a-zA-Z0-9]+$';
        }
        else if (hasLetters && !hasDigits && !hasSpecial) {
            pattern = '^[a-zA-Z]+$';
        }
        else {
            pattern = '^.+$';
        }
    }
    return pattern;
}
function explainRegexPattern(pattern) {
    let explanation = 'Regex Pattern Analysis:\n\n';
    if (pattern.startsWith('^'))
        explanation += '^ - Matches start of string\n';
    if (pattern.endsWith('$'))
        explanation += '$ - Matches end of string\n';
    if (pattern.includes('+'))
        explanation += '+ - Matches one or more of the preceding element\n';
    if (pattern.includes('*'))
        explanation += '* - Matches zero or more of the preceding element\n';
    if (pattern.includes('?'))
        explanation += '? - Matches zero or one of the preceding element\n';
    if (pattern.includes('\\d'))
        explanation += '\\d - Matches any digit (0-9)\n';
    if (pattern.includes('\\w'))
        explanation += '\\w - Matches any word character (letters, digits, underscore)\n';
    if (pattern.includes('\\s'))
        explanation += '\\s - Matches any whitespace character\n';
    if (pattern.includes('['))
        explanation += '[...] - Character class, matches any character within brackets\n';
    if (pattern.includes('('))
        explanation += '(...) - Capturing group\n';
    if (pattern.includes('|'))
        explanation += '| - Alternation (OR operator)\n';
    if (pattern.includes('{'))
        explanation += '{n,m} - Quantifier, matches between n and m times\n';
    return explanation || 'No specific explanation available for this pattern.';
}
function getRegexTestWebviewContent(pattern, testString, isMatch, match) {
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
function getRegexExplanationWebviewContent(pattern, explanation) {
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
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
function getRegexGenerationWebviewContent(examples, pattern) {
    const escapedExamples = examples.map(ex => escapeHtml(ex));
    const escapedPattern = escapeHtml(pattern);
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Generated Regex Pattern</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .pattern { font-family: monospace; background: #d4edda; padding: 15px; border-radius: 5px; font-size: 18px; font-weight: bold; border: 2px solid #28a745; }
            .examples { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .example-item { padding: 5px; margin: 5px 0; background: white; border-radius: 3px; font-family: monospace; }
            .info { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #ffc107; }
            .copy-button { 
                background: #007bff; 
                color: white; 
                border: none; 
                padding: 10px 20px; 
                border-radius: 5px; 
                cursor: pointer; 
                font-size: 14px;
                margin-top: 10px;
            }
            .copy-button:hover { background: #0056b3; }
            .error { color: #721c24; margin-top: 10px; }
        </style>
    </head>
    <body>
        <h2>✨ Generated Regex Pattern</h2>
        
        <h3>Your Examples:</h3>
        <div class="examples">
            ${escapedExamples.map(ex => `<div class="example-item">${ex}</div>`).join('')}
        </div>
        
        <h3>Generated Pattern:</h3>
        <div class="pattern" id="pattern">${escapedPattern}</div>
        <button class="copy-button" onclick="copyPattern()">📋 Copy Pattern</button>
        <div class="error" id="error" style="display: none;"></div>
        
        <div class="info">
            <strong>ℹ️ Note:</strong> This is a basic pattern generated from your examples. 
            You may need to refine it based on your specific requirements. 
            The generator tries to identify common patterns like emails, URLs, phone numbers, 
            or creates a pattern based on common prefixes, suffixes, and character types.
        </div>
        
        <script>
            function copyPattern() {
                const pattern = document.getElementById('pattern').textContent;
                navigator.clipboard.writeText(pattern).then(() => {
                    const button = document.querySelector('.copy-button');
                    button.textContent = '✅ Copied!';
                    setTimeout(() => {
                        button.textContent = '📋 Copy Pattern';
                    }, 2000);
                }).catch((err) => {
                    const errorDiv = document.getElementById('error');
                    errorDiv.textContent = 'Failed to copy: ' + err.message;
                    errorDiv.style.display = 'block';
                });
            }
        </script>
    </body>
    </html>
    `;
}
function deactivate() {
    console.log('Regex Snippets Plus extension is now deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map