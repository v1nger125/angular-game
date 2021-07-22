import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // 0 - empty, 1 - home, 2 - point target
  // area indexes
  // 0,0 ... n,0
  // ... ... ...
  // 0,n ... n,n
  gameArea: number[][];
  x: number;
  y: number;
  score: number;
  private _size: number;

  constructor() { }

  initGame(areaSize: number): number[][]{
    this.gameArea = new Array(areaSize);
    for (let i = 0; i < areaSize; i++) {
      this.gameArea[i] = new Array(areaSize).fill(0);
    }
    this._size = areaSize;
    this.score = 0;
    // add home
    this.x = this._random()
    this.y = this._random()
    this.gameArea[this.x][this.y] = 1;
    // add targets
    this._addTargets(areaSize);
    return this.gameArea;
  }

  // move methods
  moveUp(): boolean{
    if(this.y > 0){
      this.y--;
      this._collectTarget();
      return true;
    }
    else{
      return false;
    }
  }

  moveDown(): boolean{
    if(this.y < this._size-1){
      this.y++;
      this._collectTarget();
      return true;
    }
    else{
      return false;
    }
  }

  moveLeft(): boolean{
    if(this.x > 0){
      this.x--;
      this._collectTarget();
      return true;
    }
    else{
      return false;
    }
  }

  moveRight(): boolean{
    if(this.x < this._size-1){
      this.x++;
      this._collectTarget();
      return true;
    }
    else{
      return false;
    }
  }

  private _collectTarget(): void{
    if(this.gameArea[this.x][this.y] == 2){
      this.score++;
      this.gameArea[this.x][this.y] = 0;
      this._addTargets(1);
    }
  }

  private _addTargets(count: number): void{
    while (count > 0){
      const xx: number = this._random();
      const yy: number = this._random();
      if (this.gameArea[xx][yy] == 0){
        this.gameArea[xx][yy] = 2;
        count--;
      }
    }
  }

  // [0, size)
  private _random(): number{
    return Math.floor(Math.random() * this._size);
  }
}
