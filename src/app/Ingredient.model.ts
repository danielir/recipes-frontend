export class Ingredient {

    quantity:number;
    unit:string;
    item:string;

    constructor(quantity:number, unit:string, item:string) {
        this.quantity = quantity;
        this.unit = unit;
        this.item = item
    }

    toString(): string {
        return "quantity: " + this.quantity + ", unit: " + this.unit + ", item: " + this.item;
    }
}