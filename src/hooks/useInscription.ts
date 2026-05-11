import { useState, useCallback } from 'react';
import {
  InscriptionFormState,
  INITIAL_INSCRIPTION_STATE,
  TailleEntreprise,
} from '../types/entreprise.types';
import * as EntrepriseApi from '../api/entreprise.api';

export type InscriptionErrors = Partial<Record<keyof InscriptionFormState, string>>;

export interface UseInscriptionReturn {
  form:          InscriptionFormState;
  errors:        InscriptionErrors;
  isSubmitting:  boolean;
  submitError:   string | null;
  updateField:   <K extends keyof InscriptionFormState>(key: K, value: InscriptionFormState[K]) => void;
  validateStep1: () => boolean;
  validateStep2: () => boolean;
  submit:        () => Promise<boolean>;
  reset:         () => void;
}

export const useInscription = (): UseInscriptionReturn => {
  const [form,         setForm]         = useState<InscriptionFormState>(INITIAL_INSCRIPTION_STATE);
  const [errors,       setErrors]       = useState<InscriptionErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError,  setSubmitError]  = useState<string | null>(null);

  const updateField = useCallback(
    <K extends keyof InscriptionFormState>(key: K, value: InscriptionFormState[K]) => {
      setForm(prev => ({ ...prev, [key]: value }));
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }, []
  );

  const validateStep1 = useCallback((): boolean => {
    const e: InscriptionErrors = {};
    if (!form.nomEntreprise.trim())       e.nomEntreprise       = "Le nom est obligatoire.";
    if (!form.matriculeFiscale.trim())    e.matriculeFiscale    = "La matricule est obligatoire.";
    if (!form.secteurActivite.trim())     e.secteurActivite     = "Le secteur est obligatoire.";
    if (!form.tailleEntreprise)           e.tailleEntreprise    = "La taille est obligatoire.";
    if (!form.telephoneEntreprise.trim()) e.telephoneEntreprise = "Le téléphone est obligatoire.";
    if (!form.adresse.trim())             e.adresse             = "L'adresse est obligatoire.";
    if (!form.ville.trim())               e.ville               = "La ville est obligatoire.";
    if (!form.pays.trim())                e.pays                = "Le pays est obligatoire.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const validateStep2 = useCallback((): boolean => {
    const e: InscriptionErrors = {};
    if (!form.prenom.trim())           e.prenom           = "Le prénom est obligatoire.";
    if (!form.nom.trim())              e.nom              = "Le nom est obligatoire.";
    if (!form.email.trim())            e.email            = "L'email est obligatoire.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                       e.email            = "Format d'email invalide.";
    if (!form.telephone.trim())        e.telephone        = "Le téléphone est obligatoire.";
    if (!form.motDePasse)              e.motDePasse       = "Le mot de passe est obligatoire.";
    else if (form.motDePasse.length < 8) e.motDePasse     = "Minimum 8 caractères.";
    if (form.motDePasse !== form.confirmMotDePasse)
                                       e.confirmMotDePasse = "Les mots de passe ne correspondent pas.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const submit = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await EntrepriseApi.inscrireEntreprise({
        nomEntreprise:       form.nomEntreprise,
        matriculeFiscale:    form.matriculeFiscale,
        secteurActivite:     form.secteurActivite,
        tailleEntreprise:    form.tailleEntreprise as TailleEntreprise,
        telephoneEntreprise: form.telephoneEntreprise,
        adresse:             form.adresse,
        ville:               form.ville,
        pays:                form.pays,
        siteWeb:             form.siteWeb || undefined,
        nom:                 form.nom,
        prenom:              form.prenom,
        email:               form.email,
        telephone:           form.telephone,
        motDePasse:          form.motDePasse,
      });
      if (!response.success) {
        setSubmitError(response.message ?? 'Une erreur est survenue.');
        return false;
      }
      return true;
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.message ?? 'Une erreur est survenue. Veuillez réessayer.'
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  const reset = useCallback(() => {
    setForm(INITIAL_INSCRIPTION_STATE);
    setErrors({});
    setSubmitError(null);
  }, []);

  return { form, errors, isSubmitting, submitError, updateField, validateStep1, validateStep2, submit, reset };
};