import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="text-center px-6 py-12">

                <h2 className="text-9xl font-extrabold text-gray-400 dark:text-gray-600">
                    404
                </h2>


                <p className="mt-6 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Sorry, we couldn’t find this page.
                </p>
                <p className="mt-3 mb-8 text-gray-600 dark:text-gray-400">
                    Looks like this page doesn’t exist. Try checking the URL or searching instead. 
                </p>


                {/* <button
                    onClick={() => navigate("/")}
                    style={{ backgroundColor: "#23A9F2", color: "white" }}
                    className="px-6 py-3 rounded-lg shadow-md hover:opacity-90 focus:ring-2 focus:ring-[#97D4E7] transition"
                >
                    Back to Homepage
                </button> */}
            </div>
        </div>
    );
};

export default PageNotFound;
