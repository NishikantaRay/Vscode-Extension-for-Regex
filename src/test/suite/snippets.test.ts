import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

suite('Snippets Validation Test Suite', () => {

    const snippetsDir = path.resolve(__dirname, '../../../snippets');

    // ============================================
    // Snippet File Existence Tests
    // ============================================
    suite('Snippet Files Existence', () => {
        const expectedSnippetFiles = [
            'snippets.code-snippets',
            'python-regex.code-snippets',
            'php-regex.code-snippets',
            'java-regex.code-snippets',
            'csharp-regex.code-snippets',
            'go-regex.code-snippets',
            'rust-regex.code-snippets',
            'form.code-snippets',
            'formsgroup.code-snippets',
            'advanced-forms.code-snippets'
        ];

        expectedSnippetFiles.forEach(file => {
            test(`${file} should exist`, () => {
                const filePath = path.join(snippetsDir, file);
                assert.ok(fs.existsSync(filePath), `${file} should exist in snippets directory`);
            });
        });
    });

    // ============================================
    // Snippet File Structure Tests
    // ============================================
    suite('Snippet File Structure', () => {

        test('JavaScript snippets should be valid JSON', () => {
            const filePath = path.join(snippetsDir, 'snippets.code-snippets');
            const content = fs.readFileSync(filePath, 'utf-8');
            assert.doesNotThrow(() => JSON.parse(content), 'Should be valid JSON');
        });

        test('Python snippets should be valid JSON', () => {
            const filePath = path.join(snippetsDir, 'python-regex.code-snippets');
            const content = fs.readFileSync(filePath, 'utf-8');
            assert.doesNotThrow(() => JSON.parse(content), 'Should be valid JSON');
        });

        test('PHP snippets should be valid JSON', () => {
            const filePath = path.join(snippetsDir, 'php-regex.code-snippets');
            const content = fs.readFileSync(filePath, 'utf-8');
            assert.doesNotThrow(() => JSON.parse(content), 'Should be valid JSON');
        });

        test('Java snippets should be valid JSON', () => {
            const filePath = path.join(snippetsDir, 'java-regex.code-snippets');
            const content = fs.readFileSync(filePath, 'utf-8');
            assert.doesNotThrow(() => JSON.parse(content), 'Should be valid JSON');
        });

        test('C# snippets should be valid JSON', () => {
            const filePath = path.join(snippetsDir, 'csharp-regex.code-snippets');
            const content = fs.readFileSync(filePath, 'utf-8');
            assert.doesNotThrow(() => JSON.parse(content), 'Should be valid JSON');
        });

        test('Go snippets should be valid JSON', () => {
            const filePath = path.join(snippetsDir, 'go-regex.code-snippets');
            const content = fs.readFileSync(filePath, 'utf-8');
            assert.doesNotThrow(() => JSON.parse(content), 'Should be valid JSON');
        });

        test('Rust snippets should be valid JSON', () => {
            const filePath = path.join(snippetsDir, 'rust-regex.code-snippets');
            const content = fs.readFileSync(filePath, 'utf-8');
            assert.doesNotThrow(() => JSON.parse(content), 'Should be valid JSON');
        });

        test('Form snippets should be valid JSON', () => {
            const filePath = path.join(snippetsDir, 'form.code-snippets');
            const content = fs.readFileSync(filePath, 'utf-8');
            assert.doesNotThrow(() => JSON.parse(content), 'Should be valid JSON');
        });

        test('Forms group snippets should be valid JSON', () => {
            const filePath = path.join(snippetsDir, 'formsgroup.code-snippets');
            const content = fs.readFileSync(filePath, 'utf-8');
            assert.doesNotThrow(() => JSON.parse(content), 'Should be valid JSON');
        });

        test('Advanced forms snippets should be valid JSON', () => {
            const filePath = path.join(snippetsDir, 'advanced-forms.code-snippets');
            const content = fs.readFileSync(filePath, 'utf-8');
            assert.doesNotThrow(() => JSON.parse(content), 'Should be valid JSON');
        });
    });

    // ============================================
    // Snippet Content Validation Tests
    // ============================================
    suite('Snippet Content Validation', () => {

        function validateSnippetStructure(snippetObj: any): void {
            for (const [name, snippet] of Object.entries<any>(snippetObj)) {
                assert.ok(snippet.prefix, `Snippet "${name}" should have a prefix`);
                assert.ok(snippet.body !== undefined, `Snippet "${name}" should have a body`);
                assert.ok(snippet.description, `Snippet "${name}" should have a description`);
            }
        }

        test('JavaScript snippets should have required properties', () => {
            const filePath = path.join(snippetsDir, 'snippets.code-snippets');
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            validateSnippetStructure(content);
        });

        test('Python snippets should have required properties', () => {
            const filePath = path.join(snippetsDir, 'python-regex.code-snippets');
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            validateSnippetStructure(content);
        });

        test('Form snippets should have required properties', () => {
            const filePath = path.join(snippetsDir, 'form.code-snippets');
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            validateSnippetStructure(content);
        });
    });

    // ============================================
    // Snippet Prefix Uniqueness Tests
    // ============================================
    suite('Snippet Prefix Uniqueness', () => {

        function getPrefixesFromFile(filePath: string): string[] {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const prefixes: string[] = [];
            for (const snippet of Object.values<any>(content)) {
                if (typeof snippet.prefix === 'string') {
                    prefixes.push(snippet.prefix);
                } else if (Array.isArray(snippet.prefix)) {
                    prefixes.push(...snippet.prefix);
                }
            }
            return prefixes;
        }

        test('JavaScript snippets should have unique prefixes within file', () => {
            const filePath = path.join(snippetsDir, 'snippets.code-snippets');
            const prefixes = getPrefixesFromFile(filePath);
            const uniquePrefixes = new Set(prefixes);
            assert.strictEqual(prefixes.length, uniquePrefixes.size, 'All prefixes should be unique');
        });

        test('Python snippets should have unique prefixes within file', () => {
            const filePath = path.join(snippetsDir, 'python-regex.code-snippets');
            const prefixes = getPrefixesFromFile(filePath);
            const uniquePrefixes = new Set(prefixes);
            assert.strictEqual(prefixes.length, uniquePrefixes.size, 'All prefixes should be unique');
        });
    });

    // ============================================
    // Common Regex Snippet Tests
    // ============================================
    suite('Common Regex Snippets', () => {

        test('Should have email validation snippet', () => {
            const filePath = path.join(snippetsDir, 'snippets.code-snippets');
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const hasEmailSnippet = Object.values<any>(content).some(
                snippet => snippet.description?.toLowerCase().includes('email')
            );
            assert.ok(hasEmailSnippet, 'Should have an email validation snippet');
        });

        test('Should have password validation snippet', () => {
            const filePath = path.join(snippetsDir, 'snippets.code-snippets');
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const hasPasswordSnippet = Object.values<any>(content).some(
                snippet => snippet.description?.toLowerCase().includes('password')
            );
            assert.ok(hasPasswordSnippet, 'Should have a password validation snippet');
        });

        test('Should have IP address validation snippet', () => {
            const filePath = path.join(snippetsDir, 'snippets.code-snippets');
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const hasIpSnippet = Object.values<any>(content).some(
                snippet => snippet.description?.toLowerCase().includes('ipv4') ||
                    snippet.description?.toLowerCase().includes('ip address')
            );
            assert.ok(hasIpSnippet, 'Should have an IP address validation snippet');
        });

        test('Should have hex color validation snippet', () => {
            const filePath = path.join(snippetsDir, 'snippets.code-snippets');
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const hasHexColorSnippet = Object.values<any>(content).some(
                snippet => snippet.description?.toLowerCase().includes('hex') ||
                    snippet.prefix?.includes('hex')
            );
            assert.ok(hasHexColorSnippet, 'Should have a hex color validation snippet');
        });
    });
});
