<template>
  <Layout>
    <div class="relative px-4 sm:px-6 py-12 lg:px-8">
      <div class="relative max-w-7xl mx-auto">
        <div class="text-lg max-w-prose mx-auto mb-6">
          <h2
            class="text-3xl leading-9 text-center tracking-tight font-extrabold text-dimmed-text-primary sm:text-4xl sm:leading-10"
          >
            About Me
          </h2>
        </div>
        <div class="flex flex-wrap items-center -mx-5 overflow-hidden">
          <div class="my-5 px-5 w-full md:w-1/3 overflow-hidden">
            <g-image
              src="~/assets/images/about.jpg"
              class="w-full rounded-lg"
            />
          </div>
          <div class="my-5 px-5 w-full md:w-2/3 overflow-hidden">
            <div class="prose prose-xl mx-auto text-dimmed-text-primary">
              <p>
                Hi There! Hola!
              </p>
              <div class="flex">
                <g-image
                  src="~/assets/images/in.png"
                  class="mt-0 mb-0 pr-2 w-8"
                />
                <g-image
                  src="~/assets/images/it.png"
                  class="mt-0 mb-0 pr-2 w-8"
                />
                <g-image
                  src="~/assets/images/us.png"
                  class="mt-0 mb-0 pr-2 w-8"
                />
                <g-image
                  src="~/assets/images/dr.png"
                  class="mt-0 mb-0 pr-2 w-8"
                />
                <g-image
                  src="~/assets/images/ca.png"
                  class="mt-0 mb-0 pr-2 w-8"
                />
              </div>
              <p>
                I am a Laravel Developer who specializes in Backend Service
                Development and API development. I design and develop websites
                and modern backend applications. I have a passion for web
                standards and solving interesting problems. I also do DevOps
                work here and there.
              </p>
              <p>
                I am a big fan of Shred Life. Although I cannot cook I can blend
                a mean protein shake. I love spending the weekend outside
                exploring the area, playing sports, and harassing my dog. (He
                secretly loves it, of course.). I enjoy working on JavaScript
                applications, car MODs, and drinking beer.
              </p>
              <p>
                I am also into ink. Got the right sleeve done, left half sleeve
                and multiple big ones on my back, sides, and calves which
                include Polynesian, Japanese, Tribal, some Blackwork, Aztez,
                Sanskrit Script.
              </p>
              <p>
                Motivating people to be the best versions of themselves is what
                I love waking up to do everyday.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: "About"
  }
};
</script>
