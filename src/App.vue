<template>
  <div id="app">
    <v-app>
      <v-app-bar app color="primary" dark>
        <v-btn to="/" text>
          <v-toolbar-title>URLShortener v1</v-toolbar-title>
        </v-btn>
        <v-spacer></v-spacer>

        <!-- Conditionally render the Dashboard and Logout buttons based on login status -->
        <div v-if="isLoggedIn" class="d-flex align-center">
          <!-- Dashboard Button -->
          <v-btn icon @click="goToDashboard">
            <v-icon>mdi-chart-pie</v-icon>
          </v-btn>
          <v-btn text @click="logout">
            <span class="mr-2">Logout</span>
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </div>
        <div v-else>
          <v-btn to="/login" text>
            <span class="mr-2">Login/Signup</span>
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </div>
      </v-app-bar>

      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isLoggedIn: false, // Track login status
    };
  },
  mounted() {
    // Check login status on component mount
    this.isLoggedIn = !!localStorage.getItem("userToken");
  },
  methods: {
    // Navigate to User Dashboard
    goToDashboard() {
      this.$router.push({ name: "UserDashboard" });
    },
    // Logout function
    logout() {
      // Clear localStorage and update login status
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      this.isLoggedIn = false;

      // Redirect to home page
      this.$router.push({ name: "home" });
    },
  },
  watch: {
    $route() {
      // Check login status whenever the route changes
      this.isLoggedIn = !!localStorage.getItem("userToken");
    },
  },
};
</script>

<style scoped lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.v-btn {
  margin-right: 10px;
}
</style>
