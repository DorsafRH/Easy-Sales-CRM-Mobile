/**
 * @file EnvoiDocumentSheet.tsx
 * @description Feuille de partage d'un document (devis / facture) facon bouton
 *              « Partager » : rangees a icone Mail / WhatsApp / Exporter. Les canaux
 *              Mail et WhatsApp ne s'affichent que si le client a la coordonnee ;
 *              « Exporter / Partager » est toujours disponible (repli).
 * @author Riahi Dorsaf
 */

import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons }              from '@expo/vector-icons';
import { useStyles, useTheme }   from '../../theme';
import { makeStyles }            from './EnvoiDocumentSheet.styles';

interface EnvoiDocumentSheetProps {
  visible:     boolean;
  onClose:     () => void;
  titre:       string;
  hasEmail:    boolean;
  hasPhone:    boolean;
  onMail:      () => void;
  onWhatsapp:  () => void;
  onExport:    () => void;
}

/**
 * Bottom sheet de choix du canal d'envoi d'un document.
 * @author Riahi Dorsaf
 */
export const EnvoiDocumentSheet: React.FC<EnvoiDocumentSheetProps> = ({
  visible, onClose, titre, hasEmail, hasPhone, onMail, onWhatsapp, onExport,
}) => {
  const styles = useStyles(makeStyles);
  const theme  = useTheme();

  // Ferme la feuille puis declenche l'action choisie.
  const choisir = (action: () => void) => {
    onClose();
    action();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{titre}</Text>

          {hasEmail && (
            <TouchableOpacity style={styles.row} onPress={() => choisir(onMail)}>
              <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryLight }]}>
                <Ionicons name="mail" size={22} color={theme.colors.primary} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowLabel}>Envoyer par mail</Text>
                <Text style={styles.rowSub}>PDF joint, depuis votre messagerie</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          )}

          {hasPhone && (
            <TouchableOpacity style={styles.row} onPress={() => choisir(onWhatsapp)}>
              <View style={[styles.iconCircle, { backgroundColor: theme.colors.successLight }]}>
                <Ionicons name="logo-whatsapp" size={22} color={theme.colors.success} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowLabel}>Envoyer par WhatsApp</Text>
                <Text style={styles.rowSub}>Partager le PDF dans une conversation</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.row} onPress={() => choisir(onExport)}>
            <View style={[styles.iconCircle, styles.iconCircleNeutral]}>
              <Ionicons name="share-outline" size={22} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowLabel}>Exporter / Partager</Text>
              <Text style={styles.rowSub}>Autres apps, enregistrer le PDF…</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
