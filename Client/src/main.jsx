import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { Home, MusicPlayer, Search } from "./pages/index.js";
import { StrictMode } from "react";
import { PageTransition } from "./components/index.js";
import Songs from "./pages/Songs.jsx";
import BaseLayout from "./components/Layout/BaseLayout.jsx";
import Profile from "./pages/Profile.jsx";


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
						<BaseLayout>
						<MusicPlayer />
						</BaseLayout>
					</PageTransition>
				),
			},
			{
				path: "songs",
				element: (
					<PageTransition>
						<BaseLayout>
						<Songs />
						</BaseLayout>
					</PageTransition>
				),
			},
			{
				path:"search",
				element:(
					<PageTransition>
						<BaseLayout>
						<Search />
						</BaseLayout>
					</PageTransition>
				)
			},
			{
				path:"profile/:username",
				element:(
					<PageTransition>
						<BaseLayout>
						<Profile />
						</BaseLayout>
					</PageTransition>
				)
			}
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
