/**
 * @file documentPdf.ts
 * @description Generateur HTML partage du PDF d'un document commercial (devis / facture).
 *              Meme charte pour les deux : entete marque, tableau des lignes, totaux
 *              HT/TVA/TTC, notes, footer. Compatible expo-print.
 * @author Riahi Dorsaf
 */

/** Ligne minimale necessaire au rendu d'un document (devis ou facture). */
export interface LigneDocPdf {
  designation:    string;
  quantite:       number;
  prixUnitaireHt: number;
  remise:         number;
  tauxTva:        number;
  montantTtc:     number;
}

export interface DocumentPdf {
  marque:     string;
  numero:     string;
  /** Ligne de sous-titre sous le numero (ex : « Emise le … » ou « Etabli le … »). */
  dateLigne:  string;
  clientNom:  string;
  /** Reference optionnelle affichee sous le client (ex : « Ref devis : … »). */
  refLigne?:  string;
  lignes:     LigneDocPdf[];
  montantHt:  number;
  montantTva: number;
  montantTtc: number;
  notes?:     string | null;
}

/** Genere le HTML d'impression d'un document commercial (compatible expo-print). */
export const genererHtmlDocument = (d: DocumentPdf): string => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #1F2937; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
    .brand { font-size: 24px; font-weight: 800; color: #2563EB; }
    .doc-info { text-align: right; }
    .doc-num { font-size: 18px; font-weight: 700; color: #1F2937; }
    .doc-date { font-size: 11px; color: #6B7280; margin-top: 4px; }
    .divider { border: none; border-top: 1px solid #E5E7EB; margin: 24px 0; }
    .client-section { margin-bottom: 24px; }
    .section-label { font-size: 10px; font-weight: 700; color: #6B7280;
                     text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
    .client-nom { font-size: 14px; font-weight: 600; color: #1F2937; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { background: #F9FAFB; padding: 10px 12px; text-align: left;
         font-size: 10px; font-weight: 700; color: #6B7280; text-transform: uppercase;
         border-bottom: 2px solid #E5E7EB; }
    td { padding: 10px 12px; border-bottom: 1px solid #F3F4F6; vertical-align: top; }
    td.num { text-align: right; font-weight: 500; }
    .totaux { margin-left: auto; width: 280px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0;
                 border-bottom: 1px solid #F3F4F6; font-size: 12px; }
    .total-row.ttc { background: #2563EB; color: white; padding: 12px 16px;
                     border-radius: 8px; font-weight: 700; font-size: 14px; margin-top: 4px; }
    .footer { margin-top: 48px; text-align: center; font-size: 10px; color: #9CA3AF; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">${d.marque}</div>
    </div>
    <div class="doc-info">
      <div class="doc-num">${d.numero}</div>
      <div class="doc-date">${d.dateLigne}</div>
    </div>
  </div>

  <hr class="divider"/>

  <div class="client-section">
    <div class="section-label">Destinataire</div>
    <div class="client-nom">${d.clientNom}</div>
    ${d.refLigne ? `<div style="font-size:11px;color:#6B7280;margin-top:4px;">${d.refLigne}</div>` : ''}
  </div>

  <table>
    <thead>
      <tr>
        <th>Designation</th>
        <th style="text-align:right">Qte</th>
        <th style="text-align:right">PU HT</th>
        <th style="text-align:right">Remise</th>
        <th style="text-align:right">TVA</th>
        <th style="text-align:right">Total TTC</th>
      </tr>
    </thead>
    <tbody>
      ${d.lignes.map(l => `
        <tr>
          <td>${l.designation}</td>
          <td class="num">${l.quantite}</td>
          <td class="num">${l.prixUnitaireHt.toFixed(3)}</td>
          <td class="num">${l.remise > 0 ? l.remise + '%' : '-'}</td>
          <td class="num">${l.tauxTva > 0 ? l.tauxTva + '%' : '-'}</td>
          <td class="num"><strong>${l.montantTtc.toFixed(3)} TND</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totaux">
    <div class="total-row">
      <span>Sous-total HT</span>
      <span>${d.montantHt.toFixed(3)} TND</span>
    </div>
    <div class="total-row">
      <span>TVA</span>
      <span>${d.montantTva.toFixed(3)} TND</span>
    </div>
    <div class="total-row ttc">
      <span>TOTAL TTC</span>
      <span>${d.montantTtc.toFixed(3)} TND</span>
    </div>
  </div>

  ${d.notes ? `<div style="margin-top:32px;"><div class="section-label">Notes</div><p style="color:#4B5563;font-size:12px;margin-top:4px;">${d.notes}</p></div>` : ''}

  <div class="footer">
    Merci de votre confiance.
  </div>
</body>
</html>
`;
