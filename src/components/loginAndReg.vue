<template>
  <v-row class="text-center">
    <v-col cols="12">
      <h1 style="font-size: 40px">
        Login or sign up to explore more premium features
      </h1>
      <br />
      <v-card max-width="500" class="mx-auto">
        <v-tabs
          v-model="tab"
          background-color="#E65100"
          centered
          dark
          icons-and-text
        >
          <v-tabs-slider></v-tabs-slider>

          <v-tab href="#login">
            login
            <v-icon>mdi-door</v-icon>
          </v-tab>

          <v-tab href="#reg">
            Sign up
            <v-icon>mdi-pencil</v-icon>
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item :key="1" value="login">
            <v-card flat>
              <v-form @submit.prevent="login()" method="POST">
                <v-card-text>
                  <v-text-field
                    outlined
                    label="email address"
                    prepend-icon="mdi-email"
                    v-model="email"
                    @keydown.enter="login"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    label="password"
                    prepend-icon="mdi-form-textbox-password"
                    v-model="password"
                    @keydown.enter="login"
                  ></v-text-field>
                  <v-btn
                    class="ma-2"
                    :loading="loading"
                    :disabled="loading"
                    color="primary"
                    @click="(loader = 'loading'), login()"
                  >
                    login
                  </v-btn>
                </v-card-text>
              </v-form>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="2" value="reg">
            <v-card flat>
              <v-form @submit.prevent="signUp()" method="POST">
                <v-card-text>
                  <v-text-field
                    outlined
                    label="First Name"
                    prepend-icon="mdi-email"
                    v-model="firstNameSignup"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    label="Last Name"
                    prepend-icon="mdi-email"
                    v-model="lastNameSignup"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    label="email address"
                    prepend-icon="mdi-email"
                    v-model="emailSignup"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    label="password"
                    prepend-icon="mdi-account-outline"
                    v-model="passwordSignup"
                  ></v-text-field>
                  <v-btn
                    class="ma-2"
                    :loading="loading"
                    :disabled="loading"
                    color="primary"
                    @click="(loader = 'loading'), signUp()"
                  >
                    sign up
                  </v-btn>
                </v-card-text>
              </v-form>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-col>
    <ErrorModal ref="errorModal" :errorMessage="errorMessage" />
  </v-row>
</template>
<script>
import axios from "axios";
import ErrorModal from "./ErrorModal.vue";

export default {
  name: "loginReg",
  components: { ErrorModal },
  data: () => ({
    tab: "login",
    loader: null,
    loading: false,
    email: "",
    firstNameSignup: "",
    lastNameSignup: "",
    passwordSignup: "",
    password: "",
    emailSignup: "",
    errorMessage: "",
  }),

  methods: {
    login() {
      this.loading = true;
      const data = { email: this.email, password: this.password };
      axios
        .post("http://localhost:9120/login", data)
        .then((res) => {
          console.log("Login successful: ", res);

          // Save the token in localStorage
          localStorage.setItem("userToken", res.data.token);

          // Save user information in localStorage
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              userId: res.data.userId,
              emailAddress: res.data.emailAddress,
              firstName: res.data.firstName,
              lastName: res.data.lastName,
              accountType: res.data.accountType,
              accountCreatedAt: res.data.accountCreatedAt,
            })
          );

          this.loading = false;

          // Redirect to dashboard
          this.$router.push({ name: "UserDashboard" });
        })
        .catch((err) => {
          this.errorMessage =
            err.response?.data ||
            "An error occurred with logging in, please try again later";
          this.$refs.errorModal.openModal();
          this.loading = false;
        });
    },

    signUp() {
      const data = {
        username: this.usernameSignup,
        email: this.emailSignup,
      };

      console.log(data);
    },
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 1000);

      this.loader = null;
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

//for buttons

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
