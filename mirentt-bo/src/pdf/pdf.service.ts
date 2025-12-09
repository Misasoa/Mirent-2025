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
