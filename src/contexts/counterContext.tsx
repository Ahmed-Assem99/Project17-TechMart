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
// "loading" -> "authenticated" (signed in) or "unauthenticated" (signed out)
const { status } = useSession()

// Runs again whenever status changes, so the badge reloads right after
// signing in (the cart now belongs to whoever is logged in)
useEffect(()=>{
if(status!=="authenticated") return // no user -> no token -> nothing to load
apiServices.getUserCart().then((response)=>{
  setNumOfCartItems(response.numOfCartItems ?? 0) // ?? 0: an error response has no numOfCartItems
})
},[status])

// Signed out -> always show 0, even if an old count is still in state
const value = {
  numOfCartItems: status==="authenticated" ? numOfCartItems : 0,
  setNumOfCartItems,
}

    return <counterContext.Provider value={value}>
        {children}
    </counterContext.Provider>
}
