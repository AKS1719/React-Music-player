import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import conf from "./conf/conf";
import { useDispatch } from "react-redux";
import {login}  from "./store/authSlice"

function App() {

  const dispatch = useDispatch()
	const getUser = async () => {
		try {
      const respo = await fetch(`${conf.backendUrl}/users/getCurrentUser`,
        {
          method:"GET",
          credentials:'include'
        }
      )
      if(!respo.ok){
        const err = await respo.json()
        throw new Error(err.message)
      }
      const user = await respo.json();
      if(user && user.data){
        dispatch(login(user.data))
      }
		} catch (error) {
      console.log(error)
    }
	};

	useEffect(() => {getUser()});

	return (
		<>
			<Flex
				h={"100vh"}
				w={"100vw"}
			>
				<Outlet />
			</Flex>
		</>
	);
}

export default App;
