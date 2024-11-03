import { Price } from "./Price";

describe('Price', () => {
    // 正常系
    it ('正しい値と通過コードJPYで有効なPriceを作成する', () => {
        const validAmount = 500;
        const price = new Price({ amount: validAmount, currency: 'JPY' });
        expect(price.getAmount()).toBe(validAmount);
        expect(price.getCurrency()).toBe('JPY');
    });

    // 異常系
    it ('MIN未満の値でPriceを生成するとエラーを投げる', () => {
        const lessThanMin = Price.MIN - 1;
        expect(() => { new Price({ amount: lessThanMin, currency: 'JPY' }); }).toThrow(
            `価格は${Price.MIN}円から${Price.MAX}円の間でなければなりません。`
        );
    });

    it ('MAX超の値でPriceを生成するとエラーを投げる', () => {
        const moreThanMax = Price.MAX + 1;
        expect(() => { new Price({ amount: moreThanMax, currency: 'JPY' });
    }).toThrow(
        `価格は${Price.MIN}円から${Price.MAX}円の間でなければなりません。`
    );
    });
});
