/**
 * v0 by Vercel.
 * @see https://v0.dev/t/7qKRxC3yLvE
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Information() {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
         
          <div className="space-y-4">
           
            <div className="space-y-2">
              <h2 className="text-lg font-semibold tracking-wide uppercase text-white">About Me</h2>
              <p className="text-sm leading-loose md:text-base text-white">
              My experience has largely been in finding solutions and developing features for existing products. I am very good at team communication, very responsible and disciplined. I currently work with a freelancer and I also teach classes through a web platform where I teach flutter and other technologies. Based on my experience, it is very easy for me to learn any new technology. I am not intimidated by learning and taking on challenges.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold tracking-wide uppercase text-white">Skills</h2>
              <ul className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 md:text-base">
                <li className="text-white" >JavaScript</li>
                <li className="text-white"  >React.js</li>
                <li className="text-white" >Node.js</li>
                <li className="text-white" >HTML/CSS</li>
                <li className="text-white" >Next.js</li>
                <li className="text-white" >Flutter</li>
                <li className="text-white" >Git</li>
                <li className="text-white" >RESTful APIs</li>
                <li className="text-white" >Supabase</li>
                <li className="text-white" >Firebase</li>
                <li className="text-white" >SQL</li>
                <li className="text-white" >Agile Methodology Scrum</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="space-y-4 border-t lg:pt-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Work Experience</h2>
            <ul className="space-y-4 list-none">
              <li>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white">Flutter developer</h3>
                  <p className="text-sm text-gray-200 dark:text-gray-200 ">Netforemost 2023-2024</p>
                  <p className="text-sm leading-loose md:text-base text-white">
                  Initial configuration of a cross-platform project, state manager block and riverpod
                  </p>
                </div>
              </li>
              <li>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white">CEO</h3>
                  <p className="text-sm text-gray-200 dark:text-gray-200">BTM Studio 2020</p>
                  <p className="text-sm leading-loose md:text-base text-white">
                  Startup dedicated to the development and marketing of digital products
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Education</h2>
            <ul className="space-y-4 list-none">
              <li>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white">Systems Engineering</h3>
                  <p className="text-sm text-gray-200 dark:text-gray-200">University of Andes ULA Mérida Venezuela</p>
                  <p className="text-sm text-white">2013 - 2024</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Projects</h2>
            <ul className="space-y-4 list-none">
              <li>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white">Ok Gastos</h3>
                  <p className="text-sm text-white">
                  A personal finance app using Flutter, SQLite, and GetX
                  </p>
                </div>
              </li>
              <li>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white">TaskFlow</h3>
                  <p className="text-sm text-white">
                  An app for project management developed in collaboration with other developers, where we worked together for approximately 4 months and used Firebase and Riverpod.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
  
  