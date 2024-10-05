<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12"> </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">Welcome to URLMini</h1>

        <p class="subheading font-weight-regular">
          This project was created by
          <a target="_blank" href="https://github.com/suraj200981"
            >Suraj Sharma</a
          >
          <br />
          The aim of this project is to minify long URLS and make them shorter.
        </p>
        <br />
        <v-card class="mx-auto" max-width="800" height="280">
          <!-- <router-link to="/mini">mini</router-link> -->
          <v-form @submit="onSubmit" method="POST">
            <v-card-text>
              <h1 style="color: black; padding-bottom: 8px">
                Paste the URL to be shortened
              </h1>
              <br />
              <v-row>
                <v-col md="9">
                  <v-text-field
                    placeholder="Enter the link here"
                    solo
                    v-model="url"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-btn
                    color="accent"
                    depressed
                    elevation="2"
                    large
                    raised
                    text
                    tile
                    type="submit"
                    >Shorten URL
                  </v-btn>
                </v-col>
              </v-row>

              <p>
                <b>URLMini.io</b> is a free tool to shorten a URL or reduce a
                link<br />
                Use my URL Shortener to create a shortened link making it easy
                to remember
              </p>
              <v-btn color="primary" class="mt-4" @click="showModal = true">
                Track Previously Shortened URLs
              </v-btn>
              <ErrorModal ref="errorModal" :errorMessage="errorMessage" />

              <!-- Modal Dialog for Tracking URL -->
              <v-dialog v-model="showModal" max-width="500">
                <v-card>
                  <v-card-title class="headline"
                    >Enter Shortened URL</v-card-title
                  >
                  <v-card-text>
                    <v-form @submit.prevent="trackUrl">
                      <v-text-field
                        label="Shortened URL"
                        v-model="trackUrlInput"
                        required
                      ></v-text-field>
                      <v-btn type="submit" color="primary">Track URL</v-btn>
                      <v-btn color="red" @click="showModal = false"
                        >Cancel</v-btn
                      >
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-dialog>
              <v-row> </v-row>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">Activity Feed</h2>
        <v-row justify="center">
          <ul>
            <li v-for="activity in activities" :key="activity.id">
              {{ activity.firstName }} {{ activity.action }}
              {{ timeSince(activity.createdAt) }} ago
            </li>
          </ul>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import ErrorModal from "./ErrorModal.vue";

export default {
  name: "homePage",
  components: { ErrorModal },

  data: () => ({
    url: "",
    showModal: false,
    trackUrlInput: "",
    errorMessage: "",
    activities: [],
  }),
  mounted() {
    // Fetch recent activities when the component is mounted
    axios.get("http://localhost:8100/activities").then((response) => {
      console.log("found it bitch", response.data);
      this.activities = response.data;
    });
  },
  methods: {
    timeSince(date) {
      const now = new Date();
      const activityDate = new Date(date);
      const diffInMinutes = Math.floor((now - activityDate) / 60000);

      if (diffInMinutes < 60) return `${diffInMinutes} mins`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} hours`;
    },
    onSubmit(e) {
      e.preventDefault();
      let data = { url: this.url };

      // Get the user's token from localStorage if logged in
      const userToken = localStorage.getItem("userToken");

      // Set up headers, include Authorization if a user is logged in
      const headers = userToken ? { Authorization: `Bearer ${userToken}` } : {};

      axios
        .post("http://localhost:8000/validation", data, { headers })
        .then((response) => {
          this.$router.push({
            name: "mini",
            params: {
              generatedURl: response.data.substring(15),
              originalUrl: data.url,
            },
          });
        })
        .catch((error) => {
          if (error.code === "ERR_BAD_REQUEST") {
            console.log("error found: ", error.message);
          }
        });
    },

    trackUrl() {
      // Retrieve the JWT token from local storage
      const token = localStorage.getItem("userToken");

      axios
        .post(
          "http://localhost:8300/tracking",
          {
            shortenedUrl: this.trackUrlInput,
          },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}, // Only add header if token is present
          }
        )
        .then((response) => {
          this.$router.push({
            name: "urlcounter",
            params: {
              urlOriginalUrl: response.data.originalUrl,
              urlPrefix: response.data.prefix,
              urlClickCount: response.data.clickCount,
              urlCreatedAt: response.data.createdAt,
              urlShortenedUrl: response.data.shortenedUrl,
            },
          });
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            this.errorMessage = err.response?.data;
            this.$refs.errorModal.openModal();
            // Redirect to login page if unauthorized
            this.$router.push({ name: "login" });
          } else {
            this.errorMessage =
              "You do not have access to track this URL or it doesn't exist.";

            this.$refs.errorModal.openModal();
          }
        });
    },
  },
};
</script>

<style scoped lang="scss">
.v-btn:not(.v-btn--round).v-size--large {
  background-color: #1976d2;
}

.v-application .accent--text {
  color: #ffffff !important;
  caret-color: #82b1ff !important;
}
.v-btn:not(.v-btn--round).v-size--large {
  height: 50px;
  min-width: 78px;
  padding: 0 19.5555555556px;
}
</style>
