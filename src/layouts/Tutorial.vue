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
      return null;
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
