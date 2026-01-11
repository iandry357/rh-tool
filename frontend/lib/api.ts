import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Page1Data {
  collaborateur_nom: string;
  collaborateur_prenom: string;
  collaborateur_fonction: string;
  collaborateur_date_entree: string;
  manager_nom: string;
  manager_prenom: string;
  manager_fonction: string;
  date_entretien: string;
}

export interface Page2Data {
  commentaire?: string;
  dossier_tech_a_jour?: boolean;
  dossier_tech_transmis?: boolean;
}

export interface Page3Data {
  objectif?: string;
  note_consultant?: number;
  commentaire_consultant?: string;
  note_manager?: number;
  commentaire_manager?: string;
}

export interface EntretienComplet {
  id: number;
  statut: string;
  page1: Page1Data;
  page2?: Page2Data;
  page3?: Page3Data;
}

export interface TemplateText {
  id: number;
  key: string;
  value: string;
  category: string;
}

export interface EntretienListItem {
  id: number;
  collaborateur_nom: string;
  collaborateur_prenom: string;
  collaborateur_fonction: string;
  manager_nom: string;
  manager_prenom: string;
  manager_fonction: string;
  date_entretien: string;
  statut: string;
  note_consultant: number | null;
  note_manager: number | null;
  commentaire_consultant: string | null;
  commentaire_manager: string | null;
}

// API calls
export const createEntretien = async () => {
  const response = await api.post('/entretiens/');
  return response.data;
};

export const getEntretien = async (id: number): Promise<EntretienComplet> => {
  const response = await api.get(`/entretiens/${id}`);
  return response.data;
};

export const updatePage1 = async (id: number, data: Page1Data) => {
  const response = await api.put(`/entretiens/${id}/page1`, data);
  return response.data;
};

export const updatePage2 = async (id: number, data: Page2Data) => {
  const response = await api.put(`/entretiens/${id}/page2`, data);
  return response.data;
};

export const updatePage3 = async (id: number, data: Page3Data) => {
  const response = await api.put(`/entretiens/${id}/page3`, data);
  return response.data;
};

export const validerEntretien = async (id: number) => {
  const response = await api.post(`/entretiens/${id}/valider`);
  return response.data;
};

export const deleteEntretien = async (id: number) => {
  const response = await api.delete(`/entretiens/${id}`);
  return response.data;
};
// export const deleteEntretien = async (id: number): Promise<void> => {
//   const response = await api.delete(`/entretiens/${id}`, {
//     method: 'DELETE',
//   });
  
//   if (!response.ok) {
//     throw new Error('Erreur suppression entretien');
//   }
// };

export const listEntretiens = async (statut?: string) => {
  const params = statut ? { statut } : {};
  const response = await api.get('/entretiens/', { params });
  return response.data;
};

export const downloadPDF = async (id: number) => {
  const response = await api.post(`/pdf/${id}`, {}, {
    responseType: 'blob'
  });
  
  // Créer un lien de téléchargement
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `entretien_annuel_${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const getTemplateTexts = async (): Promise<TemplateText[]> => {
  const response = await api.get('/admin/templates/texts');
  return response.data;
};

export const updateTemplateText = async (id: number, value: string): Promise<void> => {
  await api.put(`/admin/templates/texts/${id}`, { value });
};

export const getTextByKey = (texts: TemplateText[], key: string): string => {
  return texts.find(t => t.key === key)?.value || '';
};

export const getEntretiensList = async (): Promise<EntretienListItem[]> => {
  const response = await api.get('/entretiens/');
  return response.data;
};

export const exportEntretiensCSV = async () => {
  const response = await api.get('/entretiens/export/csv', {
    responseType: 'blob'
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `entretiens_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
