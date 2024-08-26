
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import store from "./store/store.js"
import {Provider} from "react-redux"
import {Home} from "./pages/index.js";
import { StrictMode } from "react";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <Home/>
			}
		]
	},
	{
		path: "*",
		element: () => <h1>Page Not Found</h1>
	}
])

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ChakraProvider>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </ChakraProvider>
    </StrictMode>
);
