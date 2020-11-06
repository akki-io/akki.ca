<template>
  <Layout>
    <div class="relative px-4 sm:px-6 py-12 lg:px-8">
      <div class="relative max-w-7xl mx-auto">
        <div class="text-center">
          <h2
            class="text-3xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-4xl sm:leading-10"
          >
            From the blog
          </h2>
          <p
            class="mt-3 max-w-2xl mx-auto text-xl leading-7 text-gray-500 sm:mt-4"
          >
            How-Tos, Deep-Dives, Brain-Dumps, and More
          </p>
        </div>
        <div
          class="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none"
        >
          <div
            class="flex flex-col rounded shadow overflow-hidden"
            v-for="(post, index) in $page.posts.edges"
            :key="post.id"
            :post="post"
            :index="index"
          >
            <g-link :to="post.node.path" class="block">
              <div class="flex-shrink-0">
                <g-image
                  :src="post.node.featureImage.src"
                  class="h-48 w-full object-cover"
                />
              </div>
              <div class="flex-1 bg-white p-6 flex flex-col justify-between">
                <div class="flex-1">
                  <p class="text-sm leading-5 font-medium text-indigo-600">
                    <span v-for="tag in post.node.tags">{{ tag.title }}, </span>
                    <span>BLOG</span>
                  </p>

                  <h3
                    class="mt-2 text-xl leading-7 font-semibold text-gray-900"
                  >
                    {{ post.node.title }}
                  </h3>
                  <p
                    class="mt-3 text-base leading-6 text-gray-500"
                    v-summarytext
                    v-html="post.node.content"
                  ></p>
                </div>
                <div class="mt-6 flex items-center">
                  <div class="">
                    <div class="flex text-sm leading-5 text-gray-500">
                      <span> {{ post.node.timeToRead }} min read </span>
                    </div>
                  </div>
                </div>
              </div>
            </g-link>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<page-query>
query Blogs ($page: Int) {
  posts: allBlog (sortBy: "date", order: DESC, perPage: 6, page: $page) @paginate {
    totalCount
    pageInfo {
      totalPages
      currentPage
    }
    edges {
      node {
        id
        title
        path
        tags {
          title
        }
        featureImage
        content
        timeToRead
      }
    }
  }
}
</page-query>

<script>
export default {
  metaInfo: {
    title: "Blog"
  },
  props: ["post", "index"],
  directives: {
    summarytext: function(el) {
      el.innerHTML =
        el.innerText.replace(/<[^>]*>?/gm, "").substring(0, 350) + "...";
    }
  }
};
</script>
