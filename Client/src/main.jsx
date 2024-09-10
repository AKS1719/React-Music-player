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
import Playlist from "./pages/Playlist.jsx";
import Favorites from "./pages/Favorites.jsx";

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
				path: "/",
				element: <BaseLayout />,
				children: [
					{
						path: "music-player",
						element: <MusicPlayer />,
					},
					{
						path: "songs",
						element: <Songs />,
					},
					{
						path: "search",
						element: <Search />,
					},
					{
						path: "profile/:username",
						element: <Profile />,
					},
					{
						path:"playlist/:playlistId",
						element:<Playlist/>
					},
					{
						path:'favorites',
						element:<Favorites/>
					}
				],
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
