import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Login from './components/';
import ChatWindow from './components/filewindow';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/chat" component={ChatWindow} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}
export default App;
