import { Component, Input } from '@angular/core';
import { Recipe } from "./Recipe.model";


@Component({
  selector: 'shoppinglist',
  template: 
  `<h3>lista de la compra: </h3>
  <ul><li *ngFor="let item of listOfIngredients">{{item}}</li></ul>
   
  `,
  styleUrls: ['./recipe.component.css']
})
export class ShoppingListComponent { 

  @Input()
  ingredients:{};

  @Input()
  varietyIngredients:{};

  get listOfIngredients() {
    let results = new Array<string>();
    let result:string;
    for (let key in this.ingredients) {
      let value = this.ingredients[key];
      if (value.unit=="variety") {
        result = key + ": ";
        let varietyitem = this.varietyIngredients[key];
        let auxResult = "";
        for (let varietyKey in varietyitem) {
          if (auxResult!="") {
            auxResult += " y ";
          }
          let unidad = "";
          if (varietyKey == key)
            unidad = "unidades";
          else
            unidad = varietyKey;
          auxResult += varietyitem[varietyKey] + " " + unidad;          
        }
        result = result + auxResult;
      }
      else {
        if (value.unit == key)
          value.unit = "unidades";
        result = key + ": " + value.quantity + " " + value.unit;        
      }
      results.push(result);
     
    }
    //return JSON.stringify(this.ingredients);    
    return results;
  }

 
  
}
