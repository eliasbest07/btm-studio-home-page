
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
        <RectangleImg width={285} height={462} img={'/marbel.png'}/>
        <div
        style={{ width:'100px' }}
        >

        </div>
        <div>
            <RectangleComponent children={ <h1 style={{ marginLeft:'10px', marginRight:'10px' ,color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>Donde algunos vieron dificultad, nosotros vemos oportunidades. Este es el mejor momento para destacar, somos tu aliado estratégico.</h1>} color={'rgba(41, 41, 38, 0.6)'}  left={0} width={560} height={260}/>
            <div
        style={{ height:'30px' }}
        >

        </div>
            <RectangleComponent color={'rgba(158, 158, 149, 0.2)'}  left={0} width={560} height={160}/>

        </div>
    </div>
    <br/>
    <RectangleComponent color={'rgba(158, 158, 149, 0.2)'} left={20} width={860} height={100}/>
    <br/>
    <br/>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}> 
    <RectangleComponent children={ <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>Te invitamos a explorar nuestros servicios y descubrir cómo podemos trabajar juntos para convertir los desafíos en éxitos.</h1>} color={'rgba(41, 41, 38, 0.6)'}  left={0} width={560} height={318}/>
    <div
        style={{ width:'30px' }}
        >

        </div>
    <RectangleImg width={285} height={318} img={'/sea.png'}/>

    </div>
    <br/>
    <br/>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}> 
    <RectangleImg width={285} height={285} img={'/city-into-the-ocean.png'}/>
    <div style={{ width:'30px' }}></div>
    <RectangleComponent children={ <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>Contamos con experiencia creando y manteniendo productos digitales </h1>} color={'rgba(41, 41, 38, 0.6)'}  left={0} width={560} height={285}/>

    </div>
    <br/>
    <br/>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}> 
    <RectangleImg width={285} height={474} img={'/rainforest.png'}/>
    <div style={{ width:'30px' }}></div>
    <div>
            <RectangleComponent children={ <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>Landing Pages, Apps Web, Apps for Android, Apps for Ios, Apps for desktop </h1>} color={'rgba(21, 38, 56, 0.6)'}  left={0} width={560} height={250}/>
            <div
        style={{ height:'30px' }}
        >

        </div>
            <RectangleComponent color={'rgba(158, 158, 149, 0.2)'}  left={0} width={560} height={200}/>

        </div>
    </div>
    <br/>
    <br/>
    <br/>
    <RectangleComponent  children={ <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>En construcción </h1>} color={'rgba(158, 158, 149, 0.2)'} left={20} width={460} height={240}/>
    <RectangleComponent color={'rgba(158, 158, 149, 0.2)'} left={20} width={560} height={240}/>
    <RectangleComponent color={'rgba(158, 158, 149, 0.2)'} left={20} width={460} height={440}/>
    <RectangleComponent color={'rgba(158, 158, 149, 0.2)'} left={20} width={560} height={440}/>
    <RectangleComponent color={'rgba(158, 158, 149, 0.2)'} left={20} width={460} height={440}/>
    <RectangleComponent color={'rgba(158, 158, 149, 0.2)'} left={20} width={560} height={40}/>
    </main>
  )
}


