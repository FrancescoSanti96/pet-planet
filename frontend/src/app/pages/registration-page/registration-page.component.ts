import { Component, OnInit } from '@angular/core';
import { AnimalService } from '../../services/animal.service';
import { Animal } from '../../model/animal.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent implements OnInit {
  datiRegistrazione = {
    nome: '',
    tipoAnimale: '',
    sesso: '',
    razza: '',
  };
  animal: Animal | null = null;

  constructor(
    private animalService: AnimalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAnimalData();
  }

  loadAnimalData(): void {
    this.animalService.getAnimalByUserId().subscribe(
      (animal) => {
        this.animal = animal;
  
        if (this.animal) {
          this.datiRegistrazione.nome = this.animal.nome || '';
          this.datiRegistrazione.tipoAnimale = this.animal.tipoAnimale || '';
          this.datiRegistrazione.sesso = this.animal.sesso || '';
          this.datiRegistrazione.razza = this.animal.razza || '';
        }
      },
      (error) => {
        console.error('Errore nel recupero dell\'animale:', error);
      }
    );
  }

  salvaInformazioni() {
    if (this.animal) {
      this.modificaAnimale();
    } else {
      this.creaAnimale();
    }
  }

  creaAnimale() {
    const nuovoAnimale: Animal = {
      _id: '',
      owner: localStorage.getItem('id')!,
      nome: this.datiRegistrazione.nome,
      tipoAnimale: this.datiRegistrazione.tipoAnimale,
      sesso: this.datiRegistrazione.sesso,
      razza: this.datiRegistrazione.razza,
    };

    this.animalService.createAnimal(nuovoAnimale).subscribe(
      (response) => {
        console.log('Animale creato con successo:', response);
        this.router.navigate(['/profile']);
      },
      (error) => {
        console.error('Errore durante la creazione dell\'animale:', error);
      }
    );
  }

  modificaAnimale() {
    if (this.animal) {
      const animaleModificato: Partial<Animal> = {
        nome: this.datiRegistrazione.nome,
        tipoAnimale: this.datiRegistrazione.tipoAnimale,
        sesso: this.datiRegistrazione.sesso,
        razza: this.datiRegistrazione.razza,
      };

      this.animalService.updateAnimal(this.animal._id, animaleModificato).subscribe(
        (response) => {
          console.log('Animale modificato con successo:', response);
          this.router.navigate(['/profile']);
        },
        (error) => {
          console.error('Errore durante la modifica dell\'animale:', error);
        }
      );
    }
  }

  eliminaAnimale() {
    if (this.animal) {
      this.animalService.deleteAnimal(this.animal._id).subscribe(
        () => {
          console.log('Animale eliminato con successo');
          this.router.navigate(['/profile']);
        },
        (error) => {
          console.error('Errore durante l\'eliminazione dell\'animale:', error);
        }
      );
    }
  }
}
