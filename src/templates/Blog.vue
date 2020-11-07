<template>
  <Layout>
    <div
      class="w-full m-0 p-0 bg-cover bg-post"
      v-bind:style="{
        backgroundImage: 'url(' + $page.blog.featureImage.src + ')'
      }"
    >
      <div
        class="mx-auto max-w-screen-lg pt-16 md:pt-32 text-center break-normal"
      >
        <p class="font-bold text-3xl md:text-5xl text-gray-300">
          Blog
        </p>
        <p class="text-xl md:text-2xl text-gray-500">
          How-Tos, Deep-Dives, Brain-Dumps, and More
        </p>
      </div>
    </div>
    <div class="max-w-screen-lg mx-auto py-4 -mt-48 md:-mt-32 bg-white">
      <div class="mx-0">
        <div class="w-full leading-normal rounded-t">
          <div class="flex flex-wrap justify-between pt-0 md:pt-12">
            <div class="w-full md:w-full flex flex-col flex-grow flex-shrink">
              <div
                class="flex-1 rounded-t overflow-hidden rounded shadow px-4 md:px-24 py-4 md:py-8"
              >
                <h1
                  class=" w-full text-3xl md:text-5xl leading-tight font-bold px-0 md:px-12 py-2 md:py-6 text-center"
                >
                  {{ $page.blog.title }}
                </h1>
                <div
                  class="w-full markdown-body py-4 md:py-8 border-b-2"
                  v-html="$page.blog.content"
                ></div>
                <p class="w-full text-xs md:text-sm pt-4 md:pt-8 uppercase">
                  POSTED IN
                  <span v-for="tag in $page.blog.tags">{{ tag.title }}, </span>
                  <span>BLOG</span>
                </p>
              </div>
            </div>
            <div
              class="w-full md:w-full flex flex-col flex-grow flex-shrink mt-8"
            >
              <div
                class="flex-1 rounded overflow-hidden shadow px-4 md:px-24 py-4 md:py-8"
              >
                <Disqus :identifier="$page.blog.id" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<page-query>
query Blog ($path: String!) {
  blog: blog (path: $path) {
    title
    date (format: "MMMM D, Y")
    content
    featureImage
		tags {
			title
		}
  }
}
</page-query>

<script>
export default {
  metaInfo() {
    return {
      title: this.$page.blog.title
    };
  }
};
</script>
