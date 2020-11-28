import DefaultLayout from "~/layouts/Default.vue";
import TutorialLayout from "~/layouts/Tutorial.vue";
import VueDisqus from "vue-disqus";
import * as Sentry from "@sentry/browser";
import { Vue as VueIntegration } from "@sentry/integrations";
import { Integrations } from "@sentry/tracing";
import VueGtag from "vue-gtag";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

require("~/assets/css/styles.css");
require("~/assets/css/github-markdown.css");
require("typeface-nunito");

export default function(Vue, { router, head, isClient }) {
  Vue.component("Layout", DefaultLayout);
  Vue.component("TutorialLayout", TutorialLayout);

  Vue.use(VueDisqus, {
    shortname: "akki-ca"
  });

  if (process.env.GRIDSOME_GOOGLE_ANALYTICS) {
    Vue.use(VueGtag, {
      config: { id: process.env.GRIDSOME_GOOGLE_ANALYTICS }
    });
  }

  Sentry.init({
    dsn: process.env.GRIDSOME_SENTRY_DSN,
    integrations: [
      new VueIntegration({
        Vue,
        tracing: true
      }),
      new Integrations.BrowserTracing()
    ],
    tracesSampleRate: 1.0
  });

  router.beforeEach((to, from, next) => {
    if (!to.hash && typeof document !== "undefined") {
      NProgress.start();
    }
    next();
  });

  router.afterEach((to, from) => {
    if (!to.hash && typeof document !== "undefined") {
      NProgress.done();
    }
  });
}
