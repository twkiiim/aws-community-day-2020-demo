import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Item } from '../interface/Item.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor() { }

  items: Item[] = [
    {
      itemId: 1,
      img: 'https://images-na.ssl-images-amazon.com/images/I/71e111E55OL.jpg',
      title: 'Running Serverless: Introduction to AWS Lambda and the Serverless Application Model Paperback',
      subtitle: 'July 1, 2019',
      desc: 'This book will help you get started with AWS Lambda and the Serverless Application Model (SAM). Lambda is Amazon\'s engine for running event-driven ...',
      price: 40.46,
    },
    {
      itemId: 2,
      img: 'https://images-na.ssl-images-amazon.com/images/I/51Ky7sSNbbL._SX397_BO1,204,203,200_.jpg',
      title: 'Serverless Applications with Node.js: Using AWS Lambda and Claudia.js',
      subtitle: '1st Edition',
      desc: 'Serverless Applications with Node.js walks you through building serverless apps on AWS using JavaScript. Inside, you ...',
      price: 37.17,
    },
    {
      itemId: 3,
      img: 'https://images-na.ssl-images-amazon.com/images/I/71%2BbOkph8qL.jpg',
      title: 'Serverless Design Patterns and Best Practices: Build, secure, and deploy enterprise ready serverless applications with AWS to improve developer productivity Paperback',
      subtitle: 'April 12, 2018',
      desc: 'Learn the details of popular software patterns and how they are applied to serverless applications ...',
      price: 41.43,
    },
  ]

  listItems(): Observable<Item[]> {
    return of(this.items);
  }

  getItem(itemId: number): Observable<Item> {
    const item = this.items.find(item => { return item.itemId == itemId; });
    return of(item);
  }
}
