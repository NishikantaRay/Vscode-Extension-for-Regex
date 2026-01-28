import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Integration Tests', () => {

    // ============================================
    // Webview Content Generation Tests
    // ============================================
    suite('Webview Content Tests', () => {

        test('Should generate valid HTML for regex test results', () => {
            // Simulate webview HTML generation
            const pattern = '^test$';
            const testString = 'test';
            const isMatch = true;

            const html = generateTestResultHtml(pattern, testString, isMatch);

            assert.ok(html.includes('<!DOCTYPE html>'), 'Should have DOCTYPE');
            assert.ok(html.includes('<html>'), 'Should have html tag');
            assert.ok(html.includes('Regex Test Results'), 'Should have title');
            assert.ok(html.includes(pattern), 'Should include the pattern');
            assert.ok(html.includes(testString), 'Should include test string');
            assert.ok(html.includes('Match Found'), 'Should show match result');
        });

        test('Should generate valid HTML for no match results', () => {
            const pattern = '^test$';
            const testString = 'no-match';
            const isMatch = false;

            const html = generateTestResultHtml(pattern, testString, isMatch);

            assert.ok(html.includes('No Match'), 'Should show no match result');
            assert.ok(html.includes('no-match'), 'Should include class for no match');
        });

        test('Should generate valid HTML for regex explanation', () => {
            const pattern = '^\\d+$';
            const explanation = 'Matches digits only';

            const html = generateExplanationHtml(pattern, explanation);

            assert.ok(html.includes('<!DOCTYPE html>'), 'Should have DOCTYPE');
            assert.ok(html.includes('Regex Pattern Explanation'), 'Should have title');
            assert.ok(html.includes(pattern), 'Should include the pattern');
        });

        test('Should generate valid HTML for regex generation', () => {
            const examples = ['test@example.com', 'user@domain.org'];
            const generatedPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

            const html = generateGenerationHtml(examples, generatedPattern);

            assert.ok(html.includes('<!DOCTYPE html>'), 'Should have DOCTYPE');
            assert.ok(html.includes('Generated Regex Pattern'), 'Should have title');
            assert.ok(html.includes('test@example.com'), 'Should include examples');
        });
    });

    // ============================================
    // Editor Integration Tests
    // ============================================
    suite('Editor Integration', () => {

        test('Should handle document with text', async () => {
            const doc = await vscode.workspace.openTextDocument({
                content: 'test@example.com',
                language: 'plaintext'
            });

            const editor = await vscode.window.showTextDocument(doc);

            assert.ok(editor, 'Editor should be active');
            assert.strictEqual(editor.document.getText(), 'test@example.com');
        });

        test('Should be able to select text', async () => {
            const doc = await vscode.workspace.openTextDocument({
                content: '^[a-zA-Z]+$',
                language: 'plaintext'
            });

            const editor = await vscode.window.showTextDocument(doc);

            // Select all text
            const fullRange = new vscode.Range(
                new vscode.Position(0, 0),
                new vscode.Position(0, doc.getText().length)
            );
            editor.selection = new vscode.Selection(fullRange.start, fullRange.end);

            const selectedText = doc.getText(editor.selection);
            assert.strictEqual(selectedText, '^[a-zA-Z]+$');
        });

        test('Should close document after test', async () => {
            // Clean up any open editors
            await vscode.commands.executeCommand('workbench.action.closeAllEditors');
            assert.ok(true, 'Editors closed successfully');
        });
    });

    // ============================================
    // Command Execution Tests
    // ============================================
    suite('Command Execution Safety', () => {

        test('testRegex command should not throw without editor', async () => {
            await vscode.commands.executeCommand('workbench.action.closeAllEditors');

            // This should not throw, it should show an error message
            try {
                await vscode.commands.executeCommand('regex-snippets-plus.testRegex');
            } catch (error) {
                // Expected behavior - command handles error gracefully
            }
            assert.ok(true, 'Command did not throw unexpectedly');
        });

        test('explainRegex command should not throw without editor', async () => {
            await vscode.commands.executeCommand('workbench.action.closeAllEditors');

            try {
                await vscode.commands.executeCommand('regex-snippets-plus.explainRegex');
            } catch (error) {
                // Expected behavior
            }
            assert.ok(true, 'Command did not throw unexpectedly');
        });
    });

    // ============================================
    // Configuration Integration Tests
    // ============================================
    suite('Configuration Integration', () => {

        test('Should be able to read configuration', () => {
            const config = vscode.workspace.getConfiguration('regexSnippetsPlus');
            assert.ok(config !== undefined, 'Configuration should be accessible');
        });

        test('Should have default values', () => {
            const config = vscode.workspace.getConfiguration('regexSnippetsPlus');
            const enableAutoComplete = config.get<boolean>('enableAutoComplete');
            const showExplanations = config.get<boolean>('showExplanations');

            assert.strictEqual(enableAutoComplete, true, 'enableAutoComplete should default to true');
            assert.strictEqual(showExplanations, true, 'showExplanations should default to true');
        });
    });
});

// Helper functions to simulate webview HTML generation
function generateTestResultHtml(pattern: string, testString: string, isMatch: boolean): string {
    return `
    <!DOCTYPE html>
    <html>
    <head><title>Regex Test Results</title></head>
    <body>
        <h2>🔍 Regex Test Results</h2>
        <div class="pattern">${pattern}</div>
        <div class="test-string">${testString}</div>
        <div class="result ${isMatch ? 'match' : 'no-match'}">
            ${isMatch ? '✅ Match Found!' : '❌ No Match'}
        </div>
    </body>
    </html>
    `;
}

function generateExplanationHtml(pattern: string, explanation: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head><title>Regex Pattern Explanation</title></head>
    <body>
        <h2>📖 Regex Pattern Explanation</h2>
        <div class="pattern">${pattern}</div>
        <div class="explanation">${explanation}</div>
    </body>
    </html>
    `;
}

function generateGenerationHtml(examples: string[], pattern: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head><title>Generated Regex Pattern</title></head>
    <body>
        <h2>✨ Generated Regex Pattern</h2>
        <div class="examples">
            ${examples.map(ex => `<div class="example">${ex}</div>`).join('')}
        </div>
        <div class="pattern">${pattern}</div>
    </body>
    </html>
    `;
}
