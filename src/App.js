import React, {useState} from "react";
import './App.css';
import { Grid } from "@mui/material";
import Entry from "./components/entry";
import Welcome from "./components/welcome";


function App() {
  
  return (
      <Grid container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Welcome/>
        <Entry/>
      </Grid>
  );
}

export default App;
