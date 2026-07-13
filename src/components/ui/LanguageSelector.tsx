/**
 * @file LanguageSelector.tsx
 * @description Sélecteur de langue FR/EN — bouton globe qui ouvre
 *              un bottom sheet moderne avec les deux langues.
 *
 *              COMPORTEMENT :
 *              Tap 🌐 → Modal bottom sheet → choix Français/English
 *                    → setLanguage() (persiste + i18n.changeLanguage)
 *                    → toute l'app se re-rend instantanément → fermeture
 *
 * @author Riahi Dorsaf
 */

import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useStyles, useTheme } from '../../theme';
import { makeStyles } from './LanguageSelector.styles';
import { useLanguageStore, AppLanguage } from '../../i18n/languageStore';

/** Les deux langues affichées dans le sheet. */
const LANGUES: { code: AppLanguage; flag: string; labelKey: string }[] = [
  { code: 'fr', flag: '🇫🇷', labelKey: 'language.french'  },
  { code: 'en', flag: '🇬🇧', labelKey: 'language.english' },
];

export const LanguageSelector: React.FC = () => {
  const styles              = useStyles(makeStyles);
  const theme               = useTheme();
  const { t }               = useTranslation();
  const language            = useLanguageStore(s => s.language);
  const setLanguage         = useLanguageStore(s => s.setLanguage);
  const [isOpen, setIsOpen] = useState(false);

  const choisirLangue = async (lang: AppLanguage) => {
    await setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <>
      {/* Bouton globe — même style rond translucide que l'avatar du hero */}
      <TouchableOpacity
        style={styles.globeBtn}
        onPress={() => setIsOpen(true)}
        accessibilityLabel={t('language.title')}
      >
        <Ionicons name="globe-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Bottom sheet de choix de langue */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        {/* Tap sur l'overlay = fermeture */}
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          {/* Pressable vide pour bloquer la propagation du tap au panneau */}
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.handle} />
            <Text style={styles.title}>{t('language.title')}</Text>

            {LANGUES.map(l => {
              const active = language === l.code;
              return (
                <TouchableOpacity
                  key={l.code}
                  style={[styles.option, active && styles.optionActive]}
                  activeOpacity={0.75}
                  onPress={() => choisirLangue(l.code)}
                >
                  <Text style={styles.optionFlag}>{l.flag}</Text>
                  <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                    {t(l.labelKey)}
                  </Text>
                  {active && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};
