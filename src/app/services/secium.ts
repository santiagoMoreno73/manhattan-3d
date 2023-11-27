// import * as Cesium from "cesium";
import { Viewer, createWorldTerrainAsync, Cesium3DTileset } from "cesium";

export class CesiumService {
    async loadTerrain(element: any) {
        return new Viewer(element, {
            terrainProvider: await createWorldTerrainAsync(),
        });
    }

    async loadTile() {
        try {
            const tileset = await Cesium3DTileset.fromIonAssetId(75343, {});
            return tileset;
        } catch (error) {
            console.error("Error loading tileset", error);
            throw error;
        }
    }
} 