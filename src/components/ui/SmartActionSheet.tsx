/**
 * @file SmartActionSheet.tsx
 * @description Popup de smart automation - propositions contextuelles.
 *              Ex: "Opportunite gagnee ? Creer un devis ?"
 * @author Riahi Dorsaf
 */

import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '../../theme';
import { makeStyles } from './SmartActionSheet.styles';

interface SmartActionSheetProps {
  visible:        boolean;
  iconName:       string;
  iconColor:      string;
  iconBg:         string;
  title:          string;
  subtitle:       string;
  confirmLabel:   string;
  dismissLabel?:  string;
  onConfirm:      () => void;
  onDismiss:      () => void;
}

/**
 * Bottom sheet de proposition contextuelle (smart automation CRM).
 * Apparait automatiquement apres certaines actions metier.
 *
 * @author Riahi Dorsaf
 */
export const SmartActionSheet: React.FC<SmartActionSheetProps> = ({
  visible,
  iconName,
  iconColor,
  iconBg,
  title,
  subtitle,
  confirmLabel,
  dismissLabel = 'Plus tard',
  onConfirm,
  onDismiss,
}) => {
  const styles = useStyles(makeStyles);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onDismiss}>
        <TouchableOpacity activeOpacity={1}>
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
              <Ionicons name={iconName as any} size={28} color={iconColor} />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>

            <TouchableOpacity style={styles.btnPrimary} onPress={onConfirm}>
              <Text style={styles.btnPrimaryText}>{confirmLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSecondary} onPress={onDismiss}>
              <Text style={styles.btnSecondaryText}>{dismissLabel}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};