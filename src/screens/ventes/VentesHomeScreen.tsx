/**
 * @file VentesHomeScreen.tsx
 * @description Dashboard commercial — 3 tabs actifs : Dashboard, Leads, Devis & Factures.
 *              Le tab Pipeline navigue directement vers le Kanban.
 *              Onglet Dashboard : KPIs gradient, graphique CA 12 mois, stats ventes, pipeline, Top 3.
 * @author Riahi Dorsaf
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, Animated, ActivityIndicator,
} from 'react-native';
import { SafeAreaView }                  from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp }     from '@react-navigation/native-stack';
import { Ionicons }                      from '@expo/vector-icons';
import { useTranslation }                from 'react-i18next';
import { LinearGradient }                from 'expo-linear-gradient';
import Svg, {
  Path, Rect, Defs, Stop, ClipPath, G,
  LinearGradient as SvgGradient,
  Text as SvgText,
  Circle,
} from 'react-native-svg';

import { useStyles, useTheme }        from '../../theme';
import { makeStyles }                 from './VentesHomeScreen.styles';
import { EmptyState }                 from '../../components/ui/EmptyState';
import { ScoreBar }                   from '../../components/ui/ScoreBar';
import { SkeletonKpiGrid }            from '../../components/ui/Skeleton';
import { VentesStackParamList }       from '../../navigation/VentesStack';

import * as VenteApi     from '../../api/vente.api';
import * as ReportingApi from '../../api/reporting.api';
import {
  LeadResponse,
  DevisResponse,
  FactureResponse,
  STATUT_LEAD_CONFIG,
  STATUT_DEVIS_CONFIG,
  STATUT_FACTURE_CONFIG,
} from '../../types/vente.types';
import {
  StatsVentesResponse,
  CaMensuelDto,
} from '../../types/reporting.types';
import { calculerCA, formaterMontant } from '../../utils/vente.utils';

// ─────────────────────────────────────────────────────────────
// CONSTANTES LOCALES
// ─────────────────────────────────────────────────────────────

/** Couleurs sémantiques des médailles de rang (or, argent, bronze) */
const RANK_COLORS = ['#F59E0B', '#9CA3AF', '#CD7F32'] as const;

// ── Design tokens KPI cards ──────────────────────────────────
const KPI_BAR_INACTIVE = '#DBEAFE'; // barres inactives mini-chart CA
// ── Couleurs d'accent par KPI card ───────────────────────────
const KPI_COLOR_CA     = '#2563EB'; // CA payé      — bleu primaire
const KPI_COLOR_LEADS  = '#7C3AED'; // Leads actifs — violet
const KPI_COLOR_OPPORT = '#0891B2'; // Opport. act. — cyan
const KPI_COLOR_DEVIS  = '#D97706'; // Devis envoyés — ambre
// ── Largeur fixe d'un mois dans le graphe scrollable ─────────
const CHART_MONTH_W    = 44;
// ── Couleurs segments donut pipeline ─────────────────────────
const PIE_COLOR_PROSPECTION  = '#E0E7FF';
const PIE_COLOR_QUALIFICATION = '#DDD6FE';
const PIE_COLOR_PROPOSITION  = '#FDE8D8';
const PIE_COLOR_NEGOCIATION  = '#C4B5FD';
const PIE_COLOR_GAGNEE       = '#BFDBFE';
const PIE_COLOR_PERDUE       = '#FED7AA';
const PIE_COLOR_EMPTY        = '#F3F4F6';

const CHART_H   = 148;
const LABEL_H   = 22;
const CHART_PAD = 14;

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav    = NativeStackNavigationProp<VentesStackParamList, 'VentesHome'>;
type TabKey = 'resume' | 'leads' | 'devis';

// Labels des tabs = clés i18n (traduits via t() dans le rendu)
const TABS: Array<
  | { key: TabKey;     labelKey: string; navigate?: false }
  | { key: 'pipeline'; labelKey: string; navigate: true  }
> = [
  { key: 'resume',   labelKey: 'ventes.home.tabDashboard' },
  { key: 'leads',    labelKey: 'ventes.home.tabLeads' },
  { key: 'pipeline', labelKey: 'ventes.home.tabPipeline', navigate: true },
  { key: 'devis',    labelKey: 'ventes.home.tabQuotes' },
];

// ─────────────────────────────────────────────────────────────
// HELPERS SVG
// ─────────────────────────────────────────────────────────────

