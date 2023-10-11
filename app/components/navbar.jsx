"use client"
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <div>
      <Link href='/' id="link">BTM Studio</Link>
     
      </div>

      <div>
      <Link style={{ paddingLeft: '10px' }} href='/proyectos' id="link">Proyectos</Link>
      <Link style={{ paddingLeft: '10px' }} href='/nosotros' id="link">Nosotros</Link>
      <Link style={{ paddingLeft: '10px' }} href='/bloc' id="link">Bloc</Link>
      </div>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
          padding: 1em;
          background-color: #000;
          background: rgba(6, 6, 6, 0.6);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 2px 4px 4px rgba(255, 255, 255, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05);
backdrop-filter: blur(6px);
          color: #fff;
          width: 100%;
        }
     
      `}</style>
    </nav>
  );
}



