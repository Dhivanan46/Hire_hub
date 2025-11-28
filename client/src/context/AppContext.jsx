import { createContext, useEffect } from "react";
import {useState} from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const [searchFilter, setSearchFilter] = useState({
        title:"",
        location:""
    })
    
    const [isSearched,setIsSearched] = useState(false)

    const [job,setJob] = useState([])

    const [showRecruiterLogin,setShowRecruiterLogin] = useState(false);

    //function to fetch job data
    const fetchJobs = async () =>{
        setJob(jobsData)
    }

    useEffect(()=>{
        fetchJobs();
    },[])

    const value = {
        searchFilter,setSearchFilter,
        isSearched,setIsSearched,
        job,setJob,
        showRecruiterLogin,setShowRecruiterLogin
    }

    return(
        <AppContext.Provider value = {value}>
            {props.children}
        </AppContext.Provider>
    )

}