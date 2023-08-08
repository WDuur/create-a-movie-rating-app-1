import { createApp, provide, h } from 'vue'
import './style.css'
import { DefaultApolloClient } from "@vue/apollo-composable";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import App from './App.vue'

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  cache,
  uri: "http://localhost:9000/graphql",
});

const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
});
app.mount("#app");