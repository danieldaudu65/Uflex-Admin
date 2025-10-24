import React from "react";
// import Router from "./router/Routes";
import './App.css';
import { Toaster } from "react-hot-toast";
import Router from "./router/Routes";

const App:React.FC = () => {
    return (
        <>
            <Router />
            <Toaster />
        </>
    );
};

export default App;
