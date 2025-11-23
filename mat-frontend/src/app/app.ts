import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/header/header/header';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('mat-frontend');
  
  constructor (private primng: PrimeNG) {}

  ngOnInit(): void {
    this.primng.ripple.set(true);
  }
}
