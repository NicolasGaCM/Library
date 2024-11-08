import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Book } from '../../models/book.model';
import { Router } from '@angular/router';
import { BookService } from '../../services/book-service.component';

@Component({
  standalone: true,
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
  imports: [CommonModule, HttpClientModule],
})
export class InfoModalComponent {
  @Input() isVisible: boolean = false;
  @Input() selectedBookId: number | null = null; // Propriedade para armazenar o ID do livro selecionado
  @Input() book: Book | undefined; // Recebe o livro a ser exibido no modal
  @Output() close = new EventEmitter<void>(); // Evento para informar ao componente pai
  isLoggedIn: boolean = false; // Variável para verificar se o usuário está logado

  constructor(private bookService: BookService, private router: Router) {}

  closeModal() {
    this.isVisible = false;
    this.book = undefined;
    this.close.emit(); // Emite o evento para informar que o modal foi fechado
  }

  ngOnChanges() {
    if (this.selectedBookId !== null) {
      console.log('ID recebido em InfoModalComponent:', this.selectedBookId);
      this.getBookDetails(this.selectedBookId);
    }
  }

  ngOnInit() {
    // Exemplo de verificação de login
    this.isLoggedIn = this.checkLoginStatus();
    if (this.selectedBookId !== null) {
      console.log(
        'ID recebido em InfoModalComponent via OnInit:',
        this.selectedBookId
      );
      this.getBookDetails(this.selectedBookId);
    }
  }

  getBookDetails(id: number) {
    this.bookService.getBookById(id).subscribe((book) => {
      this.book = book;

      // Processar imagem
      if (this.book.imageData && this.book.imageData.imageData) {
        this.book.imageUrl = `data:${this.book.imageData.type};base64,${this.book.imageData.imageData}`;
      }

      // Processar PDF
      if (this.book.pdfData && this.book.pdfData.pdfData) {
        this.book.pdfUrl = `data:${this.book.pdfData.type};base64,${this.book.pdfData.pdfData}`;
      }
    });
  }

  downloadPdf() {
    if (this.isLoggedIn) {
      if (this.book && this.book.pdfUrl) {
        const link = document.createElement('a');
        link.href = this.book.pdfUrl;
        link.download = `${this.book.title}.pdf`;
        link.click();
      }
    } else {
      alert('Você precisa estar logado para baixar o PDF.');
    }
  }

  checkLoginStatus(): boolean {
    // Lógica de verificação de login (para futuro)
    // Retorna true se o usuário estiver logado, false caso contrário
    return false; // Alterar conforme a implementação de login
  }
}
