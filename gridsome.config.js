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
