<template>
  <div class="relative flex flex-col min-h-screen">
    <menu-component></menu-component>
    <main class="lg:relative flex-grow main-content">
      <slot></slot>
    </main>
    <footer-component></footer-component>
  </div>
</template>

<script>
import MenuComponent from "../components/Menu";
import FooterComponent from "../components/Footer";

export default {
  components: {
    MenuComponent,
    FooterComponent
  }
};
</script>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style></style>
