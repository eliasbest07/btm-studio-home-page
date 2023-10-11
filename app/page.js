
import CircularImage from '../app/components/logo'
import ScrollComponent from '../app/components/scroll-main'
import RectangleComponent from '../app/components/rectangulo'
import SquareComponent from '../app/components/bottun'
import Navbar from '../app/components/navbar'
import RectangleImg from '../app/components/cuadroimg'

export default function Home() {


  return (
    <main className="flex  flex-col items-center justify-between ">
    <Navbar/>
   
    <div className="flex">
    <SquareComponent   img={'/tiempo.png'} />
    <div  style={{
      width: '120px',}}>
    </div>
    <SquareComponent   img={'/viaje.png'} />
    <div  style={{
      width: '240px',}}>
    </div>
    <SquareComponent   img={'/deseo.png'} />
    <div  style={{
      width: '120px',}}>
    </div>
    <SquareComponent   img={'/construcion.png'} />

    </div>
    <CircularImage src={'/btmstudio_logo.png'} alt={'BTM Studio logo'} />
    <ScrollComponent/>
    <br/>
    <br/>
    <br/>

    <br/>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <RectangleImg width={285} height={320} img={'/marbel.png'}/>
        <div
        style={{ width:'100px' }}
        >

        </div>
        <RectangleComponent left={0} width={560} height={260}/>
    </div>
    <br/>
    <br/>
    <br/>
    <br/>
    <RectangleComponent left={20} width={460} height={240}/>
    <RectangleComponent left={20} width={560} height={240}/>
    <RectangleComponent left={20} width={460} height={440}/>
    <RectangleComponent left={20} width={560} height={440}/>
    <RectangleComponent left={20} width={460} height={440}/>
    <RectangleComponent left={20} width={560} height={40}/>
    </main>
  )
}
