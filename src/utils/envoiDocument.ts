/**
 * @file envoiDocument.ts
 * @description Helpers partages pour l'envoi des documents (devis / facture) :
 *              generation du PDF (expo-print), envoi par mail avec piece jointe
 *              (expo-mail-composer, depuis le compte mail du proprietaire) et
 *              partage natif du PDF (expo-sharing, pour WhatsApp ou export libre).
 * @author Riahi Dorsaf
 */

import { Alert, Platform }  from 'react-native';
import * as Print           from 'expo-print';
import * as Sharing         from 'expo-sharing';
import * as MailComposer    from 'expo-mail-composer';
import ReactNativeBlobUtil  from 'react-native-blob-util';

/** Formate un montant en dinars (3 decimales). */
export const fmtTnd = (v: number): string =>
  v.toLocaleString('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + ' TND';

/** Genere un fichier PDF a partir d'un HTML et renvoie son URI local. */
export const genererPdfUri = async (html: string): Promise<string> => {
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  return uri;
};

/** Partage natif d'un PDF (WhatsApp, autres apps : Facebook, Drive, etc.). */
export const partagerPdf = async (pdfUri: string, titre: string): Promise<void> => {
  const peutPartager = await Sharing.isAvailableAsync();
  if (peutPartager) {
    await Sharing.shareAsync(pdfUri, {
      mimeType:    'application/pdf',
      dialogTitle: titre,
      UTI:         'com.adobe.pdf',
    });
  } else {
    Alert.alert('PDF genere', "Le partage n'est pas disponible sur cet appareil.");
  }
};

export type ResultatTelechargement = 'enregistre' | 'partage' | 'annule';

/**
 * Telecharge le PDF dans le dossier public « Telechargements » de l'appareil :
 * - Android (10+) : ecriture directe via MediaStore → visible dans Fichiers / Downloads
 *   + notification, sans choix de dossier (comme un telechargement WhatsApp/navigateur).
 *   Repli sur le partage natif si MediaStore echoue (Android < 10 ou erreur).
 * - iOS : pas de dossier « Telechargements » → partage natif (« Enregistrer dans Fichiers »).
 */
export const telechargerPdf = async (
  pdfUri: string, nomFichier: string,
): Promise<ResultatTelechargement> => {
  if (Platform.OS === 'android') {
    try {
      // NB : le type de la lib nomme ce champ « path », mais le natif lit « name »
      // (cle reellement attendue) → on caste pour fournir la bonne forme.
      const fileData = {
        name:         `${nomFichier}.pdf`,
        parentFolder: '',
        mimeType:     'application/pdf',
      } as unknown as { path: string; parentFolder: string; mimeType: string };

      await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
        fileData, 'Download', pdfUri.replace('file://', ''),
      );
      return 'enregistre';
    } catch {
      // Repli (Android < 10 ou erreur MediaStore) : partage natif.
      await partagerPdf(pdfUri, nomFichier);
      return 'partage';
    }
  }
  await partagerPdf(pdfUri, nomFichier);
  return 'partage';
};

export type ResultatMail = 'sent' | 'saved' | 'cancelled' | 'indisponible';

/**
 * Ouvre l'application mail du proprietaire, pre-remplie (destinataire, sujet,
 * corps texte) avec le PDF en piece jointe. L'email part donc du compte du user.
 * Corps en TEXTE SIMPLE : les apps mail n'affichent pas l'HTML en composition.
 * Si aucune app mail n'est configuree, repli sur le partage natif du PDF.
 */
export const envoyerParMail = async (opts: {
  pdfUri: string;
  email:  string;
  sujet:  string;
  corps:  string;
}): Promise<ResultatMail> => {
  const dispo = await MailComposer.isAvailableAsync();
  if (!dispo) {
    await partagerPdf(opts.pdfUri, opts.sujet);
    return 'indisponible';
  }
  const { status } = await MailComposer.composeAsync({
    recipients:  [opts.email],
    subject:     opts.sujet,
    body:        opts.corps,
    isHtml:      false,
    attachments: [opts.pdfUri],
  });
  // Android renvoie souvent 'undetermined' : on considere l'envoi comme initie
  // sauf annulation explicite.
  if (status === MailComposer.MailComposerStatus.CANCELLED) return 'cancelled';
  if (status === MailComposer.MailComposerStatus.SAVED)     return 'saved';
  return 'sent';
};

/** Sujet du mail d'accompagnement — sans reference du document (forme courte et propre). */
export const sujetMail = (typeDoc: 'devis' | 'facture', marque?: string): string =>
  `Votre ${typeDoc === 'devis' ? 'devis' : 'facture'} — ${marque ?? 'Easy Sales CRM'}`;

/**
 * Corps en TEXTE SIMPLE du mail d'accompagnement d'un devis / facture.
 * (Les apps mail n'affichent pas l'HTML en composition → texte propre.)
 * Le PDF joint reste le document de reference mis en forme.
 */
export const corpsMailTexte = (opts: {
  typeDoc:    'devis' | 'facture';
  montantTtc: string;
  clientNom:  string;
  marque?:    string;
}): string => {
  const marque  = opts.marque ?? 'Easy Sales CRM';
  const libelle = opts.typeDoc === 'devis' ? 'devis' : 'facture';
  return [
    `Bonjour ${opts.clientNom},`,
    '',
    `Veuillez trouver ci-joint votre ${libelle}, d'un montant de ${opts.montantTtc}.`,
    '',
    'Nous restons à votre disposition pour toute question.',
    '',
    'Cordialement,',
    marque,
  ].join('\n');
};