const buildLinePath = (pts: Array<{ x: number; y: number }>): string => {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i - 1].x + pts[i].x) / 2;
    d += ` C ${cpx.toFixed(1)},${pts[i - 1].y.toFixed(1)} ${cpx.toFixed(1)},${pts[i].y.toFixed(1)} ${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
  }
  return d;
};

const buildFillPath = (
  pts: Array<{ x: number; y: number }>,
  bottom: number,
): string => {
  const line = buildLinePath(pts);
  if (!line) return '';
  const last = pts[pts.length - 1];
  return `${line} L ${last.x.toFixed(1)},${bottom} L ${pts[0].x.toFixed(1)},${bottom} Z`;
};

const buildArc = (
  cx: number, cy: number, r: number,
  startDeg: number, endDeg: number,
): string => {
  if (Math.abs(endDeg - startDeg) < 0.1) return '';
  if (endDeg - startDeg >= 360) endDeg = startDeg + 359.9;
  const rad = (d: number) => (d - 90) * Math.PI / 180;
  const sx = cx + r * Math.cos(rad(startDeg));
  const sy = cy + r * Math.sin(rad(startDeg));
  const ex = cx + r * Math.cos(rad(endDeg));
  const ey = cy + r * Math.sin(rad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx},${cy} L ${sx.toFixed(1)},${sy.toFixed(1)} A ${r},${r} 0 ${large} 1 ${ex.toFixed(1)},${ey.toFixed(1)} Z`;
};

