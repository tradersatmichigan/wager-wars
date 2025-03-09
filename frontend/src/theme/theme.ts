// Use these themes or define new ones so that all pages are uniform

import type { SxProps, Theme, } from "@mui/material/styles";

export const containerStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
  background: "transparent",
  padding: "20px",
  width: "100%",
  height: "100%",       
};



export const buttonStyle: SxProps<Theme> = {
  backgroundColor: "#1976d2",
  color: "white",
  padding: "10px 20px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "#115293",
  },
};

export const paperStyle: SxProps<Theme> = {
  padding: "10px",
  textAlign: "center",

};


export const formStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  width: "70%",
  padding: 3,
  borderRadius: 2,
  boxShadow: 2,
  backgroundColor: "white",
};

export const listStyle: SxProps<Theme> = {
  padding: "8px",
  borderRadius: "6px",
  textAlign: "left",
  display: "flex",
  fontSize: "16px",

};


export const headerStyle: SxProps<Theme> = {
  color: "black",
  fontSize: "24px",
  borderRadius: "10px",
  textAlign: "center",
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),

}


export const textStyle: SxProps<Theme> = {
  color: "black",
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  fontSize: "16px",
}
