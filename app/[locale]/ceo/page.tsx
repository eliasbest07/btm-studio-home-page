"use client"
import React, { useState } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Code, 
  Globe, 
  Award, 
  Rocket,
  ChevronDown,
  ChevronUp,
  MapPin,
  Mail,
  ExternalLink
} from 'lucide-react';

const ProfileCard = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section with Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 mb-6">
          {/* Profile Image Card */}
          <div className="flex justify-center lg:justify-start">
            <div
              className="rounded-2xl overflow-hidden w-80 h-96"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <div className="relative w-full h-full overflow-hidden group">
                <img
                  src="/background.webp"
                  alt="Elias Montilla - Professional Portrait"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div>
                    <h3 className="text-lg font-bold mb-1">
                      Elias Montilla
                    </h3>
                    <p className="text-sm text-gray-200">
                      Full Stack Developer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Header Info */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(to right, rgba(146, 64, 14, 0.2), rgba(194, 65, 12, 0.2), rgba(133, 77, 14, 0.2))",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <div className="relative p-8 md:p-12">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                      Elias Montilla
                    </h1>
                    <p className="text-xl text-amber-100 mb-4">
                      Full Stack Developer & Founder
                    </p>
                    <div className="flex flex-wrap gap-4 text-white/90">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">San Antonio, Texas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">ahoraesbest@gmail.com</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href="https://btm-studio.com/elias-montilla"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 rounded-2xl px-6 py-3 flex items-center gap-2 text-white font-semibold group"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Ver Portfolio</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Status indicators */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-white">CEO @ BTM Studio</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-white">Disponible para asesorías desde $20 por hora</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tagline Card */}
        <div className="mb-6">
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: "linear-gradient(to right, rgba(217, 119, 6, 0.2), rgba(249, 115, 22, 0.2), rgba(202, 138, 4, 0.2))",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transformando Ideas en Soluciones Digitales
            </h2>
            <p className="text-lg md:text-xl text-white/90">
              Desarrollador Full-Stack especializado en crear experiencias excepcionales para web y móvil
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - About & Skills */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Me Section */}
            <div
              className="rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl p-3">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Sobre Mí</h2>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-cyan-300 leading-relaxed mb-4">
                  Soy un <strong>desarrollador full-stack</strong> especializado en <strong>Flutter</strong> y tecnologías web modernas. Mi trayectoria comenzó hace 10 años programando en C++ en la universidad, y desde entonces he evolucionado constantemente, explorando desde el desarrollo de videojuegos hasta aplicaciones empresariales complejas.
                </p>
                <p className="text-cyan-300 leading-relaxed mb-4">
                  En 2020 fundé <strong>BTM Studio</strong>, donde he liderado el desarrollo de múltiples productos digitales. Mi experiencia abarca desde la configuración inicial de proyectos hasta la implementación de features complejas, siempre con un enfoque en la calidad y la experiencia del usuario.
                </p>
                <p className="text-cyan-300 leading-relaxed">
                  He completado más de <strong>120 horas de cursos especializados en Flutter</strong>, creando más de <strong>24 aplicaciones</strong> que exploran diversas funcionalidades: REST APIs, mapas, sensores, bases de datos, y conexiones a servicios cloud como Firebase, Supabase y AWS. Mi filosofía es simple: aprendizaje continuo y nunca dejar que los desafíos me intimiden.
                </p>
              </div>
            </div>

            {/* Company Section */}
            <div
              className="rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-orange-600 to-amber-700 rounded-xl p-3">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Mi Empresa</h2>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">BTM Studio</h3>
                <p className="text-cyan-600 leading-relaxed mb-3">
                  Fundador y CEO desde 2020. Startup dedicada al desarrollo y comercialización de productos digitales innovadores.
                </p>
                <p className="text-cyan-600 leading-relaxed">
                  En BTM Studio nos especializamos en crear soluciones móviles y web de alta calidad, desde aplicaciones de finanzas personales hasta herramientas empresariales de gestión de tiempo y productividad.
                </p>
              </div>
            </div>

            {/* Decorative Divider - Code/Development Theme */}
            <div
              className="relative h-64 rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to right, rgba(41, 37, 36, 0.2), rgba(120, 53, 15, 0.2), rgba(41, 37, 36, 0.2))"
                }}
              >
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 gap-4 p-8 font-mono text-amber-400 text-xs">
                    {[...Array(40)].map((_, i) => (
                      <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                        {Math.random() > 0.5 ? '01' : '10'}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <Code className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-2xl font-bold mb-2">Código que Transforma</h3>
                    <p className="text-gray-300">Convirtiendo visiones en realidad digital</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div
              className="rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-xl p-3">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Experiencia</h2>
                </div>
                <button 
                  onClick={() => toggleSection('experience')}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {expandedSection === 'experience' ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              
              <div className={`space-y-4 ${expandedSection === 'experience' ? '' : 'max-h-64 overflow-hidden'}`}>
                <ExperienceItem 
                  title="CEO & Fundador"
                  company="BTM Studio"
                  period="2020 - Presente"
                  description="Startup dedicada al desarrollo y comercialización de productos digitales. Liderazgo en desarrollo de múltiples aplicaciones móviles y web, gestión de proyectos y clientes."
                />
                <ExperienceItem 
                  title="Desarrollador Flutter"
                  company="Netforemost"
                  period="2023-2024"
                  description="Configuración inicial de proyectos cross-platform, implementación de state management con BLoC y Riverpod, desarrollo de features para aplicaciones existentes."
                />
                <ExperienceItem 
                  title="Freelancer & Profesor"
                  company="Independiente"
                  period="2020 - Presente"
                  description="Enseñanza de Flutter y otras tecnologías a través de plataformas web. Desarrollo de soluciones personalizadas para clientes, conexión de APIs, configuración de servidores, y resolución de problemas de lógica de programación."
                />
                <ExperienceItem 
                  title="Trabajador de Almacén"
                  company="Home Depot"
                  period="Abril 2025 - Presente"
                  location="San Antonio, Texas"
                  description="Servicio integral al cliente incluyendo entrega de productos, procesamiento de devoluciones y cumplimiento de garantías. Gestión de operaciones logísticas, control de inventario y cumplimiento de órdenes."
                />
                <ExperienceItem 
                  title="Conductor Uber"
                  company="Uber Technologies"
                  period="Enero 2025 - Presente"
                  location="San Antonio, Texas"
                  description="Alcanzado estatus Diamond a través de confiabilidad y excelencia consistente. Mantenimiento de 100% tasa de completitud demostrando gestión de tiempo y servicio al cliente excepcionales."
                />
                <ExperienceItem 
                  title="Mesero de Banquetes"
                  company="Kimpton Santo Hotel"
                  period="Agosto - Diciembre 2024"
                  location="San Antonio, Texas"
                  description="Cumplimiento consistente de todos los plazos de servicio en ambiente de alta presión. Entrega de servicio excepcional durante eventos y ocasiones especiales."
                />
              </div>
            </div>

            {/* Decorative Divider - Flutter Theme */}
            <div
              className="relative h-64 rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom right, rgba(217, 119, 6, 0.2), rgba(249, 115, 22, 0.2), rgba(202, 138, 4, 0.2))"
                }}
              >
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 400 400">
                    <g className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '20s' }}>
                      <polygon points="200,50 350,200 200,350 50,200" fill="white" opacity="0.3"/>
                    </g>
                  </svg>
                </div>
                <div className="relative z-10 flex items-center justify-center h-full px-8">
                  <div className="text-center text-white">
                    <div className="flex justify-center gap-2 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📱</span>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">💻</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Cross-Platform Excellence</h3>
                    <p className="text-amber-100">120+ horas dominando Flutter • 24+ apps creadas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Section */}
            <div
              className="rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl p-3">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Proyectos Destacados</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <ProjectCard 
                  title="Total-Time.app"
                  description="Herramienta de gestión de tiempo inteligente desarrollada con Next.js para equipos remotos, con tracking de tiempo, pizarra colaborativa visual y análisis de productividad. Permite a los equipos organizar su día visualmente y demostrar productividad de manera transparente."
                  tags={['Next.js', 'React', 'Time Tracking', 'Analytics']}
                  gradient="from-amber-600 to-orange-600"
                  featured={true}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProjectCard 
                    title="Repuestos Mérida"
                    description="Aplicación móvil completa para gestión de repuestos automotrices. Facilita la búsqueda, catalogación y venta de repuestos con interfaz intuitiva para usuarios."
                    tags={['Flutter', 'Mobile', 'E-commerce']}
                    gradient="from-orange-600 to-red-600"
                  />
                  <ProjectCard 
                    title="Ok Gastos"
                    description="App de finanzas personales con Flutter que permite rastrear gastos, crear presupuestos y visualizar patrones de gasto. Almacenamiento local con SQLite y gestión de estado con GetX."
                    tags={['Flutter', 'SQLite', 'GetX', 'Finance']}
                    gradient="from-yellow-600 to-amber-600"
                  />
                  <ProjectCard 
                    title="TaskFlow"
                    description="Aplicación de gestión de proyectos desarrollada colaborativamente durante 4 meses. Implementa Firebase para backend y Riverpod para state management, permitiendo colaboración en tiempo real."
                    tags={['Flutter', 'Firebase', 'Riverpod', 'Collaboration']}
                    gradient="from-red-600 to-orange-700"
                  />
                  <ProjectCard 
                    title="3g Fire Ball"
                    description="Tu primer videojuego publicado en Google Play Store. Desarrollado con Game Maker y actualizado a Game Maker 2 para compatibilidad con arquitecturas modernas de Android."
                    tags={['Game Maker', 'Android', 'Gaming']}
                    gradient="from-amber-700 to-yellow-700"
                  />
                </div>
              </div>
            </div>

            {/* Decorative Divider - Achievement Theme */}
            <div
              className="relative h-48 rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to right, rgba(180, 83, 9, 0.2), rgba(234, 88, 12, 0.2), rgba(220, 38, 38, 0.2))"
                }}
              >
                <div className="relative z-10 flex items-center justify-center h-full px-8">
                  <div className="text-center text-white">
                    <Award className="w-12 h-12 mx-auto mb-3 animate-bounce" />
                    <h3 className="text-xl font-bold">Una Década de Innovación</h3>
                    <p className="text-sm text-white/90 mt-2">De C++ a Flutter, un viaje de constante evolución</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="bg-gradient-to-br from-stone-800 to-amber-900 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Rocket className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Mi Trayectoria</h2>
              </div>
              <div className="space-y-4">
                <TimelineItem 
                  year="2015"
                  title="Inicios en Programación"
                  description="Comencé mi viaje hace 10 años en la universidad con C++, estableciendo las bases de mi carrera en desarrollo."
                />
                <TimelineItem 
                  year="2020"
                  title="Descubriendo Flutter"
                  description="Conocí Flutter por la necesidad de crear aplicaciones Android e iOS. Me especialicé gracias a su comunidad organizada y facilidad para crear interfaces atractivas."
                />
                <TimelineItem 
                  year="2020"
                  title="Fundación de BTM Studio"
                  description="Creé mi propia startup dedicada al desarrollo y comercialización de productos digitales."
                />
                <TimelineItem 
                  year="2022"
                  title="Primer Videojuego Publicado"
                  description="Publiqué 3g Fire Ball en Google Play, mi primer videojuego completo desarrollado con Game Maker."
                />
                <TimelineItem 
                  year="2023-2024"
                  title="Experiencia Profesional"
                  description="Trabajé como Desarrollador Flutter en Netforemost, adquiriendo experiencia con proyectos empresariales complejos."
                />
                <TimelineItem 
                  year="2025"
                  title="Nueva Etapa en Texas"
                  description="Me establecí en San Antonio, Texas, continuando mi carrera en desarrollo mientras contribuyo en diferentes sectores."
                />
              </div>
            </div>
          </div>

          {/* Right Column - Skills & Education */}
          <div className="space-y-6">
            {/* Skills Section */}
            <div
              className="rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-orange-600 to-amber-700 rounded-xl p-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Habilidades</h2>
              </div>
              
              <div className="space-y-4">
                <SkillCategory 
                  title="Frontend"
                  skills={['JavaScript', 'React.js', 'Next.js', 'HTML/CSS', 'Flutter']}
                  color="orange"
                />
                <SkillCategory 
                  title="Backend"
                  skills={['Node.js', 'RESTful APIs', 'Firebase', 'Supabase', 'SQL']}
                  color="amber"
                />
                <SkillCategory 
                  title="Herramientas"
                  skills={['Git', 'Scrum', 'Excel']}
                  color="yellow"
                />
                <SkillCategory 
                  title="Idiomas"
                  skills={['Español (Nativo)', 'Inglés (Proficiente)']}
                  color="red"
                />
              </div>
            </div>

            {/* Education Section */}
            <div
              className="rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl p-3">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Educación</h2>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-800 mb-1 text-lg">Ingeniería de Sistemas</h3>
                <p className="text-sm text-gray-600 mb-2 font-medium">Universidad de Los Andes (ULA)</p>
                <p className="text-sm text-gray-500 mb-1">📍 Mérida, Venezuela</p>
                <p className="text-sm text-gray-500 mb-3">📅 2013 - 2024</p>
                <div className="mt-4 pt-4 border-t border-amber-200">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Áreas de enfoque:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Programación y Desarrollo de Software</li>
                    <li>• Gestión de Bases de Datos</li>
                    <li>• Análisis de Sistemas</li>
                    <li>• Administración de Redes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Strengths Section */}
            <div className="bg-gradient-to-br from-amber-700 to-orange-800 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Fortalezas</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-amber-300 mt-1">✦</span>
                  <span>Aprendizaje rápido de nuevas tecnologías</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-300 mt-1">✦</span>
                  <span>Excelente comunicación en equipo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-300 mt-1">✦</span>
                  <span>Responsable y disciplinado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-300 mt-1">✦</span>
                  <span>Solución efectiva de problemas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-300 mt-1">✦</span>
                  <span>No intimidan los desafíos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard number="120+" label="Horas de Cursos Flutter" />
          <StatCard number="24+" label="Apps Creadas" />
          <StatCard number="5+" label="Años de Experiencia" />
          <StatCard number="100%" label="Dedicación" />
        </div>
      </div>
    </div>
  );
};

