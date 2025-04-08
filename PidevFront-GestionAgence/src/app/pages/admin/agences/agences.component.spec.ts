import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgencesComponent } from './agences.component';
import { AgenceService } from '../../../services/agence.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AgencesComponent', () => {
  let component: AgencesComponent;
  let fixture: ComponentFixture<AgencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgencesComponent], // Déclarez le composant à tester
      imports: [HttpClientTestingModule], // Module pour simuler les requêtes HTTP
      providers: [AgenceService], // Fournissez les services nécessaires
    }).compileComponents();

    fixture = TestBed.createComponent(AgencesComponent); // Créez une instance du composant
    component = fixture.componentInstance; // Récupérez l'instance du composant
    fixture.detectChanges(); // Déclenchez la détection de changements
  });

  // Test 1 : Vérifier que le composant est créé avec succès
  it('should create', () => {
    expect(component).toBeTruthy(); // Vérifiez que le composant est bien créé
  });

  // Test 2 : Vérifier que la méthode loadAgences est appelée lors de l'initialisation
  it('should call loadAgences on init', () => {
    spyOn(component, 'loadAgences'); // Espionnez la méthode loadAgences
    component.ngOnInit(); // Appelez ngOnInit manuellement
    expect(component.loadAgences).toHaveBeenCalled(); // Vérifiez que la méthode a été appelée
  });

  // Test 3 : Vérifier que la liste des agences est vide par défaut
  it('should have an empty agences list by default', () => {
    expect(component.agences).toBeDefined(); // Vérifiez que la liste est définie
    expect(component.agences.length).toBe(0); // Vérifiez que la liste est vide
  });
});