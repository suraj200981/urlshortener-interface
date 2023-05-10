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
          <a target="_blank" :href="generatedURl">{{
            generatedURl
          }}</a></v-card-text
        >
        <v-card-text
          ><b>Long url: </b
          ><a target="_blank" :href="orignalURL">{{
            orignalURL
          }}</a></v-card-text
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
                <v-list-item-avatar>
                  <v-avatar :color="item.color" size="56" class="white--text">
                    <!-- {{ item.initials }} -->
                  </v-avatar>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ item }}</v-list-item-title>
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
import axios from "axios";

export default {
  name: "urlCounter",

  data: () => ({
    orignalURL: "",
    generatedURl: "",
    createdBy: "",
    createdAt: "",
    clicks: "0",
    items: [],
  }),
  mounted() {
    //incoming data
    let dataFromParams = this.$route.params;
    console.log(dataFromParams, "this is what i got");
    //setting data
    this.generatedURl = dataFromParams.urlShortenedUrl;

    this.orignalURL = dataFromParams.urlOriginalUrl;

    this.clicks = dataFromParams.urlClickCount;
    //substring generatedURl to only include the generted code
    //make get request every 10 seconds to end point to get all url information
    console.log(window.location.href, " wow");
    if (window.location.href == "http://localhost:8080/urlcounter") {
      var startTimer = setInterval(() => {
        //only refresh if the brower url is http://localhost:8080/urlcounter
        let data = { shortenedUrl: this.generatedURl };

        axios
          .post("http://localhost:8300/tracking", data)
          .then((response) => {
            this.generatedURl = response.data.shortenedUrl;
            this.orignalURL = response.data.originalUrl;
            this.clicks = response.data.clickCount;
          })
          .catch((error) => {
            console.error(error);
          });
      }, 3000);
    } else {
      clearInterval(startTimer);
    }
  },
};
// let dataOnPage = {oldUrl : response.data.old_url, newUrl : response.data.short_url, createdBy: response.data.createdBy, clicks: response.data.clicks, ip: response.data.ip};
// //clear shorted url from local storageon each request to ensure it is up to date
// localStorage.clear("generatedURl");

// //set local storage
// localStorage.setItem("generatedURl", "http://"+dataOnPage.newUrl);
// //set data to variables
// this.orignalURL = dataOnPage.oldUrl;
// this.generatedURl = "http://"+dataOnPage.newUrl;
// this.createdBy = dataOnPage.createdBy;
// //
// localStorage.setItem("items", JSON.stringify(dataOnPage.ip));
// localStorage.setItem("clicks", dataOnPage.clicks);
// localStorage.setItem("originalURL", dataOnPage.oldUrl);

// //check if this.clicks is updated compared to local storage
// if(this.clicks != localStorage.getItem("clicks")){
//   this.clicks = localStorage.getItem("clicks");
//    //loop through data.ip and push to items array
//     for(var i = 0; i < data.ip.length; i++){
//       this.items.push(data.ip[i]);
//       this.items = JSON.parse(localStorage.getItem("items"));
// }
// }
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
