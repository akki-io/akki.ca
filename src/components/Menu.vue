<template>
  <div
    class="relative shadow-sm lg:w-full lg:sticky lg:top-0 lg:z-50 z-10	bg-dimmed-header-bg"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div
        class="flex justify-between items-center py-3 md:justify-start md:space-x-10"
      >
        <div class="w-0 flex-1 flex">
          <g-link
            to="/"
            class="inline-flex text-2xl text-dimmed-header-text font-medium"
          >
            Akshansh Khare
          </g-link>
        </div>
        <div class="-mr-2 -my-2 md:hidden">
          <button
            type="button"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="inline-flex items-center justify-center text-dimmed-header-text p-2 rounded-md focus:outline-none transition duration-150 ease-in-out"
          >
            <!-- Heroicon name: menu -->
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <nav class="hidden md:flex space-x-10">
          <g-link
            to="/about"
            class="text-dimmed-header-text hover:text-dimmed-text-secondary space-x-2 text-base leading-6 font-medium transition ease-in-out duration-150"
          >
            About
          </g-link>
          <g-link
            to="/blog"
            class="text-dimmed-header-text hover:text-dimmed-text-secondary space-x-2 text-base leading-6 font-medium transition ease-in-out duration-150"
          >
            Blog
          </g-link>
        </nav>
      </div>
    </div>
    <transition
      enter-active-class="duration-200 ease-out"
      enter-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-100 ease-in"
      leave-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-show="isMobileMenuOpen"
        class="absolute top-0 inset-x-0 z-10 transition transform origin-top-right md:hidden"
      >
        <div class="shadow-lg">
          <div class="shadow-xs bg-dimmed-header-bg divide-y-2 divide-gray-50">
            <div class="pt-5 pb-6 px-5 space-y-6">
              <div class="flex items-center justify-between">
                <div></div>
                <div class="-mr-2">
                  <button
                    type="button"
                    @click="isMobileMenuOpen = !isMobileMenuOpen"
                    class="inline-flex items-center justify-center p-2 rounded-md text-dimmed-header-text focus:outline-none transition duration-150 ease-in-out"
                  >
                    <svg
                      class="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <nav class="grid gap-y-8">
                  <g-link
                    to="/"
                    class="-m-3 p-3 flex items-center space-x-3 rounded-md transition ease-in-out duration-150"
                  >
                    <div
                      class="text-base leading-6 font-medium text-dimmed-header-text"
                    >
                      Home
                    </div>
                  </g-link>
                  <g-link
                    to="/about"
                    class="-m-3 p-3 flex items-center space-x-3 rounded-md transition ease-in-out duration-150"
                  >
                    <div
                      class="text-base leading-6 font-medium text-dimmed-header-text"
                    >
                      About
                    </div>
                  </g-link>
                  <g-link
                    to="/blog"
                    class="-m-3 p-3 flex items-center space-x-3 rounded-md transition ease-in-out duration-150"
                  >
                    <div
                      class="text-base leading-6 font-medium text-dimmed-header-text"
                    >
                      Blog
                    </div>
                  </g-link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data: () => ({
    isMobileMenuOpen: false
  })
};
</script>
