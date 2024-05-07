import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { filter, switchMap, tap} from 'rxjs';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/hero.service';


import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-new-hero-page',
  templateUrl: './new-hero-page.component.html',
  styles: ``
})
export class NewHeroPageComponent implements OnInit{

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    alter_ego: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>( Publisher.DCComics ),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', value: 'DC - Comics' },
    { id: 'Marvel Comics', value: 'Marvel - Comics' }
  ]

  constructor(
    private heroService: HeroService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  get currentHero(): Hero{
    const hero = this.heroForm.value as Hero;

    return hero;
  }

  ngOnInit(): void {
    if( !this.router.url.includes( 'edit' ) ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroService.getHeroById( id ) ),
      ). subscribe( hero => {
        if( !hero ) return this.router.navigateByUrl('/');

        this.heroForm.reset( hero );
        return;
      })
  }

  onSubmit(): void {
    if( this.heroForm.invalid ) return;

    if( this.currentHero.id ){
      this.heroService.updateHero( this.currentHero )
        .subscribe( hero => {
            this.router.navigate(['/heroes', hero.id]);
            this.showSnackBar(`${hero.superhero} updated!`);
          })
      return;
    }

    this.heroService.addHero( this.currentHero )
      .subscribe( hero =>  {
        this.router.navigate(['/heroes', hero.id]);
        this.showSnackBar(`${hero.superhero} created!`)
      })
  }

  onDeleteHero(): void {
    if( !this.currentHero.id ) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
      .pipe(
        filter( (result: boolean) => result ),
        switchMap( () => this.heroService.deleteHeroById( this.currentHero.id )),
        filter( (wasDeleted: boolean) => wasDeleted ),
      )
      .subscribe(() => {
        this.router.navigateByUrl('/heroes');
        this.showSnackBar(`${this.currentHero.superhero} deleted`)
      })

    // dialogRef.afterClosed().subscribe(result => {
    //   if( !result ) return;

    //   this.heroService.deleteHeroById( this.currentHero.id )
    //     .subscribe( wasDeleted => {
    //       if( wasDeleted ){
    //         this.router.navigateByUrl('/heroes');
    //       }
    //     })
    // });
  }

  showSnackBar( message: string ): void{
    this.snackBar.open( message, 'done', {
      duration: 2500,
    })
  }
}

