
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import store from "./store/store.js"
import {Provider} from "react-redux"
import {Home, MusicPlayer} from "./pages/index.js";
import { StrictMode } from "react";
import {PageTransition} from "./components/index.js";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: (
                    <div style={{ overflow: "hidden" }}>
                        <PageTransition>
                            <Home />
                        </PageTransition>
                    </div>
                ),
            },
            {
                path: "music-player",
                element: (
                        <PageTransition>
                            <MusicPlayer />
                        </PageTransition>
                ),
            },
        ],
    },
    {
        path: "*",
        element: <h1>Page Not Found</h1>,
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ChakraProvider>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </ChakraProvider>
    </StrictMode>
);
