import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "../routes";

// pages
import Presentation from "./Signin";
import DashboardOverview from "./DashboardOverview";
import Transactions from "./Transactions";
import Purchase from "./Purchase";
import Settings from "./UserSettings";
import BootstrapTables from "../components/BootstrapTables";
import Signin from "./Signin";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";
import Valuetargets from "./ValueTargetSettings";
import Accountingsettings from "./AccountingSetting";
import Supplierssettings from "./SuppliersSettings";
import BeginningInventorysettings from "./BeginningInventorySettings";
import Bomsettings from "./BomsSettings";

// components
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";
import { useChat } from "../api/context";


const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => ( <> <Preloader show={loaded ? false : true} /> <Component {...props} /> </> ) } />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  const {val, setVal, sendValue, signIn, suppliers} = useChat();
  const onSendValue = async () => {
    // console.log(value)
    // if(!value){
    //     throw console.error("Some field missing");
    // }
    console.log("onsendvalue")
    const payload = {
        val : "",  
    }
    // signIn(payload);
    sendValue(payload);
    // console.log(payload)

  }
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  return (
    <Route {...rest} render={props => (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />

        <main className="content">
          {/* <Navbar /> */}
          <Component {...props} />
          <Footer toggleSettings={toggleSettings} showSettings={showSettings} />
        </main>
      </>
    )}
    />
  );
};

export default () => (
  <Switch>
    <RouteWithLoader exact path={Routes.Presentation.path} component={Presentation} />
    <RouteWithLoader exact path={Routes.Signin.path} component={Signin} />
    <RouteWithLoader exact path={Routes.Signup.path} component={Signup} />
    <RouteWithLoader exact path={Routes.ResetPassword.path} component={ResetPassword} />
    {/* <RouteWithLoader exact path={Routes.NotFound.path} component={NotFoundPage} /> */}
    {/* <RouteWithLoader exact path={Routes.ServerError.path} component={ServerError} /> */}

    {/* pages */}
    <RouteWithSidebar exact path={Routes.DashboardOverview.path} component={DashboardOverview} />
    {/* <RouteWithSidebar exact path={Routes.ChangeProfile.path} component={ChangeProfile} /> */}
    <RouteWithSidebar exact path={Routes.Purchase.path} component={Purchase} />
    <RouteWithSidebar exact path={Routes.Transactions.path} component={Transactions} />
    <RouteWithSidebar exact path={Routes.Settings.path} component={Settings} />
    <RouteWithSidebar exact path={Routes.BootstrapTables.path} component={BootstrapTables} />
    <RouteWithSidebar exact path={Routes.Valuetargets.path} component={Valuetargets} />
    <RouteWithSidebar exact path={Routes.Accountingsettings.path} component={Accountingsettings} />
    <RouteWithSidebar exact path={Routes.Supplierssettings.path} component={Supplierssettings} />
    <RouteWithSidebar exact path={Routes.BeginningInventorysettings.path} component={BeginningInventorysettings} />
    <RouteWithSidebar exact path={Routes.Bomsettings.path} component={Bomsettings} />

    <Redirect to={Routes.Signin.path} />
  </Switch>
);
