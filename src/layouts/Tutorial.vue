<template>
  <div class="">
    <menu-component></menu-component>
    <div class="flex">
      <div class="w-full max-w-7xl mx-auto pt-8">
        <div class="lg:flex">
          <div
            id="sidebar"
            class="fixed z-40 inset-0 flex-none h-full bg-black bg-opacity-25 w-full lg:bg-white lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-60 xl:w-72 lg:block hidden"
          >
            <div
              id="navWrapper"
              class="h-full overflow-y-auto scrolling-touch lg:h-auto lg:block lg:relative lg:sticky lg:bg-transparent overflow-hidden lg:top-18 bg-white mr-24 lg:mr-0"
            >
              <nav
                id="nav"
                style="height: calc(100vh - 150px)"
                class="px-1 overflow-y-auto scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray font-medium text-base sm:px-3 xl:px-5 lg:text-sm pb-10 lg:pb-16"
              >
                <ul>
                  <li
                    v-if="links"
                    v-for="(group, i1) in links"
                    class="mt-8"
                    :key="`title-${i1}`"
                  >
                    <h5
                      class="px-3 mb-3 lg:mb-3 uppercase tracking-wide font-semibold text-sm lg:text-xs text-gray-900"
                    >
                      {{ group.title }}
                    </h5>
                    <ul>
                      <li
                        v-for="(item, i2) in group.items"
                        :key="`link-${i1}-${i2}`"
                      >
                        <g-link
                          :to="item.link"
                          class="px-3 py-2 transition-colors duration-200 relative block hover:text-gray-900 text-gray-500"
                          ><span
                            class="rounded-md absolute inset-0 bg-cyan-50 opacity-0"
                          ></span
                          ><span class="relative">{{
                            item.title
                          }}</span></g-link
                        >
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div
            id="content-wrapper"
            class="min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible"
          >
            <div class="pt-10 pb-24 lg:pb-16 w-full flex">
              <div class="min-w-0 flex-auto px-4 sm:px-6 xl:px-8">
                <div class="">
                  <slot />
                  <p class="pt-8 pl-4 leading-5">
                    <a
                      :href="editLink"
                      target="_blank"
                      class="flex justify-start"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                        />
                      </svg>
                      <span
                        class="pl-2 hover:underline text-base text-primary font-normal"
                        >Edit this page on GitHub</span
                      >
                    </a>
                  </p>
                </div>
                <hr class="border-gray-200 mt-10 mb-4" />
                <div class="flex justify-between leading-7 font-medium">
                  <g-link v-if="previousPage" :to="previousPage.link"
                    >&larr; {{ previousPage.title }}</g-link
                  ><g-link v-if="nextPage" :to="nextPage.link"
                    >{{ nextPage.title }} &rarr;</g-link
                  >
                </div>
              </div>
              <div
                class="hidden xl:text-sm xl:block flex-none w-64 pl-8 mr-8"
                v-if="
                  subtitles.length > 0 &&
                    subtitles[0].depth !== 3 &&
                    showOnThisPage
                "
              >
                <div
                  class="flex flex-col justify-between overflow-y-auto sticky max-h-(screen-18) -mt-10 pt-10 pb-4 top-18"
                >
                  <div class="mb-8">
                    <h5
                      class="text-gray-900 uppercase tracking-wide font-semibold mb-3 text-sm lg:text-xs"
                    >
                      On this page
                    </h5>
                    <ul class="overflow-x-hidden text-gray-500 font-medium">
                      <li v-for="subtitle in subtitles" :key="subtitle.value">
                        <a
                          :href="subtitle.anchor"
                          class="block transform transition-colors duration-200 py-2 hover:text-gray-900"
                          >{{ subtitle.value }}</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuComponent from "../components/Menu";
import FooterComponent from "../components/Footer";

export default {
  components: {
    MenuComponent,
    FooterComponent
  },
  props: {
    subtitles: { type: Array, default: () => [] },
    links: { type: Array, default: () => [] },
    showOnThisPage: { type: Boolean, default: true }
  },
  computed: {
    currentPath() {
      return this.$route.matched[0].path;
    },
    editLink() {
      let path = this.currentPath;
      if ((path.match(new RegExp("/", "g")) || []).length === 2) {
        path = path + "/README";
      }
      return `https://github.com/akki-io/akki.ca/blob/master${path}.md`;
    },
    items() {
      return this.links.reduce(
        (acc, group) => (acc.push(...group.items), acc),
        []
      );
    },
    currentIndex() {
      return this.items.findIndex(item => {
        return (
          item.link.replace(/\/$/, "") === this.$route.path.replace(/\/$/, "")
        );
      });
    },
    nextPage() {
      return this.items[this.currentIndex + 1];
    },
    previousPage() {
      return this.items[this.currentIndex - 1];
    }
  }
};
</script>
