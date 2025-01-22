import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "./index.css";

const app = createApp(App);

app.directive("cart-icon", {
  mounted(el, binding) {
    const isInCart = binding.value;

    if (isInCart) {
      el.classList.add(
        "w-8",
        "absolute",
        "left-4",
        "bottom-3",
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
