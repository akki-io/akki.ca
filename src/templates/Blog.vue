<template>
  <Layout>
    <div class="relative py-16 overflow-hidden">
      <div class="relative px-4 sm:px-6 lg:px-8">
        <div class="text-lg max-w-prose mx-auto mb-6">
          <p
            class="text-base text-center leading-6 text-dimmed-text-secondary font-semibold tracking-wide uppercase"
          >
            POSTED IN
            <span v-for="tag in $page.blog.tags">{{ tag.title }}, </span>
            <span>BLOG</span>
          </p>
          <h1
            class="mt-2 mb-8 text-3xl text-center leading-8 font-extrabold tracking-tight text-dimmed-text-primary sm:text-4xl sm:leading-10"
          >
            {{ $page.blog.title }}
          </h1>
        </div>
        <div class="prose prose-xl mx-auto text-dimmed-text-primary">
          <figure>
            <img
              class="w-full rounded-lg"
              :src="$page.blog.featureImage.src"
              alt=""
              width="1310"
              height="873"
            />
          </figure>
          <div
            class="w-full markdown-body py-4"
            v-html="$page.blog.content"
          ></div>
          <div class="py-4">
            <Disqus :identifier="$page.blog.id" />
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
