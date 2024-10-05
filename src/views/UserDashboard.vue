<template>
  <v-container>
    <!-- Main Heading and Welcome Message -->
    <v-row>
      <v-col cols="12">
        <h1 class="page-title">User Dashboard</h1>
        <p>
          Welcome back {{ user.firstName }}! Here you can see all your shortened
          URLs:
        </p>
      </v-col>
    </v-row>

    <!-- Shortened URLs Section and User Information on the Same Row -->
    <v-row class="main-row">
      <!-- Shortened URLs Section on the Left -->
      <v-col cols="7">
        <v-card class="url-list-card transparent-card" elevation="2">
          <v-card-title class="sticky-title">Shortened URLs</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list v-if="shortenedUrls.length > 0">
              <v-list-item
                v-for="url in shortenedUrls"
                :key="url.id"
                class="url-item"
              >
                <v-list-item-content>
                  <p class="url-label">
                    <strong>Shortened URL:</strong>
                    <a :href="url.shortenedUrl" target="_blank">{{
                      url.shortenedUrl
                    }}</a>
                  </p>
                  <p class="url-label">
                    <strong>Original URL:</strong>
                    <a :href="url.originalUrl" target="_blank">{{
                      url.originalUrl
                    }}</a>
                  </p>
                  <p class="url-label">
                    <strong>Clicks:</strong> {{ url.clickCount }}
                  </p>
                  <p class="url-label">
                    <strong>Created At:</strong> {{ formatDate(url.createdAt) }}
                  </p>
                </v-list-item-content>

                <!-- Buttons for URL actions -->
                <v-list-item-action>
                  <!-- Redirect to URL count page -->
                  <v-btn
                    small
                    color="primary"
                    @click="goToUrlCountPage(url)"
                    title="View URL Count Page"
                  >
                    <v-icon left>mdi-chart-line</v-icon>
                    View Count
                  </v-btn>

                  <!-- Open URL in new tab -->
                  <v-btn
                    small
                    color="secondary"
                    @click="openUrlInNewTab(url.shortenedUrl)"
                    title="Open URL in New Tab"
                  >
                    <v-icon left>mdi-open-in-new</v-icon>
                    Open URL
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <p v-else>No URLs shortened yet!</p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Column containing User Info and Account Profit Share -->
      <v-col cols="5">
        <!-- User Information Box on the Top -->
        <v-card class="user-info-card transparent-card" elevation="4">
          <v-card-title class="headline">User Information</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <p><b>Name:</b> {{ user.firstName }} {{ user.lastName }}</p>
            <p><b>Email Address:</b> {{ user.emailAddress }}</p>
            <p><b>Account Type:</b> {{ user.accountType }}</p>
            <p>
              <b>Account Created At:</b> {{ formatDate(user.accountCreatedAt) }}
            </p>
            <p>You have shortened {{ shortenedUrls.length }} url</p>
          </v-card-text>
        </v-card>

        <!-- New Account Profit Share Per Clicks Card -->
        <v-card class="account-profit-card transparent-card" elevation="4">
          <v-card-title class="headline"
            >Account Profit Share Per Clicks</v-card-title
          >
          <v-divider></v-divider>
          <v-card-text>
            <p><b>Total Clicks:</b> {{ getTotalClicks() }}</p>
            <p><b>Profit Per Click:</b> $0.05</p>
            <p
              :class="{
                'green-earnings': parseFloat(getTotalEarnings()) >= 0.05,
              }"
            >
              <b>Total Earnings:</b> ${{ getTotalEarnings() }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- New Row for Click Distribution Chart -->
    <v-row>
      <v-col cols="7">
        <!-- Set column width to align with URL list -->
        <ClickDistributionChart :urlData="shortenedUrls" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import ClickDistributionChart from "./ClickDistributionChart.vue";

export default {
  data() {
    return {
      user: {}, // Object to store the logged-in user information
      shortenedUrls: [], // Array to store the user's shortened URLs
    };
  },
  components: {
    ClickDistributionChart, // Register the chart component
  },
  mounted() {
    // Fetch user information from localStorage
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      this.user = JSON.parse(storedUserInfo);
    }

    // Fetch the user's shortened URLs here (replace with your actual API endpoint)
    axios
      .get("http://localhost:8300/user/urls", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Pass the token in the request headers
        },
      })
      .then((response) => {
        this.shortenedUrls = response.data;
      })
      .catch((error) => {
        console.error("Failed to load URLs:", error);
      });
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    getTotalClicks() {
      return this.shortenedUrls.reduce(
        (total, url) => total + url.clickCount,
        0
      );
    },
    getTotalEarnings() {
      const totalClicks = this.getTotalClicks();
      const profitPerClick = 0.05; // You can adjust the profit value as needed
      return (totalClicks * profitPerClick).toFixed(2);
    },
    // Method to navigate to the URL count page
    goToUrlCountPage(url) {
      const token = localStorage.getItem("userToken"); // Fetch the token from localStorage or sessionStorage
      axios
        .post(
          "http://localhost:8300/tracking",
          {
            shortenedUrl: url.shortenedUrl, // Pass the shortened URL
          },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}, // Add header if token is present
          }
        )
        .then((response) => {
          // Redirect to urlcounter route with the relevant parameters
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
        .catch((error) => {
          console.error("Failed to track URL: ", error);

          if (error.response && error.response.status === 401) {
            // Redirect to login page if unauthorized
            this.$router.push({ name: "login" });
          } else {
            alert(
              "You do not have access to track this URL or it doesn't exist."
            );
          }
        });
    },
    // Method to open URL in a new tab
    openUrlInNewTab(shortenedUrl) {
      const formattedUrl = this.formatUrl(shortenedUrl);
      window.open(formattedUrl, "_blank");
    },
    forceRedirect(shortenedUrl) {
      // Use window.location.href for forced redirection
      const formattedUrl = this.formatUrl(shortenedUrl);
      window.location.href = formattedUrl;
    },
    formatUrl(url) {
      // Ensure the URL includes http:// or https:// prefix
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return `http://${url}`;
      }
      return url;
    },
  },
};
</script>

