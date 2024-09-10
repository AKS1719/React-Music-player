import { Box, Text, IconButton, Flex } from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import React from "react";
import {login} from "../store/authSlice.js"
import { useDispatch, useSelector } from "react-redux";
import conf from "../conf/conf";
import { markNotAddToPlaylist } from "../store/addToPlaylistSlice.js";
import { useNavigate } from "react-router-dom";

const PlaylistComponent = ({ playlistName, toAdd , playlistId}) => {
	

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handlePlaylistDelete = async(e)=>{
        console.log(playlistId)
        e.stopPropagation()
        try {
            const respo = await fetch(`${conf.backendUrl}/playlist/deletePlaylist`,
				{
					method:"POST",
					headers:{
						"Content-Type":"application/json"
					},
					credentials:'include',
					body:JSON.stringify({playlistId})
				}
			)
			if(!respo.ok){
				const er = await respo.json()
				throw new Error(er.message)
			}

			const res = await respo.json()
			console.log(res.data)
			dispatch(login(res.data))
        } catch (error) {
            console.log(error)
        }

    }
    
    const handleAddToPlaylist = async()=>{
        try {
            if(!toAdd){
                alert('no songs to add ')
                return 
            }
            let fData = {
                playlistId,
                songId:toAdd._id
            }
            
            const respo = await fetch(`${conf.backendUrl}/playlist/addToPlaylist`,
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    credentials:'include',
                    body:JSON.stringify(fData)
                }
            )

            if(!respo.ok){
                const er = await respo.json()
                throw new Error(er.message)
            }
            dispatch(markNotAddToPlaylist())
            navigate(`/playlist/${playlistId}`)
            
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
		<Box
			as="section"
			bg={"gray.700"}
			p={2}
			w={"full"}
			borderRadius="md"
			boxShadow="lg"
			_hover={{ bg: "gray.600" }}
			transition="background-color 0.3s"
		>
			<Flex justify="space-between" align="center">
				<Text fontSize="md" fontWeight="bold" color="white">
					{playlistName}
				</Text>
				<IconButton
					icon={toAdd ?  <AddIcon/>: <DeleteIcon />}
					colorScheme={toAdd ? 'green' : 'red'}
					variant="outline"
					aria-label={toAdd ? "Add to Playlist" :"Delete Playlist"}
					onClick={(e)=>{toAdd ? handleAddToPlaylist(e) :handlePlaylistDelete(e)}}
					_hover={
                        toAdd? {bg:'green.600',color:'white'}: { bg: "red.600", color: "white" }
                    }
				/>
			</Flex>
		</Box>
	);
};

export default PlaylistComponent;
