import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Users, 
  Code, 
  Database, 
  Smartphone, 
  Globe, 
  Server, 
  Shield,
  Edit3, 
  Save, 
  X, 
  Plus, 
  ImagePlus,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';

const TaskCards = () => {
  // Estilos del documento proporcionado
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
  };

  // Datos de ejemplo
  // Define Task type before this line if not already defined
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      companyName: "TechCorp",
      companyLogo: "https://via.placeholder.com/40x40/3b82f6/ffffff?text=TC",
      area: "Desarrollo Frontend",
      level: 3,
      technology: "React",
      techIcon: "code",
      product: "E-commerce Platform",
      productIcon: "globe",
      proposals: [
        {
          id: 1,
          user: {
            name: "Carlos Rodríguez",
            avatar: "https://via.placeholder.com/32x32/3b82f6/ffffff?text=CR",
            role: "Frontend Developer"
          },
          content: "Desarrollo de componentes reutilizables para la plataforma de e-commerce.",
          images: [],
          createdAt: "2024-01-15"
        },
        {
          id: 2,
          user: {
            name: "Ana García",
            avatar: "https://via.placeholder.com/32x32/10b981/ffffff?text=AG",
            role: "UI/UX Designer"
          },
          content: "Implementación de hooks personalizados y optimización del rendimiento.",
          images: [],
          createdAt: "2024-01-18"
        }
      ]
    },
    {
      id: 2,
      companyName: "DataSoft",
      companyLogo: "https://via.placeholder.com/40x40/10b981/ffffff?text=DS",
      area: "Backend Development",
      level: 5,
      technology: "Node.js",
      techIcon: "server",
      product: "Analytics Dashboard",
      productIcon: "database",
      proposals: [
        {
          id: 3,
          user: {
            name: "Miguel Torres",
            avatar: "https://via.placeholder.com/32x32/8b5cf6/ffffff?text=MT",
            role: "Backend Developer"
          },
          content: "Diseño de API RESTful con autenticación JWT.",
          images: [],
          createdAt: "2024-01-20"
        }
      ]
    }
  ]);

  const [editingProposal, setEditingProposal] = useState<EditingProposal | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Iconos para tecnologías
  interface User {
    name: string;
    avatar: string;
    role: string;
  }

  interface ProposalImage {
    id: number;
    src: string;
    position: 'inicio' | 'centro' | 'final' | 'center';
    placement: 'above' | 'below';
  }

  interface Proposal {
    id: number;
    user: User;
    content: string;
    images: ProposalImage[];
    createdAt: string;
  }

  interface Task {
    id: number;
    companyName: string;
    companyLogo: string;
    area: string;
    level: number;
    technology: string;
    techIcon: string;
    product: string;
    productIcon: string;
    proposals: Proposal[];
  }

  interface EditingProposal {
    taskId: number;
    proposalId: number;
  }

  type TechIconType = 'code' | 'database' | 'smartphone' | 'globe' | 'server' | 'shield';

  const getTechIcon = (iconType: TechIconType | string): React.ComponentType<{ size?: number; className?: string }> => {
    const icons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
      code: Code,
      database: Database,
      smartphone: Smartphone,
      globe: Globe,
      server: Server,
      shield: Shield
    };
    return icons[iconType] || Code;
  };

  // Manejar expansión de tareas
  interface ExpandedTasks {
    [taskId: number]: boolean;
  }

  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTasks((prev: ExpandedTasks) => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Agregar nueva propuesta
  interface NewProposalUser {
    name: string;
    avatar: string;
    role: string;
  }

  interface NewProposal {
    id: number;
    user: NewProposalUser;
    content: string;
    images: ProposalImage[];
    createdAt: string;
  }

  const addNewProposal = (taskId: number) => {
    const newProposal: NewProposal = {
      id: Date.now(),
      user: {
        name: "Usuario Actual",
        avatar: "https://via.placeholder.com/32x32/6b7280/ffffff?text=U",
        role: "Developer"
      },
      content: "Describe tu propuesta aquí...",
      images: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTasks((prevTasks: Task[]) => 
      prevTasks.map((task: Task) => 
        task.id === taskId 
          ? { ...task, proposals: [...task.proposals, newProposal] }
          : task
      )
    );

    setEditingProposal({ taskId, proposalId: newProposal.id });
  };

  // Guardar propuesta editada
  interface SaveProposalUser {
    name: string;
    avatar: string;
    role: string;
  }

  const saveProposal = (
    taskId: number,
    proposalId: number,
    newContent: string,
    newUser: SaveProposalUser
  ) => {
    setTasks((prevTasks: Task[]) => 
      prevTasks.map((task: Task) => 
        task.id === taskId 
          ? {
              ...task,
              proposals: task.proposals.map((proposal: Proposal) => 
                proposal.id === proposalId 
                  ? { ...proposal, content: newContent, user: newUser }
                  : proposal
              )
            }
          : task
      )
    );
    setEditingProposal(null);
  };

  // Eliminar propuesta
  interface DeleteProposalFn {
    (taskId: number, proposalId: number): void;
  }

  const deleteProposal: DeleteProposalFn = (taskId, proposalId) => {
    setTasks((prevTasks: Task[]) => 
      prevTasks.map((task: Task) => 
        task.id === taskId 
          ? {
              ...task,
              proposals: task.proposals.filter((proposal: Proposal) => proposal.id !== proposalId)
            }
          : task
      )
    );
  };

  // Manejar pegado de imágenes
  interface HandlePasteEvent extends React.ClipboardEvent<HTMLTextAreaElement> {}

  interface HandlePasteFn {
    (e: HandlePasteEvent, taskId: number, proposalId: number): void;
  }

  const handlePaste: HandlePasteFn = (e, taskId, proposalId) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          handleImageUpload(file, taskId, proposalId);
        }
      }
    }
  };

  // Subir imagen
  interface HandleImageUploadFile extends File {
    type: string;
  }

  interface HandleImageUploadEventTarget extends EventTarget {
    result: string;
  }

  interface ImageData {
    id: number;
    src: string;
    position: 'inicio' | 'centro' | 'final' | 'center';
    placement: 'above' | 'below';
  }

  const handleImageUpload = (
    file: HandleImageUploadFile, 
    taskId: number, 
    proposalId: number
  ): void => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const target = e.target as HandleImageUploadEventTarget;
        const imageData: ImageData = {
          id: Date.now(),
          src: target.result,
          position: 'centro', // inicio, centro, final
          placement: 'above' // above, below
        };

        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? {
                  ...task,
                  proposals: task.proposals.map(proposal => 
                    proposal.id === proposalId 
                      ? { ...proposal, images: [...proposal.images, imageData] }
                      : proposal
                  )
                }
              : task
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Cambiar posición de imagen
  interface UpdateImagePositionFn {
    (
      taskId: number,
      proposalId: number,
      imageId: number,
      position: 'inicio' | 'centro' | 'final' | 'center',
      placement: 'above' | 'below'
    ): void;
  }

  const updateImagePosition: UpdateImagePositionFn = (
    taskId,
    proposalId,
    imageId,
    position,
    placement
  ) => {
    setTasks((prevTasks: Task[]) => 
      prevTasks.map((task: Task) => 
        task.id === taskId 
          ? {
              ...task,
              proposals: task.proposals.map((proposal: Proposal) => 
                proposal.id === proposalId 
                  ? {
                      ...proposal,
                      images: proposal.images.map((img: ProposalImage) => 
                        img.id === imageId 
                          ? { ...img, position, placement }
                          : img
                      )
                    }
                  : proposal
              )
            }
          : task
      )
    );
  };

  // Eliminar imagen
  interface RemoveImageFn {
    (taskId: number, proposalId: number, imageId: number): void;
  }

  const removeImage: RemoveImageFn = (taskId, proposalId, imageId) => {
    setTasks((prevTasks: Task[]) => 
      prevTasks.map((task: Task) => 
        task.id === taskId 
          ? {
              ...task,
              proposals: task.proposals.map((proposal: Proposal) => 
                proposal.id === proposalId 
                  ? {
                      ...proposal,
                      images: proposal.images.filter((img: ProposalImage) => img.id !== imageId)
                    }
                  : proposal
              )
            }
          : task
      )
    );
  };

  // Componente para renderizar imágenes
  interface ImageRendererProps {
    images: ProposalImage[];
    position: 'inicio' | 'centro' | 'final' | 'center';
    placement: 'above' | 'below';
  }

  const ImageRenderer: React.FC<ImageRendererProps> = ({ images, position, placement }) => {
    const filteredImages = images.filter(img => 
      img.position === position && img.placement === placement
    );

    if (filteredImages.length === 0) return null;

    return (
      <div className={`flex flex-wrap gap-2 ${
        position === 'inicio' ? 'justify-start' : 
        position === 'centro' ? 'justify-center' : 'justify-end'
      }`}>
        {filteredImages.map(image => (
          <div key={image.id} className="relative group">
            <img 
              src={image.src} 
              alt="Propuesta" 
              className="max-w-xs max-h-48 object-cover rounded border"
            />
          </div>
        ))}
      </div>
    );
  };

  // Componente de propuesta editable
  const EditableProposal: React.FC<{ task: Task; proposal: Proposal }> = ({ task, proposal }) => {
    const [editContent, setEditContent] = useState(proposal.content);
    const [editUser, setEditUser] = useState(proposal.user);
    const isEditing = editingProposal?.taskId === task.id && editingProposal?.proposalId === proposal.id;

    if (isEditing) {
      return (
        <div className="rounded-lg p-4" style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(87, 235, 255, 0.3)'
        }}>
          {/* Información del usuario */}
          <div className="mb-3 space-y-2">
            <div className="flex items-center gap-2">
              <img 
                src={editUser.avatar} 
                alt={editUser.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) => setEditUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded font-semibold bg-gray-800 text-white border-gray-600 text-sm"
                  placeholder="Nombre del usuario"
                />
                <input
                  type="text"
                  value={editUser.role}
                  onChange={(e) => setEditUser(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full p-1 border rounded bg-gray-800 text-gray-300 border-gray-600 text-xs"
                  placeholder="Rol o posición"
                />
              </div>
            </div>
          </div>
          
          {/* Imágenes arriba */}
          <ImageRenderer images={proposal.images} position="inicio" placement="above" />
          <ImageRenderer images={proposal.images} position="centro" placement="above" />
          <ImageRenderer images={proposal.images} position="final" placement="above" />
          
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onPaste={(e) => handlePaste(e, task.id, proposal.id)}
            className="w-full p-3 border rounded-lg h-32 resize-none bg-gray-800 text-white border-gray-600"
            placeholder="Pega imágenes directamente aquí o escribe tu propuesta..."
          />
          
          {/* Imágenes abajo */}
          <ImageRenderer images={proposal.images} position="inicio" placement="below" />
          <ImageRenderer images={proposal.images} position="centro" placement="below" />
          <ImageRenderer images={proposal.images} position="final" placement="below" />

          {/* Gestión de imágenes */}
          {proposal.images.length > 0 && (
            <div className="mt-3 p-2 rounded" style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h5 className="text-sm font-medium mb-2 text-white">Imágenes ({proposal.images.length})</h5>
              <div className="space-y-2">
                {proposal.images.map(image => (
                  <div key={image.id} className="flex items-center gap-2 text-xs">
                    <img src={image.src} alt="" className="w-8 h-8 object-cover rounded" />
                    <select
                      value={image.position}
                      onChange={(e) => updateImagePosition(task.id, proposal.id, image.id, e.target.value as 'inicio' | 'centro' | 'final' | 'center', image.placement)}
                      className="px-2 py-1 border rounded bg-gray-700 text-white border-gray-600"
                    >
                      <option value="inicio">Inicio</option>
                      <option value="centro">Centro</option>
                      <option value="final">Final</option>
                    </select>
                    <select
                      value={image.placement}
                      onChange={(e) => updateImagePosition(task.id, proposal.id, image.id, image.position, e.target.value as 'above' | 'below')}
                      className="px-2 py-1 border rounded bg-gray-700 text-white border-gray-600"
                    >
                      <option value="above">Arriba</option>
                      <option value="below">Abajo</option>
                    </select>
                    <button
                      onClick={() => removeImage(task.id, proposal.id, image.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => saveProposal(task.id, proposal.id, editContent, editUser)}
              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              style={{ boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.35)' }}
            >
              <Save size={14} />
              Guardar
            </button>
            <button
              onClick={() => setEditingProposal(null)}
              className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              style={{ boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.35)' }}
            >
              <X size={14} />
              Cancelar
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageUpload(e.target.files[0], task.id, proposal.id);
                }
              }}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              style={{ boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.35)' }}
            >
              <ImagePlus size={14} />
              Subir
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-lg p-4 transition-all hover:shadow-lg" style={{
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="flex justify-between items-start mb-3">
          {/* Información del usuario */}
          <div className="flex items-center gap-3">
            <img 
              src={proposal.user.avatar} 
              alt={proposal.user.name}
              className="w-10 h-10 rounded-full border-2 border-cyan-400"
            />
            <div>
              <h4 className="font-semibold text-white text-sm">{proposal.user.name}</h4>
              <p className="text-xs text-gray-400">{proposal.user.role}</p>
            </div>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={() => setEditingProposal({ taskId: task.id, proposalId: proposal.id })}
              className="text-cyan-400 hover:text-cyan-300 p-1"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={() => deleteProposal(task.id, proposal.id)}
              className="text-red-400 hover:text-red-300 p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        
        <ImageRenderer images={proposal.images} position="inicio" placement="above" />
        <ImageRenderer images={proposal.images} position="centro" placement="above" />
        <ImageRenderer images={proposal.images} position="final" placement="above" />
        
        <p className="text-gray-300 mb-2 leading-relaxed">{proposal.content}</p>
        
        <ImageRenderer images={proposal.images} position="inicio" placement="below" />
        <ImageRenderer images={proposal.images} position="centro" placement="below" />
        <ImageRenderer images={proposal.images} position="final" placement="below" />
        
        <div className="flex justify-between items-center text-xs text-gray-400 mt-3 pt-2 border-t border-gray-600">
          <span>{proposal.createdAt}</span>
          {proposal.images.length > 0 && (
            <span>{proposal.images.length} imagen(es)</span>
          )}
        </div>
      </div>
    );
  };

  return (
<section className="min-h-screen text-white mb-4 mt-4 px-4">
          {tasks.map(task => {
            const TechIcon = getTechIcon(task.techIcon);
            const ProductIcon = getTechIcon(task.productIcon);
            const isExpanded = expandedTasks[task.id];
            
            return (
              <div key={task.id} style={boxStyle} className="w-full mb-4">
                <div className="w-full">
                  {/* Header de la tarea */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-4">
                        {/* Logo de la empresa */}
                        <img 
                          src={task.companyLogo} 
                          alt={task.companyName}
                          className="w-12 h-12 rounded-full border-2 border-white shadow"
                        />
                        
                        <div>
                          <h2 className="text-xl font-bold text-white">{task.companyName}</h2>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1 text-gray-300">
                              <Users size={16} />
                              {task.area}
                            </span>
                            <span className="bg-cyan-400 text-gray-900 px-2 py-1 rounded-full text-sm font-medium">
                              Nivel {task.level}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        {/* Icono de tecnología */}
                        <div className="text-center">
                          <div className="bg-white p-3 rounded-full shadow-md">
                            <TechIcon size={24} className="text-blue-600" />
                          </div>
                          <p className="text-xs text-gray-300 mt-1">{task.technology}</p>
                        </div>
                        
                        {/* Icono de producto (más grande) */}
                        <div className="text-center">
                          <div className="bg-white p-4 rounded-full shadow-lg border-2 border-cyan-400">
                            <ProductIcon size={32} className="text-indigo-600" />
                          </div>
                          <p className="text-sm font-medium text-white mt-2">{task.product}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botón de propuestas en esquina inferior derecha */}
                  <div className="relative">
                    <div className="absolute bottom-0 right-0">
                      <button
                        onClick={() => toggleTaskExpansion(task.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-gray-900 rounded-lg shadow-lg hover:bg-cyan-300 transition-all font-medium"
                        style={{
                          boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.35)',
                        }}
                      >
                        <span>
                          Propuestas ({task.proposals.length})
                        </span>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                    
                    {/* Espacio para el botón */}
                    <div className="h-12"></div>
                  </div>
                  
                  {/* Sección de propuestas */}
                  {isExpanded && (
                    <div className="mt-6 p-6 rounded-lg" style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">
                          Historial de Propuestas
                        </h3>
                        <button
                          onClick={() => addNewProposal(task.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                          style={{
                            boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.35)',
                          }}
                        >
                          <Plus size={18} />
                          Nueva Propuesta
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {task.proposals.map(proposal => (
                          <EditableProposal
                            key={proposal.id}
                            task={task}
                            proposal={proposal}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
    
        </section>
  );
};

export default TaskCards;