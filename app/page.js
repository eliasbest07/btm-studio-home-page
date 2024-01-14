
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
            <RectangleComponent color={'rgba(41, 41, 38, 0.6)'}  left={0} width={560} height={260}>
            <h1 style={{ marginLeft:'10px', marginRight:'10px' ,color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>Donde algunos vieron dificultad, nosotros vemos oportunidades. Este es el mejor momento para destacar, somos tu aliado estratégico.</h1>
            </RectangleComponent> 
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
    <RectangleComponent  color={'rgba(41, 41, 38, 0.6)'}  left={0} width={560} height={318}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>Te invitamos a explorar nuestros servicios y descubrir cómo podemos trabajar juntos para convertir los desafíos en éxitos.</h1>
    </RectangleComponent>
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
    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'}  left={0} width={560} height={285}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>Contamos con experiencia creando y manteniendo productos digitales </h1>
    </RectangleComponent>
    </div>
    <br/>
    <br/>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}> 
    <RectangleImg width={285} height={474} img={'/rainforest.png'}/>
    <div style={{ width:'30px' }}></div>
    <div>
            <RectangleComponent color={'rgba(21, 38, 56, 0.6)'}  left={0} width={560} height={250}>
            <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>Landing Pages, Apps Web, Apps for Android, Apps for Ios, Apps for desktop </h1>
            </RectangleComponent>
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
    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>Mi empresa solo ofrece servicios
que enriquezcan a nuestros clientes desde un punto de vista ético</h1>
    </RectangleComponent>

    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>Solo me rodeo de
seres humanos que estimulen mi alegría, que me den paz y me animen a ser
un hombre mejor</h1>
    </RectangleComponent>
    
    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>«Traido a la realidad es mejor que perfecto»</h1>
    </RectangleComponent>

    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>«El que suda más en la práctica, sangra menos en la guerra».
</h1>
    </RectangleComponent>
    
    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}> «La mayor victoria se consigue en esas horas tempranas de
la mañana, cuando nadie te mira y mientras todos duermen».</h1>
    </RectangleComponent>

    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}> Cuando esta preparado el alumno aparece el maestro.</h1>
    </RectangleComponent>

    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}> Solo oímos lo que estamos preparados para oír</h1>
    </RectangleComponent>

    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}> «Si
todo parece estar bajo control, significa que vas muy despacio».</h1>
    </RectangleComponent>

    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}> Quien gana es el que más
da.</h1>
    </RectangleComponent>

    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}> «Todo cambio es duro al principio, desordenado a la mitad
y precioso al final».</h1>
    </RectangleComponent>
    
    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}> A partir de hoy. Y si lo hacéis, la victoria está garantizada.</h1>
    </RectangleComponent>

    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}> «Al final, todo irá bien. Y si no va todo bien, no es el final»</h1>
    </RectangleComponent>
    
    
    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>«Renuncia a la gota,
conviértete en el océano»</h1>
    </RectangleComponent>
    
    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>Todos los atletas profesionales tienen entrenadores de alto
rendimiento</h1>
    </RectangleComponent>
    
    
    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>«Ninguna idea funciona hasta que la
llevas a cabo»</h1>
    </RectangleComponent>
     
    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>«Siempre que crees belleza
a tu alrededor, estás honrando tu propia alma»</h1>
    </RectangleComponent>
    
    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>Todas las sombras de la inseguridad
se diluyen en el cálido resplandor de la persistencia</h1>
    </RectangleComponent>
    
    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>«Los sueños no se cumplen
mientras duermes»</h1>
    </RectangleComponent>
    
    <RectangleComponent color={'rgba(41, 41, 38, 0.6)'} left={20} width={460} height={240}>
    <h1 style={{ color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}> «Todo el
mundo sueña con ser una leyenda hasta que tiene que trabajar como una»</h1>
    </RectangleComponent>
   
    
    <RectangleComponent color={'rgba(158, 158, 149, 0.2)'} left={20} width={560} height={240}/>
    <RectangleComponent color={'rgba(158, 158, 149, 0.2)'} left={20} width={460} height={440}/>
    <RectangleComponent color={'rgba(158, 158, 149, 0.2)'} left={20} width={560} height={440}/>
    <RectangleComponent color={'rgba(158, 158, 149, 0.2)'} left={20} width={460} height={440}/>
    <RectangleComponent color={'rgba(158, 158, 149, 0.2)'} left={20} width={560} height={40}/>
    </main>
  )
}


