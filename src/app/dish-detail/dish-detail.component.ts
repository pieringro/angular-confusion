import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';

import { Params, ActivatedRoute } from '@angular/router';
import { formatDate, Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { expand, visibility } from '../animations/app.animation';

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.scss'],
  animations: [
    visibility(),
    expand()
  ]
})
export class DishDetailComponent implements OnInit {

  ratingForm: FormGroup;
  rating: Comment;

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  dishcopy: Dish;

  errMess: string;
  visibility = "shown";

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required': 'Author is required.',
      'minlength': 'Author must be at least 2 characters long.',
    },
    'comment': {
      'required': 'Your Comment is required.',
    },
  };


  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject("BaseURL") private baseURL,
    private dishService: DishService) {
    this.createForm();
  }

  createForm() {
    this.ratingForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: [5, [Validators.required]],
      comment: ['', [Validators.required]]
    });

    this.ratingForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
      errmess => this.errMess = <any>errmess);
    this.route.params.pipe(
      switchMap((params: Params) => {
        this.visibility = "hidden";
        return this.dishservice.getDish(params['id']);
      })
    ).subscribe(dish => {
      this.dish = dish;
      this.dishcopy = dish;
      this.setPrevNext(dish.id);
      this.visibility = "shown";
    }, errmess => this.errMess = <any>errmess);
  }

  onSubmit() {
    if (this.ratingForm.valid) {
      this.rating = this.ratingForm.value;
      this.rating.date = formatDate(Date.now(), 'mediumDate', 'en');
      console.log(this.rating);
      this.ratingForm.reset({
        author: '',
        rating: 5,
        comment: ''
      });

      this.dishcopy.comments.push(this.rating);

      this.dishService.putDish(this.dishcopy)
        .subscribe(dish => {
          this.dish = dish;
          this.dishcopy = dish;
        }, errmess => {
          this.dish = null;
          this.dishcopy = null;
          this.errMess = <any>errmess;
        });

    }
  }



  onValueChanged(data?: any) {
    if (!this.ratingForm) { return; }
    const form = this.ratingForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = ''; // clear previous error message (if any)
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }


  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

}
