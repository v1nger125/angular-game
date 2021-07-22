import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameService } from '../game.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  private canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;

  private gameTimer = new FormControl(10);

  private areaSize: number = 4;
  private blockSize: number = 128;
  private score: number = 0;
  private bestScore: number = 0;
  private gameStarted: boolean = false;
  private gameArea: number[][];
  private homeImage: HTMLImageElement = new Image()
  private targetImage: HTMLImageElement = new Image()
  private playerImage: HTMLImageElement = new Image()

  constructor(private gs: GameService) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.gameArea = this.gs.initGame(this.areaSize);
    this.homeImage.src = "/assets/house.png";
    this.targetImage.src = "/assets/target.png";
    this.playerImage.src = "/assets/player.png";
    this.bestScore = Number(localStorage.getItem("farmerScore")) || 0;
    window.onload = () => {
      this._updateCanvas();
    }
  }

  changeSize(size): void{
    if(!this.gameStarted){
      this.score = 0;
      this.areaSize = size;
      this.blockSize = this.canvas.nativeElement.width/size;
      this.gameArea = this.gs.initGame(this.areaSize);
      this._updateCanvas();
    }
  }

  startGame(){
    if (this.gs.score != 0) {
      this.score = 0;
      this.gameArea = this.gs.initGame(this.areaSize);
      this._updateCanvas()
    }
    if(!this.gameStarted && this.gameTimer.value > 0){
      this.gameStarted = true;
      const listener = (event: KeyboardEvent) =>{
        event.preventDefault();
        switch (event.code) {
          case "ArrowDown":
            this.gs.moveDown();
            break;
          case "ArrowUp":
            this.gs.moveUp();
            break;
          case "ArrowLeft":
            this.gs.moveLeft();
            break;
          case "ArrowRight":
            this.gs.moveRight();
            break;
        }
        this.score = this.gs.score;
        this._updateCanvas();
      }
      document.addEventListener("keydown", listener)
      const interval = setInterval(() => {
        this.gameTimer.setValue(this.gameTimer.value - 1);
        if (this.gameTimer.value == 0){
          clearInterval(interval);
          document.removeEventListener("keydown", listener)
          this.gameStarted = false;
          this._endGame()
        }
      }, 1000)
    }
  }

  private _endGame(){
    this.gameTimer.setValue(10);
    if(this.gameArea[this.gs.x][this.gs.y] != 1){
      this.score = 0;
      this.ctx.fillStyle = "black";
      this.ctx.font = "48px Segoe UI";
      this.ctx.fillText("Игра окончена", this.canvas.nativeElement.width/5, 50);
      this.ctx.font = "24px Segoe UI";
      this.ctx.fillText("  вы не успели вернуться домой", this.canvas.nativeElement.width/6, 100);
    }
    else{
      this.ctx.fillStyle = "black";
      this.ctx.font = "48px Segoe UI";
      this.ctx.fillText("Игра окончена", this.canvas.nativeElement.width/5, 50);
      this.ctx.fillText("СЧЕТ: " + this.score, this.canvas.nativeElement.width/3, 100);
      if (this.score > this.bestScore) {
        localStorage.setItem("farmerScore", String(this.score));
        this.bestScore = this.score;
        this.ctx.fillText("Новый рекорд!", this.canvas.nativeElement.width/5, 150);
      }
    }
  }
  private _updateCanvas(){
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0,0,this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    for (let x = 0; x < this.areaSize; x++) {
      for (let y = 0; y < this.areaSize; y++) {
        this.ctx.strokeStyle = "lightgrey";
        this.ctx.strokeRect(x*this.blockSize,y*this.blockSize, this.blockSize, this.blockSize);
        if (this.gameArea[x][y] == 1) {
          this.ctx.drawImage(this.homeImage, x*this.blockSize, y*this.blockSize, this.blockSize, this.blockSize)
        }
        else if (this.gameArea[x][y] == 2){
          this.ctx.drawImage(this.targetImage, x*this.blockSize, y*this.blockSize, this.blockSize, this.blockSize)
        }
        if (x == this.gs.x && y == this.gs.y){
          this.ctx.drawImage(this.playerImage, x*this.blockSize, y*this.blockSize, this.blockSize, this.blockSize)
        }
      }
    }
  }
}
