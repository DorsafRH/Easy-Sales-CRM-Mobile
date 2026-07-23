/**
 * @file ImportClientsScreen.tsx
 * @description Import de clients depuis Excel (.xlsx) ou photo d'un tableau.
 *              Excel  : sélection fichier → mapping colonnes → aperçu → import → résumé
 *              Photo  : caméra/galerie → OCR Groq Vision → vérification → import → résumé
 * @author Riahi Dorsaf
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView }              from 'react-native-safe-area-context';
import { useNavigation }             from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons }                  from '@expo/vector-icons';
import * as DocumentPicker           from 'expo-document-picker';
import * as ImagePicker              from 'expo-image-picker';
import * as FileSystem               from 'expo-file-system/legacy';
import XLSX                          from 'xlsx';

import { useTranslation }          from 'react-i18next';
import { useStyles, useTheme }    from '../../theme';
import { makeStyles }             from './ImportClientsScreen.styles';
import { Button }                 from '../../components/ui/Button';
import { ClientsStackParamList }  from '../../navigation/ClientsStack';
import * as ClientApi             from '../../api/client.api';
import { ClientRequest, TypeClient } from '../../types/client.types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav  = NativeStackNavigationProp<ClientsStackParamList, 'ImportClients'>;
type Tab  = 'excel' | 'photo';
type Step = 'pick' | 'map' | 'preview' | 'analyzing' | 'verify' | 'importing' | 'done';

interface ColumnMap {
  nom?:           string;
  prenom?:        string;
  raisonSociale?: string;
  telephone?:     string;
  email?:         string;
  ville?:         string;
  adresse?:       string;
}

interface ParsedClient extends ClientRequest {
  _key: string;
}

interface ImportResult {
  total:   number;
  success: number;
  errors:  Array<{ nom: string; erreur: string }>;
}

// Champs CRM à mapper (labels traduits dans le composant via t())
const CRM_FIELD_KEYS: Array<{ key: keyof ColumnMap; tKey: string; required?: boolean }> = [
  { key: 'nom',           tKey: 'screens.importClients.fieldNom',           required: true },
  { key: 'prenom',        tKey: 'screens.importClients.fieldPrenom',         required: true },
  { key: 'raisonSociale', tKey: 'screens.importClients.fieldRaisonSociale'                 },
  { key: 'telephone',     tKey: 'screens.importClients.fieldTelephone'                     },
  { key: 'email',         tKey: 'screens.importClients.fieldEmail'                         },
  { key: 'ville',         tKey: 'screens.importClients.fieldVille'                         },
  { key: 'adresse',       tKey: 'screens.importClients.fieldAdresse'                       },
];

// Noms de colonnes courants pour l'auto-détection
const AUTO_MAP: Record<keyof ColumnMap, string[]> = {
  nom:           ['nom', 'name', 'last name', 'lastname', 'family name'],
  prenom:        ['prenom', 'prénom', 'firstname', 'first name', 'given name'],
  raisonSociale: ['raison sociale', 'entreprise', 'société', 'company', 'organization', 'societe'],
  telephone:     ['tel', 'téléphone', 'telephone', 'phone', 'mobile', 'gsm', 'portable'],
  email:         ['email', 'e-mail', 'mail', 'courriel'],
  ville:         ['ville', 'city', 'town'],
  adresse:       ['adresse', 'address', 'rue'],
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function autoDetect(headers: string[]): ColumnMap {
  const map: ColumnMap = {};
  const lc = headers.map(h => h.toLowerCase().trim());
  (Object.keys(AUTO_MAP) as (keyof ColumnMap)[]).forEach(field => {
    const idx = lc.findIndex(h => AUTO_MAP[field].some(alias => h.includes(alias)));
    if (idx !== -1) map[field] = headers[idx];
  });
  return map;
}

function rowToClient(row: Record<string, unknown>, colMap: ColumnMap, type: TypeClient): ParsedClient {
  const get = (col?: string) => (col && row[col] != null ? String(row[col]).trim() : '');
  return {
    _key:          Math.random().toString(36).slice(2),
    typeClient:    type,
    nom:           get(colMap.nom),
    prenom:        get(colMap.prenom),
    raisonSociale: get(colMap.raisonSociale),
    telephone:     get(colMap.telephone),
    email:         get(colMap.email),
    ville:         get(colMap.ville),
    adresse:       get(colMap.adresse),
  };
}

function toRequest(c: ParsedClient): ClientRequest {
  const r: ClientRequest = { typeClient: c.typeClient };
  if (c.nom)           r.nom           = c.nom;
  if (c.prenom)        r.prenom        = c.prenom;
  if (c.raisonSociale) r.raisonSociale = c.raisonSociale;
  if (c.telephone)     r.telephone     = c.telephone;
  if (c.email)         r.email         = c.email;
  if (c.ville)         r.ville         = c.ville;
  if (c.adresse)       r.adresse       = c.adresse;
  return r;
}

function nomAffichage(c: ParsedClient | ClientRequest) {
  if (c.typeClient === 'ENTREPRISE') return c.raisonSociale || '(sans nom)';
  return [c.prenom, c.nom].filter(Boolean).join(' ') || '(sans nom)';
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

export const ImportClientsScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const { t }      = useTranslation();
  const navigation = useNavigation<Nav>();

  const [tab,  setTab]  = useState<Tab>('excel');
  const [step, setStep] = useState<Step>('pick');

  // ── Excel state ──────────────────────────────────────────
  const [fileName,    setFileName]    = useState('');
  const [headers,     setHeaders]     = useState<string[]>([]);
  const [rawRows,     setRawRows]     = useState<Record<string, unknown>[]>([]);
  const [colMap,      setColMap]      = useState<ColumnMap>({});
  const [clientType,  setClientType]  = useState<TypeClient>('INDIVIDUEL');
  const [clients,     setClients]     = useState<ParsedClient[]>([]);
  const [pickerField, setPickerField] = useState<keyof ColumnMap | null>(null);

  // ── Photo state ──────────────────────────────────────────
  const [photoUri,     setPhotoUri]     = useState('');
  const [photoMime,    setPhotoMime]    = useState('image/jpeg');
  const [ocrClients,   setOcrClients]   = useState<ParsedClient[]>([]);

  // ── Import state ─────────────────────────────────────────
  const [importProgress, setImportProgress] = useState(0);
  const [importTotal,    setImportTotal]    = useState(0);
  const [result,         setResult]         = useState<ImportResult | null>(null);

  // ── Tab change ────────────────────────────────────────────
  const switchTab = (t: Tab) => { setTab(t); setStep('pick'); };

  // ─────────────────────────────────────────────────────────
  // EXCEL — sélection fichier
  // ─────────────────────────────────────────────────────────

  const pickExcel = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ],
        copyToCacheDirectory: true,
      });
      if (res.canceled || !res.assets?.length) return;

      const asset = res.assets[0];
      setFileName(asset.name);

      const b64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const wb = XLSX.read(b64, { type: 'base64' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' });

      if (!data.length) {
        Alert.alert(t('screens.importClients.mappingAlertIncompleteTitle'), t('screens.importClients.excelEmpty'));
        return;
      }

      const cols = Object.keys(data[0]);
      setHeaders(cols);
      setRawRows(data);
      setColMap(autoDetect(cols));
      setStep('map');
    } catch (e) {
      Alert.alert('Erreur', t('screens.importClients.errorExcel'));
    }
  };

  // ─────────────────────────────────────────────────────────
  // EXCEL — mapping → aperçu
  // ─────────────────────────────────────────────────────────

  const confirmerMapping = () => {
    const reqNom = clientType === 'INDIVIDUEL' && (!colMap.nom || !colMap.prenom);
    const reqRS  = clientType === 'ENTREPRISE' && !colMap.raisonSociale;
    if (reqNom) {
      Alert.alert(t('screens.importClients.mappingAlertIncompleteTitle'), t('screens.importClients.mappingAlertIncompleteIndividuel'));
      return;
    }
    if (reqRS) {
      Alert.alert(t('screens.importClients.mappingAlertIncompleteTitle'), t('screens.importClients.mappingAlertIncompleteEntreprise'));
      return;
    }
    const parsed = rawRows
      .map(r => rowToClient(r, colMap, clientType))
      .filter(c => nomAffichage(c) !== '(sans nom)');
    setClients(parsed);
    setStep('preview');
  };

  // ─────────────────────────────────────────────────────────
  // PHOTO — prise / galerie
  // ─────────────────────────────────────────────────────────

  const demanderPermission = async (source: 'camera' | 'gallery') => {
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'L\'accès à la caméra est requis.');
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'L\'accès à la galerie est requis.');
        return false;
      }
    }
    return true;
  };

  const pickPhoto = async (source: 'camera' | 'gallery') => {
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('screens.importClients.photoPermissionDenied'), t('screens.importClients.photoPermissionCamera'));
        return;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('screens.importClients.photoPermissionDenied'), t('screens.importClients.photoPermissionGallery'));
        return;
      }
    }

    const opts: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      quality: 0.85,
      base64: false,
      allowsEditing: false,
    };

    const res = source === 'camera'
      ? await ImagePicker.launchCameraAsync(opts)
      : await ImagePicker.launchImageLibraryAsync(opts);

    if (res.canceled || !res.assets?.length) return;

    const asset = res.assets[0];
    setPhotoUri(asset.uri);
    setPhotoMime(asset.mimeType ?? 'image/jpeg');
    setStep('analyzing');

    try {
      const apiRes = await ClientApi.importerDepuisPhoto(asset.uri, asset.mimeType ?? 'image/jpeg');
      const detected: ParsedClient[] = (apiRes.data ?? []).map(c => ({
        ...c,
        _key:          Math.random().toString(36).slice(2),
        nom:           c.nom           ?? '',
        prenom:        c.prenom        ?? '',
        raisonSociale: c.raisonSociale ?? '',
        telephone:     c.telephone     ?? '',
        email:         c.email         ?? '',
        ville:         c.ville         ?? '',
        adresse:       c.adresse       ?? '',
      }));
      setOcrClients(detected);
      setStep('verify');
    } catch (e: any) {
      Alert.alert('Erreur OCR', e?.response?.data?.message ?? t('screens.importClients.errorOcr'));
      setStep('pick');
    }
  };

  // ─────────────────────────────────────────────────────────
  // IMPORT (commun Excel + Photo)
  // ─────────────────────────────────────────────────────────

  const lancerImport = async (liste: ParsedClient[]) => {
    setImportTotal(liste.length);
    setImportProgress(0);
    setStep('importing');

    const errors: ImportResult['errors'] = [];
    let success = 0;

    for (let i = 0; i < liste.length; i++) {
      try {
        await ClientApi.creerClient(toRequest(liste[i]));
        success++;
      } catch (e: any) {
        const msg = e?.response?.data?.message ?? 'Erreur inconnue';
        errors.push({ nom: nomAffichage(liste[i]), erreur: msg });
      }
      setImportProgress(i + 1);
    }

    setResult({ total: liste.length, success, errors });
    setStep('done');
  };

  // ─────────────────────────────────────────────────────────
  // MISE À JOUR CHAMPS client OCR
  // ─────────────────────────────────────────────────────────

  const updateOcrClient = (key: string, field: keyof ParsedClient, value: string) => {
    setOcrClients(prev => prev.map(c => c._key === key ? { ...c, [field]: value } : c));
  };

  const removeOcrClient = (key: string) => {
    setOcrClients(prev => prev.filter(c => c._key !== key));
  };

  // ─────────────────────────────────────────────────────────
  // RENDERS
  // ─────────────────────────────────────────────────────────

  const renderTabs = () => (
    <View style={styles.tabs}>
      {(['excel', 'photo'] as Tab[]).map(tabKey => (
        <TouchableOpacity
          key={tabKey}
          style={[styles.tabItem, tab === tabKey && styles.tabItemActive]}
          onPress={() => switchTab(tabKey)}
        >
          <Ionicons
            name={tabKey === 'excel' ? 'document-text-outline' : 'camera-outline'}
            size={18}
            color={tab === tabKey ? theme.colors.primary : theme.colors.textSecondary}
          />
          <Text style={[styles.tabLabel, tab === tabKey && styles.tabLabelActive]}>
            {tabKey === 'excel' ? t('screens.importClients.tabExcel') : t('screens.importClients.tabPhoto')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // ── Excel : pick ──────────────────────────────────────────
  const renderExcelPick = () => (
    <View style={styles.centerContent}>
      <Ionicons name="document-text-outline" size={64} color={theme.colors.primary} style={{ marginBottom: 20 }} />
      <Text style={styles.stepTitle}>{t('screens.importClients.excelPickTitle')}</Text>
      <Text style={styles.stepSub}>{t('screens.importClients.excelPickSub')}</Text>
      <Button label={t('screens.importClients.excelPickBtn')} onPress={pickExcel} variant="primary" fullWidth />
    </View>
  );

  // ── Excel : mapping colonnes ──────────────────────────────
  const renderMapping = () => (
    <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.stepTitle}>{t('screens.importClients.mappingTitle')}</Text>
      <Text style={styles.stepSub}>{fileName} — {rawRows.length} lignes</Text>

      <Text style={styles.sectionLabel}>{t('screens.importClients.mappingTypeLabel')}</Text>
      <View style={styles.typeRow}>
        {(['INDIVIDUEL', 'ENTREPRISE'] as TypeClient[]).map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.typeBtn, clientType === type && styles.typeBtnActive]}
            onPress={() => setClientType(type)}
          >
            <Text style={[styles.typeBtnLabel, clientType === type && styles.typeBtnLabelActive]}>
              {type === 'INDIVIDUEL' ? t('screens.importClients.mappingTypePerson') : t('screens.importClients.mappingTypeCompany')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>{t('screens.importClients.mappingColumnsLabel')}</Text>
      {CRM_FIELD_KEYS.map(f => {
        const label = t(f.tKey);
        const isRelevant =
          (clientType === 'INDIVIDUEL' && f.key !== 'raisonSociale') ||
          (clientType === 'ENTREPRISE' && !['nom', 'prenom'].includes(f.key));
        if (!isRelevant) return null;

        return (
          <TouchableOpacity
            key={f.key}
            style={styles.mapRow}
            onPress={() => setPickerField(f.key)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.mapFieldLabel}>
                {label}{f.required ? ' *' : ''}
              </Text>
              <Text style={styles.mapColValue}>
                {colMap[f.key] ?? t('screens.importClients.mappingNotMapped')}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        );
      })}

      <View style={{ marginTop: 24 }}>
        <Button label={t('screens.importClients.mappingContinueBtn')} onPress={confirmerMapping} variant="primary" fullWidth />
      </View>
    </ScrollView>
  );

  // ── Excel : aperçu ────────────────────────────────────────
  const renderPreview = () => (
    <View style={{ flex: 1 }}>
      <View style={styles.previewHeader}>
        <Text style={styles.stepTitle}>{t('screens.importClients.previewTitle', { nb: clients.length })}</Text>
        <Text style={styles.stepSub}>{t('screens.importClients.previewSub')}</Text>
      </View>
      <FlatList
        data={clients.slice(0, 20)}
        keyExtractor={c => c._key}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.previewCard}>
            <Text style={styles.previewNom}>{nomAffichage(item)}</Text>
            {!!item.telephone && <Text style={styles.previewMeta}>{item.telephone}</Text>}
            {!!item.email     && <Text style={styles.previewMeta}>{item.email}</Text>}
            {!!item.ville     && <Text style={styles.previewMeta}>{item.ville}</Text>}
          </View>
        )}
        ListFooterComponent={clients.length > 20
          ? <Text style={styles.moreLabel}>{t('screens.importClients.previewMore', { nb: clients.length - 20 })}</Text>
          : null}
      />
      <View style={styles.bottomAction}>
        <Button
          label={clients.length > 1
            ? t('screens.importClients.importBtnPlural', { nb: clients.length })
            : t('screens.importClients.importBtn', { nb: clients.length })}
          onPress={() => lancerImport(clients)}
          variant="primary"
          fullWidth
        />
      </View>
    </View>
  );

  // ── Photo : pick ──────────────────────────────────────────
  const renderPhotoPick = () => (
    <View style={styles.centerContent}>
      <Ionicons name="camera-outline" size={64} color={theme.colors.primary} style={{ marginBottom: 20 }} />
      <Text style={styles.stepTitle}>{t('screens.importClients.photoPickTitle')}</Text>
      <Text style={styles.stepSub}>{t('screens.importClients.photoPickSub')}</Text>
      <Button label={t('screens.importClients.photoCameraBtn')} onPress={() => pickPhoto('camera')}  variant="primary" fullWidth style={{ marginBottom: 12 }} />
      <Button label={t('screens.importClients.photoGalleryBtn')} onPress={() => pickPhoto('gallery')} variant="outline" fullWidth />
    </View>
  );

  // ── Photo : analyse en cours ──────────────────────────────
  const renderAnalyzing = () => (
    <View style={styles.centerContent}>
      <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginBottom: 20 }} />
      <Text style={styles.stepTitle}>{t('screens.importClients.analyzingTitle')}</Text>
      <Text style={styles.stepSub}>{t('screens.importClients.analyzingSub')}</Text>
    </View>
  );

  // ── Photo : vérification / édition ───────────────────────
  const renderVerify = () => (
    <View style={{ flex: 1 }}>
      <View style={styles.previewHeader}>
        <Text style={styles.stepTitle}>{t(ocrClients.length > 1 ? 'screens.importClients.verifyTitle_other' : 'screens.importClients.verifyTitle_one', { nb: ocrClients.length })}</Text>
        <Text style={styles.stepSub}>{t('screens.importClients.verifySub')}</Text>
      </View>
      {ocrClients.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.colors.textSecondary} />
          <Text style={[styles.stepSub, { textAlign: 'center', marginTop: 12 }]}>
            {t('screens.importClients.verifyEmpty')}
          </Text>
          <Button label={t('screens.importClients.verifyRetryBtn')} onPress={() => setStep('pick')} variant="outline" />
        </View>
      ) : (
        <FlatList
          data={ocrClients}
          keyExtractor={c => c._key}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={styles.verifyCard}>
              <View style={styles.verifyCardHeader}>
                <Text style={styles.previewNom}>{nomAffichage(item)}</Text>
                <TouchableOpacity onPress={() => removeOcrClient(item._key)}>
                  <Ionicons name="trash-outline" size={18} color={theme.colors.danger ?? '#EF4444'} />
                </TouchableOpacity>
              </View>
              {item.typeClient === 'INDIVIDUEL' ? (
                <>
                  <TextInput style={styles.verifyInput} placeholder="Nom"    value={item.nom}    onChangeText={v => updateOcrClient(item._key, 'nom', v)} />
                  <TextInput style={styles.verifyInput} placeholder="Prénom" value={item.prenom} onChangeText={v => updateOcrClient(item._key, 'prenom', v)} />
                </>
              ) : (
                <TextInput style={styles.verifyInput} placeholder="Raison sociale" value={item.raisonSociale} onChangeText={v => updateOcrClient(item._key, 'raisonSociale', v)} />
              )}
              <TextInput style={styles.verifyInput} placeholder="Téléphone" value={item.telephone} keyboardType="phone-pad" onChangeText={v => updateOcrClient(item._key, 'telephone', v)} />
              <TextInput style={styles.verifyInput} placeholder="Email"     value={item.email}     keyboardType="email-address" onChangeText={v => updateOcrClient(item._key, 'email', v)} />
              <TextInput style={styles.verifyInput} placeholder="Ville"     value={item.ville}     onChangeText={v => updateOcrClient(item._key, 'ville', v)} />
            </View>
          )}
        />
      )}
      {ocrClients.length > 0 && (
        <View style={styles.bottomAction}>
          <Button
            label={ocrClients.length > 1
              ? t('screens.importClients.importBtnPlural', { nb: ocrClients.length })
              : t('screens.importClients.importBtn', { nb: ocrClients.length })}
            onPress={() => lancerImport(ocrClients)}
            variant="primary"
            fullWidth
          />
        </View>
      )}
    </View>
  );

  // ── Import en cours ───────────────────────────────────────
  const renderImporting = () => (
    <View style={styles.centerContent}>
      <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginBottom: 20 }} />
      <Text style={styles.stepTitle}>{t('screens.importClients.importingTitle')}</Text>
      <Text style={styles.stepSub}>{t('screens.importClients.importingProgress', { done: importProgress, total: importTotal })}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${importTotal > 0 ? (importProgress / importTotal) * 100 : 0}%` as any }]} />
      </View>
    </View>
  );

  // ── Résumé ────────────────────────────────────────────────
  const renderDone = () => (
    <ScrollView contentContainerStyle={styles.doneContent}>
      <Ionicons
        name={result?.errors.length ? 'warning-outline' : 'checkmark-circle-outline'}
        size={72}
        color={result?.errors.length ? theme.colors.warning ?? '#F59E0B' : theme.colors.success ?? '#10B981'}
        style={{ marginBottom: 16 }}
      />
      <Text style={styles.stepTitle}>
        {t((result?.success ?? 0) > 1 ? 'screens.importClients.doneSuccess_other' : 'screens.importClients.doneSuccess_one', { nb: result?.success ?? 0 })}
      </Text>
      {!!result?.errors.length && (
        <>
          <Text style={[styles.stepSub, { color: theme.colors.danger ?? '#EF4444', marginTop: 8 }]}>
            {t(result.errors.length > 1 ? 'screens.importClients.doneErrors_other' : 'screens.importClients.doneErrors_one', { nb: result.errors.length })}
          </Text>
          {result.errors.map((e, i) => (
            <View key={i} style={styles.errorRow}>
              <Text style={styles.errorNom}>{e.nom}</Text>
              <Text style={styles.errorMsg}>{e.erreur}</Text>
            </View>
          ))}
        </>
      )}
      <View style={{ marginTop: 32, width: '100%' }}>
        <Button label={t('screens.importClients.doneBackBtn')} onPress={() => navigation.goBack()} variant="primary" fullWidth />
      </View>
    </ScrollView>
  );

  // ─────────────────────────────────────────────────────────
  // RENDU PRINCIPAL
  // ─────────────────────────────────────────────────────────

  const renderContent = () => {
    if (step === 'importing') return renderImporting();
    if (step === 'done')      return renderDone();

    return (
      <>
        {renderTabs()}
        {tab === 'excel' && step === 'pick'    && renderExcelPick()}
        {tab === 'excel' && step === 'map'     && renderMapping()}
        {tab === 'excel' && step === 'preview' && renderPreview()}
        {tab === 'photo' && step === 'pick'    && renderPhotoPick()}
        {tab === 'photo' && step === 'analyzing' && renderAnalyzing()}
        {tab === 'photo' && step === 'verify'  && renderVerify()}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('screens.importClients.title')}</Text>
        <View style={{ width: 32 }} />
      </View>

      {renderContent()}

      {/* Modal picker colonnes Excel */}
      <Modal visible={!!pickerField} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setPickerField(null)} />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>
            {t('screens.importClients.modalTitle', { field: pickerField ? t(CRM_FIELD_KEYS.find(f => f.key === pickerField)?.tKey ?? '') : '' })}
          </Text>
          <FlatList
            data={[t('screens.importClients.mappingNotMapped'), ...headers]}
            keyExtractor={(item, i) => String(i)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  if (pickerField) {
                    setColMap(prev => ({
                      ...prev,
                      [pickerField]: item === t('screens.importClients.mappingNotMapped') ? undefined : item,
                    }));
                  }
                  setPickerField(null);
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
                {colMap[pickerField!] === item && (
                  <Ionicons name="checkmark" size={18} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};
