import CircularImage from '../app/components/logo'
import ScrollComponent from '../app/components/scroll-main'
import RectangleComponent from '../app/components/rectangulo'
//</main><main className="flex min-h-screen flex-col items-center justify-between p-24">

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24"> 
    <h1 > BTM Studio</h1>
    <CircularImage src={'/logo.png'} alt={'BTM Studio logo'} />
    <ScrollComponent/>

    </main>
  )
}
