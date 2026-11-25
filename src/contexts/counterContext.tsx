"use client"
import apiServices from "@/services/apiServices";
import { useSession } from "next-auth/react";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

type CounterContextT = {
  numOfCartItems: number;
  setNumOfCartItems: Dispatch<SetStateAction<number>>;
};

export const counterContext = createContext<CounterContextT>({
  numOfCartItems: 0,
  setNumOfCartItems: () => {},
});


export default function CounterContextProvider({children}:{children:ReactNode}){

const [numOfCartItems, setNumOfCartItems] = useState(0)
const { data: session } = useSession()
// undefined while loading or signed out
const userId = session?.user?.id

// Runs again whenever the USER changes (not only when someone signs in or out),
// so the badge always shows the cart of the user who is signed in right now
useEffect(()=>{
if(!userId) return // no user -> no token -> nothing to load
let isCurrent = true
apiServices.getUserCart().then((response)=>{
  // If the user changed while we were waiting, this answer belongs to the old user
  if(isCurrent) setNumOfCartItems(response.numOfCartItems)
}).catch(()=>{
  // The badge is a small extra on every page, so a toast here would be noise.
  // Show 0 and let the cart page explain the problem
  if(isCurrent) setNumOfCartItems(0)
})
return ()=>{ isCurrent = false }
},[userId])

// Signed out -> always show 0, even if an old count is still in state
const value = {
  numOfCartItems: userId ? numOfCartItems : 0,
  setNumOfCartItems,
}

    return <counterContext.Provider value={value}>
        {children}
    </counterContext.Provider>
}
