import CustomMap from './class/CustomMap.js'
import MapViewport from './class/MapViewport.js'
import TilesImageConfig from './class/TilesImageConfig.js'
import TilesetService from './service/TilesetService.js';
import MapRenderService from './service/MapRenderService.js'
import HtmlService from './service/HtmlService.js'

import './style.css';
import sheet from './assets/tiles1.png';
import sheet2 from './assets/tiles2.png';
import sheet3 from './assets/tiles3.png';
import sheet4 from './assets/tiles4.png';
import grid from './assets/grid.png';

const tilesImageSources = [ 
    new TilesImageConfig('SHEET', sheet), 
    new TilesImageConfig('SHEET2', sheet2), 
    new TilesImageConfig('SHEET3', sheet3), 
    new TilesImageConfig('SHEET4', sheet4), 
    new TilesImageConfig('GRID', grid)
];

window.selectTile = (img) => {
    window.selectedTileName = img.dataset.name;
};

window.toggleVisible = (name) => {
    document.querySelectorAll(".tblTileList").forEach((e) => {
        e.setAttribute('hidden', true);
    });
    document.querySelector("#" + name).removeAttribute('hidden');
};

window.executeAction = (code) => {
    console.log(code);
    switch(code) {
        case "ArrowRight":
            window.serviceMap.viewport.x +=1;
            break;
        case "ArrowLeft":
            window.serviceMap.viewport.x -=1;
            break;
        case "ArrowUp":
            window.serviceMap.viewport.y -=1;
            break;
        case "ArrowDown":
            window.serviceMap.viewport.y +=1;
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
                window.currentMap.loaded = true;
            break;
    }
    window.serviceMap.renderMap(window.currentMap);
}

new TilesetService().loadTilesImages(tilesImageSources, (serviceTiles) => {

    const canvas = document.querySelector('#canvasMap');
    const ctx = canvas.getContext("2d");
    window.serviceMap = new MapRenderService(ctx, serviceTiles, new MapViewport(5,5,20,20));

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
    html += "<span class='spanTabMenu' data-target='tblTile_SHEET'>SHEET</span>";
    html += "<span class='spanTabMenu' data-target='tblTile_SHEET2'>SHEET2</span>";
    html += "<span class='spanTabMenu' data-target='tblTile_SHEET3'>SHEET3</span>";
    html += "<span class='spanTabMenu' data-target='tblTile_SHEET4'>SHEET4</span>";
    divTilesList.innerHTML = html;
    divTilesList.innerHTML += HtmlService.renderTileListHtml("SHEET", serviceTiles);
    divTilesList.innerHTML += HtmlService.renderTileListHtml("SHEET2", serviceTiles);
    divTilesList.innerHTML += HtmlService.renderTileListHtml("SHEET3", serviceTiles);
    divTilesList.innerHTML += HtmlService.renderTileListHtml("SHEET4", serviceTiles);
    window.toggleVisible("tblTile_SHEET");

    document.querySelectorAll(".spanTabMenu").forEach((elt) => {
        elt.onclick = (e) => {
            window.toggleVisible(e.srcElement.dataset['target']);
        }
    });
    
    const divActions = document.querySelector('#divActions');
    html = "";
    html += "<button class='btnAction' data-action='LoadMap'>&#128229;</button>";
    html += "<button class='btnAction' data-action='ArrowUp'>&#129033;</button>";
    html += "<button class='btnAction' data-action='SaveMap'>&#128190;</button><br/>";
    html += "<button class='btnAction' data-action='ArrowLeft'>&#129032;</button>";
    html += "<button class='btnAction' data-action='ArrowDown'>&#129035;</button>";
    html += "<button class='btnAction' data-action='ArrowRight'>&#129034;</button><br/>";
    divActions.innerHTML = html;

    document.querySelectorAll(".btnAction").forEach((elt) => {
        elt.onclick = (e) => {
            window.executeAction(e.srcElement.dataset['action']);
        }
    });
});





