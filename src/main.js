import DefaultLayout from "~/layouts/Default.vue";

require("~/assets/css/styles.css");
require("~/assets/css/github-markdown.css");

export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component("Layout", DefaultLayout);

  head.link.push({
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;300;400;600;700;800&display=swap"
  });
}
