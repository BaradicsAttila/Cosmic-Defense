import { Enemy } from "./Enemy";
export class Bulett {
	Type: string;
	Bulettdiv: HTMLDivElement;
	Damage: number;
	Range: number;
	Target: Enemy | null;

	constructor(type: string, damaage: number, range: number) {
		this.Type = type;
		this.Damage = damaage;
		this.Range = range;
		this.Target = null;
		this.Bulettdiv = document.createElement("div");
		this.Bulettdiv.classList.add("bulett");
		this.Bulettdiv.classList.add(type);
	}

	Destroy(): void {
		document.querySelector(".gameArea")?.removeChild(this.Bulettdiv);
	}
}
