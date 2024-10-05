<template>
  <div class="redirect-container">
    <v-progress-linear
      height="7"
      indeterminate
      color="cyan"
    ></v-progress-linear>
    <h1>Redirecting to your link...</h1>
    <br />
    <br />

    <!-- Fake Google Ad 1 -->
    <div class="fake-adsense-ad">
      <h2 class="ad-label">Advertisement</h2>
      <div class="ad-content">
        <img
          class="ad-image"
          src="https://media.smallbiztrends.com/2022/08/xx-halloween-ads-to-inspire-your-own.png"
          alt="Fake Google Ad"
        />
        <div class="ad-text">
          <h3>Find the Best Deals Online!</h3>
          <p>
            Visit our site to find the best discounts and offers. Click here to
            learn more.
          </p>
          <a href="#" class="ad-cta">Learn More</a>
        </div>
      </div>
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

    <!-- Fake Google Ad 2 -->
    <div class="fake-adsense-ad">
      <h2 class="ad-label">Sponsored Content</h2>
      <div class="ad-content">
        <img
          class="ad-image"
          src="https://as1.ftcdn.net/v2/jpg/04/55/90/14/1000_F_455901448_VlCVdPmFCTBDMXPtZwKZxc44YmmC0eAs.jpg"
          alt="Fake Google Ad"
        />
        <div class="ad-text">
          <h3>Exclusive Offer Just for You!</h3>
          <p>
            Don't miss out on this limited-time deal. Save big on our products
            by clicking here now.
          </p>
          <a href="#" class="ad-cta">Shop Now</a>
        </div>
      </div>
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
    // Set up redirection logic
    this.interval = setInterval(() => {
      if (this.value === 100) {
        window.location.replace(this.$cookies.get("originalUrl"));
        this.value = 0;
      } else {
        this.value += 10;
      }
    }, 800);
  },
};
</script>

<style scoped>
/* Container to center the ads and content */
.redirect-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Styles for the fake ads */
.fake-adsense-ad {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 20px 0;
  text-align: center;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 70%; /* Set the width of the ad */
}

/* Center the ad content within the ad container */
.ad-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Ad Image */
.ad-image {
  width: 200px;
  height: auto;
  margin-right: 15px;
}

/* Ad Text Container */
.ad-text {
  text-align: left;
}

/* Ad Headline */
.ad-text h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #333;
}

/* Ad Description */
.ad-text p {
  font-size: 14px;
  color: #666;
  margin: 5px 0 10px;
}

/* Ad Call-to-Action Button */
.ad-cta {
  display: inline-block;
  padding: 8px 15px;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
}

.ad-cta:hover {
  background-color: #388e3c;
}

/* Adjust circular progress indicator styles */
.v-progress-circular {
  margin: 20px 0;
}

/* Align text in the ad label to the center */
.ad-label {
  text-align: center;
}
</style>
