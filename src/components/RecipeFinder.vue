<!-- src/components/RecipeFinder.vue -->
<template>
  <div>
    <div class="flex flex-row justify-center ml-auto mr-auto mt-20 w-full">
      <input
        class="border focus:border-white focus:outline-none pl-4 pr-4 pt-2 pb-2 w-[35%] rounded-full"
        v-model="ingredient"
        placeholder="Enter an ingredient"
      />
      <button
        class="ml-4 border pl-4 pr-4 pt-3 pb-3 rounded-full bg-yellow-500 text-white w-[8%]"
        @click="fetchRecipe"
      >
        Find Recipe
      </button>
    </div>

    <!-- Spinner -->
    <div v-if="loading" class="flex flex-col justify-center items-center mt-10">
      <h1 class="mb-7 bg-yellow-500 rounded-full text-white pl-4 pr-4 p-4">
        Take your time. It will take a few seconds.
      </h1>
      <div
        class="rounded-full w-10 h-10 border-4 border-yellow-500 border-t-transparent animate-spin"
      ></div>
    </div>

    <!-- Recipe Card -->
    <div class="flex flex-col mr-auto ml-auto w-[40%] mt-10 mb-10">
      <div v-if="recipe">
        <RecipeCard
          :title="recipe.title"
          :image="recipe.image"
          :time="recipe.prep_time + ' / ' + recipe.cook_time"
          :isSaved="false"
          @show-related="handleShowRelated"
          @toggle-save="handleToggleSave"
        />
      </div>

      <!-- Related Recipes -->
      <div class="mt-5" v-if="relatedRecipes.length">
        <h3
          class="text-left border pl-5 p-2 text-xl bg-yellow-500 rounded-lg text-white w-[40%]"
        >
          Related Recipes:
        </h3>
        <div v-for="(related, index) in relatedRecipes" :key="related.title">
          <RecipeCard
            :title="related.title"
            :image="related.image || defaultImage"
            :time="related.prep_time + ' / ' + related.cook_time"
            :isSaved="false"
            @show-related="handleShowRelated"
            @toggle-save="handleToggleSave"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipeCard from "./RecipeCard.vue";
import { generateRecipeResponse } from "@/services/openaiService";

export default {
  components: {
    RecipeCard,
  },
  data() {
    return {
      ingredient: "",
      recipe: null,
      relatedRecipes: [],
      defaultImage: "path/to/default-image.jpg",
      loading: false,
    };
  },
  computed: {
    recipeImage() {
      return this.recipe?.image || this.defaultImage;
    },
  },
  methods: {
    async fetchRecipe() {
      this.loading = true;
      this.recipe = null;
      this.relatedRecipes = [];

      try {
        const data = await generateRecipeResponse(this.ingredient);
        if (data?.recipe) {
          this.recipe = data.recipe;
          this.relatedRecipes = data.related_recipes || [];
        } else {
          alert("No recipe found for this ingredient.");
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        this.loading = false;
      }
    },
    handleShowRelated() {
      // Handle related recipe click event
    },
    handleToggleSave() {
      // Handle save/unsave event
    },
  },
};
</script>
