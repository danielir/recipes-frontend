import { Ingredient } from "./Ingredient.model";

export class Recipe {

    name:string;
    checked:boolean;
    ingredients:Ingredient[];
    servings:number;
}