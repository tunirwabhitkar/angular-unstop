import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  seatsToBook: number = 1;
  bookedSeats: number[] = [];

  seatGrid: { id: number; available: boolean }[][] = [];

  // Initialize 80 seats (11 rows with 7 seats each, and 1 row with 3 seats)
  constructor() {
    this.initializeSeats();
  }

  initializeSeats() {
    let seatId = 1;
    for (let row = 0; row < 12; row++) {
      const seatRow = [];
      const numSeats = row === 11 ? 3 : 7; // Last row has 3 seats
      for (let seat = 0; seat < numSeats; seat++) {
        seatRow.push({ id: seatId++, available: true });
      }
      this.seatGrid.push(seatRow);
    }
  }

  getSeatClass(seat: { available: boolean }) {
    return seat.available ? 'seat available' : 'seat booked';
  }

  bookSeats() {
    const seatsToBook = this.seatsToBook;
    let seatsFound = 0;
    const selectedSeats = [];

    // Prioritize booking within a single row
    for (let row of this.seatGrid) {
      let rowSeats = row.filter((seat) => seat.available);
      if (rowSeats.length >= seatsToBook) {
        for (let i = 0; i < seatsToBook; i++) {
          rowSeats[i].available = false;
          selectedSeats.push(rowSeats[i].id);
        }
        this.bookedSeats.push(...selectedSeats);
        return;
      }
    }

    // If not found in a single row, book nearby seats across rows
    for (let row of this.seatGrid) {
      for (let seat of row) {
        if (seat.available) {
          seat.available = false;
          selectedSeats.push(seat.id);
          seatsFound++;
          if (seatsFound === seatsToBook) {
            this.bookedSeats.push(...selectedSeats);
            return;
          }
        }
      }
    }
  }
}
