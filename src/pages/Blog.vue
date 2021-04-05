<template>
  <Layout>
    <div class="relative px-4 sm:px-6 py-12 lg:px-8">
      <div class="relative max-w-7xl mx-auto">
        <div class="text-center">
          <h2
            class="text-3xl leading-9 tracking-tight font-extrabold text-dimmed-text-primary sm:text-4xl sm:leading-10"
          >
            From the blog
          </h2>
          <p
            class="mt-3 max-w-2xl mx-auto text-xl leading-7 text-dimmed-text-secondary sm:mt-4"
          >
            How-Tos, Deep-Dives, Brain-Dumps, and More
          </p>
        </div>
        <div
          class="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none"
        >
          <div
            class="flex flex-col rounded overflow-hidden border border-dimmed-border-primary hover:bg-dimmed-bg-tertiary"
            v-for="(post, index) in $page.blogs.edges"
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
              <div class="flex-1 p-6 flex flex-col justify-between">
                <div class="flex-1">
                  <p
                    class="text-sm leading-5 font-medium text-dimmed-text-secondary"
                  >
                    <span v-for="tag in post.node.tags">{{ tag.title }}, </span>
                    <span>BLOG</span>
                  </p>

                  <h3
                    class="mt-2 text-xl leading-7 font-semibold text-dimmed-text-primary"
                  >
                    {{ post.node.title }}
                  </h3>
                  <p
                    class="mt-3 text-base leading-6 text-dimmed-text-secondary"
                    v-summarytext
                    v-html="post.node.content"
                  ></p>
                </div>
                <div class="mt-6 flex items-center">
                  <div class="">
                    <div
                      class="flex text-sm leading-5 text-dimmed-text-secondary"
                    >
                      <span> {{ post.node.timeToRead }} min read </span>
                    </div>
                  </div>
                </div>
              </div>
            </g-link>
          </div>
        </div>
        <div class="py-6">
          <pagination-posts
            v-if="$page.blogs.pageInfo.totalPages > 1"
            base="/blog"
            :totalPages="$page.blogs.pageInfo.totalPages"
            :currentPage="$page.blogs.pageInfo.currentPage"
          />
        </div>
      </div>
    </div>
  </Layout>
</template>

<page-query>
query Blogs ($page: Int) {
  blogs: allBlog (sortBy: "date", order: DESC, perPage: 6, page: $page) @paginate {
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
import PaginationPosts from "../components/Pagination";

export default {
  components: {
    PaginationPosts
  },
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
