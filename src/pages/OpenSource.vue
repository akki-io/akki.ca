<template>
  <Layout>
    <div class="relative px-4 sm:px-6 py-12 lg:px-8">
      <div class="relative max-w-7xl mx-auto">
        <div class="text-lg max-w-prose mx-auto mb-6">
          <h2
            class="text-3xl leading-9 text-center tracking-tight font-extrabold text-dimmed-text-primary sm:text-4xl sm:leading-10"
          >
            Open source packages
          </h2>
        </div>
        <div class="prose prose-xl mx-auto text-dimmed-text-primary">
          <p>
            I have been using many open-source packages throughout my coding
            career, and it's about time to give back to the community. I have
            started contributing more to the open-source. Below are some of the
            projects; rest assured more is to come.
          </p>
        </div>
        <div class="overflow-hidden mt-8">
          <ul class="divide-y divide-dimmed-border-primary">
            <li v-for="project in projects">
              <div class="block hover:bg-dimmed-bg-secondary">
                <div class="px-0 py-4 sm:px-6">
                  <div class="md:flex items-center">
                    <div class="md:flex md:flex-col w-full md:w-2/3">
                      <a
                        :href="project.html_url"
                        target="_blank"
                        class="text-dimmed-text-link"
                      >
                        {{ project.name }}
                      </a>
                      <p class="text-dimmed-text-secondary mt-2">
                        {{ project.description }}
                      </p>
                      <p class="text-dimmed-text-secondary mt-2">
                        <span
                          class="inline-block relative w-3 h-3 bg-dimmed-bg-tertiary box-border rounded-full"
                        ></span>
                        <span class="font-bold">
                          {{ project.language }}
                        </span>
                      </p>
                    </div>
                    <div
                      class="md:flex md:flex-col md:justify-end md:text-right w-full md:w-1/3"
                    >
                      <div class="flex md:justify-end md:mt-0 mt-2">
                        <p class="text-dimmed-text-secondary pr-3">
                          <svg
                            aria-label="star"
                            class="inline-block text-dimmed-bg-tertiary"
                            viewBox="0 0 20 20"
                            version="1.1"
                            width="20"
                            height="20"
                            role="img"
                            style="fill: currentcolor; overflow-wrap: break-word;"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
                              class="text-left box-border"
                              style="overflow-wrap: break-word;"
                            ></path>
                          </svg>
                          {{ project.stargazers_count }}
                        </p>
                        <p class="text-dimmed-text-secondary pr-3">
                          <svg
                            aria-label="fork"
                            class="inline-block text-dimmed-bg-tertiary"
                            viewBox="0 0 20 20"
                            version="1.1"
                            width="20"
                            height="20"
                            role="img"
                            style="fill: currentcolor; overflow-wrap: break-word;"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
                              class="text-left box-border"
                              style="overflow-wrap: break-word;"
                            ></path>
                          </svg>
                          {{ project.forks }}
                        </p>
                        <p class="text-dimmed-text-secondary">
                          <svg
                            aria-label="issues"
                            class="inline-block text-dimmed-bg-tertiary"
                            viewBox="0 0 20 20"
                            version="1.1"
                            width="20"
                            height="20"
                            role="img"
                            style="fill: currentcolor; overflow-wrap: break-word;"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"
                              class="text-center text-gray-600 box-border"
                              style="list-style: outside none none; overflow-wrap: break-word;"
                            ></path>
                          </svg>
                          {{ project.open_issues }}
                        </p>
                      </div>
                      <p class="text-dimmed-text-secondary mt-2">
                        <vue-moments-ago
                          prefix="Updated"
                          suffix="ago"
                          :date="project.pushed_at"
                          lang="en"
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import axios from "axios";
import VueMomentsAgo from "vue-moments-ago";

export default {
  metaInfo: {
    title: "Open Source"
  },
  components: {
    VueMomentsAgo
  },
  data() {
    return {
      uri: [
        "akki-io/laravel-nova-search",
        "akki-io/laravel-docker",
        "akki-io/serverless-website-monitoring",
        "akki-io/cheat-day-tracker",
        "akki-io/akki.ca",
        "akki-io/vote-donut"
      ],
      projects: []
    };
  },
  async mounted() {
    try {
      for (const item of this.uri) {
        const results = await axios.get("https://api.github.com/repos/" + item);
        this.projects.push(results.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
};
</script>
