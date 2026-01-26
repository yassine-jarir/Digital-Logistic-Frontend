import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h1>403 - Non autorisé</h1>
      <p>Vous n'avez pas accès à cette ressource.</p>
      <a routerLink="/login">Retour au login</a>
    </div>
  `,
})
export class Unauthorized {}
