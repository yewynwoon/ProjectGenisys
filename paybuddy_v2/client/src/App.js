import React from 'react';
import { BrowserRouter as Router, Route , useHistory} from 'react-router-dom';
import {Security, SecureRoute, LoginCallback} from '@okta/okta-react';
import './App.css';
import Header from './Header';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import Login from './Login';
import Dashboard from './Dashboard';
import config from './config';
import Home from './Home';

const HasAccessToRouter = () => 
{
  const history = useHistory();

const customAuthHandler = () =>
{
  history.push('/login');
};
return (
  <Security {...config.oidc}oAuthRequired={customAuthHandler}>
  <div className="App">
    <Header />
    <NavigationBar/>
    <Route path="/" exact component={Home} />
    <Route path="/implicit/callback" component ={LoginCallback}/>
    <Route path="/login" exact component={Login} />
    <SecureRoute path="/Dashboard" component={Dashboard} />
    <Footer/>
  </div>
  </Security>

);
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  render () {
    return (
    <div>
      <Router>
        <HasAccessToRouter/>
      </Router>
    </div>
    );
  }
}

export default App;