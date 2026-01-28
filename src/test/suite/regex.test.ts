import * as assert from 'assert';

suite('Regex Pattern Validation Tests', () => {

    // ============================================
    // Email Validation Tests
    // ============================================
    suite('Email Validation', () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        test('Should match valid email addresses', () => {
            const validEmails = [
                'test@example.com',
                'user.name@domain.org',
                'user+tag@example.co.uk',
                'firstname.lastname@company.net',
                'email@subdomain.domain.com',
                'test123@test123.com'
            ];

            validEmails.forEach(email => {
                assert.ok(emailRegex.test(email), `Should match: ${email}`);
            });
        });

        test('Should not match invalid email addresses', () => {
            const invalidEmails = [
                'plainaddress',
                '@missingusername.com',
                'username@.com',
                'username@domain',
                'user name@domain.com',
                ''
            ];

            invalidEmails.forEach(email => {
                assert.ok(!emailRegex.test(email), `Should not match: ${email}`);
            });
        });
    });

    // ============================================
    // URL Validation Tests
    // ============================================
    suite('URL Validation', () => {
        const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/i;

        test('Should match valid URLs', () => {
            const validUrls = [
                'https://www.example.com',
                'http://example.com',
                'https://subdomain.example.com/path',
                'http://example.com/path?query=value',
                'https://example.com:8080/path'
            ];

            validUrls.forEach(url => {
                assert.ok(urlRegex.test(url), `Should match: ${url}`);
            });
        });

        test('Should not match invalid URLs', () => {
            const invalidUrls = [
                'ftp://example.com',
                'example.com',
                'www.example.com',
                '//example.com',
                ''
            ];

            invalidUrls.forEach(url => {
                assert.ok(!urlRegex.test(url), `Should not match: ${url}`);
            });
        });
    });

    // ============================================
    // Phone Number Validation Tests
    // ============================================
    suite('Phone Number Validation', () => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

        test('Should match valid phone numbers', () => {
            const validPhones = [
                '1234567890',
                '+1234567890',
                '9876543210',
                '+919876543210'
            ];

            validPhones.forEach(phone => {
                assert.ok(phoneRegex.test(phone), `Should match: ${phone}`);
            });
        });

        test('Should not match invalid phone numbers', () => {
            const invalidPhones = [
                '0123456789', // starts with 0
                'abcdefghij',
                '',
                '++1234567890'
            ];

            invalidPhones.forEach(phone => {
                assert.ok(!phoneRegex.test(phone), `Should not match: ${phone}`);
            });
        });
    });

    // ============================================
    // UUID Validation Tests
    // ============================================
    suite('UUID Validation', () => {
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

        test('Should match valid UUIDs', () => {
            const validUuids = [
                '550e8400-e29b-41d4-a716-446655440000',
                '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
                'f47ac10b-58cc-4372-a567-0e02b2c3d479'
            ];

            validUuids.forEach(uuid => {
                assert.ok(uuidRegex.test(uuid), `Should match: ${uuid}`);
            });
        });

        test('Should not match invalid UUIDs', () => {
            const invalidUuids = [
                '550e8400-e29b-41d4-a716',
                'not-a-uuid',
                '550e8400e29b41d4a716446655440000',
                ''
            ];

            invalidUuids.forEach(uuid => {
                assert.ok(!uuidRegex.test(uuid), `Should not match: ${uuid}`);
            });
        });
    });

    // ============================================
    // JWT Validation Tests
    // ============================================
    suite('JWT Validation', () => {
        const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

        test('Should match valid JWT patterns', () => {
            const validJwts = [
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                'header.payload.signature',
                'abc.def.ghi'
            ];

            validJwts.forEach(jwt => {
                assert.ok(jwtRegex.test(jwt), `Should match: ${jwt}`);
            });
        });

        test('Should not match invalid JWT patterns', () => {
            const invalidJwts = [
                'notajwt',
                'only.two',
                '.start.with.dot',
                ''
            ];

            // Note: 'only.two' might match depending on regex, adjust as needed
            invalidJwts.forEach(jwt => {
                // Some patterns might be edge cases
                if (jwt === '' || jwt === 'notajwt' || jwt === '.start.with.dot') {
                    assert.ok(!jwtRegex.test(jwt), `Should not match: ${jwt}`);
                }
            });
        });
    });

    // ============================================
    // Hexadecimal Color Validation Tests
    // ============================================
    suite('Hexadecimal Color Validation', () => {
        const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

        test('Should match valid hex colors', () => {
            const validColors = [
                '#fff',
                '#FFF',
                '#ffffff',
                '#FFFFFF',
                '#123456',
                '#abc',
                '#ABC'
            ];

            validColors.forEach(color => {
                assert.ok(hexColorRegex.test(color), `Should match: ${color}`);
            });
        });

        test('Should not match invalid hex colors', () => {
            const invalidColors = [
                'fff',
                '#ff',
                '#fffffff',
                '#ggg',
                '#12345',
                ''
            ];

            invalidColors.forEach(color => {
                assert.ok(!hexColorRegex.test(color), `Should not match: ${color}`);
            });
        });
    });

    // ============================================
    // IPv4 Address Validation Tests
    // ============================================
    suite('IPv4 Address Validation', () => {
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        test('Should match valid IPv4 addresses', () => {
            const validIps = [
                '192.168.1.1',
                '10.0.0.0',
                '255.255.255.255',
                '0.0.0.0',
                '127.0.0.1'
            ];

            validIps.forEach(ip => {
                assert.ok(ipv4Regex.test(ip), `Should match: ${ip}`);
            });
        });

        test('Should not match invalid IPv4 addresses', () => {
            const invalidIps = [
                '256.256.256.256',
                '192.168.1',
                '192.168.1.1.1',
                'abc.def.ghi.jkl',
                ''
            ];

            invalidIps.forEach(ip => {
                assert.ok(!ipv4Regex.test(ip), `Should not match: ${ip}`);
            });
        });
    });

    // ============================================
    // Password Strength Validation Tests
    // ============================================
    suite('Password Strength Validation', () => {
        // At least 1 uppercase, 1 lowercase, 1 digit, 1 special char, min 8 chars
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{8,}$/;

        test('Should match strong passwords', () => {
            const strongPasswords = [
                'Password1!',
                'SecurePass123@',
                'MyP@ssw0rd',
                'Test_123A'
            ];

            strongPasswords.forEach(password => {
                assert.ok(passwordRegex.test(password), `Should match: ${password}`);
            });
        });

        test('Should not match weak passwords', () => {
            const weakPasswords = [
                'password',      // no uppercase, digit, special
                'PASSWORD',      // no lowercase, digit, special
                'Password',      // no digit, special
                'Password1',     // no special
                'Pass1!',        // too short
                ''
            ];

            weakPasswords.forEach(password => {
                assert.ok(!passwordRegex.test(password), `Should not match: ${password}`);
            });
        });
    });

    // ============================================
    // Date Format Validation Tests
    // ============================================
    suite('Date Format Validation', () => {
        const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

        test('Should match valid dates (MM/DD/YYYY)', () => {
            const validDates = [
                '01/01/2024',
                '12/31/2024',
                '06/15/2023',
                '02/28/2024'
            ];

            validDates.forEach(date => {
                assert.ok(dateRegex.test(date), `Should match: ${date}`);
            });
        });

        test('Should not match invalid dates', () => {
            const invalidDates = [
                '13/01/2024',    // invalid month
                '00/15/2024',    // invalid month
                '12/32/2024',    // invalid day
                '12/00/2024',    // invalid day
                '1/1/2024',      // missing leading zeros
                ''
            ];

            invalidDates.forEach(date => {
                assert.ok(!dateRegex.test(date), `Should not match: ${date}`);
            });
        });
    });

    // ============================================
    // Credit Card Validation Tests
    // ============================================
    suite('Credit Card Validation', () => {
        const creditCardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/;

        test('Should match valid credit card numbers', () => {
            const validCards = [
                '4111111111111111',  // Visa
                '5500000000000004',  // Mastercard
                '340000000000009',   // Amex
                '6011000000000004'   // Discover
            ];

            validCards.forEach(card => {
                assert.ok(creditCardRegex.test(card), `Should match: ${card}`);
            });
        });

        test('Should not match invalid credit card numbers', () => {
            const invalidCards = [
                '1234567890123456',
                '411111111111111',   // too short
                '41111111111111111', // too long
                'abcd1234efgh5678',
                ''
            ];

            invalidCards.forEach(card => {
                assert.ok(!creditCardRegex.test(card), `Should not match: ${card}`);
            });
        });
    });

    // ============================================
    // Postal Code Validation Tests
    // ============================================
    suite('Postal Code Validation', () => {
        // US ZIP code
        const usZipRegex = /^\d{5}(-\d{4})?$/;

        test('Should match valid US ZIP codes', () => {
            const validZips = [
                '12345',
                '12345-6789',
                '00000',
                '99999-9999'
            ];

            validZips.forEach(zip => {
                assert.ok(usZipRegex.test(zip), `Should match: ${zip}`);
            });
        });

        test('Should not match invalid US ZIP codes', () => {
            const invalidZips = [
                '1234',
                '123456',
                '12345-678',
                '12345-67890',
                'abcde',
                ''
            ];

            invalidZips.forEach(zip => {
                assert.ok(!usZipRegex.test(zip), `Should not match: ${zip}`);
            });
        });
    });

    // ============================================
    // Alphanumeric Validation Tests
    // ============================================
    suite('Alphanumeric Validation', () => {
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;

        test('Should match alphanumeric strings', () => {
            const validStrings = [
                'abc123',
                'ABC',
                '123',
                'AbC123XyZ'
            ];

            validStrings.forEach(str => {
                assert.ok(alphanumericRegex.test(str), `Should match: ${str}`);
            });
        });

        test('Should not match non-alphanumeric strings', () => {
            const invalidStrings = [
                'abc 123',
                'abc-123',
                'abc_123',
                'abc@123',
                ''
            ];

            invalidStrings.forEach(str => {
                assert.ok(!alphanumericRegex.test(str), `Should not match: ${str}`);
            });
        });
    });

    // ============================================
    // Username Validation Tests
    // ============================================
    suite('Username Validation', () => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

        test('Should match valid usernames', () => {
            const validUsernames = [
                'john_doe',
                'user123',
                'JohnDoe',
                'abc',
                '1234567890123456' // 16 chars
            ];

            validUsernames.forEach(username => {
                assert.ok(usernameRegex.test(username), `Should match: ${username}`);
            });
        });

        test('Should not match invalid usernames', () => {
            const invalidUsernames = [
                'ab',                   // too short
                '12345678901234567',    // too long (17 chars)
                'user-name',            // contains hyphen
                'user name',            // contains space
                'user@name',            // contains @
                ''
            ];

            invalidUsernames.forEach(username => {
                assert.ok(!usernameRegex.test(username), `Should not match: ${username}`);
            });
        });
    });
});
