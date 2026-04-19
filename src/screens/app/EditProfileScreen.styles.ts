import { StyleSheet } from 'react-native';
import { AppTheme }   from '../../theme';
import { layout }     from '../../theme/dimensions';

export const makeStyles = (theme: AppTheme) => StyleSheet.create({

  safe: { flex: 1, backgroundColor: theme.colors.bgApp },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: theme.colors.textSecondary, fontSize: theme.typography.size.base },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: layout.screenPadding, paddingVertical: theme.spacing[4],
    backgroundColor: theme.colors.bgSurface,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
    columnGap: theme.spacing[3],
  },

  backBtn: {
    width: 44, height: 44, borderRadius: theme.radius.full,
    backgroundColor: theme.colors.bgApp, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: theme.colors.border,
  },
  backIcon: { fontSize: 20, color: theme.colors.textPrimary },

  headerTitle: {
    flex: 1,
    fontSize: theme.typography.size.lg, fontWeight: '700', color: theme.colors.textPrimary,
  },

  annulerBtn: { paddingHorizontal: theme.spacing[3], paddingVertical: theme.spacing[2] },
  annulerText: { fontSize: theme.typography.size.sm, color: theme.colors.danger, fontWeight: '600' },

  scroll: { flex: 1 },
  content: {
    flexGrow: 1, paddingHorizontal: layout.screenPadding,
    paddingVertical: theme.spacing[5], paddingBottom: theme.spacing[10],
  },

  avatarSection: { alignItems: 'center', marginBottom: theme.spacing[6] },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: theme.spacing[3],
    borderWidth: 2, borderColor: theme.colors.primary,
  },
  avatarText: { fontSize: theme.typography.size.xl, fontWeight: '700', color: theme.colors.primary },
  avatarName: { fontSize: theme.typography.size.md, fontWeight: '600', color: theme.colors.textPrimary },
  avatarEmail: { fontSize: theme.typography.size.sm, color: theme.colors.textSecondary },

  card: { marginBottom: theme.spacing[4] },
  cardTitle: {
    fontSize: theme.typography.size.base, fontWeight: '600',
    color: theme.colors.textPrimary, marginBottom: theme.spacing[4],
  },

  // ── Fiche lecture ──
  ficheRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing[1],
  },
  ficheLabel: { fontSize: theme.typography.size.sm, color: theme.colors.textSecondary, fontWeight: '500' },
  ficheValue: { fontSize: theme.typography.size.sm, color: theme.colors.textPrimary, fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: theme.spacing[4] },
ficheMono: { fontFamily: 'monospace' },

  // ── Alertes ──
  alertSuccess: {
    backgroundColor: theme.colors.successLight, borderWidth: 1, borderColor: theme.colors.success,
    borderRadius: theme.radius.md, padding: theme.spacing[3], marginBottom: theme.spacing[4],
  },
  alertSuccessText: { fontSize: theme.typography.size.sm, color: theme.colors.successText },
  alertError: {
    backgroundColor: theme.colors.dangerLight, borderWidth: 1, borderColor: theme.colors.danger,
    borderRadius: theme.radius.md, padding: theme.spacing[3], marginBottom: theme.spacing[4],
  },
  alertErrorText: { fontSize: theme.typography.size.sm, color: theme.colors.dangerText },

  // ── Email non modifiable ──
  emailField: { marginBottom: theme.spacing[4] },
  emailLabel: { fontSize: theme.typography.size.sm, fontWeight: '500', color: theme.colors.textSecondary, marginBottom: theme.spacing[2] },
  emailValue: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5,
    borderColor: theme.colors.border, borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bgApp, paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3], columnGap: theme.spacing[2],
  },
  emailText: { fontSize: theme.typography.size.base, color: theme.colors.textTertiary, flex: 1 },
  emailLock: { fontSize: 14 },

  btnSubmit: { marginTop: theme.spacing[4] },
});