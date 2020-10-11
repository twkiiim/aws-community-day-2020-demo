import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from 'src/app/service/item.service';
import { Item } from 'src/app/interface/Item.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  items: Item[] = [];

  constructor(
    private itemService: ItemService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.itemService.listItems().subscribe( items => {
      this.items = items;
    })
  }

  next(index: number) {
    this.router.navigate(['/payment'], { queryParams: { itemId: this.items[index].itemId }})
  }

}
