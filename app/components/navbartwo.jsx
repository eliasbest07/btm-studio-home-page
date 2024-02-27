'use client'
import React from "react";
import {Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";

export default function Navbartwo() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar disableAnimation isBordered style = { { height: 'auto',
    width: '100%',
    background: 'rgba(41, 41, 38, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(6px)',

    padding: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'}}>
    

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
        <p style={{ marginLeft:'10px', marginRight:'10px' ,color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '2.5em'  }}> Elias Montilla </p>

        </NavbarBrand>
      <div style={{ display: 'flex', flexDirection: 'column', }}>
        <button className="mb-2 text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-white hover:text-black h-9 px-3 rounded-full w-24 pl-4">
            
             LinkedIn </button>
       
         <button className="text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-white hover:text-black h-9 px-3 rounded-full w-24 pr-4"> GitHut </button>
        
      </div>
      </NavbarContent>
      <NavbarContent className="sm:hidden" justify="start">
    
    </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
        <p style={{ marginLeft:'10px', marginRight:'10px' ,color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '2.5em'  }}> Elias Montilla </p>

        </NavbarBrand>
        <NavbarContent justify="end">
        <button className="text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-white hover:text-black h-9 px-3 rounded-full w-24 pl-4"> LinkedIn </button>
         
          <button className="text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-white hover:text-black h-9 px-3 rounded-full w-24 pr-4"> GitHut </button>
          <div style={{width:'10px'}}></div>
        </NavbarContent>

      </NavbarContent>
     
     
    </Navbar>
  );
}
