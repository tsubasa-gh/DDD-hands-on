import { Title } from './Title';

describe('Title', () => {
    test('Titleが1文字で作成できる', () => {
        expect(new Title('a').getValue()).toBe('a');
    });

    test('Titleが1000文字で作成できる', () => {
        const longTitle = 'a'.repeat(1000);
        expect(new Title(longTitle).getValue()).toBe(longTitle);
    });

    test('最小長以下の値でTitleを生成するとエラーを投げる', () => {
        expect(() => new Title('')).toThrow(
            'タイトルは1文字以上、1000文字以下でなければなりません。'
        );
    })

    test('最大長以上の値でTitleを生成するとエラーを投げる', () => {
        expect(() => new Title('a'.repeat(1001))).toThrow(
            'タイトルは1文字以上、1000文字以下でなければなりません。'
        );
    });
});
