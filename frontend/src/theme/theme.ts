// Use these themes or define new ones so that all pages are uniform

import type { SxProps, Theme, } from "@mui/material/styles";

export const containerStyle: SxProps<Theme> = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  background: "transparent",
  padding: "20px",
  width: "fit-content",
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
  padding: '40px',
  textAlign: 'center',
  maxWidth: '400px',
  margin: 'auto'
};

export const formStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  width: 300,
  padding: 3,
  borderRadius: 2,
  boxShadow: 2,
  backgroundColor: "white",
};

