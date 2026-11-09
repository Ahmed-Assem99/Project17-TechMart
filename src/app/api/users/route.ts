import { NextResponse } from "next/server"

const users=[
    {
        name:"Ahmed",
        email:"ahmed@gmail.com"
    },
    {
        name:"Ali",
        email:"ali@gmail.com"
    },
]


export async function GET(){

    return NextResponse.json({
        message:"success",
        data:{
            users
        }
    })
}

export async function POST(req:Request){
    const body = await req.json()
    users.push(body)

        return NextResponse.json({
        message:"success",
        data:{
            users
        }
    },{
        status:201
    })
}