<template>
  <div id="app">
    <CategoryList />
  </div>
</template>

<script>
import CategoryList from './components/CategoryList.vue';

export default {
  name: 'App',
  components: { CategoryList }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #f5f7fa;
}
</style>
