package com.example.pidevmicroservice.services;

import com.example.pidevmicroservice.dto.AgencePerformanceDTO;
import com.example.pidevmicroservice.entities.Agence;
import com.example.pidevmicroservice.entities.Performance;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExportService {

    /**
     * Export agency data to Excel
     */
    public ByteArrayInputStream agencesToExcel(List<Agence> agences) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); 
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Agences");
            
            // Header Row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Nom");
            headerRow.createCell(2).setCellValue("Adresse");
            headerRow.createCell(3).setCellValue("Ville");
            headerRow.createCell(4).setCellValue("Code Postal");
            headerRow.createCell(5).setCellValue("Téléphone");
            headerRow.createCell(6).setCellValue("Email");
            headerRow.createCell(7).setCellValue("Responsable");
            headerRow.createCell(8).setCellValue("Date de création");
            
            // Create Cell Style for formatting Date
            CellStyle dateCellStyle = workbook.createCellStyle();
            CreationHelper createHelper = workbook.getCreationHelper();
            dateCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
            
            int rowIdx = 1;
            for (Agence agence : agences) {
                Row row = sheet.createRow(rowIdx++);
                
                row.createCell(0).setCellValue(agence.getIdAgence());
                row.createCell(1).setCellValue(agence.getNomAgence());
                row.createCell(2).setCellValue(agence.getAdresse());
                row.createCell(3).setCellValue(agence.getVille());
                row.createCell(4).setCellValue(agence.getCodePostal());
                row.createCell(5).setCellValue(agence.getTelephone());
                row.createCell(6).setCellValue(agence.getEmail());
                row.createCell(7).setCellValue(agence.getResponsable());
                
                Cell dateCell = row.createCell(8);
                if (agence.getDateCreation() != null) {
                    dateCell.setCellValue(java.sql.Date.valueOf(agence.getDateCreation()));
                    dateCell.setCellStyle(dateCellStyle);
                }
            }
            
            // Resize all columns to fit the content size
            for (int i = 0; i < 9; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
    
    /**
     * Export statistics to PDF
     */
    public ByteArrayInputStream statisticsToPdf(List<AgencePerformanceDTO> topRevenueAgences, 
                                               List<AgencePerformanceDTO> topContractsAgences) throws DocumentException {
        
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        try {
            PdfWriter.getInstance(document, out);
            document.open();
            
            // Add title - explicitly using iText fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA, 18, Font.BOLD, BaseColor.BLACK);
            Paragraph title = new Paragraph("Statistiques des Agences", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" ")); // Add some space
            
            // Add subtitle for revenue
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 14, Font.BOLD, BaseColor.BLACK);
            Paragraph revenueTitle = new Paragraph("Top Agences par Chiffre d'Affaires", subtitleFont);
            document.add(revenueTitle);
            document.add(new Paragraph(" ")); // Add some space
            
            // Revenue table
            PdfPTable revenueTable = new PdfPTable(4);
            revenueTable.setWidthPercentage(100);
            revenueTable.setWidths(new int[]{1, 3, 2, 3});
            
            // Add Revenue table header row
            PdfPCell headerCell = new PdfPCell();
            headerCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            headerCell.setPadding(5);
            
            headerCell.setPhrase(new Phrase("ID"));
            revenueTable.addCell(headerCell);
            headerCell.setPhrase(new Phrase("Nom de l'Agence"));
            revenueTable.addCell(headerCell);
            headerCell.setPhrase(new Phrase("Ville"));
            revenueTable.addCell(headerCell);
            headerCell.setPhrase(new Phrase("Chiffre d'Affaires"));
            revenueTable.addCell(headerCell);
            
            // Add Revenue table data rows
            for (AgencePerformanceDTO agence : topRevenueAgences) {
                revenueTable.addCell(String.valueOf(agence.getIdAgence()));
                revenueTable.addCell(agence.getNomAgence());
                revenueTable.addCell(agence.getVille());
                revenueTable.addCell(String.format("%.2f €", agence.getChiffreAffaireTotal()));
            }
            
            document.add(revenueTable);
            document.add(new Paragraph(" ")); // Add some space
            document.add(new Paragraph(" ")); // Add another space
            
            // Add subtitle for contracts
            Paragraph contractsTitle = new Paragraph("Top Agences par Nombre de Contrats", subtitleFont);
            document.add(contractsTitle);
            document.add(new Paragraph(" ")); // Add some space
            
            // Contracts table
            PdfPTable contractsTable = new PdfPTable(4);
            contractsTable.setWidthPercentage(100);
            contractsTable.setWidths(new int[]{1, 3, 2, 3});
            
            // Add Contracts table header row
            headerCell.setPhrase(new Phrase("ID"));
            contractsTable.addCell(headerCell);
            headerCell.setPhrase(new Phrase("Nom de l'Agence"));
            contractsTable.addCell(headerCell);
            headerCell.setPhrase(new Phrase("Ville"));
            contractsTable.addCell(headerCell);
            headerCell.setPhrase(new Phrase("Nombre de Contrats"));
            contractsTable.addCell(headerCell);
            
            // Add Contracts table data rows
            for (AgencePerformanceDTO agence : topContractsAgences) {
                contractsTable.addCell(String.valueOf(agence.getIdAgence()));
                contractsTable.addCell(agence.getNomAgence());
                contractsTable.addCell(agence.getVille());
                contractsTable.addCell(String.valueOf(agence.getNombreContratsTotal()));
            }
            
            document.add(contractsTable);
            
            // Add footer with date
            document.add(new Paragraph(" ")); // Add some space
            document.add(new Paragraph(" ")); // Add another space
            Font footerFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Font.ITALIC, BaseColor.DARK_GRAY);
            Paragraph footer = new Paragraph("Document généré le " + java.time.LocalDate.now().toString(), footerFont);
            footer.setAlignment(Element.ALIGN_RIGHT);
            document.add(footer);
            
            document.close();
            
        } catch (DocumentException e) {
            throw e;
        }
        
        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream performancesToExcel(List<Performance> performances) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Performances");
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Agence", "Chiffre d'affaires", "Nombre de contrats", "Date début", "Date fin"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }
            
            // Create data rows
            int rowNum = 1;
            for (Performance performance : performances) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(performance.getAgence().getNomAgence());
                row.createCell(1).setCellValue(performance.getChiffreAffaire());
                row.createCell(2).setCellValue(performance.getNombreContrats());
                row.createCell(3).setCellValue(performance.getDateDebut().toString());
                row.createCell(4).setCellValue(performance.getDateFin().toString());
            }
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream performancesToPdf(List<Performance> performances) throws DocumentException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        
        document.open();
        
        // Add title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("Liste des Performances", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        
        document.add(new Paragraph(" "));
        
        // Create table
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        
        // Add headers
        String[] headers = {"Agence", "Chiffre d'affaires", "Nombre de contrats", "Date début", "Date fin"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            table.addCell(cell);
        }
        
        // Add data
        for (Performance performance : performances) {
            table.addCell(performance.getAgence().getNomAgence());
            table.addCell(String.valueOf(performance.getChiffreAffaire()));
            table.addCell(String.valueOf(performance.getNombreContrats()));
            table.addCell(performance.getDateDebut().toString());
            table.addCell(performance.getDateFin().toString());
        }
        
        document.add(table);
        document.close();
        
        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream performancesStatisticsToPdf(List<Performance> performances) throws DocumentException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        
        document.open();
        
        // Add title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("Statistiques des Performances", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        
        document.add(new Paragraph(" "));
        
        // Calculate statistics
        double totalRevenue = performances.stream()
                .mapToDouble(Performance::getChiffreAffaire)
                .sum();
        
        int totalContracts = performances.stream()
                .mapToInt(Performance::getNombreContrats)
                .sum();
        
        double averageRevenue = totalRevenue / performances.size();
        double averageContracts = (double) totalContracts / performances.size();
        
        // Add statistics
        document.add(new Paragraph("Statistiques Générales:"));
        document.add(new Paragraph("Total des revenus: " + totalRevenue));
        document.add(new Paragraph("Total des contrats: " + totalContracts));
        document.add(new Paragraph("Revenu moyen par agence: " + averageRevenue));
        document.add(new Paragraph("Nombre moyen de contrats par agence: " + averageContracts));
        
        document.add(new Paragraph(" "));
        
        // Add performance by agency
        document.add(new Paragraph("Performances par Agence:"));
        
        Map<Agence, List<Performance>> performancesByAgency = performances.stream()
                .collect(Collectors.groupingBy(Performance::getAgence));
        
        for (Map.Entry<Agence, List<Performance>> entry : performancesByAgency.entrySet()) {
            Agence agency = entry.getKey();
            List<Performance> agencyPerformances = entry.getValue();
            
            double agencyRevenue = agencyPerformances.stream()
                    .mapToDouble(Performance::getChiffreAffaire)
                    .sum();
            
            int agencyContracts = agencyPerformances.stream()
                    .mapToInt(Performance::getNombreContrats)
                    .sum();
            
            document.add(new Paragraph("Agence: " + agency.getNomAgence()));
            document.add(new Paragraph("  - Revenu total: " + agencyRevenue));
            document.add(new Paragraph("  - Nombre total de contrats: " + agencyContracts));
            document.add(new Paragraph(" "));
        }
        
        document.close();
        
        return new ByteArrayInputStream(out.toByteArray());
    }
} 