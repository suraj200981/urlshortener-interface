<template>
  <v-container>
    <!-- Main Heading and Welcome Message -->
    <v-row>
      <v-col cols="12">
        <h1>User Dashboard</h1>
        <p>
          Welcome back {{ user.firstName }}! Here you can see all your shortened
          URLs:
        </p>
      </v-col>
    </v-row>

    <!-- Shortened URLs and User Information on the Same Row -->
    <v-row>
      <!-- Shortened URLs Section on the Left -->
      <v-col cols="8">
        <v-card class="url-list-card" elevation="2">
          <v-card-title>Shortened URLs</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list v-if="shortenedUrls.length > 0">
              <v-list-item v-for="url in shortenedUrls" :key="url.id">
                <v-list-item-content>
                  <v-list-item-title>{{ url.shortenedUrl }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    url.originalUrl
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <p v-else>No URLs shortened yet!</p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- User Information Box on the Right -->
      <v-col cols="4">
        <v-card class="user-info-card" elevation="4">
          <v-card-title class="headline">User Information</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <p><b>Name:</b> {{ user.firstName }} {{ user.lastName }}</p>
            <p><b>Email Address:</b> {{ user.emailAddress }}</p>
            <p><b>Account Type:</b> {{ user.accountType }}</p>
            <p>
              <b>Account Created At:</b> {{ formatDate(user.accountCreatedAt) }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {}, // Object to store the logged-in user information
      shortenedUrls: [], // Array to store the user's shortened URLs
    };
  },
  mounted() {
    // Fetch user information from localStorage
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      this.user = JSON.parse(storedUserInfo);
    }

    // Fetch the user's shortened URLs here (replace with your actual API endpoint)
    axios
      .get("http://localhost:9120/user-urls", {
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
  },
};
</script>

<style scoped>
/* Container Styles */
.v-container {
  padding-top: 30px;
}

/* Styles for URL List Card */
.url-list-card {
  padding: 20px;
  max-height: 500px; /* Set a fixed height for scrolling */
  overflow-y: auto; /* Enable vertical scrolling */
}

/* Styles for User Information Card */
.user-info-card {
  background: linear-gradient(135deg, #f6f8fc, #e0e7ff);
  border-radius: 10px;
  padding: 20px;
}

.user-info-card .headline {
  font-weight: 600;
  color: #4a4a4a;
}

.user-info-card p {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

/* Card Title Styles */
.v-card-title {
  padding-bottom: 10px;
}

/* Global Text Styling */
h1 {
  margin-bottom: 10px;
}

p {
  font-size: 18px;
}
</style>
