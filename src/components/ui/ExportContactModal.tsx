/**
 * @file ExportContactModal.tsx
 * @description Modal d'export d'un document (devis / facture) vers le client.
 *              Trois options : mail, WhatsApp, annuler. Si le contact est connu,
 *              ouvre directement l'application ; sinon propose une saisie manuelle
 *              (validation inline, jamais d'Alert).
 * @author Riahi Dorsaf
 */

import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, Linking,
} from 'react-native';
import { Ionicons }              from '@expo/vector-icons';
import { useStyles, useTheme }   from '../../theme';
import { makeStyles }            from './ExportContactModal.styles';

// ─────────────────────────────────────────────────────────────
// TYPES + HELPERS PURS
// ─────────────────────────────────────────────────────────────

type Mode = 'menu' | 'mail' | 'whatsapp';

interface ExportContactModalProps {
  visible:          boolean;
  onClose:          () => void;
  clientEmail?:     string | null;
  clientTelephone?: string | null;
  subject:          string;
  mailBody:         string;
  whatsappText:     string;
}

/** Construit l'URL mailto encodee. */
const construireMailto = (email: string, subject: string, body: string): string =>
  `mailto:${email.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/** Construit l'URL whatsapp en ne gardant que les chiffres du numero. */
const construireWhatsapp = (telephone: string, text: string): string =>
  `whatsapp://send?phone=${telephone.replace(/[^\d]/g, '')}&text=${encodeURIComponent(text)}`;

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────

/**
 * Feuille d'action d'export d'un document vers le client (mail ou WhatsApp).
 * @author Riahi Dorsaf
 */
export const ExportContactModal: React.FC<ExportContactModalProps> = ({
  visible, onClose, clientEmail, clientTelephone, subject, mailBody, whatsappText,
}) => {
  const styles = useStyles(makeStyles);
  const theme  = useTheme();

  const [mode,        setMode]        = useState<Mode>('menu');
  const [saisie,      setSaisie]      = useState('');
  const [saisieError, setSaisieError] = useState('');

  const fermer = () => {
    setMode('menu');
    setSaisie('');
    setSaisieError('');
    onClose();
  };

  const ouvrirMail = (email: string) => {
    Linking.openURL(construireMailto(email, subject, mailBody));
    fermer();
  };

  const ouvrirWhatsapp = (telephone: string) => {
    Linking.openURL(construireWhatsapp(telephone, whatsappText));
    fermer();
  };

  const onPressMail = () =>
    clientEmail?.trim() ? ouvrirMail(clientEmail) : setMode('mail');

  const onPressWhatsapp = () =>
    clientTelephone?.trim() ? ouvrirWhatsapp(clientTelephone) : setMode('whatsapp');

  const confirmerSaisie = () => {
    if (!saisie.trim()) {
      setSaisieError(mode === 'mail' ? 'Adresse email requise' : 'Numero requis');
      return;
    }
    if (mode === 'mail') ouvrirMail(saisie);
    else ouvrirWhatsapp(saisie);
  };

  const revenirAuMenu = () => {
    setMode('menu');
    setSaisie('');
    setSaisieError('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={fermer}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={fermer}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Exporter le document</Text>

          {mode === 'menu' ? (
            <View style={styles.options}>
              <TouchableOpacity style={styles.optionBtn} onPress={onPressMail}>
                <Ionicons name="mail-outline" size={22} color={theme.colors.primary} />
                <Text style={styles.optionText}>Envoyer par mail</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionBtn} onPress={onPressWhatsapp}>
                <Ionicons name="logo-whatsapp" size={22} color={theme.colors.success} />
                <Text style={styles.optionText}>Envoyer par WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={fermer}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.saisieZone}>
              <Text style={styles.saisieLabel}>
                {mode === 'mail'
                  ? 'Adresse email du destinataire'
                  : 'Numero WhatsApp du destinataire'}
              </Text>
              <TextInput
                style={[styles.input, saisieError ? styles.inputError : null]}
                value={saisie}
                onChangeText={(t) => { setSaisie(t); setSaisieError(''); }}
                placeholder={mode === 'mail' ? 'contact@exemple.com' : '+216 XX XXX XXX'}
                placeholderTextColor={theme.colors.textPlaceholder}
                keyboardType={mode === 'mail' ? 'email-address' : 'phone-pad'}
                autoCapitalize="none"
                autoFocus
              />
              {saisieError ? <Text style={styles.errorText}>{saisieError}</Text> : null}

              <TouchableOpacity style={styles.primaryBtn} onPress={confirmerSaisie}>
                <Text style={styles.primaryText}>Ouvrir</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={revenirAuMenu}>
                <Text style={styles.cancelText}>Retour</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
