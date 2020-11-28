// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const postcssPlugins = [require("tailwindcss"), require("autoprefixer")];

module.exports = {
  siteName: "Akshansh Khare",
  plugins: [
    {
      use: "@gridsome/source-filesystem",
      options: {
        path: "blog/**/*.md",
        typeName: "Blog",
        pathPrefix: "/blog",
        refs: {
          tags: {
            typeName: "Tag",
            create: true
          }
        },
        remark: {
          plugins: [
            [
              "gridsome-plugin-remark-shiki",
              { theme: "material-theme-palenight", skipInline: false }
            ]
          ]
        }
      }
    },
    {
      use: "@gridsome/vue-remark",
      options: {
        index: ["README"],
        baseDir: "./tutorial/laravel-docker",
        pathPrefix: "/tutorial/laravel-docker",
        typeName: "LaravelDocker",
        template: "./src/templates/LaravelDockerPage.vue",
        plugins: [
          "@gridsome/remark-prismjs",
          [
            "gridsome-plugin-remark-shiki",
            { theme: "material-theme-palenight", skipInline: false }
          ]
        ],
        remark: {
          autolinkHeadings: {
            content: {
              type: "text",
              value: "#"
            }
          }
        }
      }
    }
  ],
  css: {
    loaderOptions: {
      postcss: {
        plugins: postcssPlugins
      }
    }
  }
};
