"use client"
import Image from 'next/image';
import styled from 'styled-components';

const StyledImage = styled(Image)`
opacity: 0;
transition: opacity 0.5s ease-in-out;
position: absolute;
width: 100%;
height: 100%;
object-fit: cover;
border-radius: 10px;
&:hover {
  opacity: 1;
}
`;

const SquareComponent = ({ img, setMessage}) => {
    const textMappings = {
        '/tiempo.png': 'El Tiempo se convierte en dinero cuando se invierte',
        '/viaje.png': 'El viaje comienza cuando se toma accion',
        '/deseo.png': 'El deseo',
        '/construcion.png': 'El entorno '
      };
    return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100px',
      height: '100px',
      backgroundColor: 'white',
      color: 'white',
      margin: '0 auto',
      marginTop:'15%',
      position: "relative",
      border: '2px solid #FFFFFF',
      filter: 'drop-shadow(-1px 4px 4px rgba(0, 0, 0, 0.25))',
      borderRadius: '10px'
    }}>
   
<StyledImage src={img} alt="icono tiempo hd" width={100} height={100}
  //onMouseEnter={() => {setHover(true); setMessage(textMappings[img])}} 
  //onMouseLeave={() => {setHover(false);
 //}}
   />
    </div>
  );
};

export default SquareComponent;