<style scoped>
/* Container Styles */
.v-container {
  padding-top: 30px;
}

/* Fixed page title styles */
.page-title {
  margin-bottom: 20px;
}

/* Styles for URL List Card */
.url-list-card {
  padding: 0 20px;
  max-height: 600px; /* Set a fixed height for scrolling */
  overflow-y: auto; /* Enable vertical scrolling */
  position: relative;
  backdrop-filter: blur(10px); /* Add blur effect to the background */
}

/* Transparent background for cards */
.transparent-card {
  background-color: rgba(255, 255, 255, 0.5); /* 50% transparency */
}

/* Sticky title inside the URL List Card */
.sticky-title {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.8); /* Match the transparency of the card */
  padding: 15px 0;
  z-index: 10;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for clarity */
}

/* URL item styles */
.url-item {
  margin: 15px 0;
  padding: 15px;
  background: rgba(232, 244, 253, 0.7); /* Light blue with some transparency */
  border-radius: 8px;
  border-left: 4px solid #0d47a1; /* Blue accent */
}

/* URL label styles */
.url-label {
  font-size: 16px;
  margin-bottom: 5px;
}

/* User Information Card */
.user-info-card {
  padding: 20px;
  backdrop-filter: blur(10px); /* Add blur effect */
  border-radius: 8px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  height: auto; /* Adjust height as needed */
}

/* Account Profit Card */
.account-profit-card {
  padding: 20px;
  margin-top: 15px; /* Spacing between user info and account profit card */
  backdrop-filter: blur(10px); /* Add blur effect */
  border-radius: 8px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}

/* Chart Card */
.chart-card {
  max-width: 100%; /* Adjust to take full width of the container */
  max-height: 600px; /* Limit height for better visualization */
  backdrop-filter: blur(10px); /* Add blur effect */
  border-radius: 8px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}

/* Adjust Chart Size */
.chart-container {
  width: 100%; /* Take full width of the column */
  height: 300px; /* Set a fixed height for the chart */
}

/* Green earnings text for profits */
.green-earnings {
  color: #4caf50; /* Green color for positive earnings */
}

/* Link styles */
a {
  color: #1e88e5;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Card Title Styles */
.v-card-title {
  padding-bottom: 10px;
  font-weight: 300; /* Reduced weight for softer look */
  font-size: 18px;
  color: #37474f;
}

/* Global Text Styling */
h1 {
  margin-bottom: 10px;
  font-size: 26px;
}

p {
  font-size: 18px;
}

/* Ensure the title remains fixed */
.main-row {
  margin-top: 20px;
  display: flex;
}
</style>
