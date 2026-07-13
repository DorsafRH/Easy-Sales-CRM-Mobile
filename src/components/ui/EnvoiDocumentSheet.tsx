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
import { useSafeAreaInsets }     from 'react-native-safe-area-context';
import { Ionicons }              from '@expo/vector-icons';
import { useStyles, useTheme }   from '../../theme';
import { makeStyles }            from './EnvoiDocumentSheet.styles';
import { useTranslation }        from 'react-i18next';

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
  const { t }  = useTranslation();
  const insets = useSafeAreaInsets();

  // Ferme la feuille puis declenche l'action choisie.
  const choisir = (action: () => void) => {
    onClose();
    action();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.sheet, { paddingBottom: Math.max(theme.spacing[8], insets.bottom + theme.spacing[4]) }]}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>{titre}</Text>

          {hasEmail && (
            <TouchableOpacity style={styles.row} onPress={() => choisir(onMail)}>
              <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryLight }]}>
                <Ionicons name="mail" size={22} color={theme.colors.primary} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowLabel}>{t('components.envoiSheet.sendMail')}</Text>
                <Text style={styles.rowSub}>{t('components.envoiSheet.sendMailSub')}</Text>
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
                <Text style={styles.rowLabel}>{t('components.envoiSheet.sendWhatsapp')}</Text>
                <Text style={styles.rowSub}>{t('components.envoiSheet.sendWhatsappSub')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.row} onPress={() => choisir(onExport)}>
            <View style={[styles.iconCircle, styles.iconCircleNeutral]}>
              <Ionicons name="share-outline" size={22} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowLabel}>{t('components.envoiSheet.export')}</Text>
              <Text style={styles.rowSub}>{t('components.envoiSheet.exportSub')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
