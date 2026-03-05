import { Component, Input, numberAttribute } from '@angular/core';
import { NgIf } from '@angular/common';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-toolshop-art',
  standalone: true,
  templateUrl: './toolshop-art.component.html',
  styleUrls: ['./toolshop-art.component.scss'],
})
export class ToolshopArtComponent {
  characterName: string = '';
  imageUrl: string = '';
  selectedApi: string = 'huey';

  apiTypes: string[] = ['starwars', 'ricknmorty', 'pokemon'];

  postStuff() {
    console.log('Button clicked!');
  }

  fetchPokemon() {
    fetch('https://pokeapi.co/api/v2/pokemon/ditto')
      .then((response) => response.json())
      .then((pokemon) => (this.characterName = pokemon.species.name));
  }

  fetchPokeWithId(id: string) {
    fetch('https://pokeapi.co/api/v2/pokemon/' + id)
      .then((response) => response.json())
      .then((pokemon) => (this.characterName = pokemon.species.name));
  }

  fetchStarWars(id: string) {
    fetch('https://swapi.dev/api/people/' + id + '/')
      .then((response) => response.json())
      .then((data) => (this.characterName = data.name));
  }

  fetchRickAndMorty(id: string) {
    fetch('https://rickandmortyapi.com/api/character/' + id)
      .then((response) => response.json())
      .then((data) => {
        this.characterName = data.name;
        this.imageUrl = data.image;
      });
  }

  fetchRandomRickAndMorty(id?: string) {
    console.log('Fetching random Rick and Morty character...', id);
    const randomId = Math.floor(Math.random() * 100) + 1; // Random ID between 1 and 100
    const resolvedId = id || randomId.toString();

    this.fetchRickAndMorty(resolvedId);
  }

  clearInput(inputElement?: HTMLInputElement) {
    this.characterName = '';
    this.imageUrl = '';
    if (inputElement) {
      inputElement.value = '';
    }
  }

  randomizeId() {
    const randomId = Math.floor(Math.random() * 100) + 1; // Random ID between 1 and 100
  }

  submitForm(id: string) {
    console.log('Selected ID:', this.selectedApi);
    console.log('Entered ID:', id);

    switch (this.selectedApi) {
      case 'starwars':
        this.fetchStarWars(id);
        break;
      case 'ricknmorty':
        this.fetchRickAndMorty(id);
        break;
      case 'pokemon':
        this.fetchPokeWithId(id);
        break;

      default:
        this.fetchRickAndMorty('1');
    }
  }
}
