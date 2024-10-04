<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1 style="font-size: 40px">How many clicks has your url recieved:</h1>
        <h1 style="font-size: 50px; color: green">{{ clicks }}</h1>
        <p style="font-size: 20px">
          This is a live count of clicks your shortened url will recieve
        </p>
        <v-card-text
          ><b>Shortened url:</b>
          <a target="_blank" :href="generatedURl">{{ generatedURl }}</a>
          <v-btn
            icon
            @click="copyToClipboard(generatedURl)"
            color="orange darken-4"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn></v-card-text
        >

        <v-card-text
          ><b>Long url: </b
          ><a target="_blank" :href="orignalURL">{{ orignalURL }}</a>
          <v-btn
            icon
            @click="copyToClipboard(orignalURL)"
            color="orange darken-4"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn></v-card-text
        >
        <br />
        <v-card class="mx-auto" max-width="400">
          <v-card-title class="white--text orange darken-4">
            Geographic metrics
            <v-spacer></v-spacer>
          </v-card-title>

          <v-card-text class="pt-4">
            You can see who has clicked on your shortended urls and from where
            they have clicked from.
          </v-card-text>

          <v-divider></v-divider>

          <v-virtual-scroll :items="items" :item-height="50" height="300">
            <template v-slot:default="{ item }">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >{{ item.ip }} - {{ item.country }}</v-list-item-title
                  >
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn depressed small>
                    View location
                    <v-icon color="orange darken-4" right>
                      mdi-open-in-new
                    </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "urlCounter",

  data: () => ({
    orignalURL: "",
    generatedURl: "",
    createdBy: "",
    createdAt: "",
    clicks: "0",
    items: [],
    websocket: null,
  }),
  mounted() {
    //incoming data
    let dataFromParams = this.$route.params;
    //setting data
    this.generatedURl = dataFromParams.urlShortenedUrl;
    this.orignalURL = dataFromParams.urlOriginalUrl;
    this.clicks = dataFromParams.urlClickCount;

    // Create a new WebSocket connection
    this.websocket = new WebSocket("ws://localhost:8300/tracking-socket");

    this.websocket.onopen = () => {
      console.log("WebSocket connection opened");

      this.websocket.addEventListener("message", (event) => {
        const data = event.data;
        console.log("Received message:", data);

        // Increment the clicks counter and update the geographic metrics
        this.clicks = data;
        this.addRandomGeoData();
      });
    };

    this.websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  },

  beforeDestroy() {
    // Clean up the WebSocket connection when the component is destroyed
    if (this.websocket) {
      this.websocket.disconnect();
    }
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).catch((error) => {
        console.error("Copy failed!", error);
      });
    },
    // Generates a random IP and country
    generateRandomIP() {
      return `${Math.floor(Math.random() * 255)}.${Math.floor(
        Math.random() * 255
      )}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    },
    generateRandomCountry() {
      const countries = ["US", "CA", "UK", "IN", "DE", "AU", "JP", "FR", "BR"];
      return countries[Math.floor(Math.random() * countries.length)];
    },
    addRandomGeoData() {
      const randomIP = this.generateRandomIP();
      const randomCountry = this.generateRandomCountry();
      const newItem = {
        ip: randomIP,
        country: randomCountry,
        color: "blue",
        initials: randomCountry.charAt(0).toUpperCase(),
      };
      this.items.push(newItem);
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
