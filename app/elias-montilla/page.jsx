'use client'
import Image from "next/image"
import RectangleComponent from "../components/rectangulo"
import Navbartwo from '../components/navbartwo'
import Information from '../components/information'

export default function Home() {
 const boxStyle = {
    height: 'auto',
    width: '80%',
    background: 'rgba(41, 41, 38, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(6px)',
    borderRadius: '20px',
    padding: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}
  return (
  
    <main className="flex  flex-col items-center justify-between overflow-hidden h-screen ">

    <div >
    <div className="background blue-purple"></div>
    <div className="background green-blue"></div>
    
    <div>
            <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
    
    </div >  
 
    
            
  </div>
   <Navbartwo/>

            <br />
            <div style={{ display:'flex', justifyContent:'center'}}>
                
        <button id="button" onClick={() => window.open('https://wa.me/+17865665069?text=Great%20job!', '_blank')}> <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px" clipRule="evenodd"><path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"/><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"/><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"/><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"/><path fill="#fff" fillRule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clipRule="evenodd"/></svg>  Contact me now!</button>
            </div>
    <br />
    <div className="flex-grow overflow-auto w-full h-full flex flex-col items-center "> 
    <div style={{height:'200px'}}>  <br /></div>
            <div style= {boxStyle}  className="flex flex-col lg:flex-row items-center justify-center">
                 <br />
            <h1 style={{ marginLeft:'10px', marginRight:'10px' ,color: '#57EBFF', textShadow: '2px 2px 4px #000000',textAlign: 'center', fontSize: '1.5em'  }}>Welcome,</h1>
            <br />
<p className='text-white text-lg' >The next thing you&apos;re going to see is a summary of my experience as a web and mobile app developer</p>
<br />
            </div>
            <br />
            <div style= {boxStyle}>
   
   <Information/>
      
   </div>
            <br />
    
            <div style= {boxStyle} className="flex flex-col lg:flex-row items-center justify-center">
            <Image  src={'/flutter.webp'} alt="Flutter Icon"  width={140} height={140}/> 
              <p className="text-white text-lg">     I got to know Flutter due to the need to create applications for Android and iOS. There were other alternatives, but the reason I chose to learn and specialize in Flutter was because of its organized community, the continuous maintenance and updates that the framework receives, and how impressively well it works on Android and iOS. Above all reasons, the ease and speed of creating beautiful applications, comfortable for the end user to handle, and with wide design flexibility that allows you to implement any attractive and modern design.</p>
            </div>
  <br />
           
            <div style= {boxStyle} >
                <p className="text-white text-lg"> I met Flutter in 2020, I started programming 10 years ago in college in c++, then I was learning to create video games and it was in 2022 that I managed to publish my first video game on the google play currently available, it was made with the Game Maker 1.49 graphics engine and updated to Game Maker 2 so that the application was available for modern architectures.</p>
            
            </div>
            <br />
            <div style= {boxStyle} >
            <Image className=" rounded-lg "  src={'/juego.webp'} alt="3g Fire Ball screenshot"  layout="responsive"
  width={1200} 
  height={800}/> 
   </div>
   <br />
   <div style= {boxStyle} className="flex flex-col lg:flex-row items-center justify-center">
    <Image className=" rounded-lg p-2" src={'/icono-juego.webp'} alt="Go to Google Play" width={120} height={120}/> 
    <p className="text-white text-lg pr-6" >In the process of publishing my game, I began to learn about Android. Thanks to my previous programming knowledge, it was very easy for me to learn to create Android applications. Later, I moved on to Flutter and have been using it to this day. </p>
   </div>
   <br />
   <div style= {boxStyle}>
    <p className="text-white text-lg pr-6" >Day by day I program, I have personal projects that I need to maintain, I teach classes providing support to other programmers, I have done several jobs as a Freelancer finding solutions by connecting APIs, setting up servers, finding faults in the programming logic…</p>
   </div>
   <br />
   <div className="flex flex-col lg:flex-row items-center justify-center lg:space-y-0 lg:space-x-4 space-y-4" >
        <Image className=" rounded-lg " src="/img1.webp" alt="screenshot app mobile" width={220} height={260}  />
        <Image className=" rounded-lg " src="/img2.webp" alt="screenshot app mobile" width={220} height={260}   />
        <Image className="  rounded-lg " src="/img3.webp" alt="screenshot app mobile"  width={220} height={260}  />
        <Image className="  rounded-lg " src="/img4.webp" alt="screenshot app mobile" width={220} height={260}   />
    </div>
    <br /> 
      <div style= {boxStyle}>
        <p className="text-white text-lg pr-6"> I purchased five Flutter courses, completed them, totaling over 120 hours of Flutter content. It took me 4 months to finish, during which I created more than 24 apps. Explored various functionalities including REST APIs, maps, sensors, databases, and connections to Firebase, Supabase, and AWS. 🚀📱💡</p>
      </div>
      <br /> 
   


   <br /> <br />
   <br />
   <br />
   <br />
            </div>
  </main>

  )
}