import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import Home from "../page/Home";
import Airdrop from "../page/Airdrop";
import Resigter from "../components/Resigter";
import PageNotFound from "../components/PageNotFound";

export const mainRoutes = [
  { path: "/", component: Home },
  { path: "/airdrop", component: Airdrop },
  { path: "/resigter", component: Resigter },
  { path: "/404", component: PageNotFound },
];

const renderRouter = (routerList) => {
  return routerList.map((item) => {
    const { path } = item;
    return <Route key={path} path={path} element={<item.component />}></Route>;
  });
};

const Routers = (props) => {
  return (
    <Router>
      <React.Suspense>
        <Routes>
          {renderRouter(mainRoutes)}
          <Route path="/" />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default React.memo(Routers);
