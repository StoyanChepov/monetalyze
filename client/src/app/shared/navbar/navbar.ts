import { Component, inject } from '@angular/core';
import { LanguageService, LANGUAGES } from '../language';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  languageService = inject(LanguageService);
  readonly languages = LANGUAGES;

  languageLabel(language: string): string {
    return language.slice(0, 2).toUpperCase();
  }
}
