class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');
    // Create tr element
    const row = document.createElement('tr');
    // Insert cols
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X<a></td>
    `;

    // Append row to list
    list.appendChild(row);
  }

  deleteBook(target) {
      target.parentElement.parentElement.remove();
  }

  showAlert(msg, className) {
    // Create a div element
    const div = document.createElement('div');
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(msg));
    // Get Parent
    const container = document.querySelector('.container');
    // Grab form
    const form = document.querySelector('#book-form');
    // Insert alert
    container.insertBefore(div, form);

    // Clear error after 2.5 seconds
    setTimeout(function() {
      document.querySelector('.alert').remove();
    }, 2500);
  }
  
  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// Local Storage Class
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }
  
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function(book) {
      const ui = new UI;

      // Add book to UI
      ui.addBookToList(book)
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach(function(book, index) {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks());

// Event Listener For Add Book
document.getElementById('book-form').addEventListener('submit', function(e) {
  //Get form values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

  // Instantiate book
  const book = new Book(title, author, isbn);
  
  // Instantiate UI
  const ui = new UI();

  // Validate
  if(title === '' || author === '' || isbn === '') {
    // Error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // Add book to list
    ui.addBookToList(book);

    // Add book to LS
    Store.addBook(book);

    // Show success
    ui.showAlert('Book Added!', 'success');

    // Clear fields
    ui.clearFields();
  }
  
  e.preventDefault();
});

// Event Listener for delete book (Event Delegation)
document.getElementById('book-list').addEventListener('click', function(e) {

  // Instantiate UI
  const ui = new UI();
  
  const target = e.target.className === 'delete' ? e.target : null;

  if(target) {
    // Delete book
    ui.deleteBook(target);

    // Show success
    ui.showAlert('Book Deleted!', 'success');

    // Remove from LS - the previous element is a 'td' with 'isbn'
    Store.removeBook(target.parentElement.previousElementSibling.textContent);
  }

  e.preventDefault();
});