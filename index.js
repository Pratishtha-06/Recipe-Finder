let button=document.getElementById("search-btn");
let Recipes= document.querySelector("#div-1");
let RecipeDetails=document.querySelector("#recipe-details");
let recipeDetailContent=document.querySelector(".recipe-contents");
let CloseBtn=document.querySelector("#close-btn");
let Suggestions=document.querySelector("#suggestions");
let sugg=document.querySelector("#sugg");
let searchInput=document.getElementById("search");

const Recipe = async (query)=>{
  try{
    Recipes.innerHTML=``;
    const data =await  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();
    
    
//for empty input
    if (!query){
      Suggestions.innerHTML=`<h2 class="head-1">Suggestions for you to explore more !</h2>`;
     sugg.innerHTML=`<h2 class ="head-1">Search to get the recipe of your favourate dish...</h2>`;
     response.meals=response.meals.sort(()=>0.5-Math.random()).slice(0,7);
     }
//Non matched input     
     if (!response.meals) {
      Suggestions.innerHTML = `<h3 class="head-1" >Couldn't find recipes for "${query}"<br>
      Try searching for another dish.</h3>`;
      sugg.innerHTML = ``;
      return; 
    } 
  if(query){
    Suggestions.innerHTML=``;
    sugg.innerHTML=``;
  }
//searched input
    response.meals.forEach(meal => {
    const RecipeCreate = document.createElement("div");
    RecipeCreate.classList.add(`recipe`);
    RecipeCreate.innerHTML=`
    <img src=${meal.strMealThumb}>
    <h3>${meal.strMeal}</h3>
    <h2>${meal.strArea} Dish</h2>
    <h3>${meal.strCategory}</h3> `

//get recipe button
    const btn=document.createElement("button");
    btn.classList.add(`btn`);
    btn.textContent="Get Recipe";
    RecipeCreate.appendChild(btn);
      
    btn.addEventListener("click",()=>{
     RecipePopUp(meal);
    });
    Recipes.appendChild(RecipeCreate);
    });
  
 
  } catch(error){
    Suggestions.innerHTML=`<h3 class="head-1">Opps ! Error in fetching recipes .Give it another try !</h3>`;
    console.log(error);
    sugg.innerHTML=``;
  }
  }
//recipe fetching
    const fetchIngredients=(meal)=>{ 
      let ingredientsList="";
      for(let i=1;i<=20;i++){
       let ingredients=meal[`strIngredient${i}`];
         if(ingredients){
            const measure= meal[`strMeasure${i}`];
            ingredientsList +=`<li>${measure} ${ingredients}</li>`
        }else{
            break;
        }
      } 
      return ingredientsList;
    }
//ingrediants fetching   
    const RecipePopUp=(meal)=>{
     recipeDetailContent.innerHTML=`
     <h2 class="RecipeName">${meal.strMeal}</h2>
     <h4 >Ingredients:</h4>
     <ul class="IngrList">${fetchIngredients(meal)}</ul>
      <div>
        <h4>
          Instructions:  
        </h4>
        <p class="Instruction">
        ${meal.strInstructions}
        </p>
     </div>
     `
     recipeDetailContent.parentElement.style.display="block";
    }

  CloseBtn.addEventListener("click",()=>{
    recipeDetailContent.parentElement.style.display="none";
  })  
//search button
  button.addEventListener("click",()=>{
    var Input = searchInput.value.trim();
    if(!Input){
       Recipe("");
     }else{
      Recipe(Input);
     }
  })