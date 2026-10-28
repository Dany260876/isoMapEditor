import './style.css';
import sheet from './assets/sheet.png';
import grid from './assets/grid.png';

const TILE_WIDTH = 128;
const TILE_HEIGHT = 64;

class mapTile {
    constructor(type, tilePosX, tilePosY, url) {
        this.name = type + ":" + tilePosX + ":" + tilePosY;
        this.posX = tilePosX;
        this.posY = tilePosY;
        this.url = url;
    }
}

class mapService {
    constructor(context2D, imgMapTileset) {
        this.imgMapTileset = imgMapTileset;
        this.ctx2d = context2D;
    }

    drawTile(x,y,tileName) {
        const tabName = tileName.split(':');
        const tileX = tabName[1]*TILE_WIDTH;
        const tileY = tabName[2]*TILE_HEIGHT;

        const posX = (x-y)*TILE_WIDTH/2;
        const posY = (x+y)*TILE_HEIGHT/2;
        
        this.ctx2d.drawImage(this.imgMapTileset, 
            tileX, tileY, TILE_WIDTH, TILE_HEIGHT, 
            posX - (TILE_WIDTH/2), posY, TILE_WIDTH, TILE_HEIGHT);
    }

    getGridCoordinate(clicX, clicY) {
        const cX = clicX / (TILE_WIDTH/2);
        const cY = clicY / (TILE_HEIGHT/2);

        const x = (cX + cY)/2;
        const y = (cY - cX)/2;

        return {
            x: Math.floor(x),
            y: Math.floor(y)
        };
    }

    extractTilesFromTileset() {
        let tileList = [];

        const cols = Math.floor(this.imgMapTileset.width / TILE_WIDTH);
        const rows = Math.floor(this.imgMapTileset.height / TILE_HEIGHT);

        const canvas = document.createElement('canvas');
        canvas.width = TILE_WIDTH;
        canvas.height = TILE_HEIGHT;
        const ctx = canvas.getContext('2d');

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                ctx.clearRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
                ctx.drawImage(
                    this.imgMapTileset,
                    x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, 
                    0, 0, TILE_WIDTH, TILE_HEIGHT                              
                );
                const dataUrl = canvas.toDataURL('image/png');
                tileList.push(new mapTile("TILE", x, y, dataUrl));
            }
        }

        return tileList;
    }
}

const imgTiles = new Image();
imgTiles.src = sheet;
imgTiles.onload = () => start();

const imgGrid = new Image();
imgGrid.src = grid;
imgGrid.onload = () => start();

window.selectTile = (img) => {
    window.selectedTileName = img.dataset.name;
}

const start = () => {
    if(imgTiles.complete && imgGrid.complete) {

        const canvas = document.querySelector('#canvasMap');
        const ctx = canvas.getContext("2d");
        
        const serviceGrid = new mapService(ctx, imgGrid);

        // init grid
        let cptX, cptY = 0;
        for (cptX = -10; cptX<=10; cptX++) {
            for (cptY = -10; cptY<=10; cptY++) {
                serviceGrid.drawTile(cptX,cptY,"TILE:0:0");
            }            
        }

        // clic on grid
        canvas.addEventListener("click", (event) => {
            const newPos = serviceGrid.getGridCoordinate(event.offsetX, event.offsetY);
            if (!window.selectedTileName) {
                if (canvas.lastPos) serviceGrid.drawTile(canvas.lastPos.x,canvas.lastPos.y,"TILE:0:0");
                serviceGrid.drawTile(newPos.x,newPos.y,"TILE:1:0");
            }
            else {
                serviceTiles.drawTile(newPos.x,newPos.y,window.selectedTileName);
            }
            canvas.lastPos = newPos;
        });

        // get tiles and init selection controle
        const serviceTiles = new mapService(ctx, imgTiles);
        const tileList = serviceTiles.extractTilesFromTileset();

        // update tile list for selection 
        const divTilesList = document.querySelector('#divTilesList');
        let html = "";
        let cptCol = 0;
        html += "<table>";
        html += "<tr>";
        tileList.forEach((tile) => {
            html += "<td>";
            html += "<img src='" + tile.url + "' onclick='selectTile(this)' data-name='" + tile.name + "'></img>";
            html += "</td>";
            cptCol++;
            if (cptCol==5) {
                html += "</tr>";
                html += "<tr>";
                cptCol = 0;
            }
        });
        html += "</tr>";
        html += "</table>";
        divTilesList.innerHTML = html;
        divTilesList.style.height = "300px";
        divTilesList.style.width = "700px";
        divTilesList.style["overflow-y"] = "scroll";
    }
}