// Helper Components
interface ExperienceItemProps {
  title: string;
  company: string;
  period?: string;
  location?: string;
  description?: string;
}

const ExperienceItem = ({ title, company, period, location, description }: ExperienceItemProps) => (
  <div className="border-l-4 border-amber-600 pl-4 py-2">
    <h4 className="font-semibold text-gray-800">{title}</h4>
    <p className="text-sm text-cyan-300">{company} {location && `• ${location}`}</p>
    {period && <p className="text-xs text-cyan-500 mt-1">{period}</p>}
    {description && <p className="text-sm text-cyan-300 mt-2">{description}</p>}
  </div>
);

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  featured?: boolean;
}

const ProjectCard = ({ title, description, tags, gradient, featured }: ProjectCardProps) => (
  <div
    className={`group rounded-xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer ${featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
    style={{
      background: "rgba(255, 255, 255, 0.2)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
    }}
  >
    <div className="flex items-start justify-between mb-3">
      <div className={`${featured ? 'w-16 h-16' : 'w-12 h-12'} bg-gradient-to-br ${gradient} rounded-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}>
        {featured && <span className="text-white text-2xl">⭐</span>}
      </div>
      {featured && (
        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Destacado
        </span>
      )}
    </div>
    <h4 className={`font-semibold text-gray-800 mb-2 ${featured ? 'text-lg' : ''}`}>{title}</h4>
    <p className="text-sm text-cyan-300 mb-3 leading-relaxed">{description}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag: string, index: number) => (
        <span key={index} className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

interface SkillCategoryProps {
  title: string;
  skills: string[];
  color: 'orange' | 'amber' | 'yellow' | 'red';
}

const SkillCategory = ({ title, skills, color }: SkillCategoryProps) => {
  const colorClasses: Record<string, string> = {
    orange: 'bg-orange-100 text-orange-700',
    amber: 'bg-amber-100 text-amber-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700'
  };

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill: string, index: number) => (
          <span key={index} className={`text-xs px-3 py-1 rounded-full ${colorClasses[color]}`}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

interface StatCardProps {
  number: string;
  label: string;
}

const StatCard = ({ number, label }: StatCardProps) => (
  <div
    className="rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
    style={{
      background: "rgba(0, 0, 0, 0.4)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
    }}
  >
    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-2">
      {number}
    </div>
    <div className="text-sm text-white">{label}</div>
  </div>
);

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
}

const TimelineItem = ({ year, title, description }: TimelineItemProps) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
        {year}
      </div>
      <div className="w-0.5 h-full bg-gradient-to-b from-amber-500 to-transparent mt-2"></div>
    </div>
    <div className="pb-8">
      <h4 className="font-semibold text-lg mb-1">{title}</h4>
      <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default ProfileCard;