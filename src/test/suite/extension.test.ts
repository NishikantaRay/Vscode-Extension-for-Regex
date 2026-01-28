import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Regex Snippets Plus Extension Test Suite', () => {
    vscode.window.showInformationMessage('Starting all tests.');

    // ============================================
    // Extension Activation Tests
    // ============================================
    suite('Extension Activation', () => {
        test('Extension should be present', () => {
            const extension = vscode.extensions.getExtension('Nishikanta12.regex');
            assert.ok(extension, 'Extension should be installed');
        });

        test('Extension should activate', async () => {
            const extension = vscode.extensions.getExtension('Nishikanta12.regex');
            if (extension) {
                await extension.activate();
                assert.strictEqual(extension.isActive, true, 'Extension should be active');
            }
        });
    });

    // ============================================
    // Command Registration Tests
    // ============================================
    suite('Command Registration', () => {
        test('testRegex command should be registered', async () => {
            const commands = await vscode.commands.getCommands(true);
            assert.ok(
                commands.includes('regex-snippets-plus.testRegex'),
                'testRegex command should be registered'
            );
        });

        test('explainRegex command should be registered', async () => {
            const commands = await vscode.commands.getCommands(true);
            assert.ok(
                commands.includes('regex-snippets-plus.explainRegex'),
                'explainRegex command should be registered'
            );
        });

        test('generateRegex command should be registered', async () => {
            const commands = await vscode.commands.getCommands(true);
            assert.ok(
                commands.includes('regex-snippets-plus.generateRegex'),
                'generateRegex command should be registered'
            );
        });
    });

    // ============================================
    // Configuration Tests
    // ============================================
    suite('Extension Configuration', () => {
        test('Configuration should have enableAutoComplete setting', () => {
            const config = vscode.workspace.getConfiguration('regexSnippetsPlus');
            const value = config.get('enableAutoComplete');
            assert.strictEqual(typeof value, 'boolean', 'enableAutoComplete should be boolean');
        });

        test('Configuration should have showExplanations setting', () => {
            const config = vscode.workspace.getConfiguration('regexSnippetsPlus');
            const value = config.get('showExplanations');
            assert.strictEqual(typeof value, 'boolean', 'showExplanations should be boolean');
        });

        test('Configuration should have preferredRegexFlavor setting', () => {
            const config = vscode.workspace.getConfiguration('regexSnippetsPlus');
            const value = config.get('preferredRegexFlavor');
            assert.ok(
                ['javascript', 'python', 'php', 'java', 'dotnet'].includes(value as string),
                'preferredRegexFlavor should be a valid option'
            );
        });

        test('Configuration should have includeProgrammingLanguages setting', () => {
            const config = vscode.workspace.getConfiguration('regexSnippetsPlus');
            const value = config.get('includeProgrammingLanguages');
            assert.ok(Array.isArray(value), 'includeProgrammingLanguages should be an array');
        });
    });
});
