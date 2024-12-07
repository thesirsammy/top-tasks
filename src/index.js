import "./styles.css";

import { List, Task, Viewport } from "./logic.js";

(function () {
  let index = new Viewport();

  index.load();

  index.refreshIndex();
})();
