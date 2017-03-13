import { Component, Input } from '@angular/core';
import { Recipe } from "./Recipe.model";

@Component({
  selector: 'recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent { 
  
  @Input() 
  private recipe:Recipe;
}
