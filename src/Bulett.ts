import { Enemy } from "./Enemy";
import { Tower } from "./Tower";
export class Bulett {
	Type: string;
	Bulettdiv: HTMLDivElement;
	Damage: number;
	Range: number;
	Target: Enemy | null;
	Shotfrom: Tower | null;

	constructor(shotfrom:Tower) {
		this.Shotfrom = shotfrom
		this.Type = this.Shotfrom.Type;
		this.Damage = this.Shotfrom.Damage;
		this.Range = this.Shotfrom.Range;
		this.Target = null;
		this.Shotfrom = null;
		this.Bulettdiv = document.createElement("div");
		this.Bulettdiv.classList.add("bulett");
		this.Bulettdiv.classList.add(this.Type);
	}

	Destroy(): void {
		document.querySelector(".gameArea")?.removeChild(this.Bulettdiv);
	}
}
