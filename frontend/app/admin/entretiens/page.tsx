'use client';

import { useState, useEffect } from 'react';
import { getEntretiensList, EntretienListItem, downloadPDF, exportEntretiensCSV } from '@/lib/api';
import Link from 'next/link';

export default function AdminEntretiensPage() {
  const [entretiens, setEntretiens] = useState<EntretienListItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Num Entretien</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collaborateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fonction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note Collab</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
            <tbody className="divide-y">
                {entretiens.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{e.id}</td>
                <td className="px-6 py-4">{e.collaborateur_prenom} {e.collaborateur_nom}</td>
                <td className="px-6 py-4">{e.collaborateur_fonction}</td>
                <td className="px-6 py-4">{e.manager_prenom} {e.manager_nom}</td>
                <td className="px-6 py-4">{new Date(e.date_entretien).toLocaleDateString('fr-FR')}</td>
                <td className="px-6 py-4 text-center">{e.note_consultant ?? '-'}</td>
                <td className="px-6 py-4 text-center">{e.note_manager ?? '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    e.statut === 'valide' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {e.statut}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDownload(e.id)}
                    disabled={e.statut !== 'valide'}
                    className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 mr-4"
                  >
                    PDF
                  </button>
                  <Link href={`/formulaires/entretien-annuel?id=${e.id}`} className="text-blue-600 hover:text-blue-800">
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {entretiens.length === 0 && (
          <div className="text-center py-8 text-gray-500">Aucun entretien</div>
        )}
      </div>
    </div>
  );
}