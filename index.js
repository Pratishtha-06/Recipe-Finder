let button=document.getElementById("search-btn");
let Recipes= document.querySelector("#div-1");
let RecipeDetails=document.querySelector("#recipe-details");
let recipeDetailContent=document.querySelector(".recipe-contents");
let CloseBtn=document.querySelector("#close-btn");
let Suggestions=document.querySelector("#suggestions");
let sugg=document.querySelector("#sugg");
let searchInput=document.getElementById("search");
let div=document.querySelector('#cuisine-container');
let cuisine =document.querySelector(".cuisine");
let head= document.querySelector(".Cuisine-head");
let cuisineContainer =document.querySelector("#cuisine-container");
let Load=document.getElementById('loader');
let Loading =document.querySelector('#Loading');
let cuisineHead=document.querySelectorAll('.cuisine-heading')


let buttonClick=false;


const Recipe = async (query)=>{
  Load.style.display=`block`;
  Loading.style.display=`block`;
  try{
    Recipes.innerHTML=``;
    div.innerHTML=``;
    head.remove();
    cuisineContainer.innerHTML=``;
    cuisineContainer.style.padding=`0px`;
   
    const data =await  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();
    Load.style.display=`none`;
    Loading.style.display=`none`;
    
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
    Load.style.display=`none`;
    Loading.style.display=`none`;
    sugg.innerHTML=``;
    cuisineContainer=``;
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
       buttonClick=true;
     }else{
      Recipe(Input);
      buttonClick=true;
     }
  })

  //on Page Load
  const LoadCuisine=async(area,containerId,childId)=>{
  
   cuisineContainer.classList.add("single-cuisine");
    Load.style.display=`block`;
    Loading.style.display=`flex`;
    
    try{  
    const data =await  fetch(`http://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    const response = await data.json();

    
    Load.style.display=`none`;
    Loading.style.display=`none`;

    const container = document.getElementById(containerId);

    const containerChild = document.createElement("div");
    containerChild.id = childId;
    container.appendChild(containerChild);

    if (!response.meals) {
      container.innerHTML += `<p>No recipes found for ${area} cuisine.</p>`;
      return;
    }

    const meal=response.meals.sort(()=>0.5-Math.random()).slice(0,5);

    meal.forEach(meal=>{
      const getId = meal.idMeal;
      const div =document.createElement("div");
      div.classList.add("recipe-grid");
      div.innerHTML=
       `<img src=${meal.strMealThumb}>
        <h3>${meal.strMeal}</h3>
       ` 
       const btn=document.createElement("button");
       btn.classList.add(`btn`);
       btn.textContent="Get Recipe";
       btn.addEventListener("click",()=>{
        RecipePop(getId);
       });
       div.appendChild(btn);
       containerChild.appendChild(div);
      })

      const RecipePop=async(getId)=>{
        const dataById=await fetch(`http://www.themealdb.com/api/json/v1/1/lookup.php?i=${getId}`)
        const IdResponse=await dataById.json();
        const mealDetails=IdResponse.meals[0];
      
        recipeDetailContent.innerHTML=`
        <h2 class="RecipeName">${mealDetails.strMeal}</h2>
        <h3>(${mealDetails.strCategory})</h3> 
        <h4 >Ingredients:</h4>
        <ul class="IngrList">${fetchIngredients(mealDetails)}</ul>
         <div>
           <h4>
             Instructions:  
           </h4>
           <p class="Instruction">
           ${mealDetails.strInstructions}
           </p>
        </div>
        `
        recipeDetailContent.parentElement.style.display="block";
       }
   
     CloseBtn.addEventListener("click",()=>{
       recipeDetailContent.parentElement.style.display="none";
     })  

  }catch(err){
    console.log("error:",err);
  }}
  
  document.querySelectorAll('.cuisine-heading').forEach(heading => {
    heading.addEventListener('click', () => {
      const area = heading.getAttribute('data-area');
  
      const containerMap = {
        'Indian': { containerId: 'div-2', childId: 'child-1' },
        'Italian': { containerId: 'div-3', childId: 'child-2' },
        'Mexican': { containerId: 'div-4', childId: 'child-3' },
        'Canadian': { containerId: 'div-5', childId: 'child-4' },
        'Chinese': { containerId: 'div-6', childId: 'child-5' },

      };
  
      const ids = containerMap[area];
  
      if (ids) {
        // Hide other cuisine sections
        document.querySelectorAll('#cuisine-container > div').forEach(div => {
          if (div.id !== ids.containerId) {
            div.remove();
          }
        });
  
        LoadCuisine(area, ids.containerId, ids.childId);
      }
    });
  });
  
  