import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Profile = () => {
    const {username} = useParams()
    const userData = useSelector(state=> state.auth.userData)
    const [finalUser, setFinalUser ] = useState(null)

    const fetchUserByUsername = async()=>{
        try {
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        if(username !==null ){
            if(userData !==null){
                if(username === userData.username)
                {
                    setFinalUser(userData)
                }
            }
            if(!finalUser){
                fetchUserByUsername();
            }
        }
    },[username])

	return <div></div>;
};

export default Profile;
