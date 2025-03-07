// Not yet implemented
import React from "react";
import ReactDOM from "react-dom/client";
import NavBar from "./base"

import { containerStyle, paperStyle } from "./theme/theme"; 


export default function Betting3() {
    return (
        <div>
            <h1>Betting Page 3</h1>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("betting3-root")!);
root.render(
<React.StrictMode>
<NavBar />
<Betting3/>
</React.StrictMode>
);

