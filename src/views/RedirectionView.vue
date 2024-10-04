<template>
  <div>
    <v-progress-linear
      height="7"
      indeterminate
      color="cyan"
    ></v-progress-linear>
    <h1>Redirecting to your link...</h1>
    <br />
    <br />
    <!-- Fake Ad Section 1 -->
    <div class="fake-ad fake-ad-top">
      <h2>Advertisement</h2>
      <img
        src="https://via.placeholder.com/728x90?text=Your+Ad+Here"
        alt="Ad"
      />
      <p>Click here for amazing deals!</p>
    </div>

    <!-- Circular Progress Indicator -->
    <v-progress-circular
      :rotate="-90"
      :size="400"
      :width="20"
      :value="value"
      color="primary"
    >
      {{ value }}
    </v-progress-circular>
    <br />

    <!-- Fake Ad Section 2 -->
    <div class="fake-ad fake-ad-bottom">
      <h2>Sponsored Content</h2>
      <img src="https://via.placeholder.com/300x250?text=Click+Now" alt="Ad" />
      <p>Don't miss out on this limited offer!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RedirectionView",
  data: () => ({
    interval: {},
    value: 0,
  }),

  beforeDestroy() {
    clearInterval(this.interval);
  },
  mounted() {
    this.interval = setInterval(() => {
      if (this.value === 100) {
        return (
          window.location.replace(this.$cookies.get("originalUrl")),
          (this.value = 0)
        );
      }
      this.value += 10;
    }, 800);
  },
};
</script>

<style scoped>
.fake-ad {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 20px 0;
  text-align: center;
}

.fake-ad h2 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.fake-ad img {
  width: 100%;
  max-width: 728px;
  height: auto;
  margin-bottom: 10px;
}

.fake-ad p {
  font-size: 1em;
  color: #333;
}

.fake-ad-top {
  background-color: #f9f9f9;
}

.fake-ad-bottom {
  background-color: #f1f1f1;
}
</style>
