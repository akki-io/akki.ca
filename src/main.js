import DefaultLayout from "~/layouts/Default.vue";
import VueDisqus from "vue-disqus";
import * as Sentry from "@sentry/browser";
import { Vue as VueIntegration } from "@sentry/integrations";
import { Integrations } from "@sentry/tracing";
import VueGtag from "vue-gtag";

require("~/assets/css/styles.css");
require("~/assets/css/github-markdown.css");
require("typeface-nunito");

export default function(Vue, { router, head, isClient }) {
  Vue.component("Layout", DefaultLayout);

  Vue.use(VueDisqus, {
    shortname: "akki-ca"
  });

  Vue.use(VueGtag, {
    config: { id: "G-LQX1Z5MEJ5" }
  });

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new VueIntegration({
        Vue,
        tracing: true
      }),
      new Integrations.BrowserTracing()
    ],
    tracesSampleRate: 1.0
  });
}