/** Chemin SVG d'un segment de donut (arc extérieur + arc intérieur) */
const buildDonutArc = (
  cx: number, cy: number, rOut: number, rIn: number,
  startDeg: number, endDeg: number,
): string => {
  if (Math.abs(endDeg - startDeg) < 0.01) return '';
  if (endDeg - startDeg >= 360) endDeg = startDeg + 359.9;
  const rad = (d: number) => (d - 90) * Math.PI / 180;
  const f   = (v: number) => v.toFixed(2);
  const osx = cx + rOut * Math.cos(rad(startDeg));
  const osy = cy + rOut * Math.sin(rad(startDeg));
  const oex = cx + rOut * Math.cos(rad(endDeg));
  const oey = cy + rOut * Math.sin(rad(endDeg));
  const iex = cx + rIn  * Math.cos(rad(endDeg));
  const iey = cy + rIn  * Math.sin(rad(endDeg));
  const isx = cx + rIn  * Math.cos(rad(startDeg));
  const isy = cy + rIn  * Math.sin(rad(startDeg));
  const lg  = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${f(osx)},${f(osy)} A ${rOut},${rOut} 0 ${lg} 1 ${f(oex)},${f(oey)} L ${f(iex)},${f(iey)} A ${rIn},${rIn} 0 ${lg} 0 ${f(isx)},${f(isy)} Z`;
};

// ── Config statique des segments donut ───────────────────────
type DonutSegment = { statut: string; labelKey: string; color: string; count: number; start: number; end: number };
const DONUT_CONFIG: Array<{ statut: string; labelKey: string; color: string }> = [
  { statut: 'PROSPECTION',   labelKey: 'ventes.statutOpportuniteShort.PROSPECTION',   color: PIE_COLOR_PROSPECTION  },
  { statut: 'QUALIFICATION', labelKey: 'ventes.statutOpportuniteShort.QUALIFICATION', color: PIE_COLOR_QUALIFICATION },
  { statut: 'PROPOSITION',   labelKey: 'ventes.statutOpportuniteShort.PROPOSITION',   color: PIE_COLOR_PROPOSITION  },
  { statut: 'NEGOCIATION',   labelKey: 'ventes.statutOpportuniteShort.NEGOCIATION',   color: PIE_COLOR_NEGOCIATION  },
  { statut: 'GAGNEE',        labelKey: 'ventes.statutOpportuniteShort.GAGNEE',        color: PIE_COLOR_GAGNEE       },
  { statut: 'PERDUE',        labelKey: 'ventes.statutOpportuniteShort.PERDUE',        color: PIE_COLOR_PERDUE       },
];

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Dashboard Ventes avec 3 tabs actifs et onglet Dashboard enrichi.
 * @author Riahi Dorsaf
 */
export const VentesHomeScreen: React.FC = () => {
  const styles     = useStyles(makeStyles);
  const theme      = useTheme();
  const { t, i18n } = useTranslation();
  const locale      = i18n.language === 'en' ? 'en-US' : 'fr-FR';
  const navigation = useNavigation<Nav>();

  // ── État ventes (tous tabs) ───────────────────────────────
  const [activeTab,       setActiveTab]       = useState<TabKey>('resume');
  const [allLeads,        setAllLeads]        = useState<LeadResponse[]>([]);
  const [allOpportunites, setAllOpportunites] = useState<{ statut: string }[]>([]);
  const [devis,           setDevis]           = useState<DevisResponse[]>([]);
  const [factures,        setFactures]        = useState<FactureResponse[]>([]);
  const [nbDevis,         setNbDevis]         = useState(0);
  const [isLoading,       setIsLoading]       = useState(true);
  const [isRefreshing,    setIsRefreshing]    = useState(false);

  // ── État dashboard stats ──────────────────────────────────
  const [statsVentes,        setStatsVentes]        = useState<StatsVentesResponse | null>(null);
  const [caMoisPrec,         setCaMoisPrec]         = useState(0);
  const [caParMois,          setCaParMois]          = useState<CaMensuelDto[]>([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const dashFirstLoad = useRef(true);

  // ── Animations ────────────────────────────────────────────
  const sectionAnims = useRef(
    Array.from({ length: 6 }, () => ({
      opacity:    new Animated.Value(0),
      translateY: new Animated.Value(20),
    })),
  ).current;
  const countProg = useRef(new Animated.Value(0)).current;
  const [prog,    setProg]    = useState(0);
  const [clipW,   setClipW]   = useState(0);
  const [chartW,  setChartW]  = useState(0);
  const [tooltipIdx, setTooltipIdx] = useState<number | null>(null);
  const chartScrollRef = useRef<ScrollView>(null);

  // ── Chargement données ventes ─────────────────────────────

  const charger = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    try {
      const [leadsRes, opRes, devisRes, facturesRes] = await Promise.allSettled([
        VenteApi.listerLeads(),
        VenteApi.listerOpportunites(),
        VenteApi.listerDevis(),
        VenteApi.listerFactures(),
      ]);
      if (leadsRes.status === 'fulfilled' && leadsRes.value.success)
        setAllLeads(leadsRes.value.data);
      if (opRes.status === 'fulfilled' && opRes.value.success)
        setAllOpportunites(opRes.value.data);
      if (devisRes.status === 'fulfilled' && devisRes.value.success) {
        const data = devisRes.value.data;
        setDevis(data.slice(0, 5));
        setNbDevis(data.filter(d => d.statut === 'ENVOYE').length);
      }
      if (facturesRes.status === 'fulfilled' && facturesRes.value.success)
        setFactures(facturesRes.value.data);
    } catch { /* silencieux */ }
    finally { setIsLoading(false); setIsRefreshing(false); }
  }, []);

  // ── Chargement statistiques dashboard ────────────────────

  const chargerStats = useCallback(async () => {
    if (dashFirstLoad.current) setIsDashboardLoading(true);
    try {
      const [statsRes, caRes, caMoisRes] = await Promise.allSettled([
        ReportingApi.getStatsVentes(),
        ReportingApi.getCAMoisPrecedent(),
        ReportingApi.getCaParMois(),
      ]);
      if (statsRes.status === 'fulfilled' && statsRes.value.success)
        setStatsVentes(statsRes.value.data);
      if (caRes.status === 'fulfilled' && caRes.value.success)
        setCaMoisPrec(caRes.value.data ?? 0);
      if (caMoisRes.status === 'fulfilled' && caMoisRes.value.success) {
        const raw = caMoisRes.value.data ?? [];
        setCaParMois(raw.map(d => ({
          ...d,
          montant: typeof (d.montant as unknown) === 'string'
            ? parseFloat(d.montant as unknown as string)
            : Number(d.montant ?? 0),
        })));
      }
    } catch { /* silencieux */ }
    finally {
      setIsDashboardLoading(false);
      dashFirstLoad.current = false;
    }
  }, []);

  useFocusEffect(useCallback(() => {
    charger();
    chargerStats();
  }, [charger, chargerStats]));

  // ── Animation : sections + count-up ──────────────────────

  useEffect(() => {
    if (!statsVentes || caParMois.length === 0) return;

    sectionAnims.forEach(a => {
      a.opacity.setValue(0);
      a.translateY.setValue(20);
    });
    countProg.setValue(0);
    setProg(0);

    Animated.stagger(100, sectionAnims.map(a =>
      Animated.parallel([
        Animated.timing(a.opacity,    { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(a.translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    )).start();

    const id = countProg.addListener(({ value }) => setProg(value));
    Animated.timing(countProg, { toValue: 1, duration: 800, useNativeDriver: false }).start();
    return () => countProg.removeListener(id);
  }, [statsVentes, caParMois]); // eslint-disable-line

  // ── Animation : courbe graphique + scroll auto ──────────────

  useEffect(() => {
    if (chartW <= 0 || caParMois.length === 0) return;
    const svgW = Math.max(caParMois.length * CHART_MONTH_W + CHART_PAD * 2, chartW);
    setClipW(0);
    const anim = new Animated.Value(0);
    const id   = anim.addListener(({ value }) => setClipW(value));
    Animated.timing(anim, { toValue: svgW, duration: 800, useNativeDriver: false })
      .start(() => {
        const scrollX = Math.max(0, svgW - chartW);
        chartScrollRef.current?.scrollTo({ x: scrollX, animated: true });
      });
    return () => anim.removeListener(id);
  }, [chartW, caParMois]); // eslint-disable-line

  // ── Dérivés ───────────────────────────────────────────────

  const ca = calculerCA(factures);
  const nbOpportActives = allOpportunites.filter(
    o => !['GAGNEE', 'PERDUE'].includes(o.statut),
  ).length;

  const refreshControl = (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={() => { charger(true); chargerStats(); }}
      tintColor={theme.colors.primary}
    />
  );

  const sectionStyle = (idx: number) => ({
    opacity:   sectionAnims[idx].opacity,
    transform: [{ translateY: sectionAnims[idx].translateY }],
  });

  // ─────────────────────────────────────────────────────────
  // SOUS-RENDUS DASHBOARD
  // ─────────────────────────────────────────────────────────

  const renderMiniBarChart = (last6: CaMensuelDto[]): React.ReactElement => {
    const maxBar = Math.max(...last6.map(d => d.montant), 1);
    return (
      <View style={styles.kpiBarChart}>
        {Array.from({ length: 6 }).map((_, i) => {
          const h = last6[i] ? Math.max(4, Math.round((last6[i].montant / maxBar) * 24)) : 4;
          return (
            <View
              key={i}
              style={[styles.kpiBar, { height: h, backgroundColor: i === 5 ? KPI_COLOR_CA : KPI_BAR_INACTIVE }]}
            />
          );
        })}
      </View>
    );
  };

  const renderCaCard = (value: number): React.ReactElement => {
    const last6 = caParMois.slice(-6);
    return (
      <View style={[styles.kpiCard, { borderLeftWidth: 3, borderLeftColor: KPI_COLOR_CA }]}>
        <Ionicons name="cash-outline" size={20} color={KPI_COLOR_CA} />
        <Text style={[styles.kpiCardValue, { color: KPI_COLOR_CA }]} numberOfLines={1}>
          {value.toLocaleString(locale)}{' '}
          <Text style={styles.kpiCardUnit}>TND</Text>
        </Text>
        <Text style={styles.kpiCardLabel}>{t('ventes.home.kpiPaidRevenue')}</Text>
        {renderMiniBarChart(last6)}
      </View>
    );
  };

  const renderSimpleKpiCard = (
    icon: string, value: number, label: string, color: string,
  ): React.ReactElement => (
    <View style={[styles.kpiCard, { borderLeftWidth: 3, borderLeftColor: color }]}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={[styles.kpiCardValue, { color }]} numberOfLines={1}>{value.toLocaleString(locale)}</Text>
      <Text style={styles.kpiCardLabel}>{label}</Text>
    </View>
  );

  const renderKpiCards = (): React.ReactElement => (
    <View style={styles.kpisGrid}>
      {renderCaCard(Math.round(ca * prog))}
      {renderSimpleKpiCard('people-outline',        Math.round((statsVentes?.nbLeadsActifs ?? 0) * prog), t('ventes.home.kpiActiveLeads'),  KPI_COLOR_LEADS)}
      {renderSimpleKpiCard('trending-up-outline',   Math.round(nbOpportActives * prog),                   t('ventes.home.kpiActiveOpport'), KPI_COLOR_OPPORT)}
      {renderSimpleKpiCard('document-text-outline', Math.round(nbDevis * prog),                           t('ventes.home.kpiSentQuotes'),   KPI_COLOR_DEVIS)}
    </View>
  );

  // ── Helpers graphe CA 12 mois ────────────────────────────────

  /** Calcule les coordonnées SVG des points CA mensuels */
  const buildChartPts = (svgW: number): Array<{ x: number; y: number }> => {
    if (svgW <= 0 || caParMois.length === 0) return [];
    const maxV  = Math.max(...caParMois.map(d => d.montant), 1);
    const dataH = CHART_H - CHART_PAD * 2;
    return caParMois.map((d, i) => ({
      x: CHART_PAD + i * CHART_MONTH_W + CHART_MONTH_W / 2,
      y: CHART_PAD + (1 - d.montant / maxV) * dataH,
    }));
  };

  /** Tooltip SVG au tap sur un point */
  const renderChartTooltip = (
    pts: Array<{ x: number; y: number }>,
    idx: number | null,
  ): React.ReactElement | null => {
    if (idx === null || !pts[idx] || !caParMois[idx]) return null;
    const pt  = pts[idx];
    const d   = caParMois[idx];
    const lbl = `${d.label} ${d.annee} — ${d.montant.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} TND`;
    const bw  = Math.min(lbl.length * 5.8 + 14, 190);
    const bx  = Math.max(2, pt.x - bw / 2);
    const by  = Math.max(2, pt.y - 34);
    return (
      <G>
        <Rect x={bx} y={by} width={bw} height={20} rx={4} fill={theme.colors.primary} />
        <SvgText x={bx + bw / 2} y={by + 14} textAnchor="middle" fontSize={9} fill="white" fontWeight="bold">
          {lbl}
        </SvgText>
      </G>
    );
  };

  /** Points tappables sur la courbe */
  const renderChartDots = (pts: Array<{ x: number; y: number }>): React.ReactElement[] =>
    pts.map((pt, i) => (
      <G key={i} onPress={() => setTooltipIdx(prev => prev === i ? null : i)}>
        <Circle cx={pt.x} cy={pt.y} r={14} fill="transparent" />
        <Circle
          cx={pt.x} cy={pt.y}
          r={tooltipIdx === i ? 5 : 3.5}
          fill={theme.colors.primary}
          stroke={theme.colors.bgSurface}
          strokeWidth={1.5}
        />
      </G>
    ));

  /** SVG scrollable du graphe CA */
  const renderChartSvg = (svgW: number, pts: Array<{ x: number; y: number }>): React.ReactElement => {
    const dataH    = CHART_H - CHART_PAD * 2;
    const linePath = buildLinePath(pts);
    const fillPath = buildFillPath(pts, CHART_H);
    return (
      <Svg width={svgW} height={CHART_H + LABEL_H}>
        <Defs>
          <SvgGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity={0.28} />
            <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity={0.02} />
          </SvgGradient>
          <ClipPath id="lineClip">
            <Rect x={0} y={0} width={clipW} height={CHART_H + LABEL_H} />
          </ClipPath>
        </Defs>
        {[0.25, 0.5, 0.75].map(f => (
          <Path key={f} d={`M ${CHART_PAD} ${(CHART_PAD + (1 - f) * dataH).toFixed(1)} H ${(svgW - CHART_PAD).toFixed(1)}`} stroke={theme.colors.border} strokeWidth={1} />
        ))}
        <G clipPath="url(#lineClip)">
          {fillPath ? <Path d={fillPath} fill="url(#fillGrad)" /> : null}
          {linePath ? <Path d={linePath} stroke={theme.colors.primary} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" /> : null}
          {renderChartDots(pts)}
          {renderChartTooltip(pts, tooltipIdx)}
        </G>
        {pts.map((pt, i) => (
          <SvgText key={i} x={pt.x} y={CHART_H + LABEL_H - 4} textAnchor="middle" fontSize={9} fill={theme.colors.textTertiary}>
            {caParMois[i]?.label}
          </SvgText>
        ))}
      </Svg>
    );
  };

  const renderLineChart = (): React.ReactElement => {
    const n    = caParMois.length;
    const svgW = n > 0 ? Math.max(n * CHART_MONTH_W + CHART_PAD * 2, chartW) : chartW;
    const pts  = buildChartPts(svgW);
    const evol = (() => {
      if (n < 2) return null;
      const prev = caParMois.slice(0, 6).reduce((s, d) => s + d.montant, 0);
      const curr = caParMois.slice(6).reduce((s, d) => s + d.montant, 0);
      return prev > 0 ? Math.round(((curr - prev) / prev) * 100) : null;
    })();
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('ventes.home.chart12Months')}</Text>
          {evol !== null && (
            <Text style={[styles.sectionLink, { color: evol >= 0 ? theme.colors.success : theme.colors.danger }]}>
              {evol >= 0 ? '+' : ''}{evol}% {t('ventes.home.chartEvol')}
            </Text>
          )}
        </View>
        <View style={styles.chartCard} onLayout={e => setChartW(e.nativeEvent.layout.width)}>
          {chartW > 0 && (
            <ScrollView ref={chartScrollRef} horizontal showsHorizontalScrollIndicator={false} scrollEventThrottle={16}>
              {renderChartSvg(svgW, pts)}
            </ScrollView>
          )}
        </View>
      </View>
    );
  };

  /** Carte performance individuelle — fond blanc épuré */
  const renderPerfCard = (
    icon: string, value: string, label: string,
  ): React.ReactElement => (
    <View style={styles.statCard}>
      <Ionicons name={icon as any} size={18} color={theme.colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderPerformanceGrid = (): React.ReactElement => {
    const s   = statsVentes;
    const fmt = (v: number) => v.toLocaleString(locale, { maximumFractionDigits: 0 });
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitleOnly}>{t('ventes.home.performanceTitle')}</Text>
        <View style={styles.statsGrid}>
          {renderPerfCard('trending-up-outline',      s ? `${s.tauxConversionLeads}%`        : '—', t('ventes.home.perfLeadsConverted'))}
          {renderPerfCard('trophy-outline',           s ? `${s.tauxConversionOpportunites}%` : '—', t('ventes.home.perfOpportWon'))}
          {renderPerfCard('checkmark-circle-outline', s ? `${s.tauxAcceptationDevis}%`       : '—', t('ventes.home.perfQuotesAccepted'))}
          {renderPerfCard('cart-outline',             s ? `${fmt(s.panierMoyen)} TND`         : '—', t('ventes.home.perfAvgBasket'))}
        </View>
      </View>
    );
  };

  const renderFinancialCards = (): React.ReactElement => {
    const s = statsVentes;
    const fmt = (v: number) => v.toLocaleString(locale, { maximumFractionDigits: 0 });
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitleOnly}>{t('ventes.home.financialTitle')}</Text>
        <View style={styles.finRow}>
          <View style={styles.finCard}>
            <Ionicons name="funnel-outline" size={18} color={theme.colors.primary} />
            <Text style={styles.finLabel}>{t('ventes.home.pipelineValue')}</Text>
            <Text style={styles.finValue}>{s ? fmt(s.valeurPipeline) : '—'}</Text>
            <Text style={styles.finUnit}>TND</Text>
            <Text style={styles.finDesc}>{t('ventes.home.pipelineValueDesc')}</Text>
          </View>
          <View style={styles.finCard}>
            <Ionicons name="calendar-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.finLabel}>{t('ventes.home.prevMonthRevenue')}</Text>
            <Text style={styles.finValue}>{fmt(caMoisPrec)}</Text>
            <Text style={styles.finUnit}>TND</Text>
            <Text style={styles.finDesc}>{t('ventes.home.prevMonthDesc')}</Text>
          </View>
        </View>
      </View>
    );
  };

  const buildDonutSegments = (): { segments: DonutSegment[]; total: number } => {
    const repart = statsVentes?.repartitionOpportunites ?? [];
    const total  = repart.reduce((s, r) => s + r.count, 0);
    let cum = 0;
    const segments = DONUT_CONFIG.reduce<DonutSegment[]>((acc, cfg) => {
      const count = repart.find(r => r.statut === cfg.statut)?.count ?? 0;
      if (count === 0 || total === 0) return acc;
      const angle = (count / total) * 360 * prog;
      acc.push({ ...cfg, count, start: cum, end: cum + angle });
      cum += angle;
      return acc;
    }, []);
    return { segments, total };
  };

  const renderDonutSvg = (segments: DonutSegment[], total: number): React.ReactElement => (
    <Svg width={160} height={160}>
      {total === 0 ? (
        <>
          <Circle cx={80} cy={80} r={68} fill={PIE_COLOR_EMPTY} />
          <Circle cx={80} cy={80} r={42} fill={theme.colors.bgSurface} />
          <SvgText x={80} y={84} textAnchor="middle" fontSize={10} fill={theme.colors.textTertiary}>
            {t('ventes.home.noOpportunity')}
          </SvgText>
        </>
      ) : (
        <>
          {segments.map(s => (
            <Path key={s.statut} d={buildDonutArc(80, 80, 68, 42, s.start, s.end)} fill={s.color} />
          ))}
          <Circle cx={80} cy={80} r={42} fill={theme.colors.bgSurface} />
          <SvgText x={80} y={75} textAnchor="middle" fontSize={22} fontWeight="700" fill={theme.colors.textPrimary}>
            {total}
          </SvgText>
          <SvgText x={80} y={91} textAnchor="middle" fontSize={10} fill={theme.colors.textSecondary}>
            {t('ventes.home.opportShort')}
          </SvgText>
        </>
      )}
    </Svg>
  );

  const renderPieLegend = (total: number): React.ReactElement => (
    <View style={styles.pieLegend}>
      {DONUT_CONFIG.map(cfg => {
        const count = statsVentes?.repartitionOpportunites?.find(r => r.statut === cfg.statut)?.count ?? 0;
        if (total > 0 && count === 0) return null;
        return (
          <View key={cfg.statut} style={styles.pieLegendItem}>
            <View style={[styles.pieLegendDot, { backgroundColor: cfg.color }]} />
            <Text style={styles.pieLegendLabel}>{t(cfg.labelKey)}</Text>
            <Text style={styles.pieLegendCount}>{count}</Text>
          </View>
        );
      })}
    </View>
  );

  const renderPieChart = (): React.ReactElement => {
    const { segments, total } = buildDonutSegments();
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitleOnly}>{t('ventes.home.pipelineDistribution')}</Text>
        <View style={styles.pieCard}>
          {renderDonutSvg(segments, total)}
          {renderPieLegend(total)}
        </View>
      </View>
    );
  };

  const renderTop3Item = (
    o: { id: number; titre: string; clientNom: string; montantEstime: number | null },
    idx: number,
  ): React.ReactElement => (
    <TouchableOpacity
      key={o.id}
      style={styles.top3Item}
      onPress={() => navigation.navigate('OpportuniteDetail', { opportuniteId: o.id })}
      activeOpacity={0.75}
    >
      <LinearGradient
        colors={[RANK_COLORS[idx] + '40', RANK_COLORS[idx] + '15']}
        style={styles.top3RankBadge}
      >
        <Text style={[styles.top3RankText, { color: RANK_COLORS[idx] }]}>
          #{idx + 1}
        </Text>
      </LinearGradient>
      <View style={styles.top3Info}>
        <Text style={styles.top3Titre} numberOfLines={1}>{o.titre}</Text>
        <Text style={styles.top3Client} numberOfLines={1}>{o.clientNom}</Text>
      </View>
      <Text style={[styles.top3Montant, { color: RANK_COLORS[idx] }]}>
        {o.montantEstime != null
          ? o.montantEstime.toLocaleString(locale, { maximumFractionDigits: 0 }) + ' TND'
          : '—'}
      </Text>
    </TouchableOpacity>
  );

  const renderTop3 = (): React.ReactElement => {
    const top3 = statsVentes?.top3Opportunites ?? [];
    return (
      <View style={[styles.section, { paddingBottom: 16 }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('ventes.home.top3Title')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OpportunitesKanban')}>
            <Text style={styles.sectionLink}>{t('ventes.home.kanban')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.top3Card}>
          {top3.length === 0 ? (
            <EmptyState
              icon="trophy-outline"
              titre={t('ventes.home.top3Empty')}
              soustitre={t('ventes.home.top3EmptySub')}
            />
          ) : (
            top3.map((o, i) => renderTop3Item(o, i))
          )}
        </View>
      </View>
    );
  };

  // ── Tab Dashboard ─────────────────────────────────────────

  const renderResumeTab = () => {
    if (isDashboardLoading) {
      return (
        <View style={styles.dashLoading}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.dashLoadingText}>{t('ventes.home.loadingDashboard')}</Text>
        </View>
      );
    }
    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        <Animated.View style={sectionStyle(0)}>{renderKpiCards()}</Animated.View>
        <Animated.View style={sectionStyle(1)}>{renderLineChart()}</Animated.View>
        <Animated.View style={sectionStyle(2)}>{renderPerformanceGrid()}</Animated.View>
        <Animated.View style={sectionStyle(3)}>{renderFinancialCards()}</Animated.View>
        <Animated.View style={sectionStyle(4)}>{renderPieChart()}</Animated.View>
        <Animated.View style={sectionStyle(5)}>{renderTop3()}</Animated.View>
      </ScrollView>
    );
  };

  // ── Tab Leads ─────────────────────────────────────────────

  const renderLeadsTab = () => (
    <View style={styles.tabContent}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('ventes.home.allLeads', { nb: allLeads.length })}
            </Text>
          </View>
          {allLeads.length === 0 ? (
            <EmptyState
              icon="people-outline"
              titre={t('ventes.home.noLeads')}
              soustitre={t('ventes.home.noLeadsSub')}
            />
          ) : (
            allLeads.map(l => {
              const conf = STATUT_LEAD_CONFIG[l.statut];
              return (
                <TouchableOpacity
                  key={l.id}
                  style={styles.listItem}
                  onPress={() => navigation.navigate('LeadDetail', { leadId: l.id })}
                  activeOpacity={0.75}
                >
                  <View style={[styles.recentIconWrapper, { backgroundColor: conf.bg }]}>
                    <Ionicons name="person-outline" size={18} color={conf.color} />
                  </View>
                  <View style={styles.recentContent}>
                    <Text style={styles.recentTitle} numberOfLines={1}>{l.nom}</Text>
                    <Text style={styles.recentSub} numberOfLines={1}>
                      {l.entreprise ?? l.email ?? l.telephone ?? t('ventes.home.noInfo')}
                    </Text>
                    <View style={{ marginTop: 4 }}>
                      <ScoreBar score={l.score} showLabel={false} />
                    </View>
                  </View>
                  <View style={[styles.badge, { backgroundColor: conf.bg }]}>
                    <Text style={[styles.badgeText, { color: conf.color }]}>
                      {t(conf.labelKey)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('LeadForm', {})}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );

  // ── Tab Devis & Factures ──────────────────────────────────

  const renderDevisTab = () => (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('ventes.home.recentQuotes')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DevisList')}>
            <Text style={styles.sectionLink}>{t('ventes.home.seeAllQuotes')}</Text>
          </TouchableOpacity>
        </View>
        {devis.length === 0 ? (
          <EmptyState
            icon="document-text-outline"
            titre={t('ventes.home.noQuotes')}
            soustitre={t('ventes.home.noQuotesSub')}
          />
        ) : (
          devis.slice(0, 3).map(d => {
            const conf = STATUT_DEVIS_CONFIG[d.statut];
            return (
              <TouchableOpacity
                key={d.id}
                style={styles.listItem}
                onPress={() => navigation.navigate('DevisDetail', { devisId: d.id })}
                activeOpacity={0.75}
              >
                <View style={[styles.recentIconWrapper, { backgroundColor: conf.bg }]}>
                  <Ionicons name="document-text-outline" size={18} color={conf.color} />
                </View>
                <View style={styles.recentContent}>
                  <Text style={styles.recentTitle} numberOfLines={1}>{d.numero}</Text>
                  <Text style={styles.recentSub}>{d.clientNom}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <View style={[styles.badge, { backgroundColor: conf.bg }]}>
                    <Text style={[styles.badgeText, { color: conf.color }]}>{t(conf.labelKey)}</Text>
                  </View>
                  <Text style={[styles.recentMontant, { marginTop: 4 }]}>
                    {formaterMontant(d.montantTtc)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('ventes.home.recentInvoices')}</Text>
        </View>
        {factures.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            titre={t('ventes.home.noInvoices')}
            soustitre={t('ventes.home.noInvoicesSub')}
          />
        ) : (
          factures.slice(0, 3).map(f => {
            const conf = STATUT_FACTURE_CONFIG[f.statut];
            return (
              <TouchableOpacity
                key={f.id}
                style={styles.listItem}
                onPress={() => navigation.navigate('FactureDetail', { factureId: f.id })}
                activeOpacity={0.75}
              >
                <View style={[styles.recentIconWrapper, { backgroundColor: conf.bg }]}>
                  <Ionicons name="receipt-outline" size={18} color={conf.color} />
                </View>
                <View style={styles.recentContent}>
                  <Text style={styles.recentTitle} numberOfLines={1}>{f.numero}</Text>
                  <Text style={styles.recentSub}>{f.clientNom}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <View style={[styles.badge, { backgroundColor: conf.bg }]}>
                    <Text style={[styles.badgeText, { color: conf.color }]}>{t(conf.labelKey)}</Text>
                  </View>
                  <Text style={[styles.recentMontant, { marginTop: 4 }]}>
                    {formaterMontant(f.montantTtc)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );

  // ── Chargement initial ────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <SkeletonKpiGrid />
      </SafeAreaView>
    );
  }

  // ── Rendu principal ───────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('screens.salesHome.title')}</Text>
        <Text style={styles.headerSub}>{t('screens.salesHome.subtitle')}</Text>
      </View>

      <View style={styles.tabBar}>
        {TABS.map(tab => {
          const isActive = !tab.navigate && activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() =>
                tab.navigate
                  ? navigation.navigate('OpportunitesKanban')
                  : setActiveTab(tab.key)
              }
              activeOpacity={0.8}
            >
              <Text style={[styles.tabItemText, isActive && styles.tabItemTextActive]}>
                {t(tab.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {activeTab === 'resume' && renderResumeTab()}
      {activeTab === 'leads'  && renderLeadsTab()}
      {activeTab === 'devis'  && renderDevisTab()}

    </SafeAreaView>
  );
};
