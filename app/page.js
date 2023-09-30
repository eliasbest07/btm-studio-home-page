"use client"
import CircularImage from '../app/components/logo'
import ScrollComponent from '../app/components/scroll-main'
import RectangleComponent from '../app/components/rectangulo'
import SquareComponent from '../app/components/bottun'
import { useState } from 'react';

export default function Home() {
    const [isHovered, setIsHovered] = useState(false);

  return (
    <main className="flex  flex-col items-center justify-between "> 
    <h1 > BTM Studio</h1>
    <div className="flex">
    <SquareComponent setHover={setIsHovered} />
    <div  style={{
      width: '10px',}}>
    </div>
    <SquareComponent setHover={setIsHovered} />
    <div  style={{
      width: '200px',}}>
    </div>
    <SquareComponent setHover={setIsHovered} />
    <div  style={{
      width: '10px',}}>
    </div>
    <SquareComponent setHover={setIsHovered} />

    </div>
    <CircularImage src={'/logo.png'} alt={'BTM Studio logo'} />
    <ScrollComponent/>
    <br/>
    <br/>
    <br/>

    {isHovered && <p style={{ color: 'white', fontSize: '30px' }}>El tiempo se convierte en dinero cuando se invierte</p>}
    <br/>
    <RectangleComponent left={20} width={560} height={240}/>
    <RectangleComponent left={20} width={460} height={240}/>
    <RectangleComponent left={20} width={560} height={240}/>
    <RectangleComponent left={20} width={460} height={440}/>
    <RectangleComponent left={20} width={560} height={440}/>
    <RectangleComponent left={20} width={460} height={440}/>
    <RectangleComponent left={20} width={560} height={40}/>
    </main>
  )
}
