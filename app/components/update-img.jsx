import React, { useState,useEffect } from 'react';
import Image from 'next/image'
import supabase from '../components/supabase';

const Capture = () => {
    const [infor, setInfor] = useState();
useEffect(() => {

    const subscription = supabase 
    .channel('table-filter-changes')
    .on(
        'postgres_changes',
        { event: "UPDATE", schema: "public", table: "imagen-main", filter: 'id=eq.1' },
        (payload) => {
            setInfor(payload.new);
            console.log(payload)
        }
    )
    .subscribe();
    
    
    checkConnection();

    return () => {
        subscription.unsubscribe();
    };
}, []);

async function checkConnection() {
    let { data, error } = await supabase
      .from('imagen-main')
      .select()
      .limit(1)
  
    if (error) {
      console.error('Error al conectar con Supabase:', error);
    } else {
      console.log('Conexión exitosa con Supabase. Datos recibidos:', data);
      setInfor(data[0]);
     // console.log('Conexión exitosa con Supabase. Datos recibidos:', infor);
    }
  }

return(
    <div 
    style={ {     

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px',
    }}
    >
    
        <div 
        style={{
            flex: 1, 
            display: 'flex',
            justifyContent: 'center', 
            alignItems: 'center', 
        }}
        >
{infor?.url && (
  <Image
    style={{
      maxWidth: '100%',
      maxHeight: '100%', 
      objectFit: 'cover',
    }}
    src={infor.url }
    alt="logo"
    sizes="100vw"
    width={150}
    height={70}
  />
)}

        </div>
    </div>
)

}

export default Capture;