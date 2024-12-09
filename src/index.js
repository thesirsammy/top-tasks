import "./styles.css";

import { Viewport } from "./logic.js";

(function () {
  let index = new Viewport();

  index.load();

  index.refreshIndex();
})();
