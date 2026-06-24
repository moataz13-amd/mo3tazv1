import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectsAPI } from '../lib/api';
import FloatingNav from '../components/navigation/FloatingNav';
import type { Project } from '../types';

export default function ProjectDesigns() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const stateProject = (location.state as { project?: Project })?.project;
  const [project, setProject] = useState<Project | null>(stateProject || null);
  const [loading, setLoading] = useState(!stateProject);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    if (stateProject) return;
    setLoading(true);
    projectsAPI.getById(id).then((res) => {
      setProject(res.data as Project);
    }).catch(() => {
      navigate('/', { replace: true });
    }).finally(() => setLoading(false));
  }, [id, navigate, stateProject]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816]">
        <div className="spinner mx-auto mb-4" />
      </div>
    );
  }

  if (!project) return null;

  const images = project.images || [];
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen bg-[#050816] text-white" dir="rtl">
      <FloatingNav projectTitle={project.title} />

      {/* Content */}
      <main className="pt-28 md:pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Project info */}
        <div className="mb-10 text-center">
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">{project.description}</p>
        </div>

        {!hasImages ? (
          <div className="text-center py-20 text-gray-500 font-bold" style={{ fontFamily: "'Sahara Bold', sans-serif" }}>
            لا توجد تصميمات في هذا المشروع
          </div>
        ) : (
          <div className="columns-1 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {images.map((imgUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                onClick={() => setLightboxIndex(index)}
                className="cursor-pointer group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#00E5FF]/40 transition-all duration-300"
                style={{
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                }}
              >
                <img
                  src={imgUrl}
                  alt={`${project.title} - ${index + 1}`}
                  className="w-full h-auto"
                  loading="lazy" decoding="async"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white/80 text-sm font-bold bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                    اضغط للتكبير
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full border-2 border-black bg-white text-black flex items-center justify-center shadow-[2px_2px_0px_#000000] hover:scale-105 cursor-pointer z-50"
            >
              <X size={20} />
            </button>

            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
                }}
                className="absolute left-6 w-12 h-12 rounded-full border-2 border-black bg-[#26EFFD] text-black flex items-center justify-center shadow-[3px_3px_0px_#000000] hover:scale-105 cursor-pointer z-50"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[95vw] max-h-[90vh] relative border-4 border-black rounded-2xl md:rounded-3xl overflow-hidden bg-white shadow-[8px_8px_0px_#000000]"
            >
              <img
                src={images[lightboxIndex]}
                alt="Enlarged design"
                className="max-w-full max-h-[90vh] object-contain"
                loading="lazy" decoding="async"
              />
            </motion.div>

            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % images.length);
                }}
                className="absolute right-6 w-12 h-12 rounded-full border-2 border-black bg-[#26EFFD] text-black flex items-center justify-center shadow-[3px_3px_0px_#000000] hover:scale-105 cursor-pointer z-50"
              >
                <ChevronRight size={24} />
              </button>
            )}

            <div className="absolute bottom-6 bg-black/60 px-4 py-1.5 rounded-full text-white text-xs font-black">
              {lightboxIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
