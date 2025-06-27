'use client'
import { useEffect } from 'react';

const ScrollComponent = () => {
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const topOffset = window.innerHeight *0.4; // Calcula el 22% de la altura de la ventana
            const component = document.querySelector('.scroll-component');
            component.style.marginTop = '400px';
            if (scrollPosition <= topOffset) {
                console.log(component.style.top )
                
                component.style.top = `${(scrollPosition - topOffset)*-1 - 400}px`;
            } else {
                component.style.marginTop = '0';
                component.style.top = '0';
                console.log('0')
                console.log(topOffset)
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className='flex flex-col scroll-component' style={{
            height: '100%',
            background: 'url(segundobgop.webp) center / cover no-repeat, #6E727C',
           
            position: 'fixed', // Cambiado de 'fixed' a 'sticky'
            top: '350px', 
            width: '90%',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            boxShadow: '0px 2px 4px 2px rgba(0, 0, 0, 0.51)',
            zIndex: -1 // Establece un valor más bajo para el z-index
        }}>
        </div>
    );
};
export default ScrollComponent;

