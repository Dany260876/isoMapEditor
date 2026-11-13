export default class HtmlService {
    constructor() {}

    static renderTileListHtml(name, serviceTiles) {
        let html = "";
        let cptCol = 0;

        html += "<table class='tblTileList' id='tblTile_" + name + "' hidden>";
        html += "<tr>";
        serviceTiles.getTilesList(name).forEach((tile) => {
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
        return html;
    }
}
