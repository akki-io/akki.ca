import DefaultLayout from "~/layouts/Default.vue";

require("~/assets/css/styles.css");
require("~/assets/css/github-markdown.css");

export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component("Layout", DefaultLayout);
}
