'use client';

import { useState, useEffect } from 'react';
import { getEntretiensList, EntretienListItem, downloadPDF, exportEntretiensCSV, deleteEntretien } from '@/lib/api';
import Link from 'next/link';


export default function AdminEntretiensPage() {
  const [entretiens, setEntretiens] = useState<EntretienListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (typeof document !== 'undefined') {
  //     document.title = 'Liste entretien'
  //   }
  // }, [])
  
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      document.title = 'Liste entretien';
    }, 0);
  }

  useEffect(() => {
    loadEntretiens();
  }, []);

  const loadEntretiens = async () => {
    setLoading(true);
    const data = await getEntretiensList();
    setEntretiens(data);
    setLoading(false);
  };

  const handleDownload = async (id: number) => {
    try {
      await downloadPDF(id);
    } catch (error: any) {
      if (error.response?.status === 400) {
        alert('L\'entretien doit être validé');
      } else {
        alert('Erreur téléchargement PDF');
      }
    }
  };

  // const handleDelete = async (id: number) => {
  //   if (!confirm('Supprimer cet entretien ?')) return;
    
  //   try {
  //     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/entretiens/${id}`, {
  //       method: 'DELETE'
  //     });
      
  //     // Recharger la liste
  //     setEntretiens(entretiens.filter(e => e.id !== id));
  //   } catch (error) {
  //     console.error('Erreur suppression:', error);
  //   }
  // };

  const handleDelete = async (id: number) => {
    if (!confirm(`Supprimer l'entretien ${id} ?`)) return;
    
    try {
      await deleteEntretien(id);
      setEntretiens(entretiens.filter(e => e.id !== id));
      alert(`Entretien ${id} supprimé avec succès`);
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  if (loading) return <div className="max-w-6xl mx-auto p-8">Chargement...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Liste des Entretiens</h1>
      <button
                onClick={async () => await exportEntretiensCSV()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Exporter CSV
            </button>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Num Entretien</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Date Entretien</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Fonction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Collaborateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Note Collab</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Commentaire Collab</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Fonction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Note Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Commentaire Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entretiens.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* {e.id} */}
                    <Link href={`/formulaires/entretien-annuel?id=${e.id}`} className="text-blue-600 hover:text-blue-800">
                      {e.id}
                    </Link>
                    
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(e.date_entretien).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{e.collaborateur_fonction}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{e.collaborateur_prenom} {e.collaborateur_nom}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">{e.note_consultant ?? '-'}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="truncate" title={e.commentaire_consultant ?? ''}>
                      {e.commentaire_consultant ?? '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{e.manager_fonction}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{e.manager_prenom} {e.manager_nom}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">{e.note_manager ?? '-'}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="truncate" title={e.commentaire_manager ?? ''}>
                      {e.commentaire_manager ?? '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      e.statut === 'valide' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {e.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <button
                        onClick={() => handleDownload(e.id)}
                        disabled={e.statut !== 'valide'}
                        className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 mr-4"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {entretiens.length === 0 && (
          <div className="text-center py-8 text-gray-500">Aucun entretien</div>
        )}
      </div>
    </div>
  );
}