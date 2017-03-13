import { Component,ElementRef } from '@angular/core';
import { Recipe } from "./Recipe.model";
import { Ingredient } from "./Ingredient.model";

import { Http, Jsonp } from '@angular/http'
import { RecipeComponent } from './recipe.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  private recipes:Recipe[] = []; 
  private totalIngredients = {};
  private varietyUnits = {};
  private servings = 2;
  
  constructor(private http: Http, private jsonp:Jsonp, private el:ElementRef) {}

  showRecipes() {
    console.log("Showing recipes")
    let url = "http://localhost:5000/"
    this.http.get(url).subscribe(
      response => {
        let data = response.json();
        for (var i=0; i<data.length; i++) {
          let recipe_name = data[i].name;
          let ingredients:Ingredient[] = [];
          let servings = data[i].servings;
          
          for (let ingredient of data[i].ingredients) {
            ingredients.push(new Ingredient(ingredient.quantity, ingredient.unit, ingredient.item));
          }
          console.log(recipe_name);
          this.recipes.push({name: recipe_name, checked:false, ingredients, servings });
        }
        console.log("recipes:" + this.recipes );
      },
      error => console.error(error)
    );
    for (let i of this.recipes) {
    console.log("receta " + i);
    }
  }

  

  addUpIngredientToTotal(ingredients:Ingredient[]) {
     for (let ingredient of ingredients) {
       let item = ingredient.item;
       let quantity = ingredient.quantity;
       let unit = ingredient.unit;
       /*ingredients with unit themselves do not have item key, use unit instead*/
       if (!item) {
         item = unit;
       }

       if (!this.totalIngredients[item]) {
         //console.log(item + " does not exist. Adding.");
         this.totalIngredients[item] = {quantity, unit};
       }
       else {
         let totalIngredient:Ingredient = this.totalIngredients[item];
         //console.log(item + " already in totalIngredients")
         /* same unit? just add up quantities */ 
         if (unit == totalIngredient.unit) {
           totalIngredient.quantity += quantity;
         } 
         else {
           if (totalIngredient.unit != "variety") {
             this.varietyUnits[item] = {};
             this.varietyUnits[item][unit] = quantity;
             this.varietyUnits[item][totalIngredient.unit] = totalIngredient.quantity;
             totalIngredient.unit = "variety";             
           }
           else {
             let varietyItem = this.varietyUnits[item];
             if (!varietyItem[unit]) {
               varietyItem[unit] = quantity;               
             }
             else {
               varietyItem[unit] += quantity;
             }
           }
         }
       }

     }
     

  }

  calculateIngredients() {
    console.log("calculateIngredients");
    this.totalIngredients = {};
    this.varietyUnits = {};
    
    for (let recipe of this.recipes) {
      if (recipe.checked) {
        console.log("We have to calculate ingredientes using "+recipe.name);
        if (recipe.servings!=this.servings) {
          console.log("scale for "+recipe.name+" from " +  recipe.servings + " to " + this.servings + " is needed");
          for (let i of recipe.ingredients) {
            let scaledQuantity = this.servings * i.quantity / recipe.servings;
            i.quantity = scaledQuantity;
          }
          recipe.servings = this.servings;              
          
        }
          
        this.addUpIngredientToTotal(recipe.ingredients);
      }        
    }

    

    console.log("TOTAL:\n"+JSON.stringify(this.totalIngredients));
    console.log("VARIETY:\n" + JSON.stringify(this.varietyUnits));
    
  }

  sendByEmail() {
    console.log("sending email")
    //console.log(this.el.nativeElement.innerHTML)
    let lista = this.el.nativeElement.querySelector('shoppingList ul')
    let elems = lista.getElementsByTagName('li')
    let msg = ''
    for (let elem of elems) {
      msg = msg + elem.innerHTML + '\n'
      console.log('elem:'+elem.innerHTML)
    }

    let url = "http://localhost:5000/mailsend"
    this.http.post(url, {'msg':msg}).subscribe(
      response => console.log(response),
      error => console.log(error)
    );

  }

  
  
  title = 'Recipes app works!';
}
