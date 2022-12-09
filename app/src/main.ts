import { createApp} from 'vue'

import App from './views/App.vue'
import { createRouter } from './router'

console.log("Build: " + process.env.NODE_ENV);

const app = createApp(App);
app.use(createRouter(app));

app.mount('#app');
