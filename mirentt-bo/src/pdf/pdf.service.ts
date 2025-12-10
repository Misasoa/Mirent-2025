import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  async generateProformaPdf(proforma: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 72, right: 72 },
        });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Logo en haut
        const logoPath = path.join(__dirname, '..', '..', 'assets', 'logo.png');
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 72, 50, { width: 100 });
        }

        // Informations du client
        doc.fontSize(12).text(`Client: ${proforma.client.lastName}`, 400, 50);

        // Informations de la facture proforma
        doc
          .fontSize(14)
          .text(`FACTURE PROFORMA N° ${proforma.proformaNumber}`, 72, 120);
        doc.fontSize(12).text(proforma.contractReference, 72, 140);

        // Tableau pour les détails de la location
        const table = {
          headers: [
            'Réf.',
            'Voiture',
            'Numéro',
            'Destination',
            'Date',
            'Jour',
            'Carburant',
            'Prix unitaire',
            'Prix total',
          ],
          rows: proforma.items.map((item) => {
            // Ajout des logs ici
            console.log('--- Item Debug ---');
            console.log('item:', item);
            console.log('item.prix:', item.prix);
            console.log('item.prix.prix:', item.prix?.prix); // Utilisation de l'optional chaining
            console.log('Type of item.prix.prix:', typeof item.prix?.prix); // Utilisation de l'optional chaining

            const prix = parseFloat(item.prix.prix);

            return [
              '1',
              `${item.vehicle.marque} ${item.vehicle.modele}`,
              '',
              item.region.nom_region,
              new Date(item.dateDepart).toLocaleDateString(),
              item.nombreJours.toString(),
              '-',
              prix ? prix.toFixed(2) : 'N/A', // Utilisation d'un ternaire pour éviter l'erreur si prix est undefined
              item.subTotal.toFixed(2),
            ];
          }),
        };

        doc.moveDown();
        this.drawTable(doc, table);

        // Totaux
        const totalY = doc.y + 20;
        doc.fontSize(12).text('TOTAL', 72, totalY);
        doc.text(proforma.totalAmount.toFixed(2), 500, totalY);

        const totalCarburantY = totalY + 20;
        doc.text('MONTANT TOTAL AVEC CARBURANT', 72, totalCarburantY);
        doc.text(proforma.totalAmount.toFixed(2), 500, totalCarburantY);

        // Somme en lettres
        const sommeLettresY = totalCarburantY + 40;
        doc
          .fontSize(12)
          .text(
            `Arrêtée la présente facture proforma à la somme de: "${this.nombreEnLettres(proforma.totalAmount)} ARIARY".`,
            72,
            sommeLettresY,
          );

        // Date et signature
        const dateY = sommeLettresY + 40;
        doc
          .fontSize(12)
          .text(
            `Antananarivo, le ${new Date(proforma.date).toLocaleDateString()}`,
            400,
            dateY,
          );
        doc.text('Pour Mirent,', 400, dateY + 20);

        // Logo en bas
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 72, 700, { width: 100 });
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateReservationPdf(reservation: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 40, bottom: 40, left: 40, right: 40 }, // Marge un peu plus fine comme le HTML
        });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // --- EN-TÊTE ---
        const logoPath = path.join(__dirname, '..', '..', 'assets', 'logo.png');
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 40, 40, { width: 120 });
        }

        // Boîte Client (Alignée à droite comme dans le HTML "header" flex justify-between)
        // Mais dans le PDFKit c'est absolu. HTML: logo à gauche, client à droite.
        doc.font('Helvetica-Bold').fontSize(10);
        doc.text('Client:', 400, 50);
        doc.font('Helvetica').fontSize(10);
        if (reservation.client) {
          const clientName = `${reservation.client.nom || ''} ${reservation.client.lastName || reservation.client.prenom || ''}`.trim();
          doc.text(clientName || reservation.client.email || 'N/A', 400, 65);

          let currentY = 80;
          if (reservation.client.phone) {
            doc.text(reservation.client.phone, 400, currentY);
            currentY += 15;
          }
          if (reservation.client.email) {
            doc.text(reservation.client.email, 400, currentY);
          }
        }

        doc.moveDown();

        // --- TITRE CENTRÉ ---
        const titleY = 130;
        doc.font('Helvetica-Bold').fontSize(16);
        doc.text(`DEVIS N° ${reservation.reference}`, 40, titleY, { align: 'center', width: 515 });

        doc.font('Helvetica').fontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 40, titleY + 25, { align: 'center', width: 515 });

        // --- TABLEAU PRINCIPAL ---
        // Headers: Réf., Voiture, Destination, Période, Jours, Prix total
        // Admin Headers: Réf., Voiture, Destination, Période, Jours, Prix total
        const tableY = titleY + 60;

        const rows: any[] = [];
        if (reservation.vehicule) {
          const pickup = new Date(reservation.pickup_date).toLocaleDateString('fr-FR');
          const ret = new Date(reservation.return_date).toLocaleDateString('fr-FR');
          const periode = `Du ${pickup} au ${ret}`;
          const vehiculeStr = `${reservation.vehicule.marque} ${reservation.vehicule.modele} ${reservation.vehicule.immatriculation || ''}`;

          rows.push([
            reservation.reference,
            vehiculeStr,
            reservation.location?.nom_region || 'N/A',
            periode,
            reservation.nombreJours ? reservation.nombreJours.toString() : '0',
            this.formatCurrency(Number(reservation.total_price || 0)),
          ]);
        }

        const table = {
          headers: [
            'Réf.',
            'Voiture',
            'Destination',
            'Période',
            'Jours',
            'Prix total',
          ],
          rows: rows,
        };

        // Position curseur
        doc.y = tableY;
        // Colonnes adaptées au style admin
        const columnWidths = [60, 130, 80, 120, 50, 80];
        this.drawTableCustom(doc, table, columnWidths);

        // --- TOTAL ---
        const afterTableY = doc.y + 10;

        // Ligne TOTAL style admin (bordure, aligné droite)
        const totalX = 40 + columnWidths.slice(0, 5).reduce((a, b) => a + b, 0); // Start of last column
        const totalWidth = columnWidths[5];

        doc.font('Helvetica-Bold').fontSize(10);
        doc.text('TOTAL', 40, afterTableY, { align: 'right', width: 440 }); // Jusqu'à la colonne Prix
        doc.text(this.formatCurrency(Number(reservation.total_price || 0)), totalX, afterTableY, { width: totalWidth, align: 'left' });

        // --- SOMME EN LETTRES ---
        const lettreY = afterTableY + 40;
        doc.font('Helvetica').fontSize(10);
        const totalAmount = reservation.total_price ? Number(reservation.total_price) : 0;
        doc.text(
          `Arrêtée le présent devis à la somme de: "${this.nombreEnLettres(totalAmount)} ARIARY".`,
          40,
          lettreY
        );

        // --- FOOTER SECTION (Statut, Date, Signature) ---
        const footerY = lettreY + 50;

        // Statut et Date à droite
        doc.text(`Statut: ${reservation.status}`, 350, footerY, { align: 'right' });
        doc.text(`Antananarivo, le ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}`, 350, footerY + 15, { align: 'right' });
        doc.text('Pour Mirent,', 350, footerY + 30, { align: 'right' });

        // Image signature (fictive ou réelle si dispo)
        const sigPath = path.join(__dirname, '..', '..', 'assets', 'signature.png');
        if (fs.existsSync(sigPath)) {
          doc.image(sigPath, 450, footerY + 45, { width: 100 });
        }

        // Boite signature
        doc.rect(400, footerY + 100, 150, 0).stroke(); // Ligne du dessus
        doc.fontSize(8).text("Signature et cachet de l'entreprise", 400, footerY + 105, { align: 'center', width: 150 });

        // --- CONTACT INFO FOOTER ---
        const contactY = 700; // Positionné en bas de page
        doc.moveTo(40, contactY).lineTo(555, contactY).strokeColor('#ddd').stroke();

        doc.font('Helvetica').fontSize(8).fillColor('#000');
        doc.text(
          'Mail: mirent.mdg@gmail.com | Tel: +261 34 25 690 04',
          40,
          contactY + 10,
          { align: 'center', width: 515 }
        );
        doc.text(
          'Lot II F 136 Ter Avaradoha Antananarivo 101',
          40,
          contactY + 22,
          { align: 'center', width: 515 }
        );
        doc.text(
          'NIF: 7018457585 Stat: 49295 11 024 0 10541 | RIB: 00015 00008 0386510000 1 37',
          40,
          contactY + 34,
          { align: 'center', width: 515 }
        );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Helper pour formater l'argent
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'decimal', minimumFractionDigits: 0 }).format(amount) + ' Ar';
  }

  // Version customisée de drawTable pour gérer les largeurs de colonnes spécifiques
  private drawTableCustom(doc: PDFKit.PDFDocument, table: any, columnWidths: number[]) {
    let y = doc.y;
    const x = 40;
    const rowHeight = 25;

    // Headers
    doc.font('Helvetica-Bold').fontSize(9);
    doc.fillColor('black');

    // Header Background
    doc.rect(x, y, columnWidths.reduce((a, b) => a + b, 0), rowHeight).fillColor('#f2f2f2').fill();
    doc.fillColor('black'); // Reset text color

    for (let i = 0; i < table.headers.length; i++) {
      // Draw Header Border
      doc.rect(x + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, columnWidths[i], rowHeight).stroke();

      doc.text(
        table.headers[i],
        x + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, // padding left
        y + 8, // padding top
        { width: columnWidths[i] - 10, align: 'left' }
      );
    }
    y += rowHeight;

    // Rows
    doc.font('Helvetica').fontSize(9);
    for (const row of table.rows) {
      for (let i = 0; i < row.length; i++) {
        // Draw Cell Border
        doc.rect(x + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, columnWidths[i], rowHeight).stroke();

        doc.text(
          row[i],
          x + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
          y + 8,
          { width: columnWidths[i] - 10, align: 'left' }
        );
      }
      y += rowHeight;
    }
    doc.y = y; // Update doc cursor
  }

  private drawTable(doc: PDFKit.PDFDocument, table: any) {
    let y = doc.y;
    const x = 72;
    const columnWidths = [50, 150, 50, 100, 80, 40, 60, 80, 80];
    const rowHeight = 20;

    // Headers
    doc.font('Helvetica-Bold');
    for (let i = 0; i < table.headers.length; i++) {
      doc.text(
        table.headers[i],
        x + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y,
        { width: columnWidths[i], align: 'center' },
      );
    }
    y += rowHeight;

    // Rows
    doc.font('Helvetica');
    for (const row of table.rows) {
      for (let i = 0; i < row.length; i++) {
        doc.text(
          row[i],
          x + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
          y,
          { width: columnWidths[i], align: 'center' },
        );
      }
      y += rowHeight;
    }
  }

  private nombreEnLettres(nombre: number): string {
    return nombre.toString();
  }
}
