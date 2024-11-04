import { isEqual } from 'lodash';

export abstract class ValueObject<T, U> {
    //private _type: U;
    protected readonly _value: T;

    constructor(value: T) {
        this.validate(value);
        this._value = value;
    }

    protected abstract validate(value: T): void;
    
    getValue(): T {
        return this._value;
    }

    equals(other: ValueObject<T, U>): boolean {
        return isEqual(this._value, other._value);
    }
}
