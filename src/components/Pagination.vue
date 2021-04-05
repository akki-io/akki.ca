<template>
  <nav class=" px-4 flex items-center justify-between sm:px-0">
    <div class="w-0 flex-1 flex">
      <g-link
        :to="previousPage"
        :class="{
          'text-dimmed-text-secondary hover:text-dimmed-text-secondary cursor-not-allowed': !showPreviousPage
        }"
        class="-mt-px pt-4 pr-1 inline-flex items-center text-sm leading-5 font-medium text-dimmed-text-secondary hover:text-dimmed-text-primary transition ease-in-out duration-150"
      >
        <svg
          class="mr-3 h-5 w-5 text-dimmed-text-secondary"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Previous
      </g-link>
    </div>
    <div
      class="hidden md:flex text-sm leading-5 font-medium text-dimmed-text-secondary -mt-px pt-4 pr-1 inline-flex items-center"
    >
      Page {{ currentPage }} of {{ totalPages }}
    </div>
    <div class="w-0 flex-1 flex justify-end">
      <g-link
        :to="nextPage"
        :class="{
          'text-dimmed-text-secondary hover:text-dimmed-text-secondary cursor-not-allowed': !showNextPage
        }"
        class="-mt-px pt-4 pl-1 inline-flex items-center text-sm leading-5 font-medium text-dimmed-text-secondary hover:text-dimmed-text-primary transition ease-in-out duration-150"
      >
        Next
        <svg
          class="ml-3 h-5 w-5 text-dimmed-text-secondary"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </g-link>
    </div>
  </nav>
</template>

<script>
export default {
  props: ["base", "totalPages", "currentPage"],
  computed: {
    showPreviousPage() {
      return this.currentPage !== 1;
    },
    previousPage() {
      return [0, 1].includes(this.currentPage - 1)
        ? this.base
        : `${this.base}/${this.currentPage - 1}`;
    },
    showNextPage() {
      return this.currentPage !== this.totalPages;
    },
    nextPage(currentPage, totalPages) {
      return this.totalPages > this.currentPage
        ? `${this.base}/${this.currentPage + 1}`
        : `${this.base}/${this.currentPage}`;
    }
  }
};
</script>
