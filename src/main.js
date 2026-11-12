import CustomMap from './class/CustomMap.js'
import MapViewport from './class/MapViewport.js'
import TilesImageConfig from './class/TilesImageConfig.js'
import TilesetService from './service/TilesetService.js';
import MapRenderService from './service/MapRenderService.js'

import './style.css';
import sheet from './assets/sheet.png';
import grid from './assets/grid.png';

const tilesImageSources = [ 
    new TilesImageConfig('SHEET', sheet), 
    new TilesImageConfig('GRID', grid)
];

window.selectTile = (img) => {
    window.selectedTileName = img.dataset.name;
}

window.executeAction = (code) => {
    console.log(code);
    switch(code) {
        case "ArrowRight":
            window.serviceMap.viewport.x +=1;
            window.serviceMap.renderMap(window.currentMap);
            break;
        case "ArrowLeft":
            window.serviceMap.viewport.x -=1;
            window.serviceMap.renderMap(window.currentMap);
            break;
        case "ArrowUp":
            window.serviceMap.viewport.y -=1;
            window.serviceMap.renderMap(window.currentMap);
            break;
        case "ArrowDown":
            window.serviceMap.viewport.y +=1;
            window.serviceMap.renderMap(window.currentMap);
            break;
        case "Enter":
            console.log("ENTER");
            break;
        case "SaveMap":
            if (window.currentMap.loaded) {
                window.currentMap.saveMap();
            } 
            break;
        case "LoadMap":
                window.currentMap.loadMap();
                window.serviceMap.renderMap(window.currentMap);
                window.currentMap.loaded = true;
            break;
    }
}

new TilesetService().loadTilesImages(tilesImageSources, (serviceTiles) => {

    const canvas = document.querySelector('#canvasMap');
    const ctx = canvas.getContext("2d");
    window.serviceMap = new MapRenderService(ctx, serviceTiles, new MapViewport(5,5,10,10));

    // init and display empty map 
    window.currentMap = new CustomMap(50,50);
    for (let cptX = 0; cptX<=50; cptX++) {
        for (let cptY = 0; cptY<=50; cptY++) {
            window.currentMap.addTileToMap(cptX, cptY, "GRID:0:0");
        }
    }
    window.serviceMap.renderMap(window.currentMap);

    // clic on map
    canvas.addEventListener("click", (event) => {
        if (window.selectedTileName) {
            const mapClicCoordinates = window.serviceMap.getMapCoordinate(event.offsetX, event.offsetY);
            window.currentMap.addTileToMap(mapClicCoordinates.x, mapClicCoordinates.y, window.selectedTileName);
            window.serviceMap.renderMap(window.currentMap);
        }
    });

    window.addEventListener("keydown", (event) => {
        window.executeAction(event.code);
    });

    // update tile list for selection 
    const divTilesList = document.querySelector('#divTilesList');
    let html = "";
    let cptCol = 0;
    html += "<span>SHEET</span>";
    html += "<table>";
    html += "<tr>";
    serviceTiles.getTilesList('SHEET').forEach((tile) => {
        html += "<td>";
        html += "<img src='" + tile.url + "' onclick='selectTile(this)' data-name='" + tile.name + "'></img>";
        html += "</td>";
        cptCol++;
        if (cptCol==3) {
            html += "</tr>";
            html += "<tr>";
            cptCol = 0;
        }
    });
    html += "</tr>";
    html += "</table>";
    divTilesList.innerHTML = html;

    const divActions = document.querySelector('#divActions');
    html = "";
    html += "<button class='btnAction' onclick='window.executeAction(\"LoadMap\")'>&#128229;</button>";
    html += "<button class='btnAction' onclick='window.executeAction(\"ArrowUp\")'>&#129033;</button>";
    html += "<button class='btnAction' onclick='window.executeAction(\"SaveMap\")'>&#128228;</button><br/>";
    html += "<button class='btnAction' onclick='window.executeAction(\"ArrowLeft\")'>&#129032;</button>";
    html += "<button class='btnAction' onclick='window.executeAction(\"ArrowDown\")'>&#129035;</button>";
    html += "<button class='btnAction' onclick='window.executeAction(\"ArrowRight\")'>&#129034;</button><br/>";
    divActions.innerHTML = html;
});





