'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EntretienAnnuelPage1, EntretienAnnuelPage2, EntretienAnnuelPage3  } from '@/types/formulaires';

export default function EntretienAnnuelPage() {
//   const [currentPage, setCurrentPage] = useState(1);
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3>(1);
  
  const { register, handleSubmit, formState: { errors } } = useForm<EntretienAnnuelPage1>();
  const { register: register2, handleSubmit: handleSubmit2 } = useForm<EntretienAnnuelPage2>();
  const { register: register3, handleSubmit: handleSubmit3 } = useForm<EntretienAnnuelPage3>();

  const PageNavigation = () => (
    <div className="mb-6 pb-4 border-b flex gap-2">
      <button
        type="button"
        onClick={() => setCurrentPage(1)}
        className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        Page 1
      </button>
      <button
        type="button"
        onClick={() => setCurrentPage(2)}
        className={`px-4 py-2 rounded ${currentPage === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        Page 2
      </button>
      <button
        type="button"
        onClick={() => setCurrentPage(3)}
        className={`px-4 py-2 rounded ${currentPage === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        Page 3
      </button>
    </div>
  );

  const FormActions = ({ 
    currentPage, 
    setCurrentPage, 
    onSave 
  }: { 
    currentPage: 1 | 2 | 3; 
    setCurrentPage: (page: 1 | 2 | 3) => void; 
    onSave: () => void 
  }) => (
    <div className="mt-8 pt-4 border-t flex justify-between">
      {currentPage > 1 && (
        <button 
          type="button"
          onClick={() => setCurrentPage((currentPage - 1) as 1 | 2 | 3)}
          className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
        >
          Précédent
        </button>
      )}
      
      <div className="flex gap-3 ml-auto">
        <button 
          type="button"
          onClick={onSave}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Enregistrer
        </button>
        
        {currentPage < 3 ? (
          <button 
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Suivant
          </button>
        ) : (
          <button 
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Valider le formulaire
          </button>
        )}
      </div>
    </div>
  );

  const onSubmitPage1 = (data: EntretienAnnuelPage1) => {
    console.log('Page 1:', data);
    setCurrentPage(2);
  };

  

  const onSubmitPage2 = (data: EntretienAnnuelPage2) => {
    console.log('Page 2:', data);
    setCurrentPage(3);
  };



  const onSubmitPage3 = (data: EntretienAnnuelPage3) => {
    console.log('Page 3:', data);
    // Validation finale ici plus tard
  };

  


  
  if (currentPage === 1) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white">
        <h1 className="text-xl font-bold text-center mb-8">Entretien Annuel d'Appréciation</h1>

        <PageNavigation />
        
        <form onSubmit={handleSubmit(onSubmitPage1)} className="space-y-6">
          {/* Collaborateur */}
          <div className="space-y-4">
            <h2 className="font-bold underline">Collaborateur :</h2>
            
            <div className="flex items-baseline gap-2">
              <span className="whitespace-nowrap">Nom, Prénom :</span>
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
              <span className="whitespace-nowrap">Fonction :</span>
              <input 
                {...register('collaborateur.fonction')}
                className="flex-1 border-b border-dotted border-gray-400 outline-none focus:border-gray-600 px-1"
              />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="whitespace-nowrap">Date d'entrée dans l'entreprise :</span>
              <input 
                type="date"
                {...register('collaborateur.dateEntree')}
                className="border-b border-dotted border-gray-400 outline-none focus:border-gray-600 px-1"
              />
            </div>
          </div>

          {/* Manager */}
          <div className="space-y-4 mt-8">
            <h2 className="font-bold underline">Responsable hiérarchique :</h2>
            
            <div className="flex items-baseline gap-2">
              <span className="whitespace-nowrap">Nom, Prénom :</span>
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
              <span className="whitespace-nowrap">Fonction :</span>
              <input 
                {...register('manager.fonction')}
                className="flex-1 border-b border-dotted border-gray-400 outline-none focus:border-gray-600 px-1"
              />
            </div>
          </div>

          {/* Date entretien */}
          <div className="flex items-baseline gap-2 mt-8">
            <span className="whitespace-nowrap">Date de l'entretien :</span>
            <input 
              type="date"
              {...register('dateEntretien')}
              className="border-b border-dotted border-gray-400 outline-none focus:border-gray-600 px-1"
            />
          </div>

          
            <FormActions 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage} 
              onSave={() => console.log('Save')} 
            />
        </form>
      </div>
    );
  } else if (currentPage === 2) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white">
        <h1 className="text-xl font-bold text-center mb-8">Entretien Annuel d'Appréciation</h1>

        <PageNavigation />
        
        <form onSubmit={handleSubmit2(onSubmitPage2)} className="space-y-6">
          <label className="block mb-2 font-semibold">
            Note pour les managers et les collaborateurs
          </label>
          <div className="text-sm space-y-2 bg-gray-50 p-4 rounded">
            <p>• L'Entretien Annuel d'Appréciation (EAA) est l'occasion de faire un point et de discuter avec le collaborateur à propos de son travail, de sa place et de son évolution chez Altim ; le collaborateur doit utiliser ce formulaire pour faire sa propre auto-évaluation avant l'entretien.</p>
            <p className="font-bold">• Le salarié doit envoyer le formulaire pré-rempli minimum 3 jours avant l'entretien.</p>
            <p>• Après l'EAA, ce document devra être signé par les 2 parties ; un scan sera remis au salarié et l'original au service RH.</p>
          </div>

          <div className="space-y-4">
            <h2 className="font-bold">1. Résumé de l'année</h2>
            
            <div>
              <label className="block mb-2">
                Nom du ou des Clients (ou Nom du service si Mission interne) dans l'ordre chronologique avec les mois associés :
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
                <span>Avez-vous mis votre Dossier Technique à jour ?</span>
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
                <span>Si oui, l'avez-vous transmis à votre manager ?</span>
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

          
            <FormActions 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage} 
              onSave={() => console.log('Save')} 
            />
        </form>
      </div>
    );
  } else if (currentPage === 3) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white">
        <h1 className="text-xl font-bold text-center mb-8">Entretien Annuel d'Appréciation</h1>

        <PageNavigation />
        
        <form onSubmit={handleSubmit3(onSubmitPage3)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="font-bold">2. Appréciation des objectifs de l'année passée</h2>
            
            <div className="text-sm bg-gray-50 p-4 rounded space-y-2">
              <p> Le salarié doit recopier dans la colonne « Missions de l'ordre de mission » tous les objectifs inscrits dans son (ou ses) ordre(s) de mission.</p>
              <p className="font-bold">Échelle de notation :</p>
              <ul className="space-y-1 ml-4">
                <li><strong>4 :</strong> Performance supérieure aux attentes : dépasse les performances attendues, les résultats sont de très grande qualité.</li>
                <li><strong>3 :</strong> Performance correspondant pleinement aux besoins du poste : atteint systématiquement les attentes.</li>
                <li><strong>2 :</strong> Performance acceptable qui nécessite une amélioration sur un ou plusieurs points essentiels.</li>
                <li><strong>1 :</strong> Performance insuffisante par rapport aux besoins du poste.</li>
              </ul>
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Objectifs de l'ordre de mission (ou des ordres de mission de l'année)
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
                <label className="block mb-2 font-semibold">Notation globale - Collaborateur</label>
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

              <div>
                <label className="block mb-2 font-semibold">Notation globale - Manager</label>
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
              <label className="block mb-2 font-semibold">
                Commentaires du collaborateur (Détails, Exemples et Principaux points forts ou points à améliorer)
              </label>
              <textarea
                {...register3('commentairesCollaborateur')}
                rows={4}
                className="w-full border border-gray-300 p-3 rounded outline-none focus:border-gray-600"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Commentaires du manager (Détails, Exemples et Principaux points forts ou points à améliorer)
              </label>
              <textarea
                {...register3('commentairesManager')}
                rows={4}
                className="w-full border border-gray-300 p-3 rounded outline-none focus:border-gray-600"
              />
            </div>

            
          </div>

            <FormActions 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage} 
              onSave={() => console.log('Save')} 
            />
        </form>
      </div>
    );
  }


  return <div>Page {currentPage}</div>;
}