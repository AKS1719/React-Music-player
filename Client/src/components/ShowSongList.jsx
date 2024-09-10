import React, { useEffect, useState } from 'react'
import conf from "../conf/conf.js"

const ShowSongList = () => {


  const [randomSongs, setRandomSongs] = useState([])

  const fetchRandomSongs = async ()=>{
    try {
      const response = await fetch(`${conf.backendUrl}/songs/getRandomSongs`,
        {
          method:"GET",
          credentials:'include'
        }
      )
      if(!response.ok){
        const err = await response.json();
        throw new Error(err.message)
      }
      const random = await response.json()
      setRandomSongs(random)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchRandomSongs()
  },[])

  return (
    <>
      
    </>
  )
}

export default ShowSongList
