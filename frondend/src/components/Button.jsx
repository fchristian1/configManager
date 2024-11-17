import React from "react";

function Button({ children }) {
    return <button className="border border-black rounded px-2 hover:bg-gray-200 w-full">{children}</button>;
}

export default Button;
