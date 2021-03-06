import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import axios from "../api";
import router from "../router";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({
    loggedInUser: state.loggedInUser,
    redirectAfterLogin: state.redirectAfterLogin,
  }),
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    errors: [],
    loggedInUser: null,
    redirectAfterLogin: null,
  },
  mutations: {
    addError(state, error) {
      state.errors.push(error);
    },
    deleteError(state, errorIndex) {
      state.errors.splice(errorIndex, 1);
    },
    setLoggedInUser(state, user) {
      state.loggedInUser = user;
    },
    deleteLoggedInUser(state) {
      state.loggedInUser = null;
    },
    setRedirectAfterLogin(state, path) {
      state.redirectAfterLogin = path;
    },
    clearRedirectAfterLogin(state) {
      state.redirectAfterLogin = null;
    },
  },
  actions: {
    logout({ commit }) {
      if (this.state.loggedInUser) {
        axios
          .post("logout")
          .then(() => {
            commit("deleteLoggedInUser");
          })
          .catch(() => {
            commit("deleteLoggedInUser");
          });
      }
    },
    redirectAfterLogin({ commit, state }) {
      //  daha önceden gitmeye çalıştığı bir sayfa varsa oraya git, yoksa ana sayfaya git
      if (state.redirectAfterLogin) {
        let toPath = state.redirectAfterLogin;
        commit("clearRedirectAfterLogin");
        router.push(toPath);
      } else {
        router.push("/");
      }
    },
  },
  modules: {},
  plugins: [vuexLocal.plugin],
});
