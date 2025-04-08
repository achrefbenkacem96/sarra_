exportToPdf() {
  this.http.get('http://localhost:8082/performance/statistics', { responseType: 'blob' })
    .subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'statistiques_performances.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error exporting PDF:', error);
      this.snackBar.open('Erreur lors de l\'exportation du PDF', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    });
} 