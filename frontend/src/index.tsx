// Only thing added to this is navbar.

import * as ReactDOM from "react-dom/client";
import React from "react";
//import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//
// Components (Import your components here)
import Root from "./Root";
import Betting1 from "./betting1"
import Betting2 from "./betting2"

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
        path: "betting1",
        element: <Betting1/>,
      },

      {
        path: "betting2",
        element: <Betting2/>
      }
      //{
      //  path: "desks/:deskId",
      //  element: <DeskView />,
      //},
    ],
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
