import React from 'react'
import { Header, Player } from '../components'
import { Flex } from '@chakra-ui/react'

const Search = () => {
  return (
    <>
        <Header isSearchPage={true} forPage={'search'}/>
        <Flex h={'74%'} w={'100%'}>

        </Flex>
        <Player/>
    </>
  )
}

export default Search
