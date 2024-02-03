import { createStore } from "redux";
import tabmoduleReducer from "../reducer/tabmodulereducer";

function configureStore() {
  const store = createStore(tabmoduleReducer);

  return store;
}

export default configureStore;
