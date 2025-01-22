import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "./index.css";

const app = createApp(App);

//directive pour icon de présence dans le panier
app.directive("cart-icon", {
  mounted(el, binding) {
    const isInCart = binding.value;

    if (isInCart) {
      el.classList.add(
        "w-8",
        "absolute",
        "rounded-full",
        "bg-secondary",
        "p-1",
        "text-green-500"
      );
    }
  },
  updated(el, binding) {
    const isInCart = binding.value;

    if (isInCart) {
      el.classList.add(
        "w-8",
        "absolute",
        "rounded-full",
        "bg-secondary",
        "p-1",
        "text-green-500"
      );
    }
  },
});


app.use(createPinia());
app.use(router);

app.mount("#app");
