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

const CHART_H   = 148;
const LABEL_H   = 22;
const CHART_PAD = 14;

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Nav    = NativeStackNavigationProp<VentesStackParamList, 'VentesHome'>;
type TabKey = 'resume' | 'leads' | 'devis';

const TABS: Array<
  | { key: TabKey;     label: string; navigate?: false }
  | { key: 'pipeline'; label: string; navigate: true  }
> = [
  { key: 'resume',   label: 'Dashboard' },
  { key: 'leads',    label: 'Leads' },
  { key: 'pipeline', label: 'Pipeline', navigate: true },
  { key: 'devis',    label: 'Devis & Fact.' },
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

  // ── Config PIE (dépend de theme) ──────────────────────────
  const PIE_CONFIG = [
    { statut: 'PROSPECTION',   label: 'Prospect.', color: theme.colors.info },
    { statut: 'QUALIFICATION', label: 'Qualif.',   color: theme.colors.primary },
    { statut: 'PROPOSITION',   label: 'Propos.',   color: theme.colors.warning },
    { statut: 'NEGOCIATION',   label: 'Négoc.',    color: theme.colors.statutSuspendu },
    { statut: 'GAGNEE',        label: 'Gagnée',    color: theme.colors.success },
    { statut: 'PERDUE',        label: 'Perdue',    color: theme.colors.danger },
  ];

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
          {value.toLocaleString('fr-FR')}{' '}
          <Text style={styles.kpiCardUnit}>TND</Text>
        </Text>
        <Text style={styles.kpiCardLabel}>CA payé</Text>
        {renderMiniBarChart(last6)}
      </View>
    );
  };

  const renderSimpleKpiCard = (
    icon: string, value: number, label: string, color: string,
  ): React.ReactElement => (
    <View style={[styles.kpiCard, { borderLeftWidth: 3, borderLeftColor: color }]}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={[styles.kpiCardValue, { color }]} numberOfLines={1}>{value.toLocaleString('fr-FR')}</Text>
      <Text style={styles.kpiCardLabel}>{label}</Text>
    </View>
  );

  const renderKpiCards = (): React.ReactElement => (
    <View style={styles.kpisGrid}>
      {renderCaCard(Math.round(ca * prog))}
      {renderSimpleKpiCard('people-outline',        Math.round((statsVentes?.nbLeadsActifs ?? 0) * prog), 'Leads actifs',  KPI_COLOR_LEADS)}
      {renderSimpleKpiCard('trending-up-outline',   Math.round(nbOpportActives * prog),                   'Opport. act.',  KPI_COLOR_OPPORT)}
      {renderSimpleKpiCard('document-text-outline', Math.round(nbDevis * prog),                           'Devis envoyés', KPI_COLOR_DEVIS)}
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
          <Text style={styles.sectionTitle}>CA sur 12 mois</Text>
          {evol !== null && (
            <Text style={[styles.sectionLink, { color: evol >= 0 ? theme.colors.success : theme.colors.danger }]}>
              {evol >= 0 ? '+' : ''}{evol}% (S2 vs S1)
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

  const renderPerformanceGrid = () => {
    const s = statsVentes;
    const fmt = (v: number) => v.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
    const items = [
      { label: 'Conv. leads',   value: s ? `${s.tauxConversionLeads}%`        : '—', icon: 'trending-up-outline',     color: theme.colors.primary,        bg: theme.colors.primaryLight },
      { label: 'Conv. opport.', value: s ? `${s.tauxConversionOpportunites}%` : '—', icon: 'trophy-outline',           color: theme.colors.success,        bg: theme.colors.successLight },
      { label: 'Acc. devis',    value: s ? `${s.tauxAcceptationDevis}%`       : '—', icon: 'checkmark-circle-outline', color: theme.colors.warning,        bg: theme.colors.warningLight },
      { label: 'Panier moyen',  value: s ? `${fmt(s.panierMoyen)} TND`  : '—', icon: 'cart-outline',             color: theme.colors.info,           bg: theme.colors.infoLight },
    ];
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitleOnly}>Performance commerciale</Text>
        <View style={styles.statsGrid}>
          {items.map(item => (
            <View key={item.label} style={styles.statCard}>
              <View style={[styles.statIconBadge, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon as any} size={16} color={item.color} />
              </View>
              <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderFinancialCards = () => {
    const s = statsVentes;
    const fmt = (v: number) => v.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitleOnly}>Indicateurs financiers</Text>
        <View style={styles.finRow}>
          <View style={styles.finCard}>
            <Ionicons name="funnel-outline" size={18} color={theme.colors.primary} />
            <Text style={styles.finLabel}>Valeur pipeline</Text>
            <Text style={styles.finValue}>{s ? fmt(s.valeurPipeline) : '—'}</Text>
            <Text style={styles.finUnit}>TND</Text>
          </View>
          <View style={styles.finCard}>
            <Ionicons name="calendar-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.finLabel}>CA mois précédent</Text>
            <Text style={styles.finValue}>{fmt(caMoisPrec)}</Text>
            <Text style={styles.finUnit}>TND</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPieChart = () => {
    const repart = statsVentes?.repartitionOpportunites ?? [];
    const total  = repart.reduce((s, r) => s + r.count, 0);
    const CX = 55, CY = 55, R = 46;
    let cumAngle = 0;
    const segments = PIE_CONFIG.map(cfg => {
      const count = repart.find(r => r.statut === cfg.statut)?.count ?? 0;
      const angle = total > 0 ? (count / total) * 360 * prog : 0;
      const seg   = { ...cfg, count, start: cumAngle, end: cumAngle + angle };
      cumAngle   += angle;
      return seg;
    });

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitleOnly}>Répartition pipeline</Text>
        <View style={styles.pieCard}>
          <Svg width={110} height={110}>
            {total === 0 ? (
              <Path d={buildArc(CX, CY, R, 0, 359.9)} fill={theme.colors.border} />
            ) : (
              segments.map(seg => (
                <Path
                  key={seg.statut}
                  d={buildArc(CX, CY, R, seg.start, seg.end)}
                  fill={seg.color}
                />
              ))
            )}
          </Svg>
          <View style={styles.pieLegend}>
            {PIE_CONFIG.map(cfg => {
              const count = repart.find(r => r.statut === cfg.statut)?.count ?? 0;
              return (
                <View key={cfg.statut} style={styles.pieLegendItem}>
                  <View style={[styles.pieLegendDot, { backgroundColor: cfg.color }]} />
                  <Text style={styles.pieLegendLabel}>{cfg.label}</Text>
                  <Text style={styles.pieLegendCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderTop3 = () => {
    const top3 = statsVentes?.top3Opportunites ?? [];
    return (
      <View style={[styles.section, { paddingBottom: 16 }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top 3 opportunités</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OpportunitesKanban')}>
            <Text style={styles.sectionLink}>Kanban</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.top3Card}>
          {top3.length === 0 ? (
            <EmptyState
              icon="trophy-outline"
              titre="Aucune opportunité active"
              soustitre="Ajoutez des opportunités au pipeline"
            />
          ) : (
            top3.map((o, idx) => (
              <TouchableOpacity
                key={o.id}
                style={styles.top3Item}
                onPress={() =>
                  navigation.navigate('OpportuniteDetail', { opportuniteId: o.id })
                }
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
                    ? o.montantEstime.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' TND'
                    : '—'}
                </Text>
              </TouchableOpacity>
            ))
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
          <Text style={styles.dashLoadingText}>Chargement du dashboard…</Text>
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
              Tous les leads ({allLeads.length})
            </Text>
          </View>
          {allLeads.length === 0 ? (
            <EmptyState
              icon="people-outline"
              titre="Aucun lead"
              soustitre="Ajoutez votre premier prospect"
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
                      {l.entreprise ?? l.email ?? l.telephone ?? 'Aucune info'}
                    </Text>
                    <View style={{ marginTop: 4 }}>
                      <ScoreBar score={l.score} showLabel={false} />
                    </View>
                  </View>
                  <View style={[styles.badge, { backgroundColor: conf.bg }]}>
                    <Text style={[styles.badgeText, { color: conf.color }]}>
                      {conf.label}
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
          <Text style={styles.sectionTitle}>Devis récents</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DevisList')}>
            <Text style={styles.sectionLink}>Voir tous</Text>
          </TouchableOpacity>
        </View>
        {devis.length === 0 ? (
          <EmptyState
            icon="document-text-outline"
            titre="Aucun devis"
            soustitre="Aucun devis n'a été créé"
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
                    <Text style={[styles.badgeText, { color: conf.color }]}>{conf.label}</Text>
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
          <Text style={styles.sectionTitle}>Factures récentes</Text>
        </View>
        {factures.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            titre="Aucune facture"
            soustitre="Aucune facture n'a été générée"
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
                    <Text style={[styles.badgeText, { color: conf.color }]}>{conf.label}</Text>
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
        <Text style={styles.headerTitle}>Ventes</Text>
        <Text style={styles.headerSub}>Pipeline commercial</Text>
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
                {tab.label}
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
