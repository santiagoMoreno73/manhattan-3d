import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CesiumService } from './services/secium';
import { FormsModule } from '@angular/forms';
import * as Cesium from "cesium";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CesiumService],
  styleUrl: './app.component.css',
  templateUrl: './app.component.html'
})

export class AppComponent {
  private viewer!: any;
  private tileset!: any;

  @ViewChild('appSecium', { static: true }) appSecium!: ElementRef;
  @ViewChild('toolbar', { static: true }) myToolbar!: ElementRef;

  currentOption: string = "0";
  options: { name: string, id: string }[] = [
    { name: "Filter By", id: "0" },
    { name: "Color By Height", id: "1" },
    { name: "Color By Latitude", id: "2" },
    { name: "Color By Distance", id: "3" },
    { name: "Hide by Height", id: "4" },
  ];

  constructor(private cesiumService: CesiumService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.cesiumService.loadTerrain(this.appSecium.nativeElement).then((res: any) => {
      if (res) {
        this.viewer = res;
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.setPosition();
        this.loadTileOnMap();
      }
    }).catch(error => {
      console.error("error >", error)
    });
  }

  private setPosition() {
    const initialPosition = Cesium.Cartesian3.fromDegrees(
      -74.01881302800248,
      40.69114333714821,
      753
    );

    const initialOrientation = Cesium.HeadingPitchRoll.fromDegrees(
      21.27879878293835,
      -21.34390550872461,
      0.0716951918898415
    );

    this.viewer.camera.flyTo({
      destination: initialPosition,
      orientation: initialOrientation,
      endTransform: Cesium.Matrix4.IDENTITY
    })
  }

  private loadTileOnMap() {
    this.cesiumService.loadTile().then((tile: any) => {
      if (tile) {
        this.tileset = tile;
        this.viewer.scene.primitives.add(this.tileset);
      }
    }).catch(err => {
      console.log("error to load tile", err)
    })
  }

  handleChange() {
    switch (this.currentOption) {
      case "1":
        this.colorByHeight();
        break;

      case "2":
        this.colorByLatitude()
        break;

      case "3":
        this.colorByDistance();
        break;

      case "4":
        this.hideByHeight();
        break;
    }
  }

  colorByHeight() {
    this.tileset.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          ["${Height} >= 300", "rgba(45, 0, 75, 0.5)"],
          ["${Height} >= 200", "rgb(102, 71, 151)"],
          ["${Height} >= 100", "rgb(170, 162, 204)"],
          ["${Height} >= 50", "rgb(224, 226, 238)"],
          ["${Height} >= 25", "rgb(252, 230, 200)"],
          ["${Height} >= 10", "rgb(248, 176, 87)"],
          ["${Height} >= 5", "rgb(198, 106, 11)"],
          ["true", "rgb(127, 59, 8)"],
        ],
      },
    });
  }

  colorByLatitude() {
    this.tileset.style = new Cesium.Cesium3DTileStyle({
      defines: {
        latitudeRadians: "radians(${Latitude})",
      },
      color: {
        conditions: [
          ["${latitudeRadians} >= 0.7125", "color('purple')"],
          ["${latitudeRadians} >= 0.712", "color('red')"],
          ["${latitudeRadians} >= 0.7115", "color('orange')"],
          ["${latitudeRadians} >= 0.711", "color('yellow')"],
          ["${latitudeRadians} >= 0.7105", "color('lime')"],
          ["${latitudeRadians} >= 0.710", "color('cyan')"],
          ["true", "color('blue')"],
        ],
      },
    });
  }

  colorByDistance() {
    this.tileset.style = new Cesium.Cesium3DTileStyle({
      defines: {
        distance:
          "distance(vec2(radians(${Longitude}), radians(${Latitude})), vec2(-1.291777521, 0.7105706624))",
      },
      color: {
        conditions: [
          ["${distance} > 0.0012", "color('gray')"],
          [
            "${distance} > 0.0008",
            "mix(color('yellow'), color('red'), (${distance} - 0.008) / 0.0004)",
          ],
          [
            "${distance} > 0.0004",
            "mix(color('green'), color('yellow'), (${distance} - 0.0004) / 0.0004)",
          ],
          ["${distance} < 0.00001", "color('white')"],
          [
            "true",
            "mix(color('blue'), color('green'), ${distance} / 0.0004)",
          ],
        ],
      },
    });
  }

  hideByHeight() {
    this.tileset.style = new Cesium.Cesium3DTileStyle({
      show: "${Height} > 200",
    });
  }

}
