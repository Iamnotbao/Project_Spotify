import React,{ createContext,useState} from "react";

const Play = createContext();


const SongContext = ({children})=>{
    const [presentSong,setPresentSong]= useState(null)
return(
    <Play.Provider value={{presentSong,setPresentSong}}>
        {children}
    </Play.Provider>
)

}
export {SongContext,Play}