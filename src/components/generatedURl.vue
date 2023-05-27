<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12"> </v-col>

      <v-col class="mb-4">
        <h1
          class="display-2 font-weight-bold"
          style="text-align: left; padding-left: 170px"
        >
          Your shortened URL
        </h1>

        <p
          class="subheading font-weight-regular"
          style="text-align: left; padding-left: 170px"
        >
          Copy the shortened link and share it in messages, texts, posts,
          websites and other locations.
        </p>
        <v-card class="mx-auto" max-width="800" height="300">
          <v-form @submit.prevent="requestGet()">
            <v-card-text>
              <br />
              <v-row class="mx-auto">
                <v-col md="9">
                  <v-text-field
                    disabled
                    solo
                    v-model="this.generatedURl"
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
                    @click="copyUrl()"
                    >Copy url
                  </v-btn>
                </v-col>
              </v-row>

              <p style="text-align: left; padding-left: 20px">
                Long URL: <a href="url">http://{{ orignalURL }}</a>
              </p>
              <p style="text-align: left; padding-left: 20px">
                Track the
                <button
                  style="text-decoration: underline; color: blue"
                  @click="requestGet()"
                >
                  total of clicks
                </button>
                in real-time from your shortened URL.<br />
                Create other <router-link to="/">shortened URL.</router-link>
              </p>
              <p
                v-if="!isAuthenticated"
                style="text-align: left; padding-left: 20px"
              >
                To manage your shortended urls, please
                <router-link to="/login">login</router-link>
              </p>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">Technologies Used</h2>
        <v-row justify="center">
          <a
            v-for="(eco, i) in ecosystem"
            :key="i"
            :href="eco.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ eco.text }}
          </a>
        </v-row>
        <p style="padding-top: 20px">-----MEVN Stack-----</p>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  name: "generatedURl",

  data: () => ({
    ecosystem: [
      {
        text: "MongoDB",
        href: "https://github.com/vuetifyjs/MongoDB",
      },
      {
        text: "Express",
        href: "https://github.com/vuetifyjs/vuetify/Express",
      },
      {
        text: "VueJS",
        href: "https://github.com/vuetifyjs/awesome-vuetify/VueJS",
      },
      {
        text: "NodeJS",
        href: "https://github.com/vuetifyjs/awesome-vuetify/NodeJS",
      },
    ],
    orignalURL: "",
    generatedURl: "",
    isAuthenticated: false,
  }),
  methods: {
    copyUrl() {
      navigator.clipboard.writeText(this.generatedURl);
    },
    requestGet() {
      let data = { shortenedUrl: this.generatedURl.toString() };

      axios
        .post("http://localhost:8300/tracking", data)
        .then((response) => {
          this.$router.push({
            name: "urlcounter",
            params: {
              urlId: response.data.id,
              urlOriginalUrl: response.data.originalUrl,
              urlPrefix: response.data.prefix,
              urlClickCount: response.data.clickCount,
              urlCreatedAt: response.data.createdAt,
              urlShortenedUrl: response.data.shortenedUrl,
            },
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    let data = this.$route.params;
    this.orignalURL = data.originalUrl;
    this.generatedURl = data.generatedURl;
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
