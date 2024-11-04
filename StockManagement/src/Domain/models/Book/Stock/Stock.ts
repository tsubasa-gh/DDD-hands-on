import { QuantityAvailable } from "./QuantityAvailable/QuantityAvailable";
import { Status, StatusEnum } from "./Status/Status";
import { StockId } from "./StockId";

export class Stock {
    // private constructorにしている理由は、create メソッドと reconstruct メソッドのみでエンティティを生成することを強制するため
    private constructor(
        private readonly _id: StockId,
        private _quantityAvailable: QuantityAvailable,
        private _status: Status,
    ) {}

    // 新規エンティティの生成
    static create(
    ) {
        const defaultStockId = new StockId(); // 自動ID採番
        const defaultQuantityAvailable = new QuantityAvailable(0);
        const defaultStatus = new Status(StatusEnum.OutOfStock);

        return new Stock(defaultStockId, defaultQuantityAvailable, defaultStatus);
    }

    public delete() {
        if (this._status.getValue() !== StatusEnum.OutOfStock) {
            throw new Error('在庫がある場合削除できません。');
        }
    }

    public changeStatus(newStatus: Status) {
        this._status = newStatus;
    }

    // 在庫数を増やす
    increaseQuantity(amount: number) {
        if (amount < 0) {
            throw new Error('増加量は0以上でなければなりません。');
        }

        const newQuantitiy = this._quantityAvailable.increment(amount).getValue();

        if (newQuantitiy > 10) {
            this.changeStatus(new Status(StatusEnum.LowStock));
        }
        this._quantityAvailable = new QuantityAvailable(newQuantitiy);
    }

    // 在庫数を減らす
    decreaseQuantity(amount: number) {
        if (amount < 0) {
            throw new Error('減少量は0以上でなければなりません。');
        }

        const newQuantitiy = this._quantityAvailable.decrement(amount).getValue();
        if (newQuantitiy < 0) {
            throw new Error('減少後の在庫数が0未満になってしまいます。');
        }

        if (newQuantitiy <= 10) {
            this.changeStatus(new Status(StatusEnum.LowStock));
        }

        if (newQuantitiy === 0) {
            this.changeStatus(new Status(StatusEnum.OutOfStock));
        }

        this._quantityAvailable = new QuantityAvailable(newQuantitiy);
    }

    // エンティティの再構築
    static reconstruct(
        stockId: StockId,
        quantityAvailable: QuantityAvailable,
        status: Status,
    ) {
        return new Stock(stockId, quantityAvailable, status);
    }

    get stockId(): StockId {
        return this._id;
    }

    get quantityAvailable(): QuantityAvailable {
        return this._quantityAvailable;
    }

    get status(): Status {
        return this._status;
    }
}
