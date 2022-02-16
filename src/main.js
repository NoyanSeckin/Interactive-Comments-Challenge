import PrimeVue from "primevue/config";
//Prime Components
import Button from "primevue/button";
Vue.component("Button", Button);
import InputText from "primevue/inputtext";
Vue.component("InputText", InputText);
import Card from "primevue/card";
Vue.component("Card", Card);
import Textarea from "primevue/textarea";
Vue.component("Textarea", Textarea);
//Prime Styles
import "primeflex/primeflex.css";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
// Vue
import Vue from "vue";
import App from "./App.vue";
Vue.use(PrimeVue);
Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
}).$mount("#app");
