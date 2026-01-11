'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { EntretienAnnuelPage1, EntretienAnnuelPage2, EntretienAnnuelPage3 } from '@/types/formulaires';
import { createEntretien, getEntretien, updatePage1, updatePage2, updatePage3, validerEntretien, downloadPDF, getTemplateTexts, getTextByKey, TemplateText } from '@/lib/api';
import { useSearchParams } from 'next/navigation'

function EntretienForm() {
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3>(1);
  const searchParams = useSearchParams()
  const [entretienId, setEntretienId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [texts, setTexts] = useState<TemplateText[]>([]);

  const { register, handleSubmit, reset: resetForm1 } = useForm<EntretienAnnuelPage1>();
  const { register: register2, handleSubmit: handleSubmit2, reset: resetForm2 } = useForm<EntretienAnnuelPage2>();
  const { register: register3, handleSubmit: handleSubmit3, reset: resetForm3 } = useForm<EntretienAnnuelPage3>();

  // useEffect(() => {
  //   document.title = 'Entretien'
  // }, [])
  
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      document.title = 'Entretien';
    }, 0);
  }

  // Charger les textes
  useEffect(() => {
    const loadTexts = async () => {
      const data = await getTemplateTexts();
      setTexts(data);
    };
    loadTexts();
  }, []);

  // Récupérer le paramètre id
  // useEffect(() => {
  //   const id = searchParams.get('id')
  //   if (id) {
  //     setEntretienId(parseInt(id))
  //   }
  // }, [searchParams])
  useEffect(() => {
  const id = searchParams.get('id')
  
  if (id) {
    // Mode édition
    setEntretienId(parseInt(id))
  } else {
    // Mode création uniquement si pas d'ID dans URL
    const initEntretien = async () => {
      try {
        const result = await createEntretien();
        setEntretienId(result.id);
      } catch (error) {
        console.error('Erreur création entretien:', error);
      }
    };
    initEntretien();
  }
}, [searchParams])

  // Fonctions de sauvegarde sans redirection
  const savePage1 = async (data: EntretienAnnuelPage1) => {
    if (!entretienId) return;
    try {
      await updatePage1(entretienId, {
        collaborateur_nom: data.collaborateur.nom,
        collaborateur_prenom: data.collaborateur.prenom,
        collaborateur_fonction: data.collaborateur.fonction,
        collaborateur_date_entree: data.collaborateur.dateEntree,
        manager_nom: data.manager.nom,
        manager_prenom: data.manager.prenom,
        manager_fonction: data.manager.fonction,
        date_entretien: data.dateEntretien,
      });
    } catch (error) {
      console.error('Erreur sauvegarde page 1:', error);
    }
  };

  const savePage2 = async (data: EntretienAnnuelPage2) => {
    if (!entretienId) return;
    try {
      await updatePage2(entretienId, {
        commentaire: data.clients,
        dossier_tech_a_jour: data.dossierTechniqueAJour === 'true' || data.dossierTechniqueAJour === true ? true : (data.dossierTechniqueAJour === 'false' || data.dossierTechniqueAJour === false ? false : undefined),
        dossier_tech_transmis: data.dossierTechniqueTransmis === 'true' || data.dossierTechniqueTransmis === true ? true : (data.dossierTechniqueTransmis === 'false' || data.dossierTechniqueTransmis === false ? false : undefined),
      });
    } catch (error) {
      console.error('Erreur sauvegarde page 2:', error);
    }
  };

  const savePage3 = async (data: EntretienAnnuelPage3) => {
    if (!entretienId) return;
    try {
      await updatePage3(entretienId, {
        objectif: data.objectifsMission,
        note_consultant: data.notationCollaborateur ? Number(data.notationCollaborateur) : undefined,
        commentaire_consultant: data.commentairesCollaborateur,
        note_manager: data.notationManager ? Number(data.notationManager) : undefined,
        commentaire_manager: data.commentairesManager,
      });
    } catch (error) {
      console.error('Erreur sauvegarde page 3:', error);
    }
  };


  // Créer un entretien au chargement
  // useEffect(() => {
  //   const initEntretien = async () => {
  //     if (entretienId) return;
  //     try {
  //       const result = await createEntretien();
  //       setEntretienId(result.id);
  //     } catch (error) {
  //       console.error('Erreur création entretien:', error);
  //     }
  //   };
  //   initEntretien();
  // }, []);

  // Charger les données quand on a l'ID
  useEffect(() => {
    if (!entretienId) return;
    
    const loadData = async () => {
      try {
        const data = await getEntretien(entretienId);
        
        if (data.page1) {
          resetForm1({
            collaborateur: {
              nom: data.page1.collaborateur_nom,
              prenom: data.page1.collaborateur_prenom,
              fonction: data.page1.collaborateur_fonction,
              dateEntree: data.page1.collaborateur_date_entree,
            },
            manager: {
              nom: data.page1.manager_nom,
              prenom: data.page1.manager_prenom,
              fonction: data.page1.manager_fonction,
            },
            dateEntretien: data.page1.date_entretien,
          });
        }

        if (data.page2) {
          resetForm2({
            clients: data.page2.commentaire || '',
            dossierTechniqueAJour: String(data.page2.dossier_tech_a_jour) as any,
            dossierTechniqueTransmis: data.page2.dossier_tech_transmis !== null ? String(data.page2.dossier_tech_transmis) as any : null,
          });
        }

        if (data.page3) {
          resetForm3({
            objectifsMission: data.page3.objectif || '',
            commentairesCollaborateur: data.page3.commentaire_consultant || '',
            commentairesManager: data.page3.commentaire_manager || '',
            notationCollaborateur: data.page3.note_consultant ? String(data.page3.note_consultant) as any : null,
            notationManager: data.page3.note_manager ? String(data.page3.note_manager) as any : null,
          });
        }
      } catch (error) {
        console.error('Erreur chargement données:', error);
      }
    };

    loadData();
  }, [entretienId, currentPage]);

  const onSubmitPage1 = async (data: EntretienAnnuelPage1) => {
    setLoading(true);
    await savePage1(data);
    setCurrentPage(2);
    setLoading(false);
  };

  const onSubmitPage2 = async (data: EntretienAnnuelPage2) => {
    setLoading(true);
    await savePage2(data);
    setCurrentPage(3);
    setLoading(false);
  };

  const onSubmitPage3 = async (data: EntretienAnnuelPage3) => {
    if (!entretienId) return;
    setLoading(true);
    try {
      await savePage3(data);
      await validerEntretien(entretienId);
      alert('Formulaire validé avec succès !');
    } catch (error) {
      console.error('Erreur validation:', error);
      alert('Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };


  const PageNavigation = () => {
    const handlePageChange = async (targetPage: 1 | 2 | 3) => {
      if (currentPage === 1) {
        await handleSubmit(savePage1)();
      } else if (currentPage === 2) {
        await handleSubmit2(savePage2)();
      } else if (currentPage === 3) {
        await handleSubmit3(savePage3)();
      }
      
      setCurrentPage(targetPage);
    };

    const handleDownloadPDF = async () => {
      if (!entretienId) {
        alert('Aucun entretien à télécharger');
        return;
      }
      
      try {
        await downloadPDF(entretienId);
      } catch (error: any) {
        if (error.response?.status === 400) {
          alert('L\'entretien doit être validé avant de générer le PDF');
        } else {
          alert('Erreur lors de la génération du PDF');
        }
        console.error('Erreur PDF:', error);
      }
    };

    return (
      <div className="mb-6 pb-4 border-b flex justify-between items-center">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(1)}
            className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Page 1
          </button>
          <button
            type="button"
            onClick={() => handlePageChange(2)}
            className={`px-4 py-2 rounded ${currentPage === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Page 2
          </button>
          <button
            type="button"
            onClick={() => handlePageChange(3)}
            className={`px-4 py-2 rounded ${currentPage === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Page 3
          </button>
        </div>
        
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Télécharger PDF
        </button>
      </div>
    );
  };

  if (currentPage === 1) {
    return (
      <div id="page-1" className="max-w-4xl mx-auto p-8 bg-white">
        {/* <h1 className="text-xl font-bold text-center mb-8">Entretien Annuel d'Appréciation</h1> */}
        <h1 className="text-xl font-bold text-center mb-8">
          {getTextByKey(texts, 'page1_title')}
        </h1>

        <PageNavigation />
        
        <form onSubmit={handleSubmit(onSubmitPage1)} className="space-y-6">
          {/* Collaborateur */}
          <div className="space-y-4">
            <h2 className="font-bold underline">{getTextByKey(texts, 'page1_collaborateur_label')}</h2>
            
            <div className="flex items-baseline gap-2">
              <span className="whitespace-nowrap">{getTextByKey(texts, 'page1_nom_prenom_label')}</span>
              <input 
                {...register('collaborateur.nom')}
                placeholder="Nom"
                className="flex-1 border-b border-dotted border-gray-400 outline-none focus:border-gray-600 px-1"
              />
              <input 
                {...register('collaborateur.prenom')}
                placeholder="Prénom"
                className="flex-1 border-b border-dotted border-gray-400 outline-none focus:border-gray-600 px-1"
              />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="whitespace-nowrap">{getTextByKey(texts, 'page1_fonction_label')}</span>
              <input 
                {...register('collaborateur.fonction')}
                className="flex-1 border-b border-dotted border-gray-400 outline-none focus:border-gray-600 px-1"
              />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="whitespace-nowrap">{getTextByKey(texts, 'page1_date_entree_label')}</span>
              <input 
                type="date"
                {...register('collaborateur.dateEntree')}
                className="border-b border-dotted border-gray-400 outline-none focus:border-gray-600 px-1"
              />
            </div>
          </div>

          {/* Manager */}
          <div className="space-y-4 mt-8">
            <h2 className="font-bold underline">{getTextByKey(texts, 'page1_manager_label')}</h2>
            
            <div className="flex items-baseline gap-2">
              <span className="whitespace-nowrap">{getTextByKey(texts, 'page1_nom_prenom_label')}</span>
              <input 
                {...register('manager.nom')}
                placeholder="Nom"
                className="flex-1 border-b border-dotted border-gray-400 outline-none focus:border-gray-600 px-1"
              />
              <input 
                {...register('manager.prenom')}
                placeholder="Prénom"
                className="flex-1 border-b border-dotted border-gray-400 outline-none focus:border-gray-600 px-1"
              />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="whitespace-nowrap">{getTextByKey(texts, 'page1_fonction_label')}</span>
              <input 
                {...register('manager.fonction')}
                className="flex-1 border-b border-dotted border-gray-400 outline-none focus:border-gray-600 px-1"
              />
            </div>
          </div>

          {/* Date entretien */}
          <div className="flex items-baseline gap-2 mt-8">
            <span className="whitespace-nowrap">{getTextByKey(texts, 'page1_date_entretien_label')}</span>
            <input 
              type="date"
              {...register('dateEntretien')}
              className="border-b border-dotted border-gray-400 outline-none focus:border-gray-600 px-1"
            />
          </div>

          <div className="mt-8 pt-4 border-t flex justify-between">
            {currentPage > 1 && (
              <button 
                type="button"
                onClick={async () => {
                  await handleSubmit2(savePage2)();
                  setCurrentPage(1);
                }}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
              >
                Précédent
              </button>
            )}
            
            <div className="flex gap-3 ml-auto">
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Sauvegarde...' : 'Suivant'}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  } else if (currentPage === 2) {
    return (
      <div id="page-2" className="max-w-4xl mx-auto p-8 bg-white">
        <h1 className="text-xl font-bold text-center mb-8">{getTextByKey(texts, 'page2_title')}</h1>

        <PageNavigation />
        
        <form onSubmit={handleSubmit2(onSubmitPage2)} className="space-y-6">
          <label className="block mb-2 font-semibold">
            {getTextByKey(texts, 'page2_note_manager_collab_label')}
          </label>
          <div className="text-sm space-y-2 bg-gray-50 p-4 rounded whitespace-pre-wrap">
            {getTextByKey(texts, 'page2_instructions')}
          </div>

          <div className="space-y-4">
            <h2 className="font-bold">{getTextByKey(texts, 'page2_resume_title')}</h2>
            
            <div>
              <label className="block mb-2">
                {getTextByKey(texts, 'page2_clients_label')}
              </label>
              <textarea
                {...register2('clients')}
                rows={6}
                className="w-full border border-gray-300 p-3 rounded outline-none focus:border-gray-600"
                placeholder="Ex: Client A (Janvier - Mars)&#10;Client B (Avril - Juin)..."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span>{getTextByKey(texts, 'page2_dossier_tech_label')}</span>
                  <label className="flex items-center gap-1">
                    <input 
                      type="radio" 
                      {...register2('dossierTechniqueAJour')} 
                      value="true"
                    />
                    OUI
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="radio" 
                      {...register2('dossierTechniqueAJour')} 
                      value="false"
                    />
                    NON
                  </label>
              </div>

              <div className="flex items-center gap-2">
                <span>{getTextByKey(texts, 'page2_dossier_transmis_label')}</span>
                <label className="flex items-center gap-1">
                  <input 
                    type="radio" 
                    {...register2('dossierTechniqueTransmis')} 
                    value="true"
                  />
                  OUI
                </label>
                <label className="flex items-center gap-1">
                  <input 
                    type="radio" 
                    {...register2('dossierTechniqueTransmis')} 
                    value="false"
                  />
                  NON
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t flex justify-between">
            <button 
              type="button"
              onClick={async () => {
                await handleSubmit2(savePage2)();
                setCurrentPage(1);
              }}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
            >
              Précédent
            </button>
            
            <button 
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Sauvegarde...' : 'Suivant'}
            </button>
          </div>
        </form>
      </div>
    );
  } else if (currentPage === 3) {
    return (
      <div id="page-3" className="max-w-4xl mx-auto p-8 bg-white">
        <h1 className="text-xl font-bold text-center mb-8">{getTextByKey(texts, 'page3_title')}</h1>

        <PageNavigation />
        
        <form onSubmit={handleSubmit3(onSubmitPage3)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="font-bold">{getTextByKey(texts, 'page3_appreciation_title')}</h2>

            
            
            <div className="text-sm bg-gray-50 p-4 rounded space-y-2 whitespace-pre-wrap">
              {getTextByKey(texts, 'page3_instructions')}
              <p className="font-bold">{getTextByKey(texts, 'page3_echelle_notation_title')}</p>
              <ul className="space-y-1 ml-4">
                <li>{getTextByKey(texts, 'page3_notation_4')}</li>
                <li>{getTextByKey(texts, 'page3_notation_3')}</li>
                <li>{getTextByKey(texts, 'page3_notation_2')}</li>
                <li>{getTextByKey(texts, 'page3_notation_1')}</li>
              </ul>
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                {getTextByKey(texts, 'page3_objectifs_label')}
              </label>
              <textarea
                {...register3('objectifsMission')}
                rows={4}
                className="w-full border border-gray-300 p-3 rounded outline-none focus:border-gray-600"
                placeholder="Recopiez vos objectifs..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-semibold">{getTextByKey(texts, 'page3_notation_collab_label')}</label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map(note => (
                    <label key={note} className="flex items-center gap-1">
                      <input 
                        type="radio" 
                        {...register3('notationCollaborateur')} 
                        value={note}
                      />
                      {note}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label>
                {getTextByKey(texts, 'page3_commentaires_collab_label')}
              </label>
              <textarea
                {...register3('commentairesCollaborateur')}
                rows={4}
                className="w-full border border-gray-300 p-3 rounded outline-none focus:border-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              <div>
                <label className="block mb-2 font-semibold">{getTextByKey(texts, 'page3_notation_manager_label')}</label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map(note => (
                    <label key={note} className="flex items-center gap-1">
                      <input 
                        type="radio" 
                        {...register3('notationManager')} 
                        value={note}
                      />
                      {note}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label>
                {getTextByKey(texts, 'page3_commentaires_manager_label')}
              </label>
              <textarea
                {...register3('commentairesManager')}
                rows={4}
                className="w-full border border-gray-300 p-3 rounded outline-none focus:border-gray-600"
              />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t flex justify-between">
            <button 
              type="button"
              onClick={async () => {
                await handleSubmit3(savePage3)();
                setCurrentPage(2);
              }}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
            >
              Précédent
            </button>
            
            <button 
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Validation...' : 'Valider le formulaire'}
            </button>
          </div>
        </form>
      </div>
    );
  }
  
  return <div>Chargement...</div>;
}

export default function EntretienAnnuelPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <EntretienForm />
    </Suspense>
  ); 
}