
import { createContext, ReactNode, useState } from "react";


export const counterContext = createContext<any>(0);


export default function CounterContextProvider({children}:{children:ReactNode}){

const [numOfCartItems, setNumOfCartItems] = useState(0)


    return <counterContext.Provider value={{numOfCartItems,setNumOfCartItems}}>
        {children}
    </counterContext.Provider>
}