import DefaultLayout from "~/layouts/Default.vue";
import VueKinesis from "vue-kinesis";

require("~/assets/styles.css");
require("typeface-roboto");

export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component("Layout", DefaultLayout);
  Vue.use(VueKinesis);
}
