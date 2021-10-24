// React Required
import React, { Component } from "react";
import ReactDOM from "react-dom";

// Create Import File
import "./main.scss";

import "../public/assets/css/aos.min.css";
import "../public/assets/css/bootstrap-datetimepicker.css";
import "../public/assets/css/emoji.css";
import "../public/assets/css/feather.css";
import "../public/assets/css/lightbox.css";
import "../public/assets/css/style-rtl.css";
import "../public/assets/css/style.css";
import "../public/assets/css/style.css.map";
import "../public/assets/css/themify-icons.css";
import "../public/assets/css/video-player.css";
// Common Layout
import Home from "./pages/Home";

import Badge from "./pages/Badge";
import Group from "./pages/Group";
import Storie from "./pages/Storie";
import Member from "./pages/Member";
import Email from "./pages/Email";
import Emailopen from "./pages/Emailopen";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Contactinfo from "./pages/Contactinfo";
import Socialaccount from "./pages/Socialaccount";
import Password from "./pages/Password";
import Payment from "./pages/Payment";
import Notification from "./pages/Notification";
import Helpbox from "./pages/Helpbox";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Notfound from "./pages/Notfound";

import ShopOne from "./pages/ShopOne";
import ShopTwo from "./pages/ShopTwo";
import ShopThree from "./pages/ShopThree";
import Singleproduct from "./pages/Singleproduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Chat from "./pages/Chat";
import Live from "./pages/Live";
import Job from "./pages/Job";
import Event from "./pages/Event";
import Hotel from "./pages/Hotel";
import Videos from "./pages/Videos";
import Comingsoon from "./pages/Comingsoon";

import Grouppage from "./pages/Grouppage";
import Userpage from "./pages/Userpage";
import Authorpage from "./pages/Authorpage";
import Hotelsingle from "./pages/Hotelsingle";
import Analytics from "./pages/Analytics";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import { Tab, Tabs } from "react-bootstrap";
import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";
import MoviesTab from "./components/MoviesTab";
import PrivateRoute from "./components/PrivateRoute";
import CreateHouse from "./pages/CreateHouse";
import House from "./pages/house";

const withHeader = (Component) => (props) =>
  <Header socialTab={<Component {...props} />} movieTab={<MoviesTab />} />;

class Root extends Component {
  render() {
    return (
      <AuthProvider>
        <BrowserRouter basename={"/"}>
          <Switch>
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/login`}
              component={Login}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/register`}
              component={Register}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/`}
              component={withHeader(Home)}
            />

            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaultbadge`}
              component={withHeader(Badge)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaultgroup`}
              component={withHeader(Group)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaultstorie`}
              component={withHeader(Storie)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaultemailbox`}
              component={withHeader(Email)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaultemailopen`}
              component={withHeader(Emailopen)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaultsettings`}
              component={withHeader(Settings)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaultvideo`}
              component={withHeader(Videos)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaultanalytics`}
              component={withHeader(Analytics)}
            />

            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/accountinformation`}
              component={withHeader(Account)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaultmember`}
              component={withHeader(Member)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/contactinformation`}
              component={withHeader(Contactinfo)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/socialaccount`}
              component={withHeader(Socialaccount)}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/password`}
              component={Password}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/payment`}
              component={withHeader(Payment)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaultnotification`}
              component={withHeader(Notification)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/helpbox`}
              component={withHeader(Helpbox)}
            />

            <Route
              exact
              path={`${process.env.PUBLIC_URL}/forgot`}
              component={Forgot}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/notfound`}
              component={withHeader(Notfound)}
            />

            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/shop1`}
              component={withHeader(ShopOne)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/shop2`}
              component={withHeader(ShopTwo)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/shop3`}
              component={withHeader(ShopThree)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/singleproduct`}
              component={withHeader(Singleproduct)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/cart`}
              component={withHeader(Cart)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/createhouse`}
              component={withHeader(CreateHouse)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/house/:name/:id`}
              component={withHeader(House)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/checkout`}
              component={withHeader(Checkout)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaultmessage`}
              component={withHeader(Chat)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaultlive`}
              component={withHeader(Live)}
            />

            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaultjob`}
              component={withHeader(Job)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaultevent`}
              component={withHeader(Event)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaulthotel`}
              component={withHeader(Hotel)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/grouppage`}
              component={withHeader(Grouppage)}
            />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/:name/:id`}
              component={withHeader(Userpage)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/authorpage`}
              component={withHeader(Authorpage)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/comingsoon`}
              component={withHeader(Comingsoon)}
            />
            <PrivateRoute
              exact
              path={`${process.env.PUBLIC_URL}/defaulthoteldetails`}
              component={withHeader(Hotelsingle)}
            />
          </Switch>
        </BrowserRouter>
      </AuthProvider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById("root"));
serviceWorker.register();
