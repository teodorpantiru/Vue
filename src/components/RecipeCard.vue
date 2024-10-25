<!-- src/components/RecipeCard.vue -->
<template>
  <div
    class="flex flex-row mt-5 h-auto md:h-[115px] shadow-lg rounded-xl bg-white"
  >
    <!-- Image Section -->
    <div
      @click="showRelatedRecipes"
      class="flex w-[30%] md:w-[20%] bg-gray-600 bg-cover rounded-l-xl overflow-hidden cursor-pointer"
    >
      <img :src="image" :alt="title" class="object-cover w-full h-full" />
    </div>

    <!-- Text Content Section -->
    <div class="w-[70%] md:w-[65%] pl-4 bg-white">
      <h2 class="text-lg md:text-xl font-semibold mb-2 mt-3">{{ title }}</h2>
      <p class="font-semibold">{{ time }}</p>
    </div>

    <div class="flex justify-center items-center m-auto text-customPurple mr-6">
      <component
        class="h-6 w-6 md:h-8 md:w-8 cursor-pointer"
        @click="toggleSave"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    image: String,
    time: String,
    isSaved: Boolean,
  },
  components: {},
  methods: {
    showRelatedRecipes() {
      this.$emit("show-related");
    },
    toggleSave() {
      this.$emit("toggle-save");
    },
  },
};
</script>

<style scoped>
/* Any additional styles */
</style>
