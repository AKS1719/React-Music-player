import { Flex } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"

function App() {

  return (
    <>
      <Flex h={'100vh'} w={'100vw'}>

      <Outlet/>
      </Flex>
    </>
  )
}

export default App
