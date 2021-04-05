<template>
  <Layout>
    <div class="">
      <div
        class="text-center pt-20 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28"
      >
        <h2
          class="text-4xl pb-5 tracking-tight leading-10 font-semibold text-dimmed-text-primary sm:text-5xl sm:leading-none md:text-8xl"
        >
          Big
        </h2>
        <h2
          class="text-4xl tracking-tight leading-10 font-semibold text-dimmed-text-primary sm:text-5xl sm:leading-none md:text-8xl"
        >
          Experiences
        </h2>
      </div>
      <vue-particles
        color="#adbac7"
        :particleOpacity="0.7"
        :particlesNumber="80"
        shapeType="circle"
        :particleSize="4"
        linesColor="#adbac7"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      >
      </vue-particles>
    </div>
  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: "Home"
  }
};
</script>
