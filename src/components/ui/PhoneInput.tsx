/**
 * @file PhoneInput.tsx
 * @description Composant saisie téléphone avec sélecteur de pays.
 *   - Indicatif +216 (Tunisie) par défaut
 *   - Pays disponibles : TN, DZ, MA, LY, FR, DE, GB, IT, US, SA, AE
 *   - Valeur émise : numéro complet avec indicatif ex: "+21698765432"
 *
 *   USAGE :
 *     <PhoneInput
 *       value={form.telephone}
 *       onChange={(full) => setForm(f => ({ ...f, telephone: full }))}
 *       label="Téléphone"
 *       error={errors.telephone}
 *     />
 *
 * @author Riahi Dorsaf
 */

import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Modal, FlatList, Pressable,
} from 'react-native';
import { Ionicons }   from '@expo/vector-icons';
import { useStyles }       from '../../theme';
import { makeStyles }      from './PhoneInput.styles';
import { useTranslation }  from 'react-i18next';

// ─── PAYS ────────────────────────────────────────────────────────────────────
export interface Country {
  code:      string;
  name:      string;
  prefix:    string;
  flag:      string;
  maxLength: number;
}

const COUNTRIES: Country[] = [
  { code:'TN', name:'Tunisie',         prefix:'+216', flag:'🇹🇳', maxLength:8  },
  { code:'DZ', name:'Algérie',         prefix:'+213', flag:'🇩🇿', maxLength:9  },
  { code:'MA', name:'Maroc',           prefix:'+212', flag:'🇲🇦', maxLength:9  },
  { code:'LY', name:'Libye',           prefix:'+218', flag:'🇱🇾', maxLength:9  },
  { code:'FR', name:'France',          prefix:'+33',  flag:'🇫🇷', maxLength:9  },
  { code:'DE', name:'Allemagne',       prefix:'+49',  flag:'🇩🇪', maxLength:10 },
  { code:'GB', name:'Royaume-Uni',     prefix:'+44',  flag:'🇬🇧', maxLength:10 },
  { code:'IT', name:'Italie',          prefix:'+39',  flag:'🇮🇹', maxLength:10 },
  { code:'US', name:'États-Unis',      prefix:'+1',   flag:'🇺🇸', maxLength:10 },
  { code:'SA', name:'Arabie Saoudite', prefix:'+966', flag:'🇸🇦', maxLength:9  },
  { code:'AE', name:'Émirats Arabes',  prefix:'+971', flag:'🇦🇪', maxLength:9  },
];

// ─── HELPER : décompose un numéro complet ─────────────────────────────────────
const parsePhoneNumber = (full: string): { country: Country; local: string } => {
  const def = COUNTRIES[0];
  if (!full) return { country: def, local: '' };
  const sorted = [...COUNTRIES].sort((a, b) => b.prefix.length - a.prefix.length);
  for (const c of sorted) {
    if (full.startsWith(c.prefix)) return { country: c, local: full.slice(c.prefix.length) };
  }
  return { country: def, local: full };
};

// ─── PROPS ────────────────────────────────────────────────────────────────────
interface PhoneInputProps {
  value:        string;
  onChange:     (fullNumber: string) => void;
  label?:       string;
  error?:       string;
  placeholder?: string;
  disabled?:    boolean;
}

// ─── COMPOSANT ───────────────────────────────────────────────────────────────
export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label       = 'Téléphone',
  error,
  placeholder = '00 000 000',
  disabled    = false,
}) => {
  const styles = useStyles(makeStyles);
  const { t }  = useTranslation();

  const { country: ic, local: il } = useMemo(() => parsePhoneNumber(value), []); // eslint-disable-line

  const [country,      setCountry]      = useState<Country>(ic);
  const [localNumber,  setLocalNumber]  = useState(il);
  const [modalVisible, setModalVisible] = useState(false);

  const hasError   = !!error;
  const isComplete = localNumber.length > 0 && localNumber.length === country.maxLength;

  const handleLocalChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, country.maxLength);
    setLocalNumber(digits);
    onChange(digits ? `${country.prefix}${digits}` : '');
  };

  const selectCountry = (c: Country) => {
    setCountry(c);
    setModalVisible(false);
    onChange(localNumber ? `${c.prefix}${localNumber}` : '');
  };

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* Champ principal */}
      <View style={[styles.row, hasError && styles.rowError, disabled && styles.rowDisabled]}>

        {/* Bouton sélection pays */}
        <TouchableOpacity
          style={styles.countryBtn}
          onPress={() => !disabled && setModalVisible(true)}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <Text style={styles.flag}>{country.flag}</Text>
          <Text style={styles.prefix}>{country.prefix}</Text>
          <Ionicons name="chevron-down" size={12} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Saisie numéro local */}
        <TextInput
          style={styles.input}
          value={localNumber}
          onChangeText={handleLocalChange}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          editable={!disabled}
          maxLength={country.maxLength}
        />

        {isComplete && (
          <Ionicons name="checkmark-circle" size={18} color="#16A34A" style={styles.checkIcon} />
        )}
      </View>

      {hasError && <Text style={styles.errorTxt}>{error}</Text>}

      {/* Modal sélection pays */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('ui.phoneInput.chooseCountry')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color="#374151" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRIES}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    country.code === item.code && styles.countryItemSelected,
                  ]}
                  onPress={() => selectCountry(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryPrefix}>{item.prefix}</Text>
                  {country.code === item.code && (
                    <Ionicons name="checkmark" size={18} color="#2563EB" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};