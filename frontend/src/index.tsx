import * as ReactDOM from "react-dom/client";
import React from "react";
//import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//
// Components (Import your components here)c
import Root from "./Root";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login"
import Control from "./pages/Control"
import CoinGame from "./pages/CoinGame";
import DiceGame from "./pages/DiceGame";
import CardGame from "./pages/CardGame";
import ControlResults from "./pages/ControlResults";

//const theme = createTheme({
//  typography: {
//    fontFamily: '"Geist", sans-serif', // Default to Geist
//    fontWeightRegular: 400,
//    fontWeightMedium: 500,
//    fontWeightBold: 700,
//  },
//  components: {
//    MuiCssBaseline: {
//      styleOverrides: `
//        @font-face {
//          font-family: 'Geist';
//          src: url('static/fonts/Geist-Regular.otf') format('opentype');
//          font-weight: 400;
//          font-style: normal;
//          font-display: swap; /* Important for performance */
//        }
//        @font-face {
//          font-family: 'Geist';
//          src: url('static/fonts/Geist-Medium.otf') format('opentype');
//          font-weight: 500;
//          font-style: normal;
//          font-display: swap;
//        }
//        @font-face {
//          font-family: 'Geist';
//          src: url('static/fonts/Geist-Bold.otf') format('opentype');
//          font-weight: 700;
//          font-style: normal;
//          font-display: swap;
//        }
//      `,
//    },
//  },
//});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/control/",
    element: <Control />,
    children: [

    ],
  },
  {
    path: "/control/coingame",
    element: <CoinGame />
  },
  {
    path: "/control/dicegame",
    element: <DiceGame />
  },
  {
    path: "/control/cardgame",
    element: <CardGame />
  },
  {
    path: "/control/results",
    element: <ControlResults />
  },
],
//{
//  basename: "/"
//}
);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
  {/*<ThemeProvider theme={theme}>*/}
  {/*<CssBaseline />*/}
  <RouterProvider router={router} />
  {/*</ThemeProvider>*/}
  </React.StrictMode>,
);
