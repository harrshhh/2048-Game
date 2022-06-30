import Grid from "./grid.js";
import Tile from "./tile.js";

const gameBoard=document.getElementById("game-board")

const grid=new Grid(gameBoard);  



const score=document.getElementById("score")
score.style.color="#FF0000"
score.innerHTML=parseInt(0);
const shareBtn=document.getElementById("share")
shareBtn.addEventListener('click',shareScore)
function shareScore(e){
    
    let text=score.innerHTML;
    let textArea  = document.createElement('textarea');
    textArea.width  = "1px"; 
    textArea.height = "1px";
    // textArea.background =  "transparents" ;
    textArea.value="Hey! My score in 2048 puzzle is : "+text;
    document.body.append(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
setupInput()

function setupInput() {
    window.addEventListener("keydown",handleInput,{once: true})
}
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 37) {
      document.getElementById('audio1').play();
      document.getElementById('audio1').playbackRate=2.0
    }
    if (e.keyCode == 38) {
        document.getElementById('audio2').play();
        document.getElementById('audio2').playbackRate=2.0
      }
      if (e.keyCode == 39) {
        document.getElementById('audio3').play();
        document.getElementById('audio3').playbackRate=2.0
      }
      if (e.keyCode == 40) {
        document.getElementById('audio4').play();
        document.getElementById('audio4').playbackRate=2.0
      }
  });
async function handleInput(e) {
    switch (e.key) {
        case "ArrowUp":
            if(!canMoveUp()){
                setupInput()
                return
            }
            await moveUp()
           
            break
        case "ArrowDown":
            if(!canMoveDown()){
                setupInput()
                return
            }
            await moveDown()
            break
        case "ArrowLeft":
            if(!canMoveLeft){
                setupInput()
                return
            }
            await moveLeft()
            break
        case "ArrowRight":
            if(!canMoveRight){
                setupInput();
                return
            }
            await moveRight()
            
            break
        default:
            setupInput()
            return
    }
    grid.cells.forEach(cell => cell.mergeTiles(score))
    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile= newTile;

    if(!canMoveDown() && !canMoveLeft() && !canMoveRight() && !canMoveUp()){
        newTile.waitForTransition(true).then( () => {
            // console.log(score.innerHTML)
            var scr=score.innerHTML;
            alert("Game-Over! Your Score is :"+ scr );
            
        })
        return
    }

    setupInput()
}

function moveUp(){
return slideTiles(grid.cellsByColumn)
}

function moveDown(){
return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft(){
return slideTiles(grid.cellsByRow)
}

function moveRight(){
return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells){
    return Promise.all(
        cells.flatMap(group => {
            const promises = []
            for(let i = 1; i<group.length; i++) {
                const cell = group[i]
                if(cell.tile==null) continue

                let lastValidCell

                for(let j=i - 1;j>=0;j--){
                    const moveToCell=group[j];
                    if(!moveToCell.canAccept(cell.tile)) break
                    lastValidCell=moveToCell
                }

                if(lastValidCell!=null){
                    promises.push(cell.tile.waitForTransition())
                    if(lastValidCell.tile != null){
                        lastValidCell.mergeTile=cell.tile
                    }else{
                        lastValidCell.tile=cell.tile
                    }
                    cell.tile=null
                }
                   
            }
            return promises
        })
    )
}

function canMoveUp(){
    return canMove(grid.cellsByColumn)
}

function canMoveDown(){
return canMove(grid.cellsByColumn.map(column =>[...column].reverse()))
}

function canMoveRight(){
return canMove(grid.cellsByRow.map(row =>[...row].reverse()))
}

function canMoveLeft(){
return canMove(grid.cellsByRow)
}

function canMove(cells){
return cells.some(group =>{
    return group.some((cell,index)=>{
        if(index===0)
        return false;
        if(cell.tile==null) return false
        const moveToCell=group[index-1]
        return moveToCell.canAccept(cell.tile)
    })
})
}