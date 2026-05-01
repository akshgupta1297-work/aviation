import Image from 'next/image'
import React from 'react'
import NotFound from "../assets/images/404_not_found.png"
import { Button } from '@heroui/react'
import Link from 'next/link'

const page = () => {
    return (
        <Link href={"/"}>
            <div className='flex justify-center w-full bg-[#F2E3BC] h-screen overflow-hidden'>
                <Image src={NotFound} alt='NotFound' className='w-full' />
                <Button className="absolute bg-[#BFA766] top-[65%] left-[11%] rounded-4xl lg:py-9.5 py-9 w-[26%] lg:text-2xl font-bold text-black">Go To Home</Button>
            </div>
        </Link>
    )
}

export default